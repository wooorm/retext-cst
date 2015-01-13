'use strict';

/*
 * Dependencies.
 */

var toTextOM;

toTextOM = require('nlcst-to-textom');

/*
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
 * Transform an NLCST node into a TextOM node.
 *
 * @param {Object} TextOM - Object model.
 * @param {NLCSTNode|string} nlcst - CST node to
 *   transform.
 * @return {TextOMNode}
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
 * Transform an NLCST node into a TextOM node, and
 * run plugins on it.
 *
 * @this {Retext}
 * @param {NLCSTNode|string} nlcst - The concrete syntax tree to
 *   transform.
 * @param {Object?} options
 * @param {function(Error, Node)} done - Callback to
 *   invoke when the transformations have completed.
 * @return {Retext} - Self.
 */
function fromCST(nlcst, options, done) {
    var self,
        tree;

    self = this;

    if (!done) {
        done = options;
        options = null;
    }

    if (typeof done !== 'function') {
        throw new TypeError(
            'Illegal invocation: `' + done + '` ' +
            'is not a valid argument for ' +
            '`Retext#fromCST(value, done)`.\n' +
            'This breaking change occurred in 0.2.0, ' +
            'see GitHub for more information.'
        );
    }

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
 * Transform a TextOM node into an NLCST node.
 *
 * @this {TextOMNode}
 * @return {NLCSTNode}
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
 * Transform a TextOM node into a stringified NLCST node.
 *
 * @this {TextOMNode}
 * @param {string|number?} delimiter - When given,
 *   pretty prints the stringified object—indenting
 *   each level either with the given string or with
 *   the given number of spaces.
 * @return {string}
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

/*
 * Expose `retextCST`.
 */

module.exports = retextCST;
