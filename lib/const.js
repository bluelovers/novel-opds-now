"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__cacheMapFile = exports.OUTPUT_DIR = exports.__root = void 0;
const path_1 = require("path");
exports.__root = (0, path_1.join)(__dirname, '..');
exports.OUTPUT_DIR = (() => {
    if (process && process.env) {
        if (process.env.YARN_CACHE_FOLDER) {
            return (0, path_1.join)(process.env.YARN_CACHE_FOLDER, 'tmp');
        }
        else if (process.env.TEMP) {
            return (0, path_1.join)(process.env.TEMP, 'tmp');
        }
    }
    return (0, path_1.join)(exports.__root, '.tmp');
})();
exports.__cacheMapFile = (0, path_1.join)(exports.OUTPUT_DIR, '.novel-cache-map.json');
//# sourceMappingURL=const.js.map