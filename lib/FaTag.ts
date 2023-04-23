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
    constructor(detectedFaTag: DetectedFaTag) {
        this.kind = detectedFaTag.kind;
        this._parse(detectedFaTag);
    }

    protected abstract _parse(detectFaTag: DetectedFaTag): void;

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
            return new SimpleFaTag(detected)
        }
        else {
            detected = _detectStackingTag(source, ignoreStyled);
            if (detected !== null) {
                return new StackingFaTag(detected);
            }
        }
        return null;
    }

}

class SimpleFaTag extends FaTagBase {
    icons: string[] = [];
    styles?: string[];
}

class StackingFaTag extends FaTagBase {
    children: SimpleFaTag[] = [];
    protected _parse(detectFaTag: DetectedFaTag): void {
        const detectedStackingFaTag = <DetectedStackingTag>detectFaTag;
    }
}