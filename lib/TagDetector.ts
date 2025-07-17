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

/**
 * Options for TagDetector
 */
export interface TagDetectorOptions {
    /** ignore styled fa tags */
    ignoreStyled?: boolean;
    /** start tag for simple fa tags */
    simpleFaTagStart?: string;
    /** end tag for simple fa tags */
    simpleFaTagEnd?: string;
    /** start tag for stacking fa tags */
    stackingFaTagStart?: string;
    /** end tag for stacking fa tags */
    stackingFaTagEnd?: string;
}

/**
 * result of detector.
 */
export interface DetectedTag {
    /** kind of tag single or stacking */
    kind: FaTagKind;
    /** tag string */
    src?: string;
    /** parsed object */
    parsed: ParsedTag;
    /** detector used to detect this tag */
    detector: TagDetector;
}

/**
 * The parsed tag object.
 */
export type ParsedTag = ParsedFaTag | ParsedStackingTag;

/**
 * The kinds of Fontawesome tags
 */
export type FaTagKind = 'fa' | 'stacking-fa';

/**
 * Parsed Fontawesome tag
 */
export interface ParsedFaTag {
    /** Fontawesome classes */
    faClasses: string;
    /** Style classes, if any */
    styleClasses: string | null;
}

/**
 * Parsed stacking Fontawesome tag
 */
export type ParsedStackingTag = ParsedFaTag[];

/**
 * TagDetector:
 * Detects Fontawesome tags in a given source string.
 * It can detect both simple and stacking Fontawesome tags.
 */
export class TagDetector {
    // #region "private fields"
    private readonly _options?: TagDetectorOptions;
    // #endregion

    // #region "constructor"
    /**
     * Creates an instance of TagDetector.
     * @param options - Options for the tag detector.
     */
    public constructor(options?: TagDetectorOptions) {
        this._options = options;
    }
    // #endregion

    // #region "public properties"
    /**
     * Gets the start tag for simple Fontawesome tags.
     * @returns The start tag for simple Fontawesome tags.
     */
    public get simpleFaTagStart(): string {
        return this._options?.simpleFaTagStart ?? DEFAULT_SIMPLE_FA_TAG_START;
    }
    /**
     * Gets the end tag for simple Fontawesome tags.
     * @returns The end tag for simple Fontawesome tags.
     */
    public get simpleFaTagEnd(): string {
        return this._options?.simpleFaTagEnd ?? DEFAULT_SIMPLE_FA_TAG_END;
    }
    /**
     * Gets the start tag for stacking Fontawesome tags.
     * @returns The start tag for stacking Fontawesome tags.
     */
    public get stackingFaTagStart(): string {
        return this._options?.stackingFaTagStart ?? DEFAULT_STACKING_FA_TAG_START;
    }
    /**
     * Gets the end tag for stacking Fontawesome tags.
     * @returns The end tag for stacking Fontawesome tags.
     */
    public get stackingFaTagEnd(): string {
        return this._options?.stackingFaTagEnd ?? DEFAULT_STACKING_FA_TAG_END;
    }
    // #endregion

    // #region "public methods"
    /**
     * Checks if the given string must be a Fontawesome tag.
     * @param str - The string to check.
     * @returns True if the string must be a Fontawesome tag, otherwise false.
     */
    public mustBeAFaTag(str: string): boolean {
        return str.startsWith(this.simpleFaTagStart) || str.startsWith(this.stackingFaTagStart);
    }

    /**
     * Detects a simple Fontawesome tag in the given source string.
     * @param source - The source string to search in.
     * @returns DetectedTag if a simple Fontawesome tag is found, otherwise null.
     */
    public detectFaTag(source: string): DetectedTag | null {
        const result = this._detectRegEx(source, this._faTagPattern);
        if (result === null) {
            return null;
        }

        const isStyled = result.indexOf('{') > 0;
        if (isStyled && (this._options?.ignoreStyled ?? false)) {
            return null;
        }

        return {
            kind: 'fa',
            src: result,
            parsed: this._parseFaTag(result),
            detector: this,
        };
    }
    /**
     * Detects a stacking Fontawesome tag in the given source string.
     * @param source - The source string to search in.
     * @returns DetectedTag if a stacking Fontawesome tag is found, otherwise null.
     */
    public detectStackingTag(source: string): DetectedTag | null {
        const result = this._detectRegEx(source, this._stackingFaTagPattern);
        if (result === null) {
            return null;
        }

        const isStyled = result.indexOf('{') > 0;
        if (isStyled && (this._options?.ignoreStyled ?? false)) {
            return null;
        }
        return {
            kind: 'stacking-fa',
            src: result,
            parsed: this._parseStackingTag(result),
            detector: this,
        };
    }
    // #endregion

    // #region "non-public members"
    // #region "private properties"
    private get _faTagPattern(): string {
        return `((${this._simpleFaTagPattern})|(${this._styledFaTagPattern}))`;
    }
    private get _stackingFaTagPattern(): string {
        return `\\${this.stackingFaTagStart}( *${this._faTagPattern}){2,} *\\${this.stackingFaTagEnd}`;
    }
    private get _simpleFaTagPattern(): string {
        return `\\${this.simpleFaTagStart}${FA_CLASSES_TAG_PATTERN}\\${this.simpleFaTagEnd}`;
    }
    private get _styledFaTagPattern(): string {
        return `\\[ *${this._simpleFaTagPattern} *\\]\\{ *${STYLE_CLASSES_TAG_PATTERN} *\\}`;
    }
    // #endregion

    // #region "private methods"
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
        const regex = new RegExp(this._faTagPattern, 'g');
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
    // #endregion
    // #endregion
}
