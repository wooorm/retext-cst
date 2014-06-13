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
        var root, ast;

        root = retext.parse('A simple sentence.');

        ast = {
            'type' : 'RootNode',
            'children' : [
                {
                    'type' : 'ParagraphNode',
                    'children' : [
                        {
                            'type' : 'SentenceNode',
                            'children' : [
                                {
                                    'type' : 'WordNode',
                                    'value' : 'A'
                                },
                                {
                                    'type' : 'WhiteSpaceNode',
                                    'value' : ' '
                                },
                                {
                                    'type' : 'WordNode',
                                    'value' : 'simple'
                                },
                                {
                                    'type' : 'WhiteSpaceNode',
                                    'value' : ' '
                                },
                                {
                                    'type' : 'WordNode',
                                    'value' : 'sentence'
                                },
                                {
                                    'type' : 'PunctuationNode',
                                    'value' : '.'
                                }
                            ]
                        }
                    ]
                }
            ]
        };

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
});

describe('Retext.parser.TextOM.Node#toAST(delimiter?)', function () {
    it('should be of type `function`', function () {
        assert(typeof (new TextOM.RootNode()).toAST === 'function');
    });

    it('should convert a `Node` into a stringified AST', function () {
        var ast = JSON.stringify({
            'type' : 'RootNode',
            'children' : [
                {
                    'type' : 'ParagraphNode',
                    'children' : [
                        {
                            'type' : 'SentenceNode',
                            'children' : [
                                {
                                    'type' : 'WordNode',
                                    'value' : 'A'
                                },
                                {
                                    'type' : 'WhiteSpaceNode',
                                    'value' : ' '
                                },
                                {
                                    'type' : 'WordNode',
                                    'value' : 'simple'
                                },
                                {
                                    'type' : 'WhiteSpaceNode',
                                    'value' : ' '
                                },
                                {
                                    'type' : 'WordNode',
                                    'value' : 'sentence'
                                },
                                {
                                    'type' : 'PunctuationNode',
                                    'value' : '.'
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        assert(retext.parse('A simple sentence.').toAST() === ast);
    });

    it('should convert a `Node` into a stringified AST using the given ' +
        'delimeter', function () {
            var ast = JSON.stringify({
                'type' : 'RootNode',
                'children' : [
                    {
                        'type' : 'ParagraphNode',
                        'children' : [
                            {
                                'type' : 'SentenceNode',
                                'children' : [
                                    {
                                        'type' : 'WordNode',
                                        'value' : 'A'
                                    },
                                    {
                                        'type' : 'WhiteSpaceNode',
                                        'value' : ' '
                                    },
                                    {
                                        'type' : 'WordNode',
                                        'value' : 'simple'
                                    },
                                    {
                                        'type' : 'WhiteSpaceNode',
                                        'value' : ' '
                                    },
                                    {
                                        'type' : 'WordNode',
                                        'value' : 'sentence'
                                    },
                                    {
                                        'type' : 'PunctuationNode',
                                        'value' : '.'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }, null, '\t');

            assert(retext.parse('A simple sentence.').toAST('\t') === ast);

            assert(
                retext.parse('A simple sentence.').toAST('  ') ===
                ast.replace(/\t/g, '  ')
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
        var ast = JSON.stringify({
            'type' : 'RootNode',
            'children' : [
                {
                    'type' : 'ParagraphNode',
                    'children' : [
                        {
                            'type' : 'SentenceNode',
                            'children' : [
                                {
                                    'type' : 'WordNode',
                                    'value' : 'A'
                                },
                                {
                                    'type' : 'WhiteSpaceNode',
                                    'value' : ' '
                                },
                                {
                                    'type' : 'WordNode',
                                    'value' : 'simple'
                                },
                                {
                                    'type' : 'WhiteSpaceNode',
                                    'value' : ' '
                                },
                                {
                                    'type' : 'WordNode',
                                    'value' : 'sentence'
                                },
                                {
                                    'type' : 'PunctuationNode',
                                    'value' : '.'
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        assert(retext.fromAST(ast).toAST() === ast);

        /*eslint-disable no-new-wrappers */
        assert(retext.fromAST(new String(ast)).toAST() === ast);
        /*eslint-enable no-new-wrappers */
    });

    it('should convert an AST into an object model', function () {
        var ast = {
            'type' : 'RootNode',
            'children' : [
                {
                    'type' : 'ParagraphNode',
                    'children' : [
                        {
                            'type' : 'SentenceNode',
                            'children' : [
                                {
                                    'type' : 'WordNode',
                                    'value' : 'A'
                                },
                                {
                                    'type' : 'WhiteSpaceNode',
                                    'value' : ' '
                                },
                                {
                                    'type' : 'WordNode',
                                    'value' : 'simple'
                                },
                                {
                                    'type' : 'WhiteSpaceNode',
                                    'value' : ' '
                                },
                                {
                                    'type' : 'WordNode',
                                    'value' : 'sentence'
                                },
                                {
                                    'type' : 'PunctuationNode',
                                    'value' : '.'
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        assert(retext.fromAST(ast).toAST() === JSON.stringify(ast));
    });
});
