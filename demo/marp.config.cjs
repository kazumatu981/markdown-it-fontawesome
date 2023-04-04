
module.exports = {
    inputDir: './',
    themeSet: './my-theme.css',
    engine: ({ marp }) => marp
        .use(require('../index'))
    // .use(require('markdown-it-attrs'))
    // .use(require('markdown-it-bracketed-spans'))
    ,

    html: {
        i: ["class"],
    }
}