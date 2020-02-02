"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("calibre-opds/lib");
const opds_extra_1 = require("opds-extra");
const const_1 = require("opds-extra/lib/const");
const load_1 = __importStar(require("./load"));
const cache_loader_1 = require("@node-novel/cache-loader");
const addCover_1 = __importDefault(require("../opds/addCover"));
exports.prefix = `/demo`;
exports.prefixRoot = `/opds` + exports.prefix;
exports.title = `demonovel`;
async function makeOPDSType(type) {
    let feed = makeOPDSPortal();
    let rawUrl = 'https://gitlab.com/demonovel/epub-txt/raw/master/';
    switch (type) {
        default:
            await load_1.default('array.json')
                .each(novel => {
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
        (feed) => {
            feed.books = feed.books || [];
            feed.books.push(opds_extra_1.OPDSV1.Entry.deserialize({
                title: `所有書庫`,
                links: [
                    {
                        href: `/opds`,
                        title: const_1.EnumLinkRel.ALTERNATE,
                        type: const_1.EnumMIME.OPDS_CATALOG_FEED_DOCUMENT,
                    },
                ],
            }));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3Bkcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9wZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsMENBQXVEO0FBQ3ZELDJDQUFvQztBQUNwQyxnREFBNkQ7QUFFN0QsK0NBQTJDO0FBQzNDLDJEQUEwRjtBQUsxRixnRUFBd0M7QUFFN0IsUUFBQSxNQUFNLEdBQUcsT0FBTyxDQUFDO0FBQ2pCLFFBQUEsVUFBVSxHQUFHLE9BQU8sR0FBRyxjQUFNLENBQUM7QUFDOUIsUUFBQSxLQUFLLEdBQUcsV0FBVyxDQUFDO0FBRXhCLEtBQUssVUFBVSxZQUFZLENBQUMsSUFBWTtJQUU5QyxJQUFJLElBQUksR0FBRyxjQUFjLEVBQUUsQ0FBQztJQUc1QixJQUFJLE1BQU0sR0FBRyxtREFBbUQsQ0FBQztJQUVqRSxRQUFRLElBQUksRUFDWjtRQUNDO1lBRUMsTUFBTSxjQUFTLENBQXFCLFlBQVksQ0FBQztpQkFDL0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUViLElBQUksSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDO29CQUNsQixLQUFLLENBQUMsYUFBYTtvQkFDbkIsS0FBSyxDQUFDLEtBQUssQ0FBQyxhQUFhO2lCQUN6QixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFFckIsSUFBSSxLQUFLLEdBQUc7b0JBQ1g7d0JBQ0MsR0FBRyxFQUFFLG1CQUFXLENBQUMsV0FBVzt3QkFDNUIsSUFBSTt3QkFDSixJQUFJLEVBQUUsZ0JBQVEsQ0FBQyxJQUFJO3FCQUNaO2lCQUNSLENBQUM7Z0JBRUYsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQ2xEO29CQUNDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxrQkFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7aUJBQ2xEO2dCQUVELElBQUksS0FBSyxHQUFHLG1CQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBZTtvQkFFbEQsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLO29CQUNsQixLQUFLO2lCQUNMLENBQUMsQ0FBQztnQkFFSCxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUN6QjtvQkFDQyxLQUFLLENBQUMsT0FBTyxHQUFHLDJCQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztpQkFDcEQ7Z0JBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEIsQ0FBQyxDQUFDLENBQ0Y7S0FFRjtJQUVELE9BQU8sSUFBSSxDQUFBO0FBQ1osQ0FBQztBQWxERCxvQ0FrREM7QUFFRCxTQUFnQixjQUFjO0lBRTdCLE9BQU8sZUFBUyxDQUFDLGNBQVEsQ0FBQztRQUN6QixLQUFLLEVBQUwsYUFBSztRQUNMLFFBQVEsRUFBRSxFQUFFO1FBQ1osSUFBSSxFQUFFLGNBQWM7S0FDcEIsQ0FBQyxFQUFFO1FBRUgsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUVSLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7WUFFOUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsbUJBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFlO2dCQUN0RCxLQUFLLEVBQUUsTUFBTTtnQkFDYixLQUFLLEVBQUU7b0JBQ047d0JBQ0MsSUFBSSxFQUFFLE9BQU87d0JBQ2IsS0FBSyxFQUFFLG1CQUFXLENBQUMsU0FBUzt3QkFDNUIsSUFBSSxFQUFFLGdCQUFRLENBQUMsMEJBQTBCO3FCQUNqQztpQkFDVDthQUNELENBQUMsQ0FBQyxDQUFDO1lBRUosSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsbUJBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFlO2dCQUN0RCxLQUFLLEVBQUUsTUFBTSxhQUFNLEVBQUU7Z0JBQ3JCLEtBQUssRUFBRTtvQkFDTjt3QkFDQyxJQUFJLEVBQUUsR0FBRyxrQkFBVSxNQUFNO3dCQUN6QixLQUFLLEVBQUUsbUJBQVcsQ0FBQyxTQUFTO3dCQUM1QixJQUFJLEVBQUUsZ0JBQVEsQ0FBQywwQkFBMEI7cUJBQ2pDO2lCQUNUO2FBQ0QsQ0FBQyxDQUFDLENBQUM7WUFFSixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQWU7Z0JBQ3RELEtBQUssRUFBRSxNQUFNO2dCQUNiLEtBQUssRUFBRTtvQkFDTjt3QkFDQyxJQUFJLEVBQUUsR0FBRyxrQkFBVSxVQUFVO3dCQUM3QixLQUFLLEVBQUUsbUJBQVcsQ0FBQyxTQUFTO3dCQUM1QixJQUFJLEVBQUUsZ0JBQVEsQ0FBQywwQkFBMEI7cUJBQ2pDO2lCQUNUO2FBQ0QsQ0FBQyxDQUFDLENBQUM7WUFFSixPQUFPLElBQUksQ0FBQTtRQUNaLENBQUM7S0FDRCxDQUFDLENBQUE7QUFDSCxDQUFDO0FBaERELHdDQWdEQztBQUVELGtCQUFlLGNBQWMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJ1aWxkU3luYywgaW5pdE1haW4gfSBmcm9tICdjYWxpYnJlLW9wZHMvbGliJztcbmltcG9ydCB7IE9QRFNWMSB9IGZyb20gJ29wZHMtZXh0cmEnO1xuaW1wb3J0IHsgRW51bUxpbmtSZWwsIEVudW1NSU1FIH0gZnJvbSAnb3Bkcy1leHRyYS9saWIvY29uc3QnO1xuaW1wb3J0IHsgTGluayB9IGZyb20gJ29wZHMtZXh0cmEvbGliL3YxL2NvcmUnO1xuaW1wb3J0IGxvYWRDYWNoZSwgeyBzaXRlSUQgfSBmcm9tICcuL2xvYWQnO1xuaW1wb3J0IHsgY3JlYXRlRnJvbUpTT04sIElGaWx0ZXJOb3ZlbERhdGEsIGNyZWF0ZU1vbWVudCB9IGZyb20gJ0Bub2RlLW5vdmVsL2NhY2hlLWxvYWRlcic7XG5pbXBvcnQgZG90VmFsdWVzMiBmcm9tICdkb3QtdmFsdWVzMidcbmltcG9ydCBOb2RlTm92ZWxJbmZvIGZyb20gJ25vZGUtbm92ZWwtaW5mby9jbGFzcyc7XG5pbXBvcnQgeyBtb21lbnQgfSBmcm9tICdub3ZlbC1kb3dubG9hZGVyL3NyYy9zaXRlJztcbmltcG9ydCBNSU1FVHlwZXMgZnJvbSBcIm1pbWUtdHlwZXNcIjtcbmltcG9ydCBhZGRDb3ZlciBmcm9tICcuLi9vcGRzL2FkZENvdmVyJztcblxuZXhwb3J0IGxldCBwcmVmaXggPSBgL2RlbW9gO1xuZXhwb3J0IGxldCBwcmVmaXhSb290ID0gYC9vcGRzYCArIHByZWZpeDtcbmV4cG9ydCBsZXQgdGl0bGUgPSBgZGVtb25vdmVsYDtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1ha2VPUERTVHlwZSh0eXBlOiBzdHJpbmcpXG57XG5cdGxldCBmZWVkID0gbWFrZU9QRFNQb3J0YWwoKTtcblxuXHQvL2xldCBtYWluQ2FjaGUgPSBhd2FpdCBsb2FkQ2FjaGUoKTtcblx0bGV0IHJhd1VybCA9ICdodHRwczovL2dpdGxhYi5jb20vZGVtb25vdmVsL2VwdWItdHh0L3Jhdy9tYXN0ZXIvJztcblxuXHRzd2l0Y2ggKHR5cGUpXG5cdHtcblx0XHRkZWZhdWx0OlxuXG5cdFx0XHRhd2FpdCBsb2FkQ2FjaGU8SUZpbHRlck5vdmVsRGF0YVtdPignYXJyYXkuanNvbicpXG5cdFx0XHRcdC5lYWNoKG5vdmVsID0+IHtcblxuXHRcdFx0XHRcdGxldCBocmVmID0gbmV3IFVSTChbXG5cdFx0XHRcdFx0XHRub3ZlbC5wYXRoTWFpbl9iYXNlLFxuXHRcdFx0XHRcdFx0bm92ZWwuY2FjaGUuZXB1Yl9iYXNlbmFtZSxcblx0XHRcdFx0XHRdLmpvaW4oJy8nKSwgcmF3VXJsKTtcblxuXHRcdFx0XHRcdGxldCBsaW5rcyA9IFtcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0cmVsOiBFbnVtTGlua1JlbC5BQ1FVSVNJVElPTixcblx0XHRcdFx0XHRcdFx0aHJlZixcblx0XHRcdFx0XHRcdFx0dHlwZTogRW51bU1JTUUuZXB1Yixcblx0XHRcdFx0XHRcdH0gYXMgYW55XG5cdFx0XHRcdFx0XTtcblxuXHRcdFx0XHRcdGlmIChub3ZlbC5tZGNvbmYubm92ZWwgJiYgbm92ZWwubWRjb25mLm5vdmVsLmNvdmVyKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGxpbmtzLnB1c2goLi4uYWRkQ292ZXIobm92ZWwubWRjb25mLm5vdmVsLmNvdmVyKSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0bGV0IGVudHJ5ID0gT1BEU1YxLkVudHJ5LmRlc2VyaWFsaXplPE9QRFNWMS5FbnRyeT4oe1xuXHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdFx0dGl0bGU6IG5vdmVsLnRpdGxlLFxuXHRcdFx0XHRcdFx0bGlua3MsXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRpZiAobm92ZWwuY2FjaGUuZXB1Yl9kYXRlKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGVudHJ5LnVwZGF0ZWQgPSBjcmVhdGVNb21lbnQobm92ZWwuY2FjaGUuZXB1Yl9kYXRlKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRmZWVkLmJvb2tzLnB1c2goZW50cnkpO1xuXHRcdFx0XHR9KVxuXHRcdFx0O1xuXG5cdH1cblxuXHRyZXR1cm4gZmVlZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZU9QRFNQb3J0YWwoKVxue1xuXHRyZXR1cm4gYnVpbGRTeW5jKGluaXRNYWluKHtcblx0XHR0aXRsZSxcblx0XHRzdWJ0aXRsZTogYGAsXG5cdFx0aWNvbjogJy9mYXZpY29uLmljbycsXG5cdH0pLCBbXG5cblx0XHQoZmVlZCkgPT5cblx0XHR7XG5cdFx0XHRmZWVkLmJvb2tzID0gZmVlZC5ib29rcyB8fCBbXTtcblxuXHRcdFx0ZmVlZC5ib29rcy5wdXNoKE9QRFNWMS5FbnRyeS5kZXNlcmlhbGl6ZTxPUERTVjEuRW50cnk+KHtcblx0XHRcdFx0dGl0bGU6IGDmiYDmnInmm7jluqtgLFxuXHRcdFx0XHRsaW5rczogW1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGhyZWY6IGAvb3Bkc2AsXG5cdFx0XHRcdFx0XHR0aXRsZTogRW51bUxpbmtSZWwuQUxURVJOQVRFLFxuXHRcdFx0XHRcdFx0dHlwZTogRW51bU1JTUUuT1BEU19DQVRBTE9HX0ZFRURfRE9DVU1FTlQsXG5cdFx0XHRcdFx0fSBhcyBMaW5rLFxuXHRcdFx0XHRdLFxuXHRcdFx0fSkpO1xuXG5cdFx0XHRmZWVkLmJvb2tzLnB1c2goT1BEU1YxLkVudHJ5LmRlc2VyaWFsaXplPE9QRFNWMS5FbnRyeT4oe1xuXHRcdFx0XHR0aXRsZTogYOabuOW6q++8miR7c2l0ZUlEfWAsXG5cdFx0XHRcdGxpbmtzOiBbXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aHJlZjogYCR7cHJlZml4Um9vdH0ueG1sYCxcblx0XHRcdFx0XHRcdHRpdGxlOiBFbnVtTGlua1JlbC5BTFRFUk5BVEUsXG5cdFx0XHRcdFx0XHR0eXBlOiBFbnVtTUlNRS5PUERTX0NBVEFMT0dfRkVFRF9ET0NVTUVOVCxcblx0XHRcdFx0XHR9IGFzIExpbmssXG5cdFx0XHRcdF0sXG5cdFx0XHR9KSk7XG5cblx0XHRcdGZlZWQuYm9va3MucHVzaChPUERTVjEuRW50cnkuZGVzZXJpYWxpemU8T1BEU1YxLkVudHJ5Pih7XG5cdFx0XHRcdHRpdGxlOiBg5YWo6YOo5YiX6KGoYCxcblx0XHRcdFx0bGlua3M6IFtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRocmVmOiBgJHtwcmVmaXhSb290fS9hbGwueG1sYCxcblx0XHRcdFx0XHRcdHRpdGxlOiBFbnVtTGlua1JlbC5BTFRFUk5BVEUsXG5cdFx0XHRcdFx0XHR0eXBlOiBFbnVtTUlNRS5PUERTX0NBVEFMT0dfRkVFRF9ET0NVTUVOVCxcblx0XHRcdFx0XHR9IGFzIExpbmssXG5cdFx0XHRcdF0sXG5cdFx0XHR9KSk7XG5cblx0XHRcdHJldHVybiBmZWVkXG5cdFx0fSxcblx0XSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWFrZU9QRFNQb3J0YWxcbiJdfQ==