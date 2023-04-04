import MarkdownIt from "markdown-it";
// import { registerFontawesomeTag } from "./lib/Fontawesome";
import { FaTagCore } from "./lib/FaTagCore";
import { registerFontawesomeList } from "./lib/FontawesomeList"
import { FontawesomeOption } from "./FontawesomeOption";

module.exports = (md: MarkdownIt, opt: FontawesomeOption | undefined) => {
    // registerFontawesomeTag(md, opt);
    (new FaTagCore(md, opt)).use();
    registerFontawesomeList(md);
}