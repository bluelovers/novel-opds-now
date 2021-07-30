"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const use_1 = require("../../lib/ipfs/use");
const buildList_1 = require("calibre-server/lib/db/buildList");
const util_1 = require("../../server/router/calibre/util");
const fetch_1 = (0, tslib_1.__importDefault)(require("../../lib/fetch"));
const ipfs_util_lib_1 = require("ipfs-util-lib");
const multiaddr_to_url_1 = require("multiaddr-to-url");
const lazy_url_1 = require("lazy-url");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const sanitize_filename_1 = require("@lazy-node/sanitize-filename");
const calibre_db_1 = require("calibre-db");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const deepEntryListMap_1 = require("../../lib/ipfs/mfs/deepEntryListMap");
const to_cid_1 = require("@lazy-ipfs/to-cid");
const it_all_1 = (0, tslib_1.__importDefault)(require("it-all"));
const to_ipfs_url_1 = require("to-ipfs-url");
const saveMutableFileSystemRoots_1 = require("../../lib/ipfs/mfs/saveMutableFileSystemRoots");
(0, use_1.searchIpfs)()
    .tap(async ({ ipfs, stop }) => {
    let calibrePaths = (0, util_1.getCalibrePaths)();
    await (0, deepEntryListMap_1.loadDeepEntryListMapFromFile)();
    let baseURL = await (0, ipfs_util_lib_1.ipfsAddresses)(ipfs).then(info => new lazy_url_1.LazyURL((0, multiaddr_to_url_1.multiaddrToURL)(info.API)));
    baseURL.port = 3000;
    baseURL.pathname = '';
    const dbList = await (0, buildList_1.buildLibraryList)({
        calibrePaths,
        cwd: calibrePaths[0],
    });
    let _cacheTask = new Map();
    for (const _dbEntry of Object.values(dbList)) {
        await _dbEntry.lazyload().then(db => {
            logger_1.default.info(db.name());
            return db.getBooks().catchReturn([]).mapSeries(async (book, index, length) => {
                var _a, _b;
                let label = `${(index + 1).toString().padStart(5, '0')}／${length.toString().padStart(5, '0')}`;
                let author = (_b = (_a = book.authors) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.author_name;
                author = (0, sanitize_filename_1.sanitizeFilename)(author || 'unknown', {
                    replaceToFullWidth: true,
                }) || 'unknown';
                let file = book.data.filter(v => v.data_format === "EPUB")[0];
                if (!file) {
                    logger_1.default.gray.log(label, `not exists epub`, _dbEntry.id, db.name(), book.book_title, book.book_id, book.book_path);
                    return;
                }
                let ext = '.' + file.data_format.toLocaleLowerCase();
                let filename = `${book.book_title} - ${author}${ext}`;
                filename = (0, sanitize_filename_1.sanitizeFilename)(filename, {
                    replaceToFullWidth: true,
                });
                let mfs_path = `/novel-opds-now/calibre/${_dbEntry.id}/${author}/${filename}`;
                let stat = deepEntryListMap_1.deepEntryListMap.get(mfs_path) || await ipfs.files.stat(mfs_path, {
                    hash: true,
                }).then(m => m.cid).catch(e => null);
                if (!stat) {
                    let cid;
                    logger_1.default.info(label, `start...`, _dbEntry.id, db.name(), book.book_title, book.book_id, book.book_path);
                    await (0, fetch_1.default)(new lazy_url_1.LazyURL(`/file/calibre/${_dbEntry.id}/${book.book_id}/${(0, calibre_db_1.getFilePath)(file, book)}`, baseURL))
                        .tap(res => {
                        let x = res.headers.get('X-Ipfs-Path');
                        if (x === null || x === void 0 ? void 0 : x.length) {
                            cid = (0, to_ipfs_url_1.pathToCid)(x);
                        }
                    })
                        .tap(v => logger_1.default.success(label, `done`, _dbEntry.id, db.name(), book.book_title, book.book_id, book.book_path))
                        .catch(logger_1.default.error);
                    _cacheTask.set(mfs_path, cid);
                    if ((index % 20) === 0) {
                        (0, deepEntryListMap_1.enableForceSave)();
                        (0, deepEntryListMap_1.enableOverwriteServer)();
                        await (0, deepEntryListMap_1._saveDeepEntryListMapToFile)();
                        await (0, saveMutableFileSystemRoots_1.saveMutableFileSystemRoots)(ipfs);
                        logger_1.default.debug(`delay`, '30s', _cacheTask.size);
                        await bluebird_1.default.delay(30 * 1000);
                    }
                    if (_cacheTask.size >= 200) {
                        let i = 0;
                        for (const [path, cid] of _cacheTask) {
                            let c2;
                            if (cid) {
                                c2 = (0, to_cid_1.toCID)(cid);
                            }
                            else if (deepEntryListMap_1.deepEntryListMap.has(path)) {
                                c2 = deepEntryListMap_1.deepEntryListMap.get(path);
                            }
                            else {
                                c2 = deepEntryListMap_1.deepEntryListMap.get(mfs_path) || await ipfs.files.stat(mfs_path, {
                                    hash: true,
                                }).then(m => m.cid).catch(e => null);
                            }
                            if (c2) {
                                await (0, it_all_1.default)(ipfs.block.rm((0, to_cid_1.toCID)(c2), {
                                    force: true,
                                }))
                                    .then(r => logger_1.default.debug(`ipfs.block.rm`, mfs_path, r))
                                    .catch(logger_1.default.error);
                                _cacheTask.delete(path);
                                i++;
                            }
                            if (i >= 100) {
                                await (0, it_all_1.default)(ipfs.repo.gc());
                                await ipfs.repo.stat().then(logger_1.default.log);
                                logger_1.default.yellow.debug(`delay`, '10s', _cacheTask.size);
                                await bluebird_1.default.delay(30 * 1000);
                                break;
                            }
                        }
                    }
                }
                else {
                    logger_1.default.gray.log(label, `skip`, _dbEntry.id, db.name(), book.book_title, book.book_id, book.book_path, stat);
                    (0, deepEntryListMap_1.appendDeepEntryListMap)(mfs_path, stat);
                    await (0, it_all_1.default)(ipfs.block.rm((0, to_cid_1.toCID)(stat), {
                        force: true,
                    }))
                        .then(r => logger_1.default.debug(`ipfs.block.rm`, mfs_path, r))
                        .catch(logger_1.default.error);
                }
            });
        });
    }
    (0, deepEntryListMap_1.enableForceSave)();
    (0, deepEntryListMap_1.enableOverwriteServer)();
    await (0, deepEntryListMap_1._saveDeepEntryListMapToFile)();
    (0, deepEntryListMap_1.enableForceSave)();
    (0, deepEntryListMap_1.enableOverwriteServer)();
    await (0, deepEntryListMap_1._saveDeepEntryListMapToServer)();
    (0, deepEntryListMap_1.enableForceSave)();
    await (0, deepEntryListMap_1._saveDeepEntryListMapToFile)();
    ipfs && await (0, saveMutableFileSystemRoots_1.saveMutableFileSystemRoots)(ipfs);
    return stop();
});
//# sourceMappingURL=calibre-import-all.js.map