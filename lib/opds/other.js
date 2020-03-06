"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeOPDSOther = exports.makeOPDSOtherSource = void 0;
const opds_extra_1 = require("opds-extra");
const const_1 = require("opds-extra/lib/const");
const lib_1 = require("calibre-opds/lib");
const index_1 = require("./index");
const search_1 = require("./search");
function makeOPDSOtherSource(feed) {
    feed.books = feed.books || [];
    [
        {
            title: 'D Genesis 迷宮出現三年後',
            href: `https://novel.tyty.moe/artifacts/n7945fn/epub/n7945fn_latest.epub`
        },
        {
            title: '關於鄰家的天使大人不知不覺把我慣成了廢人這檔子事',
            href: `https://novel.tyty.moe/artifacts/n8440fe/epub/n8440fe_latest.epub`
        },
    ]
        .forEach(({ title, href, }) => {
        feed.books.push(opds_extra_1.OPDSV1.Entry.deserialize({
            title,
            links: [
                {
                    rel: const_1.EnumLinkRel.ACQUISITION,
                    href,
                    type: const_1.EnumMIME.epub,
                }
            ],
        }));
    });
    return feed;
}
exports.makeOPDSOtherSource = makeOPDSOtherSource;
function makeOPDSOther() {
    return lib_1.buildAsync(lib_1.initMain({
        title: `書庫：other`,
        icon: '/favicon.ico',
    }), [
        (feed) => search_1.addOpenSearch(feed, 'other'),
        (feed) => index_1.makeOPDSShared(feed, `，目前位於 other`),
        makeOPDSOtherSource,
    ]);
}
exports.makeOPDSOther = makeOPDSOther;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3RoZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJvdGhlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBb0M7QUFDcEMsZ0RBQTZEO0FBRzdELDBDQUF3RDtBQUV4RCxtQ0FBeUM7QUFDekMscUNBQXlDO0FBRXpDLFNBQWdCLG1CQUFtQixDQUFDLElBQWlCO0lBRXBELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7SUFFOUI7UUFDQztZQUNDLEtBQUssRUFBRSxtQkFBbUI7WUFDMUIsSUFBSSxFQUFFLG1FQUFtRTtTQUN6RTtRQUNEO1lBQ0MsS0FBSyxFQUFFLDBCQUEwQjtZQUNqQyxJQUFJLEVBQUUsbUVBQW1FO1NBQ3pFO0tBQ0Q7U0FDQyxPQUFPLENBQUMsQ0FBQyxFQUNULEtBQUssRUFDTCxJQUFJLEdBQ0osRUFBRSxFQUFFO1FBRUosSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsbUJBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFlO1lBQ3RELEtBQUs7WUFDTCxLQUFLLEVBQUU7Z0JBQ047b0JBQ0MsR0FBRyxFQUFFLG1CQUFXLENBQUMsV0FBVztvQkFDNUIsSUFBSTtvQkFDSixJQUFJLEVBQUUsZ0JBQVEsQ0FBQyxJQUFJO2lCQUNaO2FBQ1I7U0FDRCxDQUFDLENBQUMsQ0FBQztJQUVMLENBQUMsQ0FBQyxDQUNGO0lBRUQsT0FBTyxJQUFJLENBQUE7QUFDWixDQUFDO0FBbENELGtEQWtDQztBQUVELFNBQWdCLGFBQWE7SUFFNUIsT0FBTyxnQkFBVSxDQUFDLGNBQVEsQ0FBQztRQUMxQixLQUFLLEVBQUUsVUFBVTtRQUNqQixJQUFJLEVBQUUsY0FBYztLQUNwQixDQUFDLEVBQUU7UUFFSCxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsc0JBQWEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDO1FBRXRDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxzQkFBYyxDQUFDLElBQUksRUFBRSxhQUFhLENBQUM7UUFDN0MsbUJBQW1CO0tBRW5CLENBQUMsQ0FBQTtBQUNILENBQUM7QUFiRCxzQ0FhQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9QRFNWMSB9IGZyb20gJ29wZHMtZXh0cmEnO1xuaW1wb3J0IHsgRW51bUxpbmtSZWwsIEVudW1NSU1FIH0gZnJvbSAnb3Bkcy1leHRyYS9saWIvY29uc3QnO1xuaW1wb3J0IHsgTGluayB9IGZyb20gJ29wZHMtZXh0cmEvbGliL3YxL2NvcmUnO1xuaW1wb3J0IHsgSVNpdGVJRHMsIGJ1aWxkZWRfbWFwIH0gZnJvbSAnLi4vbm92ZWwtY2FjaGUvdHlwZXMnO1xuaW1wb3J0IHsgYnVpbGRBc3luYywgaW5pdE1haW4gfSBmcm9tICdjYWxpYnJlLW9wZHMvbGliJztcbmltcG9ydCBsb2FkQ2FjaGUgZnJvbSAnLi4vbm92ZWwtY2FjaGUvbG9hZCc7XG5pbXBvcnQgeyBtYWtlT1BEU1NoYXJlZCB9IGZyb20gJy4vaW5kZXgnO1xuaW1wb3J0IHsgYWRkT3BlblNlYXJjaCB9IGZyb20gJy4vc2VhcmNoJztcblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VPUERTT3RoZXJTb3VyY2UoZmVlZDogT1BEU1YxLkZlZWQpOiBPUERTVjEuRmVlZFxue1xuXHRmZWVkLmJvb2tzID0gZmVlZC5ib29rcyB8fCBbXTtcblxuXHRbXG5cdFx0e1xuXHRcdFx0dGl0bGU6ICdEIEdlbmVzaXMg6L+35a6u5Ye654++5LiJ5bm05b6MJyxcblx0XHRcdGhyZWY6IGBodHRwczovL25vdmVsLnR5dHkubW9lL2FydGlmYWN0cy9uNzk0NWZuL2VwdWIvbjc5NDVmbl9sYXRlc3QuZXB1YmBcblx0XHR9LFxuXHRcdHtcblx0XHRcdHRpdGxlOiAn6Zec5pa86YSw5a6255qE5aSp5L2/5aSn5Lq65LiN55+l5LiN6Ka65oqK5oiR5oWj5oiQ5LqG5bui5Lq66YCZ5qqU5a2Q5LqLJyxcblx0XHRcdGhyZWY6IGBodHRwczovL25vdmVsLnR5dHkubW9lL2FydGlmYWN0cy9uODQ0MGZlL2VwdWIvbjg0NDBmZV9sYXRlc3QuZXB1YmBcblx0XHR9LFxuXHRdXG5cdFx0LmZvckVhY2goKHtcblx0XHRcdHRpdGxlLFxuXHRcdFx0aHJlZixcblx0XHR9KSA9PiB7XG5cblx0XHRcdGZlZWQuYm9va3MucHVzaChPUERTVjEuRW50cnkuZGVzZXJpYWxpemU8T1BEU1YxLkVudHJ5Pih7XG5cdFx0XHRcdHRpdGxlLFxuXHRcdFx0XHRsaW5rczogW1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHJlbDogRW51bUxpbmtSZWwuQUNRVUlTSVRJT04sXG5cdFx0XHRcdFx0XHRocmVmLFxuXHRcdFx0XHRcdFx0dHlwZTogRW51bU1JTUUuZXB1Yixcblx0XHRcdFx0XHR9IGFzIGFueVxuXHRcdFx0XHRdLFxuXHRcdFx0fSkpO1xuXG5cdFx0fSlcblx0O1xuXG5cdHJldHVybiBmZWVkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlT1BEU090aGVyKClcbntcblx0cmV0dXJuIGJ1aWxkQXN5bmMoaW5pdE1haW4oe1xuXHRcdHRpdGxlOiBg5pu45bqr77yab3RoZXJgLFxuXHRcdGljb246ICcvZmF2aWNvbi5pY28nLFxuXHR9KSwgW1xuXG5cdFx0KGZlZWQpID0+IGFkZE9wZW5TZWFyY2goZmVlZCwgJ290aGVyJyksXG5cblx0XHQoZmVlZCkgPT4gbWFrZU9QRFNTaGFyZWQoZmVlZCwgYO+8jOebruWJjeS9jeaWvCBvdGhlcmApLFxuXHRcdG1ha2VPUERTT3RoZXJTb3VyY2UsXG5cblx0XSlcbn1cbiJdfQ==