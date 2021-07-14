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
            pin: true,
            preload: true,
        });
        await ipfs.files.cp(`/ipfs/${ret.cid}`, `/novel-opds-now/Hello from novel-opds-now Checker.txt`, {
            parents: true,
        }).catch(e => null);
    })
        .catch(e => {
        logger_1.default.warn(`[IPFS]`, `initMutableFileSystem`, e);
    });
}
exports.initMutableFileSystem = initMutableFileSystem;
//# sourceMappingURL=initMutableFileSystem.js.map