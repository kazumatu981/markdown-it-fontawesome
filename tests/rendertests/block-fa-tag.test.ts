import { describe, test, expect } from '@jest/globals';
import { BlockFaTagTest } from './snapshot-testcases';

import MarkdownIt  from 'markdown-it';
import {plugin} from '../../lib';

function render(markdown: string): string {
    const md = new MarkdownIt();
    md.use(plugin);

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
