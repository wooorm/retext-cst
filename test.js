'use strict';

/**
 * Dependencies.
 */

var retextAST,
    Retext,
    assert;

retextAST = require('./');
Retext = require('retext');
assert = require('assert');

/**
 * Retext.
 */

var retext,
    TextOM,
    parser;

retext = new Retext().use(retextAST);
TextOM = retext.TextOM;
parser = retext.parser;

/**
 * Tests.
 */

describe('retextAST()', function () {
    it('should be a `function`', function () {
        assert(typeof retextAST === 'function');
    });

    it('should export an `attach` method', function () {
        assert(typeof retextAST.attach === 'function');
    });

    it('should export a `toJSON` method', function () {
        assert(typeof retextAST.toJSON === 'function');
    });

    it('should export a `toAST` method', function () {
        assert(typeof retextAST.toAST === 'function');
    });
});

describe('retextAST.attach()', function () {
    it('should attach a `toAST` method to `TextOM.Node#`', function () {
        assert(typeof TextOM.Node.prototype.toAST === 'function');
    });

    it('should attach a `toJSON` method to `TextOM.Node#`', function () {
        assert(typeof TextOM.Node.prototype.toJSON === 'function');
    });

    it('should attach a `fromAST` method to `retext`', function () {
        assert(typeof retext.fromAST === 'function');
    });
});

describe('TextOM.Node#toJSON()', function () {
    it('should be a `function`', function () {
        assert(typeof (new TextOM.RootNode()).toJSON === 'function');
    });

    it('should convert a `Node` into an AST', function (done) {
        var source,
            ast;

        source = 'A simple sentence.';
        ast = parser.parse(source);

        retext.parse(source, function (err, tree) {
            assert(JSON.stringify(tree) === JSON.stringify(ast));

            done(err);
        });
    });

    it('should throw, when not operating on a Node', function () {
        assert.throws(function () {
            new TextOM.Node().toJSON.call(Math);
        }, /Math/);

        assert.throws(function () {
            new TextOM.Node().toJSON.call();
        }, /undefined/);
    });

    it('should include a data property when non-empty', function (done) {
        var source,
            ast;

        source = 'A simple sentence.';
        ast = parser.parse(source);

        ast.data = {
            'test' : 'test'
        };

        retext.parse(source, function (err, tree) {
            tree.data.test = 'test';

            assert(JSON.stringify(tree) === JSON.stringify(ast));

            done(err);
        });
    });
});

describe('TextOM.Node#toAST(delimiter?)', function () {
    it('should be a `function`', function () {
        assert(typeof new TextOM.RootNode().toAST === 'function');
    });

    it('should convert a `Node` into an stringified AST', function (done) {
        var source,
            ast;

        source = 'A simple sentence.';
        ast = parser.parse(source);

        retext.parse(source, function (err, tree) {
            assert(tree.toAST() === JSON.stringify(ast));

            done(err);
        });
    });

    it('should convert a `Node` into an stringified AST using the given ' +
        'delimiter', function (done) {
            var source,
                delimiter = '\t',
                ast;

            source = 'A simple sentence.';
            ast = parser.parse(source);

            retext.parse(source, function (err, tree) {
                assert(
                    tree.toAST(delimiter) ===
                    JSON.stringify(ast, null, delimiter)
                );

                done(err);
            });
        }
    );
});

describe('Retext.fromAST(ast, done)', function () {
    it('should be a `function`', function () {
        assert(typeof retext.fromAST === 'function');
    });

    it('should throw, when something other than a string or object is given',
        function (done) {
            retext.fromAST(Math, function (err) {
                assert.throws(function () {
                    throw err;
                }, /object Math/);
            });

            done();
        }
    );

    it('should throw, when the `JSON.Parse`d value does not contain a ' +
        '`type` attribute', function (done) {
            retext.fromAST({
                'value' : 'test'
            }, function (err) {
                assert.throws(function () {
                    throw err;
                });

                done();
            });
        }
    );

    it('should throw, when the `JSON.Parse`d value contains ' +
        'neither a `children`, nor a `value` attribute',
        function (done) {
            retext.fromAST({
                'type' : 'RootNode'
            }, function (err) {
                assert.throws(function () {
                    throw err;
                });

                done();
            });
        }
    );

    it('should convert a stringified AST into an object model',
        function (done) {
            var ast;

            ast = JSON.stringify(parser.parse('A simple sentence.'));

            retext.fromAST(ast, function (err, tree) {
                assert(tree.toAST() === ast);

                done(err);
            });
        }
    );

    it('should accept `String` objects',
        function (done) {
            var ast;

            ast = JSON.stringify(parser.parse('A simple sentence.'));

            /* eslint-disable no-new-wrappers */
            retext.fromAST(new String(ast), function (err, tree) {
                assert(tree.toAST() === ast);

                done(err);
                /* eslint-enable no-new-wrappers */
            });
        }
    );

    it('should convert an AST into an object model', function (done) {
        var ast;

        ast = parser.parse('A simple sentence.');

        retext.fromAST(ast, function (err, tree) {
            assert(tree.toAST() === JSON.stringify(ast));

            done(err);
        });
    });

    it('should set data properties', function (done) {
        var ast;

        ast = parser.parse('A simple sentence.');

        ast.data = {
            'test' : 'test'
        };

        ast = JSON.stringify(ast);

        retext.fromAST(ast, function (err, tree) {
            assert(tree.toAST() === ast);

            done(err);
        });
    });
});
