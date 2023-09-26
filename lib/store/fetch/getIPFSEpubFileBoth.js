"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIPFSEpubFileBoth = void 0;
const tslib_1 = require("tslib");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const ipfs_1 = require("../ipfs");
const fetchEpub_1 = require("./fetchEpub");
const logger_1 = tslib_1.__importDefault(require("debug-color2/logger"));
function getIPFSEpubFileBoth(siteID, novelID, options) {
    return bluebird_1.default.resolve()
        .then(async () => {
        const { href, filename } = options;
        logger_1.default.info(`檢查是否存在緩存...`, siteID, novelID, filename, href);
        return bluebird_1.default.any([
            (0, ipfs_1.getIPFSEpubFile)(siteID, novelID, {
                query: options.query,
            }).then(gunData => {
                if (gunData.exists) {
                    return Buffer.from(gunData.base64);
                }
                return Promise.reject(new Error(`下載緩存檔案失敗(not exists)... ${filename}`));
            }),
            (0, fetchEpub_1.fetchEpub)(href, 5 * 60 * 1000),
        ])
            .then(buf => {
            if (buf.length) {
                return {
                    filename,
                    exists: true,
                    timestamp: options.timestamp,
                    href,
                    isGun: true,
                    base64: Buffer.from(buf),
                };
            }
            return Promise.reject(new Error(`下載緩存檔案失敗(0)... ${filename}`));
        });
    });
}
exports.getIPFSEpubFileBoth = getIPFSEpubFileBoth;
//# sourceMappingURL=getIPFSEpubFileBoth.js.map