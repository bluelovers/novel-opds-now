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
            })
                .tap(gunData => {
                if (gunData && gunData.exists) {
                    let msg = '';
                    if (!gunData.isGun) {
                        msg = `，但已超過緩存時間，將試圖先從原始網站抓取更新`;
                    }
                    logger_1.default.info(`於緩存發現檔案${msg}...`, new Date(gunData.timestamp));
                }
                else {
                    logger_1.default.info(`沒有發現緩存，或緩存已損毀...`);
                }
            });
        })
            .then(async (gunData) => {
            return Promise.resolve()
                .then(async () => {
                if (gunData && gunData.isGun) {
                    return gunData;
                }
                logger_1.default.log(`從原始來源網站抓取打包小說中...`);
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
            let fileContents;
            let isFromBuffer;
            if (data.base64) {
                let buf = Buffer.from(data.base64, 'base64');
                if (buf.length) {
                    fileContents = buf;
                    isFromBuffer = true;
                }
            }
            if (!fileContents) {
                fileContents = await fs_extra_1.readFile(data.epub);
            }
            let filename = data.filename || IDKEY + '_' + path_1.basename(data.epub);
            if (!data.isGun || true) {
                logger_1.default.debug(`將檔案儲存到P2P緩存`);
                let gunData = {
                    timestamp: isFromBuffer && data.timestamp ? data.timestamp : Date.now(),
                    exists: true,
                    filename,
                    base64: isFromBuffer ? data.base64 : fileContents.toString('base64'),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQSxxQ0FBaUM7QUFDakMsd0RBQWtEO0FBQ2xELDBEQUFtRTtBQUNuRSx3Q0FBOEM7QUFDOUMsK0JBQXNDO0FBQ3RDLHVDQUFpRTtBQUVqRSxtQ0FBcUM7QUFDckMseUNBQXVDO0FBQ3ZDLDJEQUFtQztBQUNuQyx3REFBNkQ7QUFDN0QsaUVBQTBDO0FBQzFDLHlEQUF3RDtBQUN4RCx3Q0FBK0U7QUFFL0UsU0FBUyxXQUFXO0lBRW5CLE1BQU0sTUFBTSxHQUFHLGdCQUFNLEVBQUUsQ0FBQztJQUV4QixNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBRTVDLElBQUksS0FBSyxHQUFHO1lBQ1gsR0FBRyxHQUFHLENBQUMsTUFBTTtZQUNiLEdBQUcsR0FBRyxDQUFDLEtBQUs7U0FDWixDQUFDO1FBRUYsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQ3BCLE9BQU8sS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUVoQixnQkFBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRW5FLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7YUFDMUMsSUFBSSxFQUFFO2FBQ04sT0FBTyxDQUFDLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUNoQztRQUNELElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7YUFDN0MsSUFBSSxFQUFFLENBQ1A7UUFFRCxJQUFJLE1BQU0sQ0FBQyxXQUFXLEVBQUUs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blxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgQmx1ZWJpcmQsIHsgVGltZW91dEVycm9yIH0gZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHsgRW51bU5vdmVsU2l0ZUxpc3QgfSBmcm9tICdub3ZlbC1kb3dubG9hZGVyL3NyYy9hbGwvY29uc3QnO1xuaW1wb3J0IHsgX19jYWNoZU1hcEZpbGUgfSBmcm9tICcuLi9saWIvY29uc3QnO1xuaW1wb3J0IHsgam9pbiwgYmFzZW5hbWUgfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgcmVhZEpTT04sIHdyaXRlSlNPTiwgcmVhZEZpbGUsIHJlbW92ZSB9IGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCB7IElDYWNoZU1hcCwgSUd1bkVwdWJOb2RlLCBJR3VuRXB1YkRhdGEsIElDYWNoZU1hcFJvdywgRW51bUNhY2hlTWFwUm93U3RhdHVzIH0gZnJvbSAnLi4vbGliL3R5cGVzJztcbmltcG9ydCB7IFBhc3NUaHJvdWdoIH0gZnJvbSBcInN0cmVhbVwiO1xuaW1wb3J0IHsgZnJvbUJ1ZmZlciB9IGZyb20gJ2ZpbGUtdHlwZSc7XG5pbXBvcnQgX19yb290IGZyb20gJy4uL2xpYi9fX3Jvb3QnO1xuaW1wb3J0IHsgc2l0ZUlEMklES0VZIH0gZnJvbSAnbm92ZWwtZG93bmxvYWRlci9zcmMvYWxsL3V0aWwnO1xuaW1wb3J0IGNvbnNvbGUgZnJvbSAnZGVidWctY29sb3IyL2xvZ2dlcic7XG5pbXBvcnQgeyBhc3luYyBhcyBjcm9zc1NwYXduIH0gZnJvbSAnY3Jvc3Mtc3Bhd24tZXh0cmEnO1xuaW1wb3J0IHsgZ2V0R3VuRXB1YkZpbGUsIGdldEd1bkVwdWJGaWxlMiwgcHV0R3VuRXB1YkZpbGUgfSBmcm9tICcuLi9saWIvc3RvcmUnO1xuXG5mdW5jdGlvbiBmaWxlSGFuZGxlcigpXG57XG5cdGNvbnN0IHJvdXRlciA9IFJvdXRlcigpO1xuXG5cdHJvdXRlci51c2UoJy86c2l0ZUlELzpub3ZlbElEJywgKHJlcSwgcmVzKSA9PlxuXHR7XG5cdFx0bGV0IHF1ZXJ5ID0ge1xuXHRcdFx0Li4ucmVxLnBhcmFtcyxcblx0XHRcdC4uLnJlcS5xdWVyeSxcblx0XHR9O1xuXG5cdFx0ZGVsZXRlIHF1ZXJ5LnNpdGVJRDtcblx0XHRkZWxldGUgcXVlcnkuaWQ7XG5cblx0XHRjb25zb2xlLmRlYnVnKHJlcS5tZXRob2QsIHJlcS5iYXNlVXJsLCByZXEudXJsLCByZXEucGFyYW1zLCBxdWVyeSk7XG5cblx0XHRsZXQgc2l0ZUlEID0gU3RyaW5nKHJlcS5wYXJhbXMuc2l0ZUlEIHx8ICcnKVxuXHRcdFx0LnRyaW0oKVxuXHRcdFx0LnJlcGxhY2UoL1xcLnhtbCR8W1xcL1xcXFxdKy9pZywgJycpXG5cdFx0O1xuXHRcdGxldCBub3ZlbF9pZCA9IFN0cmluZyhyZXEucGFyYW1zLm5vdmVsSUQgfHwgJycpXG5cdFx0XHQudHJpbSgpXG5cdFx0O1xuXG5cdFx0aWYgKHNpdGVJRC50b0xvd2VyQ2FzZSgpID09PSAnZG16aicpXG5cdFx0e1xuXHRcdFx0c2l0ZUlEID0gRW51bU5vdmVsU2l0ZUxpc3QuTm92ZWxTaXRlRG16akFwaVxuXHRcdH1cblxuXHRcdGxldCBJREtFWSA9IHNpdGVJRDJJREtFWShzaXRlSUQpO1xuXG5cdFx0bGV0IG1hcF9maWxlID0gX19jYWNoZU1hcEZpbGU7XG5cblx0XHRyZXR1cm4gQmx1ZWJpcmRcblx0XHRcdC5yZXNvbHZlKElES0VZKVxuXHRcdFx0LnRhcChJREtFWSA9PlxuXHRcdFx0e1xuXHRcdFx0XHRpZiAoIUlES0VZKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihgJHtzaXRlSUR9IOaooee1hOS4jeWtmOWcqGApKVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCFub3ZlbF9pZClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoYOaykuacieaMh+WumumcgOimgeS4i+i8ieeahCBpZDogJyR7bm92ZWxfaWR9J2ApKTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC50aGVuKGFzeW5jICgpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGNvbnNvbGUuaW5mbyhg5qqi5p+l5piv5ZCm5a2Y5Zyo57ep5a2YLi4uYCk7XG5cblx0XHRcdFx0cmV0dXJuIGdldEd1bkVwdWJGaWxlKElES0VZLCBbXG5cdFx0XHRcdFx0cmVxLnBhcmFtcy5ub3ZlbElELFxuXHRcdFx0XHRcdG5vdmVsX2lkLFxuXHRcdFx0XHRdLCB7XG5cdFx0XHRcdFx0cXVlcnksXG5cdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnRhcChndW5EYXRhID0+IHtcblxuXHRcdFx0XHRcdFx0aWYgKGd1bkRhdGEgJiYgZ3VuRGF0YS5leGlzdHMpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGxldCBtc2cgPSAnJztcblx0XHRcdFx0XHRcdFx0aWYgKCFndW5EYXRhLmlzR3VuKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0bXNnID0gYO+8jOS9huW3sui2hemBjue3qeWtmOaZgumWk++8jOWwh+ippuWcluWFiOW+nuWOn+Wni+e2suermeaKk+WPluabtOaWsGBcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuaW5mbyhg5pa857ep5a2Y55m854++5qqU5qGIJHttc2d9Li4uYCwgbmV3IERhdGUoZ3VuRGF0YS50aW1lc3RhbXApKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5pbmZvKGDmspLmnInnmbznj77nt6nlrZjvvIzmiJbnt6nlrZjlt7LmkI3mr4AuLi5gKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdDtcblx0XHRcdH0pXG5cdFx0XHQudGhlbihhc3luYyAoZ3VuRGF0YSkgPT5cblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG5cdFx0XHRcdFx0LnRoZW4oYXN5bmMgKCkgPT5cblx0XHRcdFx0XHR7XG5cblx0XHRcdFx0XHRcdGlmIChndW5EYXRhICYmIGd1bkRhdGEuaXNHdW4pXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBndW5EYXRhXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGDlvp7ljp/lp4vkvobmupDntrLnq5nmipPlj5bmiZPljIXlsI/oqqrkuK0uLi5gKTtcblx0XHRcdFx0XHRcdGxldCBjcCA9IGF3YWl0IGNyb3NzU3Bhd24oJ25vZGUnLCBbXG5cdFx0XHRcdFx0XHRcdCctLWV4cGVyaW1lbnRhbC13b3JrZXInLFxuXHRcdFx0XHRcdFx0XHRqb2luKF9fcm9vdCwgYC4vY2xpL2NsaS5qc2ApLFxuXHRcdFx0XHRcdFx0XHQnLS1tb2QnLFxuXHRcdFx0XHRcdFx0XHQnYWxsJyxcblx0XHRcdFx0XHRcdFx0Jy0tc2l0ZUlEJyxcblx0XHRcdFx0XHRcdFx0c2l0ZUlELFxuXHRcdFx0XHRcdFx0XHQnLS1ub3ZlbF9pZCcsXG5cdFx0XHRcdFx0XHRcdG5vdmVsX2lkLFxuXHRcdFx0XHRcdFx0XSwge1xuXHRcdFx0XHRcdFx0XHRzdGRpbzogJ2luaGVyaXQnLFxuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdGlmIChjcC5lcnJvcilcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoY3AuZXJyb3IpXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGxldCBtYXA6IElDYWNoZU1hcCA9IGF3YWl0IHJlYWRKU09OKG1hcF9maWxlKVxuXHRcdFx0XHRcdFx0XHQuY2F0Y2goZSA9PiBudWxsKVxuXHRcdFx0XHRcdFx0O1xuXG5cdFx0XHRcdFx0XHRpZiAoIWd1bkRhdGEgJiYgKCFtYXAgfHwgIW1hcFtJREtFWV0gfHwgIW1hcFtJREtFWV1bbm92ZWxfaWRdKSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Z3VuRGF0YSA9IGF3YWl0IGdldEd1bkVwdWJGaWxlMihbXG5cdFx0XHRcdFx0XHRcdFx0Ly9yZXEucGFyYW1zLnNpdGVJRCxcblx0XHRcdFx0XHRcdFx0XHQvL3NpdGVJRCxcblx0XHRcdFx0XHRcdFx0XHRJREtFWSxcblx0XHRcdFx0XHRcdFx0XSwgW1xuXHRcdFx0XHRcdFx0XHRcdHJlcS5wYXJhbXMubm92ZWxJRCxcblx0XHRcdFx0XHRcdFx0XHRub3ZlbF9pZCxcblx0XHRcdFx0XHRcdFx0XSwge1xuXHRcdFx0XHRcdFx0XHRcdHF1ZXJ5LFxuXHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHRpZiAoZ3VuRGF0YSlcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBndW5EYXRhXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKCFtYXAgfHwgIW1hcFtJREtFWV0gfHwgIW1hcFtJREtFWV1bbm92ZWxfaWRdKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmRpcihtYXApO1xuXG5cdFx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoYOW7uueri+aqlOahiOaZguWkseaVl++8jCR7c2l0ZUlEfSAke25vdmVsX2lkfSDlj6/og73kuI3lrZjlnKjmiJbop6PmnpDlpLHmlZcuLi5gKSlcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKG1hcFtJREtFWV1bbm92ZWxfaWRdLnN0YXR1cyA9PT0gRW51bUNhY2hlTWFwUm93U3RhdHVzLldBSVRJTkdfUkVUUlkpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGxldCBlID0gbmV3IEVycm9yKGDmipPlj5YgJHtzaXRlSUR9ICR7bm92ZWxfaWR9IOS+hua6kOaZguWkseaVl++8jOS8uuacjeWZqOWPr+iDveW/meeijOaIluaLkue1leWbnuaHie+8jOiri+S5i+W+jOWGjemHjeippi4uLmApO1xuXG5cdFx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdFx0ZS5TdGF0dXNDb2RlID0gNTA0O1xuXG5cdFx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlKVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRsZXQgX2RhdGEgPSBtYXBbSURLRVldW25vdmVsX2lkXTtcblxuXHRcdFx0XHRcdFx0ZGVsZXRlIG1hcFtJREtFWV1bX2RhdGEubm92ZWxfaWQyXTtcblx0XHRcdFx0XHRcdGRlbGV0ZSBtYXBbSURLRVldW19kYXRhLm5vdmVsX2lkXTtcblxuXHRcdFx0XHRcdFx0YXdhaXQgd3JpdGVKU09OKG1hcF9maWxlLCBtYXAsIHsgc3BhY2VzOiAyIH0pLmNhdGNoKGUgPT5cblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihg55m855Sf6Yyv6Kqk77yM54Sh5rOV5a+r5YWl57ep5a2Y5qqU5qGIICR7bWFwX2ZpbGV9YCk7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoZSlcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gX2RhdGFcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5jYXRjaChlID0+XG5cdFx0XHRcdFx0e1xuXG5cdFx0XHRcdFx0XHRpZiAoZ3VuRGF0YSAmJiBndW5EYXRhLmV4aXN0cylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKGDmqpTmoYjlu7rnq4vlpLHmlZfvvIzkvb/nlKhQMlDnt6nlrZjku6Pmm79gKTtcblxuXHRcdFx0XHRcdFx0XHRndW5EYXRhLmlzR3VuID0gdHJ1ZTtcblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZ3VuRGF0YVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZSlcblx0XHRcdFx0XHR9KSBhcyBQcm9taXNlPElHdW5FcHViRGF0YSAmIElDYWNoZU1hcFJvdz5cblx0XHRcdFx0XHQ7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oYXN5bmMgKGRhdGEpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGNvbnNvbGUuc3VjY2Vzcyhg5oiQ5Yqf5Y+W5b6X5qqU5qGILi4uYCk7XG5cblx0XHRcdFx0bGV0IGZpbGVDb250ZW50czogQnVmZmVyO1xuXHRcdFx0XHRsZXQgaXNGcm9tQnVmZmVyOiBib29sZWFuO1xuXG5cdFx0XHRcdGlmIChkYXRhLmJhc2U2NClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGxldCBidWYgPSBCdWZmZXIuZnJvbShkYXRhLmJhc2U2NCwgJ2Jhc2U2NCcpO1xuXG5cdFx0XHRcdFx0aWYgKGJ1Zi5sZW5ndGgpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0ZmlsZUNvbnRlbnRzID0gYnVmO1xuXHRcdFx0XHRcdFx0aXNGcm9tQnVmZmVyID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIWZpbGVDb250ZW50cylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGZpbGVDb250ZW50cyA9IGF3YWl0IHJlYWRGaWxlKGRhdGEuZXB1Yik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdGxldCBmaWxlbmFtZTogc3RyaW5nID0gZGF0YS5maWxlbmFtZSB8fCBJREtFWSArICdfJyArIGJhc2VuYW1lKGRhdGEuZXB1Yik7XG5cblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRpZiAoIWRhdGEuaXNHdW4gfHwgdHJ1ZSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNvbnNvbGUuZGVidWcoYOWwh+aqlOahiOWEsuWtmOWIsFAyUOe3qeWtmGApO1xuXG5cdFx0XHRcdFx0bGV0IGd1bkRhdGE6IElHdW5FcHViTm9kZSA9IHtcblx0XHRcdFx0XHRcdHRpbWVzdGFtcDogaXNGcm9tQnVmZmVyICYmIGRhdGEudGltZXN0YW1wID8gZGF0YS50aW1lc3RhbXAgOiBEYXRlLm5vdygpLFxuXHRcdFx0XHRcdFx0ZXhpc3RzOiB0cnVlLFxuXHRcdFx0XHRcdFx0ZmlsZW5hbWUsXG5cdFx0XHRcdFx0XHRiYXNlNjQ6IGlzRnJvbUJ1ZmZlciA/IGRhdGEuYmFzZTY0IDogZmlsZUNvbnRlbnRzLnRvU3RyaW5nKCdiYXNlNjQnKSxcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0cHV0R3VuRXB1YkZpbGUoW1xuXHRcdFx0XHRcdFx0Ly9zaXRlSUQsXG5cdFx0XHRcdFx0XHQvL3JlcS5wYXJhbXMuc2l0ZUlELFxuXHRcdFx0XHRcdFx0Ly9kYXRhLklES0VZLFxuXHRcdFx0XHRcdFx0SURLRVksXG5cdFx0XHRcdFx0XSwgW1xuXHRcdFx0XHRcdFx0bm92ZWxfaWQsXG5cdFx0XHRcdFx0XHRyZXEucGFyYW1zLm5vdmVsSUQsXG5cdFx0XHRcdFx0XHRkYXRhLm5vdmVsX2lkLFxuXHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdFx0ZGF0YS5ub3ZlbF9pZDIsXG5cdFx0XHRcdFx0XHRub3ZlbF9pZCxcblx0XHRcdFx0XHRdLCBndW5EYXRhLCB7XG5cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCByZWFkU3RyZWFtID0gbmV3IFBhc3NUaHJvdWdoKCk7XG5cdFx0XHRcdHJlYWRTdHJlYW0uZW5kKGZpbGVDb250ZW50cyk7XG5cblx0XHRcdFx0bGV0IHsgbWltZSwgZXh0IH0gPSBhd2FpdCBmcm9tQnVmZmVyKGZpbGVDb250ZW50cyk7XG5cblx0XHRcdFx0aWYgKGV4dCA9PT0gJ2VwdWInICYmIG1pbWUgPT09ICdhcHBsaWNhdGlvbi96aXAnKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bWltZSA9ICdhcHBsaWNhdGlvbi9lcHViK3ppcCc7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXMuc2V0KCdDb250ZW50LWRpc3Bvc2l0aW9uJywgJ2F0dGFjaG1lbnQ7IGZpbGVuYW1lPScgKyBmaWxlbmFtZSk7XG5cdFx0XHRcdHJlcy5zZXQoJ0NvbnRlbnQtVHlwZScsIG1pbWUpO1xuXG5cdFx0XHRcdGNvbnNvbGUuaW5mbyhg5bCH5qqU5qGI5YKz6YCB6Iez5a6i5oi256uvLi4uYCk7XG5cdFx0XHRcdHJlYWRTdHJlYW0ucGlwZShyZXMpO1xuXG5cdFx0XHRcdGlmIChxdWVyeS5kZWJ1Zylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coYOW/veeVpeWIqumZpOS4i+i8ieaaq+WtmCAke2RhdGEub3V0cHV0RGlyfWApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkYXRhLnJlbW92ZUNhbGxiYWNrID09PSAnZnVuY3Rpb24nKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0ZGF0YS5yZW1vdmVDYWxsYmFjaygpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKGRhdGEub3V0cHV0RGlyKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmVtb3ZlKGRhdGEub3V0cHV0RGlyKVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGUgPT5cblx0XHRcdHtcblxuXHRcdFx0XHRsZXQgeyBtZXNzYWdlIH0gPSBlO1xuXHRcdFx0XHRpZiAoZS5jb2RlID09PSAnRU5PRU5UJylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG1lc3NhZ2UgPSBgaWQg5LiN5a2Y5ZyoIOaIliDkvLrmnI3lmajpm6Lnt5pgXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsZXQgZGF0YSA9IHtcblx0XHRcdFx0XHRlcnJvcjogbWVzc2FnZSxcblx0XHRcdFx0XHRwYXJhbXM6IHJlcS5wYXJhbXMsXG5cdFx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpLFxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHJlcy5zdGF0dXMoNDA0KS5qc29uKGRhdGEpO1xuXG5cdFx0XHRcdGNvbnNvbGUud2FybihkYXRhKTtcblxuXHRcdFx0XHRjb25zb2xlLmRlYnVnKGDku6XkuIvpjK/oqqToqIrmga/ngrrpmaTpjK/nlKjvvIzkuKbpnZ7mr4/lgIvpg73mnIPlsI3nqIvlvI/pgKDmiJDlvbHpn78gPT5gLCBlKVxuXG5cdFx0XHR9KVxuXHR9KTtcblxuXHRyZXR1cm4gcm91dGVyXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZpbGVIYW5kbGVyXG4iXX0=