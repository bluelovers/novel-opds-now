"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAllCacheTask = void 0;
const tslib_1 = require("tslib");
const update_1 = (0, tslib_1.__importDefault)(require("../site/demonovel/update"));
const load_1 = (0, tslib_1.__importDefault)(require("../site/masiro/load"));
const update_2 = (0, tslib_1.__importDefault)(require("../segment/update"));
const load_2 = require("../site/cached-data/load");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
function updateAllCacheTask(force) {
    return Promise.all([
        (0, load_2.loadCacheAll)(force),
        (0, update_1.default)(force),
        (0, load_1.default)(force),
        (0, update_2.default)(force),
    ]).catch(e => logger_1.default.error(`updateAllCacheTask`, force, e));
}
exports.updateAllCacheTask = updateAllCacheTask;
//# sourceMappingURL=update-cache.js.map