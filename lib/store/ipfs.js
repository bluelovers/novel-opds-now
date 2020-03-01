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
const index_1 = require("../util/index");
const index_2 = require("../ipfs/index");
const bluebird_1 = __importStar(require("bluebird"));
const checkData_1 = __importDefault(require("../gun/checkData"));
const fetch_ipfs_1 = __importDefault(require("fetch-ipfs"));
const use_ipfs_1 = __importDefault(require("use-ipfs"));
const logger_1 = __importDefault(require("debug-color2/logger"));
const to_ipfs_url_1 = require("to-ipfs-url");
function getIPFSEpubFile(_siteID, _novelID, options) {
    let { query = {} } = options || {};
    let { siteID, novelID } = index_1.handleArgvList(_siteID, _novelID);
    return index_2.getEpubFileInfo(siteID, novelID)
        .catch(bluebird_1.TimeoutError, e => null)
        .then(async (data) => {
        if (checkData_1.default(data)) {
            let { ipfs } = await use_ipfs_1.default()
                .catch(e => logger_1.default.error(e));
            let buf = await fetch_ipfs_1.default(data.href, ipfs)
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
        return null;
    }
    if (!data.href) {
        let cid;
        logger_1.default.dir(data);
        logger_1.default.debug(`add to IPFS`);
        for await (const result of ipfs.add({
            path: data.filename,
            content,
        }, {
            pin: false,
        })) {
            logger_1.default.debug(result);
            logger_1.default.debug(cid = result.cid.toString());
        }
        data.href = to_ipfs_url_1.toLink(cid, data.filename);
    }
    logger_1.default.success(data.href);
    delete data.base64;
    await index_2.putEpubFileInfo(siteID, novelID, data)
        .tap(async (v) => {
        let json = await v.json();
        logger_1.default.debug(`putEpubFileInfo:return`, json);
        bluebird_1.default
            .delay(5 * 1000)
            .then(() => fetch_ipfs_1.default(json.data.href))
            .catch(e => null);
    })
        .tapCatch(v => logger_1.default.error(v));
}
exports.putIPFSEpubFile = putIPFSEpubFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXBmcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImlwZnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUNBQStDO0FBQy9DLHlDQUFpRTtBQUNqRSxxREFBa0Q7QUFDbEQsaUVBQTRDO0FBQzVDLDREQUFtQztBQUNuQyx3REFBK0I7QUFFL0IsaUVBQTBDO0FBQzFDLDZDQUFxQztBQUVyQyxTQUFnQixlQUFlLENBQUMsT0FBMEIsRUFBRSxRQUEyQixFQUFFLE9BS3hGO0lBRUEsSUFBSSxFQUFFLEtBQUssR0FBRyxFQUFFLEVBQUUsR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO0lBRW5DLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsc0JBQWMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFFNUQsT0FBTyx1QkFBZSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUM7U0FDckMsS0FBSyxDQUFDLHVCQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUM7U0FDOUIsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUVwQixJQUFJLG1CQUFZLENBQUMsSUFBSSxDQUFDLEVBQ3RCO1lBQ0MsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLE1BQU0sa0JBQU8sRUFBRTtpQkFDNUIsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFTLENBQUMsQ0FDckM7WUFFRCxJQUFJLEdBQUcsR0FBRyxNQUFNLG9CQUFTLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7aUJBQ3hDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUNqQjtZQUVELElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQ3JCO2dCQUNDLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxD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Z0JBQU8sQ0FBQyxLQUFLLENBQUMsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFOUMsa0JBQVE7YUFDTixLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQzthQUNmLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxvQkFBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDckMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQ2pCO0lBRUYsQ0FBQyxDQUFDO1NBQ0QsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNsQyxDQUFDO0FBckVELDBDQXFFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGhhbmRsZUFyZ3ZMaXN0IH0gZnJvbSAnLi4vdXRpbC9pbmRleCc7XG5pbXBvcnQgeyBnZXRFcHViRmlsZUluZm8sIHB1dEVwdWJGaWxlSW5mbyB9IGZyb20gJy4uL2lwZnMvaW5kZXgnO1xuaW1wb3J0IEJsdWViaXJkLCB7IFRpbWVvdXRFcnJvciB9IGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBjaGVja0d1bkRhdGEgZnJvbSAnLi4vZ3VuL2NoZWNrRGF0YSc7XG5pbXBvcnQgZmV0Y2hJUEZTIGZyb20gJ2ZldGNoLWlwZnMnO1xuaW1wb3J0IHVzZUlQRlMgZnJvbSAndXNlLWlwZnMnO1xuaW1wb3J0IHsgSUd1bkVwdWJEYXRhLCBJR3VuRXB1Yk5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgY29uc29sZSBmcm9tICdkZWJ1Zy1jb2xvcjIvbG9nZ2VyJztcbmltcG9ydCB7IHRvTGluayB9IGZyb20gJ3RvLWlwZnMtdXJsJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldElQRlNFcHViRmlsZShfc2l0ZUlEOiBzdHJpbmcgfCBzdHJpbmdbXSwgX25vdmVsSUQ6IHN0cmluZyB8IHN0cmluZ1tdLCBvcHRpb25zOiB7XG5cdHF1ZXJ5OiB7XG5cdFx0ZGVidWc/OiBib29sZWFuLFxuXHRcdGZvcmNlPzogYm9vbGVhbixcblx0fSxcbn0pXG57XG5cdGxldCB7IHF1ZXJ5ID0ge30gfSA9IG9wdGlvbnMgfHwge307XG5cblx0bGV0IHsgc2l0ZUlELCBub3ZlbElEIH0gPSBoYW5kbGVBcmd2TGlzdChfc2l0ZUlELCBfbm92ZWxJRCk7XG5cblx0cmV0dXJuIGdldEVwdWJGaWxlSW5mbyhzaXRlSUQsIG5vdmVsSUQpXG5cdFx0LmNhdGNoKFRpbWVvdXRFcnJvciwgZSA9PiBudWxsKVxuXHRcdC50aGVuKGFzeW5jIChkYXRhKSA9PlxuXHRcdHtcblx0XHRcdGlmIChjaGVja0d1bkRhdGEoZGF0YSkpXG5cdFx0XHR7XG5cdFx0XHRcdGxldCB7IGlwZnMgfSA9IGF3YWl0IHVzZUlQRlMoKVxuXHRcdFx0XHRcdC5jYXRjaChlID0+IGNvbnNvbGUuZXJyb3IoZSkgYXMgbnVsbClcblx0XHRcdFx0O1xuXG5cdFx0XHRcdGxldCBidWYgPSBhd2FpdCBmZXRjaElQRlMoZGF0YS5ocmVmLCBpcGZzKVxuXHRcdFx0XHRcdC5jYXRjaChlID0+IG51bGwpXG5cdFx0XHRcdDtcblxuXHRcdFx0XHRpZiAoYnVmICYmIGJ1Zi5sZW5ndGgpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRkYXRhLmJhc2U2NCA9IGJ1Zi50b1N0cmluZygnYmFzZTY0Jyk7XG5cblx0XHRcdFx0XHRsZXQgeyBiYXNlNjQsIGZpbGVuYW1lLCBleGlzdHMsIHRpbWVzdGFtcCwgaHJlZiB9ID0gZGF0YTtcblxuXHRcdFx0XHRcdGxldCBpc0d1biA9IGZhbHNlO1xuXG5cdFx0XHRcdFx0aWYgKHF1ZXJ5LmRlYnVnIHx8IHF1ZXJ5LmZvcmNlKVxuXHRcdFx0XHRcdHtcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGlmICgoRGF0ZS5ub3coKSAtIGRhdGEudGltZXN0YW1wKSA8IDg2NDAwICogMTAwMClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRpc0d1biA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdGJhc2U2NCxcblx0XHRcdFx0XHRcdGZpbGVuYW1lLFxuXHRcdFx0XHRcdFx0ZXhpc3RzLFxuXHRcdFx0XHRcdFx0dGltZXN0YW1wLFxuXHRcdFx0XHRcdFx0aXNHdW4sXG5cdFx0XHRcdFx0XHRocmVmLFxuXHRcdFx0XHRcdH0gYXMgSUd1bkVwdWJEYXRhXG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG51bGxcblx0XHR9KVxuXHRcdC5jYXRjaChlID0+IG51bGwpXG5cdFx0O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcHV0SVBGU0VwdWJGaWxlKF9zaXRlSUQ6IHN0cmluZyB8IHN0cmluZ1tdLFxuXHRfbm92ZWxJRDogc3RyaW5nIHwgc3RyaW5nW10sXG5cdGd1bkRhdGE6IElHdW5FcHViTm9kZSxcblx0b3B0aW9ucz86IHtcblx0XHRxdWVyeT86IHtcblx0XHRcdGRlYnVnPzogYm9vbGVhbixcblx0XHRcdGZvcmNlPzogYm9vbGVhbixcblx0XHR9LFxuXHR9LFxuKVxue1xuXHQoeyBzaXRlSUQ6IF9zaXRlSUQsIG5vdmVsSUQ6IF9ub3ZlbElEIH0gPSBoYW5kbGVBcmd2TGlzdChfc2l0ZUlELCBfbm92ZWxJRCkpO1xuXG5cdGxldCBzaXRlSUQgPSBfc2l0ZUlEWzBdO1xuXHRsZXQgbm92ZWxJRCA9IF9ub3ZlbElEWzBdO1xuXG5cdGxldCB7IGJhc2U2NCwgLi4uZGF0YSB9ID0gZ3VuRGF0YTtcblxuXHRsZXQgY29udGVudCA9IEJ1ZmZlci5mcm9tKGJhc2U2NCwgJ2Jhc2U2NCcpO1xuXG5cdGxldCB7IGlwZnMgfSA9IGF3YWl0IHVzZUlQRlMoKVxuXHRcdC5jYXRjaChlID0+IGNvbnNvbGUuZXJyb3IoZSkgYXMgbnVsbClcblx0O1xuXG5cdGlmICghaXBmcylcblx0e1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0aWYgKCFkYXRhLmhyZWYpXG5cdHtcblx0XHRsZXQgY2lkOiBzdHJpbmc7XG5cblx0XHRjb25zb2xlLmRpcihkYXRhKTtcblxuXHRcdGNvbnNvbGUuZGVidWcoYGFkZCB0byBJUEZTYCk7XG5cblx0XHRmb3IgYXdhaXQgKGNvbnN0IHJlc3VsdCBvZiBpcGZzLmFkZCh7XG5cdFx0XHRwYXRoOiBkYXRhLmZpbGVuYW1lLFxuXHRcdFx0Y29udGVudCxcblx0XHR9LCB7XG5cdFx0XHRwaW46IGZhbHNlLFxuXHRcdH0pKVxuXHRcdHtcblx0XHRcdGNvbnNvbGUuZGVidWcocmVzdWx0KTtcblx0XHRcdGNvbnNvbGUuZGVidWcoY2lkID0gcmVzdWx0LmNpZC50b1N0cmluZygpKVxuXHRcdH1cblxuXHRcdGRhdGEuaHJlZiA9IHRvTGluayhjaWQsIGRhdGEuZmlsZW5hbWUpO1xuXHR9XG5cblx0Y29uc29sZS5zdWNjZXNzKGRhdGEuaHJlZik7XG5cdC8vIEB0cy1pZ25vcmVcblx0ZGVsZXRlIGRhdGEuYmFzZTY0O1xuXG5cdGF3YWl0IHB1dEVwdWJGaWxlSW5mbyhzaXRlSUQsIG5vdmVsSUQsIGRhdGEgYXMgYW55KVxuXHRcdC50YXAoYXN5bmMgKHYpID0+IHtcblx0XHRcdGxldCBqc29uID0gYXdhaXQgdi5qc29uKCk7XG5cblx0XHRcdGNvbnNvbGUuZGVidWcoYHB1dEVwdWJGaWxlSW5mbzpyZXR1cm5gLCBqc29uKTtcblxuXHRcdFx0Qmx1ZWJpcmRcblx0XHRcdFx0LmRlbGF5KDUgKiAxMDAwKVxuXHRcdFx0XHQudGhlbigoKSA9PiBmZXRjaElQRlMoanNvbi5kYXRhLmhyZWYpKVxuXHRcdFx0XHQuY2F0Y2goZSA9PiBudWxsKVxuXHRcdFx0O1xuXG5cdFx0fSlcblx0XHQudGFwQ2F0Y2godiA9PiBjb25zb2xlLmVycm9yKHYpKVxufVxuIl19