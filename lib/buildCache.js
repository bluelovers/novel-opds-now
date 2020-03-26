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
//# sourceMappingURL=buildCache.js.map