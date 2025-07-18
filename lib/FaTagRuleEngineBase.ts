import type markdownIt from 'markdown-it';
import { MarkdownItEngineBase } from './MarkdownItEngineBase';
import { type FontawesomeOption, DEFAULT_FONTAWESOME_OPTIONS } from './FontawesomeOption';
import { TagDetector, type TagDetectorOptions } from './TagDetector';

/**
 * FaTagRuleEngineBase:
 * A base class for Fontawesome tag rule engines.
 */
export abstract class FaTagRuleEngineBase extends MarkdownItEngineBase<FontawesomeOption> {
    protected readonly _detector: TagDetector;
    /**
     * Creates an instance of FaTagRuleEngineBase.
     * @param md - The MarkdownIt instance.
     * @param option - Optional Fontawesome options.
     */
    constructor(md: markdownIt, option?: FontawesomeOption) {
        super(md, option);
        this._detector = new TagDetector((option ?? DEFAULT_FONTAWESOME_OPTIONS) as TagDetectorOptions);
    }
}
