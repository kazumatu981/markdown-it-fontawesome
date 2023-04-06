import MarkdownIt from "markdown-it";
import { FaTagRuleEngine } from "./FaTagRuleEngine";
import { registerFontawesomeList } from "./FontawesomeList"
import { FontawesomeOption } from "./FontawesomeOption";

function markdownItFontawesome(md: MarkdownIt, opt?: FontawesomeOption): void {
    (new FaTagRuleEngine(md, opt)).use();
    registerFontawesomeList(md);
}

export = markdownItFontawesome;

