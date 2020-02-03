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
function fileHandler() {
    const router = express_1.Router();
    router.use('/:siteID/:id', (req, res) => {
        console.log(req.baseUrl, req.url, req.params);
        let siteID = req.params.siteID;
        let novel_id = req.params.id;
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
                req.params.id,
                novel_id,
            ])
                .then(function (data) {
                if (data && data.exists) {
                    let { base64, filename, exists, timestamp } = data;
                    let isGun = false;
                    if (!(base64 && filename && exists && timestamp)) {
                        console.warn(`於P2P緩存發現檔案...`, `但資料似乎已損毀`);
                        return null;
                    }
                    console.log(`於P2P緩存發現檔案...`, new Date(timestamp));
                    if ((Date.now() - data.timestamp) < 86400 * 1000) {
                        isGun = true;
                    }
                    else {
                        console.log(`目標檔案已過期，試圖重新建立檔案`);
                    }
                    return {
                        base64,
                        filename,
                        exists,
                        timestamp,
                        isGun,
                    };
                }
                else {
                    console.log(`沒有發現P2P緩存...`);
                }
            });
            return gunData;
        })
            .then(async (gunData) => {
            return Promise.resolve()
                .then(async () => {
                if (gunData && gunData.isGun) {
                    return gunData;
                }
                console.log(`取得檔案中...`);
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
                    console.dir(map);
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
                    console.error(`發生錯誤，無法寫入緩存檔案 ${map_file}`);
                    console.error(e);
                });
                return _data;
            })
                .catch(e => {
                if (gunData && gunData.exists) {
                    console.warn(`檔案建立失敗，使用P2P緩存代替`);
                    gunData.isGun = true;
                    return gunData;
                }
                return Promise.reject(e);
            });
        })
            .then(async (data) => {
            console.log(`成功取得檔案...`);
            let fileContents = data.base64 && Buffer.from(data.base64, 'base64') || await fs_extra_1.readFile(data.epub);
            let filename = data.filename || IDKEY + '_' + path_1.basename(data.epub);
            if (!data.isGun || true) {
                console.debug(`將檔案儲存到P2P緩存`);
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
                    req.params.id,
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
            console.log(`將檔案傳送至客戶端...`);
            readStream.pipe(res);
            if (typeof data.removeCallback === 'function') {
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
            console.warn(data);
            console.warn(`以下錯誤訊息為除錯用，並非每個都會對程式造成影響 =>`, e);
        });
    });
    return router;
}
exports.default = fileHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQSxxQ0FBaUM7QUFDakMsd0RBQWdDO0FBQ2hDLDBEQUFtRTtBQUNuRSx3Q0FBOEM7QUFDOUMsaURBQTBDO0FBQzFDLCtCQUFzQztBQUN0Qyx1Q0FBaUU7QUFFakUsbUNBQXFDO0FBQ3JDLHlDQUF1QztBQUN2QywyREFBbUM7QUFDbkMsa0RBQXdGO0FBQ3hGLHdEQUE2RDtBQUU3RCxTQUFTLFdBQVc7SUFFbkIsTUFBTSxNQUFNLEdBQUcsZ0JBQU0sRUFBRSxDQUFDO0lBRXhCLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBRXZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU5QyxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUMvQixJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUU3QixJQUFJLE1BQU0sQ0FBQyxXQUFXLEVBQUUsS0FBSyxNQUFNLEVBQ25DO1lBQ0MsTUFBTSxHQUFHLHlCQUFpQixDQUFDLGdCQUFnQixDQUFBO1NBQzNDO1FBRUQsSUFBSSxLQUFLLEdBQUcsbUJBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVqQyxJQUFJLFFBQVEsR0FBRyxzQkFBYyxDQUFDO1FBRTlCLE9BQU8sa0JBQVE7YUFDYixPQUFPLENBQUMsS0FBSyxDQUFDO2FBQ2QsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ1osSUFBSSxDQUFDLEtBQUssRUFDVjtnQkFDQyxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsR0FBRyxNQUFNLFFBQVEsQ0FBQyxDQUFDLENBQUE7YUFDbkQ7UUFDRixDQUFDLENBQUM7YUFDRCxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFFaEIsSUFBSSxPQUFPLEdBQUcsTUFBTSwwQkFBZSxDQUFDO2dCQUduQyxLQUFLO2FBQ0osRUFBRTtnQkFDRixHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ2IsUUFBUTthQUNSLENBQUM7aUJBQ0QsSUFBSSxDQUFDLFVBQVUsSUFBSTtnQkFHbkIsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sRUFDdkI7b0JBQ0MsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQztvQkFDbkQsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDO29CQUVsQixJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksUUFBUSxJQUFJLE1BQU0sSUFBSSxTQUFTLENBQUMsRUFDaEQ7d0JBQ0MsT0FBTyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsVUFBVSxDQUFDLENBQUM7d0JBQzFDLE9BQU8sSUFBSSxDQUFBO3FCQUNYO29CQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBRWxELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLEVBQ2hEO3dCQUNDLEtBQUssR0FBRyxJQUFJLENBQUM7cUJBQ2I7eUJBRUQ7d0JBQ0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO3FCQUMvQjtvQkFFRCxPQUFPO3dCQUNOLE1BQU07d0JBQ04sUUFBUTt3QkFDUixNQUFNO3dCQUNOLFNBQVM7d0JBQ1QsS0FBSztxQkFDVyxDQUFBO2lCQUNqQjtxQkFFRDtvQkFDQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2lCQUM1QjtZQUNGLENBQUMsQ0FBQyxDQUNGO1lBRUQsT0FBTyxPQUFPLENBQUE7UUFDZixDQUFDLENBQUM7YUFDRCxJQUFJLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFO1lBRXZCLE9BQU8sT0FBTyxDQUFDLE9BQU8sRUFBRTtpQkFDdEIsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFO2dCQUdoQixJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsS0FBSyxFQUM1QjtvQkFDQyxPQUFPLE9BQU8sQ0FBQTtpQkFDZDtnQkFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUN4QixJQUFJLEVBQUUsR0FBRyx5QkFBUyxDQUFDLE1BQU0sRUFBRTtvQkFDMUIsdUJBQXVCO29CQUN2QixXQUFJLENBQUMsZ0JBQU0sRUFBRSxjQUFjLENBQUM7b0JBQzVCLE9BQU87b0JBQ1AsS0FBSztvQkFDTCxVQUFVO29CQUNWLE1BQU07b0JBQ04sWUFBWTtvQkFDWixRQUFRO2lCQUNSLEVBQUU7b0JBQ0YsS0FBSyxFQUFFLFNBQVM7aUJBQ2hCLENBQUMsQ0FBQztnQkFFSCxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQ1o7b0JBQ0MsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtpQkFDL0I7Z0JBRUQsSUFBSSxHQUFHLEdBQWMsTUFBTSxtQkFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUUvRCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUNoRDtvQkFDQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUVqQixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsV0FBVyxNQUFNLElBQUksUUFBUSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7aUJBQy9FO3FCQUNJLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sUUFBd0MsRUFDNUU7b0JBQ0MsSUFBSSxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxNQUFNLElBQUksUUFBUSwrQkFBK0IsQ0FBQyxDQUFDO29CQUczRSxDQUFDLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztvQkFFbkIsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO2lCQUN4QjtnQkFFRCxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRWpDLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDbkMsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUVsQyxNQUFNLG9CQUFTLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFFdkQsT0FBTyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsUUFBUSxFQUFFLENBQUMsQ0FBQztvQkFDM0MsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDakIsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsT0FBTyxLQUFLLENBQUE7WUFDYixDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUdWLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQzdCO29CQUNDLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztvQkFFakMsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7b0JBRXJCLE9BQU8sT0FBTyxDQUFBO2lCQUNkO2dCQUVELE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUN6QixDQUFDLENBQXlDLENBQ3pDO1FBQ0gsQ0FBQyxDQUFDO2FBQ0QsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUVwQixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBR3pCLElBQUksWUFBWSxHQUFXLElBQUksQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxJQUFJLE1BQU0sbUJBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFMUcsSUFBSSxRQUFRLEdBQVcsSUFBSSxDQUFDLFFBQVEsSUFBSSxLQUFLLEdBQUcsR0FBRyxHQUFHLGVBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFHMUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxFQUN2QjtnQkFDQyxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUU3QixJQUFJLE9BQU8sR0FBaUI7b0JBQzNCLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO29CQUNuRCxNQUFNLEVBQUUsSUFBSTtvQkFDWixRQUFRO29CQUNSLE1BQU0sRUFBRSxZQUFZLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztpQkFDdkMsQ0FBQztnQkFFRiwwQkFBZSxDQUFDO29CQUlmLEtBQUs7aUJBQ0wsRUFBRTtvQkFDRixRQUFRO29CQUNSLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtvQkFDYixJQUFJLENBQUMsUUFBUTtvQkFDYixJQUFJLENBQUMsU0FBUztvQkFDZCxRQUFRO2lCQUNSLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFLENBQUMsMEJBQWUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDbkY7WUFFRCxJQUFJLFVBQVUsR0FBRyxJQUFJLG9CQUFXLEVBQUUsQ0FBQztZQUNuQyxVQUFVLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRTdCLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsTUFBTSxzQkFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRW5ELElBQUksR0FBRyxLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssaUJBQWlCLEVBQ2hEO2dCQUNDLElBQUksR0FBRyxzQkFBc0IsQ0FBQzthQUM5QjtZQUVELEdBQUcsQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsdUJBQXVCLEdBQUcsUUFBUSxDQUFDLENBQUM7WUFDbkUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUM1QixVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRXJCLElBQUksT0FBTyxJQUFJLENBQUMsY0FBYyxLQUFLLFVBQVUsRUFDN0M7Z0JBQ0MsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2FBQ3RCO2lCQUNJLElBQUksSUFBSSxDQUFDLFNBQVMsRUFDdkI7Z0JBQ0MsaUJBQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7YUFDdEI7UUFDRixDQUFDLENBQUM7YUFDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFHVixJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxRQUFRLEVBQ3ZCO2dCQUNDLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQTthQUMxQjtZQWVELElBQUksSUFBSSxHQUFHO2dCQUNWLEtBQUssRUFBRSxPQUFPO2dCQUNkLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTTtnQkFDbEIsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7YUFDckIsQ0FBQztZQUVGLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTNCLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFbkIsT0FBTyxDQUFDLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUUvQyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxNQUFNLENBQUE7QUFDZCxDQUFDO0FBRUQsa0JBQWUsV0FBVyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8yLzEuXG4gKi9cblxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHsgRW51bU5vdmVsU2l0ZUxpc3QgfSBmcm9tICdub3ZlbC1kb3dubG9hZGVyL3NyYy9hbGwvY29uc3QnO1xuaW1wb3J0IHsgX19jYWNoZU1hcEZpbGUgfSBmcm9tICcuLi9saWIvY29uc3QnO1xuaW1wb3J0IHsgc3Bhd25TeW5jIH0gZnJvbSBcImNoaWxkX3Byb2Nlc3NcIjtcbmltcG9ydCB7IGpvaW4sIGJhc2VuYW1lIH0gZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IHJlYWRKU09OLCB3cml0ZUpTT04sIHJlYWRGaWxlLCByZW1vdmUgfSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgeyBJQ2FjaGVNYXAsIElHdW5FcHViTm9kZSwgSUd1bkVwdWJEYXRhLCBJQ2FjaGVNYXBSb3csIEVudW1DYWNoZU1hcFJvd1N0YXR1cyB9IGZyb20gJy4uL2xpYi90eXBlcyc7XG5pbXBvcnQgeyBQYXNzVGhyb3VnaCB9IGZyb20gXCJzdHJlYW1cIjtcbmltcG9ydCB7IGZyb21CdWZmZXIgfSBmcm9tICdmaWxlLXR5cGUnO1xuaW1wb3J0IF9fcm9vdCBmcm9tICcuLi9saWIvX19yb290JztcbmltcG9ydCB7IHJhY2VHdW5FcHViRmlsZSwgbWFrZUFycmF5RW50cnlzLCBub2RlR3VuRXB1YkZpbGUgfSBmcm9tICcuLi9saWIvZ3VuL2VwdWJGaWxlJztcbmltcG9ydCB7IHNpdGVJRDJJREtFWSB9IGZyb20gJ25vdmVsLWRvd25sb2FkZXIvc3JjL2FsbC91dGlsJztcblxuZnVuY3Rpb24gZmlsZUhhbmRsZXIoKVxue1xuXHRjb25zdCByb3V0ZXIgPSBSb3V0ZXIoKTtcblxuXHRyb3V0ZXIudXNlKCcvOnNpdGVJRC86aWQnLCAocmVxLCByZXMpID0+XG5cdHtcblx0XHRjb25zb2xlLmxvZyhyZXEuYmFzZVVybCwgcmVxLnVybCwgcmVxLnBhcmFtcyk7XG5cblx0XHRsZXQgc2l0ZUlEID0gcmVxLnBhcmFtcy5zaXRlSUQ7XG5cdFx0bGV0IG5vdmVsX2lkID0gcmVxLnBhcmFtcy5pZDtcblxuXHRcdGlmIChzaXRlSUQudG9Mb3dlckNhc2UoKSA9PT0gJ2RtemonKVxuXHRcdHtcblx0XHRcdHNpdGVJRCA9IEVudW1Ob3ZlbFNpdGVMaXN0Lk5vdmVsU2l0ZURtempBcGlcblx0XHR9XG5cblx0XHRsZXQgSURLRVkgPSBzaXRlSUQySURLRVkoc2l0ZUlEKTtcblxuXHRcdGxldCBtYXBfZmlsZSA9IF9fY2FjaGVNYXBGaWxlO1xuXG5cdFx0cmV0dXJuIEJsdWViaXJkXG5cdFx0XHQucmVzb2x2ZShJREtFWSlcblx0XHRcdC50YXAoSURLRVkgPT4ge1xuXHRcdFx0XHRpZiAoIUlES0VZKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihgJHtzaXRlSUR9IOaooee1hOS4jeWtmOWcqGApKVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oYXN5bmMgKCkgPT5cblx0XHRcdHtcblx0XHRcdFx0bGV0IGd1bkRhdGEgPSBhd2FpdCByYWNlR3VuRXB1YkZpbGUoW1xuXHRcdFx0XHRcdFx0Ly9yZXEucGFyYW1zLnNpdGVJRCxcblx0XHRcdFx0XHRcdC8vc2l0ZUlELFxuXHRcdFx0XHRcdElES0VZLFxuXHRcdFx0XHRcdF0sIFtcblx0XHRcdFx0XHRcdHJlcS5wYXJhbXMuaWQsXG5cdFx0XHRcdFx0XHRub3ZlbF9pZCxcblx0XHRcdFx0XHRdKVxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChkYXRhKVxuXHRcdFx0XHRcdHtcblxuXHRcdFx0XHRcdFx0aWYgKGRhdGEgJiYgZGF0YS5leGlzdHMpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGxldCB7IGJhc2U2NCwgZmlsZW5hbWUsIGV4aXN0cywgdGltZXN0YW1wIH0gPSBkYXRhO1xuXHRcdFx0XHRcdFx0XHRsZXQgaXNHdW4gPSBmYWxzZTtcblxuXHRcdFx0XHRcdFx0XHRpZiAoIShiYXNlNjQgJiYgZmlsZW5hbWUgJiYgZXhpc3RzICYmIHRpbWVzdGFtcCkpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oYOaWvFAyUOe3qeWtmOeZvOePvuaqlOahiC4uLmAsIGDkvYbos4fmlpnkvLzkuY7lt7LmkI3mr4BgKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gbnVsbFxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYOaWvFAyUOe3qeWtmOeZvOePvuaqlOahiC4uLmAsIG5ldyBEYXRlKHRpbWVzdGFtcCkpO1xuXG5cdFx0XHRcdFx0XHRcdGlmICgoRGF0ZS5ub3coKSAtIGRhdGEudGltZXN0YW1wKSA8IDg2NDAwICogMTAwMClcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGlzR3VuID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhg55uu5qiZ5qqU5qGI5bey6YGO5pyf77yM6Kmm5ZyW6YeN5paw5bu656uL5qqU5qGIYClcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRcdFx0YmFzZTY0LFxuXHRcdFx0XHRcdFx0XHRcdGZpbGVuYW1lLFxuXHRcdFx0XHRcdFx0XHRcdGV4aXN0cyxcblx0XHRcdFx0XHRcdFx0XHR0aW1lc3RhbXAsXG5cdFx0XHRcdFx0XHRcdFx0aXNHdW4sXG5cdFx0XHRcdFx0XHRcdH0gYXMgSUd1bkVwdWJEYXRhXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGDmspLmnInnmbznj75QMlDnt6nlrZguLi5gKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQ7XG5cblx0XHRcdFx0cmV0dXJuIGd1bkRhdGFcblx0XHRcdH0pXG5cdFx0XHQudGhlbihhc3luYyAoZ3VuRGF0YSkgPT5cblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG5cdFx0XHRcdFx0LnRoZW4oYXN5bmMgKCkgPT5cblx0XHRcdFx0XHR7XG5cblx0XHRcdFx0XHRcdGlmIChndW5EYXRhICYmIGd1bkRhdGEuaXNHdW4pXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBndW5EYXRhXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGDlj5blvpfmqpTmoYjkuK0uLi5gKTtcblx0XHRcdFx0XHRcdGxldCBjcCA9IHNwYXduU3luYygnbm9kZScsIFtcblx0XHRcdFx0XHRcdFx0Jy0tZXhwZXJpbWVudGFsLXdvcmtlcicsXG5cdFx0XHRcdFx0XHRcdGpvaW4oX19yb290LCBgLi9jbGkvY2xpLmpzYCksXG5cdFx0XHRcdFx0XHRcdCctLW1vZCcsXG5cdFx0XHRcdFx0XHRcdCdhbGwnLFxuXHRcdFx0XHRcdFx0XHQnLS1zaXRlSUQnLFxuXHRcdFx0XHRcdFx0XHRzaXRlSUQsXG5cdFx0XHRcdFx0XHRcdCctLW5vdmVsX2lkJyxcblx0XHRcdFx0XHRcdFx0bm92ZWxfaWQsXG5cdFx0XHRcdFx0XHRdLCB7XG5cdFx0XHRcdFx0XHRcdHN0ZGlvOiAnaW5oZXJpdCcsXG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0aWYgKGNwLmVycm9yKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoY3AuZXJyb3IpXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGxldCBtYXA6IElDYWNoZU1hcCA9IGF3YWl0IHJlYWRKU09OKG1hcF9maWxlKS5jYXRjaChlID0+IG51bGwpO1xuXG5cdFx0XHRcdFx0XHRpZiAoIW1hcCB8fCAhbWFwW0lES0VZXSB8fCAhbWFwW0lES0VZXVtub3ZlbF9pZF0pXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuZGlyKG1hcCk7XG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihg5bu656uL5qqU5qGI5pmC5aSx5pWX77yMJHtzaXRlSUR9ICR7bm92ZWxfaWR9IOWPr+iDveS4jeWtmOWcqOaIluino+aekOWkseaVly4uLmApKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAobWFwW0lES0VZXVtub3ZlbF9pZF0uc3RhdHVzID09PSBFbnVtQ2FjaGVNYXBSb3dTdGF0dXMuV0FJVElOR19SRVRSWSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0bGV0IGUgPSBuZXcgRXJyb3IoYOaKk+WPliAke3NpdGVJRH0gJHtub3ZlbF9pZH0g5L6G5rqQ5pmC5aSx5pWX77yM5Ly65pyN5Zmo5Y+v6IO95b+Z56KM5oiW5ouS57WV5Zue5oeJ77yM6KuL5LmL5b6M5YaN6YeN6KmmLi4uYCk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdFx0XHRlLlN0YXR1c0NvZGUgPSA1MDQ7XG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGUpXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGxldCBfZGF0YSA9IG1hcFtJREtFWV1bbm92ZWxfaWRdO1xuXG5cdFx0XHRcdFx0XHRkZWxldGUgbWFwW0lES0VZXVtfZGF0YS5ub3ZlbF9pZDJdO1xuXHRcdFx0XHRcdFx0ZGVsZXRlIG1hcFtJREtFWV1bX2RhdGEubm92ZWxfaWRdO1xuXG5cdFx0XHRcdFx0XHRhd2FpdCB3cml0ZUpTT04obWFwX2ZpbGUsIG1hcCwgeyBzcGFjZXM6IDIgfSkuY2F0Y2goZSA9PlxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGDnmbznlJ/pjK/oqqTvvIznhKHms5Xlr6vlhaXnt6nlrZjmqpTmoYggJHttYXBfZmlsZX1gKTtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihlKVxuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdHJldHVybiBfZGF0YVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmNhdGNoKGUgPT5cblx0XHRcdFx0XHR7XG5cblx0XHRcdFx0XHRcdGlmIChndW5EYXRhICYmIGd1bkRhdGEuZXhpc3RzKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oYOaqlOahiOW7uueri+WkseaVl++8jOS9v+eUqFAyUOe3qeWtmOS7o+abv2ApO1xuXG5cdFx0XHRcdFx0XHRcdGd1bkRhdGEuaXNHdW4gPSB0cnVlO1xuXG5cdFx0XHRcdFx0XHRcdHJldHVybiBndW5EYXRhXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlKVxuXHRcdFx0XHRcdH0pIGFzIFByb21pc2U8SUd1bkVwdWJEYXRhICYgSUNhY2hlTWFwUm93PlxuXHRcdFx0XHRcdDtcblx0XHRcdH0pXG5cdFx0XHQudGhlbihhc3luYyAoZGF0YSkgPT5cblx0XHRcdHtcblx0XHRcdFx0Y29uc29sZS5sb2coYOaIkOWKn+WPluW+l+aqlOahiC4uLmApO1xuXG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0bGV0IGZpbGVDb250ZW50czogQnVmZmVyID0gZGF0YS5iYXNlNjQgJiYgQnVmZmVyLmZyb20oZGF0YS5iYXNlNjQsICdiYXNlNjQnKSB8fCBhd2FpdCByZWFkRmlsZShkYXRhLmVwdWIpO1xuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdGxldCBmaWxlbmFtZTogc3RyaW5nID0gZGF0YS5maWxlbmFtZSB8fCBJREtFWSArICdfJyArIGJhc2VuYW1lKGRhdGEuZXB1Yik7XG5cblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRpZiAoIWRhdGEuaXNHdW4gfHwgdHJ1ZSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNvbnNvbGUuZGVidWcoYOWwh+aqlOahiOWEsuWtmOWIsFAyUOe3qeWtmGApO1xuXG5cdFx0XHRcdFx0bGV0IGd1bkRhdGE6IElHdW5FcHViTm9kZSA9IHtcblx0XHRcdFx0XHRcdHRpbWVzdGFtcDogZGF0YS5pc0d1biA/IGRhdGEudGltZXN0YW1wIDogRGF0ZS5ub3coKSxcblx0XHRcdFx0XHRcdGV4aXN0czogdHJ1ZSxcblx0XHRcdFx0XHRcdGZpbGVuYW1lLFxuXHRcdFx0XHRcdFx0YmFzZTY0OiBmaWxlQ29udGVudHMudG9TdHJpbmcoJ2Jhc2U2NCcpLFxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRtYWtlQXJyYXlFbnRyeXMoW1xuXHRcdFx0XHRcdFx0Ly9zaXRlSUQsXG5cdFx0XHRcdFx0XHQvL3JlcS5wYXJhbXMuc2l0ZUlELFxuXHRcdFx0XHRcdFx0Ly9kYXRhLklES0VZLFxuXHRcdFx0XHRcdFx0SURLRVksXG5cdFx0XHRcdFx0XSwgW1xuXHRcdFx0XHRcdFx0bm92ZWxfaWQsXG5cdFx0XHRcdFx0XHRyZXEucGFyYW1zLmlkLFxuXHRcdFx0XHRcdFx0ZGF0YS5ub3ZlbF9pZCxcblx0XHRcdFx0XHRcdGRhdGEubm92ZWxfaWQyLFxuXHRcdFx0XHRcdFx0bm92ZWxfaWQsXG5cdFx0XHRcdFx0XSkuZm9yRWFjaCgoW3NpdGVJRCwgbm92ZWxfaWRdKSA9PiBub2RlR3VuRXB1YkZpbGUoc2l0ZUlELCBub3ZlbF9pZCkucHV0KGd1bkRhdGEpKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCByZWFkU3RyZWFtID0gbmV3IFBhc3NUaHJvdWdoKCk7XG5cdFx0XHRcdHJlYWRTdHJlYW0uZW5kKGZpbGVDb250ZW50cyk7XG5cblx0XHRcdFx0bGV0IHsgbWltZSwgZXh0IH0gPSBhd2FpdCBmcm9tQnVmZmVyKGZpbGVDb250ZW50cyk7XG5cblx0XHRcdFx0aWYgKGV4dCA9PT0gJ2VwdWInICYmIG1pbWUgPT09ICdhcHBsaWNhdGlvbi96aXAnKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bWltZSA9ICdhcHBsaWNhdGlvbi9lcHViK3ppcCc7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXMuc2V0KCdDb250ZW50LWRpc3Bvc2l0aW9uJywgJ2F0dGFjaG1lbnQ7IGZpbGVuYW1lPScgKyBmaWxlbmFtZSk7XG5cdFx0XHRcdHJlcy5zZXQoJ0NvbnRlbnQtVHlwZScsIG1pbWUpO1xuXG5cdFx0XHRcdGNvbnNvbGUubG9nKGDlsIfmqpTmoYjlgrPpgIHoh7PlrqLmiLbnq68uLi5gKTtcblx0XHRcdFx0cmVhZFN0cmVhbS5waXBlKHJlcyk7XG5cblx0XHRcdFx0aWYgKHR5cGVvZiBkYXRhLnJlbW92ZUNhbGxiYWNrID09PSAnZnVuY3Rpb24nKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0ZGF0YS5yZW1vdmVDYWxsYmFjaygpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKGRhdGEub3V0cHV0RGlyKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmVtb3ZlKGRhdGEub3V0cHV0RGlyKVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGUgPT5cblx0XHRcdHtcblxuXHRcdFx0XHRsZXQgeyBtZXNzYWdlIH0gPSBlO1xuXHRcdFx0XHRpZiAoZS5jb2RlID09PSAnRU5PRU5UJylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG1lc3NhZ2UgPSBgaWQg5LiN5a2Y5ZyoIOaIliDkvLrmnI3lmajpm6Lnt5pgXG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvKlxuXHRcdFx0XHR1c2VHdW4oKVxuXHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHQuZ2V0KCdlcHViLWZpbGUnKVxuXHRcdFx0XHRcdC5nZXQocmVxLnBhcmFtcy5zaXRlSUQpXG5cdFx0XHRcdFx0LmdldChyZXEucGFyYW1zLmlkKVxuXHRcdFx0XHRcdC5wdXQoe1xuXHRcdFx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpLFxuXHRcdFx0XHRcdFx0ZXhpc3RzOiBmYWxzZSxcblx0XHRcdFx0XHR9IGFzIElHdW5FcHViTm9kZSlcblx0XHRcdFx0O1xuXHRcdFx0XHQgKi9cblxuXHRcdFx0XHRsZXQgZGF0YSA9IHtcblx0XHRcdFx0XHRlcnJvcjogbWVzc2FnZSxcblx0XHRcdFx0XHRwYXJhbXM6IHJlcS5wYXJhbXMsXG5cdFx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpLFxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHJlcy5zdGF0dXMoNDA0KS5qc29uKGRhdGEpO1xuXG5cdFx0XHRcdGNvbnNvbGUud2FybihkYXRhKTtcblxuXHRcdFx0XHRjb25zb2xlLndhcm4oYOS7peS4i+mMr+iqpOioiuaBr+eCuumZpOmMr+eUqO+8jOS4pumdnuavj+WAi+mDveacg+Wwjeeoi+W8j+mAoOaIkOW9semfvyA9PmAsIGUpXG5cblx0XHRcdH0pXG5cdH0pO1xuXG5cdHJldHVybiByb3V0ZXJcbn1cblxuZXhwb3J0IGRlZmF1bHQgZmlsZUhhbmRsZXJcbiJdfQ==