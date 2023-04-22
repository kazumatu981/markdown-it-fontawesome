import { describe, test, expect } from "@jest/globals";
import {
    FaTagRegEx,
    detectFaTagPattern,
    DetectedFaTag
} from "../../lib/TagDetector";

describe('TagDetector', () => {

    describe('Regular Expression Test', () => {
        interface RegExpTestExpected {
            index: number, 0: string
        }
        interface RegExpTestItem {
            test: string, expected: RegExpTestExpected | null
        }

        function RegExpTest(regex: string, testItem: RegExpTestItem) {
            const regExp = new RegExp(regex, "g");
            const actual = regExp.exec(testItem.test);
            if (actual !== null && testItem.expected !== null) {
                expect(actual.index).toEqual(testItem.expected.index);
                expect(actual[0]).toEqual(testItem.expected[0]);
            } else {
                if (testItem.expected !== null) {
                    expect(null).toEqual(testItem.expected.index);
                    expect(null).toEqual(testItem.expected[0]);
                }
            }
        }
        describe('hyphenConnectedAlpha', () => {
            const TEST_DATA = [
                { test: "aaa", expected: { index: 0, 0: "aaa" } },
                { test: "a-b", expected: { index: 0, 0: "a-b" } },
                { test: "a-b-x", expected: { index: 0, 0: "a-b-x" } },
                { test: "  a-b-x", expected: { index: 2, 0: "a-b-x" } },
                { test: "1 a-b-x", expected: { index: 0, 0: "1" } },
                { test: "-a", expected: null },
                { test: "x-", expected: null },
                { test: "123", expected: null },
                { test: "12-s", expected: null }
            ];

            for (const testItem of TEST_DATA) {
                test(`TestCase: '${testItem.test}'`, () => {
                    RegExpTest(FaTagRegEx.hyphenConnectedAlpha, testItem);
                })
            }
        });
        describe('simpleFaTag', () => {
            const TEST_DATA = [
                { test: ":fa:", expected: null },
                { test: ":fa :", expected: null },
                { test: ":fa-test:", expected: { index: 0, 0: ":fa-test:" } },
                { test: ":fa-test-x:", expected: { index: 0, 0: ":fa-test-x:" } },
                { test: ":fa-test fa-xxxxx:", expected: { index: 0, 0: ":fa-test fa-xxxxx:" } },
                { test: ":fa-test fa-xx fa-xx:", expected: { index: 0, 0: ":fa-test fa-xx fa-xx:" } },
                { test: "  :fa-test:", expected: { index: 2, 0: ":fa-test:" } },
                { test: ":ga-test:", expected: null },
                { test: ":fa-test", expected: null }
            ];
            for (const testItem of TEST_DATA) {
                test(`TestCase: '${testItem.test}'`, () => {
                    RegExpTest(FaTagRegEx.simpleFaTag, testItem);
                })
            }
        });
        describe('styledFaTag', () => {
            const TEST_DATA = [
                { test: "[:fa-test:]{.red}", expected: { index: 0, 0: "[:fa-test:]{.red}" } },
                { test: "[:fa-test fa-x:]{.red}", expected: { index: 0, 0: "[:fa-test fa-x:]{.red}" } },
                { test: "[:fa-test fa-x:]{.red .small}", expected: { index: 0, 0: "[:fa-test fa-x:]{.red .small}" } },
                { test: "[:fa-test fa-x:]{.red.small}", expected: null },
                { test: "[:xxx:]{.red}", expected: null },
                { test: "[:fa-test:] .red}", expected: null },
            ];
            for (const testItem of TEST_DATA) {
                test(`TestCase: '${testItem.test}'`, () => {
                    RegExpTest(FaTagRegEx.styledFaTag, testItem);
                })
            }
        });
        describe('faTag', () => {
            const TEST_DATA = [
                { test: ":fa :", expected: null },
                { test: ":fa-test:", expected: { index: 0, 0: ":fa-test:" } },
                { test: ":fa-test-x:", expected: { index: 0, 0: ":fa-test-x:" } },
                { test: ":fa-test fa-xxxxx:", expected: { index: 0, 0: ":fa-test fa-xxxxx:" } },
                { test: ":fa-test fa-xx fa-xx:", expected: { index: 0, 0: ":fa-test fa-xx fa-xx:" } },
                { test: "[:fa-test:]{.red}", expected: { index: 0, 0: "[:fa-test:]{.red}" } },
                { test: "[:fa-test fa-x:]{.red}", expected: { index: 0, 0: "[:fa-test fa-x:]{.red}" } },
                { test: "[:fa-test fa-x:]{.red .small}", expected: { index: 0, 0: "[:fa-test fa-x:]{.red .small}" } },
                { test: ":ga-test:", expected: null },
                { test: ":fa-test", expected: null },
                { test: "[:fa-test fa-x:]{.red.small}", expected: null },
                { test: "[:xxx:]{.red}", expected: null },
                { test: "[:fa-test:] .red}", expected: null },
            ];
            for (const testItem of TEST_DATA) {
                test(`TestCase: '${testItem.test}'`, () => {
                    RegExpTest(FaTagRegEx.faTag, testItem);
                })
            };
        });
        describe('stackingFaTag', () => {
            const TEST_DATA = [
                { test: "[:fa-test::fa-test-x:]", expected: { index: 0, 0: "[:fa-test::fa-test-x:]" } },
                { test: "[:fa-test: :fa-test-x:]", expected: { index: 0, 0: "[:fa-test: :fa-test-x:]" } },
                { test: "[:fa-test: [:fa-test:]{.red}]", expected: { index: 0, 0: "[:fa-test: [:fa-test:]{.red}]" } },
                { test: "[:fa-test: [:fa-test:]{.red]", expected: null },
                { test: "[:fa-test: [:fa-test:]{.red}", expected: null },
                { test: "[fa-test: [:fa-test:]{.red}]", expected: null },
            ];
            for (const testItem of TEST_DATA) {
                test(`TestCase: '${testItem.test}'`, () => {
                    RegExpTest(FaTagRegEx.stackingFaTag, testItem);
                })
            };
        });

    });

    describe('detectFaTagPattern', () => {
        interface TestItem { test: string, pos: number, ignoreStyled: boolean, expected: DetectedFaTag | null }
        const TEST_DATA: TestItem[] = [
            { test: ":fa-test:", pos: 0, ignoreStyled: false, expected: { kind: "simple", tag: ":fa-test:", parsed: { faClasses: "fa-test", styleClasses: null } } },
            { test: ":fa-test fa-test:", pos: 0, ignoreStyled: false, expected: { kind: "simple", tag: ":fa-test fa-test:", parsed: { faClasses: "fa-test fa-test", styleClasses: null } } },
            { test: ":fa fa-test:", pos: 0, ignoreStyled: false, expected: { kind: "simple", tag: ":fa fa-test:", parsed: { faClasses: "fa fa-test", styleClasses: null } } },
            { test: ":fa-solid fa-arrow-right fa-2x fa-pull-right fa-border:", pos: 0, ignoreStyled: false, expected: { kind: "simple", tag: ":fa-solid fa-arrow-right fa-2x fa-pull-right fa-border:", parsed: { faClasses: "fa-solid fa-arrow-right fa-2x fa-pull-right fa-border", styleClasses: null } } },
            { test: "abc:fa-test fa-test:", pos: 3, ignoreStyled: false, expected: { kind: "simple", tag: ":fa-test fa-test:", parsed: { faClasses: "fa-test fa-test", styleClasses: null } } },
            { test: "[:fa-test:]{.red}", pos: 0, ignoreStyled: false, expected: { kind: "styled", tag: "[:fa-test:]{.red}", parsed: { faClasses: "fa-test", styleClasses: ".red" } } },
            { test: "[:fa-test:]{.red}", pos: 0, ignoreStyled: true, expected: null },
            { test: "[:fa-test: :fa-testb:]", pos: 0, ignoreStyled: false, expected: { kind: "simpleStacking", tag: "[:fa-test: :fa-testb:]", parsed: [{ faClasses: "fa-test", styleClasses: null }, { faClasses: "fa-testb", styleClasses: null }] } },
            { test: "[:fa-test: [:fa-testb:]{.red}]", pos: 0, ignoreStyled: false, expected: { kind: "stacking", tag: "[:fa-test: [:fa-testb:]{.red}]", parsed: [{ faClasses: "fa-test", styleClasses: null }, { faClasses: "fa-testb", styleClasses: ".red" }] } },
            { test: "[:fa-test: [:fa-testb:]{.red}]", pos: 0, ignoreStyled: true, expected: null },
            { test: " [:fa-test: [:fa-testb:]{.red}]", pos: 0, ignoreStyled: true, expected: null },
        ];
        for (const testItem of TEST_DATA) {
            test(`Test for '${testItem.test}', expected: ${JSON.stringify(testItem.expected)}`, () => {
                const actual = detectFaTagPattern(testItem.test, testItem.pos, testItem.ignoreStyled);
                expect(actual).toEqual(testItem.expected);
            })
        }
    })
})