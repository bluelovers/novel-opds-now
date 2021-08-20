"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const load_1 = (0, tslib_1.__importDefault)(require("../../lib/site/masiro/load"));
const use_1 = require("../../lib/ipfs/use");
const deepEntryListMap_1 = require("../../lib/ipfs/mfs/deepEntryListMap");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const ipfs_util_lib_1 = require("ipfs-util-lib");
const lazy_url_1 = require("lazy-url");
const multiaddr_to_url_1 = require("multiaddr-to-url");
const fetch_1 = (0, tslib_1.__importDefault)(require("../../lib/fetch"));
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const saveMutableFileSystemRoots_1 = require("../../lib/ipfs/mfs/saveMutableFileSystemRoots");
(0, use_1.searchIpfs)()
    .tap(async ({ ipfs, stop }) => {
    (0, use_1.setIPFSToCache)(ipfs);
    await (0, deepEntryListMap_1.loadDeepEntryListMapFromFile)();
    let baseURL = await (0, ipfs_util_lib_1.ipfsAddresses)(ipfs).then(info => new lazy_url_1.LazyURL((0, multiaddr_to_url_1.multiaddrToURL)(info.API)));
    baseURL.port = 3000;
    baseURL.pathname = '';
    const list = await (0, load_1.default)(false);
    const length = list.length;
    for (let index = 0; index < length; index++) {
        let novel = list[index];
        let label = `${(index + 1).toString().padStart(5, '0')}／${length.toString().padStart(5, '0')}`;
        let cid;
        await (0, fetch_1.default)(new lazy_url_1.LazyURL(`/file/masiro/${novel.id}`, baseURL))
            .tap(res => {
            let x = res.headers.get('X-Ipfs-Path');
            if (x === null || x === void 0 ? void 0 : x.length) {
                cid = x;
            }
        })
            .tap(v => logger_1.default.success(label, `done`, novel.id, novel.title, cid))
            .tapCatch(logger_1.default.error);
        if (index && (index % 3) === 0) {
            (0, deepEntryListMap_1.enableForceSave)();
            (0, deepEntryListMap_1.enableOverwriteServer)();
            await (0, deepEntryListMap_1._saveDeepEntryListMapToFile)();
            logger_1.default.debug(`delay`, '30s');
            await ipfs.files.ls('/novel-opds-now/masiro', {
                timeout: 10 * 1000,
            });
            await bluebird_1.default.delay(30 * 1000);
        }
    }
    (0, deepEntryListMap_1.enableForceSave)();
    (0, deepEntryListMap_1.enableOverwriteServer)();
    await (0, deepEntryListMap_1._saveDeepEntryListMapToFile)();
    await (0, saveMutableFileSystemRoots_1._saveMutableFileSystemRoots)(ipfs);
    return stop();
})
    .tapCatch(async (e) => {
    logger_1.default.dir(e);
    (0, deepEntryListMap_1.enableForceSave)();
    (0, deepEntryListMap_1.enableOverwriteServer)();
    await (0, deepEntryListMap_1._saveDeepEntryListMapToFile)();
})
    .finally(async () => {
    await bluebird_1.default.delay(30 * 1000);
    process.exit();
});
//# sourceMappingURL=import-masiro-old.js.map