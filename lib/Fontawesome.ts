import StateInline from "markdown-it/lib/rules_inline/state_inline";

export class fontawesomeTagParser {
    private _state: StateInline;
    private _silent: boolean;
    private _hasFontawesomeTag: boolean | null = null;
    private _startPosOfFaClasses: number = -1;
    private _endPosOfFaClasses: number = -1;

    public constructor(state: StateInline, silent: boolean) {
        this._state = state;
        this._silent = silent;
    }
    public run(): boolean {
        if (!this.hasFontawesomeTag) {
            return false;
        }
        if (!this._silent) {
            const iconTag = this._state.push('fa_icon_open', 'i', 1);
            iconTag.attrPush(['class', this.faClasses]);
            this._state.push('fa_icon_close', 'i', -1);
        }
        this._state.pos = this.endPosOfFaTag + 1;
        return true;
    }
    public get hasFontawesomeTag(): boolean {
        if (this._hasFontawesomeTag === null) {
            this._hasFontawesomeTag = this._parse();
        }
        return this._hasFontawesomeTag;
    }
    private get _tokenMatchLong(): boolean {
        return this._state.posMax - this._state.pos > 3
    }
    private get _startsWithMark(): boolean {
        // ':'
        return (this._state.src.charCodeAt(this._state.pos) === 0x3A
            // 'f'
            && this._state.src.charCodeAt(this._state.pos + 1) === 0x66
            // 'a'
            && this._state.src.charCodeAt(this._state.pos + 2) === 0x61
            // ' '
            && this._state.src.charCodeAt(this._state.pos + 3) === 0x20);

    }
    public get startPosOfFaClasses(): number {
        if (this._startPosOfFaClasses === -1) {
            this._startPosOfFaClasses = this._state.pos + 1;
        }
        return this._startPosOfFaClasses;
    }
    public get endPosOfFaClasses(): number {
        if (this._endPosOfFaClasses === -1) {
            for (var index = this.startPosOfFaClasses; index <= this._state.posMax; index++) {
                if (this._state.src.charCodeAt(index) === 0x3A) {
                    // find ':'
                    this._endPosOfFaClasses = index;
                    break;
                }
            }
        }
        return this._endPosOfFaClasses;
    }
    public get endPosOfFaTag() {
        return this.endPosOfFaClasses + 1;
    }
    public get faClasses(): string {
        return this._state.src.slice(this.startPosOfFaClasses, this.endPosOfFaClasses);
    }
    private _parse(): boolean {
        if (!(this._tokenMatchLong && this._startsWithMark)) {
            return false;
        }
        if (!(this.startPosOfFaClasses > 0 && this.endPosOfFaClasses > 0)) {
            return false;
        }
        return true;
    }
}

export function fontawesome(state: StateInline, silent: boolean): boolean {
    const parser = new fontawesomeTagParser(state, silent);
    return parser.run();
}
