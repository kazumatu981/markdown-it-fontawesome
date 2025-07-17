import { type FaTagKind, type ParsedFaTag, type ParsedStackingTag, type DetectedTag, TagDetector } from './TagDetector';

export abstract class FaTagBase {
    protected readonly _detectedTag: DetectedTag;

    public get kind(): FaTagKind {
        return this._detectedTag.kind;
    }
    public get src(): string | undefined {
        return this._detectedTag.src;
    }
    constructor(detectedTag: DetectedTag) {
        this._detectedTag = detectedTag;
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

export class SimpleFaTag extends FaTagBase {
    private _icons?: string[];
    private _styles?: string[];

    public get icons(): string[] {
        if (!this._icons) {
            this._setParsed();
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this._icons!;
    }
    public get styles(): string[] {
        if (!this._styles) {
            this._setParsed();
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this._styles!;
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

export class StackingFaTag extends FaTagBase {
    private _children?: SimpleFaTag[];

    public get children(): SimpleFaTag[] {
        if (!this._children) {
            this._setParsed();
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this._children!;
    }
    public toString() {
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
