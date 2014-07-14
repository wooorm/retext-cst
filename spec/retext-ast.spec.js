'use strict';

var retextAst, Retext, assert, TextOM, retext;

retextAst = require('..');
Retext = require('retext');
assert = require('assert');

retext = new Retext().use(retextAst);
TextOM = retext.parser.TextOM;

describe('retext-ast', function () {
    it('should be of type `function`', function () {
        assert(typeof retextAst === 'function');
    });

    it('should export an `attach` method', function () {
        assert(typeof retextAst.attach === 'function');
    });

    it('should export a `toJSON` method', function () {
        assert(typeof retextAst.toJSON === 'function');
    });

    it('should export a `toAST` method', function () {
        assert(typeof retextAst.toAST === 'function');
    });
});

describe('retext-ast.attach', function () {
    it('should attach a `toAST` method to `TextOM.Node#`', function () {
        assert('toAST' in TextOM.Node.prototype);
    });

    it('should attach a `toJSON` method to `TextOM.Node#`', function () {
        assert('toJSON' in TextOM.Node.prototype);
    });

    it('should attach a `fromAST` method to `retext`', function () {
        assert('fromAST' in retext);
    });
});

describe('Retext.parser.TextOM.Node#toJSON()', function () {
    it('should be of type `function`', function () {
        assert(typeof (new TextOM.RootNode()).toJSON === 'function');
    });

    it('should convert a `Node` into an AST', function () {
        var source = 'A simple sentence.',
            root = retext.parse(source),
            ast = retext.parser.tokenizeRoot(source);

        assert(JSON.stringify(root) === JSON.stringify(ast));
    });

    it('should throw, when not operating on a Node',
        function () {
            assert.throws(function () {
                retext.parse().toJSON.call(Math);
            }, 'Math');
            assert.throws(function () {
                retext.parse().toJSON.call();
            }, 'undefined');
        }
    );

    it('should include a data property when not empty', function () {
        var source = 'A simple sentence.',
            root = retext.parse(source),
            ast = retext.parser.tokenizeRoot(source);

        ast.data = {
            'test' : 'test'
        };

        root.data.test = 'test';

        assert(JSON.stringify(root) === JSON.stringify(ast));
    });
});

describe('Retext.parser.TextOM.Node#toAST(delimiter?)', function () {
    it('should be of type `function`', function () {
        assert(typeof (new TextOM.RootNode()).toAST === 'function');
    });

    it('should convert a `Node` into a stringified AST', function () {
        var source = 'A simple sentence.',
            astA = retext.parse(source).toAST(),
            astB = retext.parser.tokenizeRoot(source);

        assert(astA === JSON.stringify(astB));
    });

    it('should convert a `Node` into a stringified AST using the given ' +
        'delimeter', function () {
            var source = 'A simple sentence.',
                delimiter = '\t',
                ast = retext.parser.tokenizeRoot(source);

            assert(
                retext.parse(source).toAST(delimiter) ===
                JSON.stringify(ast, null, delimiter)
            );

            delimiter = 2;

            assert(
                retext.parse(source).toAST(delimiter) ===
                JSON.stringify(ast, null, delimiter)
            );
        }
    );
});

describe('Retext.fromAST(ast)', function () {
    it('should be of type `function`', function () {
        assert(typeof retext.fromAST === 'function');
    });

    it('should throw, when something other than a string or object is given',
        function () {
            assert.throws(function () {
                retext.fromAST(Math);
            }, 'Math');
            assert.throws(function () {
                retext.fromAST(1);
            }, '1');
            assert.throws(function () {
                retext.fromAST();
            }, 'undefined');
            assert.throws(function () {
                retext.fromAST(null);
            }, 'null');
            assert.throws(function () {
                retext.fromAST(undefined);
            }, 'undefined');
        }
    );

    it('should throw, when the `JSON.Parse`d value does not contain a ' +
        '`type` attribute', function () {
            assert.throws(function () {
                retext.fromAST({});
            }, 'type');

            assert.throws(function () {
                retext.fromAST({
                    'a' : 'b'
                });
            }, 'type');

            assert.throws(function () {
                retext.fromAST({
                    'value' : 'test'
                });
            }, 'type');

            assert.throws(function () {
                retext.fromAST({
                    'children' : []
                });
            }, 'type');
        }
    );

    it('should throw, when the `JSON.Parse`d value does contains ' +
        'neither a `children`, nor a `value` attribute', function () {
            assert.throws(function () {
                retext.fromAST({
                    'type' : 'RootNode'
                });
            }, /children|value/);
        }
    );

    it('should convert a stringified AST into an object model', function () {
        var tree = retext.parser.tokenizeRoot('A simple sentence.'),
            ast = JSON.stringify(tree);

        assert(retext.fromAST(ast).toAST() === ast);

        /* eslint-disable no-new-wrappers */
        assert(retext.fromAST(new String(ast)).toAST() === ast);
        /* eslint-enable no-new-wrappers */
    });

    it('should convert an AST into an object model', function () {
        var tree = retext.parser.tokenizeRoot('A simple sentence.');

        assert(retext.fromAST(tree).toAST() === JSON.stringify(tree));
    });

    it('should set data properties', function () {
        var tree = retext.parser.tokenizeRoot('A simple sentence.'),
            ast;

        tree.data = {
            'test' : 'test'
        };

        ast = JSON.stringify(tree);

        assert(retext.fromAST(ast).toAST() === JSON.stringify(tree));
    });
});
