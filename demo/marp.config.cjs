
module.exports = {
    inputDir: './',
    themeSet: './my-theme.css',
    engine: ({ marp }) => marp
        .use(require('../index'))
}