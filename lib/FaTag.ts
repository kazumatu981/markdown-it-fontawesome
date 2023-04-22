export declare type FaTagKind = "simple" | "stacking";

abstract class FaTagBase {
    abstract kind: FaTagKind
}

class SimpleFaTag extends FaTagBase {
    kind: FaTagKind = "simple";
    icons: string[] = [];
    styles?: string[];
}

class StackingFaTag extends FaTagBase {
    kind: FaTagKind = "stacking";
    children: SimpleFaTag[] = [];
}