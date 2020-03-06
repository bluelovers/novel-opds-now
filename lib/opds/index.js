"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeOPDSPortal = exports.makeOPDSSite = exports.makeOPDSShared = void 0;
const lib_1 = require("calibre-opds/lib");
const types_1 = require("../novel-cache/types");
const const_1 = require("opds-extra/lib/const");
const opds_extra_1 = require("opds-extra");
const load_1 = __importDefault(require("../novel-cache/load"));
const opds_1 = require("../demonovel/opds");
const search_1 = require("./search");
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
        (feed) => search_1.addOpenSearch(feed, siteID),
        (feed) => makeOPDSShared(feed, `，目前位於 ${siteID}`),
        async (feed) => {
            feed.books = feed.books || [];
            await load_1.default(siteID, types_1.builded_map)
                .each(({ id, title, }) => {
                feed.books.push(opds_extra_1.OPDSV1.Entry.deserialize({
                    title,
                    authors: [
                        {
                            name: siteID,
                        },
                    ],
                    identifier: `book_${siteID}_${id}`,
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
        (feed) => search_1.addOpenSearch(feed, 'all'),
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
            feed.books.push(opds_extra_1.OPDSV1.Entry.deserialize({
                title: `書庫：other`,
                links: [
                    {
                        href: `/opds/other.xml`,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwwQ0FBbUU7QUFDbkUsZ0RBQTRFO0FBQzVFLGdEQUE2RDtBQUU3RCwyQ0FBb0M7QUFDcEMsK0RBQTRDO0FBQzVDLDRDQUFpRjtBQUNqRixxQ0FBeUQ7QUFFekQsU0FBZ0IsY0FBYyxDQUFDLElBQWlCLEVBQUUsTUFBYyxFQUFFO0lBRWpFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7SUFFOUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsbUJBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFlO1FBQ3RELEtBQUssRUFBRSxPQUFPLEdBQUcsRUFBRTtRQUNuQixLQUFLLEVBQUU7WUFDTjtnQkFDQyxJQUFJLEVBQUUsT0FBTztnQkFDYixLQUFLLEVBQUUsbUJBQVcsQ0FBQyxTQUFTO2dCQUM1QixJQUFJLEVBQUUsZ0JBQVEsQ0FBQywwQkFBMEI7YUFDakM7U0FDVDtLQUNELENBQUMsQ0FBQyxDQUFDO0lBRUosT0FBTyxJQUFJLENBQUE7QUFDWixDQUFDO0FBaEJELHdDQWdCQztBQUVELFNBQWdCLFlBQVksQ0FBQyxNQUFnQjtJQUU1QyxPQUFPLGdCQUFVLENBQUMsY0FBUSxDQUFDO1FBQzFCLEtBQUssRUFBRSxNQUFNLE1BQU0sRUFBRTtRQUNyQixRQUFRLEVBQUUsYUFBYSxNQUFNLEVBQUU7UUFDL0IsSUFBSSxFQUFFLGNBQWM7S0FDcEIsQ0FBQyxFQUFFO1FBRUgsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLHNCQUFhLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztRQUVyQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxTQUFTLE1BQU0sRUFBRSxDQUFDO1FBRWpELEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUVkLElBQUks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S0FBSyxFQUFFLFVBQVU7Z0JBQ2pCLEtBQUssRUFBRTtvQkFDTjt3QkFDQyxJQUFJLEVBQUUsaUJBQWlCO3dCQUN2QixLQUFLLEVBQUUsbUJBQVcsQ0FBQyxTQUFTO3dCQUM1QixJQUFJLEVBQUUsZ0JBQVEsQ0FBQywwQkFBMEI7cUJBQ2pDO2lCQUNUO2FBQ0QsQ0FBQyxDQUFDLENBQUM7WUFFSixPQUFPLElBQUksQ0FBQTtRQUNaLENBQUM7S0FDRCxDQUFDLENBQUE7QUFDSCxDQUFDO0FBekVELHdDQXlFQztBQUVELGtCQUFlLGNBQWMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGluaXRNYWluLCBidWlsZFN5bmMsIGJ1aWxkQXN5bmMgfSBmcm9tICdjYWxpYnJlLW9wZHMvbGliJztcbmltcG9ydCB7IGlkX3RpdGxlc19tYXAsIElTaXRlSURzLCBidWlsZGVkX21hcCB9IGZyb20gJy4uL25vdmVsLWNhY2hlL3R5cGVzJztcbmltcG9ydCB7IEVudW1MaW5rUmVsLCBFbnVtTUlNRSB9IGZyb20gJ29wZHMtZXh0cmEvbGliL2NvbnN0JztcbmltcG9ydCB7IExpbmsgfSBmcm9tICdvcGRzLWV4dHJhL2xpYi92MS9jb3JlJztcbmltcG9ydCB7IE9QRFNWMSB9IGZyb20gJ29wZHMtZXh0cmEnO1xuaW1wb3J0IGxvYWRDYWNoZSBmcm9tICcuLi9ub3ZlbC1jYWNoZS9sb2FkJztcbmltcG9ydCB7IHByZWZpeFJvb3QgYXMgcHJlZml4RGVtbywgdGl0bGUgYXMgdGl0bGVEZW1vIH0gZnJvbSAnLi4vZGVtb25vdmVsL29wZHMnO1xuaW1wb3J0IHsgYWRkT3BlblNlYXJjaCwgZmlsdGVyT1BEU0Jvb2sgfSBmcm9tICcuL3NlYXJjaCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlT1BEU1NoYXJlZChmZWVkOiBPUERTVjEuRmVlZCwgbXNnOiBzdHJpbmcgPSAnJyk6IE9QRFNWMS5GZWVkXG57XG5cdGZlZWQuYm9va3MgPSBmZWVkLmJvb2tzIHx8IFtdO1xuXG5cdGZlZWQuYm9va3MucHVzaChPUERTVjEuRW50cnkuZGVzZXJpYWxpemU8T1BEU1YxLkVudHJ5Pih7XG5cdFx0dGl0bGU6IGDmiYDmnInmm7jluqske21zZ31gLFxuXHRcdGxpbmtzOiBbXG5cdFx0XHR7XG5cdFx0XHRcdGhyZWY6IGAvb3Bkc2AsXG5cdFx0XHRcdHRpdGxlOiBFbnVtTGlua1JlbC5BTFRFUk5BVEUsXG5cdFx0XHRcdHR5cGU6IEVudW1NSU1FLk9QRFNfQ0FUQUxPR19GRUVEX0RPQ1VNRU5ULFxuXHRcdFx0fSBhcyBMaW5rLFxuXHRcdF0sXG5cdH0pKTtcblxuXHRyZXR1cm4gZmVlZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZU9QRFNTaXRlKHNpdGVJRDogSVNpdGVJRHMpXG57XG5cdHJldHVybiBidWlsZEFzeW5jKGluaXRNYWluKHtcblx0XHR0aXRsZTogYOabuOW6q++8miR7c2l0ZUlEfWAsXG5cdFx0c3VidGl0bGU6IGBFUHViIOiHquWLleeUn+aIkO+8miR7c2l0ZUlEfWAsXG5cdFx0aWNvbjogJy9mYXZpY29uLmljbycsXG5cdH0pLCBbXG5cblx0XHQoZmVlZCkgPT4gYWRkT3BlblNlYXJjaChmZWVkLCBzaXRlSUQpLFxuXG5cdFx0KGZlZWQpID0+IG1ha2VPUERTU2hhcmVkKGZlZWQsIGDvvIznm67liY3kvY3mlrwgJHtzaXRlSUR9YCksXG5cblx0XHRhc3luYyAoZmVlZCkgPT5cblx0XHR7XG5cdFx0XHRmZWVkLmJvb2tzID0gZmVlZC5ib29rcyB8fCBbXTtcblxuXHRcdFx0YXdhaXQgbG9hZENhY2hlPHtcblx0XHRcdFx0aWQsXG5cdFx0XHRcdHRpdGxlLFxuXHRcdFx0fVtdPihzaXRlSUQsIGJ1aWxkZWRfbWFwKVxuXHRcdFx0XHQuZWFjaCgoe1xuXHRcdFx0XHRcdGlkLFxuXHRcdFx0XHRcdHRpdGxlLFxuXHRcdFx0XHR9KSA9PiB7XG5cblx0XHRcdFx0XHRmZWVkLmJvb2tzLnB1c2goT1BEU1YxLkVudHJ5LmRlc2VyaWFsaXplPE9QRFNWMS5FbnRyeT4oe1xuXHRcdFx0XHRcdFx0dGl0bGUsXG5cdFx0XHRcdFx0XHQvLyBARklYTUU6IOmdnOiugOWkqeS4i+S4jeefpemBk+eCuuS7gOm6vOWPquiDveeUqOS9nOiAhemhr+ekulxuXHRcdFx0XHRcdFx0YXV0aG9yczogW1xuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0bmFtZTogc2l0ZUlELFxuXHRcdFx0XHRcdFx0XHR9IGFzIGFueSxcblx0XHRcdFx0XHRcdF0sXG5cdFx0XHRcdFx0XHRpZGVudGlmaWVyOiBgYm9va18ke3NpdGVJRH1fJHtpZH1gLFxuXHRcdFx0XHRcdFx0bGlua3M6IFtcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdHJlbDogRW51bUxpbmtSZWwuQUNRVUlTSVRJT04sXG5cdFx0XHRcdFx0XHRcdFx0aHJlZjogYC9maWxlLyR7c2l0ZUlEfS8ke2lkfWAsXG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogRW51bU1JTUUuZXB1Yixcblx0XHRcdFx0XHRcdFx0fSBhcyBhbnlcblx0XHRcdFx0XHRcdF0sXG5cdFx0XHRcdFx0fSkpO1xuXG5cdFx0XHRcdH0pXG5cdFx0XHQ7XG5cblx0XHRcdHJldHVybiBmZWVkXG5cdFx0fSxcblxuXHRcdC8qXG5cdFx0KGZlZWQpID0+IGZpbHRlck9QRFNCb29rKGZlZWQsIHtcblx0XHRcdHNlYXJjaFRlcm1zLFxuXHRcdH0pLFxuXHRcdCAqL1xuXG5cdF0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlT1BEU1BvcnRhbCgpXG57XG5cdHJldHVybiBidWlsZFN5bmMoaW5pdE1haW4oe1xuXHRcdHRpdGxlOiBgRVB1YiDoh6rli5XnlJ/miJBgLFxuXHRcdHN1YnRpdGxlOiBgRVB1YiDoh6rli5XnlJ/miJBgLFxuXHRcdGljb246ICcvZmF2aWNvbi5pY28nLFxuXHR9KSwgW1xuXG5cdFx0KGZlZWQpID0+IGFkZE9wZW5TZWFyY2goZmVlZCwgJ2FsbCcpLFxuXG5cdFx0KGZlZWQpID0+XG5cdFx0e1xuXHRcdFx0ZmVlZC5ib29rcyA9IGZlZWQuYm9va3MgfHwgW107XG5cblx0XHRcdGlmICgwKVxuXHRcdFx0e1xuXHRcdFx0XHRmZWVkLmJvb2tzLnB1c2goT1BEU1YxLkVudHJ5LmRlc2VyaWFsaXplPE9QRFNWMS5FbnRyeT4oe1xuXHRcdFx0XHRcdHRpdGxlOiBg5pu45bqr77yaJHt0aXRsZURlbW99YCxcblx0XHRcdFx0XHRsaW5rczogW1xuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRocmVmOiBgaHR0cHM6Ly9kZW1vbm92ZWwubmV0bGlmeS5jb20vc3RhdGljL29wZHMueG1sYCxcblx0XHRcdFx0XHRcdFx0dGl0bGU6IEVudW1MaW5rUmVsLkFMVEVSTkFURSxcblx0XHRcdFx0XHRcdFx0dHlwZTogRW51bU1JTUUuT1BEU19DQVRBTE9HX0ZFRURfRE9DVU1FTlQsXG5cdFx0XHRcdFx0XHR9IGFzIExpbmssXG5cdFx0XHRcdFx0XSxcblx0XHRcdFx0fSkpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRmZWVkLmJvb2tzLnB1c2goT1BEU1YxLkVudHJ5LmRlc2VyaWFsaXplPE9QRFNWMS5FbnRyeT4oe1xuXHRcdFx0XHRcdHRpdGxlOiBg5pu45bqr77yaJHt0aXRsZURlbW99YCxcblx0XHRcdFx0XHRsaW5rczogW1xuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRocmVmOiBgJHtwcmVmaXhEZW1vfS9hbGwueG1sYCxcblx0XHRcdFx0XHRcdFx0dGl0bGU6IEVudW1MaW5rUmVsLkFMVEVSTkFURSxcblx0XHRcdFx0XHRcdFx0dHlwZTogRW51bU1JTUUuT1BEU19DQVRBTE9HX0ZFRURfRE9DVU1FTlQsXG5cdFx0XHRcdFx0XHR9IGFzIExpbmssXG5cdFx0XHRcdFx0XSxcblx0XHRcdFx0fSkpO1xuXHRcdFx0fVxuXG5cdFx0XHRPYmplY3Qua2V5cyhpZF90aXRsZXNfbWFwKVxuXHRcdFx0XHQuZm9yRWFjaCgoc2l0ZUlEKSA9PlxuXHRcdFx0XHR7XG5cblx0XHRcdFx0XHRmZWVkLmJvb2tzLnB1c2goT1BEU1YxLkVudHJ5LmRlc2VyaWFsaXplPE9QRFNWMS5FbnRyeT4oe1xuXHRcdFx0XHRcdFx0dGl0bGU6IGDmm7jluqvvvJoke3NpdGVJRH1gLFxuXHRcdFx0XHRcdFx0bGlua3M6IFtcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGhyZWY6IGAvb3Bkcy8ke3NpdGVJRH0ueG1sYCxcblx0XHRcdFx0XHRcdFx0XHR0aXRsZTogRW51bUxpbmtSZWwuQUxURVJOQVRFLFxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IEVudW1NSU1FLk9QRFNfQ0FUQUxPR19GRUVEX0RPQ1VNRU5ULFxuXHRcdFx0XHRcdFx0XHR9IGFzIExpbmssXG5cdFx0XHRcdFx0XHRdLFxuXHRcdFx0XHRcdH0pKTtcblxuXHRcdFx0XHR9KVxuXHRcdFx0O1xuXG5cdFx0XHRmZWVkLmJvb2tzLnB1c2goT1BEU1YxLkVudHJ5LmRlc2VyaWFsaXplPE9QRFNWMS5FbnRyeT4oe1xuXHRcdFx0XHR0aXRsZTogYOabuOW6q++8mm90aGVyYCxcblx0XHRcdFx0bGlua3M6IFtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRocmVmOiBgL29wZHMvb3RoZXIueG1sYCxcblx0XHRcdFx0XHRcdHRpdGxlOiBFbnVtTGlua1JlbC5BTFRFUk5BVEUsXG5cdFx0XHRcdFx0XHR0eXBlOiBFbnVtTUlNRS5PUERTX0NBVEFMT0dfRkVFRF9ET0NVTUVOVCxcblx0XHRcdFx0XHR9IGFzIExpbmssXG5cdFx0XHRcdF0sXG5cdFx0XHR9KSk7XG5cblx0XHRcdHJldHVybiBmZWVkXG5cdFx0fSxcblx0XSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWFrZU9QRFNQb3J0YWxcbiJdfQ==