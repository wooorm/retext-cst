'use strict';

/**
 * Dependencies.
 */

var toTextOM;

toTextOM = require('nlcst-to-textom');

/**
 * Warn when this plug-in will not work: JSON encoding
 * and decoding is required.
 */

/* istanbul ignore if */
if (!JSON) {
    throw new Error(
        'Missing `JSON` for `retext-cst`'
    );
}

/**
 * Transform a concrete syntax tree into a tree constructed
 * from a given object model.
 *
 * @param {Object} TextOM - the object model.
 * @param {Object|string} nlcst - the concrete syntax
 *   tree to transform.
 * @return {Node}
 */

function fromJSON(TextOM, nlcst) {
    var node;

    if (nlcst instanceof String) {
        nlcst = nlcst.toString();
    }

    if (typeof nlcst === 'string') {
        nlcst = JSON.parse(nlcst);
    }

    try {
        node = toTextOM(TextOM, nlcst);
    } catch (exception) {
        throw new Error(
            'Illegal invocation: `' + nlcst + '` ' +
            'is not a valid argument for `fromJSON`'
        );
    }

    return node;
}

/**
 * Transform a concrete syntax tree into a tree
 *
 * @param {Object} nlcst - the concrete syntax tree to
 *   transform.
 * @param {function(Error, Node)} done - Callback to
 *   invoke when the transformations have completed.
 * @this {Retext}
 * @return this
 */

function fromCST(nlcst, done) {
    var self,
        tree;

    self = this;

    try {
        tree = fromJSON(self.TextOM, nlcst);
    } catch (err) {
        done(err);

        return self;
    }

    self.run(tree, done);

    return self;
}

/**
 * Transform a `node` into a concrete syntax tree.
 *
 * @this {Node}
 * @return {Object} Concrete syntax tree.
 */

function toJSON() {
    var self;

    self = this;

    if (!self || !self.TextOM) {
        throw new Error(
            'Illegal invocation: `' + self + '` ' +
            'is not a valid context for `toJSON`'
        );
    }

    return self.valueOf();
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

function toCST(delimiter) {
    return JSON.stringify(this, null, delimiter);
}

/**
 * Define `retextCST`.
 *
 * @param {Retext} retext - Instance of Retext.
 */

function retextCST(retext) {
    var nodePrototype;

    nodePrototype = retext.TextOM.Node.prototype;

    nodePrototype.toCST = toCST;
    nodePrototype.toJSON = toJSON;
    retext.fromCST = fromCST;
}

/**
 * Expose `toJSON`.
 */

retextCST.toJSON = toJSON;

/**
 * Expose `toCST`.
 */

retextCST.toCST = toCST;

/**
 * Expose `retextCST`.
 */

module.exports = retextCST;
