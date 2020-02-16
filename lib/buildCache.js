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
const logger_1 = __importDefault(require("debug-color2/logger"));
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
    const CACHED_SEGMENT = createSegment();
    CACHED_SEGMENT.doSegment('');
    return fs_extra_1.outputJSON(__cache, CACHED_SEGMENT.DICT)
        .then(() => {
        logger_1.default.debug('[Segment][Cache] build done');
    });
}
function createSegment() {
    return new lib_1.default({
        autoCjk: true,
        optionsDoSegment: {
            convertSynonym: true,
        },
        all_mod: true,
        nodeNovelMode: true,
    });
}
exports.default = buildCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRDYWNoZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJ1aWxkQ2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQSw0REFBd0M7QUFDeEMsdUNBQXNDO0FBQ3RDLCtCQUE0QjtBQUM1QixzREFBOEI7QUFDOUIsdUNBQW9DO0FBQ3BDLDJCQUFnQztBQUNoQyxpRUFBMEM7QUFFMUMsU0FBUyxVQUFVLENBQUMsS0FBZTtJQUVsQyxJQUFJLE9BQU8sR0FBRyxXQUFJLENBQUMsZ0JBQU0sRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBRWhELElBQUksQ0FBQyxLQUFLLElBQUksZUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUNqQztRQUNDLElBQ0E7WUFDQyxJQUFJLEVBQUUsR0FBRyxtQkFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRTNCLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDMUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksRUFDbEI7Z0JBQ0MsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLGdCQUFPLENBQUMsS0FBSyxDQUFDLDZCQUE2QixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUE7YUFDekU7U0FDRDtRQUNELE9BQU8sQ0FBQyxFQUNSO1NBRUM7S0FDRDtJQUVELE1BQU0sY0FBYyxHQUFHLGFBQWEsRUFBRSxDQUFDO0lBRXZDLGNBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFN0IsT0FBTyxxQkFBVSxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsSUFBSSxDQUFDO1NBQzdDLElBQUksQ0FBQyxHQUFHLEVBQUU7UUFDVixnQkFBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO0lBQzdDLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQUVELFNBQVMsYUFBYTtJQUVyQixPQUFPLElBQUksYUFBTyxDQUFDO1FBQ2xCLE9BQU8sRUFBRSxJQUFJO1FBQ2IsZ0JBQWdCLEVBQUU7WUFDakIsY0FBYyxFQUFFLElBQUk7U0FDcEI7UUFDRCxPQUFPLEVBQUUsSUFBSTtRQUNiLGFBQWEsRUFBRSxJQUFJO0tBQ25CLENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRCxrQkFBZSxVQUFVLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzEvMzAuXG4gKi9cblxuaW1wb3J0IFNlZ21lbnQgZnJvbSAnbm92ZWwtc2VnbWVudC9saWInO1xuaW1wb3J0IHsgb3V0cHV0SlNPTiB9IGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcbmltcG9ydCBfX3Jvb3QgZnJvbSAnLi9fX3Jvb3QnO1xuaW1wb3J0IHsgc3RhdFN5bmMgfSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgeyBleGlzdHNTeW5jIH0gZnJvbSAnZnMnO1xuaW1wb3J0IGNvbnNvbGUgZnJvbSAnZGVidWctY29sb3IyL2xvZ2dlcic7XG5cbmZ1bmN0aW9uIGJ1aWxkQ2FjaGUoZm9yY2U/OiBib29sZWFuKVxue1xuXHRsZXQgX19jYWNoZSA9IGpvaW4oX19yb290LCBgLmNhY2hlL2NhY2hlLmpzb25gKTtcblxuXHRpZiAoIWZvcmNlICYmIGV4aXN0c1N5bmMoX19jYWNoZSkpXG5cdHtcblx0XHR0cnlcblx0XHR7XG5cdFx0XHRsZXQgc3QgPSBzdGF0U3luYyhfX2NhY2hlKTtcblxuXHRcdFx0bGV0IG1kID0gKERhdGUubm93KCkgLSBzdC5tdGltZU1zKSAvIDEwMDA7XG5cdFx0XHRpZiAobWQgPCAyNCAqIDM2MDApXG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoY29uc29sZS5kZWJ1ZyhgW1NlZ21lbnRdW0NhY2hlXSDot53pm6LkuIrmrKHnt6nlrZjlt7LpgY4gJHttZH1zYCkpXG5cdFx0XHR9XG5cdFx0fVxuXHRcdGNhdGNoIChlKVxuXHRcdHtcblxuXHRcdH1cblx0fVxuXG5cdGNvbnN0IENBQ0hFRF9TRUdNRU5UID0gY3JlYXRlU2VnbWVudCgpO1xuXG5cdENBQ0hFRF9TRUdNRU5ULmRvU2VnbWVudCgnJyk7XG5cblx0cmV0dXJuIG91dHB1dEpTT04oX19jYWNoZSwgQ0FDSEVEX1NFR01FTlQuRElDVClcblx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmRlYnVnKCdbU2VnbWVudF1bQ2FjaGVdIGJ1aWxkIGRvbmUnKVxuXHRcdH0pXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNlZ21lbnQoKVxue1xuXHRyZXR1cm4gbmV3IFNlZ21lbnQoe1xuXHRcdGF1dG9Dams6IHRydWUsXG5cdFx0b3B0aW9uc0RvU2VnbWVudDoge1xuXHRcdFx0Y29udmVydFN5bm9ueW06IHRydWUsXG5cdFx0fSxcblx0XHRhbGxfbW9kOiB0cnVlLFxuXHRcdG5vZGVOb3ZlbE1vZGU6IHRydWUsXG5cdH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBidWlsZENhY2hlO1xuXG4iXX0=