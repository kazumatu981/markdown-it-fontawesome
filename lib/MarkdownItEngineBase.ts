import type markdownIt from 'markdown-it';

/**
 * MarkdownItEngineBase:
 * A base class for creating MarkdownIt engines with options.
 */
export abstract class MarkdownItEngineBase<T> {
    // #region "protected properties"
    /** The MarkdownIt instance */
    protected _md: markdownIt;
    /** The options for the engine */
    protected _option?: T;
    // #endregion
    // #region "constructor"
    /**
     * Creates an instance of MarkdownItEngineBase.
     * @param md - The MarkdownIt instance.
     * @param option - Optional options for the engine.
     */
    constructor(md: markdownIt, option?: T) {
        this._md = md;
        this._option = option;
    }
    // #endregion
}
