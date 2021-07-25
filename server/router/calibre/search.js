"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calibreSearchHandler = exports.calibreSearchFeed = void 0;
const tslib_1 = require("tslib");
const express_1 = require("express");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const db_1 = require("calibre-server/lib/opds/db");
const index_1 = (0, tslib_1.__importStar)(require("calibre-opds/lib/index"));
const v1_1 = require("opds-extra/lib/v1");
const const_1 = require("opds-extra/lib/const");
const search_1 = require("../../../lib/opds/search");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const moment_1 = (0, tslib_1.__importDefault)(require("moment"));
const re_1 = (0, tslib_1.__importDefault)(require("../../../lib/re"));
const list_1 = require("cjk-conv/lib/zh/table/list");
function calibreSearchFeed(options, argv) {
    var _a;
    return (0, index_1.buildAsync)((0, index_1.default)({
        title: `書庫：${(_a = options.siteTitle) !== null && _a !== void 0 ? _a : 'Calibre 書庫'}`,
        icon: '/favicon.ico',
    }), [
        (feed) => (0, search_1.addOpenSearch)(feed, 'calibre'),
        (feed) => {
            feed.books || (feed.books = []);
            Object.entries(options.dbList)
                .forEach(([id, row]) => {
                feed.books.push(v1_1.Entry.deserialize({
                    title: `書庫：${row.name}`,
                    links: [
                        {
                            href: options.pathWithPrefix.call(void 0, row.id, 'opds'),
                            title: const_1.EnumLinkRel.ALTERNATE,
                            type: const_1.EnumMIME.OPDS_CATALOG_FEED_DOCUMENT,
                        }
                    ]
                }));
            });
            return feed;
        },
        async (feed) => {
            feed.books || (feed.books = []);
            let { searchTerms } = argv;
            let searchTermsRe;
            let searchTermsSlugify = (0, list_1.slugify)(searchTerms);
            try {
                searchTermsRe = re_1.default.create(argv.searchTerms, 'ig');
            }
            catch (e) {
            }
            logger_1.default.dir({
                searchTerms,
                searchTermsRe,
                searchTermsSlugify,
            });
            await bluebird_1.default.resolve(Object.entries(options.dbList))
                .reduce(async (ls, [dbID, row]) => {
                const db = await row.lazyload();
                await db.getBooks()
                    .catch(e => [])
                    .each(book => {
                    book.dbID = dbID;
                    book.timestamp = (0, moment_1.default)(book.book_timestamp).valueOf();
                    if ((searchTermsRe === null || searchTermsRe === void 0 ? void 0 : searchTermsRe.test(book.book_title))
                        || book.book_title.includes(searchTerms)
                        || (0, list_1.slugify)(book.book_title).includes(searchTermsSlugify)) {
                        ls.push(book);
                    }
                });
                return ls;
            }, [])
                .then(books => {
                var _a;
                books = books.sort((a, b) => b.timestamp - a.timestamp);
                if ((_a = books[0]) === null || _a === void 0 ? void 0 : _a.timestamp) {
                    feed.updated = books[0].timestamp;
                }
                return books;
            })
                .each(book => {
                var _a;
                let entry = (0, db_1.addBook)(book, options, {
                    dbID: book.dbID,
                });
                (_a = entry.authors) !== null && _a !== void 0 ? _a : (entry.authors = []);
                entry.authors.unshift({
                    name: book.dbID
                });
                feed.books.push(entry);
            });
            return feed;
        },
    ]);
}
exports.calibreSearchFeed = calibreSearchFeed;
function calibreSearchHandler(options) {
    const router = (0, express_1.Router)();
    router.use('/:searchTerms', async (req, res, next) => {
        let { searchTerms } = req.params;
        let feed = await calibreSearchFeed(options, {
            searchTerms,
        });
        res.setHeader('Content-Type', 'application/xml');
        res.send(feed.toXML());
    });
    return router;
}
exports.calibreSearchHandler = calibreSearchHandler;
exports.default = calibreSearchHandler;
//# sourceMappingURL=search.js.map