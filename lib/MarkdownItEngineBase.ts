import MarkdownIt from 'markdown-it';

export abstract class MarkdownItEngineBase<T> {
    _md: MarkdownIt;
    _option?: T;
    constructor(md: MarkdownIt, option?: T) {
        this._md = md;
        this._option = option;
    }
}
