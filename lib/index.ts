import MarkdownIt from 'markdown-it';
import { FaTagRuleEngine } from './FaTagRuleEngine';
import { FaTagListRuleEngine } from './FaTagListRuleEngine';
import { FontawesomeOption } from './FontawesomeOption';

function markdownItFontawesome(md: MarkdownIt, opt?: FontawesomeOption): void {
    new FaTagRuleEngine(md, opt).use();
    new FaTagListRuleEngine(md, opt).use();
}

export = markdownItFontawesome;
