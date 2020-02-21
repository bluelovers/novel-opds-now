"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ3VuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQW9GO0FBQ3BGLHlDQUErQztBQUMvQyxpRUFBNEM7QUFFNUMsaUVBQTBDO0FBQzFDLHVDQUF3QztBQUV4QyxTQUFnQixjQUFjLENBQUMsT0FBMEIsRUFBRSxRQUEyQixFQUFFLE9BS3ZGO0lBRUEsSUFBSSxFQUFFLEtBQUssR0FBRyxFQUFFLEVBQUUsR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO0lBRW5DLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsc0JBQWMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFFNUQsT0FBTywwQkFBZSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUM7U0FDckMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUVwQixJQUFJLElBQUksR0FBWSxtQkFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXZDLElBQUksQ0FBQyxtQkFBWSxDQUFDLElBQUksQ0FBQyxFQUN2QjtZQUNDLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLENBRXZELENBQUM7WUFFSCxJQUFJLEdBQUcsR0FBRywwQkFBZSxDQUVyQixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFHM0IsU0FBUyxHQUFHLFNBQVMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFcEQsSUFBSSxPQUFPLFNBQVMsS0FBSyxRQUFRLEVBQ2pDO2dCQUVDLFFBQVEsR0FBRyxRQUFRLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUVqRCxJQUFJLE9BQU8sUUFBUSxLQUFLLFFBQVEsRUFD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Q0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQywwQkFBZSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNuRixDQUFDO0FBWEQsd0NBV0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByYWNlR3VuRXB1YkZpbGUsIG5vZGVHdW5FcHViRmlsZSwgbWFrZUFycmF5RW50cnlzIH0gZnJvbSAnLi4vZ3VuL2VwdWJGaWxlJztcbmltcG9ydCB7IGhhbmRsZUFyZ3ZMaXN0IH0gZnJvbSAnLi4vdXRpbC9pbmRleCc7XG5pbXBvcnQgY2hlY2tHdW5EYXRhIGZyb20gJy4uL2d1bi9jaGVja0RhdGEnO1xuaW1wb3J0IHsgSUd1bkVwdWJOb2RlLCBJR3VuRXB1YkRhdGEgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgY29uc29sZSBmcm9tICdkZWJ1Zy1jb2xvcjIvbG9nZ2VyJztcbmltcG9ydCB7IFRpbWVvdXRFcnJvciB9IGZyb20gJ2JsdWViaXJkJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEd1bkVwdWJGaWxlKF9zaXRlSUQ6IHN0cmluZyB8IHN0cmluZ1tdLCBfbm92ZWxJRDogc3RyaW5nIHwgc3RyaW5nW10sIG9wdGlvbnM6IHtcblx0cXVlcnk6IHtcblx0XHRkZWJ1Zz86IGJvb2xlYW4sXG5cdFx0Zm9yY2U/OiBib29sZWFuLFxuXHR9LFxufSlcbntcblx0bGV0IHsgcXVlcnkgPSB7fSB9ID0gb3B0aW9ucyB8fCB7fTtcblxuXHRsZXQgeyBzaXRlSUQsIG5vdmVsSUQgfSA9IGhhbmRsZUFyZ3ZMaXN0KF9zaXRlSUQsIF9ub3ZlbElEKTtcblxuXHRyZXR1cm4gcmFjZUd1bkVwdWJGaWxlKHNpdGVJRCwgbm92ZWxJRClcblx0XHQudGhlbihhc3luYyAoZGF0YSkgPT5cblx0XHR7XG5cdFx0XHRsZXQgYm9vbDogYm9vbGVhbiA9IGNoZWNrR3VuRGF0YShkYXRhKTtcblxuXHRcdFx0aWYgKCFjaGVja0d1bkRhdGEoZGF0YSkpXG5cdFx0XHR7XG5cdFx0XHRcdGxldCB7IGJhc2U2NCwgZmlsZW5hbWUsIGV4aXN0cywgdGltZXN0YW1wIH0gPSAoZGF0YSB8fCB7fSkgYXMgRXhjbHVkZTxJR3VuRXB1Yk5vZGUsIHtcblx0XHRcdFx0XHRleGlzdHM6IGZhbHNlLFxuXHRcdFx0XHR9PjtcblxuXHRcdFx0XHRsZXQgZ3VuID0gbm9kZUd1bkVwdWJGaWxlPEV4Y2x1ZGU8SUd1bkVwdWJOb2RlLCB7XG5cdFx0XHRcdFx0ZXhpc3RzOiBmYWxzZSxcblx0XHRcdFx0fT4+KHNpdGVJRFswXSwgbm92ZWxJRFswXSk7XG5cblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHR0aW1lc3RhbXAgPSB0aW1lc3RhbXAgfHwgYXdhaXQgZ3VuLmdldCgndGltZXN0YW1wJyk7XG5cblx0XHRcdFx0aWYgKHR5cGVvZiB0aW1lc3RhbXAgPT09ICdudW1iZXInKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdGZpbGVuYW1lID0gZmlsZW5hbWUgfHwgYXdhaXQgZ3VuLmdldCgnZmlsZW5hbWUnKTtcblxuXHRcdFx0XHRcdGlmICh0eXBlb2YgZmlsZW5hbWUgPT09ICdzdHJpbmcnKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdGJhc2U2NCA9IGJhc2U2NCB8fCBhd2FpdCBndW4uZ2V0KCdiYXNlNjQnKTtcblxuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBiYXNlNjQgPT09ICdzdHJpbmcnKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRkYXRhID0ge1xuXHRcdFx0XHRcdFx0XHRcdGJhc2U2NCxcblx0XHRcdFx0XHRcdFx0XHRleGlzdHM6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFx0ZmlsZW5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0dGltZXN0YW1wLFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjaGVja0d1bkRhdGEoZGF0YSkpXG5cdFx0XHR7XG5cdFx0XHRcdGxldCB7IGJhc2U2NCwgZmlsZW5hbWUsIGV4aXN0cywgdGltZXN0YW1wIH0gPSBkYXRhO1xuXHRcdFx0XHRsZXQgaXNHdW4gPSBmYWxzZTtcblxuXHRcdFx0XHRjb25zb2xlLmluZm8oYOaWvFAyUOe3qeWtmOeZvOePvuaqlOahiC4uLmAsIG5ldyBEYXRlKHRpbWVzdGFtcCkpO1xuXG5cdFx0XHRcdGlmIChxdWVyeS5kZWJ1ZyB8fCBxdWVyeS5mb3JjZSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNvbnNvbGUuaW5mbyhg55m854++5by35Yi25LiL6LyJ5oyH5Luk77yM5pys5qyh5bCH54Sh6KaW57ep5a2YYCwgcXVlcnkpXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoKERhdGUubm93KCkgLSBkYXRhLnRpbWVzdGFtcCkgPCA4NjQwMCAqIDEwMDApXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpc0d1biA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y29uc29sZS53YXJuKGDnm67mqJnmqpTmoYjlt7LpgY7mnJ/vvIzoqablnJbph43mlrDlu7rnq4vmqpTmoYhgKVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRiYXNlNjQsXG5cdFx0XHRcdFx0ZmlsZW5hbWUsXG5cdFx0XHRcdFx0ZXhpc3RzLFxuXHRcdFx0XHRcdHRpbWVzdGFtcCxcblx0XHRcdFx0XHRpc0d1bixcblx0XHRcdFx0fSBhcyBJR3VuRXB1YkRhdGFcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKGJvb2wgPT09IGZhbHNlKVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zb2xlLndhcm4oYOaWvFAyUOe3qeWtmOeZvOePvuaqlOahiC4uLmAsIGDkvYbos4fmlpnkvLzkuY7lt7LmkI3mr4BgKTtcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0Y29uc29sZS5pbmZvKGDmspLmnInnmbznj75QMlDnt6nlrZguLi5gKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG51bGxcblx0XHR9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0R3VuRXB1YkZpbGUyKF9zaXRlSUQ6IHN0cmluZyB8IHN0cmluZ1tdLCBfbm92ZWxJRDogc3RyaW5nIHwgc3RyaW5nW10sIG9wdGlvbnM6IHtcblx0cXVlcnk6IHtcblx0XHRkZWJ1Zz86IGJvb2xlYW4sXG5cdFx0Zm9yY2U/OiBib29sZWFuLFxuXHR9LFxufSlcbntcblx0bGV0IHsgcXVlcnkgPSB7fSB9ID0gb3B0aW9ucyB8fCB7fTtcblx0bGV0IHsgc2l0ZUlELCBub3ZlbElEIH0gPSBoYW5kbGVBcmd2TGlzdChfc2l0ZUlELCBfbm92ZWxJRCk7XG5cblx0cmV0dXJuIHJhY2VHdW5FcHViRmlsZShzaXRlSUQsIG5vdmVsSUQpXG5cdFx0LnRoZW4oYXN5bmMgKGRhdGEpID0+XG5cdFx0e1xuXHRcdFx0aWYgKGNoZWNrR3VuRGF0YShkYXRhKSlcblx0XHRcdHtcblx0XHRcdFx0bGV0IHsgYmFzZTY0LCBmaWxlbmFtZSwgZXhpc3RzLCB0aW1lc3RhbXAgfSA9IGRhdGE7XG5cdFx0XHRcdGxldCBpc0d1biA9IHRydWU7XG5cblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRiYXNlNjQsXG5cdFx0XHRcdFx0ZmlsZW5hbWUsXG5cdFx0XHRcdFx0ZXhpc3RzLFxuXHRcdFx0XHRcdHRpbWVzdGFtcCxcblx0XHRcdFx0XHRpc0d1bixcblx0XHRcdFx0fSBhcyBJR3VuRXB1YkRhdGFcblx0XHRcdH1cblx0XHR9KVxuXHRcdC50aW1lb3V0KDEwICogMTAwMClcblx0XHQuY2F0Y2goVGltZW91dEVycm9yLCBlID0+IG51bGwpXG5cdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHB1dEd1bkVwdWJGaWxlKF9zaXRlSUQ6IHN0cmluZyB8IHN0cmluZ1tdLCBfbm92ZWxJRDogc3RyaW5nIHwgc3RyaW5nW10sIGd1bkRhdGE6IElHdW5FcHViTm9kZSwgb3B0aW9ucz86IHtcblx0cXVlcnk/OiB7XG5cdFx0ZGVidWc/OiBib29sZWFuLFxuXHRcdGZvcmNlPzogYm9vbGVhbixcblx0fSxcbn0pXG57XG5cdGxldCB7IHNpdGVJRCwgbm92ZWxJRCB9ID0gaGFuZGxlQXJndkxpc3QoX3NpdGVJRCwgX25vdmVsSUQpO1xuXG5cdG1ha2VBcnJheUVudHJ5cyhzaXRlSUQsIG5vdmVsSUQpXG5cdFx0LmZvckVhY2goKFtzaXRlSUQsIG5vdmVsX2lkXSkgPT4gbm9kZUd1bkVwdWJGaWxlKHNpdGVJRCwgbm92ZWxfaWQpLnB1dChndW5EYXRhKSk7XG59XG4iXX0=