"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixDeepEntryListMap = exports.mergeDeepEntryListMap = exports.saveDeepEntryListMapToMixin = exports.saveDeepEntryListMapToServer = exports.saveDeepEntryListMapToFile = exports._saveDeepEntryListMapToFile = exports.enableOverwriteServer = exports.enableForceSave = exports._saveDeepEntryListMapToServer = exports.loadDeepEntryListMapFromMixin = exports.loadDeepEntryListMapFromServer = exports.loadDeepEntryListMapFromFile = exports.appendDeepEntryListMap = exports.appendDeepEntryListMapByStatResult = exports.pathDeepEntryListMapJson = exports.newEntryListMap = exports.deepEntryListMap = void 0;
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const const_1 = require("../../const");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const lodash_1 = require("lodash");
const micromatch_1 = require("micromatch");
const db_api_1 = require("@demonovel/db-api");
const put_1 = require("fetch-ipfs/put");
const ipfs_server_list_1 = require("ipfs-server-list");
const use_1 = require("../use");
const to_ipfs_url_1 = require("to-ipfs-url");
const pokeAll_1 = require("../pokeAll");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const admin_1 = require("../../dev/admin");
const raceFetchServerList_1 = require("../../util/raceFetchServerList");
exports.deepEntryListMap = new Map();
exports.newEntryListMap = new Map();
let _notOK = true;
let _overwriteServer = false;
const filename = 'novel-opds-now.cids.json';
const file = (0, path_1.join)(const_1.__root, 'test', 'data', filename);
const rootKey = 'ipfs';
const dataKey = 'deepEntryListMap';
function pathDeepEntryListMapJson() {
    return `/novel-opds-now/${filename}`;
}
exports.pathDeepEntryListMapJson = pathDeepEntryListMapJson;
function appendDeepEntryListMapByStatResult(path, entry) {
    return appendDeepEntryListMap(path, entry.cid, entry.type === 'directory');
}
exports.appendDeepEntryListMapByStatResult = appendDeepEntryListMapByStatResult;
function appendDeepEntryListMap(path, cid, isDirectory, forceAdd) {
    if (isDirectory && path[path.length - 1] !== '/') {
        path += '/';
    }
    if (path[0] !== '/') {
        path = '/' + path;
    }
    if (forceAdd) {
    }
    else if (!/^\/novel-opds-now\//.test(path) || !cid || !isDirectory && (0, micromatch_1.isMatch)(path, ['*.{jpg,txt}', '**/*.{jpg,txt}'])) {
        return false;
    }
    cid = cid.toString();
    if (exports.deepEntryListMap.get(path) !== cid && exports.newEntryListMap.get(path) !== cid) {
        exports.newEntryListMap.set(path, cid);
        (0, exports.saveDeepEntryListMapToFile)();
    }
    return true;
}
exports.appendDeepEntryListMap = appendDeepEntryListMap;
function loadDeepEntryListMapFromFile() {
    return bluebird_1.default.resolve((0, fs_extra_1.readJSON)(file))
        .then((map) => {
        mergeDeepEntryListMap(map, exports.deepEntryListMap);
    })
        .catchReturn(null)
        .thenReturn(exports.deepEntryListMap);
}
exports.loadDeepEntryListMapFromFile = loadDeepEntryListMapFromFile;
function loadDeepEntryListMapFromServer() {
    return (0, db_api_1.getFileRecord)({
        siteID: rootKey,
        novelID: dataKey,
        fetchOptions: {
            timeout: 20 * 1000,
        },
    })
        .then(async (raw) => {
        return (0, raceFetchServerList_1.raceFetchAll)((0, raceFetchServerList_1.raceFetchServerList)(null, raw.data.href), 60 * 1000)
            .then(buf => JSON.parse(String(buf)))
            .tap(row => {
            if (!row.length) {
                const e = new TypeError(`deepEntryListMap data is broken`);
                e.data = row;
                return Promise.reject(e);
            }
        });
    })
        .tap((map) => {
        let tmp = new Map();
        mergeDeepEntryListMap(map, tmp);
        mergeDeepEntryListMap(fixDeepEntryListMap(tmp), exports.deepEntryListMap, _overwriteServer);
        fixDeepEntryListMap(exports.deepEntryListMap);
    })
        .tapCatch(e => {
        logger_1.default.error(`loadDeepEntryListMapFromServer`, e);
    })
        .catchReturn(null)
        .thenReturn(exports.deepEntryListMap);
}
exports.loadDeepEntryListMapFromServer = loadDeepEntryListMapFromServer;
function loadDeepEntryListMapFromMixin() {
    return loadDeepEntryListMapFromFile()
        .then(loadDeepEntryListMapFromServer)
        .thenReturn(exports.deepEntryListMap);
}
exports.loadDeepEntryListMapFromMixin = loadDeepEntryListMapFromMixin;
function _saveDeepEntryListMapToServer() {
    return loadDeepEntryListMapFromServer()
        .then(async () => {
        if (_notOK === false || exports.newEntryListMap.size || _overwriteServer) {
            _notOK = false;
            await mergeDeepEntryListMap(exports.newEntryListMap, exports.deepEntryListMap);
            if (!exports.deepEntryListMap.size) {
                return;
            }
            exports.newEntryListMap.clear();
            const ipfs = await (0, use_1.getIPFSFromCache)();
            const peerID = await (ipfs === null || ipfs === void 0 ? void 0 : ipfs.id().then(m => m.id).catchReturn(null));
            if (ipfs && (0, admin_1.ipfsMainPeerID)(peerID)) {
                let stat = await ipfs.files.stat(`/novel-opds-now/`, {
                    hash: true,
                }).catch(e => null);
                if (stat === null || stat === void 0 ? void 0 : stat.cid) {
                    await appendDeepEntryListMap(`/novel-opds-now/`, stat.cid, true);
                    await mergeDeepEntryListMap(exports.newEntryListMap, exports.deepEntryListMap);
                }
            }
            const content = JSON.stringify([...exports.deepEntryListMap], null, 2);
            let cid;
            await (0, put_1.publishToIPFSRace)({
                path: filename,
                content,
            }, [
                ipfs,
                ...(0, ipfs_server_list_1.filterList)('API'),
            ], {
                addOptions: {
                    pin: true,
                },
                timeout: 60 * 1000,
            })
                .each((settledResult, index) => {
                var _a, _b;
                let value = (_a = settledResult.value) !== null && _a !== void 0 ? _a : (_b = settledResult.reason) === null || _b === void 0 ? void 0 : _b.value;
                if (value === null || value === void 0 ? void 0 : value.length) {
                    const { status } = settledResult;
                    value.forEach((result, i) => {
                        cid = result.cid.toString();
                    });
                }
            });
            (0, pokeAll_1.pokeAll)(cid, ipfs, {
                filename,
                timeout: 10 * 1000,
            }).then(settledResults => {
                var _a, _b;
                if (settledResults === null || settledResults === void 0 ? void 0 : settledResults.length) {
                    let list = (0, pokeAll_1.filterPokeAllSettledResult)(settledResults);
                    logger_1.default.info(`[IPFS]`, `pokeAll:end`, `結束於 ${list.length} ／ ${settledResults.length} 節點中請求分流`, dataKey, (_b = (_a = list[list.length - 1]) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.href);
                }
            });
            if (ipfs) {
                await ipfs.files.write(pathDeepEntryListMapJson(), content, {
                    timeout: 10 * 1000,
                    create: true,
                    parents: true,
                }).catch((e) => logger_1.default.warn(`_saveDeepEntryListMapToServer`, `ipfs.files.write`, e));
                if ((0, admin_1.ipfsMainPeerID)(peerID)) {
                    let stat = await ipfs.files.stat(`/novel-opds-now/`, {
                        hash: true,
                    }).catch(e => null);
                    if (stat === null || stat === void 0 ? void 0 : stat.cid) {
                        await appendDeepEntryListMap(`/novel-opds-now/`, stat.cid, true);
                    }
                }
            }
            await appendDeepEntryListMap(pathDeepEntryListMapJson(), cid, false, true);
            return (0, db_api_1.putFileRecord)({
                siteID: rootKey,
                novelID: dataKey,
                data: {
                    timestamp: Date.now(),
                    exists: true,
                    filename,
                    href: (0, to_ipfs_url_1.toLink)(cid),
                },
            })
                .tap(v => {
                var _a, _b;
                if (!v.error && ((_a = v === null || v === void 0 ? void 0 : v.data) === null || _a === void 0 ? void 0 : _a.href)) {
                    _overwriteServer = false;
                }
                logger_1.default.debug(`_saveDeepEntryListMapToServer`, v.timestamp, v.error, (_b = v === null || v === void 0 ? void 0 : v.data) === null || _b === void 0 ? void 0 : _b.href);
            });
        }
    })
        .tapCatch(e => logger_1.default.error(`_saveDeepEntryListMapToServer`, e))
        .catchReturn(null)
        .thenReturn(exports.deepEntryListMap);
}
exports._saveDeepEntryListMapToServer = _saveDeepEntryListMapToServer;
function enableForceSave() {
    _notOK = false;
}
exports.enableForceSave = enableForceSave;
function enableOverwriteServer() {
    _overwriteServer = true;
}
exports.enableOverwriteServer = enableOverwriteServer;
function _saveDeepEntryListMapToFile() {
    return bluebird_1.default.resolve()
        .then(() => {
        if (_notOK === true && !exports.newEntryListMap.size) {
            return;
        }
        _notOK = true;
        let ls = new Map([...exports.deepEntryListMap, ...exports.newEntryListMap]);
        if (!ls.size) {
            return;
        }
        (0, fs_extra_1.outputJSONSync)(file, [...ls], {
            spaces: 2,
        });
        logger_1.default.debug(`_saveDeepEntryListMapToFile`, ls.size);
    })
        .catchReturn(null)
        .thenReturn(exports.deepEntryListMap);
}
exports._saveDeepEntryListMapToFile = _saveDeepEntryListMapToFile;
exports.saveDeepEntryListMapToFile = (0, lodash_1.debounce)(_saveDeepEntryListMapToFile, 30 * 60 * 1000);
exports.saveDeepEntryListMapToServer = (0, lodash_1.debounce)(_saveDeepEntryListMapToServer, 20 * 60 * 1000);
function saveDeepEntryListMapToMixin() {
    return bluebird_1.default.mapSeries([
        exports.saveDeepEntryListMapToServer,
        exports.saveDeepEntryListMapToFile,
    ], (r) => r).thenReturn(exports.deepEntryListMap);
}
exports.saveDeepEntryListMapToMixin = saveDeepEntryListMapToMixin;
function mergeDeepEntryListMap(input, target, keepExists) {
    var _a;
    if (input) {
        if (keepExists) {
            for (const [path, cid] of (Array.isArray(input) ? input.values() : input.entries())) {
                if ((_a = target.get(path)) === null || _a === void 0 ? void 0 : _a.length) {
                    continue;
                }
                target.set(path, cid);
            }
        }
        else {
            for (const [path, cid] of (Array.isArray(input) ? input.values() : input.entries())) {
                target.set(path, cid);
            }
        }
    }
    return target;
}
exports.mergeDeepEntryListMap = mergeDeepEntryListMap;
function fixDeepEntryListMap(deepEntryListMap) {
    deepEntryListMap.forEach((value, key, map) => {
        if (value.includes('novel-opds-now')) {
            deepEntryListMap.set(value, key);
            deepEntryListMap.delete(key);
            logger_1.default.warn(`fixDeepEntryListMap`, value);
        }
    });
    return deepEntryListMap;
}
exports.fixDeepEntryListMap = fixDeepEntryListMap;
//# sourceMappingURL=deepEntryListMap.js.map