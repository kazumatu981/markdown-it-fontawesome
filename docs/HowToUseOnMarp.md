# How to Use on marp

This section introduce how to create Marp slides-deck project,
and introduce how to create Marp slides-deck server.

You can find deltail info in [here](https://marp.app/),
and you can learn about marp plugin eco-system, [here](https://marpit.marp.app/usage?id=extend-marpit-by-plugins).

## **[1st step]** Create Slides-deck project

First, for create slides-deck, you have to prepair to **Marp Project** directory.
So First, Create slides-deck project, and init npm package.

```bash
mkdir myslides
cd myslides

npm init -y
```

Secondary, Build Marp Environment.
Install [@marp-team/marp-cli](https://github.com/marp-team/marp-cli).

```bash
npm install -D @marp-team/marp-cli
```

> Off-course you can install as **global package** (like `npm install -g @marp-team/marp-cli`), or **run at-once** (like `npx`).

## **[2nd step]** Download this project and install

```bash
cd myslides
npm install -D @kazumatu981/markdown-it-fontawesome
```

## **[3rd step]** Create `marp.config.js`.

Here is the configuration file for **Marp**.

```javascript
const markdownItFontawesome = require('@kazumatu981/markdown-it-fontawesome');
module.exports = {
    inputDir: './slides',
    engine: ({ marp }) => marp.use(markdownItFontawesome.plugin),
};
```

## **[4th step]** Create your slides

On `slies` directory. you create slides-deck. like this.

    ---
    marp: true
    ---
    <style>
    @import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    </style>

    # :fa fa-user: can you use Fontawesome ?

> Please import fontawesome's open source `css` from _CDN repository_ with `<style>`.

## **[5th step]** run server

Run marp server.

```bash
marp -s -c marp.config.js
```
