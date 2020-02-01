"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("calibre-opds/lib");
const types_1 = require("../novel-cache/types");
const const_1 = require("opds-extra/lib/const");
const opds_extra_1 = require("opds-extra");
const load_1 = __importDefault(require("../novel-cache/load"));
function makeOPDSSite(siteID) {
    return lib_1.buildAsync(lib_1.initMain({
        title: `書庫：${siteID}`,
        subtitle: `EPub 自動生成：${siteID}`,
        icon: '/favicon.ico',
    }), [
        async (feed) => {
            feed.books = feed.books || [];
            await load_1.default(siteID, types_1.builded_map)
                .each(({ id, title, }) => {
                feed.books.push(opds_extra_1.OPDSV1.Entry.deserialize({
                    title,
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
        (feed) => {
            feed.books = feed.books || [];
            feed.books.push(opds_extra_1.OPDSV1.Entry.deserialize({
                title: `書庫：demonovel`,
                links: [
                    {
                        href: `https://demonovel.netlify.com/static/opds.xml`,
                        title: const_1.EnumLinkRel.ALTERNATE,
                        type: const_1.EnumMIME.OPDS_CATALOG_FEED_DOCUMENT,
                    },
                ],
            }));
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
            return feed;
        },
    ]);
}
exports.makeOPDSPortal = makeOPDSPortal;
exports.default = makeOPDSPortal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDBDQUFtRTtBQUNuRSxnREFBNEU7QUFDNUUsZ0RBQTZEO0FBRTdELDJDQUFvQztBQUNwQywrREFBNEM7QUFFNUMsU0FBZ0IsWUFBWSxDQUFDLE1BQWdCO0lBRTVDLE9BQU8sZ0JBQVUsQ0FBQyxjQUFRLENBQUM7UUFDMUIsS0FBSyxFQUFFLE1BQU0sTUFBTSxFQUFFO1FBQ3JCLFFBQVEsRUFBRSxhQUFhLE1BQU0sRUFBRTtRQUMvQixJQUFJLEVBQUUsY0FBYztLQUNwQixDQUFDLEVBQUU7UUFDSCxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFFZCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO1lBRTlCLE1BQU0sY0FBUyxDQUdWLE1BQU0sRUFBRSxtQkFBVyxDQUFDO2lCQUN2QixJQUFJLENBQUMsQ0FBQyxFQUNOLEVBQUUsRUFDRixLQUFLLEdBQ0wsRUFBRSxFQUFFO2dCQUVKLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLG1CQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBZTtvQkFDdEQsS0FBSztvQkFDTCxLQUFLLEVBQUU7d0JBQ047NEJBQ0MsR0FBRyxFQUFFLG1CQUFXLENBQUMsV0FBVzs0QkFDNUIsSUFBSSxFQUFFLFNBQVMsTUFBTSxJQUFJLEVBQUUsRUFBRTs0QkFDN0IsSUFBSSxFQUFFLGdCQUFRLENBQUMsSUFBSTt5QkFDWjtxQkFDUjtpQkFDRCxDQUFDLENBQUMsQ0FBQztZQUVMLENBQUMsQ0FBQyxDQUNGO1lBRUQsT0FBTyxJQUFJLENBQUE7UUFDWixDQUFDO0tBQ0QsQ0FBQyxDQUFBO0FBQ0gsQ0FBQztBQXJDRCxvQ0FxQ0M7QUFFRCxTQUFnQixjQUFjO0lBRTdCLE9BQU8sZUFBUyxDQUFDLGNBQVEsQ0FBQztRQUN6QixLQUFLLEVBQUUsV0FBVztRQUNsQixRQUFRLEVBQUUsV0FBVztRQUNyQixJQUFJLEVBQUUsY0FBYztLQUNwQixDQUFDLEVBQUU7UUFFSCxDQUFDLElBQUksRUFBRSxFQUFFO1lBRVIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUU5QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQWU7Z0JBQ3RELEtBQUssRUFBRSxjQUFjO2dCQUNyQixLQUFLLEVBQUU7b0JBQ047d0JBQ0MsSUFBSSxFQUFFLCtDQUErQzt3QkFDckQsS0FBSyxFQUFFLG1CQUFXLENBQUMsU0FBUzt3QkFDNUIsSUFBSSxFQUFFLGdCQUFRLENBQUMsMEJBQTBCO3FCQUNqQztpQkFDVDthQUNELENBQUMsQ0FBQyxDQUFDO1lBRUosTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBYSxDQUFDO2lCQUN4QixPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFHbkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsbUJBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFlO29CQUN0RCxLQUFLLEVBQUUsTUFBTSxNQUFNLEVBQUU7b0JBQ3JCLEtBQUssRUFBRTt3QkFDTjs0QkFDQyxJQUFJLEVBQUUsU0FBUyxNQUFNLE1BQU07NEJBQzNCLEtBQUssRUFBRSxtQkFBVyxDQUFDLFNBQVM7NEJBQzVCLElBQUksRUFBRSxnQkFBUSxDQUFDLDBCQUEwQjt5QkFDakM7cUJBQ1Q7aUJBQ0QsQ0FBQyxDQUFDLENBQUM7WUFFTCxDQUFDLENBQUMsQ0FDRjtZQUVELE9BQU8sSUFBSSxDQUFBO1FBQ1osQ0FBQztLQUNELENBQUMsQ0FBQTtBQUNILENBQUM7QUE1Q0Qsd0NBNENDO0FBRUQsa0JBQWUsY0FBYyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaW5pdE1haW4sIGJ1aWxkU3luYywgYnVpbGRBc3luYyB9IGZyb20gJ2NhbGlicmUtb3Bkcy9saWInO1xuaW1wb3J0IHsgaWRfdGl0bGVzX21hcCwgSVNpdGVJRHMsIGJ1aWxkZWRfbWFwIH0gZnJvbSAnLi4vbm92ZWwtY2FjaGUvdHlwZXMnO1xuaW1wb3J0IHsgRW51bUxpbmtSZWwsIEVudW1NSU1FIH0gZnJvbSAnb3Bkcy1leHRyYS9saWIvY29uc3QnO1xuaW1wb3J0IHsgTGluayB9IGZyb20gJ29wZHMtZXh0cmEvbGliL3YxL2NvcmUnO1xuaW1wb3J0IHsgT1BEU1YxIH0gZnJvbSAnb3Bkcy1leHRyYSc7XG5pbXBvcnQgbG9hZENhY2hlIGZyb20gJy4uL25vdmVsLWNhY2hlL2xvYWQnO1xuXG5leHBvcnQgZnVuY3Rpb24gbWFrZU9QRFNTaXRlKHNpdGVJRDogSVNpdGVJRHMpXG57XG5cdHJldHVybiBidWlsZEFzeW5jKGluaXRNYWluKHtcblx0XHR0aXRsZTogYOabuOW6q++8miR7c2l0ZUlEfWAsXG5cdFx0c3VidGl0bGU6IGBFUHViIOiHquWLleeUn+aIkO+8miR7c2l0ZUlEfWAsXG5cdFx0aWNvbjogJy9mYXZpY29uLmljbycsXG5cdH0pLCBbXG5cdFx0YXN5bmMgKGZlZWQpID0+XG5cdFx0e1xuXHRcdFx0ZmVlZC5ib29rcyA9IGZlZWQuYm9va3MgfHwgW107XG5cblx0XHRcdGF3YWl0IGxvYWRDYWNoZTx7XG5cdFx0XHRcdGlkLFxuXHRcdFx0XHR0aXRsZSxcblx0XHRcdH1bXT4oc2l0ZUlELCBidWlsZGVkX21hcClcblx0XHRcdFx0LmVhY2goKHtcblx0XHRcdFx0XHRpZCxcblx0XHRcdFx0XHR0aXRsZSxcblx0XHRcdFx0fSkgPT4ge1xuXG5cdFx0XHRcdFx0ZmVlZC5ib29rcy5wdXNoKE9QRFNWMS5FbnRyeS5kZXNlcmlhbGl6ZTxPUERTVjEuRW50cnk+KHtcblx0XHRcdFx0XHRcdHRpdGxlLFxuXHRcdFx0XHRcdFx0bGlua3M6IFtcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdHJlbDogRW51bUxpbmtSZWwuQUNRVUlTSVRJT04sXG5cdFx0XHRcdFx0XHRcdFx0aHJlZjogYC9maWxlLyR7c2l0ZUlEfS8ke2lkfWAsXG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogRW51bU1JTUUuZXB1Yixcblx0XHRcdFx0XHRcdFx0fSBhcyBhbnlcblx0XHRcdFx0XHRcdF0sXG5cdFx0XHRcdFx0fSkpO1xuXG5cdFx0XHRcdH0pXG5cdFx0XHQ7XG5cblx0XHRcdHJldHVybiBmZWVkXG5cdFx0fSxcblx0XSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VPUERTUG9ydGFsKClcbntcblx0cmV0dXJuIGJ1aWxkU3luYyhpbml0TWFpbih7XG5cdFx0dGl0bGU6IGBFUHViIOiHquWLleeUn+aIkGAsXG5cdFx0c3VidGl0bGU6IGBFUHViIOiHquWLleeUn+aIkGAsXG5cdFx0aWNvbjogJy9mYXZpY29uLmljbycsXG5cdH0pLCBbXG5cblx0XHQoZmVlZCkgPT5cblx0XHR7XG5cdFx0XHRmZWVkLmJvb2tzID0gZmVlZC5ib29rcyB8fCBbXTtcblxuXHRcdFx0ZmVlZC5ib29rcy5wdXNoKE9QRFNWMS5FbnRyeS5kZXNlcmlhbGl6ZTxPUERTVjEuRW50cnk+KHtcblx0XHRcdFx0dGl0bGU6IGDmm7jluqvvvJpkZW1vbm92ZWxgLFxuXHRcdFx0XHRsaW5rczogW1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGhyZWY6IGBodHRwczovL2RlbW9ub3ZlbC5uZXRsaWZ5LmNvbS9zdGF0aWMvb3Bkcy54bWxgLFxuXHRcdFx0XHRcdFx0dGl0bGU6IEVudW1MaW5rUmVsLkFMVEVSTkFURSxcblx0XHRcdFx0XHRcdHR5cGU6IEVudW1NSU1FLk9QRFNfQ0FUQUxPR19GRUVEX0RPQ1VNRU5ULFxuXHRcdFx0XHRcdH0gYXMgTGluayxcblx0XHRcdFx0XSxcblx0XHRcdH0pKTtcblxuXHRcdFx0T2JqZWN0LmtleXMoaWRfdGl0bGVzX21hcClcblx0XHRcdFx0LmZvckVhY2goKHNpdGVJRCkgPT5cblx0XHRcdFx0e1xuXG5cdFx0XHRcdFx0ZmVlZC5ib29rcy5wdXNoKE9QRFNWMS5FbnRyeS5kZXNlcmlhbGl6ZTxPUERTVjEuRW50cnk+KHtcblx0XHRcdFx0XHRcdHRpdGxlOiBg5pu45bqr77yaJHtzaXRlSUR9YCxcblx0XHRcdFx0XHRcdGxpbmtzOiBbXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRocmVmOiBgL29wZHMvJHtzaXRlSUR9LnhtbGAsXG5cdFx0XHRcdFx0XHRcdFx0dGl0bGU6IEVudW1MaW5rUmVsLkFMVEVSTkFURSxcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBFbnVtTUlNRS5PUERTX0NBVEFMT0dfRkVFRF9ET0NVTUVOVCxcblx0XHRcdFx0XHRcdFx0fSBhcyBMaW5rLFxuXHRcdFx0XHRcdFx0XSxcblx0XHRcdFx0XHR9KSk7XG5cblx0XHRcdFx0fSlcblx0XHRcdDtcblxuXHRcdFx0cmV0dXJuIGZlZWRcblx0XHR9LFxuXHRdKVxufVxuXG5leHBvcnQgZGVmYXVsdCBtYWtlT1BEU1BvcnRhbFxuIl19