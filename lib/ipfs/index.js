"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putEpubFileInfo = exports.getEpubFileInfo = void 0;
const tslib_1 = require("tslib");
const index_1 = require("../util/index");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const fetch_1 = tslib_1.__importDefault(require("../fetch"));
const db_api_1 = require("@demonovel/db-api");
const util_1 = require("@demonovel/db-api/lib/util");
const logger_1 = tslib_1.__importDefault(require("debug-color2/logger"));
function getEpubFileInfo(_siteID, _novelID) {
    let { siteID, novelID } = (0, index_1.handleArgvList)(_siteID, _novelID);
    let timeout = 20 * 1000;
    return new bluebird_1.default((resolve, reject) => {
        let max = siteID.length * novelID.length;
        let i = 0;
        let idx = 0;
        function _resolve(e) {
            i++;
            if (e && e.error === false) {
                return resolve(e.data);
            }
            if (i >= max) {
                return reject(e);
            }
        }
        function _reject(e) {
            i++;
            if (i >= max) {
                return reject(e);
            }
        }
        siteID.forEach(siteID => {
            novelID.forEach(novelID => {
                let url = (0, util_1.newFileURL)(siteID, novelID);
                (0, fetch_1.default)(url.href, {
                    timeout,
                })
                    .then(v => v.json())
                    .then(_resolve)
                    .catch(_reject);
            });
        });
    })
        .timeout(timeout + 5 * 1000);
}
exports.getEpubFileInfo = getEpubFileInfo;
function putEpubFileInfo(siteID, novelID, data) {
    return (0, db_api_1.putFileRecord)({
        siteID,
        novelID,
        data,
    })
        .tapCatch(e => {
        logger_1.default.error(`putEpubFileInfo`, `上傳資料時發生錯誤`, e);
    });
}
exports.putEpubFileInfo = putEpubFileInfo;
//# sourceMappingURL=index.js.map