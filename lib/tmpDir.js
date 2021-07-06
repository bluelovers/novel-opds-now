"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tmpDir = exports.tmpPath = void 0;
const tmp_1 = require("tmp");
const path_1 = require("path");
function tmpPath() {
    return (0, path_1.resolve)(process.env.YARN_CACHE_FOLDER || process.env.TEMP || (0, path_1.join)(__dirname, '..'), 'tmp');
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