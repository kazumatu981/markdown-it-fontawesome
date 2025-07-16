import type { StateInline } from 'markdown-it';
import type { TagDetector } from './TagDetector';
import { FaTagBase, type SimpleFaTag, type StackingFaTag } from './FaTag';

/**
 * Base class for Fontawesome tag tokenizers.
 * It provides common functionality for tokenizing Fontawesome tags.
 */
export abstract class FaTokenizerBase<T extends FaTagBase> {
    // #region "protected fields"
    protected _stateInline: StateInline;
    protected _silent: boolean;
    protected _faTag: T;
    // #endregion

    // #region "constructor"
    protected constructor(stateInline: StateInline, silent: boolean, detectedTag: T) {
        this._stateInline = stateInline;
        this._silent = silent;
        this._faTag = detectedTag;
    }
    // #endregion

    // #region "public methods"
    /**
     * Runs the tokenizer to process the Fontawesome tag.
     * It updates the position in the source string and pushes tokens to the state.
     * @returns This instance for method chaining.
     */
    public run(): this {
        this._stateInline.pos = Math.min(
            this._stateInline.posMax,
            this._stateInline.pos + (<string>this._faTag.src).length,
        );
        if (!this._silent) {
            this._tokenize();
        }
        return this;
    }
    /**
     * Detects a Fontawesome tag in the given source string and creates a tokenizer.
     * @param state - The current state of the Markdown parser.
     * @param silent - Whether the tokenizer is in silent mode.
     * @param detector - The tag detector to use for detecting Fontawesome tags.
     * @returns A FaTokenizerBase instance or null if no tag is detected.
     */
    public static createTokenizer(
        state: StateInline,
        silent: boolean,
        detector: TagDetector,
    ): FaTokenizerBase<SimpleFaTag | StackingFaTag> | null {
        const faTag = FaTagBase.detectFaTag(state.src, state.pos, detector);
        let tokenizer: FaTokenizerBase<SimpleFaTag | StackingFaTag> | null = null;

        if (faTag != null) {
            switch (faTag.kind) {
                case 'fa':
                    tokenizer = new FaTagTokenizer(state, silent, <SimpleFaTag>faTag);
                    break;
                case 'stacking-fa':
                    tokenizer = new StackingFaTagTokenizer(state, silent, <StackingFaTag>faTag);
                    break;
            }
        }
        return tokenizer;
    }

    // #endregion

    // #region "protected methods"
    protected _pushStackingTag(stackingTag: StackingFaTag): void {
        const stackingIconTag = this._stateInline.push('fa_icon_stacking_open', 'span', 1);
        stackingIconTag.attrPush(['class', 'fa-stack']);
        for (const fatag of stackingTag.children) {
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
    // #region "abstract methods"
    /**
     * Abstract method to be implemented by subclasses for tokenizing Fontawesome tags.
     * This method should handle the specific logic for tokenizing the tags.
     * @abstract
     */
    protected abstract _tokenize(): void;
    // #endregion
    // #endregion
}

/**
 * Tokenizer for simple Fontawesome tags.
 * It extends the FaTokenizerBase and implements the _tokenize method to handle simple Fontawesome tags.
 */
export class FaTagTokenizer extends FaTokenizerBase<SimpleFaTag> {
    protected _tokenize(): void {
        this._pushFaTag(this._faTag);
    }
}
/**
 * Tokenizer for stacking Fontawesome tags.
 * It extends the FaTokenizerBase and implements the _tokenize method to handle stacking Fontawesome tags.
 */
export class StackingFaTagTokenizer extends FaTokenizerBase<StackingFaTag> {
    protected _tokenize(): void {
        this._pushStackingTag(this._faTag);
    }
}
