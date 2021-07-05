"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCache2 = void 0;
const tslib_1 = require("tslib");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const fetch_1 = (0, tslib_1.__importDefault)(require("../../fetch"));
const index_1 = require("../../util/index");
const local_or_rebuild_file_1 = require("@demonovel/local-or-rebuild-file");
const url2 = `https://raw.githubusercontent.com/demonovel/masiro-mega-to-ipfs/master/test/cache/cache.json`;
function updateCache2(force) {
    return (0, local_or_rebuild_file_1.getLocalOrRebuild)((0, index_1.getCacheFilename)('masiro/update.json'), {
        console: logger_1.default,
        force,
        makeFns: [
            () => (0, fetch_1.default)(url2).then(res => res.json()),
        ],
    });
}
exports.updateCache2 = updateCache2;
//# sourceMappingURL=update.js.map