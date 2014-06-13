# retext-visit [![Build Status](https://travis-ci.org/wooorm/retext-visit.svg?branch=master)](https://travis-ci.org/wooorm/retext-visit) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-visit.svg)](https://coveralls.io/r/wooorm/retext-visit?branch=master)

[![browser support](https://ci.testling.com/wooorm/retext-visit.png) ](https://ci.testling.com/wooorm/retext-visit)

See [Browser Support](#browser-support) for more information (a.k.a. don’t worry about those grey icons above).

---

**[retext](https://github.com/wooorm/retext "Retext")** node visitor.

## Installation

NPM:
```sh
$ npm install retext-visit
```

Component.js:
```sh
$ component install wooorm/retext-visit
```

## Usage

```js
var Retext = require('retext'),
    visit = require('retext-visit');

var root = new Retext()
    .use(visit)
    .parse('A simple english sentence.');
```

## API

### Node#visit(callback)

```js
root.head.head.visit(function (node) {
    console.log(node.toString());
});
// 'A'
// ' '
// 'simple'
// ' '
// 'english'
// ' '
// 'sentence'
// '.'
```

Visit every node inside the operated on node.

- `callback` (`function`): The function to call with each node.

When callback return false, stops iterating.

### Node#visitType(type, callback)

```js
root.visitType(root.WORD_NODE, function (wordNode) {
    console.log(wordNode.toString());
});
// 'A'
// 'simple'
// 'english'
// 'sentence'
```

Visit every node of type `type` inside the operated on node.

- `type`: A type of a node (e.g., PARAGRAPH_NODE, WORD_NODE, or WHITE_SPACE_NODE);
- `callback` (`function`): The function to call with each node.

When callback return false, stops iterating.

## Browser Support
Pretty much every browser (available through browserstack) runs all retext-visit unit tests.

## License

  MIT
