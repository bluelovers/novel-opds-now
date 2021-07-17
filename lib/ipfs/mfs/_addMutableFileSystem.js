"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._addMutableFileSystem = exports.waitingCache = void 0;
const tslib_1 = require("tslib");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const use_1 = require("../use");
const to_cid_1 = require("@lazy-ipfs/to-cid");
const is_same_cid_1 = require("@lazy-ipfs/is-same-cid");
exports.waitingCache = new Set();
function _addMutableFileSystem(dir_path, data, options, ignoreWaitingCheck) {
    return bluebird_1.default.resolve()
        .then(() => {
        var _a;
        const file_path = `${dir_path}/${data.path}`;
        if (!ignoreWaitingCheck && exports.waitingCache.has(file_path)) {
            return;
        }
        return bluebird_1.default.resolve((_a = options === null || options === void 0 ? void 0 : options.ipfs) !== null && _a !== void 0 ? _a : (0, use_1.getIPFS)()).then(async (ipfs) => {
            let file_cid = (0, to_cid_1.toCID)(data.cid);
            let file_stat = await ipfs.files.stat(file_path).catch(e => null);
            if (!file_stat || !(0, is_same_cid_1.isSameCID)(file_stat.cid, file_cid)) {
                await ipfs.files.mkdir(dir_path, {
                    parents: true,
                }).catch(e => null);
                await ipfs.files.rm(file_path).catch(e => null);
                await ipfs.files.cp(`/ipfs/${file_cid}`, file_path, {
                    parents: true,
                });
            }
            return {
                dir_path,
                file_path,
                file_cid,
            };
        })
            .finally(() => {
            var _a;
            return (_a = options === null || options === void 0 ? void 0 : options.done) === null || _a === void 0 ? void 0 : _a.call(options, file_path);
        });
    });
}
exports._addMutableFileSystem = _addMutableFileSystem;
//# sourceMappingURL=_addMutableFileSystem.js.map