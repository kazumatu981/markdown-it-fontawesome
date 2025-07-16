import type { TagDetectorOptions } from './TagDetector';

/**
 * FontawesomeOption:
 * Options for the Fontawesome plugin.
 * It extends TagDetectorOptions to include options for detecting Fontawesome tags.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FontawesomeOption extends TagDetectorOptions {}

/**
 * DefaultOption:
 * The default options for the Fontawesome plugin.
 * It sets ignoreStyled to false, meaning styled Fontawesome tags will not be ignored.
 */
export const DEFAULT_FONTAWESOME_OPTIONS: FontawesomeOption = {
    ignoreStyled: false,
};
