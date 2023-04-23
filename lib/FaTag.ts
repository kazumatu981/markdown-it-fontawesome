import {
    FaTagKind,
    DetectedSimpleTag,
    DetectedStackingTag,
    _detectSimpleTag,
    _detectStackingTag,
} from "./TagDetector";

export abstract class FaTagBase {
    public kind: FaTagKind;
    public src: string | null;
    constructor(src: string | null, parsed: DetectedSimpleTag | DetectedStackingTag, _kind: FaTagKind) {
        this.kind = _kind;
        this.src = src;
        this._setParsed(parsed);
    }

    protected abstract _setParsed(parsed: DetectedSimpleTag | DetectedStackingTag): void;

    public static detectFaTag(str: string, pos: number, ignoreStyled: boolean): FaTagBase | null {
        // if not start with 0x3A(:) or 0x5B([) then returns null.
        if (str.charCodeAt(pos) !== 0x3A && str.charCodeAt(pos) !== 0x5B) {
            return null;
        }
        // slice from pos
        const source = str.slice(pos);
        // detect!
        let detected = _detectSimpleTag(source, ignoreStyled);
        if (detected !== null) {
            return new SimpleFaTag(detected.tag, detected.parsed)
        }
        else {
            detected = _detectStackingTag(source, ignoreStyled);
            if (detected !== null) {
                return new StackingFaTag(detected.tag, detected.parsed);
            }
        }
        return null;
    }

}

export class SimpleFaTag extends FaTagBase {
    public readonly icons: string[] = [];
    public readonly styles: string[] = [];
    constructor(tag: string | null, parsed: DetectedSimpleTag | DetectedStackingTag) {
        super(tag, parsed, "simple");
    }
    public get hasStyle(): boolean {
        return this.styles.length !== 0;
    }
    public getIconsAsString(): string {
        return `${this.icons.join(' ')}`;
    }

    public getStylesAsString(removeComma: boolean): string {
        return removeComma ?
            `${this.styles.join(' ')}` :
            `${this.styles.map(style => '.' + style).join(' ')}`;
    }
    public toString(): string {
        const icons = this.getIconsAsString();
        const styles = this.getStylesAsString(false);
        return !this.hasStyle ?
            `:${icons}:` : `[:${icons}:]{${styles}}`;
    }
    protected _setParsed(parsed: DetectedSimpleTag | DetectedStackingTag): void {
        const detectedSimpleTag = <DetectedSimpleTag>parsed;
        this.icons.push(...detectedSimpleTag.faClasses
            .split(' ')
            .filter((item) => item !== ''));
        if (detectedSimpleTag.styleClasses !== null) {
            this.styles.push(...detectedSimpleTag.styleClasses
                .split(' ')
                .filter(item => item != '')
                .map(styleCalss => styleCalss.replace('.', '')));
        }
    }
}

export class StackingFaTag extends FaTagBase {
    public readonly children: SimpleFaTag[] = [];
    constructor(src: string | null, parsed: DetectedSimpleTag | DetectedStackingTag) {
        super(src, parsed, "stacking");
    }
    public toString() {
        const joinedChildren = this.children
            .map(child => child.toString())
            .join(' ');
        return `[${joinedChildren}]`;
    }
    protected _setParsed(parsed: DetectedSimpleTag | DetectedStackingTag): void {
        const detectedStackingFaTag = <DetectedStackingTag>parsed;
        this.children.push(...detectedStackingFaTag.map(item => new SimpleFaTag(null, item)))
    }
}