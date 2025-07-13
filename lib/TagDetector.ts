// #region "Regular Expressions for Fontawesome-Tag"
const HYPHEN_CONNECTED_ALPHA_PATTERN = '[a-z0-2]+(-[a-z0-2]+)*';
const FA_CLASS_TAG_PATTERN = `fa(-${HYPHEN_CONNECTED_ALPHA_PATTERN})*`;
const FA_CLASSES_TAG_PATTERN = `${FA_CLASS_TAG_PATTERN}( +${FA_CLASS_TAG_PATTERN})*`;
const STYLE_CLASSES_TAG_PATTERN = `\\.${HYPHEN_CONNECTED_ALPHA_PATTERN}( +\\.${HYPHEN_CONNECTED_ALPHA_PATTERN})*`;
// #endregion

const DEFAULT_SIMPLE_FA_TAG_START = ':';
const DEFAULT_SIMPLE_FA_TAG_END = ':';
const DEFAULT_STACKING_FA_TAG_START = '[';
const DEFAULT_STACKING_FA_TAG_END = ']';


export interface TagDetectorOptions {
    ignoreStyled?: boolean;
    simpleFaTagStart?: string;
    simpleFaTagEnd?: string;
    stackingFaTagStart?: string;
    stackingFaTagEnd?: string;
}

/**
 * result of detector.
 */
export interface DetectedTag {
    /** kind of tag single or stacking */
    kind: FaTagKind;
    /** tag string */
    tag: string;
    /** parsed object */
    parsed: ParsedTag;
}

export type ParsedTag = ParsedFaTag | ParsedStackingTag

/**
 * The kinds of Fontawesome tags
 */
export type FaTagKind = 'fa' | 'stacking-fa';

export interface ParsedFaTag {
    faClasses: string;
    styleClasses: string | null;
}

export type ParsedStackingTag = ParsedFaTag[];

export class TagDetector{
    private readonly _options?: TagDetectorOptions;
    constructor(options?: TagDetectorOptions) {
        this._options = options;
    }


    private get simpleFaTagPattern() {
        return `${
            this._options?.simpleFaTagStart??DEFAULT_SIMPLE_FA_TAG_START
        }${
            FA_CLASSES_TAG_PATTERN
        }${
            this._options?.simpleFaTagEnd??DEFAULT_SIMPLE_FA_TAG_END
        }`
    }
    private get styledFaTagPattern(){
        return `\\[ *${this.simpleFaTagPattern} *\\]\\{ *${STYLE_CLASSES_TAG_PATTERN} *\\}`;
    }
    protected get faTagPattern(){
        return  `((${this.simpleFaTagPattern})|(${this.styledFaTagPattern}))`;
    }
    protected get stackingFaTagPattern(){
        return `\\${
            this._options?.stackingFaTagStart??DEFAULT_STACKING_FA_TAG_START
        }( *${this.faTagPattern}){2,} *\\${
            this._options?.stackingFaTagEnd??DEFAULT_STACKING_FA_TAG_END
        }`;  
    } 

    public detectFaTag(source: string): DetectedTag | null {
        const result = this._detectRegEx(source, this.faTagPattern);
        if (result === null) {
            return null;
        }

        const isStyled = result.indexOf('{') > 0;
        if (isStyled && (this._options?.ignoreStyled??false)) {
            return null;
        }

        return {
            kind: 'fa',
            tag: result,
            parsed: this._parseFaTag(result),
        };
    }
    public detectStackingTag(source: string): DetectedTag | null {
        const result = this._detectRegEx(source, this.stackingFaTagPattern);
        if (result === null) {
            return null;
        }

        const isStyled = result.indexOf('{') > 0;
        if (isStyled && (this._options?.ignoreStyled??false)) {
            return null;
        }
        return {
            kind: 'stacking-fa',
            tag: result,
            parsed: this._parseStackingTag(result),
        };
    }

    private _parseFaTag(tag: string): ParsedFaTag {
        // read fa classes
        const faFound = <RegExpExecArray>new RegExp(FA_CLASSES_TAG_PATTERN, 'g').exec(tag);
        // read style classes
        const styleFound = new RegExp(STYLE_CLASSES_TAG_PATTERN, 'g').exec(tag);
        return {
            faClasses: faFound[0],
            styleClasses: styleFound !== null ? styleFound[0] : null,
        };
    }

    private _parseStackingTag(tag: string): ParsedStackingTag {
        const found: ParsedStackingTag = [];
        const regex = new RegExp(this.faTagPattern, 'g');
        let fatag: RegExpExecArray | null;
        while ((fatag = regex.exec(tag)) !== null) {
            found.push(this._parseFaTag(fatag[0]));
        }
        return found;
    }

    private _detectRegEx(source: string, pattern: string): string | null {
        const detected = new RegExp(pattern, 'g').exec(source);
        return detected?.index === 0 ? detected[0] : null;
    }

}
