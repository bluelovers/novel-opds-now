"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCache = exports.loadCacheAll = void 0;
const tslib_1 = require("tslib");
const local_or_rebuild_file_1 = require("@demonovel/local-or-rebuild-file");
const index_1 = require("../../util/index");
const logger_1 = tslib_1.__importDefault(require("debug-color2/logger"));
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
function loadCacheAll(force) {
    return bluebird_1.default.all(['wenku8', 'dmzj', 'esjzone'].map((siteID) => loadCache(siteID, force)));
}
exports.loadCacheAll = loadCacheAll;
function loadCache(siteID, force) {
    return (0, local_or_rebuild_file_1.getLocalOrRebuild)((0, index_1.getCacheFilename)(`${siteID}/builded.json`), {
        console: logger_1.default,
        force,
        ttl: 2 * 24 * 60 * 60 * 1000,
        makeFns: [
            () => {
                logger_1.default.debug(`嘗試更新 ${siteID}`);
                return Promise.resolve().then(() => tslib_1.__importStar(require('./build'))).then(m => m.buildCache(siteID, force).tap(v => logger_1.default.success(`[${siteID}] 更新完成`)));
            },
        ],
    });
}
exports.loadCache = loadCache;
//# sourceMappingURL=load.js.map