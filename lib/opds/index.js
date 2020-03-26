"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeOPDSPortal = exports.makeOPDSSite = exports.makeOPDSShared = void 0;
const lib_1 = require("calibre-opds/lib");
const types_1 = require("../novel-cache/types");
const const_1 = require("opds-extra/lib/const");
const opds_extra_1 = require("opds-extra");
const load_1 = __importDefault(require("../novel-cache/load"));
const opds_1 = require("../demonovel/opds");
const search_1 = require("./search");
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
    return lib_1.buildAsync(lib_1.initMain({
        title: `書庫：${siteID}`,
        subtitle: `EPub 自動生成：${siteID}`,
        icon: '/favicon.ico',
    }), [
        (feed) => search_1.addOpenSearch(feed, siteID),
        (feed) => makeOPDSShared(feed, `，目前位於 ${siteID}`),
        async (feed) => {
            feed.books = feed.books || [];
            await load_1.default(siteID, types_1.builded_map)
                .each(({ id, title, }) => {
                feed.books.push(opds_extra_1.OPDSV1.Entry.deserialize({
                    title,
                    authors: [
                        {
                            name: siteID,
                        },
                    ],
                    identifier: `book_${siteID}_${id}`,
                    links: [
                        {
                            rel: const_1.EnumLinkRel.ACQUISITION,
                            href: `/file/${siteID}/${id}`,
                            type: const_1.EnumMIME.epub,
                        }
                    ],
                }));
            });
            return feed;
        },
    ]);
}
exports.makeOPDSSite = makeOPDSSite;
function makeOPDSPortal() {
    return lib_1.buildSync(lib_1.initMain({
        title: `EPub 自動生成`,
        subtitle: `EPub 自動生成`,
        icon: '/favicon.ico',
    }), [
        (feed) => search_1.addOpenSearch(feed, 'all'),
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
            Object.keys(types_1.id_titles_map)
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