"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._doPackEpubFromSource = exports.doPackEpubFromSource = void 0;
const tslib_1 = require("tslib");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const cross_spawn_extra_1 = require("cross-spawn-extra");
const path_1 = require("path");
const __root_1 = (0, tslib_1.__importDefault)(require("./__root"));
const util_1 = require("@demonovel/db-api/lib/util");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const getNovelData_1 = require("./site/cached-data/getNovelData");
const _catch = new Map();
function doPackEpubFromSource(siteID, novelID) {
    let key = (0, util_1.newFileURL)(siteID, novelID).pathname;
    return bluebird_1.default.resolve((0, getNovelData_1.getNovelData)(siteID, novelID))
        .then(novelData => {
        return bluebird_1.default.resolve().then(async () => {
            if (_catch.has(key)) {
                let p = _catch.get(key);
                if (p.isPending()) {
                    logger_1.default.warn(`此小說的打包任務仍在執行中，請稍後再請求檔案...`, siteID, novelID, novelData === null || novelData === void 0 ? void 0 : novelData.title);
                    return p;
                }
                else if (p.isFulfilled()) {
                    return p;
                }
                await p.catch(e => logger_1.default.warn(`上次的打包任務失敗...`, siteID, novelID, novelData === null || novelData === void 0 ? void 0 : novelData.title, e));
            }
            let p = _doPackEpubFromSource(siteID, novelID);
            _catch.set(key, p);
            return p;
        })
            .tapCatch(e => {
            logger_1.default.error(`打包時發生錯誤...`, siteID, novelID, novelData === null || novelData === void 0 ? void 0 : novelData.title, e);
        })
            .finally(() => _catch.delete(key));
    });
}
exports.doPackEpubFromSource = doPackEpubFromSource;
function _doPackEpubFromSource(siteID, novelID) {
    return bluebird_1.default.resolve((0, getNovelData_1.getNovelData)(siteID, novelID))
        .tap(novelData => {
        logger_1.default.yellow.info(`從原始來源網站抓取打包小說中...`, siteID, novelID, novelData === null || novelData === void 0 ? void 0 : novelData.title);
    })
        .thenReturn((0, cross_spawn_extra_1.async)('node', [
        '--experimental-worker',
        (0, path_1.join)(__root_1.default, `./cli/cli.js`),
        '--mod',
        'all',
        '--siteID',
        siteID,
        '--novel_id',
        novelID,
    ], {
        stdio: 'inherit',
    }))
        .tap(cp => {
        if (cp.error) {
            return Promise.reject(cp.error);
        }
    });
}
exports._doPackEpubFromSource = _doPackEpubFromSource;
//# sourceMappingURL=doPackEpubFromSource.js.map