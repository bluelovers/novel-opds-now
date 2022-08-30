"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDir = void 0;
const tslib_1 = require("tslib");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const _ipfsFilesCopy_1 = require("./_ipfsFilesCopy");
function ensureDir(ipfs, dir_path, options) {
    return bluebird_1.default.resolve(ipfs)
        .then(async (ipfs) => {
        let dir_stat = await ipfs.files.stat(dir_path).catch(e => null);
        let { fromCID, overwriteTarget, ...opts } = options !== null && options !== void 0 ? options : {};
        opts.parents = true;
        let _do = true;
        if (dir_stat) {
            if (dir_stat.type !== 'directory') {
                throw new Error(`Target path not a directory: '${dir_path}'`);
            }
            if (options.fromCID && options.overwriteTarget) {
                await ipfs.files.rm(dir_path, {
                    recursive: true,
                });
            }
            else {
                _do = false;
            }
        }
        else {
            if (!(dir_path === null || dir_path === void 0 ? void 0 : dir_path.length) || dir_path[dir_path.length - 1] !== '/') {
                throw new Error(`Invalid directory path: '${dir_path}'`);
            }
        }
        if (_do) {
            if (options.fromCID) {
                await (0, _ipfsFilesCopy_1._ipfsFilesCopyCID)(ipfs, options.fromCID, dir_path, opts);
            }
            else {
                await ipfs.files.mkdir(dir_path, opts);
            }
        }
        return ipfs.files.stat(dir_path);
    });
}
exports.ensureDir = ensureDir;
//# sourceMappingURL=ensureDir.js.map