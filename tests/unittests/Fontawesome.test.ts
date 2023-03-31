import { describe, test, expect } from "@jest/globals";
import StateInline from "markdown-it/lib/rules_inline/state_inline";
import MarkdownIt from "markdown-it";

// test target !!!
import { FontawesomeTagParser } from "../../lib/Fontawesome";

const TEST_DATA = [
    {
        name: "normal test case1 'start with `:fa `'",
        testCase: {
            str: ':fa fa-house:',
            pos: 0
        },
        expected: {
            properties: {
                hasFontawesomeTag: true,
                startPosOfFaClasses: 1,
                endPosOfFaClasses: 11,
                endPosOfFaTag: 12,
                faClasses: "fa fa-house"
            }
        }
    },
    {
        name: "normal test case2 'start with `:fa-`'",
        testCase: {
            str: ':fa-xx-house:',
            pos: 0
        },
        expected: {
            properties: {
                hasFontawesomeTag: true,
                startPosOfFaClasses: 1,
                endPosOfFaClasses: 11,
                endPosOfFaTag: 12,
                faClasses: "fa-xx-house"
            }
        }
    },
    {
        name: "normal test case3 'intermidiate of line, start with `:fa `'",
        testCase: {
            str: 'abc :fa fa-house: abc',
            pos: 4
        },
        expected: {
            properties: {
                hasFontawesomeTag: true,
                startPosOfFaClasses: 5,
                endPosOfFaClasses: 15,
                endPosOfFaTag: 16,
                faClasses: "fa fa-house"
            }
        }
    },
    {
        name: "not too long",
        testCase: {
            str: 'fa',
            pos: 0
        },
        expected: {
            properties: {
                hasFontawesomeTag: false,
                startPosOfFaClasses: -1,
                endPosOfFaClasses: -1,
                endPosOfFaTag: -1,
                faClasses: null
            }
        }
    },
    {
        name: "not start with `:`",
        testCase: {
            str: 'fa fa-house:',
            pos: 0
        },
        expected: {
            properties: {
                hasFontawesomeTag: false,
                startPosOfFaClasses: -1,
                endPosOfFaClasses: -1,
                endPosOfFaTag: -1,
                faClasses: null
            }
        }
    },
    {
        name: "not start with `:f`",
        testCase: {
            str: ':ga fa-house:',
            pos: 0
        },
        expected: {
            properties: {
                hasFontawesomeTag: false,
                startPosOfFaClasses: -1,
                endPosOfFaClasses: -1,
                endPosOfFaTag: -1,
                faClasses: null
            }
        }
    },
    {
        name: "not start with `:fa`",
        testCase: {
            str: ':fb fa-house:',
            pos: 0
        },
        expected: {
            properties: {
                hasFontawesomeTag: false,
                startPosOfFaClasses: -1,
                endPosOfFaClasses: -1,
                endPosOfFaTag: -1,
                faClasses: null
            }
        }
    },
    {
        name: "not start with `:fa ` or `:fa-`",
        testCase: {
            str: ':fa*fa-house:',
            pos: 0
        },
        expected: {
            properties: {
                hasFontawesomeTag: false,
                startPosOfFaClasses: -1,
                endPosOfFaClasses: -1,
                endPosOfFaTag: -1,
                faClasses: null
            }
        }
    },
]

function createStateMock(str: string, pos: number): StateInline {
    const mockClass = new StateInline(str, new MarkdownIt(), null, []);
    mockClass.pos = pos;
    return mockClass;
}
describe('Test of FontawesomeTagParser', () => {

    describe('Properties Test of FontawesomeTagParser', () => {
        describe('hasFontawesomeTag', () => {
            for (const testItem of TEST_DATA) {
                test(testItem.name, () => {
                    const stateInline = createStateMock(testItem.testCase.str, testItem.testCase.pos);
                    const parser = new FontawesomeTagParser(stateInline, true);
                    expect(parser.hasFontawesomeTag).toEqual(testItem.expected.properties.hasFontawesomeTag);
                });
            }
        });
        describe('startPosOfFaClasses', () => {
            for (const testItem of TEST_DATA) {
                test(testItem.name, () => {
                    const stateInline = createStateMock(testItem.testCase.str, testItem.testCase.pos);
                    const parser = new FontawesomeTagParser(stateInline, true);
                    expect(parser.startPosOfFaClasses).toEqual(testItem.expected.properties.startPosOfFaClasses);
                });
            }
        });
        describe('endPosOfFaClasses', () => {
            for (const testItem of TEST_DATA) {
                test(testItem.name, () => {
                    const stateInline = createStateMock(testItem.testCase.str, testItem.testCase.pos);
                    const parser = new FontawesomeTagParser(stateInline, true);
                    expect(parser.endPosOfFaClasses).toEqual(testItem.expected.properties.endPosOfFaClasses);
                });
            }
        });
        describe('endPosOfFaTag', () => {
            for (const testItem of TEST_DATA) {
                test(testItem.name, () => {
                    const stateInline = createStateMock(testItem.testCase.str, testItem.testCase.pos);
                    const parser = new FontawesomeTagParser(stateInline, true);
                    expect(parser.endPosOfFaTag).toEqual(testItem.expected.properties.endPosOfFaTag);
                });
            }
        });
        describe('faClasses', () => {
            for (const testItem of TEST_DATA) {
                test(testItem.name, () => {
                    const stateInline = createStateMock(testItem.testCase.str, testItem.testCase.pos);
                    const parser = new FontawesomeTagParser(stateInline, true);
                    expect(parser.faClasses).toEqual(testItem.expected.properties.faClasses);
                });
            }
        });
    });
    describe('Test after run()', () => {
        describe('returns hasTag or not.', () => {
            for (const testItem of TEST_DATA) {
                test(testItem.name, () => {
                    const stateInline = createStateMock(testItem.testCase.str, testItem.testCase.pos);
                    const parser = new FontawesomeTagParser(stateInline, true);

                    const result = parser.run();
                    expect(result).toEqual(parser.hasFontawesomeTag);
                });
            }
        });
        describe('pos go to end of tag.', () => {
            for (const testItem of TEST_DATA) {
                test(testItem.name, () => {
                    const stateInline = createStateMock(testItem.testCase.str, testItem.testCase.pos);
                    const parser = new FontawesomeTagParser(stateInline, true);

                    parser.run();
                    expect(stateInline.pos).toEqual(parser.endPosOfFaTag + 1);
                });
            }
        });

    })
});
