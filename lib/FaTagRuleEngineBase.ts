import MarkdownIt from "markdown-it";
import {
    FontawesomeOption,
    DefaultOption
} from "./FontawesomeOption";

export abstract class FaTagRuleEngineBase {
    _md: MarkdownIt;
    _option: FontawesomeOption;
    constructor(md: MarkdownIt, option: FontawesomeOption | undefined) {
        this._md = md;
        this._option = (option !== undefined) ? option : DefaultOption;
    }
}