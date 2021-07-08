"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tmpDir = exports.tmpPath = void 0;
const tslib_1 = require("tslib");
const tmp_1 = require("tmp");
const path_1 = require("path");
const __root_1 = (0, tslib_1.__importDefault)(require("./__root"));
function tmpPath() {
    return (0, path_1.resolve)(process.env.YARN_CACHE_FOLDER || process.env.TEMP || __root_1.default, 'tmp');
}
exports.tmpPath = tmpPath;
function tmpDir(outputDir, options) {
    outputDir !== null && outputDir !== void 0 ? outputDir : (outputDir = tmpPath());
    return (0, tmp_1.dirSync)({
        ...options,
        unsafeCleanup: false,
        dir: outputDir,
        tmpdir: outputDir,
    });
}
exports.tmpDir = tmpDir;
exports.default = tmpDir;
//# sourceMappingURL=tmpDir.js.map