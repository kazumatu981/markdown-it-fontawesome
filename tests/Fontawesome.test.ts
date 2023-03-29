import { describe, test, expect } from "@jest/globals";
import StateInline from "markdown-it/lib/rules_inline/state_inline";
import MarkdownIt from "markdown-it";
function createStateMock(str: string): StateInline {
    return new StateInline(str, new MarkdownIt(), null, []);
}
describe('test of _doesNotStartWithMark()', () => {
    [
        {
            testCase: ':fa fa-house:',
            expected: false
        },
        {
            testCase: ':f',
            expected: true
        },
        {
            testCase: 'fa fa-house:',
            expected: true
        },
        {
            testCase: ':ga fa-house:',
            expected: true
        },
        {
            testCase: ':fb fa-house:',
            expected: true
        },
        {
            testCase: ':face:',
            expected: true
        }
    ].forEach((testItem) => {
        test(`${testItem.testCase} must be ${testItem.expected}`, () => {
        })
    })
})