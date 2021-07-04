"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeOPDSOther = exports.makeOPDSOtherSource = void 0;
const opds_extra_1 = require("opds-extra");
const const_1 = require("opds-extra/lib/const");
const lib_1 = require("calibre-opds/lib");
const index_1 = require("./index");
const search_1 = require("./search");
function makeOPDSOtherSource(feed) {
    feed.books = feed.books || [];
    [
        {
            title: 'D Genesis 迷宮出現三年後',
            href: `https://novel.tyty.moe/artifacts/n7945fn/epub/n7945fn_latest.epub`
        },
        {
            title: '關於鄰家的天使大人不知不覺把我慣成了廢人這檔子事',
            href: `https://novel.tyty.moe/artifacts/n8440fe/epub/n8440fe_latest.epub`
        },
    ]
        .forEach(({ title, href, }) => {
        feed.books.push(opds_extra_1.OPDSV1.Entry.deserialize({
            title,
            links: [
                {
                    rel: const_1.EnumLinkRel.ACQUISITION,
                    href,
                    type: const_1.EnumMIME.epub,
                }
            ],
        }));
    });
    return feed;
}
exports.makeOPDSOtherSource = makeOPDSOtherSource;
function makeOPDSOther() {
    return (0, lib_1.buildAsync)((0, lib_1.initMain)({
        title: `書庫：other`,
        icon: '/favicon.ico',
    }), [
        (feed) => (0, search_1.addOpenSearch)(feed, 'other'),
        (feed) => (0, index_1.makeOPDSShared)(feed, `，目前位於 other`),
        makeOPDSOtherSource,
    ]);
}
exports.makeOPDSOther = makeOPDSOther;
//# sourceMappingURL=other.js.map