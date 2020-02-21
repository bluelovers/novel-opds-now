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
const util_1 = require("novel-downloader/src/all/util");
const logger_1 = __importDefault(require("debug-color2/logger"));
const cross_spawn_extra_1 = require("cross-spawn-extra");
const store_1 = require("../lib/store");
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
            logger_1.default.info(`檢查是否存在緩存...`);
            return store_1.getGunEpubFile(IDKEY, [
                req.params.novelID,
                novel_id,
            ], {
                query,
            });
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
                    gunData = await store_1.getGunEpubFile2([
                        IDKEY,
                    ], [
                        req.params.novelID,
                        novel_id,
                    ], {
                        query,
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
                    base64: data.isGun && data.base64 ? data.base64 : fileContents.toString('base64'),
                };
                store_1.putGunEpubFile([
                    IDKEY,
                ], [
                    novel_id,
                    req.params.novelID,
                    data.novel_id,
                    data.novel_id2,
                    novel_id,
                ], gunData, {});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQSxxQ0FBaUM7QUFDakMsd0RBQWtEO0FBQ2xELDBEQUFtRTtBQUNuRSx3Q0FBOEM7QUFDOUMsK0JBQXNDO0FBQ3RDLHVDQUFpRTtBQUVqRSxtQ0FBcUM7QUFDckMseUNBQXVDO0FBQ3ZDLDJEQUFtQztBQUVuQyx3REFBNkQ7QUFDN0QsaUVBQTBDO0FBRTFDLHlEQUF3RDtBQUN4RCx3Q0FBK0U7QUFFL0UsU0FBUyxXQUFXO0lBRW5CLE1BQU0sTUFBTSxHQUFHLGdCQUFNLEVBQUUsQ0FBQztJQUV4QixNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBRTVDLElBQUksS0FBSyxHQUFHO1lBQ1gsR0FBRyxHQUFHLENBQUMsTUFBTTtZQUNiLEdBQUcsR0FBRyxDQUFDLEtBQUs7U0FDWixDQUFDO1FBRUYsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQ3BCLE9BQU8sS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUVoQixnQkFBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRW5FLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7YUFDMUMsSUFBSSxFQUFFO2FBQ04sT0FBTyxDQUFDLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUNoQztRQUNELElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7YUFDN0MsSUFBSSxFQUFFLENBQ1A7UUFFRCxJQUFJLE1BQU0sQ0FBQyxXQUFXLEVBQUUs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QUFDLE1BQU07Z0JBQ2xCLFNBQVMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFO2FBQ3JCLENBQUM7WUFFRixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUUzQixnQkFBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVuQixnQkFBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUVoRCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxNQUFNLENBQUE7QUFDZCxDQUFDO0FBRUQsa0JBQWUsV0FBVyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8yLzEuXG4gKi9cblxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgQmx1ZWJpcmQsIHsgVGltZW91dEVycm9yIH0gZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHsgRW51bU5vdmVsU2l0ZUxpc3QgfSBmcm9tICdub3ZlbC1kb3dubG9hZGVyL3NyYy9hbGwvY29uc3QnO1xuaW1wb3J0IHsgX19jYWNoZU1hcEZpbGUgfSBmcm9tICcuLi9saWIvY29uc3QnO1xuaW1wb3J0IHsgam9pbiwgYmFzZW5hbWUgfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgcmVhZEpTT04sIHdyaXRlSlNPTiwgcmVhZEZpbGUsIHJlbW92ZSB9IGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCB7IElDYWNoZU1hcCwgSUd1bkVwdWJOb2RlLCBJR3VuRXB1YkRhdGEsIElDYWNoZU1hcFJvdywgRW51bUNhY2hlTWFwUm93U3RhdHVzIH0gZnJvbSAnLi4vbGliL3R5cGVzJztcbmltcG9ydCB7IFBhc3NUaHJvdWdoIH0gZnJvbSBcInN0cmVhbVwiO1xuaW1wb3J0IHsgZnJvbUJ1ZmZlciB9IGZyb20gJ2ZpbGUtdHlwZSc7XG5pbXBvcnQgX19yb290IGZyb20gJy4uL2xpYi9fX3Jvb3QnO1xuaW1wb3J0IHsgcmFjZUd1bkVwdWJGaWxlLCBtYWtlQXJyYXlFbnRyeXMsIG5vZGVHdW5FcHViRmlsZSB9IGZyb20gJy4uL2xpYi9ndW4vZXB1YkZpbGUnO1xuaW1wb3J0IHsgc2l0ZUlEMklES0VZIH0gZnJvbSAnbm92ZWwtZG93bmxvYWRlci9zcmMvYWxsL3V0aWwnO1xuaW1wb3J0IGNvbnNvbGUgZnJvbSAnZGVidWctY29sb3IyL2xvZ2dlcic7XG5pbXBvcnQgY2hlY2tHdW5EYXRhIGZyb20gJy4uL2xpYi9ndW4vY2hlY2tEYXRhJztcbmltcG9ydCB7IGFzeW5jIGFzIGNyb3NzU3Bhd24gfSBmcm9tICdjcm9zcy1zcGF3bi1leHRyYSc7XG5pbXBvcnQgeyBnZXRHdW5FcHViRmlsZSwgZ2V0R3VuRXB1YkZpbGUyLCBwdXRHdW5FcHViRmlsZSB9IGZyb20gJy4uL2xpYi9zdG9yZSc7XG5cbmZ1bmN0aW9uIGZpbGVIYW5kbGVyKClcbntcblx0Y29uc3Qgcm91dGVyID0gUm91dGVyKCk7XG5cblx0cm91dGVyLnVzZSgnLzpzaXRlSUQvOm5vdmVsSUQnLCAocmVxLCByZXMpID0+XG5cdHtcblx0XHRsZXQgcXVlcnkgPSB7XG5cdFx0XHQuLi5yZXEucGFyYW1zLFxuXHRcdFx0Li4ucmVxLnF1ZXJ5LFxuXHRcdH07XG5cblx0XHRkZWxldGUgcXVlcnkuc2l0ZUlEO1xuXHRcdGRlbGV0ZSBxdWVyeS5pZDtcblxuXHRcdGNvbnNvbGUuZGVidWcocmVxLm1ldGhvZCwgcmVxLmJhc2VVcmwsIHJlcS51cmwsIHJlcS5wYXJhbXMsIHF1ZXJ5KTtcblxuXHRcdGxldCBzaXRlSUQgPSBTdHJpbmcocmVxLnBhcmFtcy5zaXRlSUQgfHwgJycpXG5cdFx0XHQudHJpbSgpXG5cdFx0XHQucmVwbGFjZSgvXFwueG1sJHxbXFwvXFxcXF0rL2lnLCAnJylcblx0XHQ7XG5cdFx0bGV0IG5vdmVsX2lkID0gU3RyaW5nKHJlcS5wYXJhbXMubm92ZWxJRCB8fCAnJylcblx0XHRcdC50cmltKClcblx0XHQ7XG5cblx0XHRpZiAoc2l0ZUlELnRvTG93ZXJDYXNlKCkgPT09ICdkbXpqJylcblx0XHR7XG5cdFx0XHRzaXRlSUQgPSBFbnVtTm92ZWxTaXRlTGlzdC5Ob3ZlbFNpdGVEbXpqQXBpXG5cdFx0fVxuXG5cdFx0bGV0IElES0VZID0gc2l0ZUlEMklES0VZKHNpdGVJRCk7XG5cblx0XHRsZXQgbWFwX2ZpbGUgPSBfX2NhY2hlTWFwRmlsZTtcblxuXHRcdHJldHVybiBCbHVlYmlyZFxuXHRcdFx0LnJlc29sdmUoSURLRVkpXG5cdFx0XHQudGFwKElES0VZID0+XG5cdFx0XHR7XG5cdFx0XHRcdGlmICghSURLRVkpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKGAke3NpdGVJRH0g5qih57WE5LiN5a2Y5ZyoYCkpXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIW5vdmVsX2lkKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihg5rKS5pyJ5oyH5a6a6ZyA6KaB5LiL6LyJ55qEIGlkOiAnJHtub3ZlbF9pZH0nYCkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oYXN5bmMgKCkgPT5cblx0XHRcdHtcblx0XHRcdFx0Y29uc29sZS5pbmZvKGDmqqLmn6XmmK/lkKblrZjlnKjnt6nlrZguLi5gKTtcblxuXHRcdFx0XHRyZXR1cm4gZ2V0R3VuRXB1YkZpbGUoSURLRVksIFtcblx0XHRcdFx0XHRyZXEucGFyYW1zLm5vdmVsSUQsXG5cdFx0XHRcdFx0bm92ZWxfaWQsXG5cdFx0XHRcdF0sIHtcblx0XHRcdFx0XHRxdWVyeSxcblx0XHRcdFx0fSlcblx0XHRcdH0pXG5cdFx0XHQudGhlbihhc3luYyAoZ3VuRGF0YSkgPT5cblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG5cdFx0XHRcdFx0LnRoZW4oYXN5bmMgKCkgPT5cblx0XHRcdFx0XHR7XG5cblx0XHRcdFx0XHRcdGlmIChndW5EYXRhICYmIGd1bkRhdGEuaXNHdW4pXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBndW5EYXRhXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGDlj5blvpfmqpTmoYjkuK0uLi5gKTtcblx0XHRcdFx0XHRcdGxldCBjcCA9IGF3YWl0IGNyb3NzU3Bhd24oJ25vZGUnLCBbXG5cdFx0XHRcdFx0XHRcdCctLWV4cGVyaW1lbnRhbC13b3JrZXInLFxuXHRcdFx0XHRcdFx0XHRqb2luKF9fcm9vdCwgYC4vY2xpL2NsaS5qc2ApLFxuXHRcdFx0XHRcdFx0XHQnLS1tb2QnLFxuXHRcdFx0XHRcdFx0XHQnYWxsJyxcblx0XHRcdFx0XHRcdFx0Jy0tc2l0ZUlEJyxcblx0XHRcdFx0XHRcdFx0c2l0ZUlELFxuXHRcdFx0XHRcdFx0XHQnLS1ub3ZlbF9pZCcsXG5cdFx0XHRcdFx0XHRcdG5vdmVsX2lkLFxuXHRcdFx0XHRcdFx0XSwge1xuXHRcdFx0XHRcdFx0XHRzdGRpbzogJ2luaGVyaXQnLFxuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdGlmIChjcC5lcnJvcilcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoY3AuZXJyb3IpXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGxldCBtYXA6IElDYWNoZU1hcCA9IGF3YWl0IHJlYWRKU09OKG1hcF9maWxlKVxuXHRcdFx0XHRcdFx0XHQuY2F0Y2goZSA9PiBudWxsKVxuXHRcdFx0XHRcdFx0O1xuXG5cdFx0XHRcdFx0XHRpZiAoIWd1bkRhdGEgJiYgKCFtYXAgfHwgIW1hcFtJREtFWV0gfHwgIW1hcFtJREtFWV1bbm92ZWxfaWRdKSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Z3VuRGF0YSA9IGF3YWl0IGdldEd1bkVwdWJGaWxlMihbXG5cdFx0XHRcdFx0XHRcdFx0Ly9yZXEucGFyYW1zLnNpdGVJRCxcblx0XHRcdFx0XHRcdFx0XHQvL3NpdGVJRCxcblx0XHRcdFx0XHRcdFx0XHRJREtFWSxcblx0XHRcdFx0XHRcdFx0XSwgW1xuXHRcdFx0XHRcdFx0XHRcdHJlcS5wYXJhbXMubm92ZWxJRCxcblx0XHRcdFx0XHRcdFx0XHRub3ZlbF9pZCxcblx0XHRcdFx0XHRcdFx0XSwge1xuXHRcdFx0XHRcdFx0XHRcdHF1ZXJ5LFxuXHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHRpZiAoZ3VuRGF0YSlcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBndW5EYXRhXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKCFtYXAgfHwgIW1hcFtJREtFWV0gfHwgIW1hcFtJREtFWV1bbm92ZWxfaWRdKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmRpcihtYXApO1xuXG5cdFx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoYOW7uueri+aqlOahiOaZguWkseaVl++8jCR7c2l0ZUlEfSAke25vdmVsX2lkfSDlj6/og73kuI3lrZjlnKjmiJbop6PmnpDlpLHmlZcuLi5gKSlcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKG1hcFtJREtFWV1bbm92ZWxfaWRdLnN0YXR1cyA9PT0gRW51bUNhY2hlTWFwUm93U3RhdHVzLldBSVRJTkdfUkVUUlkpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGxldCBlID0gbmV3IEVycm9yKGDmipPlj5YgJHtzaXRlSUR9ICR7bm92ZWxfaWR9IOS+hua6kOaZguWkseaVl++8jOS8uuacjeWZqOWPr+iDveW/meeijOaIluaLkue1leWbnuaHie+8jOiri+S5i+W+jOWGjemHjeippi4uLmApO1xuXG5cdFx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdFx0ZS5TdGF0dXNDb2RlID0gNTA0O1xuXG5cdFx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlKVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRsZXQgX2RhdGEgPSBtYXBbSURLRVldW25vdmVsX2lkXTtcblxuXHRcdFx0XHRcdFx0ZGVsZXRlIG1hcFtJREtFWV1bX2RhdGEubm92ZWxfaWQyXTtcblx0XHRcdFx0XHRcdGRlbGV0ZSBtYXBbSURLRVldW19kYXRhLm5vdmVsX2lkXTtcblxuXHRcdFx0XHRcdFx0YXdhaXQgd3JpdGVKU09OKG1hcF9maWxlLCBtYXAsIHsgc3BhY2VzOiAyIH0pLmNhdGNoKGUgPT5cblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihg55m855Sf6Yyv6Kqk77yM54Sh5rOV5a+r5YWl57ep5a2Y5qqU5qGIICR7bWFwX2ZpbGV9YCk7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoZSlcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gX2RhdGFcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5jYXRjaChlID0+XG5cdFx0XHRcdFx0e1xuXG5cdFx0XHRcdFx0XHRpZiAoZ3VuRGF0YSAmJiBndW5EYXRhLmV4aXN0cylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKGDmqpTmoYjlu7rnq4vlpLHmlZfvvIzkvb/nlKhQMlDnt6nlrZjku6Pmm79gKTtcblxuXHRcdFx0XHRcdFx0XHRndW5EYXRhLmlzR3VuID0gdHJ1ZTtcblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZ3VuRGF0YVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZSlcblx0XHRcdFx0XHR9KSBhcyBQcm9taXNlPElHdW5FcHViRGF0YSAmIElDYWNoZU1hcFJvdz5cblx0XHRcdFx0XHQ7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oYXN5bmMgKGRhdGEpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGNvbnNvbGUuc3VjY2Vzcyhg5oiQ5Yqf5Y+W5b6X5qqU5qGILi4uYCk7XG5cblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRsZXQgZmlsZUNvbnRlbnRzOiBCdWZmZXIgPSBkYXRhLmJhc2U2NCAmJiBCdWZmZXIuZnJvbShkYXRhLmJhc2U2NCwgJ2Jhc2U2NCcpIHx8IGF3YWl0IHJlYWRGaWxlKGRhdGEuZXB1Yik7XG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0bGV0IGZpbGVuYW1lOiBzdHJpbmcgPSBkYXRhLmZpbGVuYW1lIHx8IElES0VZICsgJ18nICsgYmFzZW5hbWUoZGF0YS5lcHViKTtcblxuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdGlmICghZGF0YS5pc0d1biB8fCB0cnVlKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y29uc29sZS5kZWJ1Zyhg5bCH5qqU5qGI5YSy5a2Y5YiwUDJQ57ep5a2YYCk7XG5cblx0XHRcdFx0XHRsZXQgZ3VuRGF0YTogSUd1bkVwdWJOb2RlID0ge1xuXHRcdFx0XHRcdFx0dGltZXN0YW1wOiBkYXRhLmlzR3VuID8gZGF0YS50aW1lc3RhbXAgOiBEYXRlLm5vdygpLFxuXHRcdFx0XHRcdFx0ZXhpc3RzOiB0cnVlLFxuXHRcdFx0XHRcdFx0ZmlsZW5hbWUsXG5cdFx0XHRcdFx0XHRiYXNlNjQ6IGRhdGEuaXNHdW4gJiYgZGF0YS5iYXNlNjQgPyBkYXRhLmJhc2U2NCA6IGZpbGVDb250ZW50cy50b1N0cmluZygnYmFzZTY0JyksXG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdHB1dEd1bkVwdWJGaWxlKFtcblx0XHRcdFx0XHRcdC8vc2l0ZUlELFxuXHRcdFx0XHRcdFx0Ly9yZXEucGFyYW1zLnNpdGVJRCxcblx0XHRcdFx0XHRcdC8vZGF0YS5JREtFWSxcblx0XHRcdFx0XHRcdElES0VZLFxuXHRcdFx0XHRcdF0sIFtcblx0XHRcdFx0XHRcdG5vdmVsX2lkLFxuXHRcdFx0XHRcdFx0cmVxLnBhcmFtcy5ub3ZlbElELFxuXHRcdFx0XHRcdFx0ZGF0YS5ub3ZlbF9pZCxcblx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdGRhdGEubm92ZWxfaWQyLFxuXHRcdFx0XHRcdFx0bm92ZWxfaWQsXG5cdFx0XHRcdFx0XSwgZ3VuRGF0YSwge1xuXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsZXQgcmVhZFN0cmVhbSA9IG5ldyBQYXNzVGhyb3VnaCgpO1xuXHRcdFx0XHRyZWFkU3RyZWFtLmVuZChmaWxlQ29udGVudHMpO1xuXG5cdFx0XHRcdGxldCB7IG1pbWUsIGV4dCB9ID0gYXdhaXQgZnJvbUJ1ZmZlcihmaWxlQ29udGVudHMpO1xuXG5cdFx0XHRcdGlmIChleHQgPT09ICdlcHViJyAmJiBtaW1lID09PSAnYXBwbGljYXRpb24vemlwJylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG1pbWUgPSAnYXBwbGljYXRpb24vZXB1Yit6aXAnO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmVzLnNldCgnQ29udGVudC1kaXNwb3NpdGlvbicsICdhdHRhY2htZW50OyBmaWxlbmFtZT0nICsgZmlsZW5hbWUpO1xuXHRcdFx0XHRyZXMuc2V0KCdDb250ZW50LVR5cGUnLCBtaW1lKTtcblxuXHRcdFx0XHRjb25zb2xlLmluZm8oYOWwh+aqlOahiOWCs+mAgeiHs+WuouaItuerry4uLmApO1xuXHRcdFx0XHRyZWFkU3RyZWFtLnBpcGUocmVzKTtcblxuXHRcdFx0XHRpZiAocXVlcnkuZGVidWcpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKGDlv73nlaXliKrpmaTkuIvovInmmqvlrZggJHtkYXRhLm91dHB1dERpcn1gKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGF0YS5yZW1vdmVDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGRhdGEucmVtb3ZlQ2FsbGJhY2soKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmIChkYXRhLm91dHB1dERpcilcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJlbW92ZShkYXRhLm91dHB1dERpcilcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChlID0+XG5cdFx0XHR7XG5cblx0XHRcdFx0bGV0IHsgbWVzc2FnZSB9ID0gZTtcblx0XHRcdFx0aWYgKGUuY29kZSA9PT0gJ0VOT0VOVCcpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRtZXNzYWdlID0gYGlkIOS4jeWtmOWcqCDmiJYg5Ly65pyN5Zmo6Zui57eaYFxuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IGRhdGEgPSB7XG5cdFx0XHRcdFx0ZXJyb3I6IG1lc3NhZ2UsXG5cdFx0XHRcdFx0cGFyYW1zOiByZXEucGFyYW1zLFxuXHRcdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRyZXMuc3RhdHVzKDQwNCkuanNvbihkYXRhKTtcblxuXHRcdFx0XHRjb25zb2xlLndhcm4oZGF0YSk7XG5cblx0XHRcdFx0Y29uc29sZS5kZWJ1Zyhg5Lul5LiL6Yyv6Kqk6KiK5oGv54K66Zmk6Yyv55So77yM5Lim6Z2e5q+P5YCL6YO95pyD5bCN56iL5byP6YCg5oiQ5b2x6Z+/ID0+YCwgZSlcblxuXHRcdFx0fSlcblx0fSk7XG5cblx0cmV0dXJuIHJvdXRlclxufVxuXG5leHBvcnQgZGVmYXVsdCBmaWxlSGFuZGxlclxuIl19