import type { StateBlock, Token } from 'markdown-it';
import { FaTagBase, type SimpleFaTag } from './FaTag';
import { type TagDetector } from './TagDetector';

interface TokenReplaceMarker {
    start: number;
    end: number;
    listItemContents?: Token[];
}

/**
 * Replaces FontAwesome tags in list items with appropriate HTML.
 * This class is used by the FaTagListRuleEngine to process list items containing FontAwesome tags.
 */
export class FaTagListTokenReplacer {
    private _state: StateBlock;
    private _marker: TokenReplaceMarker;
    private _detector: TagDetector;

    /**
     * Constructor for FaTagListTokenReplacer.
     * It initializes the state, marker, and detector used for replacing FontAwesome tags in list
     * @param state The state of the markdown-it parser containing the tokens.
     * @param marker The marker indicating the start and end of the list item tokens.
     *               It also contains a cache for list item contents to avoid re-parsing.
     * @param detector The tag detector used to identify FontAwesome tags.
     */
    constructor(state: StateBlock, marker: TokenReplaceMarker, detector: TagDetector) {
        this._state = state;
        this._marker = marker;
        this._detector = detector;
    }

    /**
     * Checks if the current list item contains FontAwesome tags.
     * If it does, it adds the 'fa-ul' class to the <ul> tag and processes the contents.
     * @returns True if the list item contains FontAwesome tags, otherwise false.
     */
    get isFaTagList(): boolean {
        const startToken = this._state.tokens[this._marker.start];
        if (startToken.tag !== 'ul') {
            return false;
        }
        const allStartWithFaItem = this.contents.every((item) => {
            const detected = FaTagBase.detectFaTag(item.content, 0, this._detector);
            return detected?.kind === 'fa';
        });
        return allStartWithFaItem;
    }

    /**
     * Returns the contents of the list item.
     * It retrieves the tokens from the start marker to the end of the list item.
     * If the contents are already cached, it returns them directly.
     * @returns An array of tokens representing the contents of the list item.
     */
    get contents(): Token[] {
        if (this._marker.listItemContents != null) {
            return this._marker.listItemContents;
        }

        const contents = this._state.tokens.slice(this._marker.start).filter((token) => token.type === 'inline');
        this._marker.listItemContents = contents;
        return contents;
    }

    /**
     * Replaces FontAwesome tags in the list item contents with appropriate HTML.
     * If the list item contains FontAwesome tags, it adds the 'fa-ul' class to the <ul> tag
     * and replaces the tags in the contents with their HTML representation.
     * @returns The instance of FaTagListTokenReplacer for method chaining.
     */
    replace(): this {
        if (this.isFaTagList) {
            this._addUlClass('fa-ul');
        }
        return this;
    }
    private _addUlClass(className: string): this {
        const startToken = this._state.tokens[this._marker.start];
        if (startToken.tag === 'ul') {
            startToken.attrPush(['class', className]);
        }

        this.contents.forEach((item) => {
            const faTag = <SimpleFaTag>FaTagBase.detectFaTag(item.content, 0, this._detector);
            faTag.styles.push('fa-li');
            item.content = item.content.replace(<string>faTag.src, faTag.toString());
        });
        return this;
    }
}
