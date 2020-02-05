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
const opds_1 = require("../demonovel/opds");
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
        (feed) => makeOPDSShared(feed, `，目前位於 ${siteID}`),
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
            return feed;
        },
    ]);
}
exports.makeOPDSPortal = makeOPDSPortal;
exports.default = makeOPDSPortal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDBDQUFtRTtBQUNuRSxnREFBNEU7QUFDNUUsZ0RBQTZEO0FBRTdELDJDQUFvQztBQUNwQywrREFBNEM7QUFDNUMsNENBQWlGO0FBRWpGLFNBQWdCLGNBQWMsQ0FBQyxJQUFJLEVBQUUsTUFBYyxFQUFFO0lBRXBELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7SUFFOUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsbUJBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFlO1FBQ3RELEtBQUssRUFBRSxPQUFPLEdBQUcsRUFBRTtRQUNuQixLQUFLLEVBQUU7WUFDTjtnQkFDQyxJQUFJLEVBQUUsT0FBTztnQkFDYixLQUFLLEVBQUUsbUJBQVcsQ0FBQyxTQUFTO2dCQUM1QixJQUFJLEVBQUUsZ0JBQVEsQ0FBQywwQkFBMEI7YUFDakM7U0FDVDtLQUNELENBQUMsQ0FBQyxDQUFDO0lBRUosT0FBTyxJQUFJLENBQUE7QUFDWixDQUFDO0FBaEJELHdDQWdCQztBQUVELFNBQWdCLFlBQVksQ0FBQyxNQUFnQjtJQUU1QyxPQUFPLGdCQUFVLENBQUMsY0FBUSxDQUFDO1FBQzFCLEtBQUssRUFBRSxNQUFNLE1BQU0sRUFBRTtRQUNyQixRQUFRLEVBQUUsYUFBYSxNQUFNLEVBQUU7UUFDL0IsSUFBSSxFQUFFLGNBQWM7S0FDcEIsQ0FBQyxFQUFFO1FBRUgsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxNQUFNLEVBQUUsQ0FBQztRQUVqRCxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFFZCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO1lBRTlCLE1BQU0sY0FBUyxDQUdWLE1BQU0sRUFBRSxtQkFBVyxDQUFDO2lCQUN2QixJQUFJLENBQUMsQ0FBQyxFQUNOLEVBQUUsRUFDRixLQUFLLEdBQ0wsRUFBRSxFQUFFO2dCQUVKLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLG1CQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBZTtvQkFDdEQsS0FBSztvQkFDTCxLQUFLLEVBQUU7d0JBQ047NEJBQ0MsR0FBRyxFQUFFLG1CQUFXLENBQUMsV0FBVzs0QkFDNUIsSUFBSSxFQUFFLFNBQVMsTUFBTSxJQUFJLEVBQUUsRUFBRTs0QkFDN0IsSUFBSSxFQUFFLGdCQUFRLENBQUMsSUFBSTt5QkFDWjtxQkFDUjtpQkFDRCxDQUFDLENBQUMsQ0FBQztZQUVMLENBQUMsQ0FBQyxDQUNGO1lBRUQsT0FBTyxJQUFJLENBQUE7UUFDWixDQUFDO0tBQ0QsQ0FBQyxDQUFBO0FBQ0gsQ0FBQztBQXhDRCxvQ0F3Q0M7QUFFRCxTQUFnQixjQUFjO0lBRTdCLE9BQU8sZUFBUyxDQUFDLGNBQVEsQ0FBQztRQUN6QixLQUFLLEVBQUUsV0FBVztRQUNsQixRQUFRLEVBQUUsV0FBVztRQUNyQixJQUFJLEVBQUUsY0FBYztLQUNwQixDQUFDLEVBQUU7UUFFSCxDQUFDLElBQUksRUFBRSxFQUFFO1lBRVIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUU5QixJQUFJLENBQUMsRUFDTDtnQkFDQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQWU7b0JBQ3RELEtBQUssRUFBRSxNQUFNLFlBQVMsRUFBRTtvQkFDeEIsS0FBSyxFQUFFO3dCQUNOOzRCQUNDLElBQUksRUFBRSwrQ0FBK0M7NEJBQ3JELEtBQUssRUFBRSxtQkFBVyxDQUFDLFNBQVM7NEJBQzVCLElBQUksRUFBRSxnQkFBUSxDQUFDLDBCQUEwQjt5QkFDakM7cUJBQ1Q7aUJBQ0QsQ0FBQyxDQUFDLENBQUM7YUFDSjtpQkFFRDtnQkFDQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQWU7b0JBQ3RELEtBQUssRUFBRSxNQUFNLFlBQVMsRUFBRTtvQkFDeEIsS0FBSyxFQUFFO3dCQUNOOzRCQUNDLElBQUksRUFBRSxHQUFHLGlCQUFVLFVBQVU7NEJBQzdCLEtBQUssRUFBRSxtQkFBVyxDQUFDLFNBQVM7NEJBQzVCLElBQUksRUFBRSxnQkFBUSxDQUFDLDBCQUEwQjt5QkFDakM7cUJBQ1Q7aUJBQ0QsQ0FBQyxDQUFDLENBQUM7YUFDSjtZQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMscUJBQWEsQ0FBQztpQkFDeEIsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBR25CLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLG1CQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBZTtvQkFDdEQsS0FBSyxFQUFFLE1BQU0sTUFBTSxFQUFFO29CQUNyQixLQUFLLEVBQUU7d0JBQ047NEJBQ0MsSUFBSSxFQUFFLFNBQVMsTUFBTSxNQUFNOzRCQUMzQixLQUFLLEVBQUUsbUJBQVcsQ0FBQyxTQUFTOzRCQUM1QixJQUFJLEVBQUUsZ0JBQVEsQ0FBQywwQkFBMEI7eUJBQ2pDO3FCQUNUO2lCQUNELENBQUMsQ0FBQyxDQUFDO1lBRUwsQ0FBQyxDQUFDLENBQ0Y7WUFFRCxPQUFPLElBQUksQ0FBQTtRQUNaLENBQUM7S0FDRCxDQUFDLENBQUE7QUFDSCxDQUFDO0FBNURELHdDQTREQztBQUVELGtCQUFlLGNBQWMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGluaXRNYWluLCBidWlsZFN5bmMsIGJ1aWxkQXN5bmMgfSBmcm9tICdjYWxpYnJlLW9wZHMvbGliJztcbmltcG9ydCB7IGlkX3RpdGxlc19tYXAsIElTaXRlSURzLCBidWlsZGVkX21hcCB9IGZyb20gJy4uL25vdmVsLWNhY2hlL3R5cGVzJztcbmltcG9ydCB7IEVudW1MaW5rUmVsLCBFbnVtTUlNRSB9IGZyb20gJ29wZHMtZXh0cmEvbGliL2NvbnN0JztcbmltcG9ydCB7IExpbmsgfSBmcm9tICdvcGRzLWV4dHJhL2xpYi92MS9jb3JlJztcbmltcG9ydCB7IE9QRFNWMSB9IGZyb20gJ29wZHMtZXh0cmEnO1xuaW1wb3J0IGxvYWRDYWNoZSBmcm9tICcuLi9ub3ZlbC1jYWNoZS9sb2FkJztcbmltcG9ydCB7IHByZWZpeFJvb3QgYXMgcHJlZml4RGVtbywgdGl0bGUgYXMgdGl0bGVEZW1vIH0gZnJvbSAnLi4vZGVtb25vdmVsL29wZHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gbWFrZU9QRFNTaGFyZWQoZmVlZCwgbXNnOiBzdHJpbmcgPSAnJyk6IE9QRFNWMS5GZWVkXG57XG5cdGZlZWQuYm9va3MgPSBmZWVkLmJvb2tzIHx8IFtdO1xuXG5cdGZlZWQuYm9va3MucHVzaChPUERTVjEuRW50cnkuZGVzZXJpYWxpemU8T1BEU1YxLkVudHJ5Pih7XG5cdFx0dGl0bGU6IGDmiYDmnInmm7jluqske21zZ31gLFxuXHRcdGxpbmtzOiBbXG5cdFx0XHR7XG5cdFx0XHRcdGhyZWY6IGAvb3Bkc2AsXG5cdFx0XHRcdHRpdGxlOiBFbnVtTGlua1JlbC5BTFRFUk5BVEUsXG5cdFx0XHRcdHR5cGU6IEVudW1NSU1FLk9QRFNfQ0FUQUxPR19GRUVEX0RPQ1VNRU5ULFxuXHRcdFx0fSBhcyBMaW5rLFxuXHRcdF0sXG5cdH0pKTtcblxuXHRyZXR1cm4gZmVlZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZU9QRFNTaXRlKHNpdGVJRDogSVNpdGVJRHMpXG57XG5cdHJldHVybiBidWlsZEFzeW5jKGluaXRNYWluKHtcblx0XHR0aXRsZTogYOabuOW6q++8miR7c2l0ZUlEfWAsXG5cdFx0c3VidGl0bGU6IGBFUHViIOiHquWLleeUn+aIkO+8miR7c2l0ZUlEfWAsXG5cdFx0aWNvbjogJy9mYXZpY29uLmljbycsXG5cdH0pLCBbXG5cblx0XHQoZmVlZCkgPT4gbWFrZU9QRFNTaGFyZWQoZmVlZCwgYO+8jOebruWJjeS9jeaWvCAke3NpdGVJRH1gKSxcblxuXHRcdGFzeW5jIChmZWVkKSA9PlxuXHRcdHtcblx0XHRcdGZlZWQuYm9va3MgPSBmZWVkLmJvb2tzIHx8IFtdO1xuXG5cdFx0XHRhd2FpdCBsb2FkQ2FjaGU8e1xuXHRcdFx0XHRpZCxcblx0XHRcdFx0dGl0bGUsXG5cdFx0XHR9W10+KHNpdGVJRCwgYnVpbGRlZF9tYXApXG5cdFx0XHRcdC5lYWNoKCh7XG5cdFx0XHRcdFx0aWQsXG5cdFx0XHRcdFx0dGl0bGUsXG5cdFx0XHRcdH0pID0+IHtcblxuXHRcdFx0XHRcdGZlZWQuYm9va3MucHVzaChPUERTVjEuRW50cnkuZGVzZXJpYWxpemU8T1BEU1YxLkVudHJ5Pih7XG5cdFx0XHRcdFx0XHR0aXRsZSxcblx0XHRcdFx0XHRcdGxpbmtzOiBbXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRyZWw6IEVudW1MaW5rUmVsLkFDUVVJU0lUSU9OLFxuXHRcdFx0XHRcdFx0XHRcdGhyZWY6IGAvZmlsZS8ke3NpdGVJRH0vJHtpZH1gLFxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IEVudW1NSU1FLmVwdWIsXG5cdFx0XHRcdFx0XHRcdH0gYXMgYW55XG5cdFx0XHRcdFx0XHRdLFxuXHRcdFx0XHRcdH0pKTtcblxuXHRcdFx0XHR9KVxuXHRcdFx0O1xuXG5cdFx0XHRyZXR1cm4gZmVlZFxuXHRcdH0sXG5cdF0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlT1BEU1BvcnRhbCgpXG57XG5cdHJldHVybiBidWlsZFN5bmMoaW5pdE1haW4oe1xuXHRcdHRpdGxlOiBgRVB1YiDoh6rli5XnlJ/miJBgLFxuXHRcdHN1YnRpdGxlOiBgRVB1YiDoh6rli5XnlJ/miJBgLFxuXHRcdGljb246ICcvZmF2aWNvbi5pY28nLFxuXHR9KSwgW1xuXG5cdFx0KGZlZWQpID0+XG5cdFx0e1xuXHRcdFx0ZmVlZC5ib29rcyA9IGZlZWQuYm9va3MgfHwgW107XG5cblx0XHRcdGlmICgwKVxuXHRcdFx0e1xuXHRcdFx0XHRmZWVkLmJvb2tzLnB1c2goT1BEU1YxLkVudHJ5LmRlc2VyaWFsaXplPE9QRFNWMS5FbnRyeT4oe1xuXHRcdFx0XHRcdHRpdGxlOiBg5pu45bqr77yaJHt0aXRsZURlbW99YCxcblx0XHRcdFx0XHRsaW5rczogW1xuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRocmVmOiBgaHR0cHM6Ly9kZW1vbm92ZWwubmV0bGlmeS5jb20vc3RhdGljL29wZHMueG1sYCxcblx0XHRcdFx0XHRcdFx0dGl0bGU6IEVudW1MaW5rUmVsLkFMVEVSTkFURSxcblx0XHRcdFx0XHRcdFx0dHlwZTogRW51bU1JTUUuT1BEU19DQVRBTE9HX0ZFRURfRE9DVU1FTlQsXG5cdFx0XHRcdFx0XHR9IGFzIExpbmssXG5cdFx0XHRcdFx0XSxcblx0XHRcdFx0fSkpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRmZWVkLmJvb2tzLnB1c2goT1BEU1YxLkVudHJ5LmRlc2VyaWFsaXplPE9QRFNWMS5FbnRyeT4oe1xuXHRcdFx0XHRcdHRpdGxlOiBg5pu45bqr77yaJHt0aXRsZURlbW99YCxcblx0XHRcdFx0XHRsaW5rczogW1xuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRocmVmOiBgJHtwcmVmaXhEZW1vfS9hbGwueG1sYCxcblx0XHRcdFx0XHRcdFx0dGl0bGU6IEVudW1MaW5rUmVsLkFMVEVSTkFURSxcblx0XHRcdFx0XHRcdFx0dHlwZTogRW51bU1JTUUuT1BEU19DQVRBTE9HX0ZFRURfRE9DVU1FTlQsXG5cdFx0XHRcdFx0XHR9IGFzIExpbmssXG5cdFx0XHRcdFx0XSxcblx0XHRcdFx0fSkpO1xuXHRcdFx0fVxuXG5cdFx0XHRPYmplY3Qua2V5cyhpZF90aXRsZXNfbWFwKVxuXHRcdFx0XHQuZm9yRWFjaCgoc2l0ZUlEKSA9PlxuXHRcdFx0XHR7XG5cblx0XHRcdFx0XHRmZWVkLmJvb2tzLnB1c2goT1BEU1YxLkVudHJ5LmRlc2VyaWFsaXplPE9QRFNWMS5FbnRyeT4oe1xuXHRcdFx0XHRcdFx0dGl0bGU6IGDmm7jluqvvvJoke3NpdGVJRH1gLFxuXHRcdFx0XHRcdFx0bGlua3M6IFtcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGhyZWY6IGAvb3Bkcy8ke3NpdGVJRH0ueG1sYCxcblx0XHRcdFx0XHRcdFx0XHR0aXRsZTogRW51bUxpbmtSZWwuQUxURVJOQVRFLFxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IEVudW1NSU1FLk9QRFNfQ0FUQUxPR19GRUVEX0RPQ1VNRU5ULFxuXHRcdFx0XHRcdFx0XHR9IGFzIExpbmssXG5cdFx0XHRcdFx0XHRdLFxuXHRcdFx0XHRcdH0pKTtcblxuXHRcdFx0XHR9KVxuXHRcdFx0O1xuXG5cdFx0XHRyZXR1cm4gZmVlZFxuXHRcdH0sXG5cdF0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IG1ha2VPUERTUG9ydGFsXG4iXX0=