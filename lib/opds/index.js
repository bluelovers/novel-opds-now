"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeOPDSPortal = exports.makeOPDSSite = exports.makeOPDSShared = void 0;
const tslib_1 = require("tslib");
const lib_1 = require("calibre-opds/lib");
const types_1 = require("../novel-cache/types");
const const_1 = require("opds-extra/lib/const");
const opds_extra_1 = require("opds-extra");
const opds_1 = require("../demonovel/opds");
const search_1 = require("./search");
const cn2tw_min_1 = require("../cn2tw_min");
const addCover_1 = (0, tslib_1.__importDefault)(require("./addCover"));
const addContent_1 = require("./addContent");
const load_1 = require("../site/cached-data/load");
function makeOPDSShared(feed, msg = '') {
    feed.books = feed.books || [];
    feed.books.push(opds_extra_1.OPDSV1.Entry.deserialize({
        title: `所有書庫${msg}`,
        links: [
            {
                href: `/opds`,
                title: const_1.EnumLinkRel.ALTERNATE,
                type: const_1.EnumMIME.OPDS_CATALOG_FEED_DOCUMENT,
            },
        ],
    }));
    return feed;
}
exports.makeOPDSShared = makeOPDSShared;
function makeOPDSSite(siteID) {
    let last_updated;
    return (0, lib_1.buildAsync)((0, lib_1.initMain)({
        title: `書庫：${siteID}`,
        subtitle: `EPub 自動生成：${siteID}`,
        icon: '/favicon.ico',
    }), [
        (feed) => (0, search_1.addOpenSearch)(feed, siteID),
        (feed) => makeOPDSShared(feed, `，目前位於 ${siteID}`),
        async (feed) => {
            feed.books = feed.books || [];
            await (0, load_1.loadCache)(siteID)
                .each(({ id, title, cover, content, updated, }) => {
                last_updated !== null && last_updated !== void 0 ? last_updated : (last_updated = updated);
                if (siteID === 'esjzone') {
                    title = (0, cn2tw_min_1.cn2tw_min)(title, {
                        safe: false,
                    });
                }
                feed.books.push(opds_extra_1.OPDSV1.Entry.deserialize({
                    title,
                    authors: [
                        {
                            name: siteID,
                        },
                    ],
                    identifier: `book_${siteID}_${id}`,
                    links: [
                        ...(0, addCover_1.default)(cover),
                        {
                            rel: const_1.EnumLinkRel.ACQUISITION,
                            href: `/file/${siteID}/${id}`,
                            type: const_1.EnumMIME.epub,
                        },
                    ],
                    content: (0, addContent_1.addContent)(content),
                    updated,
                }));
            });
            return feed;
        },
        (feed) => {
            feed.updated = last_updated;
            return feed;
        },
    ]);
}
exports.makeOPDSSite = makeOPDSSite;
function makeOPDSPortal() {
    return (0, lib_1.buildSync)((0, lib_1.initMain)({
        title: `EPub 自動生成`,
        subtitle: `EPub 自動生成`,
        icon: '/favicon.ico',
    }), [
        (feed) => (0, search_1.addOpenSearch)(feed, 'all'),
        (feed) => {
            feed.books = feed.books || [];
            if (0) {
                feed.books.push(opds_extra_1.OPDSV1.Entry.deserialize({
                    title: `書庫：${opds_1.title}`,
                    links: [
                        {
                            href: `https://demonovel.netlify.com/static/opds.xml`,
                            title: const_1.EnumLinkRel.ALTERNATE,
                            type: const_1.EnumMIME.OPDS_CATALOG_FEED_DOCUMENT,
                        },
                    ],
                }));
            }
            else {
                feed.books.push(opds_extra_1.OPDSV1.Entry.deserialize({
                    title: `書庫：${opds_1.title}`,
                    links: [
                        {
                            href: `${opds_1.prefixRoot}/all.xml`,
                            title: const_1.EnumLinkRel.ALTERNATE,
                            type: const_1.EnumMIME.OPDS_CATALOG_FEED_DOCUMENT,
                        },
                    ],
                }));
            }
            Object.keys(types_1.builded_map)
                .forEach((siteID) => {
                feed.books.push(opds_extra_1.OPDSV1.Entry.deserialize({
                    title: `書庫：${siteID}`,
                    links: [
                        {
                            href: `/opds/${siteID}.xml`,
                            title: const_1.EnumLinkRel.ALTERNATE,
                            type: const_1.EnumMIME.OPDS_CATALOG_FEED_DOCUMENT,
                        },
                    ],
                }));
            });
            feed.books.push(opds_extra_1.OPDSV1.Entry.deserialize({
                title: `書庫：other`,
                links: [
                    {
                        href: `/opds/other.xml`,
                        title: const_1.EnumLinkRel.ALTERNATE,
                        type: const_1.EnumMIME.OPDS_CATALOG_FEED_DOCUMENT,
                    },
                ],
            }));
            return feed;
        },
    ]);
}
exports.makeOPDSPortal = makeOPDSPortal;
exports.default = makeOPDSPortal;
//# sourceMappingURL=index.js.map