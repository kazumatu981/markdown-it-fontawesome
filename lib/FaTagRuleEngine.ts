import StateInline from "markdown-it/lib/rules_inline/state_inline";
import { FontawesomeOption, DefaultOption } from "./FontawesomeOption";
import { createTokenizer } from "./FaTagTokenizer";
import { MarkdownItEngineBase } from "./MarkdownItEngineBase";

export class FaTagRuleEngine extends MarkdownItEngineBase<FontawesomeOption> {

    rule(state: StateInline, silent: boolean): boolean {
        var detected = false;
        var tokenizer = createTokenizer(state, silent, this._option ?? DefaultOption);
        if (tokenizer !== null) {
            detected = true;
            tokenizer.run();
        }
        return detected;
    }
    use() {
        this._md.inline.ruler.push(
            'fontawesome_tag',
            (state, silent) => {
                return this.rule(state, silent);
            });
    }
}