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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDBDQUFtRTtBQUNuRSxnREFBNEU7QUFDNUUsZ0RBQTZEO0FBRTdELDJDQUFvQztBQUNwQywrREFBNEM7QUFDNUMsNENBQWlGO0FBRWpGLFNBQWdCLGNBQWMsQ0FBQyxJQUFpQixFQUFFLE1BQWMsRUFBRTtJQUVqRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO0lBRTlCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLG1CQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBZTtRQUN0RCxLQUFLLEVBQUUsT0FBTyxHQUFHLEVBQUU7UUFDbkIsS0FBSyxFQUFFO1lBQ047Z0JBQ0MsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsS0FBSyxFQUFFLG1CQUFXLENBQUMsU0FBUztnQkFDNUIsSUFBSSxFQUFFLGdCQUFRLENBQUMsMEJBQTBCO2FBQ2pDO1NBQ1Q7S0FDRCxDQUFDLENBQUMsQ0FBQztJQUVKLE9BQU8sSUFBSSxDQUFBO0FBQ1osQ0FBQztBQWhCRCx3Q0FnQkM7QUFFRCxTQUFnQixZQUFZLENBQUMsTUFBZ0I7SUFFNUMsT0FBTyxnQkFBVSxDQUFDLGNBQVEsQ0FBQztRQUMxQixLQUFLLEVBQUUsTUFBTSxNQUFNLEVBQUU7UUFDckIsUUFBUSxFQUFFLGFBQWEsTUFBTSxFQUFFO1FBQy9CLElBQUksRUFBRSxjQUFjO0tBQ3BCLENBQUMsRUFBRTtRQUVILENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFNBQVMsTUFBTSxFQUFFLENBQUM7UUFFakQsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO1lBRWQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUU5QixNQUFNLGNBQVMsQ0FHVixNQUFNLEVBQUUs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a0JBQWUsY0FBYyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaW5pdE1haW4sIGJ1aWxkU3luYywgYnVpbGRBc3luYyB9IGZyb20gJ2NhbGlicmUtb3Bkcy9saWInO1xuaW1wb3J0IHsgaWRfdGl0bGVzX21hcCwgSVNpdGVJRHMsIGJ1aWxkZWRfbWFwIH0gZnJvbSAnLi4vbm92ZWwtY2FjaGUvdHlwZXMnO1xuaW1wb3J0IHsgRW51bUxpbmtSZWwsIEVudW1NSU1FIH0gZnJvbSAnb3Bkcy1leHRyYS9saWIvY29uc3QnO1xuaW1wb3J0IHsgTGluayB9IGZyb20gJ29wZHMtZXh0cmEvbGliL3YxL2NvcmUnO1xuaW1wb3J0IHsgT1BEU1YxIH0gZnJvbSAnb3Bkcy1leHRyYSc7XG5pbXBvcnQgbG9hZENhY2hlIGZyb20gJy4uL25vdmVsLWNhY2hlL2xvYWQnO1xuaW1wb3J0IHsgcHJlZml4Um9vdCBhcyBwcmVmaXhEZW1vLCB0aXRsZSBhcyB0aXRsZURlbW8gfSBmcm9tICcuLi9kZW1vbm92ZWwvb3Bkcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlT1BEU1NoYXJlZChmZWVkOiBPUERTVjEuRmVlZCwgbXNnOiBzdHJpbmcgPSAnJyk6IE9QRFNWMS5GZWVkXG57XG5cdGZlZWQuYm9va3MgPSBmZWVkLmJvb2tzIHx8IFtdO1xuXG5cdGZlZWQuYm9va3MucHVzaChPUERTVjEuRW50cnkuZGVzZXJpYWxpemU8T1BEU1YxLkVudHJ5Pih7XG5cdFx0dGl0bGU6IGDmiYDmnInmm7jluqske21zZ31gLFxuXHRcdGxpbmtzOiBbXG5cdFx0XHR7XG5cdFx0XHRcdGhyZWY6IGAvb3Bkc2AsXG5cdFx0XHRcdHRpdGxlOiBFbnVtTGlua1JlbC5BTFRFUk5BVEUsXG5cdFx0XHRcdHR5cGU6IEVudW1NSU1FLk9QRFNfQ0FUQUxPR19GRUVEX0RPQ1VNRU5ULFxuXHRcdFx0fSBhcyBMaW5rLFxuXHRcdF0sXG5cdH0pKTtcblxuXHRyZXR1cm4gZmVlZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZU9QRFNTaXRlKHNpdGVJRDogSVNpdGVJRHMpXG57XG5cdHJldHVybiBidWlsZEFzeW5jKGluaXRNYWluKHtcblx0XHR0aXRsZTogYOabuOW6q++8miR7c2l0ZUlEfWAsXG5cdFx0c3VidGl0bGU6IGBFUHViIOiHquWLleeUn+aIkO+8miR7c2l0ZUlEfWAsXG5cdFx0aWNvbjogJy9mYXZpY29uLmljbycsXG5cdH0pLCBbXG5cblx0XHQoZmVlZCkgPT4gbWFrZU9QRFNTaGFyZWQoZmVlZCwgYO+8jOebruWJjeS9jeaWvCAke3NpdGVJRH1gKSxcblxuXHRcdGFzeW5jIChmZWVkKSA9PlxuXHRcdHtcblx0XHRcdGZlZWQuYm9va3MgPSBmZWVkLmJvb2tzIHx8IFtdO1xuXG5cdFx0XHRhd2FpdCBsb2FkQ2FjaGU8e1xuXHRcdFx0XHRpZCxcblx0XHRcdFx0dGl0bGUsXG5cdFx0XHR9W10+KHNpdGVJRCwgYnVpbGRlZF9tYXApXG5cdFx0XHRcdC5lYWNoKCh7XG5cdFx0XHRcdFx0aWQsXG5cdFx0XHRcdFx0dGl0bGUsXG5cdFx0XHRcdH0pID0+IHtcblxuXHRcdFx0XHRcdGZlZWQuYm9va3MucHVzaChPUERTVjEuRW50cnkuZGVzZXJpYWxpemU8T1BEU1YxLkVudHJ5Pih7XG5cdFx0XHRcdFx0XHR0aXRsZSxcblx0XHRcdFx0XHRcdGxpbmtzOiBbXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRyZWw6IEVudW1MaW5rUmVsLkFDUVVJU0lUSU9OLFxuXHRcdFx0XHRcdFx0XHRcdGhyZWY6IGAvZmlsZS8ke3NpdGVJRH0vJHtpZH1gLFxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IEVudW1NSU1FLmVwdWIsXG5cdFx0XHRcdFx0XHRcdH0gYXMgYW55XG5cdFx0XHRcdFx0XHRdLFxuXHRcdFx0XHRcdH0pKTtcblxuXHRcdFx0XHR9KVxuXHRcdFx0O1xuXG5cdFx0XHRyZXR1cm4gZmVlZFxuXHRcdH0sXG5cdF0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlT1BEU1BvcnRhbCgpXG57XG5cdHJldHVybiBidWlsZFN5bmMoaW5pdE1haW4oe1xuXHRcdHRpdGxlOiBgRVB1YiDoh6rli5XnlJ/miJBgLFxuXHRcdHN1YnRpdGxlOiBgRVB1YiDoh6rli5XnlJ/miJBgLFxuXHRcdGljb246ICcvZmF2aWNvbi5pY28nLFxuXHR9KSwgW1xuXG5cdFx0KGZlZWQpID0+XG5cdFx0e1xuXHRcdFx0ZmVlZC5ib29rcyA9IGZlZWQuYm9va3MgfHwgW107XG5cblx0XHRcdGlmICgwKVxuXHRcdFx0e1xuXHRcdFx0XHRmZWVkLmJvb2tzLnB1c2goT1BEU1YxLkVudHJ5LmRlc2VyaWFsaXplPE9QRFNWMS5FbnRyeT4oe1xuXHRcdFx0XHRcdHRpdGxlOiBg5pu45bqr77yaJHt0aXRsZURlbW99YCxcblx0XHRcdFx0XHRsaW5rczogW1xuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRocmVmOiBgaHR0cHM6Ly9kZW1vbm92ZWwubmV0bGlmeS5jb20vc3RhdGljL29wZHMueG1sYCxcblx0XHRcdFx0XHRcdFx0dGl0bGU6IEVudW1MaW5rUmVsLkFMVEVSTkFURSxcblx0XHRcdFx0XHRcdFx0dHlwZTogRW51bU1JTUUuT1BEU19DQVRBTE9HX0ZFRURfRE9DVU1FTlQsXG5cdFx0XHRcdFx0XHR9IGFzIExpbmssXG5cdFx0XHRcdFx0XSxcblx0XHRcdFx0fSkpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRmZWVkLmJvb2tzLnB1c2goT1BEU1YxLkVudHJ5LmRlc2VyaWFsaXplPE9QRFNWMS5FbnRyeT4oe1xuXHRcdFx0XHRcdHRpdGxlOiBg5pu45bqr77yaJHt0aXRsZURlbW99YCxcblx0XHRcdFx0XHRsaW5rczogW1xuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRocmVmOiBgJHtwcmVmaXhEZW1vfS9hbGwueG1sYCxcblx0XHRcdFx0XHRcdFx0dGl0bGU6IEVudW1MaW5rUmVsLkFMVEVSTkFURSxcblx0XHRcdFx0XHRcdFx0dHlwZTogRW51bU1JTUUuT1BEU19DQVRBTE9HX0ZFRURfRE9DVU1FTlQsXG5cdFx0XHRcdFx0XHR9IGFzIExpbmssXG5cdFx0XHRcdFx0XSxcblx0XHRcdFx0fSkpO1xuXHRcdFx0fVxuXG5cdFx0XHRPYmplY3Qua2V5cyhpZF90aXRsZXNfbWFwKVxuXHRcdFx0XHQuZm9yRWFjaCgoc2l0ZUlEKSA9PlxuXHRcdFx0XHR7XG5cblx0XHRcdFx0XHRmZWVkLmJvb2tzLnB1c2goT1BEU1YxLkVudHJ5LmRlc2VyaWFsaXplPE9QRFNWMS5FbnRyeT4oe1xuXHRcdFx0XHRcdFx0dGl0bGU6IGDmm7jluqvvvJoke3NpdGVJRH1gLFxuXHRcdFx0XHRcdFx0bGlua3M6IFtcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGhyZWY6IGAvb3Bkcy8ke3NpdGVJRH0ueG1sYCxcblx0XHRcdFx0XHRcdFx0XHR0aXRsZTogRW51bUxpbmtSZWwuQUxURVJOQVRFLFxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IEVudW1NSU1FLk9QRFNfQ0FUQUxPR19GRUVEX0RPQ1VNRU5ULFxuXHRcdFx0XHRcdFx0XHR9IGFzIExpbmssXG5cdFx0XHRcdFx0XHRdLFxuXHRcdFx0XHRcdH0pKTtcblxuXHRcdFx0XHR9KVxuXHRcdFx0O1xuXG5cdFx0XHRmZWVkLmJvb2tzLnB1c2goT1BEU1YxLkVudHJ5LmRlc2VyaWFsaXplPE9QRFNWMS5FbnRyeT4oe1xuXHRcdFx0XHR0aXRsZTogYOabuOW6q++8mm90aGVyYCxcblx0XHRcdFx0bGlua3M6IFtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRocmVmOiBgL29wZHMvb3RoZXIueG1sYCxcblx0XHRcdFx0XHRcdHRpdGxlOiBFbnVtTGlua1JlbC5BTFRFUk5BVEUsXG5cdFx0XHRcdFx0XHR0eXBlOiBFbnVtTUlNRS5PUERTX0NBVEFMT0dfRkVFRF9ET0NVTUVOVCxcblx0XHRcdFx0XHR9IGFzIExpbmssXG5cdFx0XHRcdF0sXG5cdFx0XHR9KSk7XG5cblx0XHRcdHJldHVybiBmZWVkXG5cdFx0fSxcblx0XSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWFrZU9QRFNQb3J0YWxcbiJdfQ==