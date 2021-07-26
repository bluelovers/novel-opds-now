"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveDeepEntryListMapToMixin = exports.saveDeepEntryListMapToServer = exports.saveDeepEntryListMapToFile = exports._saveDeepEntryListMapToFile = exports.enableForceSave = exports._saveDeepEntryListMapToServer = exports.loadDeepEntryListMapFromMixin = exports.loadDeepEntryListMapFromServer = exports.loadDeepEntryListMapFromFile = exports.appendDeepEntryListMap = exports.appendDeepEntryListMapByStatResult = exports.newEntryListMap = exports.deepEntryListMap = void 0;
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const const_1 = require("../../const");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const lodash_1 = require("lodash");
const micromatch_1 = require("micromatch");
const db_api_1 = require("@demonovel/db-api");
exports.deepEntryListMap = new Map();
exports.newEntryListMap = new Map();
let _notOK = true;
const file = (0, path_1.join)(const_1.__root, 'test', 'novel-opds-now.cids.json');
function appendDeepEntryListMapByStatResult(path, entry) {
    return appendDeepEntryListMap(path, entry.cid, entry.type === 'directory');
}
exports.appendDeepEntryListMapByStatResult = appendDeepEntryListMapByStatResult;
function appendDeepEntryListMap(path, cid, isDirectory) {
    if (isDirectory && path[path.length - 1] !== '/') {
        path += '/';
    }
    if (path[0] !== '/') {
        path = '/' + path;
    }
    if (!/^\/novel-opds-now\//.test(path) || !cid || !isDirectory && (0, micromatch_1.isMatch)(path, ['*.{jpg,txt}', '**/*.{jpg,txt}'])) {
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
        map.forEach(([path, cid]) => {
            exports.deepEntryListMap.set(path, cid);
        });
    })
        .catchReturn(null)
        .thenReturn(exports.deepEntryListMap);
}
exports.loadDeepEntryListMapFromFile = loadDeepEntryListMapFromFile;
function loadDeepEntryListMapFromServer() {
    return (0, db_api_1.getRawRecord)({
        rootKey: 'ipfs',
        dataKey: 'deepEntryListMap',
        fetchOptions: {
            timeout: 10 * 1000,
        },
    })
        .tap((raw) => {
        var _a;
        (_a = raw.data) === null || _a === void 0 ? void 0 : _a.forEach(([path, cid]) => {
            exports.deepEntryListMap.set(path, cid);
        });
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
        .then(() => {
        if (exports.newEntryListMap.size) {
            _notOK = false;
            exports.newEntryListMap.forEach(([path, cid]) => {
                exports.deepEntryListMap.set(path, cid);
            });
            exports.newEntryListMap.clear();
            return (0, db_api_1.putRawRecord)({
                rootKey: 'ipfs',
                dataKey: 'deepEntryListMap',
                data: [...exports.deepEntryListMap, ...exports.newEntryListMap],
            });
        }
    })
        .thenReturn(exports.deepEntryListMap);
}
exports._saveDeepEntryListMapToServer = _saveDeepEntryListMapToServer;
function enableForceSave() {
    _notOK = false;
}
exports.enableForceSave = enableForceSave;
async function _saveDeepEntryListMapToFile() {
    if (_notOK === true && !exports.newEntryListMap.size) {
        return;
    }
    _notOK = true;
    return (0, fs_extra_1.outputJSON)(file, [...exports.deepEntryListMap, ...exports.newEntryListMap], {
        spaces: 2,
    }).catch(e => null);
}
exports._saveDeepEntryListMapToFile = _saveDeepEntryListMapToFile;
exports.saveDeepEntryListMapToFile = (0, lodash_1.debounce)(_saveDeepEntryListMapToFile, 30 * 60 * 1000);
exports.saveDeepEntryListMapToServer = (0, lodash_1.debounce)(_saveDeepEntryListMapToServer, 20 * 60 * 1000);
function saveDeepEntryListMapToMixin() {
    return bluebird_1.default.all([
        exports.saveDeepEntryListMapToFile,
        exports.saveDeepEntryListMapToServer,
    ]);
}
exports.saveDeepEntryListMapToMixin = saveDeepEntryListMapToMixin;
//# sourceMappingURL=deepEntryListMap.js.map