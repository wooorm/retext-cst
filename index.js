'use strict';

/**
 * Define `retextAST`.
 */

function retextAST() {}

/**
 * Constants.
 */

var objectToString,
    has;

objectToString = Object.prototype.toString;
has = Object.prototype.hasOwnProperty;

/**
 * Warn when this plug-in will not work: JSON encoding
 * and decoding is required.
 */

/* istanbul ignore if */
if (!JSON) {
    throw new Error(
        'Missing JSON object for reparser'
    );
}

/**
 * Transform a concrete syntax tree into a tree constructed
 * from a given object model.
 *
 * @param {Object} TextOM - the object model.
 * @param {Object|string} cst - the concrete syntax tree to
 *   transform.
 * @return {Node} the node constructed from the
 *   CST and the object model.
 */

function fromJSON(TextOM, cst) {
    var index,
        children,
        node,
        data,
        attribute;

    if (cst instanceof String) {
        cst = cst.toString();
    }

    if (typeof cst === 'string') {
        cst = JSON.parse(cst);
    }

    if (objectToString.call(cst) !== '[object Object]') {
        throw new TypeError(
            'Illegal invocation: `' + cst + '` ' +
            'is not a valid argument for `fromAST`'
        );
    }

    if (
        !(
            has.call(cst, 'type') &&
            (
                has.call(cst, 'value') ||
                has.call(cst, 'children')
            )
        )
    ) {
        throw new TypeError(
            'Illegal invocation: `' + cst + '` ' +
            'is not a valid argument for `fromAST` (it is ' +
            'missing `type`, `value`, or `children` attributes)'
        );
    }

    node = new TextOM[cst.type]();

    if (has.call(cst, 'children')) {
        index = -1;
        children = cst.children;

        while (children[++index]) {
            node.append(fromJSON(TextOM, children[index]));
        }
    } else {
        node.fromString(cst.value);
    }

    data = cst.data;

    if (data) {
        for (attribute in data) {
            /* istanbul ignore else */
            if (has.call(data, attribute)) {
                node.data[attribute] = data[attribute];
            }
        }
    }

    return node;
}

/**
 * Transform a concrete syntax tree into a tree
 *
 * @param {Object} cst - the concrete syntax tree to
 *   transform.
 * @param {function(Error, Node)} done - Callback to
 *   invoke when the transformations have completed.
 * @this {Retext}
 * @return this
 */

function fromAST(cst, done) {
    var self;

    self = this;

    self.run(fromJSON(self.TextOM, cst), done);

    return self;
}

/**
 * Return whether `object` has keys.
 *
 * @param {Object} object
 * @return {boolean}
 */

function hasKeys(object) {
    var attribute;

    for (attribute in object) {
        /* istanbul ignore else */
        if (has.call(object, attribute)) {
            return true;
        }
    }

    return false;
}

/**
 * Transform a `node` into a concrete syntax tree.
 *
 * @this {Node}
 * @return {Object} Concrete syntax tree.
 */

function toJSON() {
    var self,
        cst,
        result,
        item;

    self = this;

    if (!self || !self.TextOM) {
        throw new TypeError(
            'Illegal invocation: `' + self + '` ' +
            'is not a valid argument for `toJSON`'
        );
    }

    cst = {};

    cst.type = self.type;

    if (!has.call(self, 'length')) {
        cst.value = self.toString();
    } else {
        result = [];
        item = self.head;

        while (item) {
            result.push(item.toJSON());
            item = item.next;
        }

        cst.children = result;
    }

    if (has.call(self, 'data') && hasKeys(self.data)) {
        cst.data = self.data;
    }

    return cst;
}

/**
 * Transform a `node` into a stringified concrete syntax tree.
 *
 * @this {Node}
 * @param {(string|number)?} delimiter - When given,
 *   pretty prints the stringified object—indenting
 *   each level either with the given string or with
 *   the given number of spaces.
 * @return {string} Stringified concrete syntax tree.
 */

function toAST(delimiter) {
    return JSON.stringify(this, null, delimiter);
}

/**
 * Define `attach`.
 *
 * @param {Retext} retext - Instance of Retext.
 */

function attach(retext) {
    var nodePrototype;

    nodePrototype = retext.TextOM.Node.prototype;

    nodePrototype.toAST = toAST;
    nodePrototype.toJSON = toJSON;
    retext.fromAST = fromAST;
}

/**
 * Expose `attach`.
 */

retextAST.attach = attach;

/**
 * Expose `toJSON`.
 */

retextAST.toJSON = toJSON;

/**
 * Expose `toAST`.
 */

retextAST.toAST = toAST;

/**
 * Expose `retextAST`.
 */

module.exports = retextAST;
