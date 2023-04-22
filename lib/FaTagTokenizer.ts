import StateInline from "markdown-it/lib/rules_inline/state_inline";
import { FontawesomeOption } from "./FontawesomeOption";
import { DetectedFaTag, detectFaTagPattern, FaTag, StackingFaTag } from "./TagDetector";

export abstract class FaTokenizerBase {
    _stateInline: StateInline;
    _silent: boolean;
    _detectedTag: DetectedFaTag
    constructor(stateInline: StateInline, silent: boolean, detectedTag: DetectedFaTag) {
        this._stateInline = stateInline;
        this._silent = silent;
        this._detectedTag = detectedTag;
    }
    protected _pushStackingTag(stackingTag: StackingFaTag) {
        const stackingIconTag = this._stateInline.push('fa_icon_stacking_open', 'span', 1);
        stackingIconTag.attrPush(['class', "fa-stack"]);
        for (const fatag of stackingTag) {
            this._pushFaTag(fatag);
        }
        this._stateInline.push('fa_icon_stacking_close', 'span', -1);
    }
    protected _pushFaTag(fatag: FaTag): void {
        if (fatag.styleClasses != null) {
            const iconTag = this._stateInline.push('fa_icon_style_open', 'span', 1);
            iconTag.attrPush(['class', fatag.styleClasses.replaceAll('.', '')]);
        }
        const iconTag = this._stateInline.push('fa_icon_open', 'i', 1);
        iconTag.attrPush(['class', fatag.faClasses]);
        this._stateInline.push('fa_icon_close', 'i', -1);
        if (fatag.styleClasses != null) {
            this._stateInline.push('fa_icon_style_close', 'span', -1);
        }
    }
    protected abstract _tokenize(): void;
    run() {
        this._stateInline.pos = Math.min(
            this._stateInline.posMax, this._stateInline.pos + this._detectedTag.tag.length);
        if (!this._silent) {
            this._tokenize();
        }
    }
    public static createTokenizer(
        state: StateInline, silent: boolean, option: FontawesomeOption
    ): FaTokenizerBase | null {
        const pattern = detectFaTagPattern(state.src, state.pos, option.ignoreStyled ?? false);
        var tokenizer: FaTokenizerBase | null = null;

        if (pattern != null) {
            switch (pattern.kind) {
                case "simple":
                    tokenizer = new FaTagTokenizer(state, silent, pattern);
                    break;
                case "stacking":
                    tokenizer = new StackingTokenizer(state, silent, pattern);
                    break;
            }
        }
        return tokenizer;
    }
}

export class FaTagTokenizer extends FaTokenizerBase {
    protected _tokenize(): void {
        this._pushFaTag(<FaTag>this._detectedTag.parsed);
    }
}
export class StackingTokenizer extends FaTokenizerBase {
    protected _tokenize(): void {
        this._pushStackingTag(<StackingFaTag>this._detectedTag.parsed);
    }
}