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
            logger_1.default.info(`檢查是否存在緩存...`);
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
            })
                .timeout(20 * 1000)
                .catch(e => logger_1.default.error(e));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQSxxQ0FBaUM7QUFDakMsd0RBQWdDO0FBQ2hDLDBEQUFtRTtBQUNuRSx3Q0FBOEM7QUFDOUMsK0JBQXNDO0FBQ3RDLHVDQUFpRTtBQUVqRSxtQ0FBcUM7QUFDckMseUNBQXVDO0FBQ3ZDLDJEQUFtQztBQUNuQyxrREFBd0Y7QUFDeEYsd0RBQTZEO0FBQzdELGlFQUEwQztBQUMxQyxxRUFBZ0Q7QUFDaEQseURBQXdEO0FBRXhELFNBQVMsV0FBVztJQUVuQixNQUFNLE1BQU0sR0FBRyxnQkFBTSxFQUFFLENBQUM7SUFFeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUU1QyxJQUFJLEtBQUssR0FBRztZQUNYLEdBQUcsR0FBRyxDQUFDLE1BQU07WUFDYixHQUFHLEdBQUcsQ0FBQyxLQUFLO1NBQ1osQ0FBQztRQUVGLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUNwQixPQUFPLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFFaEIsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVuRSxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO2FBQzFDLElBQUksRUFBRTthQUNOLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLENBQUMsQ0FDaEM7UUFDRCxJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO2FBQzdDLElBQUksRUFBRSxDQUNQO1FBRUQsSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFLEtBQUssTUFBTSxFQUNuQztZQUNDLE1BQU0sR0FBRyx5QkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQTtTQUMzQztRQUVELElBQUksS0FBSyxHQUFHLG1CQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFakMsSUFBSSxRQUFRLEdBQUcsc0JBQWMsQ0FBQztRQUU5QixPQUFPLGtCQUFRO2FBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQzthQUNkLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNaLElBQUksQ0FBQyxLQUFLLEVBQ1Y7Z0JBQ0MsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsTUFBTSxRQUFRLENBQUMsQ0FBQyxDQUFBO2FBQ25EO1lBRUQsSUFBSSxDQUFDLFFBQVEsRUFDYjtnQkFDQyxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsa0JBQWtCLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUNoRTtRQUNGLENBQUMsQ0FBQzthQUNELElBQUksQ0FBQyxLQUFLLElBQUksRUFBRTtZQUVoQixnQkFBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUM1QixJQUFJLE9BQU8sR0FBRyxNQUFNLDBCQUFlLENBQUM7Z0JBR25DLEtBQUs7YUFDSixFQUFFO2dCQUNGLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTztnQkFDbEIsUUFBUTthQUNSLENBQUM7aUJBQ0QsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtnQkFFcEIsSUFBSSxJQUFJLEdBQVksbUJBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFdkMsSUFBSSxDQUFDLG1CQUFZLENBQUMsSUFBSSxDQUFDLEVBQ3ZCO29CQUNDLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLENBRXZELENBQUM7b0JBRUgsSUFBSSxHQUFHLEdBQUcsMEJBQWUsQ0FFckIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBRy9CLFNBQVMsR0FBRyxTQUFTLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUVwRCxJQUFJLE9BQU8sU0FBUyxLQUFLLFFBQVEsRUFDakM7d0JBRUMsUUFBUSxHQUFHLFFBQVEsSUFBSSxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7d0JBRWpELElBQUksT0FBTyxRQUFRLEtBQUssUUFBUSxFQUNoQzs0QkFFQyxNQUFNLEdBQUcsTUFBTSxJQUFJLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQzs0QkFFM0MsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQzlCO2dDQUNDLElBQUksR0FBRztvQ0FDTixNQUFNO29DQUNOLE1BQU0sRUFBRSxJQUFJO29DQUNaLFFBQVE7b0NBQ1IsU0FBUztpQ0FDVCxDQUFBOzZCQUNEO3lCQUNEO3FCQUNEO2lCQUNEO2dCQUVELElBQUksbUJBQVksQ0FBQyxJQUFJLENBQUMsRUFDdEI7b0JBQ0MsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQztvQkFDbkQsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDO29CQUVsQixnQkFBTyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFFbkQsSUFBSSxLQUFLLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQzlCO3dCQUNDLGdCQUFPLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxDQUFBO3FCQUN2Qzt5QkFDSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxFQUNyRDt3QkFDQyxLQUFLLEdBQUcsSUFBSSxDQUFDO3FCQUNiO3lCQUVEO3dCQUNDLGdCQUFPLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUE7cUJBQ2hDO29CQUVELE9BQU87d0JBQ04sTUFBTTt3QkFDTixRQUFRO3dCQUNSLE1BQU07d0JBQ04sU0FBUzt3QkFDVCxLQUFLO3FCQUNXLENBQUE7aUJBQ2pCO3FCQUNJLElBQUksSUFBSSxLQUFLLEtBQUssRUFDdkI7b0JBQ0MsZ0JBQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2lCQUMxQztxQkFFRDtvQkFDRSxnQkFBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztpQkFDOUI7Z0JBRUQsT0FBTyxJQUFJLENBQUE7WUFDWixDQUFDLENBQUM7aUJBQ0QsT0FBTyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7aUJBQ2xCLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGdCQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQzdCO1lBRUQsT0FBTyxPQUFPLENBQUE7UUFDZixDQUFDLENBQUM7YUFDRCxJQUFJLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFO1lBRXZCLE9BQU8sT0FBTyxDQUFDLE9BQU8sRUFBRTtpQkFDdEIsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFO2dCQUdoQixJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsS0FBSyxFQUM1QjtvQkFDQyxPQUFPLE9BQU8sQ0FBQTtpQkFDZDtnQkFFRCxnQkFBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDeEIsSUFBSSxFQUFFLEdBQUcsTUFBTSx5QkFBVSxDQUFDLE1BQU0sRUFBRTtvQkFDakMsdUJBQXVCO29CQUN2QixXQUFJLENBQUMsZ0JBQU0sRUFBRSxjQUFjLENBQUM7b0JBQzVCLE9BQU87b0JBQ1AsS0FBSztvQkFDTCxVQUFVO29CQUNWLE1BQU07b0JBQ04sWUFBWTtvQkFDWixRQUFRO2lCQUNSLEVBQUU7b0JBQ0YsS0FBSyxFQUFFLFNBQVM7aUJBQ2hCLENBQUMsQ0FBQztnQkFHSCxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQ1o7b0JBRUMsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtpQkFDL0I7Z0JBRUQsSUFBSSxHQUFHLEdBQWMsTUFBTSxtQkFBUSxDQUFDLFFBQVEsQ0FBQztxQkFDM0MsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQ2pCO2dCQUVELElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUM5RDtvQkFDQyxPQUFPLEdBQUcsTUFBTSwwQkFBZSxDQUFDO3dCQUcvQixLQUFLO3FCQUNMLEVBQUU7d0JBQ0YsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPO3dCQUNsQixRQUFRO3FCQUNSLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO3dCQUV0QixJQUFJLG1CQUFZLENBQUMsSUFBSSxDQUFDLEVBQ3RCOzRCQUNDLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFJLENBQUM7NEJBQ25ELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQzs0QkFFakIsT0FBTztnQ0FDTixNQUFNO2dDQUNOLFFBQVE7Z0NBQ1IsTUFBTTtnQ0FDTixTQUFTO2dDQUNULEtBQUs7NkJBQ1csQ0FBQTt5QkFDakI7b0JBQ0YsQ0FBQyxDQUFDLENBQUM7b0JBRUgsSUFBSSxPQUFPLEVBQ1g7d0JBQ0MsT0FBTyxPQUFPLENBQUE7cUJBQ2Q7aUJBQ0Q7Z0JBRUQsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFDaEQ7b0JBQ0MsZ0JBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBRWpCLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxXQUFXLE1BQU0sSUFBSSxRQUFRLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtpQkFDL0U7cUJBQ0ksSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxRQUF3QyxFQUM1RTtvQkFDQyxJQUFJLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLE1BQU0sSUFBSSxRQUFRLCtCQUErQixDQUFDLENBQUM7b0JBRzNFLENBQUMsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO29CQUVuQixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7aUJBQ3hCO2dCQUVELElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFakMsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNuQyxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRWxDLE1BQU0sb0JBQVMsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUV2RCxnQkFBTyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsUUFBUSxFQUFFLENBQUMsQ0FBQztvQkFDM0MsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBQ2pCLENBQUMsQ0FBQyxDQUFDO2dCQUVILE9BQU8sS0FBSyxDQUFBO1lBQ2IsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFHVixJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxFQUM3QjtvQkFDQyxnQkFBTyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO29CQUVqQyxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztvQkFFckIsT0FBTyxPQUFPLENBQUE7aUJBQ2Q7Z0JBRUQsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3pCLENBQUMsQ0FBeUMsQ0FDekM7UUFDSCxDQUFDLENBQUM7YUFDRCxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO1lBRXBCLGdCQUFPLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRzdCLElBQUksWUFBWSxHQUFXLElBQUksQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxJQUFJLE1BQU0sbUJBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFMUcsSUFBSSxRQUFRLEdBQVcsSUFBSSxDQUFDLFFBQVEsSUFBSSxLQUFLLEdBQUcsR0FBRyxHQUFHLGVBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFHMUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxFQUN2QjtnQkFDQyxnQkFBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFFN0IsSUFBSSxPQUFPLEdBQWlCO29CQUMzQixTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtvQkFDbkQsTUFBTSxFQUFFLElBQUk7b0JBQ1osUUFBUTtvQkFDUixNQUFNLEVBQUUsWUFBWSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7aUJBQ3ZDLENBQUM7Z0JBRUYsMEJBQWUsQ0FBQztvQkFJZixLQUFLO2lCQUNMLEVBQUU7b0JBQ0YsUUFBUTtvQkFDUixHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU87b0JBQ2xCLElBQUksQ0FBQyxRQUFRO29CQUNiLElBQUksQ0FBQyxTQUFTO29CQUNkLFFBQVE7aUJBQ1IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQywwQkFBZSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzthQUNuRjtZQUVELElBQUksVUFBVSxHQUFHLElBQUksb0JBQVcsRUFBRSxDQUFDO1lBQ25DLFVBQVUsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFN0IsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxNQUFNLHNCQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFbkQsSUFBSSxHQUFHLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxpQkFBaUIsRUFDaEQ7Z0JBQ0MsSUFBSSxHQUFHLHNCQUFzQixDQUFDO2FBQzlCO1lBRUQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSx1QkFBdUIsR0FBRyxRQUFRLENBQUMsQ0FBQztZQUNuRSxHQUFHLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUU5QixnQkFBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUM3QixVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRXJCLElBQUksS0FBSyxDQUFDLEtBQUssRUFDZjthQUVDO2lCQUNJLElBQUksT0FBTyxJQUFJLENBQUMsY0FBYyxLQUFLLFVBQVUsRUFDbEQ7Z0JBQ0MsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2FBQ3RCO2lCQUNJLElBQUksSUFBSSxDQUFDLFNBQVMsRUFDdkI7Z0JBQ0MsaUJBQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7YUFDdEI7UUFDRixDQUFDLENBQUM7YUFDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFHVixJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxRQUFRLEVBQ3ZCO2dCQUNDLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQTthQUMxQjtZQUVELElBQUksSUFBSSxHQUFHO2dCQUNWLEtBQUssRUFBRSxPQUFPO2dCQUNkLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTTtnQkFDbEIsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7YUFDckIsQ0FBQztZQUVGLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTNCLGdCQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRW5CLGdCQUFPLENBQUMsS0FBSyxDQUFDLDZCQUE2QixFQUFFLENBQUMsQ0FBQyxDQUFBO1FBRWhELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLE1BQU0sQ0FBQTtBQUNkLENBQUM7QUFFRCxrQkFBZSxXQUFXLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzIvMS5cbiAqL1xuXG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdleHByZXNzJztcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgeyBFbnVtTm92ZWxTaXRlTGlzdCB9IGZyb20gJ25vdmVsLWRvd25sb2FkZXIvc3JjL2FsbC9jb25zdCc7XG5pbXBvcnQgeyBfX2NhY2hlTWFwRmlsZSB9IGZyb20gJy4uL2xpYi9jb25zdCc7XG5pbXBvcnQgeyBqb2luLCBiYXNlbmFtZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyByZWFkSlNPTiwgd3JpdGVKU09OLCByZWFkRmlsZSwgcmVtb3ZlIH0gZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHsgSUNhY2hlTWFwLCBJR3VuRXB1Yk5vZGUsIElHdW5FcHViRGF0YSwgSUNhY2hlTWFwUm93LCBFbnVtQ2FjaGVNYXBSb3dTdGF0dXMgfSBmcm9tICcuLi9saWIvdHlwZXMnO1xuaW1wb3J0IHsgUGFzc1Rocm91Z2ggfSBmcm9tIFwic3RyZWFtXCI7XG5pbXBvcnQgeyBmcm9tQnVmZmVyIH0gZnJvbSAnZmlsZS10eXBlJztcbmltcG9ydCBfX3Jvb3QgZnJvbSAnLi4vbGliL19fcm9vdCc7XG5pbXBvcnQgeyByYWNlR3VuRXB1YkZpbGUsIG1ha2VBcnJheUVudHJ5cywgbm9kZUd1bkVwdWJGaWxlIH0gZnJvbSAnLi4vbGliL2d1bi9lcHViRmlsZSc7XG5pbXBvcnQgeyBzaXRlSUQySURLRVkgfSBmcm9tICdub3ZlbC1kb3dubG9hZGVyL3NyYy9hbGwvdXRpbCc7XG5pbXBvcnQgY29uc29sZSBmcm9tICdkZWJ1Zy1jb2xvcjIvbG9nZ2VyJztcbmltcG9ydCBjaGVja0d1bkRhdGEgZnJvbSAnLi4vbGliL2d1bi9jaGVja0RhdGEnO1xuaW1wb3J0IHsgYXN5bmMgYXMgY3Jvc3NTcGF3biB9IGZyb20gJ2Nyb3NzLXNwYXduLWV4dHJhJztcblxuZnVuY3Rpb24gZmlsZUhhbmRsZXIoKVxue1xuXHRjb25zdCByb3V0ZXIgPSBSb3V0ZXIoKTtcblxuXHRyb3V0ZXIudXNlKCcvOnNpdGVJRC86bm92ZWxJRCcsIChyZXEsIHJlcykgPT5cblx0e1xuXHRcdGxldCBxdWVyeSA9IHtcblx0XHRcdC4uLnJlcS5wYXJhbXMsXG5cdFx0XHQuLi5yZXEucXVlcnksXG5cdFx0fTtcblxuXHRcdGRlbGV0ZSBxdWVyeS5zaXRlSUQ7XG5cdFx0ZGVsZXRlIHF1ZXJ5LmlkO1xuXG5cdFx0Y29uc29sZS5kZWJ1ZyhyZXEubWV0aG9kLCByZXEuYmFzZVVybCwgcmVxLnVybCwgcmVxLnBhcmFtcywgcXVlcnkpO1xuXG5cdFx0bGV0IHNpdGVJRCA9IFN0cmluZyhyZXEucGFyYW1zLnNpdGVJRCB8fCAnJylcblx0XHRcdC50cmltKClcblx0XHRcdC5yZXBsYWNlKC9cXC54bWwkfFtcXC9cXFxcXSsvaWcsICcnKVxuXHRcdDtcblx0XHRsZXQgbm92ZWxfaWQgPSBTdHJpbmcocmVxLnBhcmFtcy5ub3ZlbElEIHx8ICcnKVxuXHRcdFx0LnRyaW0oKVxuXHRcdDtcblxuXHRcdGlmIChzaXRlSUQudG9Mb3dlckNhc2UoKSA9PT0gJ2RtemonKVxuXHRcdHtcblx0XHRcdHNpdGVJRCA9IEVudW1Ob3ZlbFNpdGVMaXN0Lk5vdmVsU2l0ZURtempBcGlcblx0XHR9XG5cblx0XHRsZXQgSURLRVkgPSBzaXRlSUQySURLRVkoc2l0ZUlEKTtcblxuXHRcdGxldCBtYXBfZmlsZSA9IF9fY2FjaGVNYXBGaWxlO1xuXG5cdFx0cmV0dXJuIEJsdWViaXJkXG5cdFx0XHQucmVzb2x2ZShJREtFWSlcblx0XHRcdC50YXAoSURLRVkgPT4ge1xuXHRcdFx0XHRpZiAoIUlES0VZKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihgJHtzaXRlSUR9IOaooee1hOS4jeWtmOWcqGApKVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCFub3ZlbF9pZClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoYOaykuacieaMh+WumumcgOimgeS4i+i8ieeahCBpZDogJyR7bm92ZWxfaWR9J2ApKTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC50aGVuKGFzeW5jICgpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGNvbnNvbGUuaW5mbyhg5qqi5p+l5piv5ZCm5a2Y5Zyo57ep5a2YLi4uYCk7XG5cdFx0XHRcdGxldCBndW5EYXRhID0gYXdhaXQgcmFjZUd1bkVwdWJGaWxlKFtcblx0XHRcdFx0XHRcdC8vcmVxLnBhcmFtcy5zaXRlSUQsXG5cdFx0XHRcdFx0XHQvL3NpdGVJRCxcblx0XHRcdFx0XHRJREtFWSxcblx0XHRcdFx0XHRdLCBbXG5cdFx0XHRcdFx0XHRyZXEucGFyYW1zLm5vdmVsSUQsXG5cdFx0XHRcdFx0XHRub3ZlbF9pZCxcblx0XHRcdFx0XHRdKVxuXHRcdFx0XHRcdC50aGVuKGFzeW5jIChkYXRhKSA9PlxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGxldCBib29sOiBib29sZWFuID0gY2hlY2tHdW5EYXRhKGRhdGEpO1xuXG5cdFx0XHRcdFx0XHRpZiAoIWNoZWNrR3VuRGF0YShkYXRhKSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0bGV0IHsgYmFzZTY0LCBmaWxlbmFtZSwgZXhpc3RzLCB0aW1lc3RhbXAgfSA9IChkYXRhIHx8IHt9KSBhcyBFeGNsdWRlPElHdW5FcHViTm9kZSwge1xuXHRcdFx0XHRcdFx0XHRcdGV4aXN0czogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdH0+O1xuXG5cdFx0XHRcdFx0XHRcdGxldCBndW4gPSBub2RlR3VuRXB1YkZpbGU8RXhjbHVkZTxJR3VuRXB1Yk5vZGUsIHtcblx0XHRcdFx0XHRcdFx0XHRleGlzdHM6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHR9Pj4oSURLRVksIHJlcS5wYXJhbXMubm92ZWxJRCk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdFx0XHR0aW1lc3RhbXAgPSB0aW1lc3RhbXAgfHwgYXdhaXQgZ3VuLmdldCgndGltZXN0YW1wJyk7XG5cblx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiB0aW1lc3RhbXAgPT09ICdudW1iZXInKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdFx0XHRcdGZpbGVuYW1lID0gZmlsZW5hbWUgfHwgYXdhaXQgZ3VuLmdldCgnZmlsZW5hbWUnKTtcblxuXHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YgZmlsZW5hbWUgPT09ICdzdHJpbmcnKVxuXHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdFx0XHRcdGJhc2U2NCA9IGJhc2U2NCB8fCBhd2FpdCBndW4uZ2V0KCdiYXNlNjQnKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBiYXNlNjQgPT09ICdzdHJpbmcnKVxuXHRcdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJhc2U2NCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRleGlzdHM6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZmlsZW5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZXN0YW1wLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmIChjaGVja0d1bkRhdGEoZGF0YSkpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGxldCB7IGJhc2U2NCwgZmlsZW5hbWUsIGV4aXN0cywgdGltZXN0YW1wIH0gPSBkYXRhO1xuXHRcdFx0XHRcdFx0XHRsZXQgaXNHdW4gPSBmYWxzZTtcblxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmluZm8oYOaWvFAyUOe3qeWtmOeZvOePvuaqlOahiC4uLmAsIG5ldyBEYXRlKHRpbWVzdGFtcCkpO1xuXG5cdFx0XHRcdFx0XHRcdGlmIChxdWVyeS5kZWJ1ZyB8fCBxdWVyeS5mb3JjZSlcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuaW5mbyhg55m854++5by35Yi25LiL6LyJ5oyH5Luk77yM5pys5qyh5bCH54Sh6KaW57ep5a2YYCwgcXVlcnkpXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAoKERhdGUubm93KCkgLSBkYXRhLnRpbWVzdGFtcCkgPCA4NjQwMCAqIDEwMDApXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRpc0d1biA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKGDnm67mqJnmqpTmoYjlt7LpgY7mnJ/vvIzoqablnJbph43mlrDlu7rnq4vmqpTmoYhgKVxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0XHRiYXNlNjQsXG5cdFx0XHRcdFx0XHRcdFx0ZmlsZW5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0ZXhpc3RzLFxuXHRcdFx0XHRcdFx0XHRcdHRpbWVzdGFtcCxcblx0XHRcdFx0XHRcdFx0XHRpc0d1bixcblx0XHRcdFx0XHRcdFx0fSBhcyBJR3VuRXB1YkRhdGFcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKGJvb2wgPT09IGZhbHNlKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oYOaWvFAyUOe3qeWtmOeZvOePvuaqlOahiC4uLmAsIGDkvYbos4fmlpnkvLzkuY7lt7LmkI3mr4BgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmluZm8oYOaykuacieeZvOePvlAyUOe3qeWtmC4uLmApO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVsbFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnRpbWVvdXQoMjAgKiAxMDAwKVxuXHRcdFx0XHRcdC5jYXRjaChlID0+IGNvbnNvbGUuZXJyb3IoZSkpXG5cdFx0XHRcdDtcblxuXHRcdFx0XHRyZXR1cm4gZ3VuRGF0YVxuXHRcdFx0fSlcblx0XHRcdC50aGVuKGFzeW5jIChndW5EYXRhKSA9PlxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcblx0XHRcdFx0XHQudGhlbihhc3luYyAoKSA9PlxuXHRcdFx0XHRcdHtcblxuXHRcdFx0XHRcdFx0aWYgKGd1bkRhdGEgJiYgZ3VuRGF0YS5pc0d1bilcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGd1bkRhdGFcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYOWPluW+l+aqlOahiOS4rS4uLmApO1xuXHRcdFx0XHRcdFx0bGV0IGNwID0gYXdhaXQgY3Jvc3NTcGF3bignbm9kZScsIFtcblx0XHRcdFx0XHRcdFx0Jy0tZXhwZXJpbWVudGFsLXdvcmtlcicsXG5cdFx0XHRcdFx0XHRcdGpvaW4oX19yb290LCBgLi9jbGkvY2xpLmpzYCksXG5cdFx0XHRcdFx0XHRcdCctLW1vZCcsXG5cdFx0XHRcdFx0XHRcdCdhbGwnLFxuXHRcdFx0XHRcdFx0XHQnLS1zaXRlSUQnLFxuXHRcdFx0XHRcdFx0XHRzaXRlSUQsXG5cdFx0XHRcdFx0XHRcdCctLW5vdmVsX2lkJyxcblx0XHRcdFx0XHRcdFx0bm92ZWxfaWQsXG5cdFx0XHRcdFx0XHRdLCB7XG5cdFx0XHRcdFx0XHRcdHN0ZGlvOiAnaW5oZXJpdCcsXG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdFx0aWYgKGNwLmVycm9yKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChjcC5lcnJvcilcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0bGV0IG1hcDogSUNhY2hlTWFwID0gYXdhaXQgcmVhZEpTT04obWFwX2ZpbGUpXG5cdFx0XHRcdFx0XHRcdC5jYXRjaChlID0+IG51bGwpXG5cdFx0XHRcdFx0XHQ7XG5cblx0XHRcdFx0XHRcdGlmICghZ3VuRGF0YSAmJiAoIW1hcCB8fCAhbWFwW0lES0VZXSB8fCAhbWFwW0lES0VZXVtub3ZlbF9pZF0pKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRndW5EYXRhID0gYXdhaXQgcmFjZUd1bkVwdWJGaWxlKFtcblx0XHRcdFx0XHRcdFx0XHQvL3JlcS5wYXJhbXMuc2l0ZUlELFxuXHRcdFx0XHRcdFx0XHRcdC8vc2l0ZUlELFxuXHRcdFx0XHRcdFx0XHRcdElES0VZLFxuXHRcdFx0XHRcdFx0XHRdLCBbXG5cdFx0XHRcdFx0XHRcdFx0cmVxLnBhcmFtcy5ub3ZlbElELFxuXHRcdFx0XHRcdFx0XHRcdG5vdmVsX2lkLFxuXHRcdFx0XHRcdFx0XHRdKS50aGVuKGFzeW5jIChkYXRhKSA9PlxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGNoZWNrR3VuRGF0YShkYXRhKSlcblx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgeyBiYXNlNjQsIGZpbGVuYW1lLCBleGlzdHMsIHRpbWVzdGFtcCB9ID0gZGF0YTtcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBpc0d1biA9IHRydWU7XG5cblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJhc2U2NCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZmlsZW5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGV4aXN0cyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZXN0YW1wLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpc0d1bixcblx0XHRcdFx0XHRcdFx0XHRcdH0gYXMgSUd1bkVwdWJEYXRhXG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHRpZiAoZ3VuRGF0YSlcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBndW5EYXRhXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKCFtYXAgfHwgIW1hcFtJREtFWV0gfHwgIW1hcFtJREtFWV1bbm92ZWxfaWRdKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmRpcihtYXApO1xuXG5cdFx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoYOW7uueri+aqlOahiOaZguWkseaVl++8jCR7c2l0ZUlEfSAke25vdmVsX2lkfSDlj6/og73kuI3lrZjlnKjmiJbop6PmnpDlpLHmlZcuLi5gKSlcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKG1hcFtJREtFWV1bbm92ZWxfaWRdLnN0YXR1cyA9PT0gRW51bUNhY2hlTWFwUm93U3RhdHVzLldBSVRJTkdfUkVUUlkpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGxldCBlID0gbmV3IEVycm9yKGDmipPlj5YgJHtzaXRlSUR9ICR7bm92ZWxfaWR9IOS+hua6kOaZguWkseaVl++8jOS8uuacjeWZqOWPr+iDveW/meeijOaIluaLkue1leWbnuaHie+8jOiri+S5i+W+jOWGjemHjeippi4uLmApO1xuXG5cdFx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdFx0ZS5TdGF0dXNDb2RlID0gNTA0O1xuXG5cdFx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlKVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRsZXQgX2RhdGEgPSBtYXBbSURLRVldW25vdmVsX2lkXTtcblxuXHRcdFx0XHRcdFx0ZGVsZXRlIG1hcFtJREtFWV1bX2RhdGEubm92ZWxfaWQyXTtcblx0XHRcdFx0XHRcdGRlbGV0ZSBtYXBbSURLRVldW19kYXRhLm5vdmVsX2lkXTtcblxuXHRcdFx0XHRcdFx0YXdhaXQgd3JpdGVKU09OKG1hcF9maWxlLCBtYXAsIHsgc3BhY2VzOiAyIH0pLmNhdGNoKGUgPT5cblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihg55m855Sf6Yyv6Kqk77yM54Sh5rOV5a+r5YWl57ep5a2Y5qqU5qGIICR7bWFwX2ZpbGV9YCk7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoZSlcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gX2RhdGFcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5jYXRjaChlID0+XG5cdFx0XHRcdFx0e1xuXG5cdFx0XHRcdFx0XHRpZiAoZ3VuRGF0YSAmJiBndW5EYXRhLmV4aXN0cylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKGDmqpTmoYjlu7rnq4vlpLHmlZfvvIzkvb/nlKhQMlDnt6nlrZjku6Pmm79gKTtcblxuXHRcdFx0XHRcdFx0XHRndW5EYXRhLmlzR3VuID0gdHJ1ZTtcblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZ3VuRGF0YVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZSlcblx0XHRcdFx0XHR9KSBhcyBQcm9taXNlPElHdW5FcHViRGF0YSAmIElDYWNoZU1hcFJvdz5cblx0XHRcdFx0XHQ7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oYXN5bmMgKGRhdGEpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGNvbnNvbGUuc3VjY2Vzcyhg5oiQ5Yqf5Y+W5b6X5qqU5qGILi4uYCk7XG5cblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRsZXQgZmlsZUNvbnRlbnRzOiBCdWZmZXIgPSBkYXRhLmJhc2U2NCAmJiBCdWZmZXIuZnJvbShkYXRhLmJhc2U2NCwgJ2Jhc2U2NCcpIHx8IGF3YWl0IHJlYWRGaWxlKGRhdGEuZXB1Yik7XG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0bGV0IGZpbGVuYW1lOiBzdHJpbmcgPSBkYXRhLmZpbGVuYW1lIHx8IElES0VZICsgJ18nICsgYmFzZW5hbWUoZGF0YS5lcHViKTtcblxuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdGlmICghZGF0YS5pc0d1biB8fCB0cnVlKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y29uc29sZS5kZWJ1Zyhg5bCH5qqU5qGI5YSy5a2Y5YiwUDJQ57ep5a2YYCk7XG5cblx0XHRcdFx0XHRsZXQgZ3VuRGF0YTogSUd1bkVwdWJOb2RlID0ge1xuXHRcdFx0XHRcdFx0dGltZXN0YW1wOiBkYXRhLmlzR3VuID8gZGF0YS50aW1lc3RhbXAgOiBEYXRlLm5vdygpLFxuXHRcdFx0XHRcdFx0ZXhpc3RzOiB0cnVlLFxuXHRcdFx0XHRcdFx0ZmlsZW5hbWUsXG5cdFx0XHRcdFx0XHRiYXNlNjQ6IGZpbGVDb250ZW50cy50b1N0cmluZygnYmFzZTY0JyksXG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdG1ha2VBcnJheUVudHJ5cyhbXG5cdFx0XHRcdFx0XHQvL3NpdGVJRCxcblx0XHRcdFx0XHRcdC8vcmVxLnBhcmFtcy5zaXRlSUQsXG5cdFx0XHRcdFx0XHQvL2RhdGEuSURLRVksXG5cdFx0XHRcdFx0XHRJREtFWSxcblx0XHRcdFx0XHRdLCBbXG5cdFx0XHRcdFx0XHRub3ZlbF9pZCxcblx0XHRcdFx0XHRcdHJlcS5wYXJhbXMubm92ZWxJRCxcblx0XHRcdFx0XHRcdGRhdGEubm92ZWxfaWQsXG5cdFx0XHRcdFx0XHRkYXRhLm5vdmVsX2lkMixcblx0XHRcdFx0XHRcdG5vdmVsX2lkLFxuXHRcdFx0XHRcdF0pLmZvckVhY2goKFtzaXRlSUQsIG5vdmVsX2lkXSkgPT4gbm9kZUd1bkVwdWJGaWxlKHNpdGVJRCwgbm92ZWxfaWQpLnB1dChndW5EYXRhKSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsZXQgcmVhZFN0cmVhbSA9IG5ldyBQYXNzVGhyb3VnaCgpO1xuXHRcdFx0XHRyZWFkU3RyZWFtLmVuZChmaWxlQ29udGVudHMpO1xuXG5cdFx0XHRcdGxldCB7IG1pbWUsIGV4dCB9ID0gYXdhaXQgZnJvbUJ1ZmZlcihmaWxlQ29udGVudHMpO1xuXG5cdFx0XHRcdGlmIChleHQgPT09ICdlcHViJyAmJiBtaW1lID09PSAnYXBwbGljYXRpb24vemlwJylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG1pbWUgPSAnYXBwbGljYXRpb24vZXB1Yit6aXAnO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmVzLnNldCgnQ29udGVudC1kaXNwb3NpdGlvbicsICdhdHRhY2htZW50OyBmaWxlbmFtZT0nICsgZmlsZW5hbWUpO1xuXHRcdFx0XHRyZXMuc2V0KCdDb250ZW50LVR5cGUnLCBtaW1lKTtcblxuXHRcdFx0XHRjb25zb2xlLmluZm8oYOWwh+aqlOahiOWCs+mAgeiHs+WuouaItuerry4uLmApO1xuXHRcdFx0XHRyZWFkU3RyZWFtLnBpcGUocmVzKTtcblxuXHRcdFx0XHRpZiAocXVlcnkuZGVidWcpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKGDlv73nlaXliKrpmaTkuIvovInmmqvlrZggJHtkYXRhLm91dHB1dERpcn1gKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGF0YS5yZW1vdmVDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGRhdGEucmVtb3ZlQ2FsbGJhY2soKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmIChkYXRhLm91dHB1dERpcilcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJlbW92ZShkYXRhLm91dHB1dERpcilcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChlID0+XG5cdFx0XHR7XG5cblx0XHRcdFx0bGV0IHsgbWVzc2FnZSB9ID0gZTtcblx0XHRcdFx0aWYgKGUuY29kZSA9PT0gJ0VOT0VOVCcpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRtZXNzYWdlID0gYGlkIOS4jeWtmOWcqCDmiJYg5Ly65pyN5Zmo6Zui57eaYFxuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IGRhdGEgPSB7XG5cdFx0XHRcdFx0ZXJyb3I6IG1lc3NhZ2UsXG5cdFx0XHRcdFx0cGFyYW1zOiByZXEucGFyYW1zLFxuXHRcdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRyZXMuc3RhdHVzKDQwNCkuanNvbihkYXRhKTtcblxuXHRcdFx0XHRjb25zb2xlLndhcm4oZGF0YSk7XG5cblx0XHRcdFx0Y29uc29sZS5kZWJ1Zyhg5Lul5LiL6Yyv6Kqk6KiK5oGv54K66Zmk6Yyv55So77yM5Lim6Z2e5q+P5YCL6YO95pyD5bCN56iL5byP6YCg5oiQ5b2x6Z+/ID0+YCwgZSlcblxuXHRcdFx0fSlcblx0fSk7XG5cblx0cmV0dXJuIHJvdXRlclxufVxuXG5leHBvcnQgZGVmYXVsdCBmaWxlSGFuZGxlclxuIl19