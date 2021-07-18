"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeOPDSPortal = exports.makeOPDSType = exports.title = exports.prefixRoot = exports.prefix = void 0;
const tslib_1 = require("tslib");
const lib_1 = require("calibre-opds/lib");
const const_1 = require("opds-extra/lib/const");
const core_1 = require("opds-extra/lib/v1/core");
const load_1 = (0, tslib_1.__importDefault)(require("./load"));
const cache_loader_1 = require("@node-novel/cache-loader");
const addCover_1 = (0, tslib_1.__importDefault)(require("../../opds/addCover"));
const index_1 = require("../../opds/index");
const types_1 = require("./types");
const search_1 = require("../../opds/search");
const getDemoEpubUrl_1 = require("./getDemoEpubUrl");
exports.prefix = `/demo`;
exports.prefixRoot = `/opds` + exports.prefix;
exports.title = `demonovel`;
async function makeOPDSType(type) {
    let feed = await makeOPDSPortal();
    let last_updated;
    switch (type) {
        default:
            await (0, load_1.default)('array.json')
                .each((novel, id) => {
                var _a;
                if (!novel.cache.epub_basename) {
                    return;
                }
                let href = (0, getDemoEpubUrl_1.getDemoEpubRouterUrl)(novel);
                2;
                let links = [
                    {
                        rel: const_1.EnumLinkRel.ACQUISITION,
                        href,
                        type: const_1.EnumMIME.epub,
                    }
                ];
                if (novel.mdconf.novel && novel.mdconf.novel.cover) {
                    links.push(...(0, addCover_1.default)(novel.mdconf.novel.cover));
                }
                let entry = core_1.Entry.deserialize({
                    title: novel.title,
                    links,
                    identifier: novel.uuid,
                });
                if (novel.cache.epub_date) {
                    entry.updated = (0, cache_loader_1.createMoment)(novel.cache.epub_date);
                }
                if (novel.authors && novel.authors.length) {
                    entry.authors = novel.authors.map(name => ({ name }));
                }
                if ((_a = novel.mdconf.novel) === null || _a === void 0 ? void 0 : _a.preface) {
                    entry.content = {
                        value: novel.mdconf.novel.preface
                            .replace(/\n/g, '<br/>')
                    };
                }
                entry.subtitle = novel.mdconf.novel.title;
                last_updated !== null && last_updated !== void 0 ? last_updated : (last_updated = entry.updated);
                feed.books.push(entry);
            });
            feed.updated = last_updated;
    }
    return feed;
}
exports.makeOPDSType = makeOPDSType;
function makeOPDSPortal() {
    return (0, lib_1.buildSync)((0, lib_1.initMain)({
        title: exports.title,
        subtitle: ``,
        icon: '/favicon.ico',
    }), [
        (feed) => (0, search_1.addOpenSearch)(feed, types_1.siteID),
        index_1.makeOPDSShared,
        (feed) => {
            feed.books.push(core_1.Entry.deserialize({
                title: `書庫：${types_1.siteID}`,
                links: [
                    {
                        href: `${exports.prefixRoot}.xml`,
                        title: const_1.EnumLinkRel.ALTERNATE,
                        type: const_1.EnumMIME.OPDS_CATALOG_FEED_DOCUMENT,
                    },
                ],
            }));
            feed.books.push(core_1.Entry.deserialize({
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