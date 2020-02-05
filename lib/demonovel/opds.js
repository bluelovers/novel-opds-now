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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3Bkcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9wZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsMENBQXVEO0FBQ3ZELDJDQUFvQztBQUNwQyxnREFBNkQ7QUFFN0QsK0NBQTJDO0FBQzNDLDJEQUEwRjtBQUsxRixnRUFBd0M7QUFDeEMseUNBQStDO0FBRXBDLFFBQUEsTUFBTSxHQUFHLE9BQU8sQ0FBQztBQUNqQixRQUFBLFVBQVUsR0FBRyxPQUFPLEdBQUcsY0FBTSxDQUFDO0FBQzlCLFFBQUEsS0FBSyxHQUFHLFdBQVcsQ0FBQztBQUV4QixLQUFLLFVBQVUsWUFBWSxDQUFDLElBQVk7SUFFOUMsSUFBSSxJQUFJLEdBQUcsTUFBTSxjQUFjLEVBQUUsQ0FBQztJQUdsQyxJQUFJLE1BQU0sR0FBRyxtREFBbUQsQ0FBQztJQUVqRSxRQUFRLElBQUksRUFDWjtRQUNDO1lBRUMsTUFBTSxjQUFTLENBQXFCLFlBQVksQ0FBQztpQkFDL0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUViLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFDOUI7b0JBQ0MsT0FBTztpQkFDUDtnQkFFRCxJQUFJLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQztvQkFDbEIsS0FBSyxDQUFDLGFBQWE7b0JBQ25CLEtBQUssQ0FBQyxLQUFLLENBQUMsYUFBYTtpQkFDekIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBRXJCLElBQUksS0FBSyxHQUFHO29CQUNYO3dCQUNDLEdBQUcsRUFBRSxtQkFBVyxDQUFDLFdBQVc7d0JBQzVCLElBQUk7d0JBQ0osSUFBSSxFQUFFLGdCQUFRLENBQUMsSUFBSTtxQkFDWjtpQkFDUixDQUFDO2dCQUVGLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUNsRDtvQkFDQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsa0JBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2lCQUNsRDtnQkFFRCxJQUFJLEtBQUssR0FBRyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQWU7b0JBRWxELEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSztvQkFDbEIsS0FBSztpQkFDTCxDQUFDLENBQUM7Z0JBRUgsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFDekI7b0JBQ0MsS0FBSyxDQUFDLE9BQU8sR0FBRywyQkFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7aUJBQ3BEO2dCQUVELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hCLENBQUMsQ0FBQyxDQUNGO0tBRUY7SUFFRCxPQUFPLElBQUksQ0FBQTtBQUNaLENBQUM7QUF2REQsb0NBdURDO0FBRUQsU0FBZ0IsY0FBYztJQUU3QixPQUFPLGVBQVMsQ0FBQyxjQUFRLENBQUM7UUFDekIsS0FBSyxFQUFMLGFBQUs7UUFDTCxRQUFRLEVBQUUsRUFBRTtRQUNaLElBQUksRUFBRSxjQUFjO0tBQ3BCLENBQUMsRUFBRTtRQUVILHNCQUFjO1FBRWQsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUdSLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLG1CQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBZTtnQkFDdEQsS0FBSyxFQUFFLE1BQU0sYUFBTSxFQUFFO2dCQUNyQixLQUFLLEVBQUU7b0JBQ047d0JBQ0MsSUFBSSxFQUFFLEdBQUcsa0JBQVUsTUFBTTt3QkFDekIsS0FBSyxFQUFFLG1CQUFXLENBQUMsU0FBUzt3QkFDNUIsSUFBSSxFQUFFLGdCQUFRLENBQUMsMEJBQTBCO3FCQUNqQztpQkFDVDthQUNELENBQUMsQ0FBQyxDQUFDO1lBRUosSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsbUJBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFlO2dCQUN0RCxLQUFLLEVBQUUsTUFBTTtnQkFDYixLQUFLLEVBQUU7b0JBQ047d0JBQ0MsSUFBSSxFQUFFLEdBQUcsa0JBQVUsVUFBVTt3QkFDN0IsS0FBSyxFQUFFLG1CQUFXLENBQUMsU0FBUzt3QkFDNUIsSUFBSSxFQUFFLGdCQUFRLENBQUMsMEJBQTBCO3FCQUNqQztpQkFDVDthQUNELENBQUMsQ0FBQyxDQUFDO1lBRUosT0FBTyxJQUFJLENBQUE7UUFDWixDQUFDO0tBQ0QsQ0FBQyxDQUFBO0FBQ0gsQ0FBQztBQXRDRCx3Q0FzQ0M7QUFFRCxrQkFBZSxjQUFjLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBidWlsZFN5bmMsIGluaXRNYWluIH0gZnJvbSAnY2FsaWJyZS1vcGRzL2xpYic7XG5pbXBvcnQgeyBPUERTVjEgfSBmcm9tICdvcGRzLWV4dHJhJztcbmltcG9ydCB7IEVudW1MaW5rUmVsLCBFbnVtTUlNRSB9IGZyb20gJ29wZHMtZXh0cmEvbGliL2NvbnN0JztcbmltcG9ydCB7IExpbmsgfSBmcm9tICdvcGRzLWV4dHJhL2xpYi92MS9jb3JlJztcbmltcG9ydCBsb2FkQ2FjaGUsIHsgc2l0ZUlEIH0gZnJvbSAnLi9sb2FkJztcbmltcG9ydCB7IGNyZWF0ZUZyb21KU09OLCBJRmlsdGVyTm92ZWxEYXRhLCBjcmVhdGVNb21lbnQgfSBmcm9tICdAbm9kZS1ub3ZlbC9jYWNoZS1sb2FkZXInO1xuaW1wb3J0IGRvdFZhbHVlczIgZnJvbSAnZG90LXZhbHVlczInXG5pbXBvcnQgTm9kZU5vdmVsSW5mbyBmcm9tICdub2RlLW5vdmVsLWluZm8vY2xhc3MnO1xuaW1wb3J0IHsgbW9tZW50IH0gZnJvbSAnbm92ZWwtZG93bmxvYWRlci9zcmMvc2l0ZSc7XG5pbXBvcnQgTUlNRVR5cGVzIGZyb20gXCJtaW1lLXR5cGVzXCI7XG5pbXBvcnQgYWRkQ292ZXIgZnJvbSAnLi4vb3Bkcy9hZGRDb3Zlcic7XG5pbXBvcnQgeyBtYWtlT1BEU1NoYXJlZCB9IGZyb20gJy4uL29wZHMvaW5kZXgnO1xuXG5leHBvcnQgbGV0IHByZWZpeCA9IGAvZGVtb2A7XG5leHBvcnQgbGV0IHByZWZpeFJvb3QgPSBgL29wZHNgICsgcHJlZml4O1xuZXhwb3J0IGxldCB0aXRsZSA9IGBkZW1vbm92ZWxgO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFrZU9QRFNUeXBlKHR5cGU6IHN0cmluZylcbntcblx0bGV0IGZlZWQgPSBhd2FpdCBtYWtlT1BEU1BvcnRhbCgpO1xuXG5cdC8vbGV0IG1haW5DYWNoZSA9IGF3YWl0IGxvYWRDYWNoZSgpO1xuXHRsZXQgcmF3VXJsID0gJ2h0dHBzOi8vZ2l0bGFiLmNvbS9kZW1vbm92ZWwvZXB1Yi10eHQvcmF3L21hc3Rlci8nO1xuXG5cdHN3aXRjaCAodHlwZSlcblx0e1xuXHRcdGRlZmF1bHQ6XG5cblx0XHRcdGF3YWl0IGxvYWRDYWNoZTxJRmlsdGVyTm92ZWxEYXRhW10+KCdhcnJheS5qc29uJylcblx0XHRcdFx0LmVhY2gobm92ZWwgPT4ge1xuXG5cdFx0XHRcdFx0aWYgKCFub3ZlbC5jYWNoZS5lcHViX2Jhc2VuYW1lKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRsZXQgaHJlZiA9IG5ldyBVUkwoW1xuXHRcdFx0XHRcdFx0bm92ZWwucGF0aE1haW5fYmFzZSxcblx0XHRcdFx0XHRcdG5vdmVsLmNhY2hlLmVwdWJfYmFzZW5hbWUsXG5cdFx0XHRcdFx0XS5qb2luKCcvJyksIHJhd1VybCk7XG5cblx0XHRcdFx0XHRsZXQgbGlua3MgPSBbXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHJlbDogRW51bUxpbmtSZWwuQUNRVUlTSVRJT04sXG5cdFx0XHRcdFx0XHRcdGhyZWYsXG5cdFx0XHRcdFx0XHRcdHR5cGU6IEVudW1NSU1FLmVwdWIsXG5cdFx0XHRcdFx0XHR9IGFzIGFueVxuXHRcdFx0XHRcdF07XG5cblx0XHRcdFx0XHRpZiAobm92ZWwubWRjb25mLm5vdmVsICYmIG5vdmVsLm1kY29uZi5ub3ZlbC5jb3Zlcilcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRsaW5rcy5wdXNoKC4uLmFkZENvdmVyKG5vdmVsLm1kY29uZi5ub3ZlbC5jb3ZlcikpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGxldCBlbnRyeSA9IE9QRFNWMS5FbnRyeS5kZXNlcmlhbGl6ZTxPUERTVjEuRW50cnk+KHtcblx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdHRpdGxlOiBub3ZlbC50aXRsZSxcblx0XHRcdFx0XHRcdGxpbmtzLFxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0aWYgKG5vdmVsLmNhY2hlLmVwdWJfZGF0ZSlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRlbnRyeS51cGRhdGVkID0gY3JlYXRlTW9tZW50KG5vdmVsLmNhY2hlLmVwdWJfZGF0ZSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0ZmVlZC5ib29rcy5wdXNoKGVudHJ5KTtcblx0XHRcdFx0fSlcblx0XHRcdDtcblxuXHR9XG5cblx0cmV0dXJuIGZlZWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VPUERTUG9ydGFsKClcbntcblx0cmV0dXJuIGJ1aWxkU3luYyhpbml0TWFpbih7XG5cdFx0dGl0bGUsXG5cdFx0c3VidGl0bGU6IGBgLFxuXHRcdGljb246ICcvZmF2aWNvbi5pY28nLFxuXHR9KSwgW1xuXG5cdFx0bWFrZU9QRFNTaGFyZWQsXG5cblx0XHQoZmVlZCkgPT5cblx0XHR7XG5cblx0XHRcdGZlZWQuYm9va3MucHVzaChPUERTVjEuRW50cnkuZGVzZXJpYWxpemU8T1BEU1YxLkVudHJ5Pih7XG5cdFx0XHRcdHRpdGxlOiBg5pu45bqr77yaJHtzaXRlSUR9YCxcblx0XHRcdFx0bGlua3M6IFtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRocmVmOiBgJHtwcmVmaXhSb290fS54bWxgLFxuXHRcdFx0XHRcdFx0dGl0bGU6IEVudW1MaW5rUmVsLkFMVEVSTkFURSxcblx0XHRcdFx0XHRcdHR5cGU6IEVudW1NSU1FLk9QRFNfQ0FUQUxPR19GRUVEX0RPQ1VNRU5ULFxuXHRcdFx0XHRcdH0gYXMgTGluayxcblx0XHRcdFx0XSxcblx0XHRcdH0pKTtcblxuXHRcdFx0ZmVlZC5ib29rcy5wdXNoKE9QRFNWMS5FbnRyeS5kZXNlcmlhbGl6ZTxPUERTVjEuRW50cnk+KHtcblx0XHRcdFx0dGl0bGU6IGDlhajpg6jliJfooahgLFxuXHRcdFx0XHRsaW5rczogW1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGhyZWY6IGAke3ByZWZpeFJvb3R9L2FsbC54bWxgLFxuXHRcdFx0XHRcdFx0dGl0bGU6IEVudW1MaW5rUmVsLkFMVEVSTkFURSxcblx0XHRcdFx0XHRcdHR5cGU6IEVudW1NSU1FLk9QRFNfQ0FUQUxPR19GRUVEX0RPQ1VNRU5ULFxuXHRcdFx0XHRcdH0gYXMgTGluayxcblx0XHRcdFx0XSxcblx0XHRcdH0pKTtcblxuXHRcdFx0cmV0dXJuIGZlZWRcblx0XHR9LFxuXHRdKVxufVxuXG5leHBvcnQgZGVmYXVsdCBtYWtlT1BEU1BvcnRhbFxuIl19