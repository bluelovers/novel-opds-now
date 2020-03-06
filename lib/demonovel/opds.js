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
exports.prefix = `/demo`;
exports.prefixRoot = `/opds` + exports.prefix;
exports.title = `demonovel`;
async function makeOPDSType(type) {
    let feed = await makeOPDSPortal();
    let rawUrl = 'https://gitlab.com/demonovel/epub-txt/raw/master/';
    switch (type) {
        default:
            await load_1.default('array.json')
                .each(novel => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3Bkcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9wZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDBDQUF1RDtBQUN2RCwyQ0FBb0M7QUFDcEMsZ0RBQTZEO0FBRTdELCtDQUEyQztBQUMzQywyREFBMEY7QUFLMUYsZ0VBQXdDO0FBQ3hDLHlDQUErQztBQUdwQyxRQUFBLE1BQU0sR0FBRyxPQUFPLENBQUM7QUFDakIsUUFBQSxVQUFVLEdBQUcsT0FBTyxHQUFHLGNBQU0sQ0FBQztBQUM5QixRQUFBLEtBQUssR0FBRyxXQUFXLENBQUM7QUFFeEIsS0FBSyxVQUFVLFlBQVksQ0FBQyxJQUFZO0lBRTlDLElBQUksSUFBSSxHQUFHLE1BQU0sY0FBYyxFQUFFLENBQUM7SUFHbEMsSUFBSSxNQUFNLEdBQUcsbURBQW1ELENBQUM7SUFFakUsUUFBUSxJQUFJLEVBQ1o7UUFDQztZQUVDLE1BQU0sY0FBUyxDQUF5QixZQUFZLENBQUM7aUJBQ25ELElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFFYixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQzlCO29CQUNDLE9BQU87aUJBQ1A7Z0JBRUQsSUFBSSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUM7b0JBQ2xCLEtBQUssQ0FBQyxhQUFhO29CQUNuQixLQUFLLENBQUMsS0FBSyxDQUFDLGFBQWE7aUJBQ3pCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUVyQixJQUFJLEtBQUssR0FBRztvQkFDWDt3QkFDQyxHQUFHLEVBQUUsbUJBQVcsQ0FBQyxXQUFXO3dCQUM1QixJQUFJO3dCQUNKLElBQUksRUFBRSxnQkFBUSxDQUFDLElBQUk7cUJBQ1o7aUJBQ1IsQ0FBQztnQkFFRixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFDbEQ7b0JBQ0MsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLGtCQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztpQkFDbEQ7Z0JBRUQsSUFBSSxLQUFLLEdBQUcsbUJBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFlO29CQUVsRCxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUs7b0JBQ2xCLEtBQUs7aUJBQ0wsQ0FBQyxDQUFDO2dCQUVILElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQ3pCO29CQUNDLEtBQUssQ0FBQyxPQUFPLEdBQUcsMkJBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2lCQUNwRDtnQkFFRCxJQUFJLEtBQUssQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQ3pDO29CQUVDLEtBQUssQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFBO2lCQUNuRDtnQkFFRCxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFDcEQ7b0JBS0MsS0FBSyxDQUFDLE9BQU8sR0FBRzt3QkFDZixLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTzs2QkFDL0IsT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUM7cUJBQ3pCLENBQUE7aUJBQ0Q7Z0JBRUQsS0FBSyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7Z0JBRTFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hCLENBQUMsQ0FBQyxDQUNGO0tBRUY7SUFFRCxPQUFPLElBQUksQ0FBQTtBQUNaLENBQUM7QUEzRUQsb0NBMkVDO0FBRUQsU0FBZ0IsY0FBYztJQUU3QixPQUFPLGVBQVMsQ0FBQyxjQUFRLENBQUM7UUFDekIsS0FBSyxFQUFMLGFBQUs7UUFDTCxRQUFRLEVBQUUsRUFBRTtRQUNaLElBQUksRUFBRSxjQUFjO0tBQ3BCLENBQUMsRUFBRTtRQUVILHNCQUFjO1FBRWQsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUdSLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLG1CQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBZTtnQkFDdEQsS0FBSyxFQUFFLE1BQU0sYUFBTSxFQUFFO2dCQUNyQixLQUFLLEVBQUU7b0JBQ047d0JBQ0MsSUFBSSxFQUFFLEdBQUcsa0JBQVUsTUFBTTt3QkFDekIsS0FBSyxFQUFFLG1CQUFXLENBQUMsU0FBUzt3QkFDNUIsSUFBSSxFQUFFLGdCQUFRLENBQUMsMEJBQTBCO3FCQUNqQztpQkFDVDthQUNELENBQUMsQ0FBQyxDQUFDO1lBRUosSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsbUJBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFlO2dCQUN0RCxLQUFLLEVBQUUsTUFBTTtnQkFDYixLQUFLLEVBQUU7b0JBQ047d0JBQ0MsSUFBSSxFQUFFLEdBQUcsa0JBQVUsVUFBVTt3QkFDN0IsS0FBSyxFQUFFLG1CQUFXLENBQUMsU0FBUzt3QkFDNUIsSUFBSSxFQUFFLGdCQUFRLENBQUMsMEJBQTBCO3FCQUNqQztpQkFDVDthQUNELENBQUMsQ0FBQyxDQUFDO1lBRUosT0FBTyxJQUFJLENBQUE7UUFDWixDQUFDO0tBQ0QsQ0FBQyxDQUFBO0FBQ0gsQ0FBQztBQXRDRCx3Q0FzQ0M7QUFFRCxrQkFBZSxjQUFjLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBidWlsZFN5bmMsIGluaXRNYWluIH0gZnJvbSAnY2FsaWJyZS1vcGRzL2xpYic7XG5pbXBvcnQgeyBPUERTVjEgfSBmcm9tICdvcGRzLWV4dHJhJztcbmltcG9ydCB7IEVudW1MaW5rUmVsLCBFbnVtTUlNRSB9IGZyb20gJ29wZHMtZXh0cmEvbGliL2NvbnN0JztcbmltcG9ydCB7IExpbmsgfSBmcm9tICdvcGRzLWV4dHJhL2xpYi92MS9jb3JlJztcbmltcG9ydCBsb2FkQ2FjaGUsIHsgc2l0ZUlEIH0gZnJvbSAnLi9sb2FkJztcbmltcG9ydCB7IGNyZWF0ZUZyb21KU09OLCBJRmlsdGVyTm92ZWxEYXRhLCBjcmVhdGVNb21lbnQgfSBmcm9tICdAbm9kZS1ub3ZlbC9jYWNoZS1sb2FkZXInO1xuaW1wb3J0IGRvdFZhbHVlczIgZnJvbSAnZG90LXZhbHVlczInXG5pbXBvcnQgTm9kZU5vdmVsSW5mbyBmcm9tICdub2RlLW5vdmVsLWluZm8vY2xhc3MnO1xuaW1wb3J0IHsgbW9tZW50IH0gZnJvbSAnbm92ZWwtZG93bmxvYWRlci9zcmMvc2l0ZSc7XG5pbXBvcnQgTUlNRVR5cGVzIGZyb20gXCJtaW1lLXR5cGVzXCI7XG5pbXBvcnQgYWRkQ292ZXIgZnJvbSAnLi4vb3Bkcy9hZGRDb3Zlcic7XG5pbXBvcnQgeyBtYWtlT1BEU1NoYXJlZCB9IGZyb20gJy4uL29wZHMvaW5kZXgnO1xuaW1wb3J0IHsgSUZpbHRlck5vdmVsRGF0YVBsdXMgfSBmcm9tICcuL3R5cGVzJztcblxuZXhwb3J0IGxldCBwcmVmaXggPSBgL2RlbW9gO1xuZXhwb3J0IGxldCBwcmVmaXhSb290ID0gYC9vcGRzYCArIHByZWZpeDtcbmV4cG9ydCBsZXQgdGl0bGUgPSBgZGVtb25vdmVsYDtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1ha2VPUERTVHlwZSh0eXBlOiBzdHJpbmcpXG57XG5cdGxldCBmZWVkID0gYXdhaXQgbWFrZU9QRFNQb3J0YWwoKTtcblxuXHQvL2xldCBtYWluQ2FjaGUgPSBhd2FpdCBsb2FkQ2FjaGUoKTtcblx0bGV0IHJhd1VybCA9ICdodHRwczovL2dpdGxhYi5jb20vZGVtb25vdmVsL2VwdWItdHh0L3Jhdy9tYXN0ZXIvJztcblxuXHRzd2l0Y2ggKHR5cGUpXG5cdHtcblx0XHRkZWZhdWx0OlxuXG5cdFx0XHRhd2FpdCBsb2FkQ2FjaGU8SUZpbHRlck5vdmVsRGF0YVBsdXNbXT4oJ2FycmF5Lmpzb24nKVxuXHRcdFx0XHQuZWFjaChub3ZlbCA9PiB7XG5cblx0XHRcdFx0XHRpZiAoIW5vdmVsLmNhY2hlLmVwdWJfYmFzZW5hbWUpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGxldCBocmVmID0gbmV3IFVSTChbXG5cdFx0XHRcdFx0XHRub3ZlbC5wYXRoTWFpbl9iYXNlLFxuXHRcdFx0XHRcdFx0bm92ZWwuY2FjaGUuZXB1Yl9iYXNlbmFtZSxcblx0XHRcdFx0XHRdLmpvaW4oJy8nKSwgcmF3VXJsKTtcblxuXHRcdFx0XHRcdGxldCBsaW5rcyA9IFtcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0cmVsOiBFbnVtTGlua1JlbC5BQ1FVSVNJVElPTixcblx0XHRcdFx0XHRcdFx0aHJlZixcblx0XHRcdFx0XHRcdFx0dHlwZTogRW51bU1JTUUuZXB1Yixcblx0XHRcdFx0XHRcdH0gYXMgYW55XG5cdFx0XHRcdFx0XTtcblxuXHRcdFx0XHRcdGlmIChub3ZlbC5tZGNvbmYubm92ZWwgJiYgbm92ZWwubWRjb25mLm5vdmVsLmNvdmVyKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGxpbmtzLnB1c2goLi4uYWRkQ292ZXIobm92ZWwubWRjb25mLm5vdmVsLmNvdmVyKSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0bGV0IGVudHJ5ID0gT1BEU1YxLkVudHJ5LmRlc2VyaWFsaXplPE9QRFNWMS5FbnRyeT4oe1xuXHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdFx0dGl0bGU6IG5vdmVsLnRpdGxlLFxuXHRcdFx0XHRcdFx0bGlua3MsXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRpZiAobm92ZWwuY2FjaGUuZXB1Yl9kYXRlKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGVudHJ5LnVwZGF0ZWQgPSBjcmVhdGVNb21lbnQobm92ZWwuY2FjaGUuZXB1Yl9kYXRlKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAobm92ZWwuYXV0aG9ycyAmJiBub3ZlbC5hdXRob3JzLmxlbmd0aClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0XHRlbnRyeS5hdXRob3JzID0gbm92ZWwuYXV0aG9ycy5tYXAobmFtZSA9PiAoe25hbWV9KSlcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAobm92ZWwubWRjb25mLm5vdmVsICYmIG5vdmVsLm1kY29uZi5ub3ZlbC5wcmVmYWNlKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdC8vZW50cnkuc3VtbWFyeSA9IG5vdmVsLm1kY29uZi5ub3ZlbC5wcmVmYWNlO1xuXG5cdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0XHRlbnRyeS5jb250ZW50ID0ge1xuXHRcdFx0XHRcdFx0XHR2YWx1ZTogbm92ZWwubWRjb25mLm5vdmVsLnByZWZhY2Vcblx0XHRcdFx0XHRcdFx0XHQucmVwbGFjZSgvXFxuL2csICc8YnIvPicpXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0ZW50cnkuc3VidGl0bGUgPSBub3ZlbC5tZGNvbmYubm92ZWwudGl0bGU7XG5cblx0XHRcdFx0XHRmZWVkLmJvb2tzLnB1c2goZW50cnkpO1xuXHRcdFx0XHR9KVxuXHRcdFx0O1xuXG5cdH1cblxuXHRyZXR1cm4gZmVlZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZU9QRFNQb3J0YWwoKVxue1xuXHRyZXR1cm4gYnVpbGRTeW5jKGluaXRNYWluKHtcblx0XHR0aXRsZSxcblx0XHRzdWJ0aXRsZTogYGAsXG5cdFx0aWNvbjogJy9mYXZpY29uLmljbycsXG5cdH0pLCBbXG5cblx0XHRtYWtlT1BEU1NoYXJlZCxcblxuXHRcdChmZWVkKSA9PlxuXHRcdHtcblxuXHRcdFx0ZmVlZC5ib29rcy5wdXNoKE9QRFNWMS5FbnRyeS5kZXNlcmlhbGl6ZTxPUERTVjEuRW50cnk+KHtcblx0XHRcdFx0dGl0bGU6IGDmm7jluqvvvJoke3NpdGVJRH1gLFxuXHRcdFx0XHRsaW5rczogW1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGhyZWY6IGAke3ByZWZpeFJvb3R9LnhtbGAsXG5cdFx0XHRcdFx0XHR0aXRsZTogRW51bUxpbmtSZWwuQUxURVJOQVRFLFxuXHRcdFx0XHRcdFx0dHlwZTogRW51bU1JTUUuT1BEU19DQVRBTE9HX0ZFRURfRE9DVU1FTlQsXG5cdFx0XHRcdFx0fSBhcyBMaW5rLFxuXHRcdFx0XHRdLFxuXHRcdFx0fSkpO1xuXG5cdFx0XHRmZWVkLmJvb2tzLnB1c2goT1BEU1YxLkVudHJ5LmRlc2VyaWFsaXplPE9QRFNWMS5FbnRyeT4oe1xuXHRcdFx0XHR0aXRsZTogYOWFqOmDqOWIl+ihqGAsXG5cdFx0XHRcdGxpbmtzOiBbXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aHJlZjogYCR7cHJlZml4Um9vdH0vYWxsLnhtbGAsXG5cdFx0XHRcdFx0XHR0aXRsZTogRW51bUxpbmtSZWwuQUxURVJOQVRFLFxuXHRcdFx0XHRcdFx0dHlwZTogRW51bU1JTUUuT1BEU19DQVRBTE9HX0ZFRURfRE9DVU1FTlQsXG5cdFx0XHRcdFx0fSBhcyBMaW5rLFxuXHRcdFx0XHRdLFxuXHRcdFx0fSkpO1xuXG5cdFx0XHRyZXR1cm4gZmVlZFxuXHRcdH0sXG5cdF0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IG1ha2VPUERTUG9ydGFsXG4iXX0=