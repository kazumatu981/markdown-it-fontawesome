import MarkdownIt from "markdown-it";
import { fontawesome } from "./lib/Fontawesome";

module.exports = (md: MarkdownIt) => {
    md.inline.ruler.push('fontawesome', fontawesome);
}