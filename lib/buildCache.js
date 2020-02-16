"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const __root_1 = __importDefault(require("./__root"));
const fs_extra_2 = require("fs-extra");
const fs_1 = require("fs");
const logger_1 = __importDefault(require("debug-color2/logger"));
const createSegment_1 = __importDefault(require("./segment/createSegment"));
function buildCache(force) {
    let __cache = path_1.join(__root_1.default, `.cache/cache.json`);
    if (!force && fs_1.existsSync(__cache)) {
        try {
            let st = fs_extra_2.statSync(__cache);
            let md = (Date.now() - st.mtimeMs) / 1000;
            if (md < 24 * 3600) {
                return Promise.resolve(logger_1.default.debug(`[Segment][Cache] 距離上次緩存已過 ${md}s`));
            }
        }
        catch (e) {
        }
    }
    const CACHED_SEGMENT = createSegment_1.default();
    CACHED_SEGMENT.doSegment('');
    return fs_extra_1.outputJSON(__cache, CACHED_SEGMENT.DICT)
        .then(() => {
        logger_1.default.debug('[Segment][Cache] build done');
    });
}
exports.default = buildCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRDYWNoZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJ1aWxkQ2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFLQSx1Q0FBc0M7QUFDdEMsK0JBQTRCO0FBQzVCLHNEQUE4QjtBQUM5Qix1Q0FBb0M7QUFDcEMsMkJBQWdDO0FBQ2hDLGlFQUEwQztBQUMxQyw0RUFBb0Q7QUFFcEQsU0FBUyxVQUFVLENBQUMsS0FBZTtJQUVsQyxJQUFJLE9BQU8sR0FBRyxXQUFJLENBQUMsZ0JBQU0sRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBRWhELElBQUksQ0FBQyxLQUFLLElBQUksZUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUNqQztRQUNDLElBQ0E7WUFDQyxJQUFJLEVBQUUsR0FBRyxtQkFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRTNCLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDMUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksRUFDbEI7Z0JBQ0MsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLGdCQUFPLENBQUMsS0FBSyxDQUFDLDZCQUE2QixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUE7YUFDekU7U0FDRDtRQUNELE9BQU8sQ0FBQyxFQUNSO1NBRUM7S0FDRDtJQUVELE1BQU0sY0FBYyxHQUFHLHVCQUFhLEVBQUUsQ0FBQztJQUV2QyxjQUFjLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRTdCLE9BQU8scUJBQVUsQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLElBQUksQ0FBQztTQUM3QyxJQUFJLENBQUMsR0FBRyxFQUFFO1FBQ1YsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQTtJQUM3QyxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFFRCxrQkFBZSxVQUFVLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzEvMzAuXG4gKi9cblxuaW1wb3J0IFNlZ21lbnQgZnJvbSAnbm92ZWwtc2VnbWVudC9saWInO1xuaW1wb3J0IHsgb3V0cHV0SlNPTiB9IGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcbmltcG9ydCBfX3Jvb3QgZnJvbSAnLi9fX3Jvb3QnO1xuaW1wb3J0IHsgc3RhdFN5bmMgfSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgeyBleGlzdHNTeW5jIH0gZnJvbSAnZnMnO1xuaW1wb3J0IGNvbnNvbGUgZnJvbSAnZGVidWctY29sb3IyL2xvZ2dlcic7XG5pbXBvcnQgY3JlYXRlU2VnbWVudCBmcm9tICcuL3NlZ21lbnQvY3JlYXRlU2VnbWVudCc7XG5cbmZ1bmN0aW9uIGJ1aWxkQ2FjaGUoZm9yY2U/OiBib29sZWFuKVxue1xuXHRsZXQgX19jYWNoZSA9IGpvaW4oX19yb290LCBgLmNhY2hlL2NhY2hlLmpzb25gKTtcblxuXHRpZiAoIWZvcmNlICYmIGV4aXN0c1N5bmMoX19jYWNoZSkpXG5cdHtcblx0XHR0cnlcblx0XHR7XG5cdFx0XHRsZXQgc3QgPSBzdGF0U3luYyhfX2NhY2hlKTtcblxuXHRcdFx0bGV0IG1kID0gKERhdGUubm93KCkgLSBzdC5tdGltZU1zKSAvIDEwMDA7XG5cdFx0XHRpZiAobWQgPCAyNCAqIDM2MDApXG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoY29uc29sZS5kZWJ1ZyhgW1NlZ21lbnRdW0NhY2hlXSDot53pm6LkuIrmrKHnt6nlrZjlt7LpgY4gJHttZH1zYCkpXG5cdFx0XHR9XG5cdFx0fVxuXHRcdGNhdGNoIChlKVxuXHRcdHtcblxuXHRcdH1cblx0fVxuXG5cdGNvbnN0IENBQ0hFRF9TRUdNRU5UID0gY3JlYXRlU2VnbWVudCgpO1xuXG5cdENBQ0hFRF9TRUdNRU5ULmRvU2VnbWVudCgnJyk7XG5cblx0cmV0dXJuIG91dHB1dEpTT04oX19jYWNoZSwgQ0FDSEVEX1NFR01FTlQuRElDVClcblx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmRlYnVnKCdbU2VnbWVudF1bQ2FjaGVdIGJ1aWxkIGRvbmUnKVxuXHRcdH0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IGJ1aWxkQ2FjaGU7XG5cbiJdfQ==