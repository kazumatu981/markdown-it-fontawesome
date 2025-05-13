import type MarkdownIt from 'markdown-it';
import { type PluginWithOptions } from 'markdown-it';
import { FaTagRuleEngine } from './FaTagRuleEngine';
import { FaTagListRuleEngine } from './FaTagListRuleEngine';
import { type FontawesomeOption } from './FontawesomeOption';

export const plugin: PluginWithOptions<FontawesomeOption> = (
    md: MarkdownIt,
    opt?: FontawesomeOption,
) => {
    new FaTagRuleEngine(md, opt).use();
    new FaTagListRuleEngine(md, opt).use();
};

export * from './FontawesomeOption';
