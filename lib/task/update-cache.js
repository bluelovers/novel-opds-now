"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAllCacheTask = void 0;
const tslib_1 = require("tslib");
const update_1 = (0, tslib_1.__importDefault)(require("../demonovel/update"));
const load_1 = (0, tslib_1.__importDefault)(require("../masiro/load"));
const update_2 = (0, tslib_1.__importDefault)(require("../segment/update"));
const load_2 = require("../site/cached-data/load");
function updateAllCacheTask(force) {
    return Promise.all([
        (0, load_2.loadCacheAll)(force),
        (0, update_1.default)(force),
        (0, load_1.default)(force),
        (0, update_2.default)(force),
    ]).catch(e => null);
}
exports.updateAllCacheTask = updateAllCacheTask;
//# sourceMappingURL=update-cache.js.map