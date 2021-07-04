"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putGunEpubFile = exports.getGunEpubFile2 = exports.getGunEpubFile = void 0;
const tslib_1 = require("tslib");
const epubFile_1 = require("../gun/epubFile");
const index_1 = require("../util/index");
const checkData_1 = (0, tslib_1.__importDefault)(require("../gun/checkData"));
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const bluebird_1 = require("bluebird");
function getGunEpubFile(_siteID, _novelID, options) {
    let { query = {} } = options || {};
    let { siteID, novelID } = (0, index_1.handleArgvList)(_siteID, _novelID);
    return (0, epubFile_1.raceGunEpubFile)(siteID, novelID)
        .then(async (data) => {
        let bool = (0, checkData_1.default)(data);
        if (!(0, checkData_1.default)(data)) {
            let { base64, filename, exists, timestamp } = (data || {});
            let gun = (0, epubFile_1.nodeGunEpubFile)(siteID[0], novelID[0]);
            timestamp = timestamp || await gun.get('timestamp');
            if (typeof timestamp === 'number') {
                filename = filename || await gun.get('filename');
                if (typeof filename === 'string') {
                    base64 = base64 || await gun.get('base64');
                    if (typeof base64 === 'string') {
                        data = {
                            base64,
                            exists: true,
                            filename,
                            timestamp,
                        };
                    }
                }
            }
        }
        if ((0, checkData_1.default)(data)) {
            let { base64, filename, exists, timestamp } = data;
            let isGun = false;
            logger_1.default.info(`於P2P緩存發現檔案...`, new Date(timestamp));
            if (query.debug || query.force) {
                logger_1.default.info(`發現強制下載指令，本次將無視緩存`, query);
            }
            else if ((Date.now() - data.timestamp) < 86400 * 1000) {
                isGun = true;
            }
            else {
                logger_1.default.warn(`目標檔案已過期，試圖重新建立檔案`);
            }
            return {
                base64,
                filename,
                exists,
                timestamp,
                isGun,
            };
        }
        else if (bool === false) {
            logger_1.default.warn(`於P2P緩存發現檔案...`, `但資料似乎已損毀`);
        }
        else {
            logger_1.default.info(`沒有發現P2P緩存...`);
        }
        return null;
    });
}
exports.getGunEpubFile = getGunEpubFile;
function getGunEpubFile2(_siteID, _novelID, options) {
    let { query = {} } = options || {};
    let { siteID, novelID } = (0, index_1.handleArgvList)(_siteID, _novelID);
    return (0, epubFile_1.raceGunEpubFile)(siteID, novelID)
        .then(async (data) => {
        if ((0, checkData_1.default)(data)) {
            let { base64, filename, exists, timestamp } = data;
            let isGun = true;
            return {
                base64,
                filename,
                exists,
                timestamp,
                isGun,
            };
        }
    })
        .timeout(10 * 1000)
        .catch(bluebird_1.TimeoutError, e => null);
}
exports.getGunEpubFile2 = getGunEpubFile2;
function putGunEpubFile(_siteID, _novelID, gunData, options) {
    let { siteID, novelID } = (0, index_1.handleArgvList)(_siteID, _novelID);
    (0, epubFile_1.makeArrayEntrys)(siteID, novelID)
        .forEach(([siteID, novel_id]) => (0, epubFile_1.nodeGunEpubFile)(siteID, novel_id).put(gunData));
}
exports.putGunEpubFile = putGunEpubFile;
//# sourceMappingURL=gun.js.map