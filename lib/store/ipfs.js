"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.putIPFSEpubFile = exports.getIPFSEpubFile = void 0;
const index_1 = require("../util/index");
const index_2 = require("../ipfs/index");
const bluebird_1 = __importStar(require("bluebird"));
const checkData_1 = __importDefault(require("../gun/checkData"));
const use_ipfs_1 = __importDefault(require("use-ipfs"));
const logger_1 = __importDefault(require("debug-color2/logger"));
const to_ipfs_url_1 = require("to-ipfs-url");
const race_1 = __importDefault(require("fetch-ipfs/race"));
const ipfs_server_list_1 = require("ipfs-server-list");
const util_1 = require("fetch-ipfs/util");
const put_1 = require("fetch-ipfs/put");
const processExit_1 = require("../processExit");
function getIPFSEpubFile(_siteID, _novelID, options) {
    let { query = {} } = options || {};
    let { siteID, novelID } = index_1.handleArgvList(_siteID, _novelID);
    return index_2.getEpubFileInfo(siteID, novelID)
        .catch(bluebird_1.TimeoutError, e => null)
        .then(async (data) => {
        if (checkData_1.default(data)) {
            let { ipfs } = await use_ipfs_1.default()
                .then(data => {
                processExit_1.processExit(data.stop);
                return data;
            })
                .catch(e => logger_1.default.error(e));
            let buf = await race_1.default(data.href, [
                ipfs,
                ...util_1.lazyRaceServerList(),
            ], 10 * 1000)
                .catch(e => null);
            if (buf && buf.length) {
                data.base64 = buf.toString('base64');
                let { base64, filename, exists, timestamp, href } = data;
                let isGun = false;
                if (query.debug || query.force) {
                }
                else if ((Date.now() - data.timestamp) < 86400 * 1000) {
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
        .catch(e => null);
}
exports.getIPFSEpubFile = getIPFSEpubFile;
async function putIPFSEpubFile(_siteID, _novelID, gunData, options) {
    ({ siteID: _siteID, novelID: _novelID } = index_1.handleArgvList(_siteID, _novelID));
    let siteID = _siteID[0];
    let novelID = _novelID[0];
    let { base64, ...data } = gunData;
    let content = Buffer.from(base64, 'base64');
    let { ipfs } = await use_ipfs_1.default()
        .then(data => {
        processExit_1.processExit(data.stop);
        return data;
    })
        .catch(e => logger_1.default.error(e));
    if (!ipfs) {
        logger_1.default.debug(`local IPFS server is fail`);
    }
    if (!data.href) {
        let cid;
        logger_1.default.dir(data);
        logger_1.default.debug(`add to IPFS`);
        await put_1.publishToIPFSRace({
            path: data.filename,
            content,
        }, [
            ipfs,
            ...ipfs_server_list_1.filterList('API'),
        ], {
            addOptions: {
                pin: false,
            },
            timeout: 10 * 1000,
        })
            .tap(settledResult => {
            logger_1.default.debug(`publishToIPFSAll`, settledResult, {
                depth: 5,
            });
        })
            .each((settledResult, index) => {
            var _a, _b;
            let value = (_a = settledResult.value) !== null && _a !== void 0 ? _a : (_b = settledResult.reason) === null || _b === void 0 ? void 0 : _b.value;
            if (value === null || value === void 0 ? void 0 : value.length) {
                value.forEach((result, i) => {
                    const resultCID = result.cid.toString();
                    if (cid !== resultCID) {
                        logger_1.default.debug(result);
                        logger_1.default.debug(cid = resultCID);
                    }
                });
            }
            else {
                logger_1.default.red.dir(settledResult);
            }
        });
        if (!cid) {
            logger_1.default.warn(`publishToIPFSAll fail`);
            return null;
        }
        data.href = to_ipfs_url_1.toLink(cid, data.filename);
    }
    else if (!ipfs) {
        logger_1.default.red.debug(`putEpubFileInfo:skip`);
        return null;
    }
    logger_1.default.success(data.href);
    delete data.base64;
    await index_2.putEpubFileInfo(siteID, novelID, data)
        .tap(async (v) => {
        let json = await v.json();
        logger_1.default.debug(`putEpubFileInfo:return`, json);
        bluebird_1.default
            .delay(5 * 1000)
            .then(() => {
            return race_1.default(json.data.href, [
                ...util_1.lazyRaceServerList(),
            ]);
        })
            .timeout(10 * 1000)
            .catch(e => null);
    })
        .tapCatch(v => logger_1.default.error(v));
}
exports.putIPFSEpubFile = putIPFSEpubFile;
//# sourceMappingURL=ipfs.js.map