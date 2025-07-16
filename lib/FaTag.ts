import { type FaTagKind, type ParsedTag, type ParsedFaTag, type ParsedStackingTag, TagDetector } from './TagDetector';

export abstract class FaTagBase {
    public readonly kind: FaTagKind;
    public readonly src: string | null;
    protected readonly _parsed: ParsedTag;
    constructor(kind: FaTagKind, parsed: ParsedTag, tag: string | null) {
        this.kind = kind;
        this._parsed = parsed;
        this.src = tag;
    }

    public static detectFaTag(str: string, pos: number, detector: TagDetector): FaTagBase | null {
        // slice from pos
        const source = str.slice(pos);
        if (!detector.mustBeAFaTag(source)) {
            return null;
        }
        // detect!
        let detected = detector.detectStackingTag(source);
        if (detected !== null) {
            return new StackingFaTag(detected.parsed, detected.tag);
        } else {
            detected = detector.detectFaTag(source);
            if (detected !== null) {
                return new SimpleFaTag(detected.parsed, detected.tag);
            }
        }
        return null;
    }
}

export class SimpleFaTag extends FaTagBase {
    public icons: string[] = [];
    public styles: string[] = [];
    constructor(parsed: ParsedTag, tag: string | null = null) {
        super('fa', parsed, tag);
        this._setParsed(<ParsedFaTag>parsed);
    }
    public get hasStyle(): boolean {
        return this.styles.length !== 0;
    }
    public getIconsAsString(): string {
        return `${this.icons.join(' ')}`;
    }

    public getStylesAsString(removeComma: boolean): string {
        return removeComma ? `${this.styles.join(' ')}` : `${this.styles.map((style) => '.' + style).join(' ')}`;
    }
    public toString(): string {
        const icons = this.getIconsAsString();
        const styles = this.getStylesAsString(false);
        return !this.hasStyle ? `:${icons}:` : `[:${icons}:]{${styles}}`;
    }
    protected _setParsed(parsed: ParsedFaTag): void {
        this.icons.push(...parsed.faClasses.split(' ').filter((item) => item !== ''));
        if (parsed.styleClasses !== null) {
            this.styles.push(
                ...parsed.styleClasses
                    .split(' ')
                    .filter((item) => item != '')
                    .map((styleClass) => styleClass.replace('.', '')),
            );
        }
    }
}

export class StackingFaTag extends FaTagBase {
    public readonly children: SimpleFaTag[] = [];
    constructor(parsed: ParsedTag, tag: string | null) {
        super('stacking-fa', parsed, tag);
        this._setParsed(<ParsedStackingTag>parsed);
    }
    public toString() {
        const joinedChildren = this.children.map((child) => child.toString()).join(' ');
        return `[${joinedChildren}]`;
    }
    protected _setParsed(parsed: ParsedStackingTag): void {
        this.children.push(...parsed.map((item) => new SimpleFaTag(item)));
    }
}
