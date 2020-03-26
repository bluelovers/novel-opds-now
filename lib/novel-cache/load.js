"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCache = void 0;
const types_1 = require("./types");
const fs_extra_1 = require("fs-extra");
const bluebird_1 = __importDefault(require("bluebird"));
function loadCache(siteID, map) {
    return bluebird_1.default.resolve(fs_extra_1.readJSON(types_1.getLocalFilename(siteID, map)));
}
exports.loadCache = loadCache;
exports.default = loadCache;
//# sourceMappingURL=load.js.map