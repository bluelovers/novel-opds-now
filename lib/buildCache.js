"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = __importDefault(require("novel-segment/lib"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const __root_1 = __importDefault(require("./__root"));
const fs_extra_2 = require("fs-extra");
const fs_1 = require("fs");
function buildCache() {
    let __cache = path_1.join(__root_1.default, `.cache/cache.json`);
    if (fs_1.existsSync(__cache)) {
        try {
            let st = fs_extra_2.statSync(__cache);
            let md = (Date.now() - st.mtimeMs) / 1000;
            if (md < 3600) {
                return Promise.resolve(console.log(`[Segment][Cache] 距離上次緩存已過 ${md}s`));
            }
        }
        catch (e) {
        }
    }
    const CACHED_SEGMENT = createSegment();
    CACHED_SEGMENT.doSegment('');
    return fs_extra_1.outputJSON(__cache, CACHED_SEGMENT.DICT)
        .then(() => {
        console.log('[Segment][Cache] build done');
    });
}
function createSegment() {
    return new lib_1.default({
        autoCjk: true,
        optionsDoSegment: {
            convertSynonym: true,
        },
        all_mod: true,
    });
}
exports.default = buildCache();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRDYWNoZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJ1aWxkQ2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQSw0REFBd0M7QUFDeEMsdUNBQXNDO0FBQ3RDLCtCQUE0QjtBQUM1QixzREFBOEI7QUFDOUIsdUNBQW9DO0FBQ3BDLDJCQUFnQztBQUVoQyxTQUFTLFVBQVU7SUFFbEIsSUFBSSxPQUFPLEdBQUcsV0FBSSxDQUFDLGdCQUFNLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUVoRCxJQUFJLGVBQVUsQ0FBQyxPQUFPLENBQUMsRUFDdkI7UUFDQyxJQUNBO1lBQ0MsSUFBSSxFQUFFLEdBQUcsbUJBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUUzQixJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzFDLElBQUksRUFBRSxHQUFHLElBQUksRUFDYjtnQkFDQyxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFBO2FBQ3ZFO1NBQ0Q7UUFDRCxPQUFPLENBQUMsRUFDUjtTQUVDO0tBQ0Q7SUFFRCxNQUFNLGNBQWMsR0FBRyxhQUFhLEVBQUUsQ0FBQztJQUV2QyxjQUFjLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRTdCLE9BQU8scUJBQVUsQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLElBQUksQ0FBQztTQUM3QyxJQUFJLENBQUMsR0FBRyxFQUFFO1FBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO0lBQzNDLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQUVELFNBQVMsYUFBYTtJQUVyQixPQUFPLElBQUksYUFBTyxDQUFDO1FBQ2xCLE9BQU8sRUFBRSxJQUFJO1FBQ2IsZ0JBQWdCLEVBQUU7WUFDakIsY0FBYyxFQUFFLElBQUk7U0FDcEI7UUFDRCxPQUFPLEVBQUUsSUFBSTtLQUNiLENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRCxrQkFBZSxVQUFVLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMjAvMS8zMC5cbiAqL1xuXG5pbXBvcnQgU2VnbWVudCBmcm9tICdub3ZlbC1zZWdtZW50L2xpYic7XG5pbXBvcnQgeyBvdXRwdXRKU09OIH0gZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IF9fcm9vdCBmcm9tICcuL19fcm9vdCc7XG5pbXBvcnQgeyBzdGF0U3luYyB9IGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCB7IGV4aXN0c1N5bmMgfSBmcm9tICdmcyc7XG5cbmZ1bmN0aW9uIGJ1aWxkQ2FjaGUoKVxue1xuXHRsZXQgX19jYWNoZSA9IGpvaW4oX19yb290LCBgLmNhY2hlL2NhY2hlLmpzb25gKTtcblxuXHRpZiAoZXhpc3RzU3luYyhfX2NhY2hlKSlcblx0e1xuXHRcdHRyeVxuXHRcdHtcblx0XHRcdGxldCBzdCA9IHN0YXRTeW5jKF9fY2FjaGUpO1xuXG5cdFx0XHRsZXQgbWQgPSAoRGF0ZS5ub3coKSAtIHN0Lm10aW1lTXMpIC8gMTAwMDtcblx0XHRcdGlmIChtZCA8IDM2MDApXG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoY29uc29sZS5sb2coYFtTZWdtZW50XVtDYWNoZV0g6Led6Zui5LiK5qyh57ep5a2Y5bey6YGOICR7bWR9c2ApKVxuXHRcdFx0fVxuXHRcdH1cblx0XHRjYXRjaCAoZSlcblx0XHR7XG5cblx0XHR9XG5cdH1cblxuXHRjb25zdCBDQUNIRURfU0VHTUVOVCA9IGNyZWF0ZVNlZ21lbnQoKTtcblxuXHRDQUNIRURfU0VHTUVOVC5kb1NlZ21lbnQoJycpO1xuXG5cdHJldHVybiBvdXRwdXRKU09OKF9fY2FjaGUsIENBQ0hFRF9TRUdNRU5ULkRJQ1QpXG5cdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coJ1tTZWdtZW50XVtDYWNoZV0gYnVpbGQgZG9uZScpXG5cdFx0fSlcbn1cblxuZnVuY3Rpb24gY3JlYXRlU2VnbWVudCgpXG57XG5cdHJldHVybiBuZXcgU2VnbWVudCh7XG5cdFx0YXV0b0NqazogdHJ1ZSxcblx0XHRvcHRpb25zRG9TZWdtZW50OiB7XG5cdFx0XHRjb252ZXJ0U3lub255bTogdHJ1ZSxcblx0XHR9LFxuXHRcdGFsbF9tb2Q6IHRydWUsXG5cdH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBidWlsZENhY2hlKCk7XG5cbiJdfQ==