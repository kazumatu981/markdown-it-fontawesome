import StateBlock from "markdown-it/lib/rules_block/state_block"

interface TokenRplaceMarker {
    start: number,
    end: number,
    li?: number[]
}

export class FaTagListTokenReplacer {
    _state: StateBlock;
    _marker: TokenRplaceMarker;
    constructor(state: StateBlock, marker: TokenRplaceMarker) {
        this._state = state;
        this._marker = marker;
    }
    replace() {
        this._addUlClass('fa-ul');
    }
    _addUlClass(className: string) {
        const startToken = this._state.tokens[this._marker.start];
        if (startToken.tag === 'ul') {
            startToken.attrPush(['class', className]);
        }
    }
}