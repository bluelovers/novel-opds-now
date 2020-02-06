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
exports.default = buildCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRDYWNoZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJ1aWxkQ2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQSw0REFBd0M7QUFDeEMsdUNBQXNDO0FBQ3RDLCtCQUE0QjtBQUM1QixzREFBOEI7QUFDOUIsdUNBQW9DO0FBQ3BDLDJCQUFnQztBQUNoQyxpRUFBMEM7QUFFMUMsU0FBUyxVQUFVLENBQUMsS0FBZTtJQUVsQyxJQUFJLE9BQU8sR0FBRyxXQUFJLENBQUMsZ0JBQU0sRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBRWhELElBQUksQ0FBQyxLQUFLLElBQUksZUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUNqQztRQUNDLElBQ0E7WUFDQyxJQUFJLEVBQUUsR0FBRyxtQkFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRTNCLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDMUMsSUFBSSxFQUFFLEdBQUcsSUFBSSxFQUNiO2dCQUNDLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxnQkFBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFBO2FBQ3pFO1NBQ0Q7UUFDRCxPQUFPLENBQUMsRUFDUjtTQUVDO0tBQ0Q7SUFFRCxNQUFNLGNBQWMsR0FBRyxhQUFhLEVBQUUsQ0FBQztJQUV2QyxjQUFjLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRTdCLE9BQU8scUJBQVUsQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLElBQUksQ0FBQztTQUM3QyxJQUFJLENBQUMsR0FBRyxFQUFFO1FBQ1YsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQTtJQUM3QyxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFFRCxTQUFTLGFBQWE7SUFFckIsT0FBTyxJQUFJLGFBQU8sQ0FBQztRQUNsQixPQUFPLEVBQUUsSUFBSTtRQUNiLGdCQUFnQixFQUFFO1lBQ2pCLGNBQWMsRUFBRSxJQUFJO1NBQ3BCO1FBQ0QsT0FBTyxFQUFFLElBQUk7S0FDYixDQUFDLENBQUM7QUFDSixDQUFDO0FBRUQsa0JBQWUsVUFBVSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8xLzMwLlxuICovXG5cbmltcG9ydCBTZWdtZW50IGZyb20gJ25vdmVsLXNlZ21lbnQvbGliJztcbmltcG9ydCB7IG91dHB1dEpTT04gfSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgX19yb290IGZyb20gJy4vX19yb290JztcbmltcG9ydCB7IHN0YXRTeW5jIH0gZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHsgZXhpc3RzU3luYyB9IGZyb20gJ2ZzJztcbmltcG9ydCBjb25zb2xlIGZyb20gJ2RlYnVnLWNvbG9yMi9sb2dnZXInO1xuXG5mdW5jdGlvbiBidWlsZENhY2hlKGZvcmNlPzogYm9vbGVhbilcbntcblx0bGV0IF9fY2FjaGUgPSBqb2luKF9fcm9vdCwgYC5jYWNoZS9jYWNoZS5qc29uYCk7XG5cblx0aWYgKCFmb3JjZSAmJiBleGlzdHNTeW5jKF9fY2FjaGUpKVxuXHR7XG5cdFx0dHJ5XG5cdFx0e1xuXHRcdFx0bGV0IHN0ID0gc3RhdFN5bmMoX19jYWNoZSk7XG5cblx0XHRcdGxldCBtZCA9IChEYXRlLm5vdygpIC0gc3QubXRpbWVNcykgLyAxMDAwO1xuXHRcdFx0aWYgKG1kIDwgMzYwMClcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShjb25zb2xlLmRlYnVnKGBbU2VnbWVudF1bQ2FjaGVdIOi3nembouS4iuasoee3qeWtmOW3sumBjiAke21kfXNgKSlcblx0XHRcdH1cblx0XHR9XG5cdFx0Y2F0Y2ggKGUpXG5cdFx0e1xuXG5cdFx0fVxuXHR9XG5cblx0Y29uc3QgQ0FDSEVEX1NFR01FTlQgPSBjcmVhdGVTZWdtZW50KCk7XG5cblx0Q0FDSEVEX1NFR01FTlQuZG9TZWdtZW50KCcnKTtcblxuXHRyZXR1cm4gb3V0cHV0SlNPTihfX2NhY2hlLCBDQUNIRURfU0VHTUVOVC5ESUNUKVxuXHRcdC50aGVuKCgpID0+IHtcblx0XHRcdGNvbnNvbGUuZGVidWcoJ1tTZWdtZW50XVtDYWNoZV0gYnVpbGQgZG9uZScpXG5cdFx0fSlcbn1cblxuZnVuY3Rpb24gY3JlYXRlU2VnbWVudCgpXG57XG5cdHJldHVybiBuZXcgU2VnbWVudCh7XG5cdFx0YXV0b0NqazogdHJ1ZSxcblx0XHRvcHRpb25zRG9TZWdtZW50OiB7XG5cdFx0XHRjb252ZXJ0U3lub255bTogdHJ1ZSxcblx0XHR9LFxuXHRcdGFsbF9tb2Q6IHRydWUsXG5cdH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBidWlsZENhY2hlO1xuXG4iXX0=