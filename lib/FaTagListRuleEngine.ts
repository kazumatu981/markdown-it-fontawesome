import { RuleBlock } from "markdown-it/lib/parser_block"
import defaultList from "markdown-it/lib/"
import MarkdownIt from "markdown-it";
import StateBlock from "markdown-it/lib/rules_block/state_block"
import list from 'markdown-it/lib/rules_block/list';
import { FaTagRuleEngineBase } from "./FaTagRuleEngineBase";
import { FaTagListTokenReplacer } from "./FaTagListTokenReplacer";


export class FaTagListRuleEngine extends FaTagRuleEngineBase {
    jack(state: StateBlock, startLine: number, endLine: number, silent: boolean): boolean {
        const newTokenStart = state.tokens.length;
        const ret = list(state, startLine, endLine, silent);
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
        this._md.block.ruler.at(
            'list',
            (state: StateBlock, startLine: number, endLine: number, silent: boolean) => {
                return this.jack(state, startLine, endLine, silent);
            },
            { alt: ['paragraph', 'reference', 'blockquote'] });
    }
}
