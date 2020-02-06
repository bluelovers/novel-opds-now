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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQSxxQ0FBaUM7QUFDakMsd0RBQWdDO0FBQ2hDLDBEQUFtRTtBQUNuRSx3Q0FBOEM7QUFDOUMsaURBQTBDO0FBQzFDLCtCQUFzQztBQUN0Qyx1Q0FBaUU7QUFFakUsbUNBQXFDO0FBQ3JDLHlDQUF1QztBQUN2QywyREFBbUM7QUFDbkMsa0RBQXdGO0FBQ3hGLHdEQUE2RDtBQUM3RCxpRUFBMEM7QUFDMUMscUVBQWdEO0FBRWhELFNBQVMsV0FBVztJQUVuQixNQUFNLE1BQU0sR0FBRyxnQkFBTSxFQUFFLENBQUM7SUFFeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUU1QyxJQUFJLEtBQUssR0FBRztZQUNYLEdBQUcsR0FBRyxDQUFDLE1BQU07WUFDYixHQUFHLEdBQUcsQ0FBQyxLQUFLO1NBQ1osQ0FBQztRQUVGLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUNwQixPQUFPLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFFaEIsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFdkQsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDL0IsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFFbEMsSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFLEtBQUssTUFBTSxFQUNuQztZQUNDLE1BQU0sR0FBRyx5QkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQTtTQUMzQztRQUVELElBQUksS0FBSyxHQUFHLG1CQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFakMsSUFBSSxRQUFRLEdB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LEtBQUssRUFBRSxPQUFPO2dCQUNkLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTTtnQkFDbEIsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7YUFDckIsQ0FBQztZQUVGLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTNCLGdCQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRW5CLGdCQUFPLENBQUMsS0FBSyxDQUFDLDZCQUE2QixFQUFFLENBQUMsQ0FBQyxDQUFBO1FBRWhELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLE1BQU0sQ0FBQTtBQUNkLENBQUM7QUFFRCxrQkFBZSxXQUFXLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzIvMS5cbiAqL1xuXG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdleHByZXNzJztcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgeyBFbnVtTm92ZWxTaXRlTGlzdCB9IGZyb20gJ25vdmVsLWRvd25sb2FkZXIvc3JjL2FsbC9jb25zdCc7XG5pbXBvcnQgeyBfX2NhY2hlTWFwRmlsZSB9IGZyb20gJy4uL2xpYi9jb25zdCc7XG5pbXBvcnQgeyBzcGF3blN5bmMgfSBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xuaW1wb3J0IHsgam9pbiwgYmFzZW5hbWUgfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgcmVhZEpTT04sIHdyaXRlSlNPTiwgcmVhZEZpbGUsIHJlbW92ZSB9IGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCB7IElDYWNoZU1hcCwgSUd1bkVwdWJOb2RlLCBJR3VuRXB1YkRhdGEsIElDYWNoZU1hcFJvdywgRW51bUNhY2hlTWFwUm93U3RhdHVzIH0gZnJvbSAnLi4vbGliL3R5cGVzJztcbmltcG9ydCB7IFBhc3NUaHJvdWdoIH0gZnJvbSBcInN0cmVhbVwiO1xuaW1wb3J0IHsgZnJvbUJ1ZmZlciB9IGZyb20gJ2ZpbGUtdHlwZSc7XG5pbXBvcnQgX19yb290IGZyb20gJy4uL2xpYi9fX3Jvb3QnO1xuaW1wb3J0IHsgcmFjZUd1bkVwdWJGaWxlLCBtYWtlQXJyYXlFbnRyeXMsIG5vZGVHdW5FcHViRmlsZSB9IGZyb20gJy4uL2xpYi9ndW4vZXB1YkZpbGUnO1xuaW1wb3J0IHsgc2l0ZUlEMklES0VZIH0gZnJvbSAnbm92ZWwtZG93bmxvYWRlci9zcmMvYWxsL3V0aWwnO1xuaW1wb3J0IGNvbnNvbGUgZnJvbSAnZGVidWctY29sb3IyL2xvZ2dlcic7XG5pbXBvcnQgY2hlY2tHdW5EYXRhIGZyb20gJy4uL2xpYi9ndW4vY2hlY2tEYXRhJztcblxuZnVuY3Rpb24gZmlsZUhhbmRsZXIoKVxue1xuXHRjb25zdCByb3V0ZXIgPSBSb3V0ZXIoKTtcblxuXHRyb3V0ZXIudXNlKCcvOnNpdGVJRC86bm92ZWxJRCcsIChyZXEsIHJlcykgPT5cblx0e1xuXHRcdGxldCBxdWVyeSA9IHtcblx0XHRcdC4uLnJlcS5wYXJhbXMsXG5cdFx0XHQuLi5yZXEucXVlcnksXG5cdFx0fTtcblxuXHRcdGRlbGV0ZSBxdWVyeS5zaXRlSUQ7XG5cdFx0ZGVsZXRlIHF1ZXJ5LmlkO1xuXG5cdFx0Y29uc29sZS5kZWJ1ZyhyZXEuYmFzZVVybCwgcmVxLnVybCwgcmVxLnBhcmFtcywgcXVlcnkpO1xuXG5cdFx0bGV0IHNpdGVJRCA9IHJlcS5wYXJhbXMuc2l0ZUlEO1xuXHRcdGxldCBub3ZlbF9pZCA9IHJlcS5wYXJhbXMubm92ZWxJRDtcblxuXHRcdGlmIChzaXRlSUQudG9Mb3dlckNhc2UoKSA9PT0gJ2RtemonKVxuXHRcdHtcblx0XHRcdHNpdGVJRCA9IEVudW1Ob3ZlbFNpdGVMaXN0Lk5vdmVsU2l0ZURtempBcGlcblx0XHR9XG5cblx0XHRsZXQgSURLRVkgPSBzaXRlSUQySURLRVkoc2l0ZUlEKTtcblxuXHRcdGxldCBtYXBfZmlsZSA9IF9fY2FjaGVNYXBGaWxlO1xuXG5cdFx0cmV0dXJuIEJsdWViaXJkXG5cdFx0XHQucmVzb2x2ZShJREtFWSlcblx0XHRcdC50YXAoSURLRVkgPT4ge1xuXHRcdFx0XHRpZiAoIUlES0VZKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihgJHtzaXRlSUR9IOaooee1hOS4jeWtmOWcqGApKVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oYXN5bmMgKCkgPT5cblx0XHRcdHtcblx0XHRcdFx0bGV0IGd1bkRhdGEgPSBhd2FpdCByYWNlR3VuRXB1YkZpbGUoW1xuXHRcdFx0XHRcdFx0Ly9yZXEucGFyYW1zLnNpdGVJRCxcblx0XHRcdFx0XHRcdC8vc2l0ZUlELFxuXHRcdFx0XHRcdElES0VZLFxuXHRcdFx0XHRcdF0sIFtcblx0XHRcdFx0XHRcdHJlcS5wYXJhbXMubm92ZWxJRCxcblx0XHRcdFx0XHRcdG5vdmVsX2lkLFxuXHRcdFx0XHRcdF0pXG5cdFx0XHRcdFx0LnRoZW4oYXN5bmMgKGRhdGEpID0+XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0bGV0IGJvb2w6IGJvb2xlYW4gPSBjaGVja0d1bkRhdGEoZGF0YSk7XG5cblx0XHRcdFx0XHRcdGlmICghY2hlY2tHdW5EYXRhKGRhdGEpKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRsZXQgeyBiYXNlNjQsIGZpbGVuYW1lLCBleGlzdHMsIHRpbWVzdGFtcCB9ID0gKGRhdGEgfHwge30pIGFzIEV4Y2x1ZGU8SUd1bkVwdWJOb2RlLCB7XG5cdFx0XHRcdFx0XHRcdFx0ZXhpc3RzOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0fT47XG5cblx0XHRcdFx0XHRcdFx0bGV0IGd1biA9IG5vZGVHdW5FcHViRmlsZTxFeGNsdWRlPElHdW5FcHViTm9kZSwge1xuXHRcdFx0XHRcdFx0XHRcdGV4aXN0czogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdH0+PihJREtFWSwgcmVxLnBhcmFtcy5ub3ZlbElEKTtcblxuXHRcdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0XHRcdHRpbWVzdGFtcCA9IHRpbWVzdGFtcCB8fCBhd2FpdCBndW4uZ2V0KCd0aW1lc3RhbXAnKTtcblxuXHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIHRpbWVzdGFtcCA9PT0gJ251bWJlcicpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0XHRcdFx0ZmlsZW5hbWUgPSBmaWxlbmFtZSB8fCBhd2FpdCBndW4uZ2V0KCdmaWxlbmFtZScpO1xuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBmaWxlbmFtZSA9PT0gJ3N0cmluZycpXG5cdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdFx0XHRcdFx0YmFzZTY0ID0gYmFzZTY0IHx8IGF3YWl0IGd1bi5nZXQoJ2Jhc2U2NCcpO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIGJhc2U2NCA9PT0gJ3N0cmluZycpXG5cdFx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEgPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YmFzZTY0LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGV4aXN0czogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmaWxlbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lc3RhbXAsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKGNoZWNrR3VuRGF0YShkYXRhKSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0bGV0IHsgYmFzZTY0LCBmaWxlbmFtZSwgZXhpc3RzLCB0aW1lc3RhbXAgfSA9IGRhdGE7XG5cdFx0XHRcdFx0XHRcdGxldCBpc0d1biA9IGZhbHNlO1xuXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuaW5mbyhg5pa8UDJQ57ep5a2Y55m854++5qqU5qGILi4uYCwgbmV3IERhdGUodGltZXN0YW1wKSk7XG5cblx0XHRcdFx0XHRcdFx0aWYgKHF1ZXJ5LmRlYnVnIHx8IHF1ZXJ5LmZvcmNlKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5pbmZvKGDnmbznj77lvLfliLbkuIvovInmjIfku6TvvIzmnKzmrKHlsIfnhKHoppbnt6nlrZhgLCBxdWVyeSlcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmICgoRGF0ZS5ub3coKSAtIGRhdGEudGltZXN0YW1wKSA8IDg2NDAwICogMTAwMClcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGlzR3VuID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oYOebruaomeaqlOahiOW3sumBjuacn++8jOippuWclumHjeaWsOW7uueri+aqlOahiGApXG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRcdGJhc2U2NCxcblx0XHRcdFx0XHRcdFx0XHRmaWxlbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRleGlzdHMsXG5cdFx0XHRcdFx0XHRcdFx0dGltZXN0YW1wLFxuXHRcdFx0XHRcdFx0XHRcdGlzR3VuLFxuXHRcdFx0XHRcdFx0XHR9IGFzIElHdW5FcHViRGF0YVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoYm9vbCA9PT0gZmFsc2UpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUud2Fybihg5pa8UDJQ57ep5a2Y55m854++5qqU5qGILi4uYCwgYOS9huizh+aWmeS8vOS5juW3suaQjeavgGApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuaW5mbyhg5rKS5pyJ55m854++UDJQ57ep5a2YLi4uYCk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHJldHVybiBudWxsXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0O1xuXG5cdFx0XHRcdHJldHVybiBndW5EYXRhXG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oYXN5bmMgKGd1bkRhdGEpID0+XG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuXHRcdFx0XHRcdC50aGVuKGFzeW5jICgpID0+XG5cdFx0XHRcdFx0e1xuXG5cdFx0XHRcdFx0XHRpZiAoZ3VuRGF0YSAmJiBndW5EYXRhLmlzR3VuKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZ3VuRGF0YVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhg5Y+W5b6X5qqU5qGI5LitLi4uYCk7XG5cdFx0XHRcdFx0XHRsZXQgY3AgPSBzcGF3blN5bmMoJ25vZGUnLCBbXG5cdFx0XHRcdFx0XHRcdCctLWV4cGVyaW1lbnRhbC13b3JrZXInLFxuXHRcdFx0XHRcdFx0XHRqb2luKF9fcm9vdCwgYC4vY2xpL2NsaS5qc2ApLFxuXHRcdFx0XHRcdFx0XHQnLS1tb2QnLFxuXHRcdFx0XHRcdFx0XHQnYWxsJyxcblx0XHRcdFx0XHRcdFx0Jy0tc2l0ZUlEJyxcblx0XHRcdFx0XHRcdFx0c2l0ZUlELFxuXHRcdFx0XHRcdFx0XHQnLS1ub3ZlbF9pZCcsXG5cdFx0XHRcdFx0XHRcdG5vdmVsX2lkLFxuXHRcdFx0XHRcdFx0XSwge1xuXHRcdFx0XHRcdFx0XHRzdGRpbzogJ2luaGVyaXQnLFxuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdGlmIChjcC5lcnJvcilcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGNwLmVycm9yKVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRsZXQgbWFwOiBJQ2FjaGVNYXAgPSBhd2FpdCByZWFkSlNPTihtYXBfZmlsZSkuY2F0Y2goZSA9PiBudWxsKTtcblxuXHRcdFx0XHRcdFx0aWYgKCFtYXAgfHwgIW1hcFtJREtFWV0gfHwgIW1hcFtJREtFWV1bbm92ZWxfaWRdKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmRpcihtYXApO1xuXG5cdFx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoYOW7uueri+aqlOahiOaZguWkseaVl++8jCR7c2l0ZUlEfSAke25vdmVsX2lkfSDlj6/og73kuI3lrZjlnKjmiJbop6PmnpDlpLHmlZcuLi5gKSlcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKG1hcFtJREtFWV1bbm92ZWxfaWRdLnN0YXR1cyA9PT0gRW51bUNhY2hlTWFwUm93U3RhdHVzLldBSVRJTkdfUkVUUlkpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGxldCBlID0gbmV3IEVycm9yKGDmipPlj5YgJHtzaXRlSUR9ICR7bm92ZWxfaWR9IOS+hua6kOaZguWkseaVl++8jOS8uuacjeWZqOWPr+iDveW/meeijOaIluaLkue1leWbnuaHie+8jOiri+S5i+W+jOWGjemHjeippi4uLmApO1xuXG5cdFx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdFx0ZS5TdGF0dXNDb2RlID0gNTA0O1xuXG5cdFx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlKVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRsZXQgX2RhdGEgPSBtYXBbSURLRVldW25vdmVsX2lkXTtcblxuXHRcdFx0XHRcdFx0ZGVsZXRlIG1hcFtJREtFWV1bX2RhdGEubm92ZWxfaWQyXTtcblx0XHRcdFx0XHRcdGRlbGV0ZSBtYXBbSURLRVldW19kYXRhLm5vdmVsX2lkXTtcblxuXHRcdFx0XHRcdFx0YXdhaXQgd3JpdGVKU09OKG1hcF9maWxlLCBtYXAsIHsgc3BhY2VzOiAyIH0pLmNhdGNoKGUgPT5cblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihg55m855Sf6Yyv6Kqk77yM54Sh5rOV5a+r5YWl57ep5a2Y5qqU5qGIICR7bWFwX2ZpbGV9YCk7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoZSlcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gX2RhdGFcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5jYXRjaChlID0+XG5cdFx0XHRcdFx0e1xuXG5cdFx0XHRcdFx0XHRpZiAoZ3VuRGF0YSAmJiBndW5EYXRhLmV4aXN0cylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKGDmqpTmoYjlu7rnq4vlpLHmlZfvvIzkvb/nlKhQMlDnt6nlrZjku6Pmm79gKTtcblxuXHRcdFx0XHRcdFx0XHRndW5EYXRhLmlzR3VuID0gdHJ1ZTtcblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZ3VuRGF0YVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZSlcblx0XHRcdFx0XHR9KSBhcyBQcm9taXNlPElHdW5FcHViRGF0YSAmIElDYWNoZU1hcFJvdz5cblx0XHRcdFx0XHQ7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oYXN5bmMgKGRhdGEpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGNvbnNvbGUuc3VjY2Vzcyhg5oiQ5Yqf5Y+W5b6X5qqU5qGILi4uYCk7XG5cblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRsZXQgZmlsZUNvbnRlbnRzOiBCdWZmZXIgPSBkYXRhLmJhc2U2NCAmJiBCdWZmZXIuZnJvbShkYXRhLmJhc2U2NCwgJ2Jhc2U2NCcpIHx8IGF3YWl0IHJlYWRGaWxlKGRhdGEuZXB1Yik7XG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0bGV0IGZpbGVuYW1lOiBzdHJpbmcgPSBkYXRhLmZpbGVuYW1lIHx8IElES0VZICsgJ18nICsgYmFzZW5hbWUoZGF0YS5lcHViKTtcblxuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdGlmICghZGF0YS5pc0d1biB8fCB0cnVlKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y29uc29sZS5kZWJ1Zyhg5bCH5qqU5qGI5YSy5a2Y5YiwUDJQ57ep5a2YYCk7XG5cblx0XHRcdFx0XHRsZXQgZ3VuRGF0YTogSUd1bkVwdWJOb2RlID0ge1xuXHRcdFx0XHRcdFx0dGltZXN0YW1wOiBkYXRhLmlzR3VuID8gZGF0YS50aW1lc3RhbXAgOiBEYXRlLm5vdygpLFxuXHRcdFx0XHRcdFx0ZXhpc3RzOiB0cnVlLFxuXHRcdFx0XHRcdFx0ZmlsZW5hbWUsXG5cdFx0XHRcdFx0XHRiYXNlNjQ6IGZpbGVDb250ZW50cy50b1N0cmluZygnYmFzZTY0JyksXG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdG1ha2VBcnJheUVudHJ5cyhbXG5cdFx0XHRcdFx0XHQvL3NpdGVJRCxcblx0XHRcdFx0XHRcdC8vcmVxLnBhcmFtcy5zaXRlSUQsXG5cdFx0XHRcdFx0XHQvL2RhdGEuSURLRVksXG5cdFx0XHRcdFx0XHRJREtFWSxcblx0XHRcdFx0XHRdLCBbXG5cdFx0XHRcdFx0XHRub3ZlbF9pZCxcblx0XHRcdFx0XHRcdHJlcS5wYXJhbXMubm92ZWxJRCxcblx0XHRcdFx0XHRcdGRhdGEubm92ZWxfaWQsXG5cdFx0XHRcdFx0XHRkYXRhLm5vdmVsX2lkMixcblx0XHRcdFx0XHRcdG5vdmVsX2lkLFxuXHRcdFx0XHRcdF0pLmZvckVhY2goKFtzaXRlSUQsIG5vdmVsX2lkXSkgPT4gbm9kZUd1bkVwdWJGaWxlKHNpdGVJRCwgbm92ZWxfaWQpLnB1dChndW5EYXRhKSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsZXQgcmVhZFN0cmVhbSA9IG5ldyBQYXNzVGhyb3VnaCgpO1xuXHRcdFx0XHRyZWFkU3RyZWFtLmVuZChmaWxlQ29udGVudHMpO1xuXG5cdFx0XHRcdGxldCB7IG1pbWUsIGV4dCB9ID0gYXdhaXQgZnJvbUJ1ZmZlcihmaWxlQ29udGVudHMpO1xuXG5cdFx0XHRcdGlmIChleHQgPT09ICdlcHViJyAmJiBtaW1lID09PSAnYXBwbGljYXRpb24vemlwJylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG1pbWUgPSAnYXBwbGljYXRpb24vZXB1Yit6aXAnO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmVzLnNldCgnQ29udGVudC1kaXNwb3NpdGlvbicsICdhdHRhY2htZW50OyBmaWxlbmFtZT0nICsgZmlsZW5hbWUpO1xuXHRcdFx0XHRyZXMuc2V0KCdDb250ZW50LVR5cGUnLCBtaW1lKTtcblxuXHRcdFx0XHRjb25zb2xlLmluZm8oYOWwh+aqlOahiOWCs+mAgeiHs+WuouaItuerry4uLmApO1xuXHRcdFx0XHRyZWFkU3RyZWFtLnBpcGUocmVzKTtcblxuXHRcdFx0XHRpZiAocXVlcnkuZGVidWcpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKGDlv73nlaXliKrpmaTkuIvovInmmqvlrZggJHtkYXRhLm91dHB1dERpcn1gKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGF0YS5yZW1vdmVDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGRhdGEucmVtb3ZlQ2FsbGJhY2soKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmIChkYXRhLm91dHB1dERpcilcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJlbW92ZShkYXRhLm91dHB1dERpcilcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChlID0+XG5cdFx0XHR7XG5cblx0XHRcdFx0bGV0IHsgbWVzc2FnZSB9ID0gZTtcblx0XHRcdFx0aWYgKGUuY29kZSA9PT0gJ0VOT0VOVCcpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRtZXNzYWdlID0gYGlkIOS4jeWtmOWcqCDmiJYg5Ly65pyN5Zmo6Zui57eaYFxuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IGRhdGEgPSB7XG5cdFx0XHRcdFx0ZXJyb3I6IG1lc3NhZ2UsXG5cdFx0XHRcdFx0cGFyYW1zOiByZXEucGFyYW1zLFxuXHRcdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRyZXMuc3RhdHVzKDQwNCkuanNvbihkYXRhKTtcblxuXHRcdFx0XHRjb25zb2xlLndhcm4oZGF0YSk7XG5cblx0XHRcdFx0Y29uc29sZS5kZWJ1Zyhg5Lul5LiL6Yyv6Kqk6KiK5oGv54K66Zmk6Yyv55So77yM5Lim6Z2e5q+P5YCL6YO95pyD5bCN56iL5byP6YCg5oiQ5b2x6Z+/ID0+YCwgZSlcblxuXHRcdFx0fSlcblx0fSk7XG5cblx0cmV0dXJuIHJvdXRlclxufVxuXG5leHBvcnQgZGVmYXVsdCBmaWxlSGFuZGxlclxuIl19