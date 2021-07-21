"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMutableFileSystem = void 0;
const tslib_1 = require("tslib");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const const_1 = require("../../const");
const it_all_1 = (0, tslib_1.__importDefault)(require("it-all"));
const is_same_cid_1 = require("@lazy-ipfs/is-same-cid");
const pokeRoot_1 = require("./pokeRoot");
const _ipfsFilesCopy_1 = require("./_ipfsFilesCopy");
const globalWaiting_1 = require("../../util/globalWaiting");
function initMutableFileSystem(ipfs, ipfsd) {
    return (0, globalWaiting_1.newWaitingPromise)('initMutableFileSystem', () => {
        return bluebird_1.default.props({
            ipfs,
            ipfsd,
        })
            .then(async ({ ipfs, ipfsd, }) => {
            const hello_txt_name = `Hello from novel-opds-now Checker.txt`;
            if (true || (ipfsd === null || ipfsd === void 0 ? void 0 : ipfsd.isNewRepo)) {
                await (0, fs_extra_1.readJSON)((0, path_1.join)(const_1.__root, 'test', '.mfs.roots.json'))
                    .then(async (record) => {
                    let pa = [[]];
                    Object.entries(record)
                        .map(async ([path, cid]) => {
                        if (!(path === null || path === void 0 ? void 0 : path.length) || !(cid === null || cid === void 0 ? void 0 : cid.length) || path === '/') {
                            return;
                        }
                        const target_path = `/${path}`;
                        let stat = await ipfs.files.stat(target_path, {
                            hash: true,
                        }).catch(e => null);
                        if ((0, is_same_cid_1.isSameCID)(cid, stat === null || stat === void 0 ? void 0 : stat.cid)) {
                            return;
                        }
                        else if ((0, is_same_cid_1.isSameCID)('QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn', stat === null || stat === void 0 ? void 0 : stat.cid)) {
                            await ipfs.files.rm(target_path).catch(e => null);
                        }
                        else if ((stat === null || stat === void 0 ? void 0 : stat.cid) && path === `novel-opds-now`) {
                            logger_1.default.warn(`[IPFS]`, `'${target_path}'`, `already exists`, stat.cid);
                            await (0, it_all_1.default)(ipfs.files.ls(target_path))
                                .then(async (ls) => {
                                if ((ls === null || ls === void 0 ? void 0 : ls.length) === 1) {
                                    for (const entry of ls) {
                                        if (entry.type === 'file' && entry.name === hello_txt_name) {
                                            await ipfs.files.rm(`${target_path}/${entry.name}`).catch(e => null);
                                            break;
                                        }
                                    }
                                }
                                if ((ls === null || ls === void 0 ? void 0 : ls.length) === 0) {
                                    await ipfs.files.rm(target_path).catch(e => null);
                                    return false;
                                }
                                return true;
                            })
                                .catch(e => true);
                        }
                        else if (stat === null || stat === void 0 ? void 0 : stat.cid) {
                            logger_1.default.warn(`[IPFS]`, `'${target_path}'`, `already exists`, stat.cid);
                        }
                        logger_1.default.debug(`[IPFS]`, `restore mfs`, `${cid}`, target_path);
                        const p = (0, _ipfsFilesCopy_1._ipfsFilesCopyCID)(ipfs, cid, target_path, {
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
                    return Promise.all(pa[0]);
                })
                    .catch(e => null);
            }
            await ipfs.files.rm(`/novel-opds-now/${hello_txt_name}`).catch(e => null);
            let ret = await ipfs.add(`Hello from novel-opds-now Checker`, {
                pin: false,
                preload: true,
            });
            let file_cid = ret.cid;
            let file_path = `/novel-opds-now/${hello_txt_name}`;
            let file_stat = await ipfs.files.stat(file_path, {
                hash: true,
            }).catch(e => null);
            if (!(0, is_same_cid_1.isSameCID)(file_stat === null || file_stat === void 0 ? void 0 : file_stat.cid, file_cid)) {
                await ipfs.files.rm(file_path).catch(e => null);
                await (0, _ipfsFilesCopy_1._ipfsFilesCopyCID)(ipfs, file_cid, file_path, {
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
    });
}
exports.initMutableFileSystem = initMutableFileSystem;
//# sourceMappingURL=initMutableFileSystem.js.map