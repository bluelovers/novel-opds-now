"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.putGunEpubFile = exports.getGunEpubFile2 = exports.getGunEpubFile = void 0;
const epubFile_1 = require("../gun/epubFile");
const index_1 = require("../util/index");
const checkData_1 = __importDefault(require("../gun/checkData"));
const logger_1 = __importDefault(require("debug-color2/logger"));
const bluebird_1 = require("bluebird");
function getGunEpubFile(_siteID, _novelID, options) {
    let { query = {} } = options || {};
    let { siteID, novelID } = index_1.handleArgvList(_siteID, _novelID);
    return epubFile_1.raceGunEpubFile(siteID, novelID)
        .then(async (data) => {
        let bool = checkData_1.default(data);
        if (!checkData_1.default(data)) {
            let { base64, filename, exists, timestamp } = (data || {});
            let gun = epubFile_1.nodeGunEpubFile(siteID[0], novelID[0]);
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
        if (checkData_1.default(data)) {
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
    let { siteID, novelID } = index_1.handleArgvList(_siteID, _novelID);
    return epubFile_1.raceGunEpubFile(siteID, novelID)
        .then(async (data) => {
        if (checkData_1.default(data)) {
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
    let { siteID, novelID } = index_1.handleArgvList(_siteID, _novelID);
    epubFile_1.makeArrayEntrys(siteID, novelID)
        .forEach(([siteID, novel_id]) => epubFile_1.nodeGunEpubFile(siteID, novel_id).put(gunData));
}
exports.putGunEpubFile = putGunEpubFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ3VuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDhDQUFvRjtBQUNwRix5Q0FBK0M7QUFDL0MsaUVBQTRDO0FBRTVDLGlFQUEwQztBQUMxQyx1Q0FBd0M7QUFFeEMsU0FBZ0IsY0FBYyxDQUFDLE9BQTBCLEVBQUUsUUFBMkIsRUFBRSxPQUt2RjtJQUVBLElBQUksRUFBRSxLQUFLLEdBQUcsRUFBRSxFQUFFLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztJQUVuQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLHNCQUFjLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBRTVELE9BQU8sMEJBQWUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDO1NBQ3JDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7UUFFcEIsSUFBSSxJQUFJLEdBQVksbUJBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV2QyxJQUFJLENBQUMsbUJBQVksQ0FBQyxJQUFJLENBQUMsRUFDdkI7WUFDQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUV2RCxDQUFDO1lBRUgsSUFBSSxHQUFHLEdBQUcsMEJBQWUsQ0FFckIsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRzNCLFNBQVMsR0FBRyxTQUFTLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRXBELElBQUksT0FBTyxTQUFTLEtBQUssUUFBUSxFQUNqQztnQkFFQyxRQUFRLEdBQUcsUUFBUSxJQUFJLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFFakQsSUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLEVB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LENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFLENBQUMsMEJBQWUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDbkYsQ0FBQztBQVhELHdDQVdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcmFjZUd1bkVwdWJGaWxlLCBub2RlR3VuRXB1YkZpbGUsIG1ha2VBcnJheUVudHJ5cyB9IGZyb20gJy4uL2d1bi9lcHViRmlsZSc7XG5pbXBvcnQgeyBoYW5kbGVBcmd2TGlzdCB9IGZyb20gJy4uL3V0aWwvaW5kZXgnO1xuaW1wb3J0IGNoZWNrR3VuRGF0YSBmcm9tICcuLi9ndW4vY2hlY2tEYXRhJztcbmltcG9ydCB7IElHdW5FcHViTm9kZSwgSUd1bkVwdWJEYXRhIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IGNvbnNvbGUgZnJvbSAnZGVidWctY29sb3IyL2xvZ2dlcic7XG5pbXBvcnQgeyBUaW1lb3V0RXJyb3IgfSBmcm9tICdibHVlYmlyZCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRHdW5FcHViRmlsZShfc2l0ZUlEOiBzdHJpbmcgfCBzdHJpbmdbXSwgX25vdmVsSUQ6IHN0cmluZyB8IHN0cmluZ1tdLCBvcHRpb25zOiB7XG5cdHF1ZXJ5OiB7XG5cdFx0ZGVidWc/OiBib29sZWFuLFxuXHRcdGZvcmNlPzogYm9vbGVhbixcblx0fSxcbn0pXG57XG5cdGxldCB7IHF1ZXJ5ID0ge30gfSA9IG9wdGlvbnMgfHwge307XG5cblx0bGV0IHsgc2l0ZUlELCBub3ZlbElEIH0gPSBoYW5kbGVBcmd2TGlzdChfc2l0ZUlELCBfbm92ZWxJRCk7XG5cblx0cmV0dXJuIHJhY2VHdW5FcHViRmlsZShzaXRlSUQsIG5vdmVsSUQpXG5cdFx0LnRoZW4oYXN5bmMgKGRhdGEpID0+XG5cdFx0e1xuXHRcdFx0bGV0IGJvb2w6IGJvb2xlYW4gPSBjaGVja0d1bkRhdGEoZGF0YSk7XG5cblx0XHRcdGlmICghY2hlY2tHdW5EYXRhKGRhdGEpKVxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgeyBiYXNlNjQsIGZpbGVuYW1lLCBleGlzdHMsIHRpbWVzdGFtcCB9ID0gKGRhdGEgfHwge30pIGFzIEV4Y2x1ZGU8SUd1bkVwdWJOb2RlLCB7XG5cdFx0XHRcdFx0ZXhpc3RzOiBmYWxzZSxcblx0XHRcdFx0fT47XG5cblx0XHRcdFx0bGV0IGd1biA9IG5vZGVHdW5FcHViRmlsZTxFeGNsdWRlPElHdW5FcHViTm9kZSwge1xuXHRcdFx0XHRcdGV4aXN0czogZmFsc2UsXG5cdFx0XHRcdH0+PihzaXRlSURbMF0sIG5vdmVsSURbMF0pO1xuXG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0dGltZXN0YW1wID0gdGltZXN0YW1wIHx8IGF3YWl0IGd1bi5nZXQoJ3RpbWVzdGFtcCcpO1xuXG5cdFx0XHRcdGlmICh0eXBlb2YgdGltZXN0YW1wID09PSAnbnVtYmVyJylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRmaWxlbmFtZSA9IGZpbGVuYW1lIHx8IGF3YWl0IGd1bi5nZXQoJ2ZpbGVuYW1lJyk7XG5cblx0XHRcdFx0XHRpZiAodHlwZW9mIGZpbGVuYW1lID09PSAnc3RyaW5nJylcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0XHRiYXNlNjQgPSBiYXNlNjQgfHwgYXdhaXQgZ3VuLmdldCgnYmFzZTY0Jyk7XG5cblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgYmFzZTY0ID09PSAnc3RyaW5nJylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0ZGF0YSA9IHtcblx0XHRcdFx0XHRcdFx0XHRiYXNlNjQsXG5cdFx0XHRcdFx0XHRcdFx0ZXhpc3RzOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcdGZpbGVuYW1lLFxuXHRcdFx0XHRcdFx0XHRcdHRpbWVzdGFtcCxcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY2hlY2tHdW5EYXRhKGRhdGEpKVxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgeyBiYXNlNjQsIGZpbGVuYW1lLCBleGlzdHMsIHRpbWVzdGFtcCB9ID0gZGF0YTtcblx0XHRcdFx0bGV0IGlzR3VuID0gZmFsc2U7XG5cblx0XHRcdFx0Y29uc29sZS5pbmZvKGDmlrxQMlDnt6nlrZjnmbznj77mqpTmoYguLi5gLCBuZXcgRGF0ZSh0aW1lc3RhbXApKTtcblxuXHRcdFx0XHRpZiAocXVlcnkuZGVidWcgfHwgcXVlcnkuZm9yY2UpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjb25zb2xlLmluZm8oYOeZvOePvuW8t+WItuS4i+i8ieaMh+S7pO+8jOacrOasoeWwh+eEoeimlue3qeWtmGAsIHF1ZXJ5KVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKChEYXRlLm5vdygpIC0gZGF0YS50aW1lc3RhbXApIDwgODY0MDAgKiAxMDAwKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aXNHdW4gPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNvbnNvbGUud2Fybihg55uu5qiZ5qqU5qGI5bey6YGO5pyf77yM6Kmm5ZyW6YeN5paw5bu656uL5qqU5qGIYClcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0YmFzZTY0LFxuXHRcdFx0XHRcdGZpbGVuYW1lLFxuXHRcdFx0XHRcdGV4aXN0cyxcblx0XHRcdFx0XHR0aW1lc3RhbXAsXG5cdFx0XHRcdFx0aXNHdW4sXG5cdFx0XHRcdH0gYXMgSUd1bkVwdWJEYXRhXG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChib29sID09PSBmYWxzZSlcblx0XHRcdHtcblx0XHRcdFx0Y29uc29sZS53YXJuKGDmlrxQMlDnt6nlrZjnmbznj77mqpTmoYguLi5gLCBg5L2G6LOH5paZ5Ly85LmO5bey5pCN5q+AYCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnNvbGUuaW5mbyhg5rKS5pyJ55m854++UDJQ57ep5a2YLi4uYCk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBudWxsXG5cdFx0fSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEd1bkVwdWJGaWxlMihfc2l0ZUlEOiBzdHJpbmcgfCBzdHJpbmdbXSwgX25vdmVsSUQ6IHN0cmluZyB8IHN0cmluZ1tdLCBvcHRpb25zOiB7XG5cdHF1ZXJ5OiB7XG5cdFx0ZGVidWc/OiBib29sZWFuLFxuXHRcdGZvcmNlPzogYm9vbGVhbixcblx0fSxcbn0pXG57XG5cdGxldCB7IHF1ZXJ5ID0ge30gfSA9IG9wdGlvbnMgfHwge307XG5cdGxldCB7IHNpdGVJRCwgbm92ZWxJRCB9ID0gaGFuZGxlQXJndkxpc3QoX3NpdGVJRCwgX25vdmVsSUQpO1xuXG5cdHJldHVybiByYWNlR3VuRXB1YkZpbGUoc2l0ZUlELCBub3ZlbElEKVxuXHRcdC50aGVuKGFzeW5jIChkYXRhKSA9PlxuXHRcdHtcblx0XHRcdGlmIChjaGVja0d1bkRhdGEoZGF0YSkpXG5cdFx0XHR7XG5cdFx0XHRcdGxldCB7IGJhc2U2NCwgZmlsZW5hbWUsIGV4aXN0cywgdGltZXN0YW1wIH0gPSBkYXRhO1xuXHRcdFx0XHRsZXQgaXNHdW4gPSB0cnVlO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0YmFzZTY0LFxuXHRcdFx0XHRcdGZpbGVuYW1lLFxuXHRcdFx0XHRcdGV4aXN0cyxcblx0XHRcdFx0XHR0aW1lc3RhbXAsXG5cdFx0XHRcdFx0aXNHdW4sXG5cdFx0XHRcdH0gYXMgSUd1bkVwdWJEYXRhXG5cdFx0XHR9XG5cdFx0fSlcblx0XHQudGltZW91dCgxMCAqIDEwMDApXG5cdFx0LmNhdGNoKFRpbWVvdXRFcnJvciwgZSA9PiBudWxsKVxuXHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwdXRHdW5FcHViRmlsZShfc2l0ZUlEOiBzdHJpbmcgfCBzdHJpbmdbXSwgX25vdmVsSUQ6IHN0cmluZyB8IHN0cmluZ1tdLCBndW5EYXRhOiBJR3VuRXB1Yk5vZGUsIG9wdGlvbnM/OiB7XG5cdHF1ZXJ5Pzoge1xuXHRcdGRlYnVnPzogYm9vbGVhbixcblx0XHRmb3JjZT86IGJvb2xlYW4sXG5cdH0sXG59KVxue1xuXHRsZXQgeyBzaXRlSUQsIG5vdmVsSUQgfSA9IGhhbmRsZUFyZ3ZMaXN0KF9zaXRlSUQsIF9ub3ZlbElEKTtcblxuXHRtYWtlQXJyYXlFbnRyeXMoc2l0ZUlELCBub3ZlbElEKVxuXHRcdC5mb3JFYWNoKChbc2l0ZUlELCBub3ZlbF9pZF0pID0+IG5vZGVHdW5FcHViRmlsZShzaXRlSUQsIG5vdmVsX2lkKS5wdXQoZ3VuRGF0YSkpO1xufVxuIl19