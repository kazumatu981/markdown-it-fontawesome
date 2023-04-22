import {
    FaTagKind,
    DetectedSimpleTag,
    DetectedStackingTag
} from "./TagDetector";

abstract class FaTagBase {
    abstract kind: FaTagKind
    detectFaTagPattern(str: string, pos: number, ignoreStyled: boolean): FaTagBase | null {
        // if not start with 0x3A(:) or 0x5B([) then returns null.
        if (str.charCodeAt(pos) !== 0x3A && str.charCodeAt(pos) !== 0x5B) {
            return null;
        }
        // slice from pos
        const source = str.slice(pos);
        // detect!
        let detected = _detectSimpleTag(source, ignoreStyled);
        if (detected === null) {
            detected = _detectStackingTag(source, ignoreStyled);
        }
        return detected;
    }

}

class SimpleFaTag extends FaTagBase {
    kind: FaTagKind = "simple";
    icons: string[] = [];
    styles?: string[];
    constructor(detected: DetectedSimpleTag) {
        super();
    }
}

class StackingFaTag extends FaTagBase {
    kind: FaTagKind = "stacking";
    children: SimpleFaTag[] = [];
}