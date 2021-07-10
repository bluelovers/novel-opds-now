"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tmpPath = void 0;
const tslib_1 = require("tslib");
const path_1 = require("path");
const __root_1 = (0, tslib_1.__importDefault)(require("../__root"));
function tmpPath() {
    let env = process === null || process === void 0 ? void 0 : process.env;
    return (0, path_1.resolve)((env === null || env === void 0 ? void 0 : env.YARN_CACHE_FOLDER) || (env === null || env === void 0 ? void 0 : env.TEMP) || __root_1.default, 'tmp');
}
exports.tmpPath = tmpPath;
//# sourceMappingURL=tmpPath.js.map