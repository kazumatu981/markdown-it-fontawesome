import StateBlock from 'markdown-it/lib/rules_block/state_block';

declare function list(state: StateBlock, startLine: number, endLine: number, silent: boolean);

export as namespace list;

export = list;
