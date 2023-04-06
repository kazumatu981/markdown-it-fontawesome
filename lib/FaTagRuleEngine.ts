import MarkdownIt from "markdown-it";
import StateInline from "markdown-it/lib/rules_inline/state_inline";
import { FontawesomeOption } from "./FontawesomeOption";
import { createTokenizer } from "./FaTagTokenizer";

export class FaTagRuleEngine {
    _md: MarkdownIt;
    _option: FontawesomeOption;
    constructor(md: MarkdownIt, option: FontawesomeOption | undefined) {
        this._md = md;
        this._option = (option !== undefined) ? option : { ignoreStyled: false };
    }

    rule(state: StateInline, silent: boolean): boolean {
        var detected = false;
        var tokenizer = createTokenizer(state, silent, this._option);
        if (tokenizer !== null) {
            detected = true;
            tokenizer.run();
        }
        return detected;
    }
    use() {
        this._md.inline.ruler.push('fontawesome_tag',
            (state, silent) => {
                return this.rule(state, silent);
            });
    }
}