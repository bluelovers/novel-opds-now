"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const logger_1 = tslib_1.__importDefault(require("debug-color2/logger"));
const util_1 = require("util");
const use_1 = require("../../lib/ipfs/use");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const deepEntryListMap_1 = require("../../lib/ipfs/mfs/deepEntryListMap");
const is_same_cid_1 = require("@lazy-ipfs/is-same-cid");
const saveMutableFileSystemRoots_1 = require("../../lib/ipfs/mfs/saveMutableFileSystemRoots");
const path_1 = require("path");
const __root_1 = tslib_1.__importDefault(require("../../lib/__root"));
const fs_extra_1 = require("fs-extra");
logger_1.default.enabledColor = true;
(_a = util_1.inspect.defaultOptions) !== null && _a !== void 0 ? _a : (util_1.inspect.defaultOptions = {});
util_1.inspect.defaultOptions.colors = logger_1.default.enabledColor;
(async () => {
    const { ipfs } = await (0, use_1._useIPFS)();
    (0, use_1.setIPFSToCache)(ipfs);
    const peerID = await ipfs.id().then(m => m.id);
    await (0, deepEntryListMap_1.loadDeepEntryListMapFromFile)();
    let _cacheTask = await (0, fs_extra_1.readJSON)((0, path_1.join)(__root_1.default, 'test/cache/check-cid-cache.json'))
        .catch(ls => ([]))
        .then(ls => new Set(ls));
    let _cacheTaskError = await (0, fs_extra_1.readJSON)((0, path_1.join)(__root_1.default, 'test/cache/check-cid-cache.error.json'))
        .catch(ls => ([]))
        .then(ls => new Set(ls));
    logger_1.default.log(_cacheTask.size);
    let index = 0;
    let index_error = 0;
    let index_ok = 0;
    for (let [mfs_path, cid] of deepEntryListMap_1.deepEntryListMap.entries()) {
        if (_cacheTaskError.has(mfs_path) || !mfs_path.match(/^\/novel-opds-now\/(?:calibre\/)?[^\\]+\/$|\.cache/) && _cacheTask.has(mfs_path) || (1 && mfs_path.match(/37fbdb/))) {
            logger_1.default.gray.log(`[skip]`, mfs_path);
            continue;
        }
        let cid2 = await ipfs.files.stat(mfs_path, {
            hash: true,
            timeout: 2000,
        }).then(m => m.cid).catch(e => null);
        let changed = false;
        if (cid2 && !(0, is_same_cid_1.isSameCID)(cid2, cid)) {
            changed = true;
            (0, deepEntryListMap_1._setDeepEntryListMapBoth)(mfs_path, cid2);
        }
        let c = logger_1.default.gray.log.bind(logger_1.default.gray);
        if (changed) {
            c = logger_1.default.success.bind(logger_1.default);
            index_ok++;
        }
        if (!cid2) {
            c = logger_1.default.error.bind(logger_1.default);
            _cacheTaskError.add(mfs_path);
            index_error++;
        }
        else {
            _cacheTask.add(mfs_path);
            index_error = 0;
        }
        c(mfs_path, cid2, ++index);
        if (index && (index % 200) === 0 || index_ok && (index_ok % 10) === 0 || index_error && (index_error % 6) === 0) {
            (0, deepEntryListMap_1.enableForceSave)();
            (0, deepEntryListMap_1.enableOverwriteServer)();
            await (0, fs_extra_1.writeJSON)((0, path_1.join)(__root_1.default, 'test/cache/check-cid-cache.json'), [..._cacheTask.values()], {
                spaces: 2,
            });
            await (0, fs_extra_1.writeJSON)((0, path_1.join)(__root_1.default, 'test/cache/check-cid-cache.error.json'), [..._cacheTaskError.values()], {
                spaces: 2,
            });
            await (0, deepEntryListMap_1._saveDeepEntryListMapToFile)();
            logger_1.default.debug(`delay`, '5s', _cacheTask.size);
            await bluebird_1.default.delay(5 * 1000);
        }
    }
    await (0, fs_extra_1.writeJSON)((0, path_1.join)(__root_1.default, 'test/cache/check-cid-cache.json'), [..._cacheTask.values()], {
        spaces: 2,
    });
    await (0, fs_extra_1.writeJSON)((0, path_1.join)(__root_1.default, 'test/cache/check-cid-cache.error.json'), [..._cacheTaskError.values()], {
        spaces: 2,
    });
    (0, deepEntryListMap_1.enableForceSave)();
    (0, deepEntryListMap_1.enableOverwriteServer)();
    await (0, deepEntryListMap_1._saveDeepEntryListMapToFile)();
    await (0, deepEntryListMap_1._pokeDeepEntryListMap)();
    (0, deepEntryListMap_1.enableForceSave)();
    (0, deepEntryListMap_1.enableOverwriteServer)();
    let { cid, content } = await (0, deepEntryListMap_1._publishDeepEntryListMapToIPFS)(ipfs, deepEntryListMap_1.deepEntryListMap);
    await Promise.all([
        (0, deepEntryListMap_1._putDeepEntryListMapToServer)(ipfs, cid),
        (0, deepEntryListMap_1._pokeDeepEntryListMap)(cid, null),
    ]);
    (0, deepEntryListMap_1.enableForceSave)();
    await (0, fs_extra_1.writeFile)((0, path_1.join)(__root_1.default, 'test', 'data', 'novel-opds-now.cids.json'), content);
    await (0, deepEntryListMap_1._writeDeepEntryListMapToMfs)(content);
    await (0, saveMutableFileSystemRoots_1._saveMutableFileSystemRoots)(ipfs);
    await bluebird_1.default.delay(60 * 1000);
})()
    .catch(e => {
    logger_1.default.error(e);
})
    .finally(async () => {
    await (0, use_1.useIPFSFromCache)().then(m => { var _a; return (_a = m === null || m === void 0 ? void 0 : m.stop) === null || _a === void 0 ? void 0 : _a.call(m); });
    process.exit();
});
//# sourceMappingURL=check-cid-cache.js.map