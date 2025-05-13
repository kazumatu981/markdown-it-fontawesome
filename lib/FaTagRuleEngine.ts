import type {StateInline} from 'markdown-it';
import { FontawesomeOption, DefaultOption } from './FontawesomeOption';
import { FaTokenizerBase } from './FaTagTokenizer';
import { MarkdownItEngineBase } from './MarkdownItEngineBase';

export class FaTagRuleEngine extends MarkdownItEngineBase<FontawesomeOption> {
    rule(state: StateInline, silent: boolean): boolean {
        let detected = false;
        const tokenizer = FaTokenizerBase.createTokenizer(state, silent, this._option ?? DefaultOption);
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
