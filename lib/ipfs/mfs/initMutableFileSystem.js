"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMutableFileSystem = void 0;
const tslib_1 = require("tslib");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const const_1 = require("../../const");
const is_same_cid_1 = require("@lazy-ipfs/is-same-cid");
const pokeRoot_1 = require("./pokeRoot");
function initMutableFileSystem(ipfs, ipfsd) {
    return bluebird_1.default.props({
        ipfs,
        ipfsd,
    })
        .then(async ({ ipfs, ipfsd, }) => {
        let ret = await ipfs.add(`Hello from novel-opds-now Checker`, {
            pin: false,
            preload: true,
        });
        let file_cid = ret.cid;
        if (true || (ipfsd === null || ipfsd === void 0 ? void 0 : ipfsd.isNewRepo)) {
            await (0, fs_extra_1.readJSON)((0, path_1.join)(const_1.__root, 'test', '.mfs.roots.json'))
                .then(async (record) => {
                let pa = [[]];
                Object.entries(record)
                    .map(async ([path, cid]) => {
                    let stat = await ipfs.files.stat(`/${path}`, {
                        hash: true,
                    }).catch(e => null);
                    if ((0, is_same_cid_1.isSameCID)(cid, stat.cid)) {
                        return;
                    }
                    logger_1.default.debug(`[IPFS]`, `restore mfs`, `/ipfs/${cid}`, `/${path}`);
                    const p = ipfs.files.cp(`/ipfs/${cid}`, `/${path}`, {
                        parents: true,
                    })
                        .catch(e => logger_1.default.error(`[IPFS]`, `restore mfs`, String(e)))
                        .catch(e => null);
                    if (path.includes('novel-opds-now')) {
                        pa[0].push(p);
                    }
                    else {
                        pa[1].push(p);
                    }
                });
                return pa[0];
            })
                .catch(e => null);
        }
        let file_path = `/novel-opds-now/Hello from novel-opds-now Checker.txt`;
        let file_stat = await ipfs.files.stat(file_path, {
            hash: true,
        }).catch(e => null);
        if (!(0, is_same_cid_1.isSameCID)(file_stat === null || file_stat === void 0 ? void 0 : file_stat.cid, file_cid)) {
            await ipfs.files.rm(file_path).catch(e => null);
            await ipfs.files.cp(`/ipfs/${file_cid}`, file_path, {
                pin: false,
                parents: true,
            });
        }
        (0, pokeRoot_1.pokeRoot)(ipfs);
    })
        .tap(() => logger_1.default.success(`[IPFS]`, `initMutableFileSystem`))
        .catch(e => {
        logger_1.default.warn(`[IPFS]`, `initMutableFileSystem`, e);
    });
}
exports.initMutableFileSystem = initMutableFileSystem;
//# sourceMappingURL=initMutableFileSystem.js.map