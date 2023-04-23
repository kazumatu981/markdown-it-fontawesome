import { describe, test, expect } from "@jest/globals";
import MarkdownIt from "markdown-it";
const markdownItFontawesome = require("../../index");

describe("fa tag render test", () => {
    function prepairMarkdownIt(opt: any): MarkdownIt {
        const md = new MarkdownIt();
        md.use(markdownItFontawesome, opt);
        return md;
    }
    test("simple tag. ':fa fa-user:'", () => {
        const test = ':fa fa-user:';
        const expected = '<p><i class="fa fa-user"></i></p>'
        const md = prepairMarkdownIt(undefined);
        const html = md.render(test);
        expect(html).toMatch(expected);
    });
    test("styled tag. '[:fa fa-user:]{.red}'", () => {
        const test = '[:fa fa-user:]{.red}';
        const expected = '<p><span class=\"red\"><i class=\"fa fa-user\"></i></span></p>'
        const md = prepairMarkdownIt(undefined);
        const html = md.render(test);
        expect(html).toMatch(expected);
    });
    test("ignore style on setted. '[:fa fa-user:]{.red}'", () => {
        const test = '[:fa fa-user:]{.red}';
        const expected = '<p>[<i class="fa fa-user"></i>]{.red}</p>'
        const md = prepairMarkdownIt({ ignoreStyled: true });
        const html = md.render(test);
        expect(html).toMatch(expected);
    });
    test("ignore style on not to set. '[:fa fa-user:]{.red}'", () => {
        const test = '[:fa fa-user:]{.red}';
        const expected = '<p><span class=\"red\"><i class=\"fa fa-user\"></i></span></p>'
        const md = prepairMarkdownIt({});
        const html = md.render(test);
        expect(html).toMatch(expected);
    });
    test("stacking simple tag. '[:fa fa-yyy: :fa fa-xxx:]'", () => {
        const test = '[:fa fa-yyy: :fa fa-xxx:]';
        const expected = '<p>'
            + '<span class="fa-stack">'
            + '<i class="fa fa-yyy"></i>'
            + '<i class="fa fa-xxx"></i>'
            + '</span>'
            + '</p>'
        const md = prepairMarkdownIt(undefined);
        const html = md.render(test);
        expect(html).toMatch(expected);
    });
    test("stacking styled tag. '[:fa fa-yyy: [:fa fa-xxx:]{.red}]'", () => {
        const test = '[:fa fa-yyy: [:fa fa-xxx:]{.red}]';
        const expected = '<p>'
            + '<span class="fa-stack">'
            + '<i class="fa fa-yyy"></i>'
            + '<span class="red"><i class="fa fa-xxx"></i></span>'
            + '</span>'
            + '</p>'
        const md = prepairMarkdownIt(undefined);
        const html = md.render(test);
        expect(html).toMatch(expected);
    });
})
