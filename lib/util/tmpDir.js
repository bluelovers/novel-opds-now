"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tmpDir = void 0;
const tmp_1 = require("tmp");
const tmpPath_1 = require("./tmpPath");
function tmpDir(outputDir, options) {
    outputDir !== null && outputDir !== void 0 ? outputDir : (outputDir = (0, tmpPath_1.tmpPath)());
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