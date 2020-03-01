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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQSxxQ0FBaUM7QUFDakMsd0RBQWtEO0FBQ2xELDBEQUFtRTtBQUNuRSx3Q0FBOEM7QUFDOUMsK0JBQXNDO0FBQ3RDLHVDQUFpRTtBQUVqRSxtQ0FBcUM7QUFDckMseUNBQXVDO0FBQ3ZDLDJEQUFtQztBQUVuQyx3REFBNkQ7QUFDN0QsaUVBQTBDO0FBRTFDLHlEQUF3RDtBQUN4RCx3Q0FBK0U7QUFFL0UsU0FBUyxXQUFXO0lBRW5CLE1BQU0sTUFBTSxHQUFHLGdCQUFNLEVBQUUsQ0FBQztJQUV4QixNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBRTVDLElBQUksS0FBSyxHQUFHO1lBQ1gsR0FBRyxHQUFHLENBQUMsTUFBTTtZQUNiLEdBQUcsR0FBRyxDQUFDLEtBQUs7U0FDWixDQUFDO1FBRUYsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQ3BCLE9BQU8sS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUVoQixnQkFBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRW5FLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7YUFDMUMsSUFBSSxFQUFFO2FBQ04sT0FBTyxDQUFDLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUNoQztRQUNELElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7YUFDN0MsSUFBSSxFQUFFLENBQ1A7UUFFRCxJQUFJLE1BQU0sQ0FBQyxXQUFXLEVBQUUsS0FBSyxNQUFNLEVBQ25DO1lBQ0MsTUFBTSxHQUFHLHlCQUFpQixDQUFDLGdCQUFnQixDQUFBO1NBQzNDO1FBRUQsSUFBSSxLQUFLLEdBQUcsbUJBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVqQyxJQUFJLFFBQVEsR0FBRyxzQkFBYyxDQUFDO1FBRTlCLE9BQU8sa0JBQVE7YUFDYixPQUFPLENBQUMsS0FBSyxDQUFDO2FBQ2QsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBRVosSUFBSSxDQUFDLEtBQUssRUFDVjtnQkFDQyxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsR0FBRyxNQUFNLFFBQVEsQ0FBQyxDQUFDLENBQUE7YUFDbkQ7WUFFRCxJQUFJLENBQUMsUUFBUSxFQUNiO2dCQUNDLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ2hFO1FBQ0YsQ0FBQyxDQUFDO2FBQ0QsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFO1lBRWhCLGdCQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRTVCLE9BQU8sc0JBQWMsQ0FBQyxLQUFLLEVBQUU7Z0JBQzVCLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTztnQkFDbEIsUUFBUTthQUNSLEVBQUU7Z0JBQ0YsS0FBSzthQUNMLENBQUMsQ0FBQTtRQUNILENBQUMsQ0FBQzthQUNELElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUU7WUFFdkIsT0FBTyxPQUFPLENBQUMsT0FBTyxFQUFFO2lCQUN0QixJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7Z0JBR2hCLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQzVCO29CQUNDLE9BQU8sT0FBTyxDQUFBO2lCQUNkO2dCQUVELGdCQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUN4QixJQUFJLEVBQUUsR0FBRyxNQUFNLHlCQUFVLENBQUMsTUFBTSxFQUFFO29CQUNqQyx1QkFBdUI7b0JBQ3ZCLFdBQUksQ0FBQyxnQkFBTSxFQUFFLGNBQWMsQ0FBQztvQkFDNUIsT0FBTztvQkFDUCxLQUFLO29CQUNMLFVBQVU7b0JBQ1YsTUFBTTtvQkFDTixZQUFZO29CQUNaLFFBQVE7aUJBQ1IsRUFBRTtvQkFDRixLQUFLLEVBQUUsU0FBUztpQkFDaEIsQ0FBQyxDQUFDO2dCQUdILElBQUksRUFBRSxDQUFDLEtBQUssRUFDWjtvQkFFQyxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFBO2lCQUMvQjtnQkFFRCxJQUFJLEdBQUcsR0FBYyxNQUFNLG1CQUFRLENBQUMsUUFBUSxDQUFDO3FCQUMzQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FDakI7Z0JBRUQsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQzlEO29CQUNDLE9BQU8sR0FBRyxNQUFNLHVCQUFlLENBQUM7d0JBRy9CLEtBQUs7cUJBQ0wsRUFBRTt3QkFDRixHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU87d0JBQ2xCLFFBQVE7cUJBQ1IsRUFBRTt3QkFDRixLQUFLO3FCQUNMLENBQUMsQ0FBQztvQkFFSCxJQUFJLE9BQU8sRUFDWDt3QkFDQyxPQUFPLE9BQU8sQ0FBQTtxQkFDZDtpQkFDRDtnQkFFRCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUNoRDtvQkFDQyxnQkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFFakIsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLFdBQVcsTUFBTSxJQUFJLFFBQVEsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO2lCQUMvRTtxQkFDSSxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLFFBQXdDLEVBQzVFO29CQUNDLElBQUksQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sTUFBTSxJQUFJLFFBQVEsK0JBQStCLENBQUMsQ0FBQztvQkFHM0UsQ0FBQyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7b0JBRW5CLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTtpQkFDeEI7Z0JBRUQsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUVqQyxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ25DLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFbEMsTUFBTSxvQkFBUyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBRXZELGdCQUFPLENBQUMsS0FBSyxDQUFDLGlCQUFpQixRQUFRLEVBQUUsQ0FBQyxDQUFDO29CQUMzQyxnQkFBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDakIsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsT0FBTyxLQUFLLENBQUE7WUFDYixDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUdWLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQzdCO29CQUNDLGdCQUFPLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7b0JBRWpDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO29CQUVyQixPQUFPLE9BQU8sQ0FBQTtpQkFDZDtnQkFFRCxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDekIsQ0FBQyxDQUF5QyxDQUN6QztRQUNILENBQUMsQ0FBQzthQUNELElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFFcEIsZ0JBQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFN0IsSUFBSSxZQUFvQixDQUFDO1lBQ3pCLElBQUksWUFBcUIsQ0FBQztZQUUxQixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQ2Y7Z0JBQ0MsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUU3QyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQ2Q7b0JBQ0MsWUFBWSxHQUFHLEdBQUcsQ0FBQztvQkFDbkIsWUFBWSxHQUFHLElBQUksQ0FBQztpQkFDcEI7YUFDRDtZQUVELElBQUksQ0FBQyxZQUFZLEVBQ2pCO2dCQUNDLFlBQVksR0FBRyxNQUFNLG1CQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3pDO1lBR0QsSUFBSSxRQUFRLEdBQVcsSUFBSSxDQUFDLFFBQVEsSUFBSSxLQUFLLEdBQUcsR0FBRyxHQUFHLGVBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFHMUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxFQUN2QjtnQkFDQyxnQkFBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFFN0IsSUFBSSxPQUFPLEdBQWlCO29CQUMzQixTQUFTLEVBQUUsWUFBWSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7b0JBQ3ZFLE1BQU0sRUFBRSxJQUFJO29CQUNaLFFBQVE7b0JBQ1IsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7aUJBQ3BFLENBQUM7Z0JBRUYsc0JBQWMsQ0FBQztvQkFJZCxLQUFLO2lCQUNMLEVBQUU7b0JBQ0YsUUFBUTtvQkFDUixHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU87b0JBQ2xCLElBQUksQ0FBQyxRQUFRO29CQUViLElBQUksQ0FBQyxTQUFTO29CQUNkLFFBQVE7aUJBQ1IsRUFBRSxPQUFPLEVBQUUsRUFFWCxDQUFDLENBQUM7YUFDSDtZQUVELElBQUksVUFBVSxHQUFHLElBQUksb0JBQVcsRUFBRSxDQUFDO1lBQ25DLFVBQVUsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFN0IsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxNQUFNLHNCQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFbkQsSUFBSSxHQUFHLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxpQkFBaUIsRUFDaEQ7Z0JBQ0MsSUFBSSxHQUFHLHNCQUFzQixDQUFDO2FBQzlCO1lBRUQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSx1QkFBdUIsR0FBRyxRQUFRLENBQUMsQ0FBQztZQUNuRSxHQUFHLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUU5QixnQkFBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUM3QixVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRXJCLElBQUksS0FBSyxDQUFDLEtBQUssRUFDZjthQUVDO2lCQUNJLElBQUksT0FBTyxJQUFJLENBQUMsY0FBYyxLQUFLLFVBQVUsRUFDbEQ7Z0JBQ0MsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2FBQ3RCO2lCQUNJLElBQUksSUFBSSxDQUFDLFNBQVMsRUFDdkI7Z0JBQ0MsaUJBQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7YUFDdEI7UUFDRixDQUFDLENBQUM7YUFDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFHVixJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxRQUFRLEVBQ3ZCO2dCQUNDLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQTthQUMxQjtZQUVELElBQUksSUFBSSxHQUFHO2dCQUNWLEtBQUssRUFBRSxPQUFPO2dCQUNkLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTTtnQkFDbEIsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7YUFDckIsQ0FBQztZQUVGLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTNCLGdCQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRW5CLGdCQUFPLENBQUMsS0FBSyxDQUFDLDZCQUE2QixFQUFFLENBQUMsQ0FBQyxDQUFBO1FBRWhELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLE1BQU0sQ0FBQTtBQUNkLENBQUM7QUFFRCxrQkFBZSxXQUFXLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzIvMS5cbiAqL1xuXG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdleHByZXNzJztcbmltcG9ydCBCbHVlYmlyZCwgeyBUaW1lb3V0RXJyb3IgfSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgeyBFbnVtTm92ZWxTaXRlTGlzdCB9IGZyb20gJ25vdmVsLWRvd25sb2FkZXIvc3JjL2FsbC9jb25zdCc7XG5pbXBvcnQgeyBfX2NhY2hlTWFwRmlsZSB9IGZyb20gJy4uL2xpYi9jb25zdCc7XG5pbXBvcnQgeyBqb2luLCBiYXNlbmFtZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyByZWFkSlNPTiwgd3JpdGVKU09OLCByZWFkRmlsZSwgcmVtb3ZlIH0gZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHsgSUNhY2hlTWFwLCBJR3VuRXB1Yk5vZGUsIElHdW5FcHViRGF0YSwgSUNhY2hlTWFwUm93LCBFbnVtQ2FjaGVNYXBSb3dTdGF0dXMgfSBmcm9tICcuLi9saWIvdHlwZXMnO1xuaW1wb3J0IHsgUGFzc1Rocm91Z2ggfSBmcm9tIFwic3RyZWFtXCI7XG5pbXBvcnQgeyBmcm9tQnVmZmVyIH0gZnJvbSAnZmlsZS10eXBlJztcbmltcG9ydCBfX3Jvb3QgZnJvbSAnLi4vbGliL19fcm9vdCc7XG5pbXBvcnQgeyByYWNlR3VuRXB1YkZpbGUsIG1ha2VBcnJheUVudHJ5cywgbm9kZUd1bkVwdWJGaWxlIH0gZnJvbSAnLi4vbGliL2d1bi9lcHViRmlsZSc7XG5pbXBvcnQgeyBzaXRlSUQySURLRVkgfSBmcm9tICdub3ZlbC1kb3dubG9hZGVyL3NyYy9hbGwvdXRpbCc7XG5pbXBvcnQgY29uc29sZSBmcm9tICdkZWJ1Zy1jb2xvcjIvbG9nZ2VyJztcbmltcG9ydCBjaGVja0d1bkRhdGEgZnJvbSAnLi4vbGliL2d1bi9jaGVja0RhdGEnO1xuaW1wb3J0IHsgYXN5bmMgYXMgY3Jvc3NTcGF3biB9IGZyb20gJ2Nyb3NzLXNwYXduLWV4dHJhJztcbmltcG9ydCB7IGdldEd1bkVwdWJGaWxlLCBnZXRHdW5FcHViRmlsZTIsIHB1dEd1bkVwdWJGaWxlIH0gZnJvbSAnLi4vbGliL3N0b3JlJztcblxuZnVuY3Rpb24gZmlsZUhhbmRsZXIoKVxue1xuXHRjb25zdCByb3V0ZXIgPSBSb3V0ZXIoKTtcblxuXHRyb3V0ZXIudXNlKCcvOnNpdGVJRC86bm92ZWxJRCcsIChyZXEsIHJlcykgPT5cblx0e1xuXHRcdGxldCBxdWVyeSA9IHtcblx0XHRcdC4uLnJlcS5wYXJhbXMsXG5cdFx0XHQuLi5yZXEucXVlcnksXG5cdFx0fTtcblxuXHRcdGRlbGV0ZSBxdWVyeS5zaXRlSUQ7XG5cdFx0ZGVsZXRlIHF1ZXJ5LmlkO1xuXG5cdFx0Y29uc29sZS5kZWJ1ZyhyZXEubWV0aG9kLCByZXEuYmFzZVVybCwgcmVxLnVybCwgcmVxLnBhcmFtcywgcXVlcnkpO1xuXG5cdFx0bGV0IHNpdGVJRCA9IFN0cmluZyhyZXEucGFyYW1zLnNpdGVJRCB8fCAnJylcblx0XHRcdC50cmltKClcblx0XHRcdC5yZXBsYWNlKC9cXC54bWwkfFtcXC9cXFxcXSsvaWcsICcnKVxuXHRcdDtcblx0XHRsZXQgbm92ZWxfaWQgPSBTdHJpbmcocmVxLnBhcmFtcy5ub3ZlbElEIHx8ICcnKVxuXHRcdFx0LnRyaW0oKVxuXHRcdDtcblxuXHRcdGlmIChzaXRlSUQudG9Mb3dlckNhc2UoKSA9PT0gJ2RtemonKVxuXHRcdHtcblx0XHRcdHNpdGVJRCA9IEVudW1Ob3ZlbFNpdGVMaXN0Lk5vdmVsU2l0ZURtempBcGlcblx0XHR9XG5cblx0XHRsZXQgSURLRVkgPSBzaXRlSUQySURLRVkoc2l0ZUlEKTtcblxuXHRcdGxldCBtYXBfZmlsZSA9IF9fY2FjaGVNYXBGaWxlO1xuXG5cdFx0cmV0dXJuIEJsdWViaXJkXG5cdFx0XHQucmVzb2x2ZShJREtFWSlcblx0XHRcdC50YXAoSURLRVkgPT5cblx0XHRcdHtcblx0XHRcdFx0aWYgKCFJREtFWSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoYCR7c2l0ZUlEfSDmqKHntYTkuI3lrZjlnKhgKSlcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICghbm92ZWxfaWQpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKGDmspLmnInmjIflrprpnIDopoHkuIvovInnmoQgaWQ6ICcke25vdmVsX2lkfSdgKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQudGhlbihhc3luYyAoKSA9PlxuXHRcdFx0e1xuXHRcdFx0XHRjb25zb2xlLmluZm8oYOaqouafpeaYr+WQpuWtmOWcqOe3qeWtmC4uLmApO1xuXG5cdFx0XHRcdHJldHVybiBnZXRHdW5FcHViRmlsZShJREtFWSwgW1xuXHRcdFx0XHRcdHJlcS5wYXJhbXMubm92ZWxJRCxcblx0XHRcdFx0XHRub3ZlbF9pZCxcblx0XHRcdFx0XSwge1xuXHRcdFx0XHRcdHF1ZXJ5LFxuXHRcdFx0XHR9KVxuXHRcdFx0fSlcblx0XHRcdC50aGVuKGFzeW5jIChndW5EYXRhKSA9PlxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcblx0XHRcdFx0XHQudGhlbihhc3luYyAoKSA9PlxuXHRcdFx0XHRcdHtcblxuXHRcdFx0XHRcdFx0aWYgKGd1bkRhdGEgJiYgZ3VuRGF0YS5pc0d1bilcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGd1bkRhdGFcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYOWPluW+l+aqlOahiOS4rS4uLmApO1xuXHRcdFx0XHRcdFx0bGV0IGNwID0gYXdhaXQgY3Jvc3NTcGF3bignbm9kZScsIFtcblx0XHRcdFx0XHRcdFx0Jy0tZXhwZXJpbWVudGFsLXdvcmtlcicsXG5cdFx0XHRcdFx0XHRcdGpvaW4oX19yb290LCBgLi9jbGkvY2xpLmpzYCksXG5cdFx0XHRcdFx0XHRcdCctLW1vZCcsXG5cdFx0XHRcdFx0XHRcdCdhbGwnLFxuXHRcdFx0XHRcdFx0XHQnLS1zaXRlSUQnLFxuXHRcdFx0XHRcdFx0XHRzaXRlSUQsXG5cdFx0XHRcdFx0XHRcdCctLW5vdmVsX2lkJyxcblx0XHRcdFx0XHRcdFx0bm92ZWxfaWQsXG5cdFx0XHRcdFx0XHRdLCB7XG5cdFx0XHRcdFx0XHRcdHN0ZGlvOiAnaW5oZXJpdCcsXG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdFx0aWYgKGNwLmVycm9yKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChjcC5lcnJvcilcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0bGV0IG1hcDogSUNhY2hlTWFwID0gYXdhaXQgcmVhZEpTT04obWFwX2ZpbGUpXG5cdFx0XHRcdFx0XHRcdC5jYXRjaChlID0+IG51bGwpXG5cdFx0XHRcdFx0XHQ7XG5cblx0XHRcdFx0XHRcdGlmICghZ3VuRGF0YSAmJiAoIW1hcCB8fCAhbWFwW0lES0VZXSB8fCAhbWFwW0lES0VZXVtub3ZlbF9pZF0pKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRndW5EYXRhID0gYXdhaXQgZ2V0R3VuRXB1YkZpbGUyKFtcblx0XHRcdFx0XHRcdFx0XHQvL3JlcS5wYXJhbXMuc2l0ZUlELFxuXHRcdFx0XHRcdFx0XHRcdC8vc2l0ZUlELFxuXHRcdFx0XHRcdFx0XHRcdElES0VZLFxuXHRcdFx0XHRcdFx0XHRdLCBbXG5cdFx0XHRcdFx0XHRcdFx0cmVxLnBhcmFtcy5ub3ZlbElELFxuXHRcdFx0XHRcdFx0XHRcdG5vdmVsX2lkLFxuXHRcdFx0XHRcdFx0XHRdLCB7XG5cdFx0XHRcdFx0XHRcdFx0cXVlcnksXG5cdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdGlmIChndW5EYXRhKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGd1bkRhdGFcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAoIW1hcCB8fCAhbWFwW0lES0VZXSB8fCAhbWFwW0lES0VZXVtub3ZlbF9pZF0pXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuZGlyKG1hcCk7XG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihg5bu656uL5qqU5qGI5pmC5aSx5pWX77yMJHtzaXRlSUR9ICR7bm92ZWxfaWR9IOWPr+iDveS4jeWtmOWcqOaIluino+aekOWkseaVly4uLmApKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAobWFwW0lES0VZXVtub3ZlbF9pZF0uc3RhdHVzID09PSBFbnVtQ2FjaGVNYXBSb3dTdGF0dXMuV0FJVElOR19SRVRSWSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0bGV0IGUgPSBuZXcgRXJyb3IoYOaKk+WPliAke3NpdGVJRH0gJHtub3ZlbF9pZH0g5L6G5rqQ5pmC5aSx5pWX77yM5Ly65pyN5Zmo5Y+v6IO95b+Z56KM5oiW5ouS57WV5Zue5oeJ77yM6KuL5LmL5b6M5YaN6YeN6KmmLi4uYCk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdFx0XHRlLlN0YXR1c0NvZGUgPSA1MDQ7XG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGUpXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGxldCBfZGF0YSA9IG1hcFtJREtFWV1bbm92ZWxfaWRdO1xuXG5cdFx0XHRcdFx0XHRkZWxldGUgbWFwW0lES0VZXVtfZGF0YS5ub3ZlbF9pZDJdO1xuXHRcdFx0XHRcdFx0ZGVsZXRlIG1hcFtJREtFWV1bX2RhdGEubm92ZWxfaWRdO1xuXG5cdFx0XHRcdFx0XHRhd2FpdCB3cml0ZUpTT04obWFwX2ZpbGUsIG1hcCwgeyBzcGFjZXM6IDIgfSkuY2F0Y2goZSA9PlxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGDnmbznlJ/pjK/oqqTvvIznhKHms5Xlr6vlhaXnt6nlrZjmqpTmoYggJHttYXBfZmlsZX1gKTtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihlKVxuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdHJldHVybiBfZGF0YVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmNhdGNoKGUgPT5cblx0XHRcdFx0XHR7XG5cblx0XHRcdFx0XHRcdGlmIChndW5EYXRhICYmIGd1bkRhdGEuZXhpc3RzKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oYOaqlOahiOW7uueri+WkseaVl++8jOS9v+eUqFAyUOe3qeWtmOS7o+abv2ApO1xuXG5cdFx0XHRcdFx0XHRcdGd1bkRhdGEuaXNHdW4gPSB0cnVlO1xuXG5cdFx0XHRcdFx0XHRcdHJldHVybiBndW5EYXRhXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlKVxuXHRcdFx0XHRcdH0pIGFzIFByb21pc2U8SUd1bkVwdWJEYXRhICYgSUNhY2hlTWFwUm93PlxuXHRcdFx0XHRcdDtcblx0XHRcdH0pXG5cdFx0XHQudGhlbihhc3luYyAoZGF0YSkgPT5cblx0XHRcdHtcblx0XHRcdFx0Y29uc29sZS5zdWNjZXNzKGDmiJDlip/lj5blvpfmqpTmoYguLi5gKTtcblxuXHRcdFx0XHRsZXQgZmlsZUNvbnRlbnRzOiBCdWZmZXI7XG5cdFx0XHRcdGxldCBpc0Zyb21CdWZmZXI6IGJvb2xlYW47XG5cblx0XHRcdFx0aWYgKGRhdGEuYmFzZTY0KVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bGV0IGJ1ZiA9IEJ1ZmZlci5mcm9tKGRhdGEuYmFzZTY0LCAnYmFzZTY0Jyk7XG5cblx0XHRcdFx0XHRpZiAoYnVmLmxlbmd0aClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRmaWxlQ29udGVudHMgPSBidWY7XG5cdFx0XHRcdFx0XHRpc0Zyb21CdWZmZXIgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICghZmlsZUNvbnRlbnRzKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0ZmlsZUNvbnRlbnRzID0gYXdhaXQgcmVhZEZpbGUoZGF0YS5lcHViKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0bGV0IGZpbGVuYW1lOiBzdHJpbmcgPSBkYXRhLmZpbGVuYW1lIHx8IElES0VZICsgJ18nICsgYmFzZW5hbWUoZGF0YS5lcHViKTtcblxuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdGlmICghZGF0YS5pc0d1biB8fCB0cnVlKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y29uc29sZS5kZWJ1Zyhg5bCH5qqU5qGI5YSy5a2Y5YiwUDJQ57ep5a2YYCk7XG5cblx0XHRcdFx0XHRsZXQgZ3VuRGF0YTogSUd1bkVwdWJOb2RlID0ge1xuXHRcdFx0XHRcdFx0dGltZXN0YW1wOiBpc0Zyb21CdWZmZXIgJiYgZGF0YS50aW1lc3RhbXAgPyBkYXRhLnRpbWVzdGFtcCA6IERhdGUubm93KCksXG5cdFx0XHRcdFx0XHRleGlzdHM6IHRydWUsXG5cdFx0XHRcdFx0XHRmaWxlbmFtZSxcblx0XHRcdFx0XHRcdGJhc2U2NDogaXNGcm9tQnVmZmVyID8gZGF0YS5iYXNlNjQgOiBmaWxlQ29udGVudHMudG9TdHJpbmcoJ2Jhc2U2NCcpLFxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRwdXRHdW5FcHViRmlsZShbXG5cdFx0XHRcdFx0XHQvL3NpdGVJRCxcblx0XHRcdFx0XHRcdC8vcmVxLnBhcmFtcy5zaXRlSUQsXG5cdFx0XHRcdFx0XHQvL2RhdGEuSURLRVksXG5cdFx0XHRcdFx0XHRJREtFWSxcblx0XHRcdFx0XHRdLCBbXG5cdFx0XHRcdFx0XHRub3ZlbF9pZCxcblx0XHRcdFx0XHRcdHJlcS5wYXJhbXMubm92ZWxJRCxcblx0XHRcdFx0XHRcdGRhdGEubm92ZWxfaWQsXG5cdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0XHRkYXRhLm5vdmVsX2lkMixcblx0XHRcdFx0XHRcdG5vdmVsX2lkLFxuXHRcdFx0XHRcdF0sIGd1bkRhdGEsIHtcblxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IHJlYWRTdHJlYW0gPSBuZXcgUGFzc1Rocm91Z2goKTtcblx0XHRcdFx0cmVhZFN0cmVhbS5lbmQoZmlsZUNvbnRlbnRzKTtcblxuXHRcdFx0XHRsZXQgeyBtaW1lLCBleHQgfSA9IGF3YWl0IGZyb21CdWZmZXIoZmlsZUNvbnRlbnRzKTtcblxuXHRcdFx0XHRpZiAoZXh0ID09PSAnZXB1YicgJiYgbWltZSA9PT0gJ2FwcGxpY2F0aW9uL3ppcCcpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRtaW1lID0gJ2FwcGxpY2F0aW9uL2VwdWIremlwJztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJlcy5zZXQoJ0NvbnRlbnQtZGlzcG9zaXRpb24nLCAnYXR0YWNobWVudDsgZmlsZW5hbWU9JyArIGZpbGVuYW1lKTtcblx0XHRcdFx0cmVzLnNldCgnQ29udGVudC1UeXBlJywgbWltZSk7XG5cblx0XHRcdFx0Y29uc29sZS5pbmZvKGDlsIfmqpTmoYjlgrPpgIHoh7PlrqLmiLbnq68uLi5gKTtcblx0XHRcdFx0cmVhZFN0cmVhbS5waXBlKHJlcyk7XG5cblx0XHRcdFx0aWYgKHF1ZXJ5LmRlYnVnKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhg5b+955Wl5Yiq6Zmk5LiL6LyJ5pqr5a2YICR7ZGF0YS5vdXRwdXREaXJ9YCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRhdGEucmVtb3ZlQ2FsbGJhY2sgPT09ICdmdW5jdGlvbicpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRkYXRhLnJlbW92ZUNhbGxiYWNrKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoZGF0YS5vdXRwdXREaXIpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZW1vdmUoZGF0YS5vdXRwdXREaXIpXG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goZSA9PlxuXHRcdFx0e1xuXG5cdFx0XHRcdGxldCB7IG1lc3NhZ2UgfSA9IGU7XG5cdFx0XHRcdGlmIChlLmNvZGUgPT09ICdFTk9FTlQnKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bWVzc2FnZSA9IGBpZCDkuI3lrZjlnKgg5oiWIOS8uuacjeWZqOmboue3mmBcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCBkYXRhID0ge1xuXHRcdFx0XHRcdGVycm9yOiBtZXNzYWdlLFxuXHRcdFx0XHRcdHBhcmFtczogcmVxLnBhcmFtcyxcblx0XHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KCksXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0cmVzLnN0YXR1cyg0MDQpLmpzb24oZGF0YSk7XG5cblx0XHRcdFx0Y29uc29sZS53YXJuKGRhdGEpO1xuXG5cdFx0XHRcdGNvbnNvbGUuZGVidWcoYOS7peS4i+mMr+iqpOioiuaBr+eCuumZpOmMr+eUqO+8jOS4pumdnuavj+WAi+mDveacg+Wwjeeoi+W8j+mAoOaIkOW9semfvyA9PmAsIGUpXG5cblx0XHRcdH0pXG5cdH0pO1xuXG5cdHJldHVybiByb3V0ZXJcbn1cblxuZXhwb3J0IGRlZmF1bHQgZmlsZUhhbmRsZXJcbiJdfQ==