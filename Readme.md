# retext-ast [![Build Status](https://travis-ci.org/wooorm/retext-ast.svg?branch=master)](https://travis-ci.org/wooorm/retext-ast) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-ast.svg)](https://coveralls.io/r/wooorm/retext-ast?branch=master)

**[retext](https://github.com/wooorm/retext "Retext")** encoding and decoding between AST and object model.

## Installation

npm:
```sh
$ npm install retext-ast
```

Component:
```sh
$ component install wooorm/retext-ast
```

Bower:
```sh
$ bower install retext-ast
```

## Usage

```js
var Retext,
    retextAST,
    fs,
    retext;

Retext = require('retext');
retextAST = require('retext-ast');
fs = require('fs');

retext = new Retext().use(retextAST);

retext.fromAST(fs.readFileSync('ast.json', 'utf8'), function (err, tree) {
    /* Handle errors. */
    if (err) {
        throw err;
    }

    /* Pretty-print each level with two spaces. */
    console.log(tree.toAST(2));
});
```

## API

### retext.fromAST(ast, done(err, tree))

```js
retext.fromAST({"type":"RootNode", "children":[
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

Parse a JSON object or string—a (parsed?) result of `Node#toAST()` or `Node#toJSON()`—into an object model.

- `ast` (`Object` or `string`): The object to parse into a TextOM tree.

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

Returns a JSON (**not** stringified) representation of a Node, which can later be passed to [`retext.fromAST()`](#retextfromastast).
The name of this method might seem a bit confusing, as it doesn't return a JSON string: See [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#toJSON_behavior) for an explanation.

#### TextOM.Node#toAST(delimiter?)

```js
retext.parse('A simple sentence.', function (err, tree) {
    tree.toAST();
    /**
     * '{"type":"RootNode","children":[{"type":"ParagraphNode","children":[{"type":"SentenceNode","children":[{"type":"WordNode","children":[{"type":"TextNode","value":"A"}]},{"type":"WhiteSpaceNode","children":[{"type":"TextNode","value":" "}]},{"type":"WordNode","children":[{"type":"TextNode","value":"simple"}]},{"type":"WhiteSpaceNode","children":[{"type":"TextNode","value":" "}]},{"type":"WordNode","children":[{"type":"TextNode","value":"sentence"}]},{"type":"PunctuationNode","children":[{"type":"TextNode","value":"."}]}]}]}]}'
     */
});

```

Returns a stringified JSON—optionally pretty printed—representation of a Node, can later be passed to [`retext.fromAST()`](#retextfromastast).

- `delimiter` (`null`, `number`, or `string`): Pretty prints the AST. Passed to `JSON.stringify` (See [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#space_argument) for docs).

## License

MIT © Titus Wormer
