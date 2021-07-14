"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initHelloCheck = void 0;
const tslib_1 = require("tslib");
const initMutableFileSystem_1 = require("../mfs/initMutableFileSystem");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const const_1 = require("../../const");
const handleCachePeersFile_1 = require("../../util/handleCachePeersFile");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
function initHelloCheck(ipfs) {
    return bluebird_1.default.resolve(ipfs)
        .then(async (ipfs) => {
        let ls = await (0, fs_extra_1.readFile)((0, path_1.join)(const_1.__root, 'lib/static/build-in-cids.txt'))
            .then(handleCachePeersFile_1.handleCachePeersFile);
        logger_1.default.debug(`[IPFS]`, `initHelloCheck`, ls);
        await bluebird_1.default.any(ls.map(cid => ipfs.get(cid, {
            preload: true,
        })))
            .catch(e => {
            logger_1.default.warn(`[IPFS]`, `initHelloCheck`, e);
        });
        await (0, initMutableFileSystem_1.initMutableFileSystem)(ipfs);
    });
}
exports.initHelloCheck = initHelloCheck;
//# sourceMappingURL=initHelloCheck.js.map