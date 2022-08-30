"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readEpubProcessCache = exports.saveEpubProcessCache = exports._saveEpubProcessCache = exports.appendEpubProcessCache = exports._merge = exports.replaceEpubProcessCacheRow = exports.removeEpubProcessCacheRow = exports.getEpubProcessCacheRow = exports.epubProcessCacheKey = exports.epubProcessCache = exports.__epubProcessCacheFile = void 0;
const tslib_1 = require("tslib");
const path_1 = require("path");
const const_1 = require("../const");
const fs_extra_1 = require("fs-extra");
const ndjson_1 = require("ndjson");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const streamToPromise_1 = require("../util/streamToPromise");
const lodash_1 = require("lodash");
const logger_1 = tslib_1.__importDefault(require("debug-color2/logger"));
exports.__epubProcessCacheFile = (0, path_1.join)(const_1.OUTPUT_DIR, '.novel-cache-map.ndjson');
exports.epubProcessCache = new Map();
function epubProcessCacheKey(IDKEY, novel_id) {
    if (IDKEY !== null && typeof IDKEY === 'object') {
        return `${IDKEY.siteID}##${IDKEY.novel_id}`;
    }
    return `${IDKEY}##${novel_id}`;
}
exports.epubProcessCacheKey = epubProcessCacheKey;
function getEpubProcessCacheRow(...argv) {
    return exports.epubProcessCache.get(epubProcessCacheKey(...argv));
}
exports.getEpubProcessCacheRow = getEpubProcessCacheRow;
function removeEpubProcessCacheRow(...argv) {
    return exports.epubProcessCache.delete(epubProcessCacheKey(...argv));
}
exports.removeEpubProcessCacheRow = removeEpubProcessCacheRow;
function replaceEpubProcessCacheRow(IDKEY, novel_id, data) {
    return exports.epubProcessCache.set(epubProcessCacheKey(...argv), _merge(IDKEY, novel_id, data));
}
exports.replaceEpubProcessCacheRow = replaceEpubProcessCacheRow;
function _merge(IDKEY, novel_id, data) {
    data = {
        siteID: IDKEY,
        novel_id,
        ...data,
    };
    data.siteID = IDKEY;
    data.novel_id = novel_id;
    return data;
}
exports._merge = _merge;
exports.appendEpubProcessCache = bluebird_1.default.method((IDKEY, novel_id, data) => {
    data = _merge(IDKEY, novel_id, data);
    data.timestamp = Date.now();
    let line = JSON.stringify(data);
    return (0, fs_extra_1.appendFile)(exports.__epubProcessCacheFile, line + '\n');
});
function _saveEpubProcessCache() {
    return bluebird_1.default.resolve((0, fs_extra_1.truncate)(exports.__epubProcessCacheFile))
        .catchReturn(null)
        .then(() => {
        const stream = (0, ndjson_1.stringify)();
        stream.pipe((0, fs_extra_1.createWriteStream)(exports.__epubProcessCacheFile, {
            flags: 'a',
        }));
        for (const data of exports.epubProcessCache.values()) {
            stream.write(data);
        }
        stream.end();
        return (0, streamToPromise_1.streamToPromise)(stream).tap(() => exports.epubProcessCache.clear());
    })
        .catch(e => {
        logger_1.default.error(`發生錯誤，無法寫入緩存檔案 ${exports.__epubProcessCacheFile}`, String(e));
    });
}
exports._saveEpubProcessCache = _saveEpubProcessCache;
exports.saveEpubProcessCache = (0, lodash_1.debounce)(_saveEpubProcessCache, 10 * 60 * 1000);
function readEpubProcessCache() {
    return (0, streamToPromise_1.streamToPromise)((0, fs_extra_1.createReadStream)(exports.__epubProcessCacheFile)
        .pipe((0, ndjson_1.parse)())
        .on('data', (data) => {
        const key = epubProcessCacheKey(data);
        exports.epubProcessCache.set(key, _merge(data.siteID, data.novel_id, {
            ...exports.epubProcessCache.get(key),
            ...data,
        }));
    }))
        .thenReturn(exports.epubProcessCache);
}
exports.readEpubProcessCache = readEpubProcessCache;
//# sourceMappingURL=epubProcessCache.js.map