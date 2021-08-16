"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const util_1 = require("util");
const use_1 = require("../../lib/ipfs/use");
const deepEntryListMap_1 = require("../../lib/ipfs/mfs/deepEntryListMap");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const __root_1 = (0, tslib_1.__importDefault)(require("../../lib/__root"));
const saveMutableFileSystemRoots_1 = require("../../lib/ipfs/mfs/saveMutableFileSystemRoots");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
logger_1.default.enabledColor = true;
(_a = util_1.inspect.defaultOptions) !== null && _a !== void 0 ? _a : (util_1.inspect.defaultOptions = {});
util_1.inspect.defaultOptions.colors = logger_1.default.enabledColor;
(async () => {
    const { ipfs } = await (0, use_1._useIPFS)();
    (0, use_1.setIPFSToCache)(ipfs);
    const peerID = await ipfs.id().then(m => m.id);
    await (0, deepEntryListMap_1.loadDeepEntryListMapFromFile)();
    (0, deepEntryListMap_1.enableForceSave)();
    (0, deepEntryListMap_1.enableOverwriteServer)();
    let { cid, content } = await (0, deepEntryListMap_1._publishDeepEntryListMapToIPFS)(ipfs, deepEntryListMap_1.deepEntryListMap);
    logger_1.default.log(`deepEntryListMap`, cid);
    await Promise.all([
        (0, deepEntryListMap_1._putDeepEntryListMapToServer)(ipfs, cid).tap(v => logger_1.default.success(v)),
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
//# sourceMappingURL=replace-cid-cache.js.map