import MarkdownIt from "markdown-it";
import { FaTag } from "./FaTag";
import { registerFontawesomeList } from "./FontawesomeList"
import { FontawesomeOption } from "./FontawesomeOption";

function markdownItFontawesome(md: MarkdownIt, opt?: FontawesomeOption): void {
    (new FaTag(md, opt)).use();
    registerFontawesomeList(md);
}

export = markdownItFontawesome;
