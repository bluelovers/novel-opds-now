"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putIPFSEpubFile = exports.getIPFSEpubFile = void 0;
const tslib_1 = require("tslib");
const index_1 = require("../util/index");
const index_2 = require("../ipfs/index");
const bluebird_1 = require("bluebird");
const checkData_1 = (0, tslib_1.__importDefault)(require("../util/checkData"));
const use_1 = require("../ipfs/use");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const to_ipfs_url_1 = require("to-ipfs-url");
const race_1 = (0, tslib_1.__importDefault)(require("fetch-ipfs/race"));
const ipfs_server_list_1 = require("ipfs-server-list");
const util_1 = require("fetch-ipfs/util");
const put_1 = require("fetch-ipfs/put");
const util_2 = require("util");
const pubsub_1 = require("../ipfs/pubsub");
const pokeAll_1 = require("../ipfs/pokeAll");
const mfs_1 = require("../ipfs/mfs");
function getIPFSEpubFile(_siteID, _novelID, options) {
    let { query = {} } = options || {};
    let { siteID, novelID } = (0, index_1.handleArgvList)(_siteID, _novelID);
    return (0, index_2.getEpubFileInfo)(siteID, novelID)
        .catch(bluebird_1.TimeoutError, e => {
        logger_1.default.error(e);
        return null;
    })
        .then(async (data) => {
        logger_1.default.debug(`驗證緩存檔案...`);
        if ((0, checkData_1.default)(data)) {
            let ipfs = await (0, use_1.getIPFS)().timeout(3 * 1000).catch(e => null);
            logger_1.default.debug(`下載緩存檔案...`, data.href);
            let buf = await (0, race_1.default)(data.href, [
                ipfs,
                ...(0, util_1.lazyRaceServerList)(),
            ], 20 * 60 * 1000, {})
                .catch(e => {
                logger_1.default.debug(`下載緩存檔案失敗...`, data.href, String(e));
                return null;
            });
            if (buf === null || buf === void 0 ? void 0 : buf.length) {
                logger_1.default.debug(`分析緩存檔案...`, data.href);
                data.base64 = buf.toString('base64');
                let { base64, filename, exists, timestamp, href } = data;
                let isGun = false;
                if (siteID === 'masiro') {
                    isGun = true;
                }
                else if (query.debug || query.force) {
                }
                else if ((Date.now() - data.timestamp) < 86400 * 1000 * 2) {
                    isGun = true;
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
        .catch(e => {
        logger_1.default.error(e);
        return null;
    });
}
exports.getIPFSEpubFile = getIPFSEpubFile;
async function putIPFSEpubFile(_siteID, _novelID, gunData, options) {
    ({ siteID: _siteID, novelID: _novelID } = (0, index_1.handleArgvList)(_siteID, _novelID));
    let siteID = _siteID[0];
    let novelID = _novelID[0];
    let { base64, ...data } = gunData;
    let content = Buffer.from(base64, 'base64');
    let ipfs = await (0, use_1.getIPFS)().catch(e => null);
    if (!ipfs) {
        logger_1.default.debug(`[IPFS]`, `local IPFS server is fail`);
    }
    if (!data.href) {
        let cid;
        logger_1.default.debug(`[IPFS]`, `add to IPFS`, (0, util_2.inspect)(data));
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
            timeout: 10 * 60 * 1000,
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
                        });
                        ipfs && (0, mfs_1.addMutableFileSystem)({
                            siteID,
                            novelID,
                            data: result,
                        });
                    }
                });
            }
            else {
                logger_1.default.red.dir(settledResult);
            }
        });
        if (!cid) {
            logger_1.default.warn(`[IPFS]`, `publishToIPFSAll fail`, `無法將檔案推送至 IPFS，如果發生多次，請檢查 ~/.ipfs , ~/.jsipfs 資料夾`);
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
        logger_1.default.debug(`putEpubFileInfo:return`, json);
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