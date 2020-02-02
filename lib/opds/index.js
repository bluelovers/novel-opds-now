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
function makeOPDSSite(siteID) {
    return lib_1.buildAsync(lib_1.initMain({
        title: `書庫：${siteID}`,
        subtitle: `EPub 自動生成：${siteID}`,
        icon: '/favicon.ico',
    }), [
        async (feed) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDBDQUFtRTtBQUNuRSxnREFBNEU7QUFDNUUsZ0RBQTZEO0FBRTdELDJDQUFvQztBQUNwQywrREFBNEM7QUFDNUMsNENBQWlGO0FBRWpGLFNBQWdCLFlBQVksQ0FBQyxNQUFnQjtJQUU1QyxPQUFPLGdCQUFVLENBQUMsY0FBUSxDQUFDO1FBQzFCLEtBQUssRUFBRSxNQUFNLE1BQU0sRUFBRTtRQUNyQixRQUFRLEVBQUUsYUFBYSxNQUFNLEVBQUU7UUFDL0IsSUFBSSxFQUFFLGNBQWM7S0FDcEIsQ0FBQyxFQUFFO1FBQ0gsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO1lBRWQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUU5QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQWU7Z0JBQ3RELEtBQUssRUFBRSxNQUFNO2dCQUNiLEtBQUssRUFBRTtvQkFDTjt3QkFDQyxJQUFJLEVBQUUsT0FBTzt3QkFDYixLQUFLLEVBQUUsbUJBQVcsQ0FBQyxTQUFTO3dCQUM1QixJQUFJLEVBQUUsZ0JBQVEsQ0FBQywwQkFBMEI7cUJBQ2pDO2lCQUNUO2FBQ0QsQ0FBQyxDQUFDLENBQUM7WUFFSixNQUFNLGNBQVMsQ0FHVixNQUFNLEVBQUUsbUJBQVcsQ0FBQztpQkFDdkIsSUFBSSxDQUFDLENBQUMsRUFDTixFQUFFLEVBQ0YsS0FBSyxHQUNMLEVBQUUsRUFBRTtnQkFFSixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQWU7b0JBQ3RELEtBQUs7b0JBQ0wsS0FBSyxFQUFFO3dCQUNOOzRCQUNDLEdBQUcsRUFBRSxtQkFBVyxDQUFDLFdBQVc7NEJBQzVCLElBQUksRUFBRSxTQUFTLE1BQU0sSUFBSSxFQUFFLEVBQUU7NEJBQzdCLElBQUksRUFBRSxnQkFBUSxDQUFDLElBQUk7eUJBQ1o7cUJBQ1I7aUJBQ0QsQ0FBQyxDQUFDLENBQUM7WUFFTCxDQUFDLENBQUMsQ0FDRjtZQUVELE9BQU8sSUFBSSxDQUFBO1FBQ1osQ0FBQztLQUNELENBQUMsQ0FBQTtBQUNILENBQUM7QUFoREQsb0NBZ0RDO0FBRUQsU0FBZ0IsY0FBYztJQUU3QixPQUFPLGVBQVMsQ0FBQyxjQUFRLENBQUM7UUFDekIsS0FBSyxFQUFFLFdBQVc7UUFDbEIsUUFBUSxFQUFFLFdBQVc7UUFDckIsSUFBSSxFQUFFLGNBQWM7S0FDcEIsQ0FBQyxFQUFFO1FBRUgsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUVSLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7WUFFOUIsSUFBSSxDQUFDLEVBQ0w7Z0JBQ0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsbUJBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFlO29CQUN0RCxLQUFLLEVBQUUsTUFBTSxZQUFTLEVBQUU7b0JBQ3hCLEtBQUssRUFBRTt3QkFDTjs0QkFDQyxJQUFJLEVBQUUsK0NBQStDOzRCQUNyRCxLQUFLLEVBQUUsbUJBQVcsQ0FBQyxTQUFTOzRCQUM1QixJQUFJLEVBQUUsZ0JBQVEsQ0FBQywwQkFBMEI7eUJBQ2pDO3FCQUNUO2lCQUNELENBQUMsQ0FBQyxDQUFDO2FBQ0o7aUJBRUQ7Z0JBQ0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsbUJBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFlO29CQUN0RCxLQUFLLEVBQUUsTUFBTSxZQUFTLEVBQUU7b0JBQ3hCLEtBQUssRUFBRTt3QkFDTjs0QkFDQyxJQUFJLEVBQUUsR0FBRyxpQkFBVSxVQUFVOzRCQUM3QixLQUFLLEVBQUUsbUJBQVcsQ0FBQyxTQUFTOzRCQUM1QixJQUFJLEVBQUUsZ0JBQVEsQ0FBQywwQkFBMEI7eUJBQ2pDO3FCQUNUO2lCQUNELENBQUMsQ0FBQyxDQUFDO2FBQ0o7WUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLHFCQUFhLENBQUM7aUJBQ3hCLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUduQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQWU7b0JBQ3RELEtBQUssRUFBRSxNQUFNLE1BQU0sRUFBRTtvQkFDckIsS0FBSyxFQUFFO3dCQUNOOzRCQUNDLElBQUksRUFBRSxTQUFTLE1BQU0sTUFBTTs0QkFDM0IsS0FBSyxFQUFFLG1CQUFXLENBQUMsU0FBUzs0QkFDNUIsSUFBSSxFQUFFLGdCQUFRLENBQUMsMEJBQTBCO3lCQUNqQztxQkFDVDtpQkFDRCxDQUFDLENBQUMsQ0FBQztZQUVMLENBQUMsQ0FBQyxDQUNGO1lBRUQsT0FBTyxJQUFJLENBQUE7UUFDWixDQUFDO0tBQ0QsQ0FBQyxDQUFBO0FBQ0gsQ0FBQztBQTVERCx3Q0E0REM7QUFFRCxrQkFBZSxjQUFjLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpbml0TWFpbiwgYnVpbGRTeW5jLCBidWlsZEFzeW5jIH0gZnJvbSAnY2FsaWJyZS1vcGRzL2xpYic7XG5pbXBvcnQgeyBpZF90aXRsZXNfbWFwLCBJU2l0ZUlEcywgYnVpbGRlZF9tYXAgfSBmcm9tICcuLi9ub3ZlbC1jYWNoZS90eXBlcyc7XG5pbXBvcnQgeyBFbnVtTGlua1JlbCwgRW51bU1JTUUgfSBmcm9tICdvcGRzLWV4dHJhL2xpYi9jb25zdCc7XG5pbXBvcnQgeyBMaW5rIH0gZnJvbSAnb3Bkcy1leHRyYS9saWIvdjEvY29yZSc7XG5pbXBvcnQgeyBPUERTVjEgfSBmcm9tICdvcGRzLWV4dHJhJztcbmltcG9ydCBsb2FkQ2FjaGUgZnJvbSAnLi4vbm92ZWwtY2FjaGUvbG9hZCc7XG5pbXBvcnQgeyBwcmVmaXhSb290IGFzIHByZWZpeERlbW8sIHRpdGxlIGFzIHRpdGxlRGVtbyB9IGZyb20gJy4uL2RlbW9ub3ZlbC9vcGRzJztcblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VPUERTU2l0ZShzaXRlSUQ6IElTaXRlSURzKVxue1xuXHRyZXR1cm4gYnVpbGRBc3luYyhpbml0TWFpbih7XG5cdFx0dGl0bGU6IGDmm7jluqvvvJoke3NpdGVJRH1gLFxuXHRcdHN1YnRpdGxlOiBgRVB1YiDoh6rli5XnlJ/miJDvvJoke3NpdGVJRH1gLFxuXHRcdGljb246ICcvZmF2aWNvbi5pY28nLFxuXHR9KSwgW1xuXHRcdGFzeW5jIChmZWVkKSA9PlxuXHRcdHtcblx0XHRcdGZlZWQuYm9va3MgPSBmZWVkLmJvb2tzIHx8IFtdO1xuXG5cdFx0XHRmZWVkLmJvb2tzLnB1c2goT1BEU1YxLkVudHJ5LmRlc2VyaWFsaXplPE9QRFNWMS5FbnRyeT4oe1xuXHRcdFx0XHR0aXRsZTogYOaJgOacieabuOW6q2AsXG5cdFx0XHRcdGxpbmtzOiBbXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aHJlZjogYC9vcGRzYCxcblx0XHRcdFx0XHRcdHRpdGxlOiBFbnVtTGlua1JlbC5BTFRFUk5BVEUsXG5cdFx0XHRcdFx0XHR0eXBlOiBFbnVtTUlNRS5PUERTX0NBVEFMT0dfRkVFRF9ET0NVTUVOVCxcblx0XHRcdFx0XHR9IGFzIExpbmssXG5cdFx0XHRcdF0sXG5cdFx0XHR9KSk7XG5cblx0XHRcdGF3YWl0IGxvYWRDYWNoZTx7XG5cdFx0XHRcdGlkLFxuXHRcdFx0XHR0aXRsZSxcblx0XHRcdH1bXT4oc2l0ZUlELCBidWlsZGVkX21hcClcblx0XHRcdFx0LmVhY2goKHtcblx0XHRcdFx0XHRpZCxcblx0XHRcdFx0XHR0aXRsZSxcblx0XHRcdFx0fSkgPT4ge1xuXG5cdFx0XHRcdFx0ZmVlZC5ib29rcy5wdXNoKE9QRFNWMS5FbnRyeS5kZXNlcmlhbGl6ZTxPUERTVjEuRW50cnk+KHtcblx0XHRcdFx0XHRcdHRpdGxlLFxuXHRcdFx0XHRcdFx0bGlua3M6IFtcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdHJlbDogRW51bUxpbmtSZWwuQUNRVUlTSVRJT04sXG5cdFx0XHRcdFx0XHRcdFx0aHJlZjogYC9maWxlLyR7c2l0ZUlEfS8ke2lkfWAsXG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogRW51bU1JTUUuZXB1Yixcblx0XHRcdFx0XHRcdFx0fSBhcyBhbnlcblx0XHRcdFx0XHRcdF0sXG5cdFx0XHRcdFx0fSkpO1xuXG5cdFx0XHRcdH0pXG5cdFx0XHQ7XG5cblx0XHRcdHJldHVybiBmZWVkXG5cdFx0fSxcblx0XSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VPUERTUG9ydGFsKClcbntcblx0cmV0dXJuIGJ1aWxkU3luYyhpbml0TWFpbih7XG5cdFx0dGl0bGU6IGBFUHViIOiHquWLleeUn+aIkGAsXG5cdFx0c3VidGl0bGU6IGBFUHViIOiHquWLleeUn+aIkGAsXG5cdFx0aWNvbjogJy9mYXZpY29uLmljbycsXG5cdH0pLCBbXG5cblx0XHQoZmVlZCkgPT5cblx0XHR7XG5cdFx0XHRmZWVkLmJvb2tzID0gZmVlZC5ib29rcyB8fCBbXTtcblxuXHRcdFx0aWYgKDApXG5cdFx0XHR7XG5cdFx0XHRcdGZlZWQuYm9va3MucHVzaChPUERTVjEuRW50cnkuZGVzZXJpYWxpemU8T1BEU1YxLkVudHJ5Pih7XG5cdFx0XHRcdFx0dGl0bGU6IGDmm7jluqvvvJoke3RpdGxlRGVtb31gLFxuXHRcdFx0XHRcdGxpbmtzOiBbXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGhyZWY6IGBodHRwczovL2RlbW9ub3ZlbC5uZXRsaWZ5LmNvbS9zdGF0aWMvb3Bkcy54bWxgLFxuXHRcdFx0XHRcdFx0XHR0aXRsZTogRW51bUxpbmtSZWwuQUxURVJOQVRFLFxuXHRcdFx0XHRcdFx0XHR0eXBlOiBFbnVtTUlNRS5PUERTX0NBVEFMT0dfRkVFRF9ET0NVTUVOVCxcblx0XHRcdFx0XHRcdH0gYXMgTGluayxcblx0XHRcdFx0XHRdLFxuXHRcdFx0XHR9KSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdGZlZWQuYm9va3MucHVzaChPUERTVjEuRW50cnkuZGVzZXJpYWxpemU8T1BEU1YxLkVudHJ5Pih7XG5cdFx0XHRcdFx0dGl0bGU6IGDmm7jluqvvvJoke3RpdGxlRGVtb31gLFxuXHRcdFx0XHRcdGxpbmtzOiBbXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGhyZWY6IGAke3ByZWZpeERlbW99L2FsbC54bWxgLFxuXHRcdFx0XHRcdFx0XHR0aXRsZTogRW51bUxpbmtSZWwuQUxURVJOQVRFLFxuXHRcdFx0XHRcdFx0XHR0eXBlOiBFbnVtTUlNRS5PUERTX0NBVEFMT0dfRkVFRF9ET0NVTUVOVCxcblx0XHRcdFx0XHRcdH0gYXMgTGluayxcblx0XHRcdFx0XHRdLFxuXHRcdFx0XHR9KSk7XG5cdFx0XHR9XG5cblx0XHRcdE9iamVjdC5rZXlzKGlkX3RpdGxlc19tYXApXG5cdFx0XHRcdC5mb3JFYWNoKChzaXRlSUQpID0+XG5cdFx0XHRcdHtcblxuXHRcdFx0XHRcdGZlZWQuYm9va3MucHVzaChPUERTVjEuRW50cnkuZGVzZXJpYWxpemU8T1BEU1YxLkVudHJ5Pih7XG5cdFx0XHRcdFx0XHR0aXRsZTogYOabuOW6q++8miR7c2l0ZUlEfWAsXG5cdFx0XHRcdFx0XHRsaW5rczogW1xuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0aHJlZjogYC9vcGRzLyR7c2l0ZUlEfS54bWxgLFxuXHRcdFx0XHRcdFx0XHRcdHRpdGxlOiBFbnVtTGlua1JlbC5BTFRFUk5BVEUsXG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogRW51bU1JTUUuT1BEU19DQVRBTE9HX0ZFRURfRE9DVU1FTlQsXG5cdFx0XHRcdFx0XHRcdH0gYXMgTGluayxcblx0XHRcdFx0XHRcdF0sXG5cdFx0XHRcdFx0fSkpO1xuXG5cdFx0XHRcdH0pXG5cdFx0XHQ7XG5cblx0XHRcdHJldHVybiBmZWVkXG5cdFx0fSxcblx0XSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWFrZU9QRFNQb3J0YWxcbiJdfQ==