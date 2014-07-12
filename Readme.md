# retext-ast [![Build Status](https://travis-ci.org/wooorm/retext-ast.svg?branch=master)](https://travis-ci.org/wooorm/retext-ast) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-ast.svg)](https://coveralls.io/r/wooorm/retext-ast?branch=master)

[![browser support](https://ci.testling.com/wooorm/retext-ast.png) ](https://ci.testling.com/wooorm/retext-ast)

See [Browser Support](#browser-support) for more information (a.k.a. don’t worry about those grey icons above).

---

**[retext](https://github.com/wooorm/retext "Retext")** encoding and decoding between AST and object model.

## Installation

NPM:
```sh
$ npm install retext-ast
```

Component.js:
```sh
$ component install wooorm/retext-ast
```

## Usage

```js
var Retext = require('retext'),
    retextAST = require('retext-ast'),
    fs = require('fs');

var root = new Retext()
    .use(retextAST)
    .fromAST(fs.readFileSync('ast.json', 'utf8'));

root.toAST(2); // Pretty-print each level with two spaces.
```

## API

### retext.fromAST(ast)

```js
var Retext = require('retext'),
    retextAST = require('retext-ast'),
    rootNode;

rootNode = new Retext()
    .use(retextAST)
    .fromAST({"type":"RootNode", "children":[
      {"type":"ParagraphNode", "children": [
        {"type":"SentenceNode", "children": [
          {"type":"WordNode", "children": [
            { "type": "TextNode", "value": "A" }
          ]},
          {"type":"WhiteSpaceNode", "children": [
            { "type": "TextNode", "value": " " }
          ]},
          {"type":"WordNode", "children": [
            { "type": "TextNode", "value": "simple" }
          ]},
          {"type":"WhiteSpaceNode", "children": [
            { "type": "TextNode", "value": " " }
          ]},
          {"type":"WordNode", "children": [
            { "type": "TextNode", "value": "sentence" }
          ]},
          {"type":"PunctuationNode", "children": [
            { "type": "TextNode", "value": "." }
          ]}
        ]}
      ]}
    ]});
/*
 * ˅ RootNode
 *    ˃ 0: ParagraphNode[1]
 *      length: 1
 *    ˃ head: ParagraphNode[1]
 *    ˃ data: {}
 *    ˃ __proto__: RootNode
 */
```

Parse a JSON object or string—a (parsed?) result of `Node#toAST()` or `Node#toJSON()`—into an object model.

- `ast` (`String` or `Object`): The object to parse into a TextOM tree.


### Extensions to TextOM

#### TextOM.Node#toJSON()

```js
var Retext = require('retext'),
    retextAST = require('retext-ast'),
    rootNode;

rootNode = new Retext()
    .use(retextAST)
    .parse('A simple sentence.');

rootNode.toJSON();
/*
 * ˅ Object
 *    ˃ children: Array[1]
 *      type: "RootNode"
 *    ˃ __proto__: Object
 */
```

Returns a JSON (**not** stringified) representation of a Node, can later be passed to [`retext.fromAST()`](#retextfromastast).
The name of this method might seem a bit confusing, as it doesn't return a JSON string: See [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#toJSON_behavior) for an explanation.

#### TextOM.Node#toAST(delimiter?)

```js
var Retext = require('retext'),
    retextAST = require('retext-ast'),
    rootNode = new Retext().use(retextAST).parse('A simple sentence.');

rootNode.toAST(); // '{"type":"RootNode","children":[{"type":"ParagraphNode","children":[{"type":"SentenceNode","children":[{"type":"WordNode","children":[{"type":"TextNode","value":"A"}]},{"type":"WhiteSpaceNode","children":[{"type":"TextNode","value":" "}]},{"type":"WordNode","children":[{"type":"TextNode","value":"simple"}]},{"type":"WhiteSpaceNode","children":[{"type":"TextNode","value":" "}]},{"type":"WordNode","children":[{"type":"TextNode","value":"sentence"}]},{"type":"PunctuationNode","children":[{"type":"TextNode","value":"."}]}]}]}]}'
```

Returns a stringified JSON—optionally pretty printed—representation of a Node, can later be passed to [`retext.fromAST()`](#retextfromastast).

- `delimiter` (`null`, `Number`, or `String`): Causes the AST to be pretty printed. Passed to `JSON.stringify` (See [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#space_argument) for docs).

## Browser Support
Pretty much every browser (available through browserstack) runs all retext-ast unit tests.

## License

  MIT
