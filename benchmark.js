'use strict';

var Retext,
    cst;

/**
 * Dependencies.
 */

Retext = require('retext');
cst = require('./');

/**
 * Dependencies.
 */

var retext;

retext = new Retext().use(cst);

/**
 * Test data.
 *
 * This includes:
 *
 * - An average sentence (w/ 20 words);
 * - An average paragraph (w/ 5 sentences);
 * - A (big?) section (w/ 10 paragraphs);
 * - A (big?) article (w/ 10 sections);
 *
 * Source:
 *   http://www.gutenberg.org/files/10745/10745-h/10745-h.htm
 */

var sentence,
    paragraph,
    section,
    article,
    paragraphNLCST,
    sectionNLCST,
    articleNLCST;

sentence = 'Where she had stood was clear, and she was gone since Sir ' +
    'Kay does not choose to assume my quarrel.';

paragraph = 'Thou art a churlish knight to so affront a lady ' +
    'he could not sit upon his horse any longer. ' +
    'For methinks something hath befallen my lord and that he ' +
    'then, after a while, he cried out in great voice. ' +
    'For that light in the sky lieth in the south ' +
    'then Queen Helen fell down in a swoon, and lay. ' +
    'Touch me not, for I am not mortal, but Fay ' +
    'so the Lady of the Lake vanished away, everything behind. ' +
    sentence;

section = paragraph + Array(10).join('\n\n' + paragraph);

article = section + Array(10).join('\n\n' + section);

paragraphNLCST = retext.parser.parse(paragraph);
sectionNLCST = retext.parser.parse(section);
articleNLCST = retext.parser.parse(article);

/**
 * Benchmark `fromCST`.
 */

suite('retext.fromCST(cst, options?, callback);', function () {
    bench('A paragraph (5 sentences, 100 words)',
        function (done) {
            retext.fromCST(paragraphNLCST, done);
        }
    );

    bench('A section (10 paragraphs, 50 sentences, 1,000 words)',
        function (done) {
            retext.fromCST(sectionNLCST, done);
        }
    );

    bench('An article (100 paragraphs, 500 sentences, 10,000 words)',
        function (done) {
            retext.fromCST(articleNLCST, done);
        }
    );
});

/**
 * Benchmark `toJSON`.
 */

suite('TextOM.Node#toJSON()', function () {
    var paragraphNode,
        sectionNode,
        articleNode;

    before(function (done) {
        retext.fromCST(paragraphNLCST, function (err, tree) {
            paragraphNode = tree;

            done(err);
        });
    });

    before(function (done) {
        retext.fromCST(sectionNLCST, function (err, tree) {
            sectionNode = tree;

            done(err);
        });
    });

    before(function (done) {
        retext.fromCST(articleNLCST, function (err, tree) {
            articleNode = tree;

            done(err);
        });
    });

    bench('A paragraph (5 sentences, 100 words)', function () {
        paragraphNode.toJSON();
    });

    bench('A section (10 paragraphs, 50 sentences, 1,000 words)',
        function () {
            sectionNode.toJSON();
        }
    );

    bench('An article (100 paragraphs, 500 sentences, 10,000 words)',
        function () {
            articleNode.toJSON();
        }
    );
});

/**
 * Benchmark `toCST`.
 */

suite('TextOM.Node#toCST(delimiter?)', function () {
    var paragraphNode,
        sectionNode,
        articleNode;

    before(function (done) {
        retext.fromCST(paragraphNLCST, function (err, tree) {
            paragraphNode = tree;

            done(err);
        });
    });

    before(function (done) {
        retext.fromCST(sectionNLCST, function (err, tree) {
            sectionNode = tree;

            done(err);
        });
    });

    before(function (done) {
        retext.fromCST(articleNLCST, function (err, tree) {
            articleNode = tree;

            done(err);
        });
    });

    bench('A paragraph (5 sentences, 100 words)', function () {
        paragraphNode.toCST();
    });

    bench('A section (10 paragraphs, 50 sentences, 1,000 words)',
        function () {
            sectionNode.toCST();
        }
    );

    bench('An article (100 paragraphs, 500 sentences, 10,000 words)',
        function () {
            articleNode.toCST();
        }
    );
});
