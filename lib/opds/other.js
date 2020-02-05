"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const opds_extra_1 = require("opds-extra");
const const_1 = require("opds-extra/lib/const");
const lib_1 = require("calibre-opds/lib");
const index_1 = require("./index");
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
        (feed) => index_1.makeOPDSShared(feed, `，目前位於 other`),
        makeOPDSOtherSource,
    ]);
}
exports.makeOPDSOther = makeOPDSOther;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3RoZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJvdGhlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUFvQztBQUNwQyxnREFBNkQ7QUFHN0QsMENBQXdEO0FBRXhELG1DQUF5QztBQUV6QyxTQUFnQixtQkFBbUIsQ0FBQyxJQUFpQjtJQUVwRCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO0lBRTlCO1FBQ0M7WUFDQyxLQUFLLEVBQUUsbUJBQW1CO1lBQzFCLElBQUksRUFBRSxtRUFBbUU7U0FDekU7UUFDRDtZQUNDLEtBQUssRUFBRSwwQkFBMEI7WUFDakMsSUFBSSxFQUFFLG1FQUFtRTtTQUN6RTtLQUNEO1NBQ0MsT0FBTyxDQUFDLENBQUMsRUFDVCxLQUFLLEVBQ0wsSUFBSSxHQUNKLEVBQUUsRUFBRTtRQUVKLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLG1CQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBZTtZQUN0RCxLQUFLO1lBQ0wsS0FBSyxFQUFFO2dCQUNOO29CQUNDLEdBQUcsRUFBRSxtQkFBVyxDQUFDLFdBQVc7b0JBQzVCLElBQUk7b0JBQ0osSUFBSSxFQUFFLGdCQUFRLENBQUMsSUFBSTtpQkFDWjthQUNSO1NBQ0QsQ0FBQyxDQUFDLENBQUM7SUFFTCxDQUFDLENBQUMsQ0FDRjtJQUVELE9BQU8sSUFBSSxDQUFBO0FBQ1osQ0FBQztBQWxDRCxrREFrQ0M7QUFFRCxTQUFnQixhQUFhO0lBRTVCLE9BQU8sZ0JBQVUsQ0FBQyxjQUFRLENBQUM7UUFDMUIsS0FBSyxFQUFFLFVBQVU7UUFDakIsSUFBSSxFQUFFLGNBQWM7S0FDcEIsQ0FBQyxFQUFFO1FBRUgsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLHNCQUFjLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQztRQUM3QyxtQkFBbUI7S0FFbkIsQ0FBQyxDQUFBO0FBQ0gsQ0FBQztBQVhELHNDQVdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT1BEU1YxIH0gZnJvbSAnb3Bkcy1leHRyYSc7XG5pbXBvcnQgeyBFbnVtTGlua1JlbCwgRW51bU1JTUUgfSBmcm9tICdvcGRzLWV4dHJhL2xpYi9jb25zdCc7XG5pbXBvcnQgeyBMaW5rIH0gZnJvbSAnb3Bkcy1leHRyYS9saWIvdjEvY29yZSc7XG5pbXBvcnQgeyBJU2l0ZUlEcywgYnVpbGRlZF9tYXAgfSBmcm9tICcuLi9ub3ZlbC1jYWNoZS90eXBlcyc7XG5pbXBvcnQgeyBidWlsZEFzeW5jLCBpbml0TWFpbiB9IGZyb20gJ2NhbGlicmUtb3Bkcy9saWInO1xuaW1wb3J0IGxvYWRDYWNoZSBmcm9tICcuLi9ub3ZlbC1jYWNoZS9sb2FkJztcbmltcG9ydCB7IG1ha2VPUERTU2hhcmVkIH0gZnJvbSAnLi9pbmRleCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlT1BEU090aGVyU291cmNlKGZlZWQ6IE9QRFNWMS5GZWVkKTogT1BEU1YxLkZlZWRcbntcblx0ZmVlZC5ib29rcyA9IGZlZWQuYm9va3MgfHwgW107XG5cblx0W1xuXHRcdHtcblx0XHRcdHRpdGxlOiAnRCBHZW5lc2lzIOi/t+WuruWHuuePvuS4ieW5tOW+jCcsXG5cdFx0XHRocmVmOiBgaHR0cHM6Ly9ub3ZlbC50eXR5Lm1vZS9hcnRpZmFjdHMvbjc5NDVmbi9lcHViL243OTQ1Zm5fbGF0ZXN0LmVwdWJgXG5cdFx0fSxcblx0XHR7XG5cdFx0XHR0aXRsZTogJ+mXnOaWvOmEsOWutueahOWkqeS9v+Wkp+S6uuS4jeefpeS4jeimuuaKiuaIkeaFo+aIkOS6huW7ouS6uumAmeaqlOWtkOS6iycsXG5cdFx0XHRocmVmOiBgaHR0cHM6Ly9ub3ZlbC50eXR5Lm1vZS9hcnRpZmFjdHMvbjg0NDBmZS9lcHViL244NDQwZmVfbGF0ZXN0LmVwdWJgXG5cdFx0fSxcblx0XVxuXHRcdC5mb3JFYWNoKCh7XG5cdFx0XHR0aXRsZSxcblx0XHRcdGhyZWYsXG5cdFx0fSkgPT4ge1xuXG5cdFx0XHRmZWVkLmJvb2tzLnB1c2goT1BEU1YxLkVudHJ5LmRlc2VyaWFsaXplPE9QRFNWMS5FbnRyeT4oe1xuXHRcdFx0XHR0aXRsZSxcblx0XHRcdFx0bGlua3M6IFtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRyZWw6IEVudW1MaW5rUmVsLkFDUVVJU0lUSU9OLFxuXHRcdFx0XHRcdFx0aHJlZixcblx0XHRcdFx0XHRcdHR5cGU6IEVudW1NSU1FLmVwdWIsXG5cdFx0XHRcdFx0fSBhcyBhbnlcblx0XHRcdFx0XSxcblx0XHRcdH0pKTtcblxuXHRcdH0pXG5cdDtcblxuXHRyZXR1cm4gZmVlZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZU9QRFNPdGhlcigpXG57XG5cdHJldHVybiBidWlsZEFzeW5jKGluaXRNYWluKHtcblx0XHR0aXRsZTogYOabuOW6q++8mm90aGVyYCxcblx0XHRpY29uOiAnL2Zhdmljb24uaWNvJyxcblx0fSksIFtcblxuXHRcdChmZWVkKSA9PiBtYWtlT1BEU1NoYXJlZChmZWVkLCBg77yM55uu5YmN5L2N5pa8IG90aGVyYCksXG5cdFx0bWFrZU9QRFNPdGhlclNvdXJjZSxcblxuXHRdKVxufVxuIl19