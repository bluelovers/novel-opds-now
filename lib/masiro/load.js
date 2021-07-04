"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCache = void 0;
const tslib_1 = require("tslib");
const local_or_rebuild_file_1 = require("@demonovel/local-or-rebuild-file");
const util_1 = require("../util");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const build_1 = require("./build");
function loadCache(force) {
    return (0, local_or_rebuild_file_1.getLocalOrRebuild)((0, util_1.getCacheFilename)('masiro/builded.json'), {
        console: logger_1.default,
        makeFns: [
            () => {
                logger_1.default.debug(`嘗試更新 masiro`);
                return (0, build_1.buildCache)()
                    .tap(v => logger_1.default.success(`[masiro] 更新完成`));
            },
        ],
    });
}
exports.loadCache = loadCache;
exports.default = loadCache;
//# sourceMappingURL=load.js.map