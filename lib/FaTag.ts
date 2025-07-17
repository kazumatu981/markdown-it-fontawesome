import {
    type FaTagKind,
    type ParsedFaTag,
    type ParsedStackingTag,
    type DetectedTag,
    type TagDetector,
} from './TagDetector';

/**
 * Base class for FontAwesome tags.
 * It provides common properties and methods for both simple and stacking tags.
 */
export abstract class FaTagBase {
    protected readonly _detectedTag: DetectedTag;

    /**
     * Returns the kind of the detected tag.
     * @returns The kind of the detected tag.
     */
    public get kind(): FaTagKind {
        return this._detectedTag.kind;
    }
    /**
     * Returns the detector used to detect the tag.
     * @returns The detector used to detect the tag.
     */
    public get src(): string | undefined {
        return this._detectedTag.src;
    }

    /**
     *
     * @param detectedTag The detected tag object containing the kind, parsed data, and detector.
     */
    constructor(detectedTag: DetectedTag) {
        this._detectedTag = detectedTag;
    }

    /**
     * Detects a FontAwesome tag in the given string starting from the specified position.
     * @param str The string to search for a FontAwesome tag.
     * @param pos The position in the string to start searching.
     * @param detector The tag detector used to identify FontAwesome tags.
     * @returns A FaTagBase instance if a tag is detected, otherwise null.
     */
    public static detectFaTag(str: string, pos: number, detector: TagDetector): FaTagBase | null {
        // slice from pos
        const source = str.slice(pos);
        if (!detector.mustBeAFaTag(source)) {
            return null;
        }
        // detect!
        let detected = detector.detectStackingTag(source);
        if (detected !== null) {
            return new StackingFaTag(detected);
        } else {
            detected = detector.detectFaTag(source);
            if (detected !== null) {
                return new SimpleFaTag(detected);
            }
        }
        return null;
    }
}

/**
 * Represents a simple FontAwesome tag with icons and styles.
 * It extends the FaTagBase class and provides methods to access icons and styles.
 */
export class SimpleFaTag extends FaTagBase {
    private _icons?: string[];
    private _styles?: string[];

    /**
     * Returns the icons associated with the FontAwesome tag.
     * @returns An array of icons.
     */
    public get icons(): string[] {
        if (!this._icons) {
            this._setParsed();
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this._icons!;
    }
    /**
     * Returns the styles associated with the FontAwesome tag.
     * @returns An array of styles.
     */
    public get styles(): string[] {
        if (!this._styles) {
            this._setParsed();
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this._styles!;
    }
    /**
     * Checks if the FontAwesome tag has any styles.
     * @returns True if the tag has styles, otherwise false.
     */
    public get hasStyle(): boolean {
        return this.styles.length !== 0;
    }
    /**
     * Returns the icons as a string, concatenated with spaces.
     * @returns A string of icons.
     */
    public getIconsAsString(): string {
        return `${this.icons.join(' ')}`;
    }

    /**
     * Returns the styles as a string, prefixed with a dot and concatenated with spaces.
     * @param removeComma If true, removes the comma from the styles string.
     * @returns A string of styles.
     */
    public getStylesAsString(removeComma: boolean): string {
        return removeComma ? `${this.styles.join(' ')}` : `${this.styles.map((style) => '.' + style).join(' ')}`;
    }

    /**
     * Converts the FontAwesome tag to a string representation.
     * If the tag has styles, it formats it as `[:icons:]{styles}`, otherwise as `:icons:`.
     * @returns A string representation of the FontAwesome tag.
     */
    public toString(): string {
        const icons = this.getIconsAsString();
        const styles = this.getStylesAsString(false);
        return !this.hasStyle ? `:${icons}:` : `[:${icons}:]{${styles}}`;
    }
    protected _setParsed(): void {
        if (this._icons && this._styles) {
            return; // already parsed
        } else {
            this._icons = [];
            this._styles = [];
        }
        const parsed = <ParsedFaTag>this._detectedTag.parsed;
        this._icons.push(...parsed.faClasses.split(' ').filter((item) => item !== ''));
        if (parsed.styleClasses !== null) {
            this._styles.push(
                ...parsed.styleClasses
                    .split(' ')
                    .filter((item) => item != '')
                    .map((styleClass) => styleClass.replace('.', '')),
            );
        }
    }
}

/**
 * Represents a stacking FontAwesome tag that can contain multiple simple FontAwesome tags.
 * It extends the FaTagBase class and provides methods to access its children.
 */
export class StackingFaTag extends FaTagBase {
    private _children?: SimpleFaTag[];

    /**
     * Returns the children of the stacking FontAwesome tag.
     * If the children are not parsed yet, it calls _setParsed to parse them.
     * @returns An array of SimpleFaTag instances representing the children.
     */
    public get children(): SimpleFaTag[] {
        if (!this._children) {
            this._setParsed();
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this._children!;
    }

    /**
     * Converts the stacking FontAwesome tag to a string representation.
     * It concatenates the string representations of its children, separated by spaces.
     * @returns A string representation of the stacking FontAwesome tag.
     */
    public toString(): string {
        const joinedChildren = this.children.map((child) => child.toString()).join(' ');
        return `[${joinedChildren}]`;
    }
    protected _setParsed(): void {
        const parsed = <ParsedStackingTag>this._detectedTag.parsed;
        if (this._children) {
            return; // already parsed
        } else {
            this._children = [];
            this._children.push(
                ...parsed.map(
                    (item) =>
                        new SimpleFaTag({
                            kind: 'fa',
                            parsed: item,
                            detector: this._detectedTag.detector,
                        }),
                ),
            );
        }
    }
}
