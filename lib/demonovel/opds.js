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
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3Bkcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9wZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDBDQUF1RDtBQUN2RCwyQ0FBb0M7QUFDcEMsZ0RBQTZEO0FBRTdELCtDQUEyQztBQUMzQywyREFBMEY7QUFLMUYsZ0VBQXdDO0FBQ3hDLHlDQUErQztBQUUvQywyQ0FBK0M7QUFHcEMsUUFBQSxNQUFNLEdBQUcsT0FBTyxDQUFDO0FBQ2pCLFFBQUEsVUFBVSxHQUFHLE9BQU8sR0FBRyxjQUFNLENBQUM7QUFDOUIsUUFBQSxLQUFLLEdBQUcsV0FBVyxDQUFDO0FBRXhCLEtBQUssVUFBVSxZQUFZLENBQUMsSUFBWTtJQUU5QyxJQUFJLElBQUksR0FBRyxNQUFNLGNBQWMsRUFBRSxDQUFDO0lBR2xDLElBQUksTUFBTSxHQUFHLG1EQUFtRCxDQUFDO0lBRWpFLFFBQVEsSUFBSSxFQUNaO1FBQ0M7WUFFQyxNQUFNLGNBQVMsQ0FBeUIsWUFBWSxDQUFDO2lCQUNuRCxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBRW5CLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFDOUI7b0JBQ0MsT0FBTztpQkFDUDtnQkFFRCxJQUFJLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQztvQkFDbEIsS0FBSyxDQUFDLGFBQWE7b0JBQ25CLEtBQUssQ0FBQyxLQUFLLENBQUMsYUFBYTtpQkFDekIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBRXJCLElBQUksS0FBSyxHQUFHO29CQUNYO3dCQUNDLEdBQUcsRUFBRSxtQkFBVyxDQUFDLFdBQVc7d0JBQzVCLElBQUk7d0JBQ0osSUFBSSxFQUFFLGdCQUFRLENBQUMsSUFBSTtxQkFDWjtpQkFDUixDQUFDO2dCQUVGLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUks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Y2VzQ29udGVudCI6WyJpbXBvcnQgeyBidWlsZFN5bmMsIGluaXRNYWluIH0gZnJvbSAnY2FsaWJyZS1vcGRzL2xpYic7XG5pbXBvcnQgeyBPUERTVjEgfSBmcm9tICdvcGRzLWV4dHJhJztcbmltcG9ydCB7IEVudW1MaW5rUmVsLCBFbnVtTUlNRSB9IGZyb20gJ29wZHMtZXh0cmEvbGliL2NvbnN0JztcbmltcG9ydCB7IExpbmsgfSBmcm9tICdvcGRzLWV4dHJhL2xpYi92MS9jb3JlJztcbmltcG9ydCBsb2FkQ2FjaGUsIHsgc2l0ZUlEIH0gZnJvbSAnLi9sb2FkJztcbmltcG9ydCB7IGNyZWF0ZUZyb21KU09OLCBJRmlsdGVyTm92ZWxEYXRhLCBjcmVhdGVNb21lbnQgfSBmcm9tICdAbm9kZS1ub3ZlbC9jYWNoZS1sb2FkZXInO1xuaW1wb3J0IGRvdFZhbHVlczIgZnJvbSAnZG90LXZhbHVlczInXG5pbXBvcnQgTm9kZU5vdmVsSW5mbyBmcm9tICdub2RlLW5vdmVsLWluZm8vY2xhc3MnO1xuaW1wb3J0IHsgbW9tZW50IH0gZnJvbSAnbm92ZWwtZG93bmxvYWRlci9zcmMvc2l0ZSc7XG5pbXBvcnQgTUlNRVR5cGVzIGZyb20gXCJtaW1lLXR5cGVzXCI7XG5pbXBvcnQgYWRkQ292ZXIgZnJvbSAnLi4vb3Bkcy9hZGRDb3Zlcic7XG5pbXBvcnQgeyBtYWtlT1BEU1NoYXJlZCB9IGZyb20gJy4uL29wZHMvaW5kZXgnO1xuaW1wb3J0IHsgSUZpbHRlck5vdmVsRGF0YVBsdXMgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IGFkZE9wZW5TZWFyY2ggfSBmcm9tICcuLi9vcGRzL3NlYXJjaCc7XG5pbXBvcnQgeyBJU2l0ZUlEcyB9IGZyb20gJy4uL25vdmVsLWNhY2hlL3R5cGVzJztcblxuZXhwb3J0IGxldCBwcmVmaXggPSBgL2RlbW9gO1xuZXhwb3J0IGxldCBwcmVmaXhSb290ID0gYC9vcGRzYCArIHByZWZpeDtcbmV4cG9ydCBsZXQgdGl0bGUgPSBgZGVtb25vdmVsYDtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1ha2VPUERTVHlwZSh0eXBlOiBzdHJpbmcpXG57XG5cdGxldCBmZWVkID0gYXdhaXQgbWFrZU9QRFNQb3J0YWwoKTtcblxuXHQvL2xldCBtYWluQ2FjaGUgPSBhd2FpdCBsb2FkQ2FjaGUoKTtcblx0bGV0IHJhd1VybCA9ICdodHRwczovL2dpdGxhYi5jb20vZGVtb25vdmVsL2VwdWItdHh0L3Jhdy9tYXN0ZXIvJztcblxuXHRzd2l0Y2ggKHR5cGUpXG5cdHtcblx0XHRkZWZhdWx0OlxuXG5cdFx0XHRhd2FpdCBsb2FkQ2FjaGU8SUZpbHRlck5vdmVsRGF0YVBsdXNbXT4oJ2FycmF5Lmpzb24nKVxuXHRcdFx0XHQuZWFjaCgobm92ZWwsIGlkKSA9PiB7XG5cblx0XHRcdFx0XHRpZiAoIW5vdmVsLmNhY2hlLmVwdWJfYmFzZW5hbWUpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGxldCBocmVmID0gbmV3IFVSTChbXG5cdFx0XHRcdFx0XHRub3ZlbC5wYXRoTWFpbl9iYXNlLFxuXHRcdFx0XHRcdFx0bm92ZWwuY2FjaGUuZXB1Yl9iYXNlbmFtZSxcblx0XHRcdFx0XHRdLmpvaW4oJy8nKSwgcmF3VXJsKTtcblxuXHRcdFx0XHRcdGxldCBsaW5rcyA9IFtcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0cmVsOiBFbnVtTGlua1JlbC5BQ1FVSVNJVElPTixcblx0XHRcdFx0XHRcdFx0aHJlZixcblx0XHRcdFx0XHRcdFx0dHlwZTogRW51bU1JTUUuZXB1Yixcblx0XHRcdFx0XHRcdH0gYXMgYW55XG5cdFx0XHRcdFx0XTtcblxuXHRcdFx0XHRcdGlmIChub3ZlbC5tZGNvbmYubm92ZWwgJiYgbm92ZWwubWRjb25mLm5vdmVsLmNvdmVyKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGxpbmtzLnB1c2goLi4uYWRkQ292ZXIobm92ZWwubWRjb25mLm5vdmVsLmNvdmVyKSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0bGV0IGVudHJ5ID0gT1BEU1YxLkVudHJ5LmRlc2VyaWFsaXplPE9QRFNWMS5FbnRyeT4oe1xuXHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdFx0dGl0bGU6IG5vdmVsLnRpdGxlLFxuXHRcdFx0XHRcdFx0bGlua3MsXG5cdFx0XHRcdFx0XHRpZGVudGlmaWVyOiBgYm9vayR7aWR9YCxcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGlmIChub3ZlbC5jYWNoZS5lcHViX2RhdGUpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0ZW50cnkudXBkYXRlZCA9IGNyZWF0ZU1vbWVudChub3ZlbC5jYWNoZS5lcHViX2RhdGUpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChub3ZlbC5hdXRob3JzICYmIG5vdmVsLmF1dGhvcnMubGVuZ3RoKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdGVudHJ5LmF1dGhvcnMgPSBub3ZlbC5hdXRob3JzLm1hcChuYW1lID0+ICh7bmFtZX0pKVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChub3ZlbC5tZGNvbmYubm92ZWwgJiYgbm92ZWwubWRjb25mLm5vdmVsLnByZWZhY2UpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdFx0Ly9lbnRyeS5zdW1tYXJ5ID0gbm92ZWwubWRjb25mLm5vdmVsLnByZWZhY2U7XG5cblx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdGVudHJ5LmNvbnRlbnQgPSB7XG5cdFx0XHRcdFx0XHRcdHZhbHVlOiBub3ZlbC5tZGNvbmYubm92ZWwucHJlZmFjZVxuXHRcdFx0XHRcdFx0XHRcdC5yZXBsYWNlKC9cXG4vZywgJzxici8+Jylcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRlbnRyeS5zdWJ0aXRsZSA9IG5vdmVsLm1kY29uZi5ub3ZlbC50aXRsZTtcblxuXHRcdFx0XHRcdGZlZWQuYm9va3MucHVzaChlbnRyeSk7XG5cdFx0XHRcdH0pXG5cdFx0XHQ7XG5cblx0fVxuXG5cdHJldHVybiBmZWVkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlT1BEU1BvcnRhbCgpXG57XG5cdHJldHVybiBidWlsZFN5bmMoaW5pdE1haW4oe1xuXHRcdHRpdGxlLFxuXHRcdHN1YnRpdGxlOiBgYCxcblx0XHRpY29uOiAnL2Zhdmljb24uaWNvJyxcblx0fSksIFtcblxuXHRcdChmZWVkKSA9PiBhZGRPcGVuU2VhcmNoKGZlZWQsIHNpdGVJRCksXG5cblx0XHRtYWtlT1BEU1NoYXJlZCxcblxuXHRcdChmZWVkKSA9PlxuXHRcdHtcblxuXHRcdFx0ZmVlZC5ib29rcy5wdXNoKE9QRFNWMS5FbnRyeS5kZXNlcmlhbGl6ZTxPUERTVjEuRW50cnk+KHtcblx0XHRcdFx0dGl0bGU6IGDmm7jluqvvvJoke3NpdGVJRH1gLFxuXHRcdFx0XHRsaW5rczogW1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGhyZWY6IGAke3ByZWZpeFJvb3R9LnhtbGAsXG5cdFx0XHRcdFx0XHR0aXRsZTogRW51bUxpbmtSZWwuQUxURVJOQVRFLFxuXHRcdFx0XHRcdFx0dHlwZTogRW51bU1JTUUuT1BEU19DQVRBTE9HX0ZFRURfRE9DVU1FTlQsXG5cdFx0XHRcdFx0fSBhcyBMaW5rLFxuXHRcdFx0XHRdLFxuXHRcdFx0fSkpO1xuXG5cdFx0XHRmZWVkLmJvb2tzLnB1c2goT1BEU1YxLkVudHJ5LmRlc2VyaWFsaXplPE9QRFNWMS5FbnRyeT4oe1xuXHRcdFx0XHR0aXRsZTogYOWFqOmDqOWIl+ihqGAsXG5cdFx0XHRcdGxpbmtzOiBbXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aHJlZjogYCR7cHJlZml4Um9vdH0vYWxsLnhtbGAsXG5cdFx0XHRcdFx0XHR0aXRsZTogRW51bUxpbmtSZWwuQUxURVJOQVRFLFxuXHRcdFx0XHRcdFx0dHlwZTogRW51bU1JTUUuT1BEU19DQVRBTE9HX0ZFRURfRE9DVU1FTlQsXG5cdFx0XHRcdFx0fSBhcyBMaW5rLFxuXHRcdFx0XHRdLFxuXHRcdFx0fSkpO1xuXG5cdFx0XHRyZXR1cm4gZmVlZFxuXHRcdH0sXG5cdF0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IG1ha2VPUERTUG9ydGFsXG4iXX0=