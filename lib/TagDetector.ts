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
export declare type FaTagKind = "simple" | "stacking";
/**
 * result of detector.
 */
export interface DetectedFaTag {
    kind: FaTagKind,
    tag: string,
    parsed: DetectedSimpleTag | DetectedStackingTag
}

export interface DetectedSimpleTag {
    faClasses: string,
    styleClasses: string | null
}

export declare type DetectedStackingTag = DetectedSimpleTag[]

export function detectFaTagPattern(str: string, pos: number, ignoreStyled: boolean): DetectedFaTag | null {
    // if not start with 0x3A(:) or 0x5B([) then returns null.
    if (str.charCodeAt(pos) !== 0x3A && str.charCodeAt(pos) !== 0x5B) {
        return null;
    }
    // slice from pos
    const source = str.slice(pos);
    // detect!
    let detected = _detectSimpleTag(source, ignoreStyled);
    if (detected === null) {
        detected = _detectStackingTag(source, ignoreStyled);
    }
    return detected;
}

export function tagToString(tag: DetectedSimpleTag): string {
    if (tag.styleClasses !== null) {
        return `[:${tag.faClasses}:]{${tag.styleClasses}}`;

    } else {
        return `:${tag.faClasses}:`;
    }

}
export function addStyleClass(tag: DetectedSimpleTag, styleClass: string): DetectedSimpleTag {
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
export function _detectSimpleTag(source: string, ignoreStyled: boolean): DetectedFaTag | null {
    const result = _detectRegEx(source, faTag);
    if (result !== null) {
        // this is FaTag
        if (result.indexOf('{') > 0) {
            if (!ignoreStyled) {
                return {
                    kind: "simple", tag: result,
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
export function _detectStackingTag(source: string, ignoreStyled: boolean): DetectedFaTag | null {
    const result = _detectRegEx(source, stackingFaTag);
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
                kind: "stacking", tag: result,
                parsed: _parseStackingTag(result)
            };
        }
    }
    return null;
}

function _parseFaTag(tag: string): DetectedSimpleTag {
    // read fa classes
    const faFound = <RegExpExecArray>(new RegExp(faClassesTag, "g")).exec(tag);
    // read style classes
    const styleFound = (new RegExp(styleClassesTag, "g")).exec(tag);
    return {
        faClasses: faFound[0],
        styleClasses: styleFound !== null ?
            styleFound[0] : null
    };
}

function _parseStackingTag(tag: string): DetectedStackingTag {
    const found: DetectedStackingTag = [];
    const regex = new RegExp(faTag, "g");
    var fatag: RegExpExecArray | null;
    while ((fatag = regex.exec(tag)) !== null) {
        found.push(_parseFaTag(fatag[0]));
    }
    return found;
}
function _detectRegEx(source: string, pattern: string): string | null {
    const detected = (new RegExp(pattern, "g")).exec(source);
    return detected?.index === 0 ? detected[0] : null;
}
//#endregion
