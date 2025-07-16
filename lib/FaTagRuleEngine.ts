import type { StateInline } from 'markdown-it';
import { FaTokenizerBase } from './FaTagTokenizer';
import { FaTagRuleEngineBase } from './FaTagRuleEngineBase';

export class FaTagRuleEngine extends FaTagRuleEngineBase {
    rule(state: StateInline, silent: boolean): boolean {
        let detected = false;
        const tokenizer = FaTokenizerBase.createTokenizer(state, silent, this._detector);
        if (tokenizer !== null) {
            detected = true;
            tokenizer.run();
        }
        return detected;
    }
    use() {
        this._md.inline.ruler.push('fontawesome_tag', (state, silent) => {
            return this.rule(state, silent);
        });
    }
}
