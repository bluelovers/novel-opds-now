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
function buildCache() {
    let __cache = path_1.join(__root_1.default, `.cache/cache.json`);
    if (fs_1.existsSync(__cache)) {
        try {
            let st = fs_extra_2.statSync(__cache);
            let md = (Date.now() - st.mtimeMs) / 1000;
            if (md < 3600) {
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
    });
}
exports.default = buildCache();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRDYWNoZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJ1aWxkQ2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQSw0REFBd0M7QUFDeEMsdUNBQXNDO0FBQ3RDLCtCQUE0QjtBQUM1QixzREFBOEI7QUFDOUIsdUNBQW9DO0FBQ3BDLDJCQUFnQztBQUNoQyxpRUFBMEM7QUFFMUMsU0FBUyxVQUFVO0lBRWxCLElBQUksT0FBTyxHQUFHLFdBQUksQ0FBQyxnQkFBTSxFQUFFLG1CQUFtQixDQUFDLENBQUM7SUFFaEQsSUFBSSxlQUFVLENBQUMsT0FBTyxDQUFDLEVBQ3ZCO1FBQ0MsSUFDQTtZQUNDLElBQUksRUFBRSxHQUFHLG1CQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFM0IsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQztZQUMxQyxJQUFJLEVBQUUsR0FBRyxJQUFJLEVBQ2I7Z0JBQ0MsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLGdCQUFPLENBQUMsS0FBSyxDQUFDLDZCQUE2QixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUE7YUFDekU7U0FDRDtRQUNELE9BQU8sQ0FBQyxFQUNSO1NBRUM7S0FDRDtJQUVELE1BQU0sY0FBYyxHQUFHLGFBQWEsRUFBRSxDQUFDO0lBRXZDLGNBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFN0IsT0FBTyxxQkFBVSxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsSUFBSSxDQUFDO1NBQzdDLElBQUksQ0FBQyxHQUFHLEVBQUU7UUFDVixnQkFBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO0lBQzdDLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQUVELFNBQVMsYUFBYTtJQUVyQixPQUFPLElBQUksYUFBTyxDQUFDO1FBQ2xCLE9BQU8sRUFBRSxJQUFJO1FBQ2IsZ0JBQWdCLEVBQUU7WUFDakIsY0FBYyxFQUFFLElBQUk7U0FDcEI7UUFDRCxPQUFPLEVBQUUsSUFBSTtLQUNiLENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRCxrQkFBZSxVQUFVLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMjAvMS8zMC5cbiAqL1xuXG5pbXBvcnQgU2VnbWVudCBmcm9tICdub3ZlbC1zZWdtZW50L2xpYic7XG5pbXBvcnQgeyBvdXRwdXRKU09OIH0gZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IF9fcm9vdCBmcm9tICcuL19fcm9vdCc7XG5pbXBvcnQgeyBzdGF0U3luYyB9IGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCB7IGV4aXN0c1N5bmMgfSBmcm9tICdmcyc7XG5pbXBvcnQgY29uc29sZSBmcm9tICdkZWJ1Zy1jb2xvcjIvbG9nZ2VyJztcblxuZnVuY3Rpb24gYnVpbGRDYWNoZSgpXG57XG5cdGxldCBfX2NhY2hlID0gam9pbihfX3Jvb3QsIGAuY2FjaGUvY2FjaGUuanNvbmApO1xuXG5cdGlmIChleGlzdHNTeW5jKF9fY2FjaGUpKVxuXHR7XG5cdFx0dHJ5XG5cdFx0e1xuXHRcdFx0bGV0IHN0ID0gc3RhdFN5bmMoX19jYWNoZSk7XG5cblx0XHRcdGxldCBtZCA9IChEYXRlLm5vdygpIC0gc3QubXRpbWVNcykgLyAxMDAwO1xuXHRcdFx0aWYgKG1kIDwgMzYwMClcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShjb25zb2xlLmRlYnVnKGBbU2VnbWVudF1bQ2FjaGVdIOi3nembouS4iuasoee3qeWtmOW3sumBjiAke21kfXNgKSlcblx0XHRcdH1cblx0XHR9XG5cdFx0Y2F0Y2ggKGUpXG5cdFx0e1xuXG5cdFx0fVxuXHR9XG5cblx0Y29uc3QgQ0FDSEVEX1NFR01FTlQgPSBjcmVhdGVTZWdtZW50KCk7XG5cblx0Q0FDSEVEX1NFR01FTlQuZG9TZWdtZW50KCcnKTtcblxuXHRyZXR1cm4gb3V0cHV0SlNPTihfX2NhY2hlLCBDQUNIRURfU0VHTUVOVC5ESUNUKVxuXHRcdC50aGVuKCgpID0+IHtcblx0XHRcdGNvbnNvbGUuZGVidWcoJ1tTZWdtZW50XVtDYWNoZV0gYnVpbGQgZG9uZScpXG5cdFx0fSlcbn1cblxuZnVuY3Rpb24gY3JlYXRlU2VnbWVudCgpXG57XG5cdHJldHVybiBuZXcgU2VnbWVudCh7XG5cdFx0YXV0b0NqazogdHJ1ZSxcblx0XHRvcHRpb25zRG9TZWdtZW50OiB7XG5cdFx0XHRjb252ZXJ0U3lub255bTogdHJ1ZSxcblx0XHR9LFxuXHRcdGFsbF9tb2Q6IHRydWUsXG5cdH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBidWlsZENhY2hlKCk7XG5cbiJdfQ==