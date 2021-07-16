"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMutableFileSystem = void 0;
const tslib_1 = require("tslib");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
function initMutableFileSystem(ipfs) {
    return bluebird_1.default.resolve(ipfs)
        .then(async (ipfs) => {
        let ret = await ipfs.add(`Hello from novel-opds-now Checker`, {
            pin: false,
            preload: true,
        });
        let file_cid = ret.cid;
        let file_path = `/novel-opds-now/Hello from novel-opds-now Checker.txt`;
        let file_stat = await ipfs.files.stat(file_path, {
            hash: true,
        }).catch(e => null);
        if (file_stat.cid != file_cid) {
            await ipfs.files.rm(file_path).catch(e => null);
            await ipfs.files.cp(`/ipfs/${file_cid}`, file_path, {
                pin: false,
                parents: true,
            });
        }
    })
        .catch(e => {
        logger_1.default.warn(`[IPFS]`, `initMutableFileSystem`, e);
    });
}
exports.initMutableFileSystem = initMutableFileSystem;
//# sourceMappingURL=initMutableFileSystem.js.map