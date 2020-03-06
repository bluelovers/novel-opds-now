"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeOPDSOther = exports.makeOPDSOtherSource = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3RoZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJvdGhlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBb0M7QUFDcEMsZ0RBQTZEO0FBRzdELDBDQUF3RDtBQUV4RCxtQ0FBeUM7QUFFekMsU0FBZ0IsbUJBQW1CLENBQUMsSUFBaUI7SUFFcEQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztJQUU5QjtRQUNDO1lBQ0MsS0FBSyxFQUFFLG1CQUFtQjtZQUMxQixJQUFJLEVBQUUsbUVBQW1FO1NBQ3pFO1FBQ0Q7WUFDQyxLQUFLLEVBQUUsMEJBQTBCO1lBQ2pDLElBQUksRUFBRSxtRUFBbUU7U0FDekU7S0FDRDtTQUNDLE9BQU8sQ0FBQyxDQUFDLEVBQ1QsS0FBSyxFQUNMLElBQUksR0FDSixFQUFFLEVBQUU7UUFFSixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQWU7WUFDdEQsS0FBSztZQUNMLEtBQUssRUFBRTtnQkFDTjtvQkFDQyxHQUFHLEVBQUUsbUJBQVcsQ0FBQyxXQUFXO29CQUM1QixJQUFJO29CQUNKLElBQUksRUFBRSxnQkFBUSxDQUFDLElBQUk7aUJBQ1o7YUFDUjtTQUNELENBQUMsQ0FBQyxDQUFDO0lBRUwsQ0FBQyxDQUFDLENBQ0Y7SUFFRCxPQUFPLElBQUksQ0FBQTtBQUNaLENBQUM7QUFsQ0Qsa0RBa0NDO0FBRUQsU0FBZ0IsYUFBYTtJQUU1QixPQUFPLGdCQUFVLENBQUMsY0FBUSxDQUFDO1FBQzFCLEtBQUssRUFBRSxVQUFVO1FBQ2pCLElBQUksRUFBRSxjQUFjO0tBQ3BCLENBQUMsRUFBRTtRQUVILENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxzQkFBYyxDQUFDLElBQUksRUFBRSxhQUFhLENBQUM7UUFDN0MsbUJBQW1CO0tBRW5CLENBQUMsQ0FBQTtBQUNILENBQUM7QUFYRCxzQ0FXQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9QRFNWMSB9IGZyb20gJ29wZHMtZXh0cmEnO1xuaW1wb3J0IHsgRW51bUxpbmtSZWwsIEVudW1NSU1FIH0gZnJvbSAnb3Bkcy1leHRyYS9saWIvY29uc3QnO1xuaW1wb3J0IHsgTGluayB9IGZyb20gJ29wZHMtZXh0cmEvbGliL3YxL2NvcmUnO1xuaW1wb3J0IHsgSVNpdGVJRHMsIGJ1aWxkZWRfbWFwIH0gZnJvbSAnLi4vbm92ZWwtY2FjaGUvdHlwZXMnO1xuaW1wb3J0IHsgYnVpbGRBc3luYywgaW5pdE1haW4gfSBmcm9tICdjYWxpYnJlLW9wZHMvbGliJztcbmltcG9ydCBsb2FkQ2FjaGUgZnJvbSAnLi4vbm92ZWwtY2FjaGUvbG9hZCc7XG5pbXBvcnQgeyBtYWtlT1BEU1NoYXJlZCB9IGZyb20gJy4vaW5kZXgnO1xuXG5leHBvcnQgZnVuY3Rpb24gbWFrZU9QRFNPdGhlclNvdXJjZShmZWVkOiBPUERTVjEuRmVlZCk6IE9QRFNWMS5GZWVkXG57XG5cdGZlZWQuYm9va3MgPSBmZWVkLmJvb2tzIHx8IFtdO1xuXG5cdFtcblx0XHR7XG5cdFx0XHR0aXRsZTogJ0QgR2VuZXNpcyDov7flrq7lh7rnj77kuInlubTlvownLFxuXHRcdFx0aHJlZjogYGh0dHBzOi8vbm92ZWwudHl0eS5tb2UvYXJ0aWZhY3RzL243OTQ1Zm4vZXB1Yi9uNzk0NWZuX2xhdGVzdC5lcHViYFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0dGl0bGU6ICfpl5zmlrzphLDlrrbnmoTlpKnkvb/lpKfkurrkuI3nn6XkuI3oprrmiormiJHmhaPmiJDkuoblu6LkurrpgJnmqpTlrZDkuosnLFxuXHRcdFx0aHJlZjogYGh0dHBzOi8vbm92ZWwudHl0eS5tb2UvYXJ0aWZhY3RzL244NDQwZmUvZXB1Yi9uODQ0MGZlX2xhdGVzdC5lcHViYFxuXHRcdH0sXG5cdF1cblx0XHQuZm9yRWFjaCgoe1xuXHRcdFx0dGl0bGUsXG5cdFx0XHRocmVmLFxuXHRcdH0pID0+IHtcblxuXHRcdFx0ZmVlZC5ib29rcy5wdXNoKE9QRFNWMS5FbnRyeS5kZXNlcmlhbGl6ZTxPUERTVjEuRW50cnk+KHtcblx0XHRcdFx0dGl0bGUsXG5cdFx0XHRcdGxpbmtzOiBbXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0cmVsOiBFbnVtTGlua1JlbC5BQ1FVSVNJVElPTixcblx0XHRcdFx0XHRcdGhyZWYsXG5cdFx0XHRcdFx0XHR0eXBlOiBFbnVtTUlNRS5lcHViLFxuXHRcdFx0XHRcdH0gYXMgYW55XG5cdFx0XHRcdF0sXG5cdFx0XHR9KSk7XG5cblx0XHR9KVxuXHQ7XG5cblx0cmV0dXJuIGZlZWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VPUERTT3RoZXIoKVxue1xuXHRyZXR1cm4gYnVpbGRBc3luYyhpbml0TWFpbih7XG5cdFx0dGl0bGU6IGDmm7jluqvvvJpvdGhlcmAsXG5cdFx0aWNvbjogJy9mYXZpY29uLmljbycsXG5cdH0pLCBbXG5cblx0XHQoZmVlZCkgPT4gbWFrZU9QRFNTaGFyZWQoZmVlZCwgYO+8jOebruWJjeS9jeaWvCBvdGhlcmApLFxuXHRcdG1ha2VPUERTT3RoZXJTb3VyY2UsXG5cblx0XSlcbn1cbiJdfQ==