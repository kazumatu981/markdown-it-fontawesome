import { describe } from '@jest/globals';
import type StateInline from 'markdown-it/lib/rules_inline/state_inline';
import { FaTokenizerBase } from '../../lib/FaTagTokenizer';

function _createStateMock(str: string, pos: number): StateInline {
    return {
        src: str,
        pos: pos,
    } as StateInline;
}

describe('FaTagTokenizer', () => {
    describe('createTokenizer()', () => {
        const TEST_DATA = [
            {
                description: 'simple tag case.',
                test: {
                    target: ':fa-camera:',
                    option: { ignoreStyled: false },
                },
                expected: {
                    className: 'FaTagTokenizer',
                    kind: 'simple',
                },
            },
            {
                description: 'styled tag case.',
                test: {
                    target: '[:fa-camera:]{.red}',
                    option: { ignoreStyled: false },
                },
                expected: {
                    className: 'FaTagTokenizer',
                    kind: 'simple',
                },
            },
            {
                description: 'simpleStaking tag case.',
                test: {
                    target: '[:fa-camera: :fa-camera:]',
                    option: { ignoreStyled: false },
                },
                expected: {
                    className: 'StackingTokenizer',
                    kind: 'stacking',
                },
            },
            {
                description: 'stacking tag case with style.',
                test: {
                    target: '[:fa-camera: [:fa-camera:]{.red}]',
                    option: { ignoreStyled: false },
                },
                expected: {
                    className: 'StackingTokenizer',
                    kind: 'stacking',
                },
            },
            {
                description: 'unexpected',
                test: {
                    target: '[:fa-camera: :fa-camera:{.red]',
                    option: { ignoreStyled: false },
                },
                expected: null,
            },
            {
                description: 'styled tag case(ignore style).',
                test: {
                    target: '[:fa-camera:]{.red}',
                    option: { ignoreStyled: true },
                },
                expected: null,
            },
            {
                description: 'stacking tag case(ignorestyle).',
                test: {
                    target: '[:fa-camera::fa-camera:{.red}]',
                    option: { ignoreStyled: true },
                },
                expected: null,
            },
        ];
        for (const testItem of TEST_DATA) {
            test(testItem.description, () => {
                const state = _createStateMock(testItem.test.target, 0);

                const result = FaTokenizerBase.createTokenizer(state, false, testItem.test.option);

                if (result !== null && testItem.expected !== null) {
                    expect(result.constructor.name).toEqual(testItem.expected.className);
                    expect(result._faTag.kind).toEqual(testItem.expected.kind);
                } else {
                    expect(result).toBeNull();
                    expect(testItem.expected).toBeNull();
                }
            });
        }
    });
});
