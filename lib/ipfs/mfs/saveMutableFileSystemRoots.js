"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMutableFileSystemRoots = void 0;
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const const_1 = require("../../const");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const throttle_1 = (0, tslib_1.__importDefault)(require("lodash/throttle"));
exports.saveMutableFileSystemRoots = (0, throttle_1.default)(function (ipfs) {
    return Promise.resolve(ipfs).then(async () => {
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
    }).catch(e => void 0);
}, 60 * 1000);
//# sourceMappingURL=saveMutableFileSystemRoots.js.map