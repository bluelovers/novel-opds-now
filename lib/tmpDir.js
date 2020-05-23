"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tmpDir = void 0;
const tmp_1 = require("tmp");
const path_1 = require("path");
function tmpDir(outputDir) {
    if (outputDir == null) {
        if (process.env.YARN_CACHE_FOLDER) {
            outputDir = path_1.join(process.env.YARN_CACHE_FOLDER, 'tmp');
        }
        else if (process.env.TEMP) {
            outputDir = path_1.join(process.env.TEMP, 'tmp');
        }
    }
    return tmp_1.dirSync({
        unsafeCleanup: false,
        dir: outputDir,
        tmpdir: outputDir,
    });
}
exports.tmpDir = tmpDir;
exports.default = tmpDir;
//# sourceMappingURL=tmpDir.js.map