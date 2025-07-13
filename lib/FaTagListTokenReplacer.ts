import type {StateBlock, Token} from 'markdown-it';
import { FaTagBase, SimpleFaTag } from './FaTag';
import { type TagDetectorOptions } from './TagDetector';

interface TokenRplaceMarker {
    start: number;
    end: number;
    listItemContents?: Token[];
}

export class FaTagListTokenReplacer {
    _state: StateBlock;
    _marker: TokenRplaceMarker;
    _options: TagDetectorOptions;
    constructor(state: StateBlock, marker: TokenRplaceMarker, options: TagDetectorOptions) {
        this._state = state;
        this._marker = marker;
        this._options = options
    }
    get isFaTagList(): boolean {
        const startToken = this._state.tokens[this._marker.start];
        if (startToken.tag !== 'ul') {
            return false;
        }
        const allStartWithFaItem = this.contents.every((item) => {
            const detected = FaTagBase.detectFaTag(item.content, 0, this._options);
            return detected?.kind === 'fa';
        });
        return allStartWithFaItem;
    }
    get contents(): Token[] {
        if (this._marker.listItemContents != null) {
            return this._marker.listItemContents;
        }

        const contents = this._state.tokens.slice(this._marker.start).filter((token) => token.type === 'inline');
        this._marker.listItemContents = contents;
        return contents;
    }
    replace() {
        if (this.isFaTagList) {
            this._addUlClass('fa-ul');
        }
    }
    _addUlClass(className: string) {
        const startToken = this._state.tokens[this._marker.start];
        if (startToken.tag === 'ul') {
            startToken.attrPush(['class', className]);
        }

        this.contents.forEach((item) => {
            const faTag = <SimpleFaTag>FaTagBase.detectFaTag(item.content, 0, this._options);
            faTag.styles.push('fa-li');
            item.content = item.content.replace(<string>faTag.src, faTag.toString());
        });
    }
}
