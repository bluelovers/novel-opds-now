"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCover = void 0;
const mime_types_1 = require("mime-types");
const const_1 = require("opds-extra/lib/const");
function addCover(href) {
    let type = mime_types_1.lookup(href);
    if (!type || !/image/.test(type)) {
        type = const_1.EnumMIME.jpg;
    }
    return [
        {
            rel: const_1.EnumLinkRel.IMAGE,
            href,
            type,
        },
        {
            rel: const_1.EnumLinkRel.IMAGE_THUMBNAIL,
            href,
            type,
        },
    ];
}
exports.addCover = addCover;
exports.default = addCover;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkQ292ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhZGRDb3Zlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFJQSwyQ0FBb0M7QUFDcEMsZ0RBQTZEO0FBRTdELFNBQWdCLFFBQVEsQ0FBQyxJQUFZO0lBRXBDLElBQUksSUFBSSxHQUFHLG1CQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFeEIsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDakMsSUFBSSxHQUFHLGdCQUFRLENBQUMsR0FBRyxDQUFDO0tBQ3BCO0lBRUQsT0FBTztRQUNOO1lBQ0MsR0FBRyxFQUFFLG1CQUFXLENBQUMsS0FBSztZQUN0QixJQUFJO1lBQ0osSUFBSTtTQUNKO1FBQ0Q7WUFDQyxHQUFHLEVBQUUsbUJBQVcsQ0FBQyxlQUFlO1lBQ2hDLElBQUk7WUFDSixJQUFJO1NBQ0o7S0FDRCxDQUFBO0FBQ0YsQ0FBQztBQXBCRCw0QkFvQkM7QUFFRCxrQkFBZSxRQUFRLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzIvMy5cbiAqL1xuXG5pbXBvcnQgeyBsb29rdXAgfSBmcm9tIFwibWltZS10eXBlc1wiO1xuaW1wb3J0IHsgRW51bU1JTUUsIEVudW1MaW5rUmVsIH0gZnJvbSAnb3Bkcy1leHRyYS9saWIvY29uc3QnO1xuXG5leHBvcnQgZnVuY3Rpb24gYWRkQ292ZXIoaHJlZjogc3RyaW5nKVxue1xuXHRsZXQgdHlwZSA9IGxvb2t1cChocmVmKTtcblxuXHRpZiAoIXR5cGUgfHwgIS9pbWFnZS8udGVzdCh0eXBlKSkge1xuXHRcdHR5cGUgPSBFbnVtTUlNRS5qcGc7XG5cdH1cblxuXHRyZXR1cm4gW1xuXHRcdHtcblx0XHRcdHJlbDogRW51bUxpbmtSZWwuSU1BR0UsXG5cdFx0XHRocmVmLFxuXHRcdFx0dHlwZSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdHJlbDogRW51bUxpbmtSZWwuSU1BR0VfVEhVTUJOQUlMLFxuXHRcdFx0aHJlZixcblx0XHRcdHR5cGUsXG5cdFx0fSxcblx0XVxufVxuXG5leHBvcnQgZGVmYXVsdCBhZGRDb3ZlclxuIl19