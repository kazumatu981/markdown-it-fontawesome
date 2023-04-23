import StateInline from "markdown-it/lib/rules_inline/state_inline";
import { FontawesomeOption } from "./FontawesomeOption";
import { DetectedFaTag, DetectedSimpleTag, DetectedStackingTag } from "./TagDetector";
import { FaTagBase, SimpleFaTag, StackingFaTag } from './FaTag';

export abstract class FaTokenizerBase<T extends FaTagBase> {
    _stateInline: StateInline;
    _silent: boolean;
    _faTag: T
    constructor(stateInline: StateInline, silent: boolean, detectedTag: T) {
        this._stateInline = stateInline;
        this._silent = silent;
        this._faTag = detectedTag;
    }
    protected _pushStackingTag(stackingTag: DetectedStackingTag) {
        const stackingIconTag = this._stateInline.push('fa_icon_stacking_open', 'span', 1);
        stackingIconTag.attrPush(['class', "fa-stack"]);
        for (const fatag of stackingTag) {
            this._pushFaTag(fatag);
        }
        this._stateInline.push('fa_icon_stacking_close', 'span', -1);
    }
    protected _pushFaTag(fatag: SimpleFaTag): void {
        if (fatag.hasStyle) {
            const iconTag = this._stateInline.push('fa_icon_style_open', 'span', 1);
            iconTag.attrPush(['class', fatag.getStylesAsString(true)]);
        }
        const iconTag = this._stateInline.push('fa_icon_open', 'i', 1);
        iconTag.attrPush(['class', fatag.getIconsAsString()]);
        this._stateInline.push('fa_icon_close', 'i', -1);
        if (fatag.hasStyle) {
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
        const faTag = FaTagBase.detectFaTag(state.src, state.pos, option.ignoreStyled ?? false);
        var tokenizer: FaTokenizerBase | null = null;

        if (faTag != null) {
            switch (faTag.kind) {
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

export class FaTagTokenizer extends FaTokenizerBase<SimpleFaTag> {
    protected _tokenize(): void {
        this._pushFaTag(<DetectedSimpleTag>this._detectedTag.parsed);
    }
}
export class StackingTokenizer extends FaTokenizerBase<StackingFaTag> {
    protected _tokenize(): void {
        this._pushStackingTag(<DetectedStackingTag>this._detectedTag.parsed);
    }
}