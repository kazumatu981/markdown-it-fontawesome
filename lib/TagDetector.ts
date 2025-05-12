// #region "Regular Expressions for Fontawesome-Tag"
const hyphenConnectedAlpha = '[a-z0-2]+(-[a-z0-2]+)*';
const faClassTag = `fa(-${hyphenConnectedAlpha})*`;
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
    stackingFaTag,
};
/**
 * The kinds of Fontawesome tags
 */
export declare type FaTagKind = 'simple' | 'stacking';
/**
 * result of detector.
 */
export interface DetectedFaTag {
    kind: FaTagKind;
    tag: string;
    parsed: DetectedSimpleTag | DetectedStackingTag;
}

export interface DetectedSimpleTag {
    faClasses: string;
    styleClasses: string | null;
}

export declare type DetectedStackingTag = DetectedSimpleTag[];

//#region "private methods."
export function _detectSimpleTag(source: string, ignoreStyled: boolean): DetectedFaTag | null {
    const result = _detectRegEx(source, faTag);
    if (result === null) {
        return null;
    }

    const isStyled = result.indexOf('{') > 0;
    if (isStyled && ignoreStyled) {
        return null;
    }

    return {
        kind: 'simple',
        tag: result,
        parsed: _parseFaTag(result),
    };
}

export function _detectStackingTag(source: string, ignoreStyled: boolean): DetectedFaTag | null {
    const result = _detectRegEx(source, stackingFaTag);
    if (result === null) {
        return null;
    }

    const isStyled = result.indexOf('{') > 0;
    if (isStyled && ignoreStyled) {
        return null;
    }
    return {
        kind: 'stacking',
        tag: result,
        parsed: _parseStackingTag(result),
    };
}

function _parseFaTag(tag: string): DetectedSimpleTag {
    // read fa classes
    const faFound = <RegExpExecArray>new RegExp(faClassesTag, 'g').exec(tag);
    // read style classes
    const styleFound = new RegExp(styleClassesTag, 'g').exec(tag);
    return {
        faClasses: faFound[0],
        styleClasses: styleFound !== null ? styleFound[0] : null,
    };
}

function _parseStackingTag(tag: string): DetectedStackingTag {
    const found: DetectedStackingTag = [];
    const regex = new RegExp(faTag, 'g');
    let fatag: RegExpExecArray | null;
    while ((fatag = regex.exec(tag)) !== null) {
        found.push(_parseFaTag(fatag[0]));
    }
    return found;
}
function _detectRegEx(source: string, pattern: string): string | null {
    const detected = new RegExp(pattern, 'g').exec(source);
    return detected?.index === 0 ? detected[0] : null;
}
//#endregion
