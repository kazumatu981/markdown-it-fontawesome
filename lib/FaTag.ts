import { type FaTagKind,
     type TagDetectorOptions,
      type DetectedTag,
      type DetectedFaTag,
      type DetectedStackingTag,
       TagDetector } from './TagDetector';

export abstract class FaTagBase {
    protected readonly _detected:DetectedTag
    constructor(detected: DetectedTag) {
        this._detected = detected;
    }

    public static detectFaTag(str: string, pos: number, options?: TagDetectorOptions): FaTagBase | null {
        // if not start with 0x3A(:) or 0x5B([) then returns null.
        if (str.charCodeAt(pos) !== 0x3a && str.charCodeAt(pos) !== 0x5b) {
            return null;
        }
        // slice from pos
        const source = str.slice(pos);
        const detector = new TagDetector(options);
        // detect!
        let detected = detector.detectFaTag(source);
        if (detected !== null) {
            return new SimpleFaTag(detected.tag, detected.parsed);
        } else {
            detected = detector.detectStackingTag(source);
            if (detected !== null) {
                return new StackingFaTag(detected.tag, detected.parsed);
            }
        }
        return null;
    }
}

export class SimpleFaTag extends FaTagBase {
    public icons: string[] = [];
    public styles: string[] = [];
    constructor(detected: DetectedTag) {
        super(detected);
        this._setParsed(<DetectedFaTag>detected.parsed);
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
    protected _setParsed(parsed: DetectedFaTag): void {
        this.icons.push(...parsed.faClasses.split(' ').filter((item) => item !== ''));
        if (parsed.styleClasses !== null) {
            this.styles.push(
                ...parsed.styleClasses
                    .split(' ')
                    .filter((item) => item != '')
                    .map((styleCalss) => styleCalss.replace('.', '')),
            );
        }
    }
}

export class StackingFaTag extends FaTagBase {
    public readonly children: SimpleFaTag[] = [];
    constructor(detected: DetectedTag) {
        super(detected);
        this._setParsed(<DetectedStackingTag>detected.parsed);
    }
    public toString() {
        const joinedChildren = this.children.map((child) => child.toString()).join(' ');
        return `[${joinedChildren}]`;
    }
    protected _setParsed(parsed: DetectedStackingTag): void {
        this.children.push(...parsed.map((item) => new SimpleFaTag(item)));
    }
}
