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
const to_cid_1 = require("@lazy-ipfs/to-cid");
const it_all_1 = (0, tslib_1.__importDefault)(require("it-all"));
function initHelloCheck(ipfs, ipfsd) {
    return bluebird_1.default.props({
        ipfs,
        ipfsd,
    })
        .then(async ({ ipfs, ipfsd, }) => {
        let ls = await (0, fs_extra_1.readFile)((0, path_1.join)(const_1.__root, 'lib/static/build-in-cids.txt'))
            .then(handleCachePeersFile_1.handleCachePeersFile);
        logger_1.default.debug(`[IPFS]`, `initHelloCheck`, ls);
        await bluebird_1.default.any(ls.map(async (cid) => {
            const timeout = 5000;
            cid = (0, to_cid_1.toCID)(cid);
            await ipfs.pin.rm(cid, {
                timeout,
            }).catch(e => null);
            await (0, it_all_1.default)(ipfs.block.rm(cid, {
                force: true,
                quiet: true,
                timeout,
            })).catch(e => null);
            return (0, it_all_1.default)(ipfs.get(cid, {
                preload: true,
                timeout: 10 * 60 * 1000,
            }));
        }))
            .catch(e => {
            logger_1.default.warn(`[IPFS]`, `initHelloCheck`, e);
        });
        await (0, initMutableFileSystem_1.initMutableFileSystem)(ipfs, ipfsd);
    });
}
exports.initHelloCheck = initHelloCheck;
//# sourceMappingURL=initHelloCheck.js.map