import {
    FaTagKind,
    DetectedSimpleTag,
    DetectedStackingTag,
    _detectSimpleTag,
    _detectStackingTag,
    DetectedFaTag
} from "./TagDetector";

abstract class FaTagBase {
    public kind: FaTagKind
    constructor(parsed: DetectedSimpleTag | DetectedStackingTag, _kind: FaTagKind) {
        this.kind = _kind;
        this._setParsed(parsed);
    }

    protected abstract _setParsed(parsed: DetectedSimpleTag | DetectedStackingTag): void;

    detectFaTag(str: string, pos: number, ignoreStyled: boolean): FaTagBase | null {
        // if not start with 0x3A(:) or 0x5B([) then returns null.
        if (str.charCodeAt(pos) !== 0x3A && str.charCodeAt(pos) !== 0x5B) {
            return null;
        }
        // slice from pos
        const source = str.slice(pos);
        // detect!
        let detected = _detectSimpleTag(source, ignoreStyled);
        if (detected !== null) {
            return new SimpleFaTag(detected.parsed)
        }
        else {
            detected = _detectStackingTag(source, ignoreStyled);
            if (detected !== null) {
                return new StackingFaTag(detected.parsed);
            }
        }
        return null;
    }

}

class SimpleFaTag extends FaTagBase {
    icons: string[] = [];
    styles: string[] = [];
    constructor(parsed: DetectedSimpleTag | DetectedStackingTag) {
        super(parsed, "simple");
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

class StackingFaTag extends FaTagBase {
    children: SimpleFaTag[] = [];
    constructor(parsed: DetectedSimpleTag | DetectedStackingTag) {
        super(parsed, "stacking");
    }
    protected _setParsed(parsed: DetectedSimpleTag | DetectedStackingTag): void {
        const detectedStackingFaTag = <DetectedStackingTag>parsed;
        this.children.push(...detectedStackingFaTag.map(item => new SimpleFaTag(item)))
    }
}