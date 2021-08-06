"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCache = void 0;
const tslib_1 = require("tslib");
const local_or_rebuild_file_1 = require("@demonovel/local-or-rebuild-file");
const index_1 = require("../../util/index");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
function loadCache(force) {
    return (0, local_or_rebuild_file_1.getLocalOrRebuild)((0, index_1.getCacheFilename)('masiro/builded.json'), {
        console: logger_1.default,
        force,
        ttl: 30 * 24 * 60 * 60 * 1000,
        makeFns: [
            () => {
                logger_1.default.debug(`嘗試更新 masiro`);
                return Promise.resolve().then(() => (0, tslib_1.__importStar)(require('./build'))).then(m => m.buildCache(force).tap(v => logger_1.default.success(`[masiro] 更新完成`)));
            },
        ],
    });
}
exports.loadCache = loadCache;
exports.default = loadCache;
//# sourceMappingURL=load.js.map