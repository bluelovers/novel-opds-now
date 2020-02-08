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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3Bkcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9wZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsMENBQXVEO0FBQ3ZELDJDQUFvQztBQUNwQyxnREFBNkQ7QUFFN0QsK0NBQTJDO0FBQzNDLDJEQUEwRjtBQUsxRixnRUFBd0M7QUFDeEMseUNBQStDO0FBR3BDLFFBQUEsTUFBTSxHQUFHLE9BQU8sQ0FBQztBQUNqQixRQUFBLFVBQVUsR0FBRyxPQUFPLEdBQUcsY0FBTSxDQUFDO0FBQzlCLFFBQUEsS0FBSyxHQUFHLFdBQVcsQ0FBQztBQUV4QixLQUFLLFVBQVUsWUFBWSxDQUFDLElBQVk7SUFFOUMsSUFBSSxJQUFJLEdBQUcsTUFBTSxjQUFjLEVBQUUsQ0FBQztJQUdsQyxJQUFJLE1BQU0sR0FBRyxtREFBbUQsQ0FBQztJQUVqRSxRQUFRLElBQUksRUFDWjtRQUNDO1lBRUMsTUFBTSxjQUFTLENBQXlCLFlBQVksQ0FBQztpQkFDbkQsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUViLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFDOUI7b0JBQ0MsT0FBTztpQkFDUDtnQkFFRCxJQUFJLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQztvQkFDbEIsS0FBSyxDQUFDLGFBQWE7b0JBQ25CLEtBQUssQ0FBQyxLQUFLLENBQUMsYUFBYTtpQkFDekIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBRXJCLElBQUksS0FBSyxHQUFHO29CQUNYO3dCQUNDLEdBQUcsRUFBRSxtQkFBVyxDQUFDLFdBQVc7d0JBQzVCLElBQUk7d0JBQ0osSUFBSSxFQUFFLGdCQUFRLENBQUMsSUFBSTtxQkFDWjtpQkFDUixDQUFDO2dCQUVGLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUNsRDtvQkFDQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsa0JBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2lCQUNsRDtnQkFFRCxJQUFJLEtBQUssR0FBRyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQWU7b0JBRWxELEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSztvQkFDbEIsS0FBSztpQkFDTCxDQUFDLENBQUM7Z0JBRUgsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFDekI7b0JBQ0MsS0FBSyxDQUFDLE9BQU8sR0FBRywyQkFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7aUJBQ3BEO2dCQUVELElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFDekM7b0JBRUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUE7aUJBQ25EO2dCQUVELElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUNwRDtvQkFLQyxLQUFLLENBQUMsT0FBTyxHQUFHO3dCQUNmLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPOzZCQUMvQixPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQztxQkFDekIsQ0FBQTtpQkFDRDtnQkFFRCxLQUFLLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFFMUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEIsQ0FBQyxDQUFDLENBQ0Y7S0FFRjtJQUVELE9BQU8sSUFBSSxDQUFBO0FBQ1osQ0FBQztBQTNFRCxvQ0EyRUM7QUFFRCxTQUFnQixjQUFjO0lBRTdCLE9BQU8sZUFBUyxDQUFDLGNBQVEsQ0FBQztRQUN6QixLQUFLLEVBQUwsYUFBSztRQUNMLFFBQVEsRUFBRSxFQUFFO1FBQ1osSUFBSSxFQUFFLGNBQWM7S0FDcEIsQ0FBQyxFQUFFO1FBRUgsc0JBQWM7UUFFZCxDQUFDLElBQUksRUFBRSxFQUFFO1lBR1IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsbUJBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFlO2dCQUN0RCxLQUFLLEVBQUUsTUFBTSxhQUFNLEVBQUU7Z0JBQ3JCLEtBQUssRUFBRTtvQkFDTjt3QkFDQyxJQUFJLEVBQUUsR0FBRyxrQkFBVSxNQUFNO3dCQUN6QixLQUFLLEVBQUUsbUJBQVcsQ0FBQyxTQUFTO3dCQUM1QixJQUFJLEVBQUUsZ0JBQVEsQ0FBQywwQkFBMEI7cUJBQ2pDO2lCQUNUO2FBQ0QsQ0FBQyxDQUFDLENBQUM7WUFFSixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQWU7Z0JBQ3RELEtBQUssRUFBRSxNQUFNO2dCQUNiLEtBQUssRUFBRTtvQkFDTjt3QkFDQyxJQUFJLEVBQUUsR0FBRyxrQkFBVSxVQUFVO3dCQUM3QixLQUFLLEVBQUUsbUJBQVcsQ0FBQyxTQUFTO3dCQUM1QixJQUFJLEVBQUUsZ0JBQVEsQ0FBQywwQkFBMEI7cUJBQ2pDO2lCQUNUO2FBQ0QsQ0FBQyxDQUFDLENBQUM7WUFFSixPQUFPLElBQUksQ0FBQTtRQUNaLENBQUM7S0FDRCxDQUFDLENBQUE7QUFDSCxDQUFDO0FBdENELHdDQXNDQztBQUVELGtCQUFlLGNBQWMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJ1aWxkU3luYywgaW5pdE1haW4gfSBmcm9tICdjYWxpYnJlLW9wZHMvbGliJztcbmltcG9ydCB7IE9QRFNWMSB9IGZyb20gJ29wZHMtZXh0cmEnO1xuaW1wb3J0IHsgRW51bUxpbmtSZWwsIEVudW1NSU1FIH0gZnJvbSAnb3Bkcy1leHRyYS9saWIvY29uc3QnO1xuaW1wb3J0IHsgTGluayB9IGZyb20gJ29wZHMtZXh0cmEvbGliL3YxL2NvcmUnO1xuaW1wb3J0IGxvYWRDYWNoZSwgeyBzaXRlSUQgfSBmcm9tICcuL2xvYWQnO1xuaW1wb3J0IHsgY3JlYXRlRnJvbUpTT04sIElGaWx0ZXJOb3ZlbERhdGEsIGNyZWF0ZU1vbWVudCB9IGZyb20gJ0Bub2RlLW5vdmVsL2NhY2hlLWxvYWRlcic7XG5pbXBvcnQgZG90VmFsdWVzMiBmcm9tICdkb3QtdmFsdWVzMidcbmltcG9ydCBOb2RlTm92ZWxJbmZvIGZyb20gJ25vZGUtbm92ZWwtaW5mby9jbGFzcyc7XG5pbXBvcnQgeyBtb21lbnQgfSBmcm9tICdub3ZlbC1kb3dubG9hZGVyL3NyYy9zaXRlJztcbmltcG9ydCBNSU1FVHlwZXMgZnJvbSBcIm1pbWUtdHlwZXNcIjtcbmltcG9ydCBhZGRDb3ZlciBmcm9tICcuLi9vcGRzL2FkZENvdmVyJztcbmltcG9ydCB7IG1ha2VPUERTU2hhcmVkIH0gZnJvbSAnLi4vb3Bkcy9pbmRleCc7XG5pbXBvcnQgeyBJRmlsdGVyTm92ZWxEYXRhUGx1cyB9IGZyb20gJy4vdHlwZXMnO1xuXG5leHBvcnQgbGV0IHByZWZpeCA9IGAvZGVtb2A7XG5leHBvcnQgbGV0IHByZWZpeFJvb3QgPSBgL29wZHNgICsgcHJlZml4O1xuZXhwb3J0IGxldCB0aXRsZSA9IGBkZW1vbm92ZWxgO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFrZU9QRFNUeXBlKHR5cGU6IHN0cmluZylcbntcblx0bGV0IGZlZWQgPSBhd2FpdCBtYWtlT1BEU1BvcnRhbCgpO1xuXG5cdC8vbGV0IG1haW5DYWNoZSA9IGF3YWl0IGxvYWRDYWNoZSgpO1xuXHRsZXQgcmF3VXJsID0gJ2h0dHBzOi8vZ2l0bGFiLmNvbS9kZW1vbm92ZWwvZXB1Yi10eHQvcmF3L21hc3Rlci8nO1xuXG5cdHN3aXRjaCAodHlwZSlcblx0e1xuXHRcdGRlZmF1bHQ6XG5cblx0XHRcdGF3YWl0IGxvYWRDYWNoZTxJRmlsdGVyTm92ZWxEYXRhUGx1c1tdPignYXJyYXkuanNvbicpXG5cdFx0XHRcdC5lYWNoKG5vdmVsID0+IHtcblxuXHRcdFx0XHRcdGlmICghbm92ZWwuY2FjaGUuZXB1Yl9iYXNlbmFtZSlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0bGV0IGhyZWYgPSBuZXcgVVJMKFtcblx0XHRcdFx0XHRcdG5vdmVsLnBhdGhNYWluX2Jhc2UsXG5cdFx0XHRcdFx0XHRub3ZlbC5jYWNoZS5lcHViX2Jhc2VuYW1lLFxuXHRcdFx0XHRcdF0uam9pbignLycpLCByYXdVcmwpO1xuXG5cdFx0XHRcdFx0bGV0IGxpbmtzID0gW1xuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRyZWw6IEVudW1MaW5rUmVsLkFDUVVJU0lUSU9OLFxuXHRcdFx0XHRcdFx0XHRocmVmLFxuXHRcdFx0XHRcdFx0XHR0eXBlOiBFbnVtTUlNRS5lcHViLFxuXHRcdFx0XHRcdFx0fSBhcyBhbnlcblx0XHRcdFx0XHRdO1xuXG5cdFx0XHRcdFx0aWYgKG5vdmVsLm1kY29uZi5ub3ZlbCAmJiBub3ZlbC5tZGNvbmYubm92ZWwuY292ZXIpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0bGlua3MucHVzaCguLi5hZGRDb3Zlcihub3ZlbC5tZGNvbmYubm92ZWwuY292ZXIpKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRsZXQgZW50cnkgPSBPUERTVjEuRW50cnkuZGVzZXJpYWxpemU8T1BEU1YxLkVudHJ5Pih7XG5cdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0XHR0aXRsZTogbm92ZWwudGl0bGUsXG5cdFx0XHRcdFx0XHRsaW5rcyxcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGlmIChub3ZlbC5jYWNoZS5lcHViX2RhdGUpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0ZW50cnkudXBkYXRlZCA9IGNyZWF0ZU1vbWVudChub3ZlbC5jYWNoZS5lcHViX2RhdGUpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChub3ZlbC5hdXRob3JzICYmIG5vdmVsLmF1dGhvcnMubGVuZ3RoKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdGVudHJ5LmF1dGhvcnMgPSBub3ZlbC5hdXRob3JzLm1hcChuYW1lID0+ICh7bmFtZX0pKVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChub3ZlbC5tZGNvbmYubm92ZWwgJiYgbm92ZWwubWRjb25mLm5vdmVsLnByZWZhY2UpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdFx0Ly9lbnRyeS5zdW1tYXJ5ID0gbm92ZWwubWRjb25mLm5vdmVsLnByZWZhY2U7XG5cblx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdGVudHJ5LmNvbnRlbnQgPSB7XG5cdFx0XHRcdFx0XHRcdHZhbHVlOiBub3ZlbC5tZGNvbmYubm92ZWwucHJlZmFjZVxuXHRcdFx0XHRcdFx0XHRcdC5yZXBsYWNlKC9cXG4vZywgJzxici8+Jylcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRlbnRyeS5zdWJ0aXRsZSA9IG5vdmVsLm1kY29uZi5ub3ZlbC50aXRsZTtcblxuXHRcdFx0XHRcdGZlZWQuYm9va3MucHVzaChlbnRyeSk7XG5cdFx0XHRcdH0pXG5cdFx0XHQ7XG5cblx0fVxuXG5cdHJldHVybiBmZWVkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlT1BEU1BvcnRhbCgpXG57XG5cdHJldHVybiBidWlsZFN5bmMoaW5pdE1haW4oe1xuXHRcdHRpdGxlLFxuXHRcdHN1YnRpdGxlOiBgYCxcblx0XHRpY29uOiAnL2Zhdmljb24uaWNvJyxcblx0fSksIFtcblxuXHRcdG1ha2VPUERTU2hhcmVkLFxuXG5cdFx0KGZlZWQpID0+XG5cdFx0e1xuXG5cdFx0XHRmZWVkLmJvb2tzLnB1c2goT1BEU1YxLkVudHJ5LmRlc2VyaWFsaXplPE9QRFNWMS5FbnRyeT4oe1xuXHRcdFx0XHR0aXRsZTogYOabuOW6q++8miR7c2l0ZUlEfWAsXG5cdFx0XHRcdGxpbmtzOiBbXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aHJlZjogYCR7cHJlZml4Um9vdH0ueG1sYCxcblx0XHRcdFx0XHRcdHRpdGxlOiBFbnVtTGlua1JlbC5BTFRFUk5BVEUsXG5cdFx0XHRcdFx0XHR0eXBlOiBFbnVtTUlNRS5PUERTX0NBVEFMT0dfRkVFRF9ET0NVTUVOVCxcblx0XHRcdFx0XHR9IGFzIExpbmssXG5cdFx0XHRcdF0sXG5cdFx0XHR9KSk7XG5cblx0XHRcdGZlZWQuYm9va3MucHVzaChPUERTVjEuRW50cnkuZGVzZXJpYWxpemU8T1BEU1YxLkVudHJ5Pih7XG5cdFx0XHRcdHRpdGxlOiBg5YWo6YOo5YiX6KGoYCxcblx0XHRcdFx0bGlua3M6IFtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRocmVmOiBgJHtwcmVmaXhSb290fS9hbGwueG1sYCxcblx0XHRcdFx0XHRcdHRpdGxlOiBFbnVtTGlua1JlbC5BTFRFUk5BVEUsXG5cdFx0XHRcdFx0XHR0eXBlOiBFbnVtTUlNRS5PUERTX0NBVEFMT0dfRkVFRF9ET0NVTUVOVCxcblx0XHRcdFx0XHR9IGFzIExpbmssXG5cdFx0XHRcdF0sXG5cdFx0XHR9KSk7XG5cblx0XHRcdHJldHVybiBmZWVkXG5cdFx0fSxcblx0XSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWFrZU9QRFNQb3J0YWxcbiJdfQ==