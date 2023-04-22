import StateBlock from "markdown-it/lib/rules_block/state_block"
import list from 'markdown-it/lib/rules_block/list';
import { MarkdownItEngineBase } from "./MarkdownItEngineBase";
import { FaTagListTokenReplacer } from "./FaTagListTokenReplacer";
import { FontawesomeOption } from "./FontawesomeOption";

export class FaTagListRuleEngine extends MarkdownItEngineBase<FontawesomeOption> {
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
