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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3Bkcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9wZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsMENBQXVEO0FBQ3ZELDJDQUFvQztBQUNwQyxnREFBNkQ7QUFFN0QsK0NBQTJDO0FBQzNDLDJEQUEwRjtBQUsxRixnRUFBd0M7QUFDeEMseUNBQStDO0FBRXBDLFFBQUEsTUFBTSxHQUFHLE9BQU8sQ0FBQztBQUNqQixRQUFBLFVBQVUsR0FBRyxPQUFPLEdBQUcsY0FBTSxDQUFDO0FBQzlCLFFBQUEsS0FBSyxHQUFHLFdBQVcsQ0FBQztBQUV4QixLQUFLLFVBQVUsWUFBWSxDQUFDLElBQVk7SUFFOUMsSUFBSSxJQUFJLEdBQUcsTUFBTSxjQUFjLEVBQUUsQ0FBQztJQUdsQyxJQUFJLE1BQU0sR0FBRyxtREFBbUQsQ0FBQztJQUVqRSxRQUFRLElBQUksRUFDWjtRQUNDO1lBRUMsTUFBTSxjQUFTLENBQXFCLFlBQVksQ0FBQztpQkFDL0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUViLElBQUksSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDO29CQUNsQixLQUFLLENBQUMsYUFBYTtvQkFDbkIsS0FBSyxDQUFDLEtBQUssQ0FBQyxhQUFhO2lCQUN6QixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFFckIsSUFBSSxLQUFLLEdBQUc7b0JBQ1g7d0JBQ0MsR0FBRyxFQUFFLG1CQUFXLENBQUMsV0FBVzt3QkFDNUIsSUFBSTt3QkFDSixJQUFJLEVBQUUsZ0JBQVEsQ0FBQyxJQUFJO3FCQUNaO2lCQUNSLENBQUM7Z0JBRUYsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQ2xEO29CQUNDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxrQkFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7aUJBQ2xEO2dCQUVELElBQUksS0FBSyxHQUFHLG1CQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBZTtvQkFFbEQsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLO29CQUNsQixLQUFLO2lCQUNMLENBQUMsQ0FBQztnQkFFSCxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUN6QjtvQkFDQyxLQUFLLENBQUMsT0FBTyxHQUFHLDJCQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztpQkFDcEQ7Z0JBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEIsQ0FBQyxDQUFDLENBQ0Y7S0FFRjtJQUVELE9BQU8sSUFBSSxDQUFBO0FBQ1osQ0FBQztBQWxERCxvQ0FrREM7QUFFRCxTQUFnQixjQUFjO0lBRTdCLE9BQU8sZUFBUyxDQUFDLGNBQVEsQ0FBQztRQUN6QixLQUFLLEVBQUwsYUFBSztRQUNMLFFBQVEsRUFBRSxFQUFFO1FBQ1osSUFBSSxFQUFFLGNBQWM7S0FDcEIsQ0FBQyxFQUFFO1FBRUgsc0JBQWM7UUFFZCxDQUFDLElBQUksRUFBRSxFQUFFO1lBR1IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsbUJBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFlO2dCQUN0RCxLQUFLLEVBQUUsTUFBTSxhQUFNLEVBQUU7Z0JBQ3JCLEtBQUssRUFBRTtvQkFDTjt3QkFDQyxJQUFJLEVBQUUsR0FBRyxrQkFBVSxNQUFNO3dCQUN6QixLQUFLLEVBQUUsbUJBQVcsQ0FBQyxTQUFTO3dCQUM1QixJQUFJLEVBQUUsZ0JBQVEsQ0FBQywwQkFBMEI7cUJBQ2pDO2lCQUNUO2FBQ0QsQ0FBQyxDQUFDLENBQUM7WUFFSixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQWU7Z0JBQ3RELEtBQUssRUFBRSxNQUFNO2dCQUNiLEtBQUssRUFBRTtvQkFDTjt3QkFDQyxJQUFJLEVBQUUsR0FBRyxrQkFBVSxVQUFVO3dCQUM3QixLQUFLLEVBQUUsbUJBQVcsQ0FBQyxTQUFTO3dCQUM1QixJQUFJLEVBQUUsZ0JBQVEsQ0FBQywwQkFBMEI7cUJBQ2pDO2lCQUNUO2FBQ0QsQ0FBQyxDQUFDLENBQUM7WUFFSixPQUFPLElBQUksQ0FBQTtRQUNaLENBQUM7S0FDRCxDQUFDLENBQUE7QUFDSCxDQUFDO0FBdENELHdDQXNDQztBQUVELGtCQUFlLGNBQWMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJ1aWxkU3luYywgaW5pdE1haW4gfSBmcm9tICdjYWxpYnJlLW9wZHMvbGliJztcbmltcG9ydCB7IE9QRFNWMSB9IGZyb20gJ29wZHMtZXh0cmEnO1xuaW1wb3J0IHsgRW51bUxpbmtSZWwsIEVudW1NSU1FIH0gZnJvbSAnb3Bkcy1leHRyYS9saWIvY29uc3QnO1xuaW1wb3J0IHsgTGluayB9IGZyb20gJ29wZHMtZXh0cmEvbGliL3YxL2NvcmUnO1xuaW1wb3J0IGxvYWRDYWNoZSwgeyBzaXRlSUQgfSBmcm9tICcuL2xvYWQnO1xuaW1wb3J0IHsgY3JlYXRlRnJvbUpTT04sIElGaWx0ZXJOb3ZlbERhdGEsIGNyZWF0ZU1vbWVudCB9IGZyb20gJ0Bub2RlLW5vdmVsL2NhY2hlLWxvYWRlcic7XG5pbXBvcnQgZG90VmFsdWVzMiBmcm9tICdkb3QtdmFsdWVzMidcbmltcG9ydCBOb2RlTm92ZWxJbmZvIGZyb20gJ25vZGUtbm92ZWwtaW5mby9jbGFzcyc7XG5pbXBvcnQgeyBtb21lbnQgfSBmcm9tICdub3ZlbC1kb3dubG9hZGVyL3NyYy9zaXRlJztcbmltcG9ydCBNSU1FVHlwZXMgZnJvbSBcIm1pbWUtdHlwZXNcIjtcbmltcG9ydCBhZGRDb3ZlciBmcm9tICcuLi9vcGRzL2FkZENvdmVyJztcbmltcG9ydCB7IG1ha2VPUERTU2hhcmVkIH0gZnJvbSAnLi4vb3Bkcy9pbmRleCc7XG5cbmV4cG9ydCBsZXQgcHJlZml4ID0gYC9kZW1vYDtcbmV4cG9ydCBsZXQgcHJlZml4Um9vdCA9IGAvb3Bkc2AgKyBwcmVmaXg7XG5leHBvcnQgbGV0IHRpdGxlID0gYGRlbW9ub3ZlbGA7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYWtlT1BEU1R5cGUodHlwZTogc3RyaW5nKVxue1xuXHRsZXQgZmVlZCA9IGF3YWl0IG1ha2VPUERTUG9ydGFsKCk7XG5cblx0Ly9sZXQgbWFpbkNhY2hlID0gYXdhaXQgbG9hZENhY2hlKCk7XG5cdGxldCByYXdVcmwgPSAnaHR0cHM6Ly9naXRsYWIuY29tL2RlbW9ub3ZlbC9lcHViLXR4dC9yYXcvbWFzdGVyLyc7XG5cblx0c3dpdGNoICh0eXBlKVxuXHR7XG5cdFx0ZGVmYXVsdDpcblxuXHRcdFx0YXdhaXQgbG9hZENhY2hlPElGaWx0ZXJOb3ZlbERhdGFbXT4oJ2FycmF5Lmpzb24nKVxuXHRcdFx0XHQuZWFjaChub3ZlbCA9PiB7XG5cblx0XHRcdFx0XHRsZXQgaHJlZiA9IG5ldyBVUkwoW1xuXHRcdFx0XHRcdFx0bm92ZWwucGF0aE1haW5fYmFzZSxcblx0XHRcdFx0XHRcdG5vdmVsLmNhY2hlLmVwdWJfYmFzZW5hbWUsXG5cdFx0XHRcdFx0XS5qb2luKCcvJyksIHJhd1VybCk7XG5cblx0XHRcdFx0XHRsZXQgbGlua3MgPSBbXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHJlbDogRW51bUxpbmtSZWwuQUNRVUlTSVRJT04sXG5cdFx0XHRcdFx0XHRcdGhyZWYsXG5cdFx0XHRcdFx0XHRcdHR5cGU6IEVudW1NSU1FLmVwdWIsXG5cdFx0XHRcdFx0XHR9IGFzIGFueVxuXHRcdFx0XHRcdF07XG5cblx0XHRcdFx0XHRpZiAobm92ZWwubWRjb25mLm5vdmVsICYmIG5vdmVsLm1kY29uZi5ub3ZlbC5jb3Zlcilcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRsaW5rcy5wdXNoKC4uLmFkZENvdmVyKG5vdmVsLm1kY29uZi5ub3ZlbC5jb3ZlcikpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGxldCBlbnRyeSA9IE9QRFNWMS5FbnRyeS5kZXNlcmlhbGl6ZTxPUERTVjEuRW50cnk+KHtcblx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdHRpdGxlOiBub3ZlbC50aXRsZSxcblx0XHRcdFx0XHRcdGxpbmtzLFxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0aWYgKG5vdmVsLmNhY2hlLmVwdWJfZGF0ZSlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRlbnRyeS51cGRhdGVkID0gY3JlYXRlTW9tZW50KG5vdmVsLmNhY2hlLmVwdWJfZGF0ZSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0ZmVlZC5ib29rcy5wdXNoKGVudHJ5KTtcblx0XHRcdFx0fSlcblx0XHRcdDtcblxuXHR9XG5cblx0cmV0dXJuIGZlZWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VPUERTUG9ydGFsKClcbntcblx0cmV0dXJuIGJ1aWxkU3luYyhpbml0TWFpbih7XG5cdFx0dGl0bGUsXG5cdFx0c3VidGl0bGU6IGBgLFxuXHRcdGljb246ICcvZmF2aWNvbi5pY28nLFxuXHR9KSwgW1xuXG5cdFx0bWFrZU9QRFNTaGFyZWQsXG5cblx0XHQoZmVlZCkgPT5cblx0XHR7XG5cblx0XHRcdGZlZWQuYm9va3MucHVzaChPUERTVjEuRW50cnkuZGVzZXJpYWxpemU8T1BEU1YxLkVudHJ5Pih7XG5cdFx0XHRcdHRpdGxlOiBg5pu45bqr77yaJHtzaXRlSUR9YCxcblx0XHRcdFx0bGlua3M6IFtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRocmVmOiBgJHtwcmVmaXhSb290fS54bWxgLFxuXHRcdFx0XHRcdFx0dGl0bGU6IEVudW1MaW5rUmVsLkFMVEVSTkFURSxcblx0XHRcdFx0XHRcdHR5cGU6IEVudW1NSU1FLk9QRFNfQ0FUQUxPR19GRUVEX0RPQ1VNRU5ULFxuXHRcdFx0XHRcdH0gYXMgTGluayxcblx0XHRcdFx0XSxcblx0XHRcdH0pKTtcblxuXHRcdFx0ZmVlZC5ib29rcy5wdXNoKE9QRFNWMS5FbnRyeS5kZXNlcmlhbGl6ZTxPUERTVjEuRW50cnk+KHtcblx0XHRcdFx0dGl0bGU6IGDlhajpg6jliJfooahgLFxuXHRcdFx0XHRsaW5rczogW1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGhyZWY6IGAke3ByZWZpeFJvb3R9L2FsbC54bWxgLFxuXHRcdFx0XHRcdFx0dGl0bGU6IEVudW1MaW5rUmVsLkFMVEVSTkFURSxcblx0XHRcdFx0XHRcdHR5cGU6IEVudW1NSU1FLk9QRFNfQ0FUQUxPR19GRUVEX0RPQ1VNRU5ULFxuXHRcdFx0XHRcdH0gYXMgTGluayxcblx0XHRcdFx0XSxcblx0XHRcdH0pKTtcblxuXHRcdFx0cmV0dXJuIGZlZWRcblx0XHR9LFxuXHRdKVxufVxuXG5leHBvcnQgZGVmYXVsdCBtYWtlT1BEU1BvcnRhbFxuIl19