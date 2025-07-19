# markdown-it-fontawesome

> This Project is under contstructing.
> Please not post issue for this project.

Markdown It _plugin_, by which you'll be able to use [Fontawsome](https://fontawesome.com/) icon on your Markdown.
So you can use Fontawesome icon on your documents !!
Please enjoy.

## Feature

### Simple icon

| description          | Markdown               | HTML                                                         |
| -------------------- | ---------------------- | ------------------------------------------------------------ |
| Simple icon          | `:fa fa-user:`         | `<p><i class="fa fa-user"></i></p>`                          |
| Styled icon (Short)  | `:fa fa-user:{.red}`   | `<p><span class="red"><i class="fa fa-user"></i></span></p>` |
| Styled icon (Legacy) | `[:fa fa-user:]{.red}` | `<p><span class="red"><i class="fa fa-user"></i></span></p>` |

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
- :fa-solid fa-cube: first item
- :fa-solid fa-cube: second item
- :fa-solid fa-cube: third item
```

goes to in html like this.

```html
<ul class="fa-ul">
    <li>
        <span class="fa-li"> <i class="fa-solid fa-cube"></i> first item </span>
    </li>
    <li>
        <span class="fa-li"> <i class="fa-solid fa-cube"></i> second item </span>
    </li>
    <li>
        <span class="fa-li"> <i class="fa-solid fa-cube"></i> third item </span>
    </li>
</ul>
```

## How To Use

### Install

```bash
npm install @kazumatu981/markdown-it-fontawesome
```

### import

```javascript
const MarkdownItFontawesome = require('@kazumatu981/markdown-it-fontawesome');
```

or

```javascript
import MarkdownItFontawesome from '@kazumatu981/markdown-it-fontawesome';
```

### use

```javascript
md.use(MarkdownItFontawesome.plugin, {
    // if you need, write options here.
});
```

### options

When using multiple plugins with `markdown-it`, tag conflicts may occur, causing this plugin to not work correctly.
For example, [markdown-it-mdc](https://www.npmjs.com/package/markdown-it-mdc) and this library have tag conflicts and do not work properly together.
Therefore, this library provides options to change the tag `:` used for Fontawesome icons and the tag `[]` used for stacking icons.

Specify the following properties in the `options` parameter, which is the second argument of the `use()` method in `markdown-it`.

| ---------------------------------------- | ------------------------------------- |
| `simpleFaTagStart`, `simpleFaTagEnd` | Start and end tags for a simple icon |
| `stackingFaTagStart`, `stackingFaTagEnd` | Start and end tags for stacking icons |

### Example on marp

If you want to use on Marp, please check [it](./docs/HowToUseOnMarp.md).
