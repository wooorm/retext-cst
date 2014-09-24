'use strict';

exports = module.exports = function () {};

/* istanbul ignore if: User forgot a polyfill much? */
if (!JSON) {
    throw new Error('Missing JSON object for reparser');
}

/**
 * `fromJSON` converts a given (stringified?) JSON AST into a node.
 *
 * @param {Object} TextOM - The TextOM to get nodes from.
 * @param {Object|String} ast - The AST to convert.
 * @return {Object} - The parsed node.
 * @global
 * @private
 */
function fromJSON(TextOM, ast) {
    var iterator = -1,
        children, node, data, attribute;

    if (ast instanceof String) {
        ast = ast.toString();
    }

    if (typeof ast === 'string') {
        ast = JSON.parse(ast);
    } else if ({}.toString.call(ast) !== '[object Object]') {
        throw new TypeError('Illegal invocation: \'' + ast +
            '\' is not a valid argument for \'fromAST\'');
    }

    if (!('type' in ast && ('value' in ast || 'children' in ast))) {
        throw new TypeError('Illegal invocation: \'' + ast +
            '\' is not a valid argument for \'fromAST\' (it\'s ' +
            'missing the `type`, and either `value` or `children` ' +
            'attributes)');
    }

    node = new TextOM[ast.type]();

    if ('children' in ast) {
        iterator = -1;
        children = ast.children;

        while (children[++iterator]) {
            node.append(fromJSON(TextOM, children[iterator]));
        }
    } else {
        node.fromString(ast.value);
    }

    if ('data' in ast) {
        data = ast.data;

        for (attribute in data) {
            /* istanbul ignore else */
            if (data.hasOwnProperty(attribute)) {
                node.data[attribute] = data[attribute];
            }
        }
    }

    return node;
}

/**
 * `fromAST` converts a given (stringified?) AST into a node.
 *
 * @param {Object|String} ast - The AST to convert.
 * @return {Object} - The parsed node.
 * @global
 * @private
 */
function fromAST(ast, done) {
    var tree = fromJSON(this.parser.TextOM, ast);

    this.run(tree, done);

    return this;
}

function hasKeys(object) {
    var attribute;

    for (attribute in object) {
        /* istanbul ignore else */
        if (object.hasOwnProperty(attribute)) {
            return true;
        }
    }

    return false;
}

/**
 * `toJSON` converts the given node to a JSON object.
 *
 * @return {Object} - A simple object containing the nodes type, and
 *                    either a children attribute containing an array
 *                    the result of `toJSON` on each child, or a value
 *                    attribute containing the nodes internal value.
 * @global
 * @private
 */
function toJSON() {
    var self = this,
        ast, result, item;

    if (!self || !self.TextOM) {
        throw new TypeError('Illegal invocation: \'' + self +
            '\' is not a valid argument for \'toJSON\'');
    }

    ast = {
        'type' : self.type
    };

    if (!('length' in self)) {
        ast.value = self.toString();
    } else {
        result = [];
        item = self.head;

        while (item) {
            result.push(item.toJSON());
            item = item.next;
        }

        ast.children = result;
    }

    if ('data' in self && hasKeys(self.data)) {
        ast.data = self.data;
    }

    return ast;
}

/**
 * `toAST` converts the operated on node into an stringified JSON object.
 *
 * @param {?(String|Number)} delimiter - When given, pretty prints the
 *                                       stringified object—indenting
 *                                       each level either with the given
 *                                       string or with the given number
 *                                       of spaces.
 * @return {String} - The `JSON.stringify`d result of the simple object
 *                    representation of the operated on node.
 * @global
 * @private
 */
function toAST(delimiter) {
    return JSON.stringify(this, null, delimiter);
}

function attach(retext) {
    var parser = retext.parser,
        nodePrototype = parser.TextOM.Node.prototype;

    /**
     * `toAST` converts the operated on node into an stringified JSON object.
     *
     * @param {?(String|Number)} delimiter - When given, pretty prints the
     *                                       stringified object—indenting
     *                                       each level either with the given
     *                                       string or with the given number
     *                                       of spaces.
     * @return {String} - The `JSON.stringify`d result of the simple object
     *                    representation of the operated on node.
     * @api public
     * @memberof Node.prototype
     */
    nodePrototype.toAST = toAST;

    /**
     * `toAST` converts the operated on node into an JSON object.
     *
     * @return {Object} - A JSON representation without all the cyclical
     *                    TextOM things.
     * @api public
     * @memberof Node.prototype
     */
    nodePrototype.toJSON = toJSON;

    /**
     * Expose `fromAST`.
     *
     * @param {Object|String} ast - The AST to convert.
     * @return {Object} - A TextOM object model.
     * @api public
     * @memberof retext
     */
    retext.fromAST = fromAST;
}

/**
 * Expose `attach`.
 * @memberof exports
 */
exports.attach = attach;

/**
 * Expose `toJSON`.
 * @memberof exports
 */
exports.toJSON = toJSON;

/**
 * Expose `toAST`.
 * @memberof exports
 */
exports.toAST = toAST;
