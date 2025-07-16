import type markdownIt from 'markdown-it';
import { type PluginWithOptions } from 'markdown-it';
import { FaTagRuleEngine } from './FaTagRuleEngine';
import { FaTagListRuleEngine } from './FaTagListRuleEngine';
import { type FontawesomeOption } from './FontawesomeOption';

/**
 * Creates a MarkdownIt plugin that adds Fontawesome tag support.
 * This plugin allows the use of Fontawesome tags in Markdown documents.
 * @param md MarkdownIt instance
 * @param opt Optional Fontawesome options
 */
export const plugin: PluginWithOptions<FontawesomeOption> = (md: markdownIt, opt?: FontawesomeOption) => {
    new FaTagRuleEngine(md, opt).use();
    new FaTagListRuleEngine(md, opt).use();
};

export * from './FontawesomeOption';
