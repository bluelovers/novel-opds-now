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
        logger_1.default.debug(req.method, req.baseUrl, req.url, req.params, query);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQSxxQ0FBaUM7QUFDakMsd0RBQWdDO0FBQ2hDLDBEQUFtRTtBQUNuRSx3Q0FBOEM7QUFDOUMsK0JBQXNDO0FBQ3RDLHVDQUFpRTtBQUVqRSxtQ0FBcUM7QUFDckMseUNBQXVDO0FBQ3ZDLDJEQUFtQztBQUNuQyxrREFBd0Y7QUFDeEYsd0RBQTZEO0FBQzdELGlFQUEwQztBQUMxQyxxRUFBZ0Q7QUFDaEQseURBQXdEO0FBRXhELFNBQVMsV0FBVztJQUVuQixNQUFNLE1BQU0sR0FBRyxnQkFBTSxFQUFFLENBQUM7SUFFeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUU1QyxJQUFJLEtBQUssR0FBRztZQUNYLEdBQUcsR0FBRyxDQUFDLE1BQU07WUFDYixHQUFHLEdBQUcsQ0FBQyxLQUFLO1NBQ1osQ0FBQztRQUVGLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUNwQixPQUFPLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFFaEIsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVuRSxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO2FBQzFDLElBQUksRUFBRTthQUNOLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLENBQUMsQ0FDaEM7UUFDRCxJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO2FBQzdDLElBQUksRUFBRSxDQUNQO1FBRUQsSUFBSSxNQUFNLENB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LENBQUMsR0FBRyxFQUFFO2FBQ3JCLENBQUM7WUFFRixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUUzQixnQkFBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVuQixnQkFBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUVoRCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxNQUFNLENBQUE7QUFDZCxDQUFDO0FBRUQsa0JBQWUsV0FBVyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8yLzEuXG4gKi9cblxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHsgRW51bU5vdmVsU2l0ZUxpc3QgfSBmcm9tICdub3ZlbC1kb3dubG9hZGVyL3NyYy9hbGwvY29uc3QnO1xuaW1wb3J0IHsgX19jYWNoZU1hcEZpbGUgfSBmcm9tICcuLi9saWIvY29uc3QnO1xuaW1wb3J0IHsgam9pbiwgYmFzZW5hbWUgfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgcmVhZEpTT04sIHdyaXRlSlNPTiwgcmVhZEZpbGUsIHJlbW92ZSB9IGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCB7IElDYWNoZU1hcCwgSUd1bkVwdWJOb2RlLCBJR3VuRXB1YkRhdGEsIElDYWNoZU1hcFJvdywgRW51bUNhY2hlTWFwUm93U3RhdHVzIH0gZnJvbSAnLi4vbGliL3R5cGVzJztcbmltcG9ydCB7IFBhc3NUaHJvdWdoIH0gZnJvbSBcInN0cmVhbVwiO1xuaW1wb3J0IHsgZnJvbUJ1ZmZlciB9IGZyb20gJ2ZpbGUtdHlwZSc7XG5pbXBvcnQgX19yb290IGZyb20gJy4uL2xpYi9fX3Jvb3QnO1xuaW1wb3J0IHsgcmFjZUd1bkVwdWJGaWxlLCBtYWtlQXJyYXlFbnRyeXMsIG5vZGVHdW5FcHViRmlsZSB9IGZyb20gJy4uL2xpYi9ndW4vZXB1YkZpbGUnO1xuaW1wb3J0IHsgc2l0ZUlEMklES0VZIH0gZnJvbSAnbm92ZWwtZG93bmxvYWRlci9zcmMvYWxsL3V0aWwnO1xuaW1wb3J0IGNvbnNvbGUgZnJvbSAnZGVidWctY29sb3IyL2xvZ2dlcic7XG5pbXBvcnQgY2hlY2tHdW5EYXRhIGZyb20gJy4uL2xpYi9ndW4vY2hlY2tEYXRhJztcbmltcG9ydCB7IGFzeW5jIGFzIGNyb3NzU3Bhd24gfSBmcm9tICdjcm9zcy1zcGF3bi1leHRyYSc7XG5cbmZ1bmN0aW9uIGZpbGVIYW5kbGVyKClcbntcblx0Y29uc3Qgcm91dGVyID0gUm91dGVyKCk7XG5cblx0cm91dGVyLnVzZSgnLzpzaXRlSUQvOm5vdmVsSUQnLCAocmVxLCByZXMpID0+XG5cdHtcblx0XHRsZXQgcXVlcnkgPSB7XG5cdFx0XHQuLi5yZXEucGFyYW1zLFxuXHRcdFx0Li4ucmVxLnF1ZXJ5LFxuXHRcdH07XG5cblx0XHRkZWxldGUgcXVlcnkuc2l0ZUlEO1xuXHRcdGRlbGV0ZSBxdWVyeS5pZDtcblxuXHRcdGNvbnNvbGUuZGVidWcocmVxLm1ldGhvZCwgcmVxLmJhc2VVcmwsIHJlcS51cmwsIHJlcS5wYXJhbXMsIHF1ZXJ5KTtcblxuXHRcdGxldCBzaXRlSUQgPSBTdHJpbmcocmVxLnBhcmFtcy5zaXRlSUQgfHwgJycpXG5cdFx0XHQudHJpbSgpXG5cdFx0XHQucmVwbGFjZSgvXFwueG1sJHxbXFwvXFxcXF0rL2lnLCAnJylcblx0XHQ7XG5cdFx0bGV0IG5vdmVsX2lkID0gU3RyaW5nKHJlcS5wYXJhbXMubm92ZWxJRCB8fCAnJylcblx0XHRcdC50cmltKClcblx0XHQ7XG5cblx0XHRpZiAoc2l0ZUlELnRvTG93ZXJDYXNlKCkgPT09ICdkbXpqJylcblx0XHR7XG5cdFx0XHRzaXRlSUQgPSBFbnVtTm92ZWxTaXRlTGlzdC5Ob3ZlbFNpdGVEbXpqQXBpXG5cdFx0fVxuXG5cdFx0bGV0IElES0VZID0gc2l0ZUlEMklES0VZKHNpdGVJRCk7XG5cblx0XHRsZXQgbWFwX2ZpbGUgPSBfX2NhY2hlTWFwRmlsZTtcblxuXHRcdHJldHVybiBCbHVlYmlyZFxuXHRcdFx0LnJlc29sdmUoSURLRVkpXG5cdFx0XHQudGFwKElES0VZID0+IHtcblx0XHRcdFx0aWYgKCFJREtFWSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoYCR7c2l0ZUlEfSDmqKHntYTkuI3lrZjlnKhgKSlcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICghbm92ZWxfaWQpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKGDmspLmnInmjIflrprpnIDopoHkuIvovInnmoQgaWQ6ICcke25vdmVsX2lkfSdgKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQudGhlbihhc3luYyAoKSA9PlxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgZ3VuRGF0YSA9IGF3YWl0IHJhY2VHdW5FcHViRmlsZShbXG5cdFx0XHRcdFx0XHQvL3JlcS5wYXJhbXMuc2l0ZUlELFxuXHRcdFx0XHRcdFx0Ly9zaXRlSUQsXG5cdFx0XHRcdFx0SURLRVksXG5cdFx0XHRcdFx0XSwgW1xuXHRcdFx0XHRcdFx0cmVxLnBhcmFtcy5ub3ZlbElELFxuXHRcdFx0XHRcdFx0bm92ZWxfaWQsXG5cdFx0XHRcdFx0XSlcblx0XHRcdFx0XHQudGhlbihhc3luYyAoZGF0YSkgPT5cblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRsZXQgYm9vbDogYm9vbGVhbiA9IGNoZWNrR3VuRGF0YShkYXRhKTtcblxuXHRcdFx0XHRcdFx0aWYgKCFjaGVja0d1bkRhdGEoZGF0YSkpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGxldCB7IGJhc2U2NCwgZmlsZW5hbWUsIGV4aXN0cywgdGltZXN0YW1wIH0gPSAoZGF0YSB8fCB7fSkgYXMgRXhjbHVkZTxJR3VuRXB1Yk5vZGUsIHtcblx0XHRcdFx0XHRcdFx0XHRleGlzdHM6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHR9PjtcblxuXHRcdFx0XHRcdFx0XHRsZXQgZ3VuID0gbm9kZUd1bkVwdWJGaWxlPEV4Y2x1ZGU8SUd1bkVwdWJOb2RlLCB7XG5cdFx0XHRcdFx0XHRcdFx0ZXhpc3RzOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0fT4+KElES0VZLCByZXEucGFyYW1zLm5vdmVsSUQpO1xuXG5cdFx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdFx0dGltZXN0YW1wID0gdGltZXN0YW1wIHx8IGF3YWl0IGd1bi5nZXQoJ3RpbWVzdGFtcCcpO1xuXG5cdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YgdGltZXN0YW1wID09PSAnbnVtYmVyJylcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdFx0XHRmaWxlbmFtZSA9IGZpbGVuYW1lIHx8IGF3YWl0IGd1bi5nZXQoJ2ZpbGVuYW1lJyk7XG5cblx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIGZpbGVuYW1lID09PSAnc3RyaW5nJylcblx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0XHRcdFx0XHRiYXNlNjQgPSBiYXNlNjQgfHwgYXdhaXQgZ3VuLmdldCgnYmFzZTY0Jyk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YgYmFzZTY0ID09PSAnc3RyaW5nJylcblx0XHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YSA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRiYXNlNjQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXhpc3RzOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZpbGVuYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVzdGFtcCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAoY2hlY2tHdW5EYXRhKGRhdGEpKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRsZXQgeyBiYXNlNjQsIGZpbGVuYW1lLCBleGlzdHMsIHRpbWVzdGFtcCB9ID0gZGF0YTtcblx0XHRcdFx0XHRcdFx0bGV0IGlzR3VuID0gZmFsc2U7XG5cblx0XHRcdFx0XHRcdFx0Y29uc29sZS5pbmZvKGDmlrxQMlDnt6nlrZjnmbznj77mqpTmoYguLi5gLCBuZXcgRGF0ZSh0aW1lc3RhbXApKTtcblxuXHRcdFx0XHRcdFx0XHRpZiAocXVlcnkuZGVidWcgfHwgcXVlcnkuZm9yY2UpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmluZm8oYOeZvOePvuW8t+WItuS4i+i8ieaMh+S7pO+8jOacrOasoeWwh+eEoeimlue3qeWtmGAsIHF1ZXJ5KVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgKChEYXRlLm5vdygpIC0gZGF0YS50aW1lc3RhbXApIDwgODY0MDAgKiAxMDAwKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0aXNHdW4gPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUud2Fybihg55uu5qiZ5qqU5qGI5bey6YGO5pyf77yM6Kmm5ZyW6YeN5paw5bu656uL5qqU5qGIYClcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRcdFx0YmFzZTY0LFxuXHRcdFx0XHRcdFx0XHRcdGZpbGVuYW1lLFxuXHRcdFx0XHRcdFx0XHRcdGV4aXN0cyxcblx0XHRcdFx0XHRcdFx0XHR0aW1lc3RhbXAsXG5cdFx0XHRcdFx0XHRcdFx0aXNHdW4sXG5cdFx0XHRcdFx0XHRcdH0gYXMgSUd1bkVwdWJEYXRhXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChib29sID09PSBmYWxzZSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKGDmlrxQMlDnt6nlrZjnmbznj77mqpTmoYguLi5gLCBg5L2G6LOH5paZ5Ly85LmO5bey5pCN5q+AYCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5pbmZvKGDmspLmnInnmbznj75QMlDnt6nlrZguLi5gKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0cmV0dXJuIG51bGxcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQ7XG5cblx0XHRcdFx0cmV0dXJuIGd1bkRhdGFcblx0XHRcdH0pXG5cdFx0XHQudGhlbihhc3luYyAoZ3VuRGF0YSkgPT5cblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG5cdFx0XHRcdFx0LnRoZW4oYXN5bmMgKCkgPT5cblx0XHRcdFx0XHR7XG5cblx0XHRcdFx0XHRcdGlmIChndW5EYXRhICYmIGd1bkRhdGEuaXNHdW4pXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBndW5EYXRhXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGDlj5blvpfmqpTmoYjkuK0uLi5gKTtcblx0XHRcdFx0XHRcdGxldCBjcCA9IGF3YWl0IGNyb3NzU3Bhd24oJ25vZGUnLCBbXG5cdFx0XHRcdFx0XHRcdCctLWV4cGVyaW1lbnRhbC13b3JrZXInLFxuXHRcdFx0XHRcdFx0XHRqb2luKF9fcm9vdCwgYC4vY2xpL2NsaS5qc2ApLFxuXHRcdFx0XHRcdFx0XHQnLS1tb2QnLFxuXHRcdFx0XHRcdFx0XHQnYWxsJyxcblx0XHRcdFx0XHRcdFx0Jy0tc2l0ZUlEJyxcblx0XHRcdFx0XHRcdFx0c2l0ZUlELFxuXHRcdFx0XHRcdFx0XHQnLS1ub3ZlbF9pZCcsXG5cdFx0XHRcdFx0XHRcdG5vdmVsX2lkLFxuXHRcdFx0XHRcdFx0XSwge1xuXHRcdFx0XHRcdFx0XHRzdGRpbzogJ2luaGVyaXQnLFxuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdGlmIChjcC5lcnJvcilcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoY3AuZXJyb3IpXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGxldCBtYXA6IElDYWNoZU1hcCA9IGF3YWl0IHJlYWRKU09OKG1hcF9maWxlKVxuXHRcdFx0XHRcdFx0XHQuY2F0Y2goZSA9PiBudWxsKVxuXHRcdFx0XHRcdFx0O1xuXG5cdFx0XHRcdFx0XHRpZiAoIWd1bkRhdGEgJiYgKCFtYXAgfHwgIW1hcFtJREtFWV0gfHwgIW1hcFtJREtFWV1bbm92ZWxfaWRdKSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Z3VuRGF0YSA9IGF3YWl0IHJhY2VHdW5FcHViRmlsZShbXG5cdFx0XHRcdFx0XHRcdFx0Ly9yZXEucGFyYW1zLnNpdGVJRCxcblx0XHRcdFx0XHRcdFx0XHQvL3NpdGVJRCxcblx0XHRcdFx0XHRcdFx0XHRJREtFWSxcblx0XHRcdFx0XHRcdFx0XSwgW1xuXHRcdFx0XHRcdFx0XHRcdHJlcS5wYXJhbXMubm92ZWxJRCxcblx0XHRcdFx0XHRcdFx0XHRub3ZlbF9pZCxcblx0XHRcdFx0XHRcdFx0XSkudGhlbihhc3luYyAoZGF0YSkgPT5cblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGlmIChjaGVja0d1bkRhdGEoZGF0YSkpXG5cdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IHsgYmFzZTY0LCBmaWxlbmFtZSwgZXhpc3RzLCB0aW1lc3RhbXAgfSA9IGRhdGE7XG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgaXNHdW4gPSB0cnVlO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRiYXNlNjQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZpbGVuYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRleGlzdHMsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRpbWVzdGFtcCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXNHdW4sXG5cdFx0XHRcdFx0XHRcdFx0XHR9IGFzIElHdW5FcHViRGF0YVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0aWYgKGd1bkRhdGEpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZ3VuRGF0YVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmICghbWFwIHx8ICFtYXBbSURLRVldIHx8ICFtYXBbSURLRVldW25vdmVsX2lkXSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5kaXIobWFwKTtcblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKGDlu7rnq4vmqpTmoYjmmYLlpLHmlZfvvIwke3NpdGVJRH0gJHtub3ZlbF9pZH0g5Y+v6IO95LiN5a2Y5Zyo5oiW6Kej5p6Q5aSx5pWXLi4uYCkpXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChtYXBbSURLRVldW25vdmVsX2lkXS5zdGF0dXMgPT09IEVudW1DYWNoZU1hcFJvd1N0YXR1cy5XQUlUSU5HX1JFVFJZKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRsZXQgZSA9IG5ldyBFcnJvcihg5oqT5Y+WICR7c2l0ZUlEfSAke25vdmVsX2lkfSDkvobmupDmmYLlpLHmlZfvvIzkvLrmnI3lmajlj6/og73lv5nnoozmiJbmi5LntZXlm57mh4nvvIzoq4vkuYvlvozlho3ph43oqaYuLi5gKTtcblxuXHRcdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0XHRcdGUuU3RhdHVzQ29kZSA9IDUwNDtcblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZSlcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0bGV0IF9kYXRhID0gbWFwW0lES0VZXVtub3ZlbF9pZF07XG5cblx0XHRcdFx0XHRcdGRlbGV0ZSBtYXBbSURLRVldW19kYXRhLm5vdmVsX2lkMl07XG5cdFx0XHRcdFx0XHRkZWxldGUgbWFwW0lES0VZXVtfZGF0YS5ub3ZlbF9pZF07XG5cblx0XHRcdFx0XHRcdGF3YWl0IHdyaXRlSlNPTihtYXBfZmlsZSwgbWFwLCB7IHNwYWNlczogMiB9KS5jYXRjaChlID0+XG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoYOeZvOeUn+mMr+iqpO+8jOeEoeazleWvq+WFpee3qeWtmOaqlOahiCAke21hcF9maWxlfWApO1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGUpXG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIF9kYXRhXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuY2F0Y2goZSA9PlxuXHRcdFx0XHRcdHtcblxuXHRcdFx0XHRcdFx0aWYgKGd1bkRhdGEgJiYgZ3VuRGF0YS5leGlzdHMpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUud2Fybihg5qqU5qGI5bu656uL5aSx5pWX77yM5L2/55SoUDJQ57ep5a2Y5Luj5pu/YCk7XG5cblx0XHRcdFx0XHRcdFx0Z3VuRGF0YS5pc0d1biA9IHRydWU7XG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIGd1bkRhdGFcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGUpXG5cdFx0XHRcdFx0fSkgYXMgUHJvbWlzZTxJR3VuRXB1YkRhdGEgJiBJQ2FjaGVNYXBSb3c+XG5cdFx0XHRcdFx0O1xuXHRcdFx0fSlcblx0XHRcdC50aGVuKGFzeW5jIChkYXRhKSA9PlxuXHRcdFx0e1xuXHRcdFx0XHRjb25zb2xlLnN1Y2Nlc3MoYOaIkOWKn+WPluW+l+aqlOahiC4uLmApO1xuXG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0bGV0IGZpbGVDb250ZW50czogQnVmZmVyID0gZGF0YS5iYXNlNjQgJiYgQnVmZmVyLmZyb20oZGF0YS5iYXNlNjQsICdiYXNlNjQnKSB8fCBhd2FpdCByZWFkRmlsZShkYXRhLmVwdWIpO1xuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdGxldCBmaWxlbmFtZTogc3RyaW5nID0gZGF0YS5maWxlbmFtZSB8fCBJREtFWSArICdfJyArIGJhc2VuYW1lKGRhdGEuZXB1Yik7XG5cblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRpZiAoIWRhdGEuaXNHdW4gfHwgdHJ1ZSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNvbnNvbGUuZGVidWcoYOWwh+aqlOahiOWEsuWtmOWIsFAyUOe3qeWtmGApO1xuXG5cdFx0XHRcdFx0bGV0IGd1bkRhdGE6IElHdW5FcHViTm9kZSA9IHtcblx0XHRcdFx0XHRcdHRpbWVzdGFtcDogZGF0YS5pc0d1biA/IGRhdGEudGltZXN0YW1wIDogRGF0ZS5ub3coKSxcblx0XHRcdFx0XHRcdGV4aXN0czogdHJ1ZSxcblx0XHRcdFx0XHRcdGZpbGVuYW1lLFxuXHRcdFx0XHRcdFx0YmFzZTY0OiBmaWxlQ29udGVudHMudG9TdHJpbmcoJ2Jhc2U2NCcpLFxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRtYWtlQXJyYXlFbnRyeXMoW1xuXHRcdFx0XHRcdFx0Ly9zaXRlSUQsXG5cdFx0XHRcdFx0XHQvL3JlcS5wYXJhbXMuc2l0ZUlELFxuXHRcdFx0XHRcdFx0Ly9kYXRhLklES0VZLFxuXHRcdFx0XHRcdFx0SURLRVksXG5cdFx0XHRcdFx0XSwgW1xuXHRcdFx0XHRcdFx0bm92ZWxfaWQsXG5cdFx0XHRcdFx0XHRyZXEucGFyYW1zLm5vdmVsSUQsXG5cdFx0XHRcdFx0XHRkYXRhLm5vdmVsX2lkLFxuXHRcdFx0XHRcdFx0ZGF0YS5ub3ZlbF9pZDIsXG5cdFx0XHRcdFx0XHRub3ZlbF9pZCxcblx0XHRcdFx0XHRdKS5mb3JFYWNoKChbc2l0ZUlELCBub3ZlbF9pZF0pID0+IG5vZGVHdW5FcHViRmlsZShzaXRlSUQsIG5vdmVsX2lkKS5wdXQoZ3VuRGF0YSkpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IHJlYWRTdHJlYW0gPSBuZXcgUGFzc1Rocm91Z2goKTtcblx0XHRcdFx0cmVhZFN0cmVhbS5lbmQoZmlsZUNvbnRlbnRzKTtcblxuXHRcdFx0XHRsZXQgeyBtaW1lLCBleHQgfSA9IGF3YWl0IGZyb21CdWZmZXIoZmlsZUNvbnRlbnRzKTtcblxuXHRcdFx0XHRpZiAoZXh0ID09PSAnZXB1YicgJiYgbWltZSA9PT0gJ2FwcGxpY2F0aW9uL3ppcCcpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRtaW1lID0gJ2FwcGxpY2F0aW9uL2VwdWIremlwJztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJlcy5zZXQoJ0NvbnRlbnQtZGlzcG9zaXRpb24nLCAnYXR0YWNobWVudDsgZmlsZW5hbWU9JyArIGZpbGVuYW1lKTtcblx0XHRcdFx0cmVzLnNldCgnQ29udGVudC1UeXBlJywgbWltZSk7XG5cblx0XHRcdFx0Y29uc29sZS5pbmZvKGDlsIfmqpTmoYjlgrPpgIHoh7PlrqLmiLbnq68uLi5gKTtcblx0XHRcdFx0cmVhZFN0cmVhbS5waXBlKHJlcyk7XG5cblx0XHRcdFx0aWYgKHF1ZXJ5LmRlYnVnKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhg5b+955Wl5Yiq6Zmk5LiL6LyJ5pqr5a2YICR7ZGF0YS5vdXRwdXREaXJ9YCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRhdGEucmVtb3ZlQ2FsbGJhY2sgPT09ICdmdW5jdGlvbicpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRkYXRhLnJlbW92ZUNhbGxiYWNrKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoZGF0YS5vdXRwdXREaXIpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZW1vdmUoZGF0YS5vdXRwdXREaXIpXG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goZSA9PlxuXHRcdFx0e1xuXG5cdFx0XHRcdGxldCB7IG1lc3NhZ2UgfSA9IGU7XG5cdFx0XHRcdGlmIChlLmNvZGUgPT09ICdFTk9FTlQnKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bWVzc2FnZSA9IGBpZCDkuI3lrZjlnKgg5oiWIOS8uuacjeWZqOmboue3mmBcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCBkYXRhID0ge1xuXHRcdFx0XHRcdGVycm9yOiBtZXNzYWdlLFxuXHRcdFx0XHRcdHBhcmFtczogcmVxLnBhcmFtcyxcblx0XHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KCksXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0cmVzLnN0YXR1cyg0MDQpLmpzb24oZGF0YSk7XG5cblx0XHRcdFx0Y29uc29sZS53YXJuKGRhdGEpO1xuXG5cdFx0XHRcdGNvbnNvbGUuZGVidWcoYOS7peS4i+mMr+iqpOioiuaBr+eCuumZpOmMr+eUqO+8jOS4pumdnuavj+WAi+mDveacg+Wwjeeoi+W8j+mAoOaIkOW9semfvyA9PmAsIGUpXG5cblx0XHRcdH0pXG5cdH0pO1xuXG5cdHJldHVybiByb3V0ZXJcbn1cblxuZXhwb3J0IGRlZmF1bHQgZmlsZUhhbmRsZXJcbiJdfQ==