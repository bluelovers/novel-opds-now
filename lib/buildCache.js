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
                return Promise.resolve(console.debug(`[Segment][Cache] 距離上次緩存已過 ${md}s`));
            }
        }
        catch (e) {
        }
    }
    const CACHED_SEGMENT = createSegment();
    CACHED_SEGMENT.doSegment('');
    return fs_extra_1.outputJSON(__cache, CACHED_SEGMENT.DICT)
        .then(() => {
        console.debug('[Segment][Cache] build done');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRDYWNoZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJ1aWxkQ2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQSw0REFBd0M7QUFDeEMsdUNBQXNDO0FBQ3RDLCtCQUE0QjtBQUM1QixzREFBOEI7QUFDOUIsdUNBQW9DO0FBQ3BDLDJCQUFnQztBQUVoQyxTQUFTLFVBQVU7SUFFbEIsSUFBSSxPQUFPLEdBQUcsV0FBSSxDQUFDLGdCQUFNLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUVoRCxJQUFJLGVBQVUsQ0FBQyxPQUFPLENBQUMsRUFDdkI7UUFDQyxJQUNBO1lBQ0MsSUFBSSxFQUFFLEdBQUcsbUJBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUUzQixJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzFDLElBQUksRUFBRSxHQUFHLElBQUksRUFDYjtnQkFDQyxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFBO2FBQ3pFO1NBQ0Q7UUFDRCxPQUFPLENBQUMsRUFDUjtTQUVDO0tBQ0Q7SUFFRCxNQUFNLGNBQWMsR0FBRyxhQUFhLEVBQUUsQ0FBQztJQUV2QyxjQUFjLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRTdCLE9BQU8scUJBQVUsQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLElBQUksQ0FBQztTQUM3QyxJQUFJLENBQUMsR0FBRyxFQUFFO1FBQ1YsT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO0lBQzdDLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQUVELFNBQVMsYUFBYTtJQUVyQixPQUFPLElBQUksYUFBTyxDQUFDO1FBQ2xCLE9BQU8sRUFBRSxJQUFJO1FBQ2IsZ0JBQWdCLEVBQUU7WUFDakIsY0FBYyxFQUFFLElBQUk7U0FDcEI7UUFDRCxPQUFPLEVBQUUsSUFBSTtLQUNiLENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRCxrQkFBZSxVQUFVLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMjAvMS8zMC5cbiAqL1xuXG5pbXBvcnQgU2VnbWVudCBmcm9tICdub3ZlbC1zZWdtZW50L2xpYic7XG5pbXBvcnQgeyBvdXRwdXRKU09OIH0gZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IF9fcm9vdCBmcm9tICcuL19fcm9vdCc7XG5pbXBvcnQgeyBzdGF0U3luYyB9IGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCB7IGV4aXN0c1N5bmMgfSBmcm9tICdmcyc7XG5cbmZ1bmN0aW9uIGJ1aWxkQ2FjaGUoKVxue1xuXHRsZXQgX19jYWNoZSA9IGpvaW4oX19yb290LCBgLmNhY2hlL2NhY2hlLmpzb25gKTtcblxuXHRpZiAoZXhpc3RzU3luYyhfX2NhY2hlKSlcblx0e1xuXHRcdHRyeVxuXHRcdHtcblx0XHRcdGxldCBzdCA9IHN0YXRTeW5jKF9fY2FjaGUpO1xuXG5cdFx0XHRsZXQgbWQgPSAoRGF0ZS5ub3coKSAtIHN0Lm10aW1lTXMpIC8gMTAwMDtcblx0XHRcdGlmIChtZCA8IDM2MDApXG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoY29uc29sZS5kZWJ1ZyhgW1NlZ21lbnRdW0NhY2hlXSDot53pm6LkuIrmrKHnt6nlrZjlt7LpgY4gJHttZH1zYCkpXG5cdFx0XHR9XG5cdFx0fVxuXHRcdGNhdGNoIChlKVxuXHRcdHtcblxuXHRcdH1cblx0fVxuXG5cdGNvbnN0IENBQ0hFRF9TRUdNRU5UID0gY3JlYXRlU2VnbWVudCgpO1xuXG5cdENBQ0hFRF9TRUdNRU5ULmRvU2VnbWVudCgnJyk7XG5cblx0cmV0dXJuIG91dHB1dEpTT04oX19jYWNoZSwgQ0FDSEVEX1NFR01FTlQuRElDVClcblx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmRlYnVnKCdbU2VnbWVudF1bQ2FjaGVdIGJ1aWxkIGRvbmUnKVxuXHRcdH0pXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNlZ21lbnQoKVxue1xuXHRyZXR1cm4gbmV3IFNlZ21lbnQoe1xuXHRcdGF1dG9Dams6IHRydWUsXG5cdFx0b3B0aW9uc0RvU2VnbWVudDoge1xuXHRcdFx0Y29udmVydFN5bm9ueW06IHRydWUsXG5cdFx0fSxcblx0XHRhbGxfbW9kOiB0cnVlLFxuXHR9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYnVpbGRDYWNoZSgpO1xuXG4iXX0=