import { describe } from '@jest/globals';
import { FaTokenizerBase } from '../../lib/FaTagTokenizer';
import { TagDetector } from '../../lib/TagDetector';
import { StateInline } from 'markdown-it/index.js';

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
                },
                expected: {
                    className: 'FaTagTokenizer',
                    kind: 'fa',
                },
            },
            {
                description: 'styled tag case.',
                test: {
                    target: ':fa-camera:{.red}',
                },
                expected: {
                    className: 'FaTagTokenizer',
                    kind: 'fa',
                },
            },
            {
                description: 'simpleStaking tag case.',
                test: {
                    target: '[:fa-camera: :fa-camera:]',
                    option: { ignoreStyled: false },
                },
                expected: {
                    className: 'StackingFaTagTokenizer',
                    kind: 'stacking-fa',
                },
            },
            {
                description: 'stacking tag case with style.',
                test: {
                    target: '[:fa-camera: :fa-camera:{.red}]',
                },
                expected: {
                    className: 'StackingFaTagTokenizer',
                    kind: 'stacking-fa',
                },
            },
            {
                description: 'unexpected',
                test: {
                    target: '[:fa-camera: :fa-camera:{.red]',
                },
                expected: null,
            },
            {
                description: 'Can custom fa start and end',
                test: {
                    target: '%fa-camera%',
                    option: {
                        simpleFaTagStart: '%',
                        simpleFaTagEnd: '%',
                    },
                },
                expected: {
                    className: 'FaTagTokenizer',
                    kind: 'fa',
                },
            },
            {
                description: 'Can custom stacking start and end',
                test: {
                    target: '|%fa fa-camera% %fa fa-camera%|',
                    option: {
                        ignoreStyled: false,
                        simpleFaTagStart: '%',
                        simpleFaTagEnd: '%',
                        stackingFaTagStart: '|',
                        stackingFaTagEnd: '|',
                    },
                },
                expected: {
                    className: 'StackingFaTagTokenizer',
                    kind: 'stacking-fa',
                },
            },
        ];
        for (const testItem of TEST_DATA) {
            test(testItem.description, () => {
                const state = _createStateMock(testItem.test.target, 0);
                const detector = new TagDetector(testItem.test.option);

                const result = FaTokenizerBase.createTokenizer(state, false, detector);

                if (result !== null && testItem.expected !== null) {
                    expect(result.constructor.name).toEqual(testItem.expected?.className);
                    expect(result['_faTag'].kind).toEqual(testItem.expected?.kind);
                } else {
                    expect(result).toBeNull();
                    expect(testItem.expected).toBeNull();
                }
            });
        }
    });
});
