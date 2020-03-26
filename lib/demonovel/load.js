"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCache = exports.getLocalFilename = exports.siteID = void 0;
const types_1 = require("../novel-cache/types");
const bluebird_1 = __importDefault(require("bluebird"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
exports.siteID = `demonovel`;
function getLocalFilename(file = `novel-stat.json`) {
    return path_1.join(types_1.pathPrefix.cache, exports.siteID, file);
}
exports.getLocalFilename = getLocalFilename;
function loadCache(file) {
    return bluebird_1.default.resolve(fs_extra_1.readJSON(getLocalFilename(file)));
}
exports.loadCache = loadCache;
exports.default = loadCache;
//# sourceMappingURL=load.js.map