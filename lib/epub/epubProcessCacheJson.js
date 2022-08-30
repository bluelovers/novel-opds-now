"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEpubProcessCacheJson = exports.deleteEpubProcessCacheJson = exports._doTask = void 0;
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const const_1 = require("../const");
const logger_1 = tslib_1.__importDefault(require("debug-color2/logger"));
const many_keys_map_1 = tslib_1.__importDefault(require("many-keys-map"));
const lodash_1 = require("lodash");
const mapEpubProcessCacheJson = new many_keys_map_1.default();
exports._doTask = (0, lodash_1.debounce)(async function () {
    if (mapEpubProcessCacheJson.size) {
        let _changed = false;
        let map = await (0, fs_extra_1.readJSON)(const_1.__cacheMapFile)
            .catch(e => logger_1.default.error(`readJSON`, const_1.__cacheMapFile, e));
        let now = Date.now();
        mapEpubProcessCacheJson.forEach((value, [IDKEY, novel_id]) => {
            var _a;
            if (!(value === null || value === void 0 ? void 0 : value.expire) || now > value.expire) {
                if (typeof ((_a = map === null || map === void 0 ? void 0 : map[IDKEY]) === null || _a === void 0 ? void 0 : _a[novel_id]) !== 'undefined') {
                    delete map[IDKEY][novel_id];
                    _changed = true;
                }
                mapEpubProcessCacheJson.delete([IDKEY, novel_id]);
            }
        });
        if (_changed) {
            await (0, fs_extra_1.writeJSON)(const_1.__cacheMapFile, map, { spaces: 2 }).catch(e => {
                logger_1.default.error(`發生錯誤，無法寫入緩存檔案 ${const_1.__cacheMapFile}`, String(e));
            });
        }
    }
}, 60 * 1000);
function deleteEpubProcessCacheJson(IDKEY, novel_id, _data) {
    _data !== null && _data !== void 0 ? _data : (_data = {});
    _data.expire = 0;
    [novel_id, _data === null || _data === void 0 ? void 0 : _data.novel_id2, _data === null || _data === void 0 ? void 0 : _data.novel_id].flat().forEach(novel_id => {
        novel_id && mapEpubProcessCacheJson.set([IDKEY, novel_id], _data);
    });
    (0, exports._doTask)();
}
exports.deleteEpubProcessCacheJson = deleteEpubProcessCacheJson;
async function getEpubProcessCacheJson(IDKEY, novel_id) {
    var _a, _b;
    let map = await (0, fs_extra_1.readJSON)(const_1.__cacheMapFile)
        .catch(e => logger_1.default.error(`readJSON`, const_1.__cacheMapFile, e));
    let value = (_b = (_a = map === null || map === void 0 ? void 0 : map[IDKEY]) === null || _a === void 0 ? void 0 : _a[novel_id]) !== null && _b !== void 0 ? _b : mapEpubProcessCacheJson.get([IDKEY, novel_id]);
    mapEpubProcessCacheJson.set([IDKEY, novel_id], value);
    (0, exports._doTask)();
    return value;
}
exports.getEpubProcessCacheJson = getEpubProcessCacheJson;
//# sourceMappingURL=epubProcessCacheJson.js.map