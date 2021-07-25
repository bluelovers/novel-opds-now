"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveDeepEntryListMapToFile = exports._saveDeepEntryListMapToFile = exports.loadDeepEntryListMapFromFile = exports.appendDeepEntryListMap = exports.appendDeepEntryListMapByStatResult = exports.deepEntryListMap = void 0;
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const const_1 = require("../../const");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const lodash_1 = require("lodash");
const processExit_1 = (0, tslib_1.__importDefault)(require("../../util/processExit"));
const micromatch_1 = require("micromatch");
exports.deepEntryListMap = new Map();
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
    if (exports.deepEntryListMap.get(path) !== cid) {
        exports.deepEntryListMap.set(path, cid);
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
function _saveDeepEntryListMapToFile() {
    return (0, fs_extra_1.outputJSON)(file, [...exports.deepEntryListMap], {
        spaces: 2,
    }).catch(e => null);
}
exports._saveDeepEntryListMapToFile = _saveDeepEntryListMapToFile;
exports.saveDeepEntryListMapToFile = (0, lodash_1.debounce)(_saveDeepEntryListMapToFile, 30 * 60 * 1000);
(0, processExit_1.default)(_saveDeepEntryListMapToFile);
//# sourceMappingURL=deepEntryListMap.js.map