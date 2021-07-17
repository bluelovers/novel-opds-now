"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMutableFileSystemRoots = void 0;
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const const_1 = require("../../const");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
async function saveMutableFileSystemRoots(ipfs) {
    let record = {};
    let length = 0;
    for await (const ret of ipfs.files.ls('/')) {
        record[ret.name] = ret.cid.toString();
        length++;
    }
    (0, fs_extra_1.outputJSONSync)((0, path_1.join)(const_1.__root, 'test', '.mfs.roots.json'), record, {
        spaces: 2,
    });
    logger_1.default.debug(`[IPFS]`, `saveMutableFileSystemRoots`, length);
}
exports.saveMutableFileSystemRoots = saveMutableFileSystemRoots;
//# sourceMappingURL=saveMutableFileSystemRoots.js.map