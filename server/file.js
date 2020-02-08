"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bluebird_1 = __importDefault(require("bluebird"));
const const_1 = require("novel-downloader/src/all/const");
const const_2 = require("../lib/const");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const stream_1 = require("stream");
const file_type_1 = require("file-type");
const __root_1 = __importDefault(require("../lib/__root"));
const epubFile_1 = require("../lib/gun/epubFile");
const util_1 = require("novel-downloader/src/all/util");
const logger_1 = __importDefault(require("debug-color2/logger"));
const checkData_1 = __importDefault(require("../lib/gun/checkData"));
const cross_spawn_extra_1 = require("cross-spawn-extra");
function fileHandler() {
    const router = express_1.Router();
    router.use('/:siteID/:novelID', (req, res) => {
        let query = {
            ...req.params,
            ...req.query,
        };
        delete query.siteID;
        delete query.id;
        logger_1.default.debug(req.baseUrl, req.url, req.params, query);
        let siteID = String(req.params.siteID || '')
            .trim()
            .replace(/\.xml$|[\/\\]+/ig, '');
        let novel_id = String(req.params.novelID || '')
            .trim();
        if (siteID.toLowerCase() === 'dmzj') {
            siteID = const_1.EnumNovelSiteList.NovelSiteDmzjApi;
        }
        let IDKEY = util_1.siteID2IDKEY(siteID);
        let map_file = const_2.__cacheMapFile;
        return bluebird_1.default
            .resolve(IDKEY)
            .tap(IDKEY => {
            if (!IDKEY) {
                return Promise.reject(new Error(`${siteID} 模組不存在`));
            }
            if (!novel_id) {
                return Promise.reject(new Error(`沒有指定需要下載的 id: '${novel_id}'`));
            }
        })
            .then(async () => {
            let gunData = await epubFile_1.raceGunEpubFile([
                IDKEY,
            ], [
                req.params.novelID,
                novel_id,
            ])
                .then(async (data) => {
                let bool = checkData_1.default(data);
                if (!checkData_1.default(data)) {
                    let { base64, filename, exists, timestamp } = (data || {});
                    let gun = epubFile_1.nodeGunEpubFile(IDKEY, req.params.novelID);
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
            return gunData;
        })
            .then(async (gunData) => {
            return Promise.resolve()
                .then(async () => {
                if (gunData && gunData.isGun) {
                    return gunData;
                }
                logger_1.default.log(`取得檔案中...`);
                let cp = await cross_spawn_extra_1.async('node', [
                    '--experimental-worker',
                    path_1.join(__root_1.default, `./cli/cli.js`),
                    '--mod',
                    'all',
                    '--siteID',
                    siteID,
                    '--novel_id',
                    novel_id,
                ], {
                    stdio: 'inherit',
                });
                if (cp.error) {
                    return Promise.reject(cp.error);
                }
                let map = await fs_extra_1.readJSON(map_file)
                    .catch(e => null);
                if (!gunData && (!map || !map[IDKEY] || !map[IDKEY][novel_id])) {
                    gunData = await epubFile_1.raceGunEpubFile([
                        IDKEY,
                    ], [
                        req.params.novelID,
                        novel_id,
                    ]).then(async (data) => {
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
                    });
                    if (gunData) {
                        return gunData;
                    }
                }
                if (!map || !map[IDKEY] || !map[IDKEY][novel_id]) {
                    logger_1.default.dir(map);
                    return Promise.reject(new Error(`建立檔案時失敗，${siteID} ${novel_id} 可能不存在或解析失敗...`));
                }
                else if (map[IDKEY][novel_id].status === 504) {
                    let e = new Error(`抓取 ${siteID} ${novel_id} 來源時失敗，伺服器可能忙碌或拒絕回應，請之後再重試...`);
                    e.StatusCode = 504;
                    return Promise.reject(e);
                }
                let _data = map[IDKEY][novel_id];
                delete map[IDKEY][_data.novel_id2];
                delete map[IDKEY][_data.novel_id];
                await fs_extra_1.writeJSON(map_file, map, { spaces: 2 }).catch(e => {
                    logger_1.default.error(`發生錯誤，無法寫入緩存檔案 ${map_file}`);
                    logger_1.default.error(e);
                });
                return _data;
            })
                .catch(e => {
                if (gunData && gunData.exists) {
                    logger_1.default.warn(`檔案建立失敗，使用P2P緩存代替`);
                    gunData.isGun = true;
                    return gunData;
                }
                return Promise.reject(e);
            });
        })
            .then(async (data) => {
            logger_1.default.success(`成功取得檔案...`);
            let fileContents = data.base64 && Buffer.from(data.base64, 'base64') || await fs_extra_1.readFile(data.epub);
            let filename = data.filename || IDKEY + '_' + path_1.basename(data.epub);
            if (!data.isGun || true) {
                logger_1.default.debug(`將檔案儲存到P2P緩存`);
                let gunData = {
                    timestamp: data.isGun ? data.timestamp : Date.now(),
                    exists: true,
                    filename,
                    base64: fileContents.toString('base64'),
                };
                epubFile_1.makeArrayEntrys([
                    IDKEY,
                ], [
                    novel_id,
                    req.params.novelID,
                    data.novel_id,
                    data.novel_id2,
                    novel_id,
                ]).forEach(([siteID, novel_id]) => epubFile_1.nodeGunEpubFile(siteID, novel_id).put(gunData));
            }
            let readStream = new stream_1.PassThrough();
            readStream.end(fileContents);
            let { mime, ext } = await file_type_1.fromBuffer(fileContents);
            if (ext === 'epub' && mime === 'application/zip') {
                mime = 'application/epub+zip';
            }
            res.set('Content-disposition', 'attachment; filename=' + filename);
            res.set('Content-Type', mime);
            logger_1.default.info(`將檔案傳送至客戶端...`);
            readStream.pipe(res);
            if (query.debug) {
            }
            else if (typeof data.removeCallback === 'function') {
                data.removeCallback();
            }
            else if (data.outputDir) {
                fs_extra_1.remove(data.outputDir);
            }
        })
            .catch(e => {
            let { message } = e;
            if (e.code === 'ENOENT') {
                message = `id 不存在 或 伺服器離線`;
            }
            let data = {
                error: message,
                params: req.params,
                timestamp: Date.now(),
            };
            res.status(404).json(data);
            logger_1.default.warn(data);
            logger_1.default.debug(`以下錯誤訊息為除錯用，並非每個都會對程式造成影響 =>`, e);
        });
    });
    return router;
}
exports.default = fileHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQSxxQ0FBaUM7QUFDakMsd0RBQWdDO0FBQ2hDLDBEQUFtRTtBQUNuRSx3Q0FBOEM7QUFDOUMsK0JBQXNDO0FBQ3RDLHVDQUFpRTtBQUVqRSxtQ0FBcUM7QUFDckMseUNBQXVDO0FBQ3ZDLDJEQUFtQztBQUNuQyxrREFBd0Y7QUFDeEYsd0RBQTZEO0FBQzdELGlFQUEwQztBQUMxQyxxRUFBZ0Q7QUFDaEQseURBQXdEO0FBRXhELFNBQVMsV0FBVztJQUVuQixNQUFNLE1BQU0sR0FBRyxnQkFBTSxFQUFFLENBQUM7SUFFeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUU1QyxJQUFJLEtBQUssR0FBRztZQUNYLEdBQUcsR0FBRyxDQUFDLE1BQU07WUFDYixHQUFHLEdBQUcsQ0FBQyxLQUFLO1NBQ1osQ0FBQztRQUVGLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUNwQixPQUFPLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFFaEIsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFdkQsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQzthQUMxQyxJQUFJLEVBQUU7YUFDTixPQUFPLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxDQUFDLENBQ2hDO1FBQ0QsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQzthQUM3QyxJQUFJLEVBQUUsQ0FDUDtRQUVELElBQUksTUFBTSxDQUFDLFdBQVcsRUFBRSxLQUFLLE1B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QixDQUFDO1lBRUYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFM0IsZ0JBQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFbkIsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsNkJBQTZCLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFFaEQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sTUFBTSxDQUFBO0FBQ2QsQ0FBQztBQUVELGtCQUFlLFdBQVcsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMjAvMi8xLlxuICovXG5cbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCB7IEVudW1Ob3ZlbFNpdGVMaXN0IH0gZnJvbSAnbm92ZWwtZG93bmxvYWRlci9zcmMvYWxsL2NvbnN0JztcbmltcG9ydCB7IF9fY2FjaGVNYXBGaWxlIH0gZnJvbSAnLi4vbGliL2NvbnN0JztcbmltcG9ydCB7IGpvaW4sIGJhc2VuYW1lIH0gZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IHJlYWRKU09OLCB3cml0ZUpTT04sIHJlYWRGaWxlLCByZW1vdmUgfSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgeyBJQ2FjaGVNYXAsIElHdW5FcHViTm9kZSwgSUd1bkVwdWJEYXRhLCBJQ2FjaGVNYXBSb3csIEVudW1DYWNoZU1hcFJvd1N0YXR1cyB9IGZyb20gJy4uL2xpYi90eXBlcyc7XG5pbXBvcnQgeyBQYXNzVGhyb3VnaCB9IGZyb20gXCJzdHJlYW1cIjtcbmltcG9ydCB7IGZyb21CdWZmZXIgfSBmcm9tICdmaWxlLXR5cGUnO1xuaW1wb3J0IF9fcm9vdCBmcm9tICcuLi9saWIvX19yb290JztcbmltcG9ydCB7IHJhY2VHdW5FcHViRmlsZSwgbWFrZUFycmF5RW50cnlzLCBub2RlR3VuRXB1YkZpbGUgfSBmcm9tICcuLi9saWIvZ3VuL2VwdWJGaWxlJztcbmltcG9ydCB7IHNpdGVJRDJJREtFWSB9IGZyb20gJ25vdmVsLWRvd25sb2FkZXIvc3JjL2FsbC91dGlsJztcbmltcG9ydCBjb25zb2xlIGZyb20gJ2RlYnVnLWNvbG9yMi9sb2dnZXInO1xuaW1wb3J0IGNoZWNrR3VuRGF0YSBmcm9tICcuLi9saWIvZ3VuL2NoZWNrRGF0YSc7XG5pbXBvcnQgeyBhc3luYyBhcyBjcm9zc1NwYXduIH0gZnJvbSAnY3Jvc3Mtc3Bhd24tZXh0cmEnO1xuXG5mdW5jdGlvbiBmaWxlSGFuZGxlcigpXG57XG5cdGNvbnN0IHJvdXRlciA9IFJvdXRlcigpO1xuXG5cdHJvdXRlci51c2UoJy86c2l0ZUlELzpub3ZlbElEJywgKHJlcSwgcmVzKSA9PlxuXHR7XG5cdFx0bGV0IHF1ZXJ5ID0ge1xuXHRcdFx0Li4ucmVxLnBhcmFtcyxcblx0XHRcdC4uLnJlcS5xdWVyeSxcblx0XHR9O1xuXG5cdFx0ZGVsZXRlIHF1ZXJ5LnNpdGVJRDtcblx0XHRkZWxldGUgcXVlcnkuaWQ7XG5cblx0XHRjb25zb2xlLmRlYnVnKHJlcS5iYXNlVXJsLCByZXEudXJsLCByZXEucGFyYW1zLCBxdWVyeSk7XG5cblx0XHRsZXQgc2l0ZUlEID0gU3RyaW5nKHJlcS5wYXJhbXMuc2l0ZUlEIHx8ICcnKVxuXHRcdFx0LnRyaW0oKVxuXHRcdFx0LnJlcGxhY2UoL1xcLnhtbCR8W1xcL1xcXFxdKy9pZywgJycpXG5cdFx0O1xuXHRcdGxldCBub3ZlbF9pZCA9IFN0cmluZyhyZXEucGFyYW1zLm5vdmVsSUQgfHwgJycpXG5cdFx0XHQudHJpbSgpXG5cdFx0O1xuXG5cdFx0aWYgKHNpdGVJRC50b0xvd2VyQ2FzZSgpID09PSAnZG16aicpXG5cdFx0e1xuXHRcdFx0c2l0ZUlEID0gRW51bU5vdmVsU2l0ZUxpc3QuTm92ZWxTaXRlRG16akFwaVxuXHRcdH1cblxuXHRcdGxldCBJREtFWSA9IHNpdGVJRDJJREtFWShzaXRlSUQpO1xuXG5cdFx0bGV0IG1hcF9maWxlID0gX19jYWNoZU1hcEZpbGU7XG5cblx0XHRyZXR1cm4gQmx1ZWJpcmRcblx0XHRcdC5yZXNvbHZlKElES0VZKVxuXHRcdFx0LnRhcChJREtFWSA9PiB7XG5cdFx0XHRcdGlmICghSURLRVkpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKGAke3NpdGVJRH0g5qih57WE5LiN5a2Y5ZyoYCkpXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIW5vdmVsX2lkKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihg5rKS5pyJ5oyH5a6a6ZyA6KaB5LiL6LyJ55qEIGlkOiAnJHtub3ZlbF9pZH0nYCkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oYXN5bmMgKCkgPT5cblx0XHRcdHtcblx0XHRcdFx0bGV0IGd1bkRhdGEgPSBhd2FpdCByYWNlR3VuRXB1YkZpbGUoW1xuXHRcdFx0XHRcdFx0Ly9yZXEucGFyYW1zLnNpdGVJRCxcblx0XHRcdFx0XHRcdC8vc2l0ZUlELFxuXHRcdFx0XHRcdElES0VZLFxuXHRcdFx0XHRcdF0sIFtcblx0XHRcdFx0XHRcdHJlcS5wYXJhbXMubm92ZWxJRCxcblx0XHRcdFx0XHRcdG5vdmVsX2lkLFxuXHRcdFx0XHRcdF0pXG5cdFx0XHRcdFx0LnRoZW4oYXN5bmMgKGRhdGEpID0+XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0bGV0IGJvb2w6IGJvb2xlYW4gPSBjaGVja0d1bkRhdGEoZGF0YSk7XG5cblx0XHRcdFx0XHRcdGlmICghY2hlY2tHdW5EYXRhKGRhdGEpKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRsZXQgeyBiYXNlNjQsIGZpbGVuYW1lLCBleGlzdHMsIHRpbWVzdGFtcCB9ID0gKGRhdGEgfHwge30pIGFzIEV4Y2x1ZGU8SUd1bkVwdWJOb2RlLCB7XG5cdFx0XHRcdFx0XHRcdFx0ZXhpc3RzOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0fT47XG5cblx0XHRcdFx0XHRcdFx0bGV0IGd1biA9IG5vZGVHdW5FcHViRmlsZTxFeGNsdWRlPElHdW5FcHViTm9kZSwge1xuXHRcdFx0XHRcdFx0XHRcdGV4aXN0czogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdH0+PihJREtFWSwgcmVxLnBhcmFtcy5ub3ZlbElEKTtcblxuXHRcdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0XHRcdHRpbWVzdGFtcCA9IHRpbWVzdGFtcCB8fCBhd2FpdCBndW4uZ2V0KCd0aW1lc3RhbXAnKTtcblxuXHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIHRpbWVzdGFtcCA9PT0gJ251bWJlcicpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0XHRcdFx0ZmlsZW5hbWUgPSBmaWxlbmFtZSB8fCBhd2FpdCBndW4uZ2V0KCdmaWxlbmFtZScpO1xuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBmaWxlbmFtZSA9PT0gJ3N0cmluZycpXG5cdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdFx0XHRcdFx0YmFzZTY0ID0gYmFzZTY0IHx8IGF3YWl0IGd1bi5nZXQoJ2Jhc2U2NCcpO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIGJhc2U2NCA9PT0gJ3N0cmluZycpXG5cdFx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEgPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YmFzZTY0LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGV4aXN0czogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmaWxlbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lc3RhbXAsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKGNoZWNrR3VuRGF0YShkYXRhKSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0bGV0IHsgYmFzZTY0LCBmaWxlbmFtZSwgZXhpc3RzLCB0aW1lc3RhbXAgfSA9IGRhdGE7XG5cdFx0XHRcdFx0XHRcdGxldCBpc0d1biA9IGZhbHNlO1xuXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuaW5mbyhg5pa8UDJQ57ep5a2Y55m854++5qqU5qGILi4uYCwgbmV3IERhdGUodGltZXN0YW1wKSk7XG5cblx0XHRcdFx0XHRcdFx0aWYgKHF1ZXJ5LmRlYnVnIHx8IHF1ZXJ5LmZvcmNlKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5pbmZvKGDnmbznj77lvLfliLbkuIvovInmjIfku6TvvIzmnKzmrKHlsIfnhKHoppbnt6nlrZhgLCBxdWVyeSlcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmICgoRGF0ZS5ub3coKSAtIGRhdGEudGltZXN0YW1wKSA8IDg2NDAwICogMTAwMClcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGlzR3VuID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oYOebruaomeaqlOahiOW3sumBjuacn++8jOippuWclumHjeaWsOW7uueri+aqlOahiGApXG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRcdGJhc2U2NCxcblx0XHRcdFx0XHRcdFx0XHRmaWxlbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRleGlzdHMsXG5cdFx0XHRcdFx0XHRcdFx0dGltZXN0YW1wLFxuXHRcdFx0XHRcdFx0XHRcdGlzR3VuLFxuXHRcdFx0XHRcdFx0XHR9IGFzIElHdW5FcHViRGF0YVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoYm9vbCA9PT0gZmFsc2UpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUud2Fybihg5pa8UDJQ57ep5a2Y55m854++5qqU5qGILi4uYCwgYOS9huizh+aWmeS8vOS5juW3suaQjeavgGApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuaW5mbyhg5rKS5pyJ55m854++UDJQ57ep5a2YLi4uYCk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHJldHVybiBudWxsXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0O1xuXG5cdFx0XHRcdHJldHVybiBndW5EYXRhXG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oYXN5bmMgKGd1bkRhdGEpID0+XG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuXHRcdFx0XHRcdC50aGVuKGFzeW5jICgpID0+XG5cdFx0XHRcdFx0e1xuXG5cdFx0XHRcdFx0XHRpZiAoZ3VuRGF0YSAmJiBndW5EYXRhLmlzR3VuKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZ3VuRGF0YVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhg5Y+W5b6X5qqU5qGI5LitLi4uYCk7XG5cdFx0XHRcdFx0XHRsZXQgY3AgPSBhd2FpdCBjcm9zc1NwYXduKCdub2RlJywgW1xuXHRcdFx0XHRcdFx0XHQnLS1leHBlcmltZW50YWwtd29ya2VyJyxcblx0XHRcdFx0XHRcdFx0am9pbihfX3Jvb3QsIGAuL2NsaS9jbGkuanNgKSxcblx0XHRcdFx0XHRcdFx0Jy0tbW9kJyxcblx0XHRcdFx0XHRcdFx0J2FsbCcsXG5cdFx0XHRcdFx0XHRcdCctLXNpdGVJRCcsXG5cdFx0XHRcdFx0XHRcdHNpdGVJRCxcblx0XHRcdFx0XHRcdFx0Jy0tbm92ZWxfaWQnLFxuXHRcdFx0XHRcdFx0XHRub3ZlbF9pZCxcblx0XHRcdFx0XHRcdF0sIHtcblx0XHRcdFx0XHRcdFx0c3RkaW86ICdpbmhlcml0Jyxcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0XHRpZiAoY3AuZXJyb3IpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGNwLmVycm9yKVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRsZXQgbWFwOiBJQ2FjaGVNYXAgPSBhd2FpdCByZWFkSlNPTihtYXBfZmlsZSlcblx0XHRcdFx0XHRcdFx0LmNhdGNoKGUgPT4gbnVsbClcblx0XHRcdFx0XHRcdDtcblxuXHRcdFx0XHRcdFx0aWYgKCFndW5EYXRhICYmICghbWFwIHx8ICFtYXBbSURLRVldIHx8ICFtYXBbSURLRVldW25vdmVsX2lkXSkpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGd1bkRhdGEgPSBhd2FpdCByYWNlR3VuRXB1YkZpbGUoW1xuXHRcdFx0XHRcdFx0XHRcdC8vcmVxLnBhcmFtcy5zaXRlSUQsXG5cdFx0XHRcdFx0XHRcdFx0Ly9zaXRlSUQsXG5cdFx0XHRcdFx0XHRcdFx0SURLRVksXG5cdFx0XHRcdFx0XHRcdF0sIFtcblx0XHRcdFx0XHRcdFx0XHRyZXEucGFyYW1zLm5vdmVsSUQsXG5cdFx0XHRcdFx0XHRcdFx0bm92ZWxfaWQsXG5cdFx0XHRcdFx0XHRcdF0pLnRoZW4oYXN5bmMgKGRhdGEpID0+XG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoY2hlY2tHdW5EYXRhKGRhdGEpKVxuXHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdGxldCB7IGJhc2U2NCwgZmlsZW5hbWUsIGV4aXN0cywgdGltZXN0YW1wIH0gPSBkYXRhO1xuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGlzR3VuID0gdHJ1ZTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0YmFzZTY0LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmaWxlbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZXhpc3RzLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lc3RhbXAsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlzR3VuLFxuXHRcdFx0XHRcdFx0XHRcdFx0fSBhcyBJR3VuRXB1YkRhdGFcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdGlmIChndW5EYXRhKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGd1bkRhdGFcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAoIW1hcCB8fCAhbWFwW0lES0VZXSB8fCAhbWFwW0lES0VZXVtub3ZlbF9pZF0pXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuZGlyKG1hcCk7XG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihg5bu656uL5qqU5qGI5pmC5aSx5pWX77yMJHtzaXRlSUR9ICR7bm92ZWxfaWR9IOWPr+iDveS4jeWtmOWcqOaIluino+aekOWkseaVly4uLmApKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAobWFwW0lES0VZXVtub3ZlbF9pZF0uc3RhdHVzID09PSBFbnVtQ2FjaGVNYXBSb3dTdGF0dXMuV0FJVElOR19SRVRSWSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0bGV0IGUgPSBuZXcgRXJyb3IoYOaKk+WPliAke3NpdGVJRH0gJHtub3ZlbF9pZH0g5L6G5rqQ5pmC5aSx5pWX77yM5Ly65pyN5Zmo5Y+v6IO95b+Z56KM5oiW5ouS57WV5Zue5oeJ77yM6KuL5LmL5b6M5YaN6YeN6KmmLi4uYCk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdFx0XHRlLlN0YXR1c0NvZGUgPSA1MDQ7XG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGUpXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGxldCBfZGF0YSA9IG1hcFtJREtFWV1bbm92ZWxfaWRdO1xuXG5cdFx0XHRcdFx0XHRkZWxldGUgbWFwW0lES0VZXVtfZGF0YS5ub3ZlbF9pZDJdO1xuXHRcdFx0XHRcdFx0ZGVsZXRlIG1hcFtJREtFWV1bX2RhdGEubm92ZWxfaWRdO1xuXG5cdFx0XHRcdFx0XHRhd2FpdCB3cml0ZUpTT04obWFwX2ZpbGUsIG1hcCwgeyBzcGFjZXM6IDIgfSkuY2F0Y2goZSA9PlxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGDnmbznlJ/pjK/oqqTvvIznhKHms5Xlr6vlhaXnt6nlrZjmqpTmoYggJHttYXBfZmlsZX1gKTtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihlKVxuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdHJldHVybiBfZGF0YVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmNhdGNoKGUgPT5cblx0XHRcdFx0XHR7XG5cblx0XHRcdFx0XHRcdGlmIChndW5EYXRhICYmIGd1bkRhdGEuZXhpc3RzKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oYOaqlOahiOW7uueri+WkseaVl++8jOS9v+eUqFAyUOe3qeWtmOS7o+abv2ApO1xuXG5cdFx0XHRcdFx0XHRcdGd1bkRhdGEuaXNHdW4gPSB0cnVlO1xuXG5cdFx0XHRcdFx0XHRcdHJldHVybiBndW5EYXRhXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlKVxuXHRcdFx0XHRcdH0pIGFzIFByb21pc2U8SUd1bkVwdWJEYXRhICYgSUNhY2hlTWFwUm93PlxuXHRcdFx0XHRcdDtcblx0XHRcdH0pXG5cdFx0XHQudGhlbihhc3luYyAoZGF0YSkgPT5cblx0XHRcdHtcblx0XHRcdFx0Y29uc29sZS5zdWNjZXNzKGDmiJDlip/lj5blvpfmqpTmoYguLi5gKTtcblxuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdGxldCBmaWxlQ29udGVudHM6IEJ1ZmZlciA9IGRhdGEuYmFzZTY0ICYmIEJ1ZmZlci5mcm9tKGRhdGEuYmFzZTY0LCAnYmFzZTY0JykgfHwgYXdhaXQgcmVhZEZpbGUoZGF0YS5lcHViKTtcblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRsZXQgZmlsZW5hbWU6IHN0cmluZyA9IGRhdGEuZmlsZW5hbWUgfHwgSURLRVkgKyAnXycgKyBiYXNlbmFtZShkYXRhLmVwdWIpO1xuXG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0aWYgKCFkYXRhLmlzR3VuIHx8IHRydWUpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjb25zb2xlLmRlYnVnKGDlsIfmqpTmoYjlhLLlrZjliLBQMlDnt6nlrZhgKTtcblxuXHRcdFx0XHRcdGxldCBndW5EYXRhOiBJR3VuRXB1Yk5vZGUgPSB7XG5cdFx0XHRcdFx0XHR0aW1lc3RhbXA6IGRhdGEuaXNHdW4gPyBkYXRhLnRpbWVzdGFtcCA6IERhdGUubm93KCksXG5cdFx0XHRcdFx0XHRleGlzdHM6IHRydWUsXG5cdFx0XHRcdFx0XHRmaWxlbmFtZSxcblx0XHRcdFx0XHRcdGJhc2U2NDogZmlsZUNvbnRlbnRzLnRvU3RyaW5nKCdiYXNlNjQnKSxcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0bWFrZUFycmF5RW50cnlzKFtcblx0XHRcdFx0XHRcdC8vc2l0ZUlELFxuXHRcdFx0XHRcdFx0Ly9yZXEucGFyYW1zLnNpdGVJRCxcblx0XHRcdFx0XHRcdC8vZGF0YS5JREtFWSxcblx0XHRcdFx0XHRcdElES0VZLFxuXHRcdFx0XHRcdF0sIFtcblx0XHRcdFx0XHRcdG5vdmVsX2lkLFxuXHRcdFx0XHRcdFx0cmVxLnBhcmFtcy5ub3ZlbElELFxuXHRcdFx0XHRcdFx0ZGF0YS5ub3ZlbF9pZCxcblx0XHRcdFx0XHRcdGRhdGEubm92ZWxfaWQyLFxuXHRcdFx0XHRcdFx0bm92ZWxfaWQsXG5cdFx0XHRcdFx0XSkuZm9yRWFjaCgoW3NpdGVJRCwgbm92ZWxfaWRdKSA9PiBub2RlR3VuRXB1YkZpbGUoc2l0ZUlELCBub3ZlbF9pZCkucHV0KGd1bkRhdGEpKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCByZWFkU3RyZWFtID0gbmV3IFBhc3NUaHJvdWdoKCk7XG5cdFx0XHRcdHJlYWRTdHJlYW0uZW5kKGZpbGVDb250ZW50cyk7XG5cblx0XHRcdFx0bGV0IHsgbWltZSwgZXh0IH0gPSBhd2FpdCBmcm9tQnVmZmVyKGZpbGVDb250ZW50cyk7XG5cblx0XHRcdFx0aWYgKGV4dCA9PT0gJ2VwdWInICYmIG1pbWUgPT09ICdhcHBsaWNhdGlvbi96aXAnKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bWltZSA9ICdhcHBsaWNhdGlvbi9lcHViK3ppcCc7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXMuc2V0KCdDb250ZW50LWRpc3Bvc2l0aW9uJywgJ2F0dGFjaG1lbnQ7IGZpbGVuYW1lPScgKyBmaWxlbmFtZSk7XG5cdFx0XHRcdHJlcy5zZXQoJ0NvbnRlbnQtVHlwZScsIG1pbWUpO1xuXG5cdFx0XHRcdGNvbnNvbGUuaW5mbyhg5bCH5qqU5qGI5YKz6YCB6Iez5a6i5oi256uvLi4uYCk7XG5cdFx0XHRcdHJlYWRTdHJlYW0ucGlwZShyZXMpO1xuXG5cdFx0XHRcdGlmIChxdWVyeS5kZWJ1Zylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coYOW/veeVpeWIqumZpOS4i+i8ieaaq+WtmCAke2RhdGEub3V0cHV0RGlyfWApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkYXRhLnJlbW92ZUNhbGxiYWNrID09PSAnZnVuY3Rpb24nKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0ZGF0YS5yZW1vdmVDYWxsYmFjaygpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKGRhdGEub3V0cHV0RGlyKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmVtb3ZlKGRhdGEub3V0cHV0RGlyKVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGUgPT5cblx0XHRcdHtcblxuXHRcdFx0XHRsZXQgeyBtZXNzYWdlIH0gPSBlO1xuXHRcdFx0XHRpZiAoZS5jb2RlID09PSAnRU5PRU5UJylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG1lc3NhZ2UgPSBgaWQg5LiN5a2Y5ZyoIOaIliDkvLrmnI3lmajpm6Lnt5pgXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsZXQgZGF0YSA9IHtcblx0XHRcdFx0XHRlcnJvcjogbWVzc2FnZSxcblx0XHRcdFx0XHRwYXJhbXM6IHJlcS5wYXJhbXMsXG5cdFx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpLFxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHJlcy5zdGF0dXMoNDA0KS5qc29uKGRhdGEpO1xuXG5cdFx0XHRcdGNvbnNvbGUud2FybihkYXRhKTtcblxuXHRcdFx0XHRjb25zb2xlLmRlYnVnKGDku6XkuIvpjK/oqqToqIrmga/ngrrpmaTpjK/nlKjvvIzkuKbpnZ7mr4/lgIvpg73mnIPlsI3nqIvlvI/pgKDmiJDlvbHpn78gPT5gLCBlKVxuXG5cdFx0XHR9KVxuXHR9KTtcblxuXHRyZXR1cm4gcm91dGVyXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZpbGVIYW5kbGVyXG4iXX0=