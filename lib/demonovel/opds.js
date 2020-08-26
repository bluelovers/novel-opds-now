"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeOPDSPortal = exports.makeOPDSType = exports.title = exports.prefixRoot = exports.prefix = void 0;
const lib_1 = require("calibre-opds/lib");
const opds_extra_1 = require("opds-extra");
const const_1 = require("opds-extra/lib/const");
const load_1 = __importStar(require("./load"));
const cache_loader_1 = require("@node-novel/cache-loader");
const addCover_1 = __importDefault(require("../opds/addCover"));
const index_1 = require("../opds/index");
const search_1 = require("../opds/search");
exports.prefix = `/demo`;
exports.prefixRoot = `/opds` + exports.prefix;
exports.title = `demonovel`;
async function makeOPDSType(type) {
    let feed = await makeOPDSPortal();
    let rawUrl = 'https://gitlab.com/demonovel/epub-txt/raw/master/';
    switch (type) {
        default:
            await load_1.default('array.json')
                .each((novel, id) => {
                if (!novel.cache.epub_basename) {
                    return;
                }
                let href = new URL([
                    novel.pathMain_base,
                    novel.cache.epub_basename,
                ].join('/'), rawUrl);
                let links = [
                    {
                        rel: const_1.EnumLinkRel.ACQUISITION,
                        href,
                        type: const_1.EnumMIME.epub,
                    }
                ];
                if (novel.mdconf.novel && novel.mdconf.novel.cover) {
                    links.push(...addCover_1.default(novel.mdconf.novel.cover));
                }
                let entry = opds_extra_1.OPDSV1.Entry.deserialize({
                    title: novel.title,
                    links,
                    identifier: `book${id}`,
                });
                if (novel.cache.epub_date) {
                    entry.updated = cache_loader_1.createMoment(novel.cache.epub_date);
                }
                if (novel.authors && novel.authors.length) {
                    entry.authors = novel.authors.map(name => ({ name }));
                }
                if (novel.mdconf.novel && novel.mdconf.novel.preface) {
                    entry.content = {
                        value: novel.mdconf.novel.preface
                            .replace(/\n/g, '<br/>')
                    };
                }
                entry.subtitle = novel.mdconf.novel.title;
                feed.books.push(entry);
            });
    }
    return feed;
}
exports.makeOPDSType = makeOPDSType;
function makeOPDSPortal() {
    return lib_1.buildSync(lib_1.initMain({
        title: exports.title,
        subtitle: ``,
        icon: '/favicon.ico',
    }), [
        (feed) => search_1.addOpenSearch(feed, load_1.siteID),
        index_1.makeOPDSShared,
        (feed) => {
            feed.books.push(opds_extra_1.OPDSV1.Entry.deserialize({
                title: `書庫：${load_1.siteID}`,
                links: [
                    {
                        href: `${exports.prefixRoot}.xml`,
                        title: const_1.EnumLinkRel.ALTERNATE,
                        type: const_1.EnumMIME.OPDS_CATALOG_FEED_DOCUMENT,
                    },
                ],
            }));
            feed.books.push(opds_extra_1.OPDSV1.Entry.deserialize({
                title: `全部列表`,
                links: [
                    {
                        href: `${exports.prefixRoot}/all.xml`,
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
//# sourceMappingURL=opds.js.map