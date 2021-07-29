"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.setIPFSToCache = exports.getIPFSFromCache = exports.useIPFSFromCache = exports.getIPFS = exports._info = exports.searchIpfs = exports.useIPFS = void 0;
const tslib_1 = require("tslib");
require("../util/processHandle");
const processExit_1 = (0, tslib_1.__importDefault)(require("../util/processExit"));
const ipfs_util_lib_1 = require("ipfs-util-lib");
const cloneDeep_1 = (0, tslib_1.__importDefault)(require("lodash/cloneDeep"));
const bluebird_1 = (0, tslib_1.__importStar)(require("bluebird"));
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const package_json_1 = (0, tslib_1.__importDefault)(require("../../package.json"));
const computer_info_1 = (0, tslib_1.__importDefault)(require("computer-info"));
const terminal_link_1 = (0, tslib_1.__importDefault)(require("terminal-link"));
const ipfs_http_client_1 = require("@bluelovers/ipfs-http-client");
const util_1 = require("@bluelovers/ipfs-http-client/util");
const cors_1 = (0, tslib_1.__importDefault)(require("ipfs-util-lib/lib/ipfs/config/cors"));
const multiaddr_to_url_1 = require("multiaddr-to-url");
const unlinkIPFSApi_1 = require("fix-ipfs/lib/ipfsd-ctl/unlinkIPFSApi");
const fs_extra_1 = require("fs-extra");
const rimraf_1 = require("rimraf");
const path_1 = require("path");
const port_1 = require("./use/port");
const peer_1 = require("./peer");
const util_2 = require("util");
const index_1 = require("./pubsub/index");
const repoExists_1 = require("./repoExists");
const const_1 = require("../const");
const back_up_identity_1 = require("./util/back-up-identity");
const daemonFactory_1 = require("./util/daemonFactory");
const envDisposable_1 = require("./util/envDisposable");
const initHello_1 = require("./use/initHello");
const initHelloCheck_1 = require("./use/initHelloCheck");
const saveMutableFileSystemRoots_1 = require("./mfs/saveMutableFileSystemRoots");
const deepEntryListMap_1 = require("./mfs/deepEntryListMap");
(_a = util_2.inspect.defaultOptions) !== null && _a !== void 0 ? _a : (util_2.inspect.defaultOptions = {});
util_2.inspect.defaultOptions.colors = logger_1.default.enabledColor;
let _cache;
let _waiting;
let _timeout;
function useIPFS(options) {
    return bluebird_1.default.resolve().then(() => {
        var _a, _b;
        if ((_b = (_a = _waiting === null || _waiting === void 0 ? void 0 : _waiting.isPending) === null || _a === void 0 ? void 0 : _a.call(_waiting)) !== null && _b !== void 0 ? _b : _waiting) {
            logger_1.default.info(`[IPFS]`, `IPFS 仍在啟動中，請稍後...`);
        }
        return _waiting;
    }).then(async () => {
        var _a;
        if (typeof _waiting !== 'undefined') {
            _waiting = void 0;
        }
        if (_cache) {
            if (((_a = _cache.ipfsd) === null || _a === void 0 ? void 0 : _a.started) !== false && await (0, ipfs_util_lib_1.checkIPFS)(_cache.ipfs).catch(e => null)) {
                return _cache;
            }
            await _cache.stopAsync().catch(e => null);
            _cache = void 0;
            logger_1.default.warn(`[IPFS]`, `IPFS 伺服器已斷線`);
        }
        if (_timeout) {
            return Promise.reject(null);
        }
        _waiting = _useIPFS(options)
            .tap(v => _cache = v)
            .tap(_handle)
            .tap(async ({ ipfsd, ipfs, path, }) => {
            let info = await (0, ipfs_util_lib_1.ipfsAddresses)(ipfs).catch(e => null);
            logger_1.default.info(`[IPFS]`, `IPFS 已啟動`, info, path);
            return (0, cors_1.default)(ipfs).catch(e => null);
        });
        return _waiting
            .tap(async ({ ipfs, ipfsd, }) => {
            return (0, index_1.pubsubSubscribe)(ipfs)
                .tap(async () => {
                (0, deepEntryListMap_1.loadDeepEntryListMapFromMixin)();
                (0, initHello_1.initHello)(ipfs);
                (0, initHelloCheck_1.initHelloCheck)(ipfs, ipfsd);
            })
                .catch(e => {
                logger_1.default.error(`[IPFS]`, `連接 pubsub 時發生錯誤`);
                logger_1.default.error(e);
            });
        });
    })
        .catch(e => {
        if (e !== null || !_timeout) {
            logger_1.default.error(`[IPFS]`, `啟動 IPFS 時發生錯誤，可能無法正常連接至 IPFS 網路`);
            logger_1.default.error(e);
        }
        return null;
    });
}
exports.useIPFS = useIPFS;
function _handle(cache) {
    return bluebird_1.default.resolve(cache).then((_cache) => {
        return bluebird_1.default.props({
            ipfs: _cache.ipfs,
            id: _cache.ipfs.id(),
            version: _cache.ipfs.version(),
        });
    })
        .then(async (data) => {
        const { ipfs } = data;
        const { id, agentVersion, protocolVersion } = data.id;
        _info({
            ipfs: {
                id,
                agentVersion,
                protocolVersion,
                version: data.version.version,
            },
        });
        let info = await (0, ipfs_util_lib_1.ipfsAddresses)(ipfs)
            .then(info => {
            let u = (0, multiaddr_to_url_1.multiaddrToURL)(info.API);
            u.pathname = 'webui';
            return u;
        })
            .catch(e => null);
        logger_1.default.success(`IPFS Web UI available at`, (0, terminal_link_1.default)(`webui`, `https://dev.webui.ipfs.io/`), info
            ? (0, terminal_link_1.default)(`webui`, info)
            : '');
    });
}
async function searchIpfs() {
    logger_1.default.info(`[IPFS]`, `搜尋可用的 IPFS 伺服器...`, `可使用 IPFS_ADDRESSES_API 來指定特定伺服器`);
    let ipfsServerList = (0, util_1.getDefaultServerList)();
    let ipfs = await (0, ipfs_http_client_1.findIpfsClient)(ipfsServerList);
    if (!await (0, ipfs_util_lib_1.checkIPFS)(ipfs).catch(e => null)) {
        return Promise.reject(new Error);
    }
    return {
        ipfsd: undefined,
        ipfs,
        async stop(...argv) {
            return (0, ipfs_util_lib_1.ipfsAddresses)(ipfs)
                .then(addr => {
                logger_1.default.warn(`[IPFS]`, `IPFS 伺服器可能仍在執行中，請自行停止伺服器`, addr);
            })
                .catch(e => null);
        },
    };
}
exports.searchIpfs = searchIpfs;
function _useIPFS(options) {
    logger_1.default.info(`[IPFS]`, `嘗試啟動或連接至 IPFS ...`);
    const disposable = (0, envDisposable_1.envDisposable)(options === null || options === void 0 ? void 0 : options.disposable);
    let _temp;
    return bluebird_1.default
        .resolve(disposable ? Promise.reject() : searchIpfs())
        .catch(async () => {
        var _a, _b;
        var _c;
        logger_1.default.info(`[IPFS]`, `嘗試啟動 IPFS 伺服器...`, `可使用 IPFS_GO_EXEC 指定執行檔路徑`, `IPFS_PATH 指定 repo 路徑`);
        const { ipfsd } = await (0, daemonFactory_1.daemonFactory)(disposable, options);
        if (disposable) {
            let Addresses = await (0, port_1.findFreeAddresses)(ipfsd.opts);
            (_a = (_c = ipfsd.opts.ipfsOptions).config) !== null && _a !== void 0 ? _a : (_c.config = {});
            ipfsd.opts.ipfsOptions.config.Addresses = {
                ...ipfsd.opts.ipfsOptions.config.Addresses,
                ...Addresses,
            };
            logger_1.default.dir(ipfsd.env, {
                depth: null,
            });
            logger_1.default.dir(ipfsd.opts.ipfsOptions, {
                depth: null,
            });
        }
        await (0, fs_extra_1.ensureDir)(ipfsd.path);
        if (/[\/\\](?:\.?te?mp)[\/\\]+.+/i.test(ipfsd.path)) {
            ipfsd.disposable = disposable;
        }
        logger_1.default.debug(`[IPFS]`, `ipfsd`, _temp = {
            repo: ipfsd.path,
            ipfsBin: ipfsd.opts.ipfsBin,
            disposable: ipfsd.disposable,
        });
        if (!ipfsd.started) {
            let oldExists = await (0, repoExists_1.repoExists)(ipfsd.path);
            logger_1.default.debug(`[IPFS]`, `ipfsd`, `init`);
            await ipfsd.init((_b = ipfsd.opts.ipfsOptions) === null || _b === void 0 ? void 0 : _b.init);
            if (!disposable && await (0, repoExists_1.repoExists)(ipfsd.path)) {
                let bool = await (0, fs_extra_1.pathExists)((0, path_1.join)(const_1.__root, 'test', '.identity.json'));
                if (!oldExists && bool) {
                    ipfsd.isNewRepo = true;
                    await (0, back_up_identity_1.restoreIdentity)(ipfsd);
                    await (0, fs_extra_1.readJSON)((0, path_1.join)(ipfsd.path, 'config'))
                        .then(config => {
                        config["API"] = {
                            "HTTPHeaders": {
                                "Access-Control-Allow-Credentials": [
                                    "true"
                                ],
                                "Access-Control-Allow-Headers": [
                                    "Authorization"
                                ],
                                "Access-Control-Allow-Methods": [
                                    "HEAD",
                                    "PUT",
                                    "GET",
                                    "POST",
                                    "OPTIONS"
                                ],
                                "Access-Control-Allow-Origin": [
                                    "*",
                                    "http://webui.ipfs.io.ipns.localhost:8080",
                                    "http://webui.ipfs.io.ipns.localhost:9090",
                                    "http://localhost:3000",
                                    "http://127.0.0.1:5001",
                                    "http://127.0.0.1:5002",
                                    "https://webui.ipfs.io",
                                    "https://dev.webui.ipfs.io"
                                ],
                                "Access-Control-Expose-Headers": [
                                    "Location"
                                ]
                            }
                        };
                        return (0, fs_extra_1.writeJSON)((0, path_1.join)(ipfsd.path, 'config'), config, {
                            spaces: 2,
                        });
                    });
                }
                else if (!bool) {
                    await (0, back_up_identity_1.backupIdentity)(ipfsd);
                }
            }
        }
        if (!ipfsd.started) {
            logger_1.default.debug(`[IPFS]`, `ipfsd`, `start`);
            await ipfsd.start()
                .catch(async (e) => {
                e && logger_1.default.warn(`[IPFS]`, `ipfsd`, `start`, String(e));
                logger_1.default.debug(`[IPFS]`, `ipfsd`, `start`, `retry`);
                await (0, unlinkIPFSApi_1.unlinkIPFSApiAsync)(ipfsd.path).catch(e => null);
                return ipfsd.start();
            });
        }
        const ipfs = ipfsd.api;
        const stop = async (...argv) => {
            logger_1.default.debug(`[IPFS]`, `ipfsd`, `stop`);
            if (!ipfsd.disposable) {
                await (0, saveMutableFileSystemRoots_1.saveMutableFileSystemRoots)(ipfs).catch(e => null);
            }
            let ls = [ipfsd.stop(...argv)];
            if (ipfsd.disposable && /[\/\\](?:\.?te?mp)[\/\\]+.+/i.test(ipfsd.path)) {
                logger_1.default.debug(`[IPFS]`, `ipfsd`, `cleanup`);
                ls.push((0, rimraf_1.sync)(ipfsd.path));
                ls.push(ipfsd.cleanup());
            }
            return Promise.all(ls);
        };
        await (0, ipfs_util_lib_1.assertCheckIPFS)(ipfs).tapCatch(stop);
        return {
            ipfsd,
            ipfs,
            stop,
        };
    })
        .timeout(60 * 1000)
        .tapCatch(bluebird_1.TimeoutError, e => {
        _timeout = true;
        logger_1.default.error(`[IPFS]`, `啟動時間過長，請檢查或刪除 IPFS repo 路徑後重新執行`, _temp);
        _temp = void 0;
    })
        .then(async ({ ipfsd, ipfs, stop: _stop, }) => {
        const path = ipfsd === null || ipfsd === void 0 ? void 0 : ipfsd.path;
        const stop = (done) => {
            logger_1.default.info(`[IPFS]`, `useIPFS:stop`);
            peer_1.peerAbortController.abort();
            return Promise.all([
                _stop === null || _stop === void 0 ? void 0 : _stop({
                    timeout: 2000,
                }),
                (0, index_1.pubsubUnSubscribe)(ipfs),
            ]).then(done !== null && done !== void 0 ? done : (() => null));
        };
        const ret = {
            ipfsd,
            path,
            get ipfs() {
                return ipfs;
            },
            async address() {
                let addr = await (0, ipfs_util_lib_1.ipfsAddresses)(ipfs);
                return (0, cloneDeep_1.default)(addr);
            },
            stop,
            stopAsync() {
                return new bluebird_1.default((resolve, reject) => {
                    try {
                        _cache.stop(resolve);
                    }
                    catch (e) {
                        reject(e);
                    }
                });
            },
        };
        (0, processExit_1.default)(ret.stop);
        return ret;
    });
}
function _info(data) {
    if (_info.disable) {
        return;
    }
    let { osystem, ram, cpu, arch, node, } = (0, computer_info_1.default)();
    logger_1.default.info({
        ...data,
        osystem,
        ram,
        cpu,
        arch,
        node,
        [package_json_1.default.name]: package_json_1.default.version,
    });
    _info.disable = true;
}
exports._info = _info;
function getIPFS() {
    return useIPFS().then(m => m.ipfs).catch(e => null);
}
exports.getIPFS = getIPFS;
function useIPFSFromCache() {
    return bluebird_1.default.resolve(_cache);
}
exports.useIPFSFromCache = useIPFSFromCache;
function getIPFSFromCache() {
    return useIPFSFromCache().then(m => m.ipfs).catch(e => null);
}
exports.getIPFSFromCache = getIPFSFromCache;
function setIPFSToCache(ipfs) {
    _cache !== null && _cache !== void 0 ? _cache : (_cache = {});
    _cache.ipfs = ipfs;
}
exports.setIPFSToCache = setIPFSToCache;
//# sourceMappingURL=use.js.map