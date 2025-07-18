import { describe, test, expect } from '@jest/globals';

import { InlineFaTagTest } from './snapshot-testcases';

import markdownIt from 'markdown-it';
import {plugin} from '../../lib';

function render(markdown: string): string {
    const md = new markdownIt();
    md.use(plugin);

    return md.render(markdown);
}

describe('Inline FaTag Tests.', () => {
    InlineFaTagTest.forEach((testCase) => {
        test(testCase.description, () => {
            const actual = render(testCase.markdown);
            expect(actual).toMatchSnapshot();
        });
    });
});
