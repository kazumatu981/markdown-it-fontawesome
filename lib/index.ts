import MarkdownIt from 'markdown-it';
import { PluginWithOptions } from 'markdown-it';
import { FaTagRuleEngine } from './FaTagRuleEngine';
import { FaTagListRuleEngine } from './FaTagListRuleEngine';
import { FontawesomeOption } from './FontawesomeOption';

export const markdownItFontawesome: PluginWithOptions<FontawesomeOption> = (
    md: MarkdownIt,
    opt?: FontawesomeOption,
) => {
    new FaTagRuleEngine(md, opt).use();
    new FaTagListRuleEngine(md, opt).use();
};

export default markdownItFontawesome;
module.exports = markdownItFontawesome;
