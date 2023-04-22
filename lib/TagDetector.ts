// #region "Regular Expressions for Fontawesome-Tag"
const hyphenConnectedAlpha = "[a-z0-2]+(-[a-z0-2]+)*"
const faClassTag = `fa(-${hyphenConnectedAlpha})*`
const faClassesTag = `${faClassTag}( +${faClassTag})*`;
const styleClassesTag = `\\.${hyphenConnectedAlpha}( +\\.${hyphenConnectedAlpha})*`;
const simpleFaTag = `:${faClassesTag}:`;
const styledFaTag = `\\[ *${simpleFaTag} *\\]\\{ *${styleClassesTag} *\\}`;
const faTag = `((${simpleFaTag})|(${styledFaTag}))`;
const simpleStackingFaTag = `\\[( *${simpleFaTag}){2,} *\\]`;
const stackingFaTag = `\\[( *${faTag}){2,} *\\]`;
// #endregion

/**
 * Regular Expression for Fontawesome-Tag
 */
export const FaTagRegEx = {
    hyphenConnectedAlpha,
    simpleFaTag,
    styledFaTag,
    faTag,
    simpleStackingFaTag,
    stackingFaTag
}
/**
 * The kinds of Fontawesome tags
 */
export declare type FaTagKind = "simple" | "styled" | "simpleStacking" | "stacking";
/**
 * result of detector.
 */
export interface DetectedFaTag {
    kind: FaTagKind,
    tag: string,
    parsed: FaTag | StackingFaTag
}

export interface FaTag {
    faClasses: string,
    styleClasses: string | null
}

export declare type StackingFaTag = FaTag[]

export function detectFaTagPattern(str: string, pos: number, ignoreStyled: boolean): DetectedFaTag | null {
    // if not start with 0x3A(:) or 0x5B([) then returns null.
    if (str.charCodeAt(pos) !== 0x3A && str.charCodeAt(pos) !== 0x5B) {
        return null;
    }
    // slice from pos
    const source = str.slice(pos);
    // detect!
    let detected = _startsWithTag(source, ignoreStyled);
    if (detected === null) {
        detected = _startsWithStacking(source, ignoreStyled);
    }
    return detected;
}

export function tagToString(tag: FaTag): string {
    if (tag.styleClasses !== null) {
        return `[:${tag.faClasses}:]{${tag.styleClasses}}`;

    } else {
        return `:${tag.faClasses}:`;
    }

}
export function addStyleClass(tag: FaTag, styleClass: string): FaTag {
    if (tag.styleClasses === null) {
        tag.styleClasses = "";
    }
    const classes = tag.styleClasses.split(" ")
        .filter(item => item !== '');
    classes.push(`.${styleClass}`);
    tag.styleClasses = classes.join(" ");
    return tag;
}
//#region "private methods."
function _startsWithTag(source: string, ignoreStyled: boolean): DetectedFaTag | null {
    const result = _startsWithRegEx(source, faTag);
    if (result !== null) {
        // this is FaTag
        if (result.indexOf('{') > 0) {
            if (!ignoreStyled) {
                return {
                    kind: "styled", tag: result,
                    parsed: _parseFaTag(result)
                };
            }
        } else {
            return {
                kind: "simple", tag: result,
                parsed: _parseFaTag(result)
            };
        }
    }
    return null;
}
function _startsWithStacking(source: string, ignoreStyled: boolean): DetectedFaTag | null {
    const result = _startsWithRegEx(source, stackingFaTag);
    if (result !== null) {
        // this is FaTag
        if (result.indexOf('{') > 0) {
            if (!ignoreStyled) {
                return {
                    kind: "stacking", tag: result,
                    parsed: _parseStackingTag(result)
                };
            }
        } else {
            return {
                kind: "simpleStacking", tag: result,
                parsed: _parseStackingTag(result)
            };
        }
    }
    return null;
}

function _parseFaTag(tag: string): FaTag {
    // read fa classes
    const faFound = <RegExpExecArray>(new RegExp(faClassesTag, "g")).exec(tag);
    // read style classes
    const styleFound = (new RegExp(styleClassesTag, "g")).exec(tag);
    if (styleFound !== null) {
        return { faClasses: faFound[0], styleClasses: styleFound[0] };
    }
    return { faClasses: faFound[0], styleClasses: null };
}

function _parseStackingTag(tag: string): StackingFaTag {
    const found: StackingFaTag = [];
    const regex = new RegExp(faTag, "g");
    var fatag: RegExpExecArray | null;
    while ((fatag = regex.exec(tag)) !== null) {
        found.push(_parseFaTag(fatag[0]));
    }
    return found;
}
function _startsWithRegEx(source: string, pattern: string): string | null {
    const detected = (new RegExp(pattern, "g")).exec(source);
    return detected?.index === 0 ? detected[0] : null;
}
//#endregion
