"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.daemonFactory = void 0;
const tslib_1 = require("tslib");
const path_1 = require("path");
const tmpPath_1 = require("../../util/tmpPath");
const tmpDir_1 = (0, tslib_1.__importDefault)(require("../../util/tmpDir"));
const ipfs_env_1 = (0, tslib_1.__importDefault)(require("ipfs-env"));
const ipfsd_ctl_1 = require("ipfsd-ctl");
async function daemonFactory(disposable, options) {
    var _a;
    if (disposable || 1 && !process.env.IPFS_PATH) {
        let base = (0, path_1.join)((0, tmpPath_1.tmpPath)(), 'novel-opds-now');
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
        ...((_a = options === null || options === void 0 ? void 0 : options.factoryOptions) !== null && _a !== void 0 ? _a : {}),
        disposable: false,
        forceKill: true,
        forceKillTimeout: 3000,
    });
    const ipfsd = await myFactory.spawn();
    return {
        myFactory,
        ipfsd,
    };
}
exports.daemonFactory = daemonFactory;
//# sourceMappingURL=daemonFactory.js.map