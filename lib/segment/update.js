"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSegmentCache = void 0;
const tslib_1 = require("tslib");
const local_or_rebuild_file_1 = require("@demonovel/local-or-rebuild-file");
const logger_1 = tslib_1.__importDefault(require("debug-color2/logger"));
const fetch_1 = tslib_1.__importDefault(require("../fetch"));
const doSegment_1 = require("../doSegment");
const const_1 = require("./const");
const url = `https://github.com/bluelovers/ws-segment/raw/cache/packages/novel-segment/test/temp/cache.common.synonym.db`;
function updateSegmentCache(force) {
    return (0, local_or_rebuild_file_1.getLocalOrRebuild)(const_1.file, {
        console: logger_1.default,
        force,
        makeFns: [
            () => (0, fetch_1.default)(url).then(res => res.json()),
            () => (0, doSegment_1.getSegment)().then(CACHED_SEGMENT => {
                CACHED_SEGMENT.doSegment('');
                return CACHED_SEGMENT.DICT;
            }),
        ],
    });
}
exports.updateSegmentCache = updateSegmentCache;
exports.default = updateSegmentCache;
//# sourceMappingURL=update.js.map