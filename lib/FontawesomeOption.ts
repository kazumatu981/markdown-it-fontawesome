import { TagDetectorOptions } from "./TagDetector";

export interface FontawesomeOption  extends TagDetectorOptions{
    ignoreStyled?: boolean;
}

export const DefaultOption: FontawesomeOption = {
    ignoreStyled: false,
};
