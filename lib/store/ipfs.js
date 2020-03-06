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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXBmcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImlwZnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUErQztBQUMvQyx5Q0FBaUU7QUFDakUscURBQWtEO0FBQ2xELGlFQUE0QztBQUM1Qyw0REFBbUM7QUFDbkMsd0RBQStCO0FBRS9CLGlFQUEwQztBQUMxQyw2Q0FBcUM7QUFFckMsU0FBZ0IsZUFBZSxDQUFDLE9BQTBCLEVBQUUsUUFBMkIsRUFBRSxPQUt4RjtJQUVBLElBQUksRUFBRSxLQUFLLEdBQUcsRUFBRSxFQUFFLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztJQUVuQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLHNCQUFjLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBRTVELE9BQU8sdUJBQWUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDO1NBQ3JDLEtBQUssQ0FBQyx1QkFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO1NBQzlCLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7UUFFcEIsSUFBSSxtQkFBWSxDQUFDLElBQUksQ0FBQyxFQUN0QjtZQUNDLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLGtCQUFPLEVBQUU7aUJBQzVCLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGdCQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBUyxDQUFDLENBQ3JDO1lBRUQsSUFBSSxHQUFHLEdBQUcsTUFBTSxvQkFBUyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2lCQUN4QyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FDakI7WUFFRCxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxFQUNyQjtnQkFDQyxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcs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LGdCQUFPLENBQUMsS0FBSyxDQUFDLHdCQUF3QixFQUFFLElBQUksQ0FBQyxDQUFDO1FBRTlDLGtCQUFRO2FBQ04sS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7YUFDZixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsb0JBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3JDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUNqQjtJQUVGLENBQUMsQ0FBQztTQUNELFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGdCQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDbEMsQ0FBQztBQXJFRCwwQ0FxRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoYW5kbGVBcmd2TGlzdCB9IGZyb20gJy4uL3V0aWwvaW5kZXgnO1xuaW1wb3J0IHsgZ2V0RXB1YkZpbGVJbmZvLCBwdXRFcHViRmlsZUluZm8gfSBmcm9tICcuLi9pcGZzL2luZGV4JztcbmltcG9ydCBCbHVlYmlyZCwgeyBUaW1lb3V0RXJyb3IgfSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgY2hlY2tHdW5EYXRhIGZyb20gJy4uL2d1bi9jaGVja0RhdGEnO1xuaW1wb3J0IGZldGNoSVBGUyBmcm9tICdmZXRjaC1pcGZzJztcbmltcG9ydCB1c2VJUEZTIGZyb20gJ3VzZS1pcGZzJztcbmltcG9ydCB7IElHdW5FcHViRGF0YSwgSUd1bkVwdWJOb2RlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IGNvbnNvbGUgZnJvbSAnZGVidWctY29sb3IyL2xvZ2dlcic7XG5pbXBvcnQgeyB0b0xpbmsgfSBmcm9tICd0by1pcGZzLXVybCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJUEZTRXB1YkZpbGUoX3NpdGVJRDogc3RyaW5nIHwgc3RyaW5nW10sIF9ub3ZlbElEOiBzdHJpbmcgfCBzdHJpbmdbXSwgb3B0aW9uczoge1xuXHRxdWVyeToge1xuXHRcdGRlYnVnPzogYm9vbGVhbixcblx0XHRmb3JjZT86IGJvb2xlYW4sXG5cdH0sXG59KVxue1xuXHRsZXQgeyBxdWVyeSA9IHt9IH0gPSBvcHRpb25zIHx8IHt9O1xuXG5cdGxldCB7IHNpdGVJRCwgbm92ZWxJRCB9ID0gaGFuZGxlQXJndkxpc3QoX3NpdGVJRCwgX25vdmVsSUQpO1xuXG5cdHJldHVybiBnZXRFcHViRmlsZUluZm8oc2l0ZUlELCBub3ZlbElEKVxuXHRcdC5jYXRjaChUaW1lb3V0RXJyb3IsIGUgPT4gbnVsbClcblx0XHQudGhlbihhc3luYyAoZGF0YSkgPT5cblx0XHR7XG5cdFx0XHRpZiAoY2hlY2tHdW5EYXRhKGRhdGEpKVxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgeyBpcGZzIH0gPSBhd2FpdCB1c2VJUEZTKClcblx0XHRcdFx0XHQuY2F0Y2goZSA9PiBjb25zb2xlLmVycm9yKGUpIGFzIG51bGwpXG5cdFx0XHRcdDtcblxuXHRcdFx0XHRsZXQgYnVmID0gYXdhaXQgZmV0Y2hJUEZTKGRhdGEuaHJlZiwgaXBmcylcblx0XHRcdFx0XHQuY2F0Y2goZSA9PiBudWxsKVxuXHRcdFx0XHQ7XG5cblx0XHRcdFx0aWYgKGJ1ZiAmJiBidWYubGVuZ3RoKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0ZGF0YS5iYXNlNjQgPSBidWYudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuXG5cdFx0XHRcdFx0bGV0IHsgYmFzZTY0LCBmaWxlbmFtZSwgZXhpc3RzLCB0aW1lc3RhbXAsIGhyZWYgfSA9IGRhdGE7XG5cblx0XHRcdFx0XHRsZXQgaXNHdW4gPSBmYWxzZTtcblxuXHRcdFx0XHRcdGlmIChxdWVyeS5kZWJ1ZyB8fCBxdWVyeS5mb3JjZSlcblx0XHRcdFx0XHR7XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSBpZiAoKERhdGUubm93KCkgLSBkYXRhLnRpbWVzdGFtcCkgPCA4NjQwMCAqIDEwMDApXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aXNHdW4gPSB0cnVlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRiYXNlNjQsXG5cdFx0XHRcdFx0XHRmaWxlbmFtZSxcblx0XHRcdFx0XHRcdGV4aXN0cyxcblx0XHRcdFx0XHRcdHRpbWVzdGFtcCxcblx0XHRcdFx0XHRcdGlzR3VuLFxuXHRcdFx0XHRcdFx0aHJlZixcblx0XHRcdFx0XHR9IGFzIElHdW5FcHViRGF0YVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBudWxsXG5cdFx0fSlcblx0XHQuY2F0Y2goZSA9PiBudWxsKVxuXHRcdDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHB1dElQRlNFcHViRmlsZShfc2l0ZUlEOiBzdHJpbmcgfCBzdHJpbmdbXSxcblx0X25vdmVsSUQ6IHN0cmluZyB8IHN0cmluZ1tdLFxuXHRndW5EYXRhOiBJR3VuRXB1Yk5vZGUsXG5cdG9wdGlvbnM/OiB7XG5cdFx0cXVlcnk/OiB7XG5cdFx0XHRkZWJ1Zz86IGJvb2xlYW4sXG5cdFx0XHRmb3JjZT86IGJvb2xlYW4sXG5cdFx0fSxcblx0fSxcbilcbntcblx0KHsgc2l0ZUlEOiBfc2l0ZUlELCBub3ZlbElEOiBfbm92ZWxJRCB9ID0gaGFuZGxlQXJndkxpc3QoX3NpdGVJRCwgX25vdmVsSUQpKTtcblxuXHRsZXQgc2l0ZUlEID0gX3NpdGVJRFswXTtcblx0bGV0IG5vdmVsSUQgPSBfbm92ZWxJRFswXTtcblxuXHRsZXQgeyBiYXNlNjQsIC4uLmRhdGEgfSA9IGd1bkRhdGE7XG5cblx0bGV0IGNvbnRlbnQgPSBCdWZmZXIuZnJvbShiYXNlNjQsICdiYXNlNjQnKTtcblxuXHRsZXQgeyBpcGZzIH0gPSBhd2FpdCB1c2VJUEZTKClcblx0XHQuY2F0Y2goZSA9PiBjb25zb2xlLmVycm9yKGUpIGFzIG51bGwpXG5cdDtcblxuXHRpZiAoIWlwZnMpXG5cdHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdGlmICghZGF0YS5ocmVmKVxuXHR7XG5cdFx0bGV0IGNpZDogc3RyaW5nO1xuXG5cdFx0Y29uc29sZS5kaXIoZGF0YSk7XG5cblx0XHRjb25zb2xlLmRlYnVnKGBhZGQgdG8gSVBGU2ApO1xuXG5cdFx0Zm9yIGF3YWl0IChjb25zdCByZXN1bHQgb2YgaXBmcy5hZGQoe1xuXHRcdFx0cGF0aDogZGF0YS5maWxlbmFtZSxcblx0XHRcdGNvbnRlbnQsXG5cdFx0fSwge1xuXHRcdFx0cGluOiBmYWxzZSxcblx0XHR9KSlcblx0XHR7XG5cdFx0XHRjb25zb2xlLmRlYnVnKHJlc3VsdCk7XG5cdFx0XHRjb25zb2xlLmRlYnVnKGNpZCA9IHJlc3VsdC5jaWQudG9TdHJpbmcoKSlcblx0XHR9XG5cblx0XHRkYXRhLmhyZWYgPSB0b0xpbmsoY2lkLCBkYXRhLmZpbGVuYW1lKTtcblx0fVxuXG5cdGNvbnNvbGUuc3VjY2VzcyhkYXRhLmhyZWYpO1xuXHQvLyBAdHMtaWdub3JlXG5cdGRlbGV0ZSBkYXRhLmJhc2U2NDtcblxuXHRhd2FpdCBwdXRFcHViRmlsZUluZm8oc2l0ZUlELCBub3ZlbElELCBkYXRhIGFzIGFueSlcblx0XHQudGFwKGFzeW5jICh2KSA9PiB7XG5cdFx0XHRsZXQganNvbiA9IGF3YWl0IHYuanNvbigpO1xuXG5cdFx0XHRjb25zb2xlLmRlYnVnKGBwdXRFcHViRmlsZUluZm86cmV0dXJuYCwganNvbik7XG5cblx0XHRcdEJsdWViaXJkXG5cdFx0XHRcdC5kZWxheSg1ICogMTAwMClcblx0XHRcdFx0LnRoZW4oKCkgPT4gZmV0Y2hJUEZTKGpzb24uZGF0YS5ocmVmKSlcblx0XHRcdFx0LmNhdGNoKGUgPT4gbnVsbClcblx0XHRcdDtcblxuXHRcdH0pXG5cdFx0LnRhcENhdGNoKHYgPT4gY29uc29sZS5lcnJvcih2KSlcbn1cbiJdfQ==