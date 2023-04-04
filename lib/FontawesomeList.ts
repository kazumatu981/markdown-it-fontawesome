import { RuleBlock } from "markdown-it/lib/parser_block"
import defaultList from "markdown-it/lib/"
import MarkdownIt from "markdown-it";
import StateBlock from "markdown-it/lib/rules_block/state_block"
import list from 'markdown-it/lib/rules_block/list';


export class FontawesomeList {

}

export function fontawesomeList(state: StateBlock, startLine: number, endLine: number, silent: boolean): boolean {
    const newTokenStartIndex = state.tokens.length;
    const ret = list(state, startLine, endLine, silent);
    if (ret) {
        if (!silent) {
            const newTokenEndIndex = state.tokens.length - 1;
            console.log("detect list");
        }
    }
    return ret;
}

export function registerFontawesomeList(md: MarkdownIt) {
    md.block.ruler.at('list', fontawesomeList, { alt: ['paragraph', 'reference', 'blockquote'] })

}