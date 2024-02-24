import { describe, test, expect } from '@jest/globals';
import MarkdownIt from 'markdown-it';
import { BlockFaTagTest } from './snapshot-testcases';

const markdownItFontawesome = require('../../index');

function render(markdown: string): string {
    const md = new MarkdownIt();
    md.use(markdownItFontawesome);

    return md.render(markdown);
}

describe('Inline FaTag Tests.', () => {
    BlockFaTagTest.forEach((testCase) => {
        test(testCase.description, () => {
            const actual = render(testCase.markdown);
            expect(actual).toMatchSnapshot();
        });
    });
});
