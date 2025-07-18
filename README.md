# markdown-it-fontawesome

> This Project is under contstructing.
> Please not post issue for this project.

Markdown It *plugin*, by which you'll be able to use [Fontawsome](https://fontawesome.com/) icon on your Markdown.
This project design for [Marp](https://marp.app/).
So you can use Fontawesome icon on your presentation !!
Please enjoy.

## Feature

### Simple icon

| description | Markdown               | HTML                                                         |
| ----------- | ---------------------- | ------------------------------------------------------------ |
| Simple icon | `:fa fa-user:`         | `<p><i class="fa fa-user"></i></p>`                          |
| Styled icon | `[:fa fa-user:]{.red}` | `<p><span class="red"><i class="fa fa-user"></i></span></p>` |

### Stacking icons

If you wrote in markdown like bellow,

```markdown
[[:fa-solid fa-camera fa-stack-1x:]{.blue} [:fa-solid fa-ban fa-stack-2x:]{.red}]
```

goes to in html like this.

```html
<p>
    <span class="fa-stack">
        <span class="blue">
            <i class="fa-solid fa-camera fa-stack-1x"></i>
        </span>
        <span class="red">
            <i class="fa-solid fa-ban fa-stack-2x"></i>
        </span>
    </span>
</p>
```

### Icons in a list

If you wrote in markdown like bellow,

```markdown
* :fa-solid fa-cube: first item
* :fa-solid fa-cube: second item
* :fa-solid fa-cube: third item
```

goes to in html like this.

```html
<ul class="fa-ul">
    <li>
        <span class="fa-li">
            <i class="fa-solid fa-cube"></i> first item
        </span>
    </li>
    <li>
        <span class="fa-li">
            <i class="fa-solid fa-cube"></i> second item
        </span>
    </li>
    <li>
        <span class="fa-li">
            <i class="fa-solid fa-cube"></i> third item
        </span>
    </li>
</ul>
```

## How To Use

Here is the how to use `markdow-it-fontawesome`.

### on marp
This section introduce how to create Marp slides-deck project,
and introduce how to create Marp slides-deck server.

You can find deltail info in [here](https://marp.app/),
and you can learn about marp plugin eco-system, [here](https://marpit.marp.app/usage?id=extend-marpit-by-plugins).

#### **[1st step]** Create Slides-deck project

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

#### **[2nd step]** Download this project and install

```bash
cd myslides
npm install -D @kazumatu981/markdown-it-fontawesome
```


#### **[3rd step]** Create `marp.config.js`.

Here is the configuration file for **Marp**.

```javascript
const markdownItFontawesome = require('@kazumatu981/markdown-it-fontawesome')
module.exports = {
    inputDir: './slides',
    engine: ({ marp }) => marp.use(markdownItFontawesome.plugin)
}
```

#### **[4th step]** Create your slides

On `slies` directory. you create slides-deck. like this.

    ---
    marp: true
    ---
    <style>
    @import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    </style>

    # :fa fa-user: can you use Fontawesome ?

> Please import fontawesome's open source `css` from *CDN repository* with `<style>`.

#### **[5th step]** run server

Run marp server.

```bash
marp -s -c marp.config.js
```
