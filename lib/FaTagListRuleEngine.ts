import type StateBlock from "markdown-it/lib/rules_block/state_block"
import type ParserBlock from "markdown-it/lib/parser_block";
import { MarkdownItEngineBase } from "./MarkdownItEngineBase";
import { FaTagListTokenReplacer } from "./FaTagListTokenReplacer";
import { FontawesomeOption } from "./FontawesomeOption";

export class FaTagListRuleEngine extends MarkdownItEngineBase<FontawesomeOption> {
    defaultListRule?: ParserBlock.RuleBlock | null;
    jack(state: StateBlock, startLine: number, endLine: number, silent: boolean): boolean {
        const newTokenStart = state.tokens.length;
        let ret = false;
        if(this.defaultListRule){
            ret = this.defaultListRule(state, startLine, endLine, silent);
        }
        if (ret) {
            const newTokenEnd = state.tokens.length - 1;
            if (!silent) {
                const replacer = new FaTagListTokenReplacer(state, { start: newTokenStart, end: newTokenEnd });
                replacer.replace();
            }
        }
        return ret;
    }

    use() {
        this.defaultListRule = this._getDefaultListRule();
        this._md.block.ruler.at(
            'list',
            (state: StateBlock, startLine: number, endLine: number, silent: boolean) => {
                return this.jack(state, startLine, endLine, silent);
            },
            { alt: ['paragraph', 'reference', 'blockquote'] });
    }

    _getDefaultListRule(): (ParserBlock.RuleBlock | null) {
        for(const rule of this._md.block.ruler.getRules('')) {
            if(rule.name === 'list') {
                return rule;
            }
        }
        return null;
    }
}
