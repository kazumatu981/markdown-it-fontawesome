declare interface SnapShotTestCase {
    description: string;
    markdown: string;
}

export const InlineFaTagTest: SnapShotTestCase[] = [
    {
        description: "very simple tag. ':fa fa-user:'",
        markdown: ':fa-user:',
    },
    {
        description: "simple tag. ':fa fa-user:'",
        markdown: ':fa fa-user:',
    },
    {
        description: "styled tag. ':fa fa-user:{.red}'",
        markdown: ':fa fa-user:{.red}',
    },
    {
        description: "styled tag (malti style). ':fa fa-user:{.red .big}'",
        markdown: ':fa fa-user:{.red .big}',
    },
    {
        description: "stacking simple tag. '[:fa fa-yyy: :fa fa-xxx:]'",
        markdown: '[:fa fa-yyy: :fa fa-xxx:]',
    },
    {
        description: "stacking styled tag. '[:fa fa-yyy:{.red} :fa fa-xxx:{.blue}]'",
        markdown: '[:fa fa-yyy:{.red} :fa fa-xxx:{.blue}]',
    },
];

export const BlockFaTagTest: SnapShotTestCase[] = [
    {
        description: 'very simple tag in a list',
        markdown: `
* :fa-user: test001
* :fa-user: test002
* :fa-user: test003
`,
    },
    {
        description: 'styled simple tag in a list',
        markdown: `
* :fa-user:{.red} test001
* :fa-user: test002
* :fa-user: test003
`,
    },
    {
        description: 'not render for odered list.',
        markdown: `
1. :fa-user:{.red} test001
2. :fa-user: test002
3. :fa-user: test003
`,
    },
];
