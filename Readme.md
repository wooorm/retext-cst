# retext-cst [![Build Status](https://img.shields.io/travis/wooorm/retext-cst.svg?style=flat)](https://travis-ci.org/wooorm/retext-cst) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-cst.svg?style=flat)](https://coveralls.io/r/wooorm/retext-cst?branch=master)

**[retext](https://github.com/wooorm/retext "Retext")** encoding and decoding between [NL**CST**](https://github.com/wooorm/nlcst) and object model.

## Installation

npm:
```sh
$ npm install retext-cst
```

Component:
```sh
$ component install wooorm/retext-cst
```

Bower:
```sh
$ bower install retext-cst
```

## Usage

```js
var Retext = require('retext');
var cst = require('retext-cst');
var inspect = require('retext-inspect');
var fs = require('fs');

/* Read a JSON stringified NLCST document. */
var nlcst = fs.readFileSync('cst.json', 'utf8');

var retext = new Retext()
    .use(inspect)
    .use(cst);

retext.fromCST(nlcst, function (err, tree) {
    if (err) throw err;

    /*
     * Pretty-print the object model as a cst (each
     * level with two spaces).
     */

    console.log(tree.toCST(2));
});
```

## API

### retext.fromCST(cst, options?, done(err, tree))

Parse an NLCST node (stringified or JSON) into an object model.

- `cst` (`Object` or `string`): The object to parse into a TextOM tree;
- `options` (`Object`): Passed to plugins;
- `done` (`function(Error, TextOMNode)`): callback.

Let’s say we have the following (abbreviated) NCLST in a file called `cst.json`.

```json
{
  "type": "RootNode",
  "children": [
    {
      "type": "ParagraphNode",
      "children": [
        {
          "type": "SentenceNode",
          "children": [
            {
              "type": "WordNode",
              "children": [
                {
                  "type": "TextNode",
                  "value": "A"
                }
              ]
            },
            ...
            {
              "type": "PunctuationNode",
              "value": "."
            }
          ]
        }
      ]
    }
  ]
}
```

Such a file would result in the following **retext** document (note that [retext-inspect](https://github.com/wooorm/retext-inspect) is also used):

```js
retext.fromCST(theAboveJsonDocument, function (err, tree) {
    if (err) throw err;

    console.log(tree);
    /**
     * RootNode[1]
     * └─ ParagraphNode[1]
     *    └─ SentenceNode[2]
     *       ├─ WordNode[1]
     *       │  └─ TextNode: 'A'
     *       ...
     *       └─ PunctuationNode: '.'
     */
});
```

### Extensions to TextOM

#### TextOM.Node#toJSON()

```js
retext.parse('A simple sentence.', function (err, tree) {
    tree.toJSON();
    /**
     * ˅ Object
     *    ˃ children: Array[1]
     *      type: "RootNode"
     *    ˃ __proto__: Object
     */
});
```

Returns a JSON (**not** stringified) representation of a Node, which can later be passed to [`retext.fromCST()`](#retextfromcstcst).

This is just a wrapper around `Node#valueOf()`[[1](https://github.com/wooorm/textom#textomparentvalueof), [2](https://github.com/wooorm/textom#textomtextvalueof)], so it’s possible to pass nodes to [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#toJSON_behavior).

#### TextOM.Node#toCST(delimiter?)

```js
retext.parse('A simple sentence.', function (err, tree) {
    tree.toCST();
    /**
     * '{"type":"RootNode","children":[{"type":"ParagraphNode","children":[{"type":"SentenceNode","children":[{"type":"WordNode","children":[{"type":"TextNode","value":"A"}]},{"type":"WhiteSpaceNode","value":" "},{"type":"WordNode","children":[{"type":"TextNode","value":"simple"}]},{"type":"WhiteSpaceNode","value":" "},{"type":"WordNode","children":[{"type":"TextNode","value":"sentence"}]},{"type":"PunctuationNode","value":"."}]}]}]}'
     */
});

```

Returns a stringified JSON NLCST representation of a Node.

- `delimiter` (`null`, `number`, or `string`): Pretty prints the CST. Passed to [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#space_argument).

## License

MIT © Titus Wormer
