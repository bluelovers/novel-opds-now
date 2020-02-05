"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function checkGunData(data) {
    if (data && data.timestamp) {
        if (data.exists) {
            let { base64, filename, exists, timestamp } = data;
            if (!(base64 && filename && exists && timestamp)) {
                return false;
            }
            return true;
        }
    }
    return null;
}
exports.checkGunData = checkGunData;
exports.default = checkGunData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tEYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2hlY2tEYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0EsU0FBZ0IsWUFBWSxDQUFDLElBQWtCO0lBSTlDLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQzFCO1FBQ0MsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUNmO1lBQ0MsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQztZQUVuRCxJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksUUFBUSxJQUFJLE1BQU0sSUFBSSxTQUFTLENBQUMsRUFDaEQ7Z0JBQ0MsT0FBTyxLQUFLLENBQUM7YUFDYjtZQUVELE9BQU8sSUFBSSxDQUFDO1NBQ1o7S0FDRDtJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2IsQ0FBQztBQXBCRCxvQ0FvQkM7QUFFRCxrQkFBZSxZQUFZLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzIvNS5cbiAqL1xuaW1wb3J0IHsgSUd1bkVwdWJOb2RlLCBJR3VuRXB1YkRhdGEgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGVja0d1bkRhdGEoZGF0YTogSUd1bkVwdWJOb2RlKTogZGF0YSBpcyBFeGNsdWRlPElHdW5FcHViTm9kZSwge1xuXHRleGlzdHM6IGZhbHNlLFxufT5cbntcblx0aWYgKGRhdGEgJiYgZGF0YS50aW1lc3RhbXApXG5cdHtcblx0XHRpZiAoZGF0YS5leGlzdHMpXG5cdFx0e1xuXHRcdFx0bGV0IHsgYmFzZTY0LCBmaWxlbmFtZSwgZXhpc3RzLCB0aW1lc3RhbXAgfSA9IGRhdGE7XG5cblx0XHRcdGlmICghKGJhc2U2NCAmJiBmaWxlbmFtZSAmJiBleGlzdHMgJiYgdGltZXN0YW1wKSlcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2hlY2tHdW5EYXRhXG4iXX0=