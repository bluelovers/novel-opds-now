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
function makeOPDSSite(siteID, searchTerm = '') {
    return lib_1.buildAsync(lib_1.initMain({
        title: `書庫：${siteID}`,
        subtitle: `EPub 自動生成：${siteID}`,
        icon: '/favicon.ico',
        links: [{
                rel: "search",
                href: `/search/${siteID}.xml`,
                type: "application/opensearchdescription+xml"
            }]
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
            if (searchTerm) {
                feed.books = feed.books.filter(p => p.title.includes(searchTerm));
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwwQ0FBbUU7QUFDbkUsZ0RBQTRFO0FBQzVFLGdEQUE2RDtBQUU3RCwyQ0FBb0M7QUFDcEMsK0RBQTRDO0FBQzVDLDRDQUFpRjtBQUVqRixTQUFnQixjQUFjLENBQUMsSUFBaUIsRUFBRSxNQUFjLEVBQUU7SUFFakUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztJQUU5QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQWU7UUFDdEQsS0FBSyxFQUFFLE9BQU8sR0FBRyxFQUFFO1FBQ25CLEtBQUssRUFBRTtZQUNOO2dCQUNDLElBQUksRUFBRSxPQUFPO2dCQUNiLEtBQUssRUFBRSxtQkFBVyxDQUFDLFNBQVM7Z0JBQzVCLElBQUksRUFBRSxnQkFBUSxDQUFDLDBCQUEwQjthQUNqQztTQUNUO0tBQ0QsQ0FBQyxDQUFDLENBQUM7SUFFSixPQUFPLElBQUksQ0FBQTtBQUNaLENBQUM7QUFoQkQsd0NBZ0JDO0FBRUQsU0FBZ0IsWUFBWSxDQUFDLE1BQWdCLEVBQUUsYUFBcUIsRUFBRTtJQUVyRSxPQUFPLGdCQUFVLENBQUMsY0FBUSxDQUFDO1FBQzFCLEtBQUssRUFBRSxNQUFNLE1BQU0sRUFBRTtRQUNyQixRQUFRLEVBQUUsYUFBYSxNQUFNLEVBQUU7UUFDL0IsSUFBSSxFQUFFLGNBQWM7UUFDcEIsS0FBSyxFQUFFLENBQUM7Z0JBQ1AsR0FBRyxFQUFFLFFBQVE7Z0JBQ2IsSUFBSSxFQUFFLFdBQVcsTUFBTSxNQUFNO2dCQUM3QixJQUFJLEVBQUMsdUNBQXVDO2FBQzVDLENBQUM7S0FDRixDQUFDLEVBQUU7UUFFSCxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxTQUFTLE1BQU0sRUFBRSxDQUFDO1FBRWpELEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUVkLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7WUFFOUIsTUFBTSxjQUFTLENBR1YsTUFBTSxFQUFFLG1CQUFXLENBQUM7aUJBQ3ZCLElBQUksQ0FBQyxDQUFDLEVBQ04sRUFBRSxFQUNGLEtBQUssR0FDTCxFQUFFLEVBQUU7Z0JBRUosSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsbUJBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFlO29CQUN0RCxLQUFLO29CQUNMLEtBQUssRUFBRTt3QkFDTjs0QkFDQyxHQUFHLEVBQUUsbUJBQVcsQ0FBQyxXQUFXOzRCQUM1QixJQUFJLEVBQUUsU0FBUyxNQUFNLElBQUksRUFBRSxFQUFFOzRCQUM3QixJQUFJLEVBQUUsZ0JBQVEsQ0FBQyxJQUFJO3lCQUNaO3FCQUNSO2lCQUNELENBQUMsQ0FBQyxDQUFDO1lBRUwsQ0FBQyxDQUFDLENBQ0Y7WUFDRCxJQUFJLFVBQVUsRUFDZDtnQkFDQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQSxFQUFFLENBQUEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzthQUNoRTtZQUNELE9BQU8sSUFBSSxDQUFBO1FBQ1osQ0FBQztLQUNELENBQUMsQ0FBQTtBQUNILENBQUM7QUFoREQsb0NBZ0RDO0FBRUQsU0FBZ0IsY0FBYztJQUU3QixPQUFPLGVBQVMsQ0FBQyxjQUFRLENBQUM7UUFDekIsS0FBSyxFQUFFLFdBQVc7UUFDbEIsUUFBUSxFQUFFLFdBQVc7UUFDckIsSUFBSSxFQUFFLGNBQWM7S0FDcEIsQ0FBQyxFQUFFO1FBRUgsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUVSLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7WUFFOUIsSUFBSSxDQUFDLEVBQ0w7Z0JBQ0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsbUJBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFlO29CQUN0RCxLQUFLLEVBQUUsTUFBTSxZQUFTLEVBQUU7b0JBQ3hCLEtBQUssRUFBRTt3QkFDTjs0QkFDQyxJQUFJLEVBQUUsK0NBQStDOzRCQUNyRCxLQUFLLEVBQUUsbUJBQVcsQ0FBQyxTQUFTOzRCQUM1QixJQUFJLEVBQUUsZ0JBQVEsQ0FBQywwQkFBMEI7eUJBQ2pDO3FCQUNUO2lCQUNELENBQUMsQ0FBQyxDQUFDO2FBQ0o7aUJBRUQ7Z0JBQ0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsbUJBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFlO29CQUN0RCxLQUFLLEVBQUUsTUFBTSxZQUFTLEVBQUU7b0JBQ3hCLEtBQUssRUFBRTt3QkFDTjs0QkFDQyxJQUFJLEVBQUUsR0FBRyxpQkFBVSxVQUFVOzRCQUM3QixLQUFLLEVBQUUsbUJBQVcsQ0FBQyxTQUFTOzRCQUM1QixJQUFJLEVBQUUsZ0JBQVEsQ0FBQywwQkFBMEI7eUJBQ2pDO3FCQUNUO2lCQUNELENBQUMsQ0FBQyxDQUFDO2FBQ0o7WUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLHFCQUFhLENBQUM7aUJBQ3hCLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUduQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQWU7b0JBQ3RELEtBQUssRUFBRSxNQUFNLE1BQU0sRUFBRTtvQkFDckIsS0FBSyxFQUFFO3dCQUNOOzRCQUNDLElBQUksRUFBRSxTQUFTLE1BQU0sTUFBTTs0QkFDM0IsS0FBSyxFQUFFLG1CQUFXLENBQUMsU0FBUzs0QkFDNUIsSUFBSSxFQUFFLGdCQUFRLENBQUMsMEJBQTBCO3lCQUNqQztxQkFDVDtpQkFDRCxDQUFDLENBQUMsQ0FBQztZQUVMLENBQUMsQ0FBQyxDQUNGO1lBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsbUJBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFlO2dCQUN0RCxLQUFLLEVBQUUsVUFBVTtnQkFDakIsS0FBSyxFQUFFO29CQUNOO3dCQUNDLElBQUksRUFBRSxpQkFBaUI7d0JBQ3ZCLEtBQUssRUFBRSxtQkFBVyxDQUFDLFNBQVM7d0JBQzVCLElBQUksRUFBRSxnQkFBUSxDQUFDLDBCQUEwQjtxQkFDakM7aUJBQ1Q7YUFDRCxDQUFDLENBQUMsQ0FBQztZQUVKLE9BQU8sSUFBSSxDQUFBO1FBQ1osQ0FBQztLQUNELENBQUMsQ0FBQTtBQUNILENBQUM7QUF2RUQsd0NBdUVDO0FBRUQsa0JBQWUsY0FBYyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaW5pdE1haW4sIGJ1aWxkU3luYywgYnVpbGRBc3luYyB9IGZyb20gJ2NhbGlicmUtb3Bkcy9saWInO1xuaW1wb3J0IHsgaWRfdGl0bGVzX21hcCwgSVNpdGVJRHMsIGJ1aWxkZWRfbWFwIH0gZnJvbSAnLi4vbm92ZWwtY2FjaGUvdHlwZXMnO1xuaW1wb3J0IHsgRW51bUxpbmtSZWwsIEVudW1NSU1FIH0gZnJvbSAnb3Bkcy1leHRyYS9saWIvY29uc3QnO1xuaW1wb3J0IHsgTGluayB9IGZyb20gJ29wZHMtZXh0cmEvbGliL3YxL2NvcmUnO1xuaW1wb3J0IHsgT1BEU1YxIH0gZnJvbSAnb3Bkcy1leHRyYSc7XG5pbXBvcnQgbG9hZENhY2hlIGZyb20gJy4uL25vdmVsLWNhY2hlL2xvYWQnO1xuaW1wb3J0IHsgcHJlZml4Um9vdCBhcyBwcmVmaXhEZW1vLCB0aXRsZSBhcyB0aXRsZURlbW8gfSBmcm9tICcuLi9kZW1vbm92ZWwvb3Bkcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlT1BEU1NoYXJlZChmZWVkOiBPUERTVjEuRmVlZCwgbXNnOiBzdHJpbmcgPSAnJyk6IE9QRFNWMS5GZWVkXG57XG5cdGZlZWQuYm9va3MgPSBmZWVkLmJvb2tzIHx8IFtdO1xuXG5cdGZlZWQuYm9va3MucHVzaChPUERTVjEuRW50cnkuZGVzZXJpYWxpemU8T1BEU1YxLkVudHJ5Pih7XG5cdFx0dGl0bGU6IGDmiYDmnInmm7jluqske21zZ31gLFxuXHRcdGxpbmtzOiBbXG5cdFx0XHR7XG5cdFx0XHRcdGhyZWY6IGAvb3Bkc2AsXG5cdFx0XHRcdHRpdGxlOiBFbnVtTGlua1JlbC5BTFRFUk5BVEUsXG5cdFx0XHRcdHR5cGU6IEVudW1NSU1FLk9QRFNfQ0FUQUxPR19GRUVEX0RPQ1VNRU5ULFxuXHRcdFx0fSBhcyBMaW5rLFxuXHRcdF0sXG5cdH0pKTtcblxuXHRyZXR1cm4gZmVlZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZU9QRFNTaXRlKHNpdGVJRDogSVNpdGVJRHMsIHNlYXJjaFRlcm06IHN0cmluZyA9ICcnKVxue1xuXHRyZXR1cm4gYnVpbGRBc3luYyhpbml0TWFpbih7XG5cdFx0dGl0bGU6IGDmm7jluqvvvJoke3NpdGVJRH1gLFxuXHRcdHN1YnRpdGxlOiBgRVB1YiDoh6rli5XnlJ/miJDvvJoke3NpdGVJRH1gLFxuXHRcdGljb246ICcvZmF2aWNvbi5pY28nLFxuXHRcdGxpbmtzOiBbe1xuXHRcdFx0cmVsOiBcInNlYXJjaFwiLFxuXHRcdFx0aHJlZjogYC9zZWFyY2gvJHtzaXRlSUR9LnhtbGAsXG5cdFx0XHR0eXBlOlwiYXBwbGljYXRpb24vb3BlbnNlYXJjaGRlc2NyaXB0aW9uK3htbFwiXG5cdFx0fV1cblx0fSksIFtcblxuXHRcdChmZWVkKSA9PiBtYWtlT1BEU1NoYXJlZChmZWVkLCBg77yM55uu5YmN5L2N5pa8ICR7c2l0ZUlEfWApLFxuXG5cdFx0YXN5bmMgKGZlZWQpID0+XG5cdFx0e1xuXHRcdFx0ZmVlZC5ib29rcyA9IGZlZWQuYm9va3MgfHwgW107XG5cblx0XHRcdGF3YWl0IGxvYWRDYWNoZTx7XG5cdFx0XHRcdGlkLFxuXHRcdFx0XHR0aXRsZSxcblx0XHRcdH1bXT4oc2l0ZUlELCBidWlsZGVkX21hcClcblx0XHRcdFx0LmVhY2goKHtcblx0XHRcdFx0XHRpZCxcblx0XHRcdFx0XHR0aXRsZSxcblx0XHRcdFx0fSkgPT4ge1xuXG5cdFx0XHRcdFx0ZmVlZC5ib29rcy5wdXNoKE9QRFNWMS5FbnRyeS5kZXNlcmlhbGl6ZTxPUERTVjEuRW50cnk+KHtcblx0XHRcdFx0XHRcdHRpdGxlLFxuXHRcdFx0XHRcdFx0bGlua3M6IFtcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdHJlbDogRW51bUxpbmtSZWwuQUNRVUlTSVRJT04sXG5cdFx0XHRcdFx0XHRcdFx0aHJlZjogYC9maWxlLyR7c2l0ZUlEfS8ke2lkfWAsXG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogRW51bU1JTUUuZXB1Yixcblx0XHRcdFx0XHRcdFx0fSBhcyBhbnlcblx0XHRcdFx0XHRcdF0sXG5cdFx0XHRcdFx0fSkpO1xuXG5cdFx0XHRcdH0pXG5cdFx0XHQ7XG5cdFx0XHRpZiAoc2VhcmNoVGVybSlcblx0XHRcdHtcblx0XHRcdFx0ZmVlZC5ib29rcyA9IGZlZWQuYm9va3MuZmlsdGVyKHA9PnAudGl0bGUuaW5jbHVkZXMoc2VhcmNoVGVybSkpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZlZWRcblx0XHR9LFxuXHRdKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZU9QRFNQb3J0YWwoKVxue1xuXHRyZXR1cm4gYnVpbGRTeW5jKGluaXRNYWluKHtcblx0XHR0aXRsZTogYEVQdWIg6Ieq5YuV55Sf5oiQYCxcblx0XHRzdWJ0aXRsZTogYEVQdWIg6Ieq5YuV55Sf5oiQYCxcblx0XHRpY29uOiAnL2Zhdmljb24uaWNvJyxcblx0fSksIFtcblxuXHRcdChmZWVkKSA9PlxuXHRcdHtcblx0XHRcdGZlZWQuYm9va3MgPSBmZWVkLmJvb2tzIHx8IFtdO1xuXG5cdFx0XHRpZiAoMClcblx0XHRcdHtcblx0XHRcdFx0ZmVlZC5ib29rcy5wdXNoKE9QRFNWMS5FbnRyeS5kZXNlcmlhbGl6ZTxPUERTVjEuRW50cnk+KHtcblx0XHRcdFx0XHR0aXRsZTogYOabuOW6q++8miR7dGl0bGVEZW1vfWAsXG5cdFx0XHRcdFx0bGlua3M6IFtcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0aHJlZjogYGh0dHBzOi8vZGVtb25vdmVsLm5ldGxpZnkuY29tL3N0YXRpYy9vcGRzLnhtbGAsXG5cdFx0XHRcdFx0XHRcdHRpdGxlOiBFbnVtTGlua1JlbC5BTFRFUk5BVEUsXG5cdFx0XHRcdFx0XHRcdHR5cGU6IEVudW1NSU1FLk9QRFNfQ0FUQUxPR19GRUVEX0RPQ1VNRU5ULFxuXHRcdFx0XHRcdFx0fSBhcyBMaW5rLFxuXHRcdFx0XHRcdF0sXG5cdFx0XHRcdH0pKTtcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0ZmVlZC5ib29rcy5wdXNoKE9QRFNWMS5FbnRyeS5kZXNlcmlhbGl6ZTxPUERTVjEuRW50cnk+KHtcblx0XHRcdFx0XHR0aXRsZTogYOabuOW6q++8miR7dGl0bGVEZW1vfWAsXG5cdFx0XHRcdFx0bGlua3M6IFtcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0aHJlZjogYCR7cHJlZml4RGVtb30vYWxsLnhtbGAsXG5cdFx0XHRcdFx0XHRcdHRpdGxlOiBFbnVtTGlua1JlbC5BTFRFUk5BVEUsXG5cdFx0XHRcdFx0XHRcdHR5cGU6IEVudW1NSU1FLk9QRFNfQ0FUQUxPR19GRUVEX0RPQ1VNRU5ULFxuXHRcdFx0XHRcdFx0fSBhcyBMaW5rLFxuXHRcdFx0XHRcdF0sXG5cdFx0XHRcdH0pKTtcblx0XHRcdH1cblxuXHRcdFx0T2JqZWN0LmtleXMoaWRfdGl0bGVzX21hcClcblx0XHRcdFx0LmZvckVhY2goKHNpdGVJRCkgPT5cblx0XHRcdFx0e1xuXG5cdFx0XHRcdFx0ZmVlZC5ib29rcy5wdXNoKE9QRFNWMS5FbnRyeS5kZXNlcmlhbGl6ZTxPUERTVjEuRW50cnk+KHtcblx0XHRcdFx0XHRcdHRpdGxlOiBg5pu45bqr77yaJHtzaXRlSUR9YCxcblx0XHRcdFx0XHRcdGxpbmtzOiBbXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRocmVmOiBgL29wZHMvJHtzaXRlSUR9LnhtbGAsXG5cdFx0XHRcdFx0XHRcdFx0dGl0bGU6IEVudW1MaW5rUmVsLkFMVEVSTkFURSxcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBFbnVtTUlNRS5PUERTX0NBVEFMT0dfRkVFRF9ET0NVTUVOVCxcblx0XHRcdFx0XHRcdFx0fSBhcyBMaW5rLFxuXHRcdFx0XHRcdFx0XSxcblx0XHRcdFx0XHR9KSk7XG5cblx0XHRcdFx0fSlcblx0XHRcdDtcblxuXHRcdFx0ZmVlZC5ib29rcy5wdXNoKE9QRFNWMS5FbnRyeS5kZXNlcmlhbGl6ZTxPUERTVjEuRW50cnk+KHtcblx0XHRcdFx0dGl0bGU6IGDmm7jluqvvvJpvdGhlcmAsXG5cdFx0XHRcdGxpbmtzOiBbXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aHJlZjogYC9vcGRzL290aGVyLnhtbGAsXG5cdFx0XHRcdFx0XHR0aXRsZTogRW51bUxpbmtSZWwuQUxURVJOQVRFLFxuXHRcdFx0XHRcdFx0dHlwZTogRW51bU1JTUUuT1BEU19DQVRBTE9HX0ZFRURfRE9DVU1FTlQsXG5cdFx0XHRcdFx0fSBhcyBMaW5rLFxuXHRcdFx0XHRdLFxuXHRcdFx0fSkpO1xuXG5cdFx0XHRyZXR1cm4gZmVlZFxuXHRcdH0sXG5cdF0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IG1ha2VPUERTUG9ydGFsXG4iXX0=