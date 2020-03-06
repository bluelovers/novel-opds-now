"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkGunData = void 0;
function checkGunData(data) {
    if (data && data.timestamp) {
        if (data.exists) {
            let { base64, filename, exists, timestamp, href } = data;
            if (href && filename && exists && timestamp) {
                return true;
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tEYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2hlY2tEYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUtBLFNBQWdCLFlBQVksQ0FBQyxJQUFrQjtJQUk5QyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxFQUMxQjtRQUNDLElBQUksSUFBSSxDQUFDLE1BQU0sRUFDZjtZQUNDLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBRXpELElBQUksSUFBSSxJQUFJLFFBQVEsSUFBSSxNQUFNLElBQUksU0FBUyxFQUMzQztnQkFDQyxPQUFPLElBQUksQ0FBQzthQUNaO1lBRUQsSUFBSSxDQUFDLENBQUMsTUFBTSxJQUFJLFFBQVEsSUFBSSxNQUFNLElBQUksU0FBUyxDQUFDLEVBQ2hEO2dCQUNDLE9BQU8sS0FBSyxDQUFDO2FBQ2I7WUFFRCxPQUFPLElBQUksQ0FBQztTQUNaO0tBQ0Q7SUFFRCxPQUFPLElBQUksQ0FBQztBQUNiLENBQUM7QUF6QkQsb0NBeUJDO0FBRUQsa0JBQWUsWUFBWSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8yLzUuXG4gKi9cbmltcG9ydCB7IElHdW5FcHViTm9kZSwgSUd1bkVwdWJEYXRhIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tHdW5EYXRhKGRhdGE6IElHdW5FcHViTm9kZSk6IGRhdGEgaXMgRXhjbHVkZTxJR3VuRXB1Yk5vZGUsIHtcblx0ZXhpc3RzOiBmYWxzZSxcbn0+XG57XG5cdGlmIChkYXRhICYmIGRhdGEudGltZXN0YW1wKVxuXHR7XG5cdFx0aWYgKGRhdGEuZXhpc3RzKVxuXHRcdHtcblx0XHRcdGxldCB7IGJhc2U2NCwgZmlsZW5hbWUsIGV4aXN0cywgdGltZXN0YW1wLCBocmVmIH0gPSBkYXRhO1xuXG5cdFx0XHRpZiAoaHJlZiAmJiBmaWxlbmFtZSAmJiBleGlzdHMgJiYgdGltZXN0YW1wKVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCEoYmFzZTY0ICYmIGZpbGVuYW1lICYmIGV4aXN0cyAmJiB0aW1lc3RhbXApKVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjaGVja0d1bkRhdGFcbiJdfQ==