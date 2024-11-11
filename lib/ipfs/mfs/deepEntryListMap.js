"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveDeepEntryListMapToServer = exports.saveDeepEntryListMapToFile = exports.pokeDeepEntryListMap = exports.newEntryListMap = exports.deepEntryListMap = void 0;
exports.pathDeepEntryListMapJson = pathDeepEntryListMapJson;
exports.appendDeepEntryListMapByStatResult = appendDeepEntryListMapByStatResult;
exports._handlePath = _handlePath;
exports.appendDeepEntryListMap = appendDeepEntryListMap;
exports._setDeepEntryListMapBoth = _setDeepEntryListMapBoth;
exports._getDeepEntryListMapBoth = _getDeepEntryListMapBoth;
exports.loadDeepEntryListMapFromFile = loadDeepEntryListMapFromFile;
exports.loadDeepEntryListMapFromServer = loadDeepEntryListMapFromServer;
exports.loadDeepEntryListMapFromMixin = loadDeepEntryListMapFromMixin;
exports._saveDeepEntryListMapToServer = _saveDeepEntryListMapToServer;
exports.enableForceSave = enableForceSave;
exports.enableOverwriteServer = enableOverwriteServer;
exports._writeDeepEntryListMapToMfs = _writeDeepEntryListMapToMfs;
exports._backupDeepEntryListMap = _backupDeepEntryListMap;
exports._pokeDeepEntryListMap = _pokeDeepEntryListMap;
exports.stringifyDeepEntryListMap = stringifyDeepEntryListMap;
exports._saveDeepEntryListMapToFile = _saveDeepEntryListMapToFile;
exports.saveDeepEntryListMapToMixin = saveDeepEntryListMapToMixin;
exports.mergeDeepEntryListMap = mergeDeepEntryListMap;
exports.fixDeepEntryListMap = fixDeepEntryListMap;
exports._publishDeepEntryListMapToIPFS = _publishDeepEntryListMapToIPFS;
exports._putDeepEntryListMapToServer = _putDeepEntryListMapToServer;
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const const_1 = require("../../const");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const lodash_1 = require("lodash");
const micromatch_1 = require("micromatch");
const db_api_1 = require("@demonovel/db-api");
const put_1 = require("fetch-ipfs/put");
const ipfs_server_list_1 = require("ipfs-server-list");
const use_1 = require("../use");
const to_ipfs_url_1 = require("to-ipfs-url");
const pokeAll_1 = require("../pokeAll");
const logger_1 = tslib_1.__importDefault(require("debug-color2/logger"));
const admin_1 = require("../../dev/admin");
const raceFetchServerList_1 = require("../../util/raceFetchServerList");
const cid_to_string_1 = require("@lazy-ipfs/cid-to-string");
const is_same_cid_1 = require("@lazy-ipfs/is-same-cid");
const _ipfsFilesCopy_1 = require("./_ipfsFilesCopy");
const to_cid_1 = require("@lazy-ipfs/to-cid");
const filterPokeAllSettledResult_1 = require("poke-ipfs/lib/util/filterPokeAllSettledResult");
const array_hyper_unique_1 = require("array-hyper-unique");
const bluebird_allsettled_1 = require("bluebird-allsettled");
exports.deepEntryListMap = new Map();
exports.newEntryListMap = new Map();
let _notOK = true;
let _overwriteServer = false;
const filename = 'novel-opds-now.cids.json';
const file = (0, path_1.join)(const_1.__root, 'test', 'data', filename);
const msf_file = `/.cache/${filename}`;
const rootKey = 'ipfs';
const dataKey = 'deepEntryListMap';
function pathDeepEntryListMapJson() {
    return msf_file;
}
function appendDeepEntryListMapByStatResult(path, entry) {
    return appendDeepEntryListMap(path, entry.cid, entry.type === 'directory');
}
function _handlePath(path, isDirectory) {
    if (isDirectory && path[path.length - 1] !== '/') {
        path += '/';
    }
    if (path[0] !== '/') {
        path = '/' + path;
    }
    return path;
}
function appendDeepEntryListMap(path, cid, isDirectory, forceAdd) {
    path = _handlePath(path, isDirectory);
    if (forceAdd || /^\/\.cache\//.test(path)) {
    }
    else if (!/^\/novel-opds-now\//.test(path) || !cid || !isDirectory && (0, micromatch_1.isMatch)(path, [
        '*.{jpg,txt}',
        '**/*.{jpg,txt}',
    ])) {
        return false;
    }
    cid = cid.toString();
    if (exports.deepEntryListMap.get(path) !== cid && exports.newEntryListMap.get(path) !== cid) {
        _setDeepEntryListMapBoth(path, cid);
        (0, exports.saveDeepEntryListMapToFile)();
    }
    return true;
}
function _setDeepEntryListMapBoth(path, cid, isDirectory) {
    path = _handlePath(path, isDirectory);
    cid = cid.toString();
    exports.newEntryListMap.set(path, cid);
    exports.deepEntryListMap.set(path, cid);
}
function _getDeepEntryListMapBoth(path, isDirectory) {
    path = _handlePath(path, isDirectory);
    return exports.newEntryListMap.get(path) || exports.deepEntryListMap.get(path);
}
function loadDeepEntryListMapFromFile() {
    return bluebird_1.default.resolve((0, fs_extra_1.readJSON)(file))
        .then((map) => {
        mergeDeepEntryListMap(map, exports.deepEntryListMap);
    })
        .catchReturn(null)
        .thenReturn(exports.deepEntryListMap);
}
function loadDeepEntryListMapFromServer() {
    return (0, db_api_1.getFileRecord)({
        siteID: rootKey,
        novelID: dataKey,
        fetchOptions: {
            timeout: 20 * 1000,
        },
    })
        .then(async (raw) => {
        let servers = await (0, raceFetchServerList_1.raceFetchServerList)(null, raw.data.href);
        return (0, raceFetchServerList_1.raceFetchAll)(servers, 60 * 1000, {
            filter(buf) {
                if (buf === null || buf === void 0 ? void 0 : buf.length) {
                    let r = JSON.parse(String(buf));
                    return r.length && Array.isArray(r);
                }
                return false;
            },
        })
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
function loadDeepEntryListMapFromMixin() {
    return loadDeepEntryListMapFromFile()
        .then(loadDeepEntryListMapFromServer)
        .thenReturn(exports.deepEntryListMap);
}
function _saveDeepEntryListMapToServer() {
    return loadDeepEntryListMapFromServer()
        .then(async () => {
        if (_notOK === false || exports.newEntryListMap.size || _overwriteServer) {
            _notOK = false;
            await mergeDeepEntryListMap(exports.newEntryListMap, exports.deepEntryListMap);
            if (!exports.deepEntryListMap.size) {
                return;
            }
            const ipfs = await (0, use_1.getIPFSFromCache)();
            const peerID = await (ipfs === null || ipfs === void 0 ? void 0 : ipfs.id().then(m => m.id).catch(e => null));
            if (ipfs && (0, admin_1.ipfsMainPeerID)(peerID)) {
                let stat = await ipfs.files.stat(`/novel-opds-now/`, {
                    hash: true,
                }).catch(e => null);
                if (stat === null || stat === void 0 ? void 0 : stat.cid) {
                    await _setDeepEntryListMapBoth(`/novel-opds-now/`, stat.cid, true);
                    await mergeDeepEntryListMap(exports.newEntryListMap, exports.deepEntryListMap);
                    (0, pokeAll_1.pokeAll)((0, cid_to_string_1.cidToString)(stat.cid), ipfs, {
                        filename,
                        hidden: true,
                        timeout: 20 * 1000,
                    });
                }
            }
            let { cid, content } = await _publishDeepEntryListMapToIPFS(ipfs, exports.deepEntryListMap);
            (0, exports.pokeDeepEntryListMap)(cid, peerID);
            if (ipfs) {
                if ((0, admin_1.ipfsMainPeerID)(peerID)) {
                    let stat = await ipfs.files.stat(`/novel-opds-now/`, {
                        hash: true,
                    }).catch(e => null);
                    if (stat === null || stat === void 0 ? void 0 : stat.cid) {
                        await _setDeepEntryListMapBoth(`/novel-opds-now/`, stat.cid, true);
                        (0, pokeAll_1.pokeAll)((0, cid_to_string_1.cidToString)(stat.cid), ipfs, {
                            filename,
                            hidden: true,
                            timeout: 20 * 1000,
                        });
                    }
                }
                await _writeDeepEntryListMapToMfs(content);
            }
            await _backupDeepEntryListMap(cid, peerID);
            _setDeepEntryListMapBoth(pathDeepEntryListMapJson(), cid);
            return _putDeepEntryListMapToServer(ipfs, cid)
                .tap(v => {
                var _a, _b;
                if (!v.error && ((_a = v === null || v === void 0 ? void 0 : v.data) === null || _a === void 0 ? void 0 : _a.href)) {
                    _overwriteServer = false;
                }
                logger_1.default.debug(`_saveDeepEntryListMapToServer`, v.timestamp, v.error, '\n' + ((_b = v === null || v === void 0 ? void 0 : v.data) === null || _b === void 0 ? void 0 : _b.href));
            });
        }
    })
        .tapCatch(e => logger_1.default.error(`_saveDeepEntryListMapToServer`, e))
        .catchReturn(null)
        .thenReturn(exports.deepEntryListMap);
}
function enableForceSave() {
    _notOK = false;
}
function enableOverwriteServer() {
    _overwriteServer = true;
}
function _writeDeepEntryListMapToMfs(content) {
    return (0, use_1.getIPFSFromCache)().then(ipfs => {
        if (!ipfs) {
            return null;
        }
        if (typeof content !== 'string') {
            content = stringifyDeepEntryListMap(content);
        }
        return ipfs.files.write(pathDeepEntryListMapJson(), content, {
            timeout: 10 * 1000,
            parents: true,
            create: true,
        })
            .then(async () => {
            let cid = await ipfs.files.stat(pathDeepEntryListMapJson(), {
                hash: true,
                timeout: 3000,
            }).then(m => m.cid);
            return _backupDeepEntryListMap(cid, await (0, use_1.useIPFSFromCache)().then(m => { var _a, _b; return (_b = (_a = m === null || m === void 0 ? void 0 : m.ipfs) === null || _a === void 0 ? void 0 : _a.peerId) === null || _b === void 0 ? void 0 : _b.id; }));
        });
    })
        .catch(e => logger_1.default.error(`_writeDeepEntryListMapToMfs`, e));
}
async function _backupDeepEntryListMap(cid, peerID) {
    if (1) {
        return;
    }
    const ipfs = await (0, use_1.getIPFSFromCache)();
    const timeout = 10 * 1000;
    if (typeof peerID === 'undefined') {
        peerID = await (ipfs === null || ipfs === void 0 ? void 0 : ipfs.id({ timeout }).then(m => m.id).catch(e => null));
    }
    if ((0, admin_1.ipfsMainPeerID)(peerID)) {
        let old_cid = _getDeepEntryListMapBoth(pathDeepEntryListMapJson());
        if ((old_cid || cid) && !(0, is_same_cid_1.isSameCID)(old_cid, cid)) {
            let bak = pathDeepEntryListMapJson() + '.bak';
            let bak_cid = old_cid !== null && old_cid !== void 0 ? old_cid : cid;
            await (0, _ipfsFilesCopy_1._ipfsFilesCopyCID)(ipfs, bak_cid, bak, {
                timeout,
                extraOptions: {
                    overwrite: true,
                },
            }).catch(e => null);
            _setDeepEntryListMapBoth(bak, bak_cid);
        }
        await ipfs.files.stat('/.cache', {
            hash: true,
            timeout,
        }).then(m => {
            _setDeepEntryListMapBoth('/.cache', m.cid, true);
        })
            .catch(e => null);
        _setDeepEntryListMapBoth(pathDeepEntryListMapJson(), cid);
    }
}
function _pokeDeepEntryListMap(cid, peerID) {
    return bluebird_1.default.resolve()
        .then(async () => {
        const ipfs = await (0, use_1.getIPFSFromCache)();
        const timeout = 10 * 1000;
        if (typeof peerID === 'undefined') {
            peerID = await (ipfs === null || ipfs === void 0 ? void 0 : ipfs.id({ timeout }).then(m => m.id).catch(e => null));
        }
        cid = cid || await ipfs.files.stat(pathDeepEntryListMapJson(), {
            hash: true,
            timeout,
        }).then(m => m.cid);
        if (!cid) {
            return;
        }
        await _backupDeepEntryListMap(cid, peerID);
        let ls = await bluebird_1.default
            .map([
            pathDeepEntryListMapJson(),
            pathDeepEntryListMapJson() + '.bak',
            '/.cache/',
        ], file => {
            return ipfs.files.stat(pathDeepEntryListMapJson(), {
                hash: true,
                timeout,
            }).then(m => m.cid).catch(e => null);
        })
            .tap(ls => {
            ls.unshift((0, to_cid_1.toCID)(cid));
        });
        (0, array_hyper_unique_1.array_unique_overwrite)(ls);
        return (0, bluebird_allsettled_1.allSettled)(ls.map((cid, index) => {
            let p = (0, pokeAll_1.pokeAll)(cid, ipfs, {
                timeout: 20 * 1000,
                hidden: true,
            });
            if (index === 0) {
                p = p.tap(settledResults => {
                    let list = (0, filterPokeAllSettledResult_1.getPokeAllSettledResultWithHref)(settledResults !== null && settledResults !== void 0 ? settledResults : []);
                    if (list === null || list === void 0 ? void 0 : list.length) {
                        logger_1.default.info(`[IPFS]`, `pokeAll:end`, `結束於 ${list.length} ／ ${settledResults.length} 節點中請求分流`, dataKey, '\n' + list[list.length - 1]);
                    }
                });
            }
            return p;
        }));
    })
        .catch(e => {
        logger_1.default.warn(`_pokeDeepEntryListMap`, cid, String(e));
    });
}
exports.pokeDeepEntryListMap = (0, lodash_1.debounce)(_pokeDeepEntryListMap, 30 * 1000);
function stringifyDeepEntryListMap(deepEntryListMap) {
    let ls = [...new Map([...deepEntryListMap])];
    return JSON.stringify((0, lodash_1.sortBy)(ls, '0'), null, 2);
}
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
        const content = stringifyDeepEntryListMap(ls);
        (0, fs_extra_1.outputFileSync)(file, content);
        logger_1.default.debug(`_saveDeepEntryListMapToFile`, ls.size);
        return _writeDeepEntryListMapToMfs(content);
    })
        .catchReturn(null)
        .thenReturn(exports.deepEntryListMap)
        .finally(() => {
        (0, exports.pokeDeepEntryListMap)();
    });
}
exports.saveDeepEntryListMapToFile = (0, lodash_1.debounce)(_saveDeepEntryListMapToFile, 10 * 60 * 1000);
exports.saveDeepEntryListMapToServer = (0, lodash_1.debounce)(_saveDeepEntryListMapToServer, 5 * 60 * 1000);
function saveDeepEntryListMapToMixin() {
    return bluebird_1.default.mapSeries([
        exports.saveDeepEntryListMapToServer,
        exports.saveDeepEntryListMapToFile,
    ], (r) => r).thenReturn(exports.deepEntryListMap);
}
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
async function _publishDeepEntryListMapToIPFS(ipfs, deepEntryListMap) {
    let cid;
    const content = stringifyDeepEntryListMap(deepEntryListMap);
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
    return {
        cid,
        content,
    };
}
function _putDeepEntryListMapToServer(ipfs, cid) {
    return (0, db_api_1.putFileRecord)({
        siteID: rootKey,
        novelID: dataKey,
        data: {
            timestamp: Date.now(),
            exists: true,
            filename,
            href: (0, to_ipfs_url_1.toLink)(cid),
        },
    });
}
//# sourceMappingURL=deepEntryListMap.js.map