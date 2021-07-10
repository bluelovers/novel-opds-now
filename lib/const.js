"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__cacheMapFile = exports.OUTPUT_DIR = exports.__root = void 0;
const path_1 = require("path");
const tmpPath_1 = require("./util/tmpPath");
exports.__root = (0, path_1.join)(__dirname, '..');
exports.OUTPUT_DIR = (0, tmpPath_1.tmpPath)();
exports.__cacheMapFile = (0, path_1.join)(exports.OUTPUT_DIR, '.novel-cache-map.json');
//# sourceMappingURL=const.js.map