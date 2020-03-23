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
function getIPFSEpubFile(_siteID, _novelID, options) {
    let { query = {} } = options || {};
    let { siteID, novelID } = index_1.handleArgvList(_siteID, _novelID);
    return index_2.getEpubFileInfo(siteID, novelID)
        .catch(bluebird_1.TimeoutError, e => null)
        .then(async (data) => {
        if (checkData_1.default(data)) {
            let { ipfs } = await use_ipfs_1.default()
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
        .catch(e => logger_1.default.error(e));
    if (!ipfs) {
        logger_1.default.debug(`local IPFS server is fail`);
    }
    if (!data.href) {
        let cid;
        logger_1.default.dir(data);
        logger_1.default.debug(`add to IPFS`);
        await put_1.publishToIPFSAll({
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
            logger_1.default.debug(`publishToIPFSAll`, settledResult);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXBmcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImlwZnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUErQztBQUMvQyx5Q0FBaUU7QUFDakUscURBQWtEO0FBQ2xELGlFQUE0QztBQUU1Qyx3REFBK0I7QUFFL0IsaUVBQTBDO0FBQzFDLDZDQUFxQztBQUNyQywyREFBNEM7QUFDNUMsdURBQThEO0FBQzlELDBDQUFxRDtBQUNyRCx3Q0FBa0Q7QUFJbEQsU0FBZ0IsZUFBZSxDQUFDLE9BQTBCLEVBQUUsUUFBMkIsRUFBRSxPQUt4RjtJQUVBLElBQUksRUFBRSxLQUFLLEdBQUcsRUFBRSxFQUFFLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztJQUVuQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLHNCQUFjLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBRTVELE9BQU8sdUJBQWUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDO1NBQ3JDLEtBQUssQ0FBQyx1QkFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO1NBQzlCLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7UUFFcEIsSUFBSSxtQkFBWSxDQUFDLElBQUksQ0FBQyxFQUN0QjtZQUNDLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLGtCQUFPLEVBQUU7aUJBQzVCLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGdCQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBUyxDQUFDLENBQ3JDO1lBRUQsSUFBSSxHQUFHLEdBQUcsTUFBTSxjQUFhLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDeEMsSUFBSTtnQkFDSixHQUFHLHlCQUFrQixFQUFFO2FBQ3ZCLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQztpQkFDWCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUs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S0FBSyxDQUFDLHdCQUF3QixFQUFFLElBQUksQ0FBQyxDQUFDO1FBRTlDLGtCQUFRO2FBQ04sS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7YUFDZixJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ1YsT0FBTyxjQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ3BDLEdBQUcseUJBQWtCLEVBQUU7YUFDdEIsQ0FBQyxDQUNGO1FBQ0YsQ0FBQyxDQUFDO2FBQ0QsT0FBTyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7YUFDbEIsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQ2pCO0lBRUYsQ0FBQyxDQUFDO1NBQ0QsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNsQyxDQUFDO0FBcElELDBDQW9JQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGhhbmRsZUFyZ3ZMaXN0IH0gZnJvbSAnLi4vdXRpbC9pbmRleCc7XG5pbXBvcnQgeyBnZXRFcHViRmlsZUluZm8sIHB1dEVwdWJGaWxlSW5mbyB9IGZyb20gJy4uL2lwZnMvaW5kZXgnO1xuaW1wb3J0IEJsdWViaXJkLCB7IFRpbWVvdXRFcnJvciB9IGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBjaGVja0d1bkRhdGEgZnJvbSAnLi4vZ3VuL2NoZWNrRGF0YSc7XG5pbXBvcnQgZmV0Y2hJUEZTIGZyb20gJ2ZldGNoLWlwZnMnO1xuaW1wb3J0IHVzZUlQRlMgZnJvbSAndXNlLWlwZnMnO1xuaW1wb3J0IHsgSUd1bkVwdWJEYXRhLCBJR3VuRXB1Yk5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgY29uc29sZSBmcm9tICdkZWJ1Zy1jb2xvcjIvbG9nZ2VyJztcbmltcG9ydCB7IHRvTGluayB9IGZyb20gJ3RvLWlwZnMtdXJsJztcbmltcG9ydCByYWNlRmV0Y2hJUEZTIGZyb20gJ2ZldGNoLWlwZnMvcmFjZSc7XG5pbXBvcnQgaXBmc1NlcnZlckxpc3QsIHsgZmlsdGVyTGlzdCB9IGZyb20gJ2lwZnMtc2VydmVyLWxpc3QnO1xuaW1wb3J0IHsgbGF6eVJhY2VTZXJ2ZXJMaXN0IH0gZnJvbSAnZmV0Y2gtaXBmcy91dGlsJztcbmltcG9ydCB7IHB1Ymxpc2hUb0lQRlNBbGwgfSBmcm9tICdmZXRjaC1pcGZzL3B1dCc7XG5pbXBvcnQgeyBQcm9taXNlU2V0dGxlZFJlc3VsdCB9IGZyb20gJ2ZldGNoLWlwZnMvbGliL3B1dC9hbGwnO1xuaW1wb3J0IHsgSUlQRlNGaWxlQXBpLCBJRmlsZURhdGEsIElJUEZTRmlsZUFwaUFkZE9wdGlvbnMsIElJUEZTRmlsZUFwaUFkZFJldHVybkVudHJ5IH0gZnJvbSAnaXBmcy10eXBlcy9saWIvaXBmcy9maWxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldElQRlNFcHViRmlsZShfc2l0ZUlEOiBzdHJpbmcgfCBzdHJpbmdbXSwgX25vdmVsSUQ6IHN0cmluZyB8IHN0cmluZ1tdLCBvcHRpb25zOiB7XG5cdHF1ZXJ5OiB7XG5cdFx0ZGVidWc/OiBib29sZWFuLFxuXHRcdGZvcmNlPzogYm9vbGVhbixcblx0fSxcbn0pXG57XG5cdGxldCB7IHF1ZXJ5ID0ge30gfSA9IG9wdGlvbnMgfHwge307XG5cblx0bGV0IHsgc2l0ZUlELCBub3ZlbElEIH0gPSBoYW5kbGVBcmd2TGlzdChfc2l0ZUlELCBfbm92ZWxJRCk7XG5cblx0cmV0dXJuIGdldEVwdWJGaWxlSW5mbyhzaXRlSUQsIG5vdmVsSUQpXG5cdFx0LmNhdGNoKFRpbWVvdXRFcnJvciwgZSA9PiBudWxsKVxuXHRcdC50aGVuKGFzeW5jIChkYXRhKSA9PlxuXHRcdHtcblx0XHRcdGlmIChjaGVja0d1bkRhdGEoZGF0YSkpXG5cdFx0XHR7XG5cdFx0XHRcdGxldCB7IGlwZnMgfSA9IGF3YWl0IHVzZUlQRlMoKVxuXHRcdFx0XHRcdC5jYXRjaChlID0+IGNvbnNvbGUuZXJyb3IoZSkgYXMgbnVsbClcblx0XHRcdFx0O1xuXG5cdFx0XHRcdGxldCBidWYgPSBhd2FpdCByYWNlRmV0Y2hJUEZTKGRhdGEuaHJlZiwgW1xuXHRcdFx0XHRcdGlwZnMsXG5cdFx0XHRcdFx0Li4ubGF6eVJhY2VTZXJ2ZXJMaXN0KCksXG5cdFx0XHRcdF0sIDEwICogMTAwMClcblx0XHRcdFx0XHQuY2F0Y2goZSA9PiBudWxsKVxuXHRcdFx0XHQ7XG5cblx0XHRcdFx0aWYgKGJ1ZiAmJiBidWYubGVuZ3RoKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0ZGF0YS5iYXNlNjQgPSBidWYudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuXG5cdFx0XHRcdFx0bGV0IHsgYmFzZTY0LCBmaWxlbmFtZSwgZXhpc3RzLCB0aW1lc3RhbXAsIGhyZWYgfSA9IGRhdGE7XG5cblx0XHRcdFx0XHRsZXQgaXNHdW4gPSBmYWxzZTtcblxuXHRcdFx0XHRcdGlmIChxdWVyeS5kZWJ1ZyB8fCBxdWVyeS5mb3JjZSlcblx0XHRcdFx0XHR7XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSBpZiAoKERhdGUubm93KCkgLSBkYXRhLnRpbWVzdGFtcCkgPCA4NjQwMCAqIDEwMDApXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aXNHdW4gPSB0cnVlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRiYXNlNjQsXG5cdFx0XHRcdFx0XHRmaWxlbmFtZSxcblx0XHRcdFx0XHRcdGV4aXN0cyxcblx0XHRcdFx0XHRcdHRpbWVzdGFtcCxcblx0XHRcdFx0XHRcdGlzR3VuLFxuXHRcdFx0XHRcdFx0aHJlZixcblx0XHRcdFx0XHR9IGFzIElHdW5FcHViRGF0YVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBudWxsXG5cdFx0fSlcblx0XHQuY2F0Y2goZSA9PiBudWxsKVxuXHRcdDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHB1dElQRlNFcHViRmlsZShfc2l0ZUlEOiBzdHJpbmcgfCBzdHJpbmdbXSxcblx0X25vdmVsSUQ6IHN0cmluZyB8IHN0cmluZ1tdLFxuXHRndW5EYXRhOiBJR3VuRXB1Yk5vZGUsXG5cdG9wdGlvbnM/OiB7XG5cdFx0cXVlcnk/OiB7XG5cdFx0XHRkZWJ1Zz86IGJvb2xlYW4sXG5cdFx0XHRmb3JjZT86IGJvb2xlYW4sXG5cdFx0fSxcblx0fSxcbilcbntcblx0KHsgc2l0ZUlEOiBfc2l0ZUlELCBub3ZlbElEOiBfbm92ZWxJRCB9ID0gaGFuZGxlQXJndkxpc3QoX3NpdGVJRCwgX25vdmVsSUQpKTtcblxuXHRsZXQgc2l0ZUlEID0gX3NpdGVJRFswXTtcblx0bGV0IG5vdmVsSUQgPSBfbm92ZWxJRFswXTtcblxuXHRsZXQgeyBiYXNlNjQsIC4uLmRhdGEgfSA9IGd1bkRhdGE7XG5cblx0bGV0IGNvbnRlbnQgPSBCdWZmZXIuZnJvbShiYXNlNjQsICdiYXNlNjQnKTtcblxuXHRsZXQgeyBpcGZzIH0gPSBhd2FpdCB1c2VJUEZTKClcblx0XHQuY2F0Y2goZSA9PiBjb25zb2xlLmVycm9yKGUpIGFzIG51bGwpXG5cdDtcblxuXHRpZiAoIWlwZnMpXG5cdHtcblx0XHRjb25zb2xlLmRlYnVnKGBsb2NhbCBJUEZTIHNlcnZlciBpcyBmYWlsYCk7XG5cdFx0Ly9yZXR1cm4gbnVsbDtcblx0fVxuXG5cdGlmICghZGF0YS5ocmVmKVxuXHR7XG5cdFx0bGV0IGNpZDogc3RyaW5nO1xuXG5cdFx0Y29uc29sZS5kaXIoZGF0YSk7XG5cblx0XHRjb25zb2xlLmRlYnVnKGBhZGQgdG8gSVBGU2ApO1xuXG5cdFx0LyoqXG5cdFx0ICog6Kmm5ZyW5o6o6YCB6Iez5YW25LuWIElQRlMg5Ly65pyN5Zmo5L6G5aKe5Yqg5qqU5qGI5a2Y5rS7546H6IiH5YiG5rWBXG5cdFx0ICovXG5cdFx0YXdhaXQgcHVibGlzaFRvSVBGU0FsbCh7XG5cdFx0XHRwYXRoOiBkYXRhLmZpbGVuYW1lLFxuXHRcdFx0Y29udGVudCxcblx0XHR9LCBbXG5cdFx0XHRpcGZzLFxuXHRcdFx0Li4uZmlsdGVyTGlzdCgnQVBJJyksXG5cdFx0XSwge1xuXHRcdFx0YWRkT3B0aW9uczoge1xuXHRcdFx0XHRwaW46IGZhbHNlLFxuXHRcdFx0fSxcblx0XHRcdHRpbWVvdXQ6IDEwICogMTAwMCxcblx0XHR9KVxuXHRcdFx0LnRhcChzZXR0bGVkUmVzdWx0ID0+IHtcblx0XHRcdFx0Y29uc29sZS5kZWJ1ZyhgcHVibGlzaFRvSVBGU0FsbGAsIHNldHRsZWRSZXN1bHQpXG5cdFx0XHR9KVxuXHRcdFx0LmVhY2goKHNldHRsZWRSZXN1bHQsIGluZGV4KSA9PiB7XG5cblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRsZXQgdmFsdWU6IElJUEZTRmlsZUFwaUFkZFJldHVybkVudHJ5W10gPSBzZXR0bGVkUmVzdWx0LnZhbHVlID8/IHNldHRsZWRSZXN1bHQucmVhc29uPy52YWx1ZTtcblxuXHRcdFx0XHRpZiAodmFsdWU/Lmxlbmd0aClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHZhbHVlLmZvckVhY2goKHJlc3VsdCwgaSkgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3QgcmVzdWx0Q0lEID0gcmVzdWx0LmNpZC50b1N0cmluZygpO1xuXG5cdFx0XHRcdFx0XHRpZiAoY2lkICE9PSByZXN1bHRDSUQpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuZGVidWcocmVzdWx0KTtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5kZWJ1ZyhjaWQgPSByZXN1bHRDSUQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y29uc29sZS5yZWQuZGlyKHNldHRsZWRSZXN1bHQpXG5cdFx0XHRcdH1cblxuXHRcdFx0fSlcblx0XHQ7XG5cblx0XHQvKlxuXHRcdGZvciBhd2FpdCAoY29uc3QgcmVzdWx0IG9mIGlwZnMuYWRkKHtcblx0XHRcdHBhdGg6IGRhdGEuZmlsZW5hbWUsXG5cdFx0XHRjb250ZW50LFxuXHRcdH0sIHtcblx0XHRcdHBpbjogZmFsc2UsXG5cdFx0fSkpXG5cdFx0e1xuXHRcdFx0Y29uc29sZS5kZWJ1ZyhyZXN1bHQpO1xuXHRcdFx0Y29uc29sZS5kZWJ1ZyhjaWQgPSByZXN1bHQuY2lkLnRvU3RyaW5nKCkpXG5cdFx0fVxuXHRcdCAqL1xuXG5cdFx0aWYgKCFjaWQpXG5cdFx0e1xuXHRcdFx0Y29uc29sZS53YXJuKGBwdWJsaXNoVG9JUEZTQWxsIGZhaWxgKTtcblx0XHRcdHJldHVybiBudWxsXG5cdFx0fVxuXG5cdFx0ZGF0YS5ocmVmID0gdG9MaW5rKGNpZCwgZGF0YS5maWxlbmFtZSk7XG5cdH1cblx0ZWxzZSBpZiAoIWlwZnMpXG5cdHtcblx0XHRjb25zb2xlLnJlZC5kZWJ1ZyhgcHV0RXB1YkZpbGVJbmZvOnNraXBgKTtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdGNvbnNvbGUuc3VjY2VzcyhkYXRhLmhyZWYpO1xuXHQvLyBAdHMtaWdub3JlXG5cdGRlbGV0ZSBkYXRhLmJhc2U2NDtcblxuXHRhd2FpdCBwdXRFcHViRmlsZUluZm8oc2l0ZUlELCBub3ZlbElELCBkYXRhIGFzIGFueSlcblx0XHQudGFwKGFzeW5jICh2KSA9PiB7XG5cdFx0XHRsZXQganNvbiA9IGF3YWl0IHYuanNvbigpO1xuXG5cdFx0XHRjb25zb2xlLmRlYnVnKGBwdXRFcHViRmlsZUluZm86cmV0dXJuYCwganNvbik7XG5cblx0XHRcdEJsdWViaXJkXG5cdFx0XHRcdC5kZWxheSg1ICogMTAwMClcblx0XHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRcdHJldHVybiByYWNlRmV0Y2hJUEZTKGpzb24uZGF0YS5ocmVmLCBbXG5cdFx0XHRcdFx0XHQuLi5sYXp5UmFjZVNlcnZlckxpc3QoKSxcblx0XHRcdFx0XHRcdF0pXG5cdFx0XHRcdFx0O1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQudGltZW91dCgxMCAqIDEwMDApXG5cdFx0XHRcdC5jYXRjaChlID0+IG51bGwpXG5cdFx0XHQ7XG5cblx0XHR9KVxuXHRcdC50YXBDYXRjaCh2ID0+IGNvbnNvbGUuZXJyb3IodikpXG59XG4iXX0=