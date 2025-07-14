import MarkdownIt from 'markdown-it';
import { MarkdownItEngineBase } from './MarkdownItEngineBase';
import { type FontawesomeOption, DefaultOption } from './FontawesomeOption';
import { TagDetector, type TagDetectorOptions } from './TagDetector';

export abstract class FaTagRuleEngineBase extends MarkdownItEngineBase<FontawesomeOption> {
    protected readonly _detector: TagDetector;
    constructor(md: MarkdownIt, option?: FontawesomeOption) {
        super(md, option);
        this._detector = new TagDetector((option ?? DefaultOption) as TagDetectorOptions);
    }
}
