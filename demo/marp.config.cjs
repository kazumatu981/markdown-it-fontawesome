const markdownItFontawesome = require('../dist/cjs');

module.exports = {
    inputDir: './',
    themeSet: './my-theme.css',
    engine: ({ marp }) => marp.use(markdownItFontawesome.default),
};
