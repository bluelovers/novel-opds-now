"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIPFS = exports._info = exports.searchIpfs = exports.useIPFS = void 0;
const tslib_1 = require("tslib");
const ipfsd_ctl_1 = require("ipfsd-ctl");
const processExit_1 = (0, tslib_1.__importDefault)(require("../processExit"));
const ipfs_util_lib_1 = require("ipfs-util-lib");
const ipfs_util_lib_2 = require("ipfs-util-lib");
const cloneDeep_1 = (0, tslib_1.__importDefault)(require("lodash/cloneDeep"));
const bluebird_1 = (0, tslib_1.__importStar)(require("bluebird"));
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const package_json_1 = (0, tslib_1.__importDefault)(require("../../package.json"));
const computer_info_1 = (0, tslib_1.__importDefault)(require("computer-info"));
const terminal_link_1 = (0, tslib_1.__importDefault)(require("terminal-link"));
const pubsub_1 = require("./pubsub");
const ipfs_http_client_1 = require("@bluelovers/ipfs-http-client");
const util_1 = require("@bluelovers/ipfs-http-client/util");
const ipfs_env_1 = (0, tslib_1.__importDefault)(require("ipfs-env"));
const cors_1 = (0, tslib_1.__importDefault)(require("ipfs-util-lib/lib/ipfs/config/cors"));
const multiaddr_to_url_1 = require("multiaddr-to-url");
const tmpDir_1 = (0, tslib_1.__importStar)(require("../tmpDir"));
const unlinkIPFSApi_1 = require("fix-ipfs/lib/ipfsd-ctl/unlinkIPFSApi");
const fs_extra_1 = require("fs-extra");
const rimraf_1 = require("rimraf");
const path_1 = require("path");
const env_bool_1 = require("env-bool");
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
        return _waiting;
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
        bluebird_1.default.delay(1000)
            .then(() => {
            return (0, pubsub_1.pubsubSubscribe)(ipfs)
                .then(e => (0, pubsub_1.connectPeersAll)(ipfs))
                .then(() => (0, pubsub_1.pubsubPublishHello)(ipfs))
                .catch(e => {
                logger_1.default.error(`[IPFS]`, `連接 pubsub 時發生錯誤`);
                logger_1.default.error(e);
            });
        });
        let info = await (0, ipfs_util_lib_1.ipfsAddresses)(ipfs)
            .then(info => {
            let u = (0, multiaddr_to_url_1.multiaddrToURL)(info.API);
            u.pathname = 'webui';
            return u;
        })
            .catch(e => null);
        logger_1.default.success(`IPFS Web UI available at`, (0, terminal_link_1.default)(`webui`, `https://dev.webui.ipfs.io/`), info ? (0, terminal_link_1.default)(`webui`, info) : '');
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
        stop: ipfs.stop,
    };
}
exports.searchIpfs = searchIpfs;
function _useIPFS(options) {
    logger_1.default.info(`[IPFS]`, `嘗試啟動或連接至 IPFS ...`);
    let _temp;
    return bluebird_1.default
        .resolve(searchIpfs())
        .catch(async () => {
        var _a, _b, _c;
        logger_1.default.info(`[IPFS]`, `嘗試啟動 IPFS 伺服器...`, `可使用 IPFS_GO_EXEC 指定執行檔路徑`, `IPFS_PATH 指定 repo 路徑`);
        const disposable = !!(0, env_bool_1.envBool)((_b = (_a = options === null || options === void 0 ? void 0 : options.disposable) !== null && _a !== void 0 ? _a : process.env.IPFS_DISPOSABLE) !== null && _b !== void 0 ? _b : false, true);
        if (disposable || 1 && !process.env.IPFS_PATH) {
            let base = (0, path_1.join)((0, tmpDir_1.tmpPath)(), 'novel-opds-now');
            if (disposable) {
                process.env.IPFS_PATH = (0, tmpDir_1.default)(base).name;
            }
            else {
                process.env.IPFS_PATH = (0, path_1.join)(base, '.ipfs');
            }
        }
        const myFactory = (0, ipfsd_ctl_1.createFactory)({
            ipfsHttpModule: await Promise.resolve().then(() => (0, tslib_1.__importStar)(require('ipfs-http-client'))),
            ipfsBin: (0, ipfs_env_1.default)().IPFS_GO_EXEC || await Promise.resolve().then(() => (0, tslib_1.__importStar)(require('go-ipfs'))).then(m => m.path()),
            ipfsOptions: {
                EXPERIMENTAL: {
                    ipnsPubsub: true,
                    repoAutoMigrate: true,
                },
                start: false,
            },
            ...options,
            disposable: false,
        });
        const ipfsd = await myFactory.spawn();
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
            logger_1.default.debug(`[IPFS]`, `ipfsd`, `init`);
            await ipfsd.init((_c = ipfsd.opts.ipfsOptions) === null || _c === void 0 ? void 0 : _c.init);
        }
        if (!ipfsd.started) {
            logger_1.default.debug(`[IPFS]`, `ipfsd`, `start`);
            await ipfsd.start()
                .catch(async (e) => {
                logger_1.default.debug(`[IPFS]`, `ipfsd`, `start`, `retry`);
                await (0, unlinkIPFSApi_1.unlinkIPFSApi)(ipfsd.path);
                return ipfsd.start();
            });
        }
        const ipfs = ipfsd.api;
        const stop = (...argv) => {
            logger_1.default.debug(`[IPFS]`, `ipfsd`, `stop`);
            let ls = [ipfsd.stop(...argv)];
            if (ipfsd.disposable && /[\/\\](?:\.?te?mp)[\/\\]+.+/i.test(ipfsd.path)) {
                logger_1.default.debug(`[IPFS]`, `ipfsd`, `cleanup`);
                ls.push((0, rimraf_1.sync)(ipfsd.path));
                ls.push(ipfsd.cleanup());
            }
            return Promise.all(ls);
        };
        await (0, ipfs_util_lib_2.assertCheckIPFS)(ipfs).tapCatch(stop);
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
            logger_1.default.info(`[IPFS]`, `ipfs:stop`);
            return Promise.all([
                _stop({
                    timeout: 2000,
                }),
                (0, pubsub_1.pubsubUnSubscribe)(ipfs),
            ]).then(done);
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
            }
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
//# sourceMappingURL=use.js.map