"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCache = void 0;
const tslib_1 = require("tslib");
const types_1 = require("./types");
const fs_extra_1 = require("fs-extra");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
function loadCache(siteID, map) {
    return bluebird_1.default.resolve((0, fs_extra_1.readJSON)((0, types_1.getLocalFilename)(siteID, map)));
}
exports.loadCache = loadCache;
exports.default = loadCache;
//# sourceMappingURL=load.js.map