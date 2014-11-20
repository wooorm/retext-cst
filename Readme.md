# retext-cst [![Build Status](https://travis-ci.org/wooorm/retext-cst.svg?branch=master)](https://travis-ci.org/wooorm/retext-cst) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-cst.svg)](https://coveralls.io/r/wooorm/retext-cst?branch=master)

**[retext](https://github.com/wooorm/retext "Retext")** encoding and decoding between CST and object model.

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
var Retext,
    retextCST,
    fs,
    retext;

Retext = require('retext');
retextCST = require('retext-cst');
fs = require('fs');

retext = new Retext().use(retextCST);

retext.fromCST(fs.readFileSync('cst.json', 'utf8'), function (err, tree) {
    /* Handle errors. */
    if (err) {
        throw err;
    }

    /* Pretty-print each level with two spaces. */
    console.log(tree.toCST(2));
});
```

## API

### retext.fromCST(cst, done(err, tree))

```js
retext.fromCST({"type":"RootNode", "children":[
  {"type":"ParagraphNode", "children": [
    {"type":"SentenceNode", "children": [
      {"type":"WordNode", "children": [
        { "type": "TextNode", "value": "A" }
      ]},
      ...
      {"type":"PunctuationNode", "children": [
        { "type": "TextNode", "value": "." }
      ]}
    ]}
  ]}
]}, console.log);
/**
 * null, ˅ RootNode
 *    ˃ 0: ParagraphNode[1]
 *      length: 1
 *    ˃ head: ParagraphNode[1]
 *    ˃ data: {}
 *    ˃ __proto__: RootNode
 */
```

Parse a JSON object or string—a (parsed?) result of `Node#toCST()` or `Node#toJSON()`—into an object model.

- `cst` (`Object` or `string`): The object to parse into a TextOM tree.

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
The name of this method might seem a bit confusing, as it doesn't return a JSON string: See [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#toJSON_behavior) for an explanation.

#### TextOM.Node#toCST(delimiter?)

```js
retext.parse('A simple sentence.', function (err, tree) {
    tree.toCST();
    /**
     * '{"type":"RootNode","children":[{"type":"ParagraphNode","children":[{"type":"SentenceNode","children":[{"type":"WordNode","children":[{"type":"TextNode","value":"A"}]},{"type":"WhiteSpaceNode","children":[{"type":"TextNode","value":" "}]},{"type":"WordNode","children":[{"type":"TextNode","value":"simple"}]},{"type":"WhiteSpaceNode","children":[{"type":"TextNode","value":" "}]},{"type":"WordNode","children":[{"type":"TextNode","value":"sentence"}]},{"type":"PunctuationNode","children":[{"type":"TextNode","value":"."}]}]}]}]}'
     */
});

```

Returns a stringified JSON—optionally pretty printed—representation of a Node, can later be passed to [`retext.fromCST()`](#retextfromcstcst).

- `delimiter` (`null`, `number`, or `string`): Pretty prints the CST. Passed to `JSON.stringify` (See [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#space_argument) for docs).

## License

MIT © Titus Wormer
