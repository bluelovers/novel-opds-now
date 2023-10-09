"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putIPFSEpubFile = exports.getIPFSEpubFile = void 0;
const tslib_1 = require("tslib");
const index_1 = require("../util/index");
const index_2 = require("../ipfs/index");
const bluebird_1 = require("bluebird");
const checkData_1 = tslib_1.__importDefault(require("../util/checkData"));
const use_1 = require("../ipfs/use");
const logger_1 = tslib_1.__importDefault(require("debug-color2/logger"));
const to_ipfs_url_1 = require("to-ipfs-url");
const ipfs_server_list_1 = require("ipfs-server-list");
const put_1 = require("fetch-ipfs/put");
const util_1 = require("util");
const pubsub_1 = require("../ipfs/pubsub");
const pokeAll_1 = require("../ipfs/pokeAll");
const mfs_1 = require("../ipfs/mfs");
const downloadEpubRace_1 = require("./downloadEpubRace");
const cache_1 = require("../ipfs/pubsub/cache");
const siteNeverExpired_1 = require("../site/siteNeverExpired");
const deepEntryListMap_1 = require("../ipfs/mfs/deepEntryListMap");
const lodash_1 = require("lodash");
const moment_1 = tslib_1.__importDefault(require("moment"));
const cache_loader_1 = require("@node-novel/cache-loader");
const getNovelData_1 = require("../site/cached-data/getNovelData");
function getIPFSEpubFile(_siteID, _novelID, options) {
    let { query = {} } = options || {};
    let { siteID, novelID } = (0, index_1.handleArgvList)(_siteID, _novelID);
    return (0, index_2.getEpubFileInfo)(siteID, novelID)
        .catch(bluebird_1.TimeoutError, e => {
        logger_1.default.error(`getEpubFileInfo`, siteID, novelID, String(e));
        return null;
    })
        .then(async (data) => {
        var _a, _b;
        const novelData = await (0, getNovelData_1.getNovelData)((_a = data[index_2.SymSiteID]) !== null && _a !== void 0 ? _a : siteID[0], (_b = data[index_2.SymNovelID]) !== null && _b !== void 0 ? _b : novelID[0]);
        logger_1.default.debug(`驗證緩存檔案...`, siteID, novelID, (0, lodash_1.omit)(data, ['base64']), (0, moment_1.default)(data.timestamp).locale('zh-tw').fromNow(), novelData === null || novelData === void 0 ? void 0 : novelData.title);
        if ((0, checkData_1.default)(data)) {
            logger_1.default.debug(`下載緩存檔案...`, siteID, novelID, data.href, novelData === null || novelData === void 0 ? void 0 : novelData.title);
            let buf = await (0, downloadEpubRace_1.downloadEpubRace)(data.href, void 0, (query.debug || query.force) ? 5 * 60 * 1000 : void 0)
                .catch(e => {
                logger_1.default.debug(`下載緩存檔案失敗...`, siteID, novelID, data.href, String(e), novelData === null || novelData === void 0 ? void 0 : novelData.title);
                return null;
            });
            if (buf === null || buf === void 0 ? void 0 : buf.length) {
                let infoDate = (novelData === null || novelData === void 0 ? void 0 : novelData.updated) && (0, cache_loader_1.createMoment)(novelData.updated);
                logger_1.default.debug(`分析緩存檔案...`, siteID, novelID, data.href, novelData === null || novelData === void 0 ? void 0 : novelData.title, infoDate === null || infoDate === void 0 ? void 0 : infoDate.format());
                data.base64 = Buffer.from(buf);
                let { base64, filename, exists, timestamp, href } = data;
                let isGun = false;
                if ((0, siteNeverExpired_1.siteNeverExpired)(siteID)) {
                    isGun = true;
                }
                else if (!(query.debug || query.force) && (0, siteNeverExpired_1.siteNotExpireCheck)(siteID, data.timestamp)) {
                    isGun = true;
                    if (infoDate) {
                        const days = infoDate.diff(data.timestamp, 'days');
                        logger_1.default.debug(`檢查小說最後更新日期與緩存日期的差異`, days, '天', [infoDate.format(), (0, cache_loader_1.createMoment)(data.timestamp).format()]);
                        if (days > 1) {
                            isGun = false;
                        }
                    }
                }
                return {
                    base64,
                    filename,
                    exists,
                    timestamp,
                    isGun,
                    href,
                };
            }
        }
        return null;
    })
        .catch(async (e) => {
        try {
            let json = await e.json();
            if (json.error !== true) {
                logger_1.default.debug(`getEpubFileInfo`, siteID, novelID, json);
            }
        }
        catch (e2) {
            logger_1.default.error(`getEpubFileInfo`, siteID, novelID, e);
        }
        return null;
    });
}
exports.getIPFSEpubFile = getIPFSEpubFile;
async function putIPFSEpubFile(_siteID, _novelID, gunData, options) {
    ({ siteID: _siteID, novelID: _novelID } = (0, index_1.handleArgvList)(_siteID, _novelID));
    let siteID = _siteID[0];
    let novelID = _novelID[0];
    let { base64, ...data } = gunData;
    let content = Buffer.from(base64);
    let { ipfs, path } = await (0, use_1.useIPFS)().catch(e => ({}));
    if (!ipfs) {
        logger_1.default.debug(`[IPFS]`, `local IPFS server is fail`);
    }
    if (!data.href) {
        let cid;
        logger_1.default.debug(`[IPFS]`, `add to IPFS`, (0, util_1.inspect)(data));
        const timeout = 30 * 60 * 1000;
        await (0, put_1.publishToIPFSRace)({
            path: data.filename,
            content,
        }, [
            ipfs,
            ...(0, ipfs_server_list_1.filterList)('API'),
        ], {
            addOptions: {
                pin: false,
            },
            timeout,
        })
            .each((settledResult, index) => {
            var _a, _b;
            let value = (_a = settledResult.value) !== null && _a !== void 0 ? _a : (_b = settledResult.reason) === null || _b === void 0 ? void 0 : _b.value;
            if (value === null || value === void 0 ? void 0 : value.length) {
                const { status } = settledResult;
                value.forEach((result, i) => {
                    const resultCID = result.cid.toString();
                    if (cid !== resultCID) {
                        logger_1.default.debug(`[IPFS]`, `publishToIPFSAll`, `[${status}]`, cid = resultCID);
                        ipfs && (0, pubsub_1.pubsubPublishEpub)(ipfs, {
                            siteID,
                            novelID,
                            data: result,
                        }, (0, pubsub_1.getPubsubPeers)(ipfs));
                        ipfs && (0, mfs_1.addMutableFileSystem)({
                            siteID,
                            novelID,
                            data: result,
                        })
                            .tap(deepEntryListMap_1.saveDeepEntryListMapToMixin);
                        ipfs && (0, cache_1.updateCachePubSubPeers)(ipfs);
                    }
                });
            }
            else {
                logger_1.default.red.dir(settledResult);
            }
        })
            .finally(() => {
            (0, put_1.publishToIPFSAll)({
                path: data.filename,
                content,
            }, [
                ipfs,
                ...(0, ipfs_server_list_1.filterList)('API'),
            ], {
                addOptions: {
                    pin: false,
                },
                timeout,
            }).catch(e => null);
        });
        if (!cid) {
            logger_1.default.warn(`[IPFS]`, `publishToIPFSAll fail`, `無法將檔案推送至 IPFS，如果發生多次，請檢查 ~/.ipfs , ~/.jsipfs, ${path} 資料夾`);
            return null;
        }
        (0, pokeAll_1.pokeAll)(cid, ipfs, data)
            .tap(settledResult => {
            return (0, pokeAll_1.reportPokeAllSettledResult)(settledResult, cid, data.filename);
        });
        data.href = (0, to_ipfs_url_1.toLink)(cid, data.filename);
    }
    else if (!ipfs) {
        logger_1.default.red.debug(`putEpubFileInfo:skip`);
        return null;
    }
    logger_1.default.success(data.href);
    delete data.base64;
    await (0, index_2.putEpubFileInfo)(siteID, novelID, data)
        .tap(async (json) => {
        const m = (0, cache_loader_1.createMoment)(json.data.timestamp).locale('zh-tw');
        logger_1.default.debug(`putEpubFileInfo:return`, json, m.fromNow(), m.format());
        let url = new URL(json.data.href);
        let cid = (0, to_ipfs_url_1.pathToCid)(url.pathname);
        let filename = url.searchParams.get('filename');
        (0, pokeAll_1.pokeAll)(cid, {
            filename,
        }).catch(e => null);
    });
}
exports.putIPFSEpubFile = putIPFSEpubFile;
//# sourceMappingURL=ipfs.js.map