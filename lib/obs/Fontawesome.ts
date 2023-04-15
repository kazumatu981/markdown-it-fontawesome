import MarkdownIt from "markdown-it";
import StateInline from "markdown-it/lib/rules_inline/state_inline";
import { FontawesomeOption } from "../FontawesomeOption";
import { detectFaTagPattern } from "../TagDetector";
/**
 * engine class
 */
export class FontawesomeTagRule {

    //#region "private storage of properties"
    private _state: StateInline;
    private _silent: boolean;
    private _hasFontawesomeTag: boolean | null = null;
    private _startPosOfFaClasses: number = -1;
    private _endPosOfFaTag: number = -1;
    // #endregion

    // #region "constructor"
    public constructor(state: StateInline, silent: boolean) {
        this._state = state;
        this._silent = silent;
    }
    // #endregion

    // #region "public propertis"
    public get hasFontawesomeTag(): boolean {
        if (this._hasFontawesomeTag === null) {
            this._hasFontawesomeTag = this._detectTag();
        }
        return this._hasFontawesomeTag;
    }
    public get startPosOfFaClasses(): number {
        if (!this.hasFontawesomeTag) {
            return -1;
        }
        return this._startPosOfFaClasses;
    }
    public get endPosOfFaClasses(): number {
        if (!this.hasFontawesomeTag) {
            return -1;
        }
        return this.endPosOfFaTag - 1;
    }
    public get endPosOfFaTag() {
        if (!this.hasFontawesomeTag) {
            return -1;
        }
        return this._endPosOfFaTag;
    }
    public get faClasses(): string | null {
        if (!this.hasFontawesomeTag) {
            return null;
        }
        return this._state.src.slice(this.startPosOfFaClasses, this.endPosOfFaClasses + 1);
    }
    // #endregion

    // #region "public method"
    public run(): boolean {
        if (!this.hasFontawesomeTag) {
            return false;
        }
        if (!this._silent) {
            const iconTag = this._state.push('fa_icon_open', 'i', 1);
            if (this.faClasses != null) {
                iconTag.attrPush(['class', this.faClasses]);
            }
            this._state.push('fa_icon_close', 'i', -1);
        }
        this._state.pos = this.endPosOfFaTag + 1;
        return true;
    }
    // #endregion

    // #region "private properties"

    private get _tokenMatchLong(): boolean {
        return this._state.posMax - this._state.pos > 3
    }

    private get _startsWithMark(): boolean {
        // ':'
        var found = (this._state.src.charCodeAt(this._state.pos) === 0x3A
            // 'f'
            && this._state.src.charCodeAt(this._state.pos + 1) === 0x66
            // 'a'
            && this._state.src.charCodeAt(this._state.pos + 2) === 0x61
            // ' ' or '-'
            && (this._state.src.charCodeAt(this._state.pos + 3) === 0x20
                || this._state.src.charCodeAt(this._state.pos + 3) === 0x2D));
        if (found) {
            this._startPosOfFaClasses = this._state.pos + 1;
        }
        return found;

    }

    private get _canFindEndOfMark(): boolean {
        var found = false;
        for (var index = this._startPosOfFaClasses; index <= this._state.posMax; index++) {
            if (this._state.src.charCodeAt(index) === 0x3A) {
                // find ':'
                found = true;
                this._endPosOfFaTag = index;
                break;
            }
        }
        return found;
    }
    // #endregion

    // #region "private method"
    private _detectTag(): boolean {
        if (!(this._tokenMatchLong && this._startsWithMark && this._canFindEndOfMark)) {
            return false;
        }
        return true;
    }
    // #endregion
}


/**
 * Entry point of this plugin-engine.
 * Decide the tag is included in current callet of markdown syntax,
 * And inprove callet to next token.
 * @param state - inline parser state
 * @param silent - parse mode (is silent or not)
 * @returns fontawesome-tag is included in current callet wether or not.
 */
export function fontawesome(state: StateInline, silent: boolean): boolean {
    return (new FontawesomeTagRule(state, silent)).run();
}

export function registerFontawesomeTag(md: MarkdownIt, opt: FontawesomeOption | undefined) {
    md.inline.ruler.push('fontawesome', fontawesome);
}
