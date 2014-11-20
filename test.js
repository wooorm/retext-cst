'use strict';

/**
 * Dependencies.
 */

var retextCST,
    Retext,
    assert;

retextCST = require('./');
Retext = require('retext');
assert = require('assert');

/**
 * Retext.
 */

var retext,
    TextOM,
    parser;

retext = new Retext().use(retextCST);
TextOM = retext.TextOM;
parser = retext.parser;

/**
 * Tests.
 */

describe('retextCST()', function () {
    it('should be a `function`', function () {
        assert(typeof retextCST === 'function');
    });

    it('should export a `toJSON` method', function () {
        assert(typeof retextCST.toJSON === 'function');
    });

    it('should export a `toCST` method', function () {
        assert(typeof retextCST.toCST === 'function');
    });
});

describe('retextCST.attach()', function () {
    it('should attach a `toCST` method to `TextOM.Node#`', function () {
        assert(typeof TextOM.Node.prototype.toCST === 'function');
    });

    it('should attach a `toJSON` method to `TextOM.Node#`', function () {
        assert(typeof TextOM.Node.prototype.toJSON === 'function');
    });

    it('should attach a `fromCST` method to `retext`', function () {
        assert(typeof retext.fromCST === 'function');
    });
});

describe('TextOM.Node#toJSON()', function () {
    it('should be a `function`', function () {
        assert(typeof (new TextOM.RootNode()).toJSON === 'function');
    });

    it('should convert a `Node` into an CST', function (done) {
        var source,
            cst;

        source = 'A simple sentence.';
        cst = parser.parse(source);

        retext.parse(source, function (err, tree) {
            assert(JSON.stringify(tree) === JSON.stringify(cst));

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
            cst;

        source = 'A simple sentence.';
        cst = parser.parse(source);

        cst.data = {
            'test': 'test'
        };

        retext.parse(source, function (err, tree) {
            tree.data.test = 'test';

            assert(JSON.stringify(tree) === JSON.stringify(cst));

            done(err);
        });
    });
});

describe('TextOM.Node#toCST(delimiter?)', function () {
    it('should be a `function`', function () {
        assert(typeof new TextOM.RootNode().toCST === 'function');
    });

    it('should convert a `Node` into an stringified CST', function (done) {
        var source,
            cst;

        source = 'A simple sentence.';
        cst = parser.parse(source);

        retext.parse(source, function (err, tree) {
            assert(tree.toCST() === JSON.stringify(cst));

            done(err);
        });
    });

    it('should convert a `Node` into an stringified CST using the given ' +
        'delimiter', function (done) {
            var source,
                delimiter = '\t',
                cst;

            source = 'A simple sentence.';
            cst = parser.parse(source);

            retext.parse(source, function (err, tree) {
                assert(
                    tree.toCST(delimiter) ===
                    JSON.stringify(cst, null, delimiter)
                );

                done(err);
            });
        }
    );
});

describe('Retext.fromCST(cst, done)', function () {
    it('should be a `function`', function () {
        assert(typeof retext.fromCST === 'function');
    });

    it('should throw, when something other than a string or object is given',
        function (done) {
            retext.fromCST(Math, function (err) {
                assert.throws(function () {
                    throw err;
                }, /object Math/);
            });

            done();
        }
    );

    it('should throw, when the `JSON.Parse`d value does not contain a ' +
        '`type` attribute', function (done) {
            retext.fromCST({
                'value': 'test'
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
            retext.fromCST({
                'type': 'RootNode'
            }, function (err) {
                assert.throws(function () {
                    throw err;
                });

                done();
            });
        }
    );

    it('should convert a stringified CST into an object model',
        function (done) {
            var cst;

            cst = JSON.stringify(parser.parse('A simple sentence.'));

            retext.fromCST(cst, function (err, tree) {
                assert(tree.toCST() === cst);

                done(err);
            });
        }
    );

    it('should accept `String` objects',
        function (done) {
            var cst;

            cst = JSON.stringify(parser.parse('A simple sentence.'));

            /* eslint-disable no-new-wrappers */
            retext.fromCST(new String(cst), function (err, tree) {
                assert(tree.toCST() === cst);

                done(err);
                /* eslint-enable no-new-wrappers */
            });
        }
    );

    it('should convert an CST into an object model', function (done) {
        var cst;

        cst = parser.parse('A simple sentence.');

        retext.fromCST(cst, function (err, tree) {
            assert(tree.toCST() === JSON.stringify(cst));

            done(err);
        });
    });

    it('should set data properties', function (done) {
        var cst;

        cst = parser.parse('A simple sentence.');

        cst.data = {
            'test': 'test'
        };

        cst = JSON.stringify(cst);

        retext.fromCST(cst, function (err, tree) {
            assert(tree.toCST() === cst);

            done(err);
        });
    });
});
