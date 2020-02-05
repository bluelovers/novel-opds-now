"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bluebird_1 = __importDefault(require("bluebird"));
const const_1 = require("novel-downloader/src/all/const");
const const_2 = require("../lib/const");
const child_process_1 = require("child_process");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const stream_1 = require("stream");
const file_type_1 = require("file-type");
const __root_1 = __importDefault(require("../lib/__root"));
const epubFile_1 = require("../lib/gun/epubFile");
const util_1 = require("novel-downloader/src/all/util");
const logger_1 = __importDefault(require("debug-color2/logger"));
const checkData_1 = __importDefault(require("../lib/gun/checkData"));
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
        let siteID = req.params.siteID;
        let novel_id = req.params.novelID;
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
        })
            .then(async () => {
            let gunData = await epubFile_1.raceGunEpubFile([
                IDKEY,
            ], [
                req.params.novelID,
                novel_id,
            ])
                .then(function (data) {
                let bool = checkData_1.default(data);
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
                let cp = child_process_1.spawnSync('node', [
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
                let map = await fs_extra_1.readJSON(map_file).catch(e => null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQSxxQ0FBaUM7QUFDakMsd0RBQWdDO0FBQ2hDLDBEQUFtRTtBQUNuRSx3Q0FBOEM7QUFDOUMsaURBQTBDO0FBQzFDLCtCQUFzQztBQUN0Qyx1Q0FBaUU7QUFFakUsbUNBQXFDO0FBQ3JDLHlDQUF1QztBQUN2QywyREFBbUM7QUFDbkMsa0RBQXdGO0FBQ3hGLHdEQUE2RDtBQUM3RCxpRUFBMEM7QUFDMUMscUVBQWdEO0FBRWhELFNBQVMsV0FBVztJQUVuQixNQUFNLE1BQU0sR0FBRyxnQkFBTSxFQUFFLENBQUM7SUFFeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUU1QyxJQUFJLEtBQUssR0FBRztZQUNYLEdBQUcsR0FBRyxDQUFDLE1BQU07WUFDYixHQUFHLEdBQUcsQ0FBQyxLQUFLO1NBQ1osQ0FBQztRQUVGLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUNwQixPQUFPLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFFaEIsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFdkQsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDL0IsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFFbEMsSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFLEtBQUssTUFBTSxFQUNuQztZQUNDLE1BQU0sR0FBRyx5QkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQTtTQUMzQztRQUVELElBQUksS0FBSyxHQUFHLG1CQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFakMsSUFBSSxRQUFRLEdB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QUFJLENBQUMsU0FBUyxFQUN2QjtnQkFDQyxpQkFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTthQUN0QjtRQUNGLENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUdWLElBQUksRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDcEIsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFDdkI7Z0JBQ0MsT0FBTyxHQUFHLGdCQUFnQixDQUFBO2FBQzFCO1lBRUQsSUFBSSxJQUFJLEdBQUc7Z0JBQ1YsS0FBSyxFQUFFLE9BQU87Z0JBQ2QsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNO2dCQUNsQixTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTthQUNyQixDQUFDO1lBRUYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFM0IsZ0JBQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFbkIsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsNkJBQTZCLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFFaEQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sTUFBTSxDQUFBO0FBQ2QsQ0FBQztBQUVELGtCQUFlLFdBQVcsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMjAvMi8xLlxuICovXG5cbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCB7IEVudW1Ob3ZlbFNpdGVMaXN0IH0gZnJvbSAnbm92ZWwtZG93bmxvYWRlci9zcmMvYWxsL2NvbnN0JztcbmltcG9ydCB7IF9fY2FjaGVNYXBGaWxlIH0gZnJvbSAnLi4vbGliL2NvbnN0JztcbmltcG9ydCB7IHNwYXduU3luYyB9IGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XG5pbXBvcnQgeyBqb2luLCBiYXNlbmFtZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyByZWFkSlNPTiwgd3JpdGVKU09OLCByZWFkRmlsZSwgcmVtb3ZlIH0gZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHsgSUNhY2hlTWFwLCBJR3VuRXB1Yk5vZGUsIElHdW5FcHViRGF0YSwgSUNhY2hlTWFwUm93LCBFbnVtQ2FjaGVNYXBSb3dTdGF0dXMgfSBmcm9tICcuLi9saWIvdHlwZXMnO1xuaW1wb3J0IHsgUGFzc1Rocm91Z2ggfSBmcm9tIFwic3RyZWFtXCI7XG5pbXBvcnQgeyBmcm9tQnVmZmVyIH0gZnJvbSAnZmlsZS10eXBlJztcbmltcG9ydCBfX3Jvb3QgZnJvbSAnLi4vbGliL19fcm9vdCc7XG5pbXBvcnQgeyByYWNlR3VuRXB1YkZpbGUsIG1ha2VBcnJheUVudHJ5cywgbm9kZUd1bkVwdWJGaWxlIH0gZnJvbSAnLi4vbGliL2d1bi9lcHViRmlsZSc7XG5pbXBvcnQgeyBzaXRlSUQySURLRVkgfSBmcm9tICdub3ZlbC1kb3dubG9hZGVyL3NyYy9hbGwvdXRpbCc7XG5pbXBvcnQgY29uc29sZSBmcm9tICdkZWJ1Zy1jb2xvcjIvbG9nZ2VyJztcbmltcG9ydCBjaGVja0d1bkRhdGEgZnJvbSAnLi4vbGliL2d1bi9jaGVja0RhdGEnO1xuXG5mdW5jdGlvbiBmaWxlSGFuZGxlcigpXG57XG5cdGNvbnN0IHJvdXRlciA9IFJvdXRlcigpO1xuXG5cdHJvdXRlci51c2UoJy86c2l0ZUlELzpub3ZlbElEJywgKHJlcSwgcmVzKSA9PlxuXHR7XG5cdFx0bGV0IHF1ZXJ5ID0ge1xuXHRcdFx0Li4ucmVxLnBhcmFtcyxcblx0XHRcdC4uLnJlcS5xdWVyeSxcblx0XHR9O1xuXG5cdFx0ZGVsZXRlIHF1ZXJ5LnNpdGVJRDtcblx0XHRkZWxldGUgcXVlcnkuaWQ7XG5cblx0XHRjb25zb2xlLmRlYnVnKHJlcS5iYXNlVXJsLCByZXEudXJsLCByZXEucGFyYW1zLCBxdWVyeSk7XG5cblx0XHRsZXQgc2l0ZUlEID0gcmVxLnBhcmFtcy5zaXRlSUQ7XG5cdFx0bGV0IG5vdmVsX2lkID0gcmVxLnBhcmFtcy5ub3ZlbElEO1xuXG5cdFx0aWYgKHNpdGVJRC50b0xvd2VyQ2FzZSgpID09PSAnZG16aicpXG5cdFx0e1xuXHRcdFx0c2l0ZUlEID0gRW51bU5vdmVsU2l0ZUxpc3QuTm92ZWxTaXRlRG16akFwaVxuXHRcdH1cblxuXHRcdGxldCBJREtFWSA9IHNpdGVJRDJJREtFWShzaXRlSUQpO1xuXG5cdFx0bGV0IG1hcF9maWxlID0gX19jYWNoZU1hcEZpbGU7XG5cblx0XHRyZXR1cm4gQmx1ZWJpcmRcblx0XHRcdC5yZXNvbHZlKElES0VZKVxuXHRcdFx0LnRhcChJREtFWSA9PiB7XG5cdFx0XHRcdGlmICghSURLRVkpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKGAke3NpdGVJRH0g5qih57WE5LiN5a2Y5ZyoYCkpXG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQudGhlbihhc3luYyAoKSA9PlxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgZ3VuRGF0YSA9IGF3YWl0IHJhY2VHdW5FcHViRmlsZShbXG5cdFx0XHRcdFx0XHQvL3JlcS5wYXJhbXMuc2l0ZUlELFxuXHRcdFx0XHRcdFx0Ly9zaXRlSUQsXG5cdFx0XHRcdFx0SURLRVksXG5cdFx0XHRcdFx0XSwgW1xuXHRcdFx0XHRcdFx0cmVxLnBhcmFtcy5ub3ZlbElELFxuXHRcdFx0XHRcdFx0bm92ZWxfaWQsXG5cdFx0XHRcdFx0XSlcblx0XHRcdFx0XHQudGhlbihmdW5jdGlvbiAoZGF0YSlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRsZXQgYm9vbDogYm9vbGVhbiA9IGNoZWNrR3VuRGF0YShkYXRhKTtcblxuXHRcdFx0XHRcdFx0aWYgKGNoZWNrR3VuRGF0YShkYXRhKSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0bGV0IHsgYmFzZTY0LCBmaWxlbmFtZSwgZXhpc3RzLCB0aW1lc3RhbXAgfSA9IGRhdGE7XG5cdFx0XHRcdFx0XHRcdGxldCBpc0d1biA9IGZhbHNlO1xuXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuaW5mbyhg5pa8UDJQ57ep5a2Y55m854++5qqU5qGILi4uYCwgbmV3IERhdGUodGltZXN0YW1wKSk7XG5cblx0XHRcdFx0XHRcdFx0aWYgKHF1ZXJ5LmRlYnVnIHx8IHF1ZXJ5LmZvcmNlKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5pbmZvKGDnmbznj77lvLfliLbkuIvovInmjIfku6TvvIzmnKzmrKHlsIfnhKHoppbnt6nlrZhgLCBxdWVyeSlcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmICgoRGF0ZS5ub3coKSAtIGRhdGEudGltZXN0YW1wKSA8IDg2NDAwICogMTAwMClcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGlzR3VuID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oYOebruaomeaqlOahiOW3sumBjuacn++8jOippuWclumHjeaWsOW7uueri+aqlOahiGApXG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRcdGJhc2U2NCxcblx0XHRcdFx0XHRcdFx0XHRmaWxlbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRleGlzdHMsXG5cdFx0XHRcdFx0XHRcdFx0dGltZXN0YW1wLFxuXHRcdFx0XHRcdFx0XHRcdGlzR3VuLFxuXHRcdFx0XHRcdFx0XHR9IGFzIElHdW5FcHViRGF0YVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoYm9vbCA9PT0gZmFsc2UpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUud2Fybihg5pa8UDJQ57ep5a2Y55m854++5qqU5qGILi4uYCwgYOS9huizh+aWmeS8vOS5juW3suaQjeavgGApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuaW5mbyhg5rKS5pyJ55m854++UDJQ57ep5a2YLi4uYCk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHJldHVybiBudWxsXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0O1xuXG5cdFx0XHRcdHJldHVybiBndW5EYXRhXG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oYXN5bmMgKGd1bkRhdGEpID0+XG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuXHRcdFx0XHRcdC50aGVuKGFzeW5jICgpID0+XG5cdFx0XHRcdFx0e1xuXG5cdFx0XHRcdFx0XHRpZiAoZ3VuRGF0YSAmJiBndW5EYXRhLmlzR3VuKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZ3VuRGF0YVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhg5Y+W5b6X5qqU5qGI5LitLi4uYCk7XG5cdFx0XHRcdFx0XHRsZXQgY3AgPSBzcGF3blN5bmMoJ25vZGUnLCBbXG5cdFx0XHRcdFx0XHRcdCctLWV4cGVyaW1lbnRhbC13b3JrZXInLFxuXHRcdFx0XHRcdFx0XHRqb2luKF9fcm9vdCwgYC4vY2xpL2NsaS5qc2ApLFxuXHRcdFx0XHRcdFx0XHQnLS1tb2QnLFxuXHRcdFx0XHRcdFx0XHQnYWxsJyxcblx0XHRcdFx0XHRcdFx0Jy0tc2l0ZUlEJyxcblx0XHRcdFx0XHRcdFx0c2l0ZUlELFxuXHRcdFx0XHRcdFx0XHQnLS1ub3ZlbF9pZCcsXG5cdFx0XHRcdFx0XHRcdG5vdmVsX2lkLFxuXHRcdFx0XHRcdFx0XSwge1xuXHRcdFx0XHRcdFx0XHRzdGRpbzogJ2luaGVyaXQnLFxuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdGlmIChjcC5lcnJvcilcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGNwLmVycm9yKVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRsZXQgbWFwOiBJQ2FjaGVNYXAgPSBhd2FpdCByZWFkSlNPTihtYXBfZmlsZSkuY2F0Y2goZSA9PiBudWxsKTtcblxuXHRcdFx0XHRcdFx0aWYgKCFtYXAgfHwgIW1hcFtJREtFWV0gfHwgIW1hcFtJREtFWV1bbm92ZWxfaWRdKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmRpcihtYXApO1xuXG5cdFx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoYOW7uueri+aqlOahiOaZguWkseaVl++8jCR7c2l0ZUlEfSAke25vdmVsX2lkfSDlj6/og73kuI3lrZjlnKjmiJbop6PmnpDlpLHmlZcuLi5gKSlcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKG1hcFtJREtFWV1bbm92ZWxfaWRdLnN0YXR1cyA9PT0gRW51bUNhY2hlTWFwUm93U3RhdHVzLldBSVRJTkdfUkVUUlkpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGxldCBlID0gbmV3IEVycm9yKGDmipPlj5YgJHtzaXRlSUR9ICR7bm92ZWxfaWR9IOS+hua6kOaZguWkseaVl++8jOS8uuacjeWZqOWPr+iDveW/meeijOaIluaLkue1leWbnuaHie+8jOiri+S5i+W+jOWGjemHjeippi4uLmApO1xuXG5cdFx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdFx0ZS5TdGF0dXNDb2RlID0gNTA0O1xuXG5cdFx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlKVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRsZXQgX2RhdGEgPSBtYXBbSURLRVldW25vdmVsX2lkXTtcblxuXHRcdFx0XHRcdFx0ZGVsZXRlIG1hcFtJREtFWV1bX2RhdGEubm92ZWxfaWQyXTtcblx0XHRcdFx0XHRcdGRlbGV0ZSBtYXBbSURLRVldW19kYXRhLm5vdmVsX2lkXTtcblxuXHRcdFx0XHRcdFx0YXdhaXQgd3JpdGVKU09OKG1hcF9maWxlLCBtYXAsIHsgc3BhY2VzOiAyIH0pLmNhdGNoKGUgPT5cblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihg55m855Sf6Yyv6Kqk77yM54Sh5rOV5a+r5YWl57ep5a2Y5qqU5qGIICR7bWFwX2ZpbGV9YCk7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoZSlcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gX2RhdGFcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5jYXRjaChlID0+XG5cdFx0XHRcdFx0e1xuXG5cdFx0XHRcdFx0XHRpZiAoZ3VuRGF0YSAmJiBndW5EYXRhLmV4aXN0cylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKGDmqpTmoYjlu7rnq4vlpLHmlZfvvIzkvb/nlKhQMlDnt6nlrZjku6Pmm79gKTtcblxuXHRcdFx0XHRcdFx0XHRndW5EYXRhLmlzR3VuID0gdHJ1ZTtcblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZ3VuRGF0YVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZSlcblx0XHRcdFx0XHR9KSBhcyBQcm9taXNlPElHdW5FcHViRGF0YSAmIElDYWNoZU1hcFJvdz5cblx0XHRcdFx0XHQ7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oYXN5bmMgKGRhdGEpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGNvbnNvbGUuc3VjY2Vzcyhg5oiQ5Yqf5Y+W5b6X5qqU5qGILi4uYCk7XG5cblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRsZXQgZmlsZUNvbnRlbnRzOiBCdWZmZXIgPSBkYXRhLmJhc2U2NCAmJiBCdWZmZXIuZnJvbShkYXRhLmJhc2U2NCwgJ2Jhc2U2NCcpIHx8IGF3YWl0IHJlYWRGaWxlKGRhdGEuZXB1Yik7XG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0bGV0IGZpbGVuYW1lOiBzdHJpbmcgPSBkYXRhLmZpbGVuYW1lIHx8IElES0VZICsgJ18nICsgYmFzZW5hbWUoZGF0YS5lcHViKTtcblxuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdGlmICghZGF0YS5pc0d1biB8fCB0cnVlKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y29uc29sZS5kZWJ1Zyhg5bCH5qqU5qGI5YSy5a2Y5YiwUDJQ57ep5a2YYCk7XG5cblx0XHRcdFx0XHRsZXQgZ3VuRGF0YTogSUd1bkVwdWJOb2RlID0ge1xuXHRcdFx0XHRcdFx0dGltZXN0YW1wOiBkYXRhLmlzR3VuID8gZGF0YS50aW1lc3RhbXAgOiBEYXRlLm5vdygpLFxuXHRcdFx0XHRcdFx0ZXhpc3RzOiB0cnVlLFxuXHRcdFx0XHRcdFx0ZmlsZW5hbWUsXG5cdFx0XHRcdFx0XHRiYXNlNjQ6IGZpbGVDb250ZW50cy50b1N0cmluZygnYmFzZTY0JyksXG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdG1ha2VBcnJheUVudHJ5cyhbXG5cdFx0XHRcdFx0XHQvL3NpdGVJRCxcblx0XHRcdFx0XHRcdC8vcmVxLnBhcmFtcy5zaXRlSUQsXG5cdFx0XHRcdFx0XHQvL2RhdGEuSURLRVksXG5cdFx0XHRcdFx0XHRJREtFWSxcblx0XHRcdFx0XHRdLCBbXG5cdFx0XHRcdFx0XHRub3ZlbF9pZCxcblx0XHRcdFx0XHRcdHJlcS5wYXJhbXMubm92ZWxJRCxcblx0XHRcdFx0XHRcdGRhdGEubm92ZWxfaWQsXG5cdFx0XHRcdFx0XHRkYXRhLm5vdmVsX2lkMixcblx0XHRcdFx0XHRcdG5vdmVsX2lkLFxuXHRcdFx0XHRcdF0pLmZvckVhY2goKFtzaXRlSUQsIG5vdmVsX2lkXSkgPT4gbm9kZUd1bkVwdWJGaWxlKHNpdGVJRCwgbm92ZWxfaWQpLnB1dChndW5EYXRhKSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsZXQgcmVhZFN0cmVhbSA9IG5ldyBQYXNzVGhyb3VnaCgpO1xuXHRcdFx0XHRyZWFkU3RyZWFtLmVuZChmaWxlQ29udGVudHMpO1xuXG5cdFx0XHRcdGxldCB7IG1pbWUsIGV4dCB9ID0gYXdhaXQgZnJvbUJ1ZmZlcihmaWxlQ29udGVudHMpO1xuXG5cdFx0XHRcdGlmIChleHQgPT09ICdlcHViJyAmJiBtaW1lID09PSAnYXBwbGljYXRpb24vemlwJylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG1pbWUgPSAnYXBwbGljYXRpb24vZXB1Yit6aXAnO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmVzLnNldCgnQ29udGVudC1kaXNwb3NpdGlvbicsICdhdHRhY2htZW50OyBmaWxlbmFtZT0nICsgZmlsZW5hbWUpO1xuXHRcdFx0XHRyZXMuc2V0KCdDb250ZW50LVR5cGUnLCBtaW1lKTtcblxuXHRcdFx0XHRjb25zb2xlLmluZm8oYOWwh+aqlOahiOWCs+mAgeiHs+WuouaItuerry4uLmApO1xuXHRcdFx0XHRyZWFkU3RyZWFtLnBpcGUocmVzKTtcblxuXHRcdFx0XHRpZiAocXVlcnkuZGVidWcpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKGDlv73nlaXliKrpmaTkuIvovInmmqvlrZggJHtkYXRhLm91dHB1dERpcn1gKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGF0YS5yZW1vdmVDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGRhdGEucmVtb3ZlQ2FsbGJhY2soKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmIChkYXRhLm91dHB1dERpcilcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJlbW92ZShkYXRhLm91dHB1dERpcilcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChlID0+XG5cdFx0XHR7XG5cblx0XHRcdFx0bGV0IHsgbWVzc2FnZSB9ID0gZTtcblx0XHRcdFx0aWYgKGUuY29kZSA9PT0gJ0VOT0VOVCcpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRtZXNzYWdlID0gYGlkIOS4jeWtmOWcqCDmiJYg5Ly65pyN5Zmo6Zui57eaYFxuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IGRhdGEgPSB7XG5cdFx0XHRcdFx0ZXJyb3I6IG1lc3NhZ2UsXG5cdFx0XHRcdFx0cGFyYW1zOiByZXEucGFyYW1zLFxuXHRcdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRyZXMuc3RhdHVzKDQwNCkuanNvbihkYXRhKTtcblxuXHRcdFx0XHRjb25zb2xlLndhcm4oZGF0YSk7XG5cblx0XHRcdFx0Y29uc29sZS5kZWJ1Zyhg5Lul5LiL6Yyv6Kqk6KiK5oGv54K66Zmk6Yyv55So77yM5Lim6Z2e5q+P5YCL6YO95pyD5bCN56iL5byP6YCg5oiQ5b2x6Z+/ID0+YCwgZSlcblxuXHRcdFx0fSlcblx0fSk7XG5cblx0cmV0dXJuIHJvdXRlclxufVxuXG5leHBvcnQgZGVmYXVsdCBmaWxlSGFuZGxlclxuIl19