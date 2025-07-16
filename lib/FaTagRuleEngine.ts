import type { StateInline } from 'markdown-it';
import { FaTokenizerBase } from './FaTagTokenizer';
import { FaTagRuleEngineBase } from './FaTagRuleEngineBase';

/**
 * FaTagRuleEngine:
 * This class extends FaTagRuleEngineBase to implement the rule for processing Fontawesome tags.
 */
export class FaTagRuleEngine extends FaTagRuleEngineBase {
    /**
     * run method:
     * This method runs the tokenizer to process Fontawesome tags.
     * @param state passed state of the Markdown parser.
     * @param silent silent mode, if true, the tokenizer will not push tokens to the state.
     * @returns whether the rule was successfully applied or not.
     */
    public run(state: StateInline, silent: boolean): boolean {
        const result = FaTokenizerBase.createTokenizer(state, silent, this._detector)?.run() || null;
        return result !== null;
    }
    /**
     * use method:
     * This method registers the Fontawesome tag rule with the MarkdownIt instance.
     * It allows the rule to be applied during the parsing process.
     * @returns this instance for method chaining.
     */
    public use(): this {
        this._md.inline.ruler.push('fontawesome_tag', (state, silent) => {
            return this.run(state, silent);
        });
        return this;
    }
}
