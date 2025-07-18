import type { StateBlock, ParserBlock } from 'markdown-it';
import { FaTagListTokenReplacer } from './FaTagListTokenReplacer';
import { FaTagRuleEngineBase } from './FaTagRuleEngineBase';

/**
 * Rule engine for handling FontAwesome tags in lists.
 * It extends the FaTagRuleEngineBase class and provides a method to use the default list
 */
export class FaTagListRuleEngine extends FaTagRuleEngineBase {
    defaultListRule?: ParserBlock.RuleBlock | null;

    /**
     * Initializes the rule engine and sets up the list rule.
     * This method is called to register the list rule with the markdown-it parser.
     * @returns The instance of the FaTagListRuleEngine for method chaining.
     */
    public use(): this {
        this.defaultListRule = this._getDefaultListRule();
        this._md.block.ruler.at(
            'list',
            (state: StateBlock, startLine: number, endLine: number, silent: boolean) => {
                return this._jack(state, startLine, endLine, silent);
            },
            { alt: ['paragraph', 'reference', 'blockquote'] },
        );
        return this;
    }

    private _jack(state: StateBlock, startLine: number, endLine: number, silent: boolean): boolean {
        const newTokenStart = state.tokens.length;
        let ret = false;
        if (this.defaultListRule) {
            ret = this.defaultListRule(state, startLine, endLine, silent);
        }
        if (ret) {
            const newTokenEnd = state.tokens.length - 1;
            if (!silent) {
                const replacer = new FaTagListTokenReplacer(
                    state,
                    { start: newTokenStart, end: newTokenEnd },
                    this._detector,
                );
                replacer.replace();
            }
        }
        return ret;
    }

    private _getDefaultListRule(): ParserBlock.RuleBlock | null {
        for (const rule of this._md.block.ruler.getRules('')) {
            if (rule.name === 'list') {
                return rule;
            }
        }
        return null;
    }
}
