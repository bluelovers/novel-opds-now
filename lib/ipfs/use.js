"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._info = exports.useIPFS = void 0;
const tslib_1 = require("tslib");
const ipfsd_ctl_1 = require("ipfsd-ctl");
const processExit_1 = (0, tslib_1.__importDefault)(require("../processExit"));
const ipfs_util_lib_1 = require("ipfs-util-lib");
const cloneDeep_1 = (0, tslib_1.__importDefault)(require("lodash/cloneDeep"));
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const package_json_1 = (0, tslib_1.__importDefault)(require("../../package.json"));
const computer_info_1 = (0, tslib_1.__importDefault)(require("computer-info"));
const terminal_link_1 = (0, tslib_1.__importDefault)(require("terminal-link"));
const pubsub_1 = require("./pubsub");
let _cache;
let _waiting;
function useIPFS(options) {
    return bluebird_1.default.resolve(_waiting).then(async () => {
        if (typeof _waiting !== 'undefined') {
            _waiting = void 0;
            if (_cache) {
                return _cache;
            }
        }
        if (_cache) {
            if (await (0, ipfs_util_lib_1.checkIPFS)(_cache.ipfs)) {
                return _cache;
            }
            await _cache.stop().catch(e => logger_1.default.error(e));
        }
        _waiting = _useIPFS(options);
        return _cache = await _waiting
            .tap(_handle)
            .tap(() => {
            logger_1.default.info(`[IPFS]`, `IPFS 已啟動`);
        });
    });
}
exports.useIPFS = useIPFS;
function _handle({ ipfs, }) {
    return bluebird_1.default.props({
        id: ipfs.id(),
        version: ipfs.version(),
    })
        .then(data => {
        const { id, agentVersion, protocolVersion } = data.id;
        _info({
            ipfs: {
                id,
                agentVersion,
                protocolVersion,
                version: data.version.version,
            },
        });
        (0, pubsub_1.pubsubSubscribe)(ipfs)
            .then(e => (0, pubsub_1.connectPeersAll)(ipfs))
            .then(() => (0, pubsub_1.pubsubPublishHello)(ipfs))
            .catch(e => {
            logger_1.default.error(`[IPFS]`, `連接 pubsub 時發生錯誤`);
            logger_1.default.error(e);
        });
        logger_1.default.success(`IPFS Web UI available at`, (0, terminal_link_1.default)(`webui`, `https://dev.webui.ipfs.io/`));
    })
        .catch(e => {
        logger_1.default.error(`[IPFS]`, `啟動 IPFS 時發生錯誤，可能無法正常連接至 IPFS 網路`);
        logger_1.default.error(e);
    });
}
function _useIPFS(options) {
    return bluebird_1.default.resolve().then(async () => {
        logger_1.default.info(`[IPFS]`, `嘗試啟動或連接至 IPFS`);
        const ipfsd = await (0, ipfsd_ctl_1.createController)({
            ipfsHttpModule: await Promise.resolve().then(() => (0, tslib_1.__importStar)(require('ipfs-http-client'))),
            ipfsBin: await Promise.resolve().then(() => (0, tslib_1.__importStar)(require('go-ipfs'))).then(m => m.path()),
            ipfsOptions: {
                EXPERIMENTAL: {
                    ipnsPubsub: true,
                    repoAutoMigrate: true,
                },
            },
            ...options,
        });
        const ipfs = ipfsd.api;
        const ret = {
            ipfsd,
            get ipfs() {
                return ipfs;
            },
            async address() {
                let addr = await (0, ipfs_util_lib_1.ipfsAddresses)(ipfs);
                return (0, cloneDeep_1.default)(addr);
            },
            async stop() {
                logger_1.default.info(`[IPFS]`, `ipfsd:stop`);
                await (0, pubsub_1.pubsubUnSubscribe)(ipfs);
                return ipfsd.stop();
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
//# sourceMappingURL=use.js.map