"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bluebird_1 = __importDefault(require("bluebird"));
const all_1 = require("novel-downloader/src/all");
const const_1 = require("../lib/const");
const child_process_1 = require("child_process");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const stream_1 = require("stream");
const file_type_1 = require("file-type");
const __root_1 = __importDefault(require("../lib/__root"));
const setup_1 = __importDefault(require("./gun/setup"));
const epubFile_1 = require("../lib/gun/epubFile");
function fileHandler() {
    const router = express_1.Router();
    router.use('/:siteID/:id', (req, res) => {
        console.log(req.baseUrl, req.url, req.params);
        let siteID = req.params.siteID;
        let novel_id = req.params.id;
        if (siteID.toLowerCase() === 'dmzj') {
            siteID = all_1.EnumNovelSiteList.NovelSiteDmzjApi;
        }
        let map_file = const_1.__cacheMapFile;
        return bluebird_1.default
            .resolve()
            .then(async () => {
            let gunData = await epubFile_1.raceGunEpubFile([
                req.params.siteID,
                siteID,
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
                let map = await fs_extra_1.readJSON(map_file);
                if (!map || !map[siteID] || !map[siteID][novel_id]) {
                    return Promise.reject(new Error(`建立檔案時失敗，${siteID} ${novel_id} 可能不存在或解析失敗...`));
                }
                let _data = map[siteID][novel_id];
                if (map[req.params.siteID])
                    delete map[req.params.siteID][req.params.id];
                if (map[_data.siteID])
                    delete map[_data.siteID][_data.novel_id2];
                if (map[_data.IDKEY])
                    delete map[_data.IDKEY][_data.novel_id2];
                if (map[_data.siteID])
                    delete map[_data.siteID][_data.novel_id];
                if (map[_data.IDKEY])
                    delete map[_data.IDKEY][_data.novel_id];
                if (map[siteID])
                    delete map[siteID][novel_id];
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
            let filename = data.filename || data.IDKEY + '_' + path_1.basename(data.epub);
            if (!data.isGun) {
                console.debug(`將檔案儲存到P2P緩存`);
                let gunData = {
                    timestamp: Date.now(),
                    exists: true,
                    filename,
                    base64: fileContents.toString('base64'),
                };
                epubFile_1.allGunEpubFile([
                    siteID,
                    req.params.siteID,
                    data.IDKEY,
                ], [
                    novel_id,
                    req.params.id,
                    data.novel_id,
                    data.novel_id2,
                    novel_id,
                ]).forEach(node => node.put(gunData));
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
            setup_1.default()
                .get('epub-file')
                .get(req.params.siteID)
                .get(req.params.id)
                .put({
                timestamp: Date.now(),
                exists: false,
            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQSxxQ0FBb0Q7QUFDcEQsd0RBQWdDO0FBQ2hDLGtEQUE2RDtBQUM3RCx3Q0FBOEM7QUFDOUMsaURBQTBDO0FBQzFDLCtCQUFzQztBQUN0Qyx1Q0FBaUU7QUFFakUsbUNBQXFDO0FBQ3JDLHlDQUF1QztBQUN2QywyREFBbUM7QUFDbkMsd0RBQWlDO0FBQ2pDLGtEQUFzRTtBQUV0RSxTQUFTLFdBQVc7SUFFbkIsTUFBTSxNQUFNLEdBQUcsZ0JBQU0sRUFBRSxDQUFDO0lBRXhCLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBRXZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU5QyxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUMvQixJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUU3QixJQUFJLE1BQU0sQ0FBQyxXQUFXLEVBQUUsS0FBSyxNQUFNLEVBQ25DO1lBQ0MsTUFBTSxHQUFHLHVCQUFpQixDQUFDLGdCQUFnQixDQUFBO1NBQzNDO1FBRUQsSUFBSSxRQUFRLEdBQUcsc0JBQWMsQ0FBQztRQUU5QixPQUFPLGtCQUFRO2FBQ2IsT0FBTyxFQUFFO2FBQ1QsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFO1lBRWhCLElBQUksT0FBTyxHQUFHLE1BQU0sMEJBQWUsQ0FBQztnQkFDbEMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNO2dCQUNqQixNQUFNO2FBQ04sRUFBRTtnQkFDRixHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ2IsUUFBUTthQUNSLENBQUM7aUJBQ0QsSUFBSSxDQUFDLFVBQVUsSUFBSTtnQkFHbkIsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sRUFDdkI7b0JBQ0MsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQztvQkFDbkQsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDO29CQUVsQixJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksUUFBUSxJQUFJLE1BQU0sSUFBSSxTQUFTLENBQUMsRUFDaEQ7d0JBQ0MsT0FBTyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsVUFBVSxDQUFDLENBQUM7d0JBQzFDLE9BQU8sSUFBSSxDQUFBO3FCQUNYO29CQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBRWxELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLEVBQ2hEO3dCQUNDLEtBQUssR0FBRyxJQUFJLENBQUM7cUJBQ2I7eUJBRUQ7d0JBQ0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO3FCQUMvQjtvQkFFRCxPQUFPO3dCQUNOLE1BQU07d0JBQ04sUUFBUTt3QkFDUixNQUFNO3dCQUNOLFNBQVM7d0JBQ1QsS0FBSztxQkFDVyxDQUFBO2lCQUNqQjtxQkFFRDtvQkFDQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2lCQUM1QjtZQUNGLENBQUMsQ0FBQyxDQUNGO1lBRUQsT0FBTyxPQUFPLENBQUE7UUFDZixDQUFDLENBQUM7YUFDRCxJQUFJLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFO1lBRXZCLE9BQU8sT0FBTyxDQUFDLE9BQU8sRUFBRTtpQkFDdEIsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFO2dCQUdoQixJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsS0FBSyxFQUM1QjtvQkFDQyxPQUFPLE9BQU8sQ0FBQTtpQkFDZDtnQkFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUN4QixJQUFJLEVBQUUsR0FBRyx5QkFBUyxDQUFDLE1BQU0sRUFBRTtvQkFDMUIsdUJBQXVCO29CQUN2QixXQUFJLENBQUMsZ0JBQU0sRUFBRSxjQUFjLENBQUM7b0JBQzVCLE9BQU87b0JBQ1AsS0FBSztvQkFDTCxVQUFVO29CQUNWLE1BQU07b0JBQ04sWUFBWTtvQkFDWixRQUFRO2lCQUNSLEVBQUU7b0JBQ0YsS0FBSyxFQUFFLFNBQVM7aUJBQ2hCLENBQUMsQ0FBQztnQkFFSCxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQ1o7b0JBQ0MsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtpQkFDL0I7Z0JBRUQsSUFBSSxHQUFHLEdBQWMsTUFBTSxtQkFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUU5QyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUNsRDtvQkFDQyxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsV0FBVyxNQUFNLElBQUksUUFBUSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7aUJBQy9FO2dCQUVELElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFbEMsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7b0JBQUUsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUN6RSxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO29CQUFFLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ2pFLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7b0JBQUUsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDL0QsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztvQkFBRSxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNoRSxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO29CQUFFLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzlELElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQztvQkFBRSxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFOUMsTUFBTSxvQkFBUyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBRXZELE9BQU8sQ0FBQyxLQUFLLENBQUMsaUJBQWlCLFFBQVEsRUFBRSxDQUFDLENBQUM7b0JBQzNDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBQ2pCLENBQUMsQ0FBQyxDQUFDO2dCQUVILE9BQU8sS0FBSyxDQUFBO1lBQ2IsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFHVixJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxFQUM3QjtvQkFDQyxPQUFPLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7b0JBRWpDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO29CQUVyQixPQUFPLE9BQU8sQ0FBQTtpQkFDZDtnQkFFRCxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDekIsQ0FBQyxDQUF5QyxDQUN6QztRQUNILENBQUMsQ0FBQzthQUNELElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFFcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUd6QixJQUFJLFlBQVksR0FBVyxJQUFJLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsSUFBSSxNQUFNLG1CQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTFHLElBQUksUUFBUSxHQUFXLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLEdBQUcsZUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUcvRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFDZjtnQkFDQyxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUU3QixJQUFJLE9BQU8sR0FBaUI7b0JBQzNCLFNBQVMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFO29CQUNyQixNQUFNLEVBQUUsSUFBSTtvQkFDWixRQUFRO29CQUNSLE1BQU0sRUFBRSxZQUFZLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztpQkFDdkMsQ0FBQztnQkFFRix5QkFBYyxDQUFDO29CQUNkLE1BQU07b0JBQ04sR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNO29CQUNqQixJQUFJLENBQUMsS0FBSztpQkFDVixFQUFFO29CQUNGLFFBQVE7b0JBQ1IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFO29CQUNiLElBQUksQ0FBQyxRQUFRO29CQUNiLElBQUksQ0FBQyxTQUFTO29CQUNkLFFBQVE7aUJBQ1IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzthQUN0QztZQUVELElBQUksVUFBVSxHQUFHLElBQUksb0JBQVcsRUFBRSxDQUFDO1lBQ25DLFVBQVUsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFN0IsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxNQUFNLHNCQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFbkQsSUFBSSxHQUFHLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxpQkFBaUIsRUFDaEQ7Z0JBQ0MsSUFBSSxHQUFHLHNCQUFzQixDQUFDO2FBQzlCO1lBRUQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSx1QkFBdUIsR0FBRyxRQUFRLENBQUMsQ0FBQztZQUNuRSxHQUFHLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUU5QixPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzVCLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFckIsSUFBSSxPQUFPLElBQUksQ0FBQyxjQUFjLEtBQUssVUFBVSxFQUM3QztnQkFDQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7YUFDdEI7aUJBQ0ksSUFBSSxJQUFJLENBQUMsU0FBUyxFQUN2QjtnQkFDQyxpQkFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTthQUN0QjtRQUNGLENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUdWLElBQUksRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDcEIsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFDdkI7Z0JBQ0MsT0FBTyxHQUFHLGdCQUFnQixDQUFBO2FBQzFCO1lBRUQsZUFBTSxFQUFFO2lCQUVOLEdBQUcsQ0FBQyxXQUFXLENBQUM7aUJBQ2hCLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztpQkFDdEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO2lCQUNsQixHQUFHLENBQUM7Z0JBQ0osU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQ3JCLE1BQU0sRUFBRSxLQUFLO2FBQ0csQ0FBQyxDQUNsQjtZQUVELElBQUksSUFBSSxHQUFHO2dCQUNWLEtBQUssRUFBRSxPQUFPO2dCQUNkLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTTtnQkFDbEIsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7YUFDckIsQ0FBQztZQUVGLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTNCLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFbkIsT0FBTyxDQUFDLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUUvQyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxNQUFNLENBQUE7QUFDZCxDQUFDO0FBRUQsa0JBQWUsV0FBVyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8yLzEuXG4gKi9cblxuaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2UsIFJvdXRlciB9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCB7IEVudW1Ob3ZlbFNpdGVMaXN0IH0gZnJvbSAnbm92ZWwtZG93bmxvYWRlci9zcmMvYWxsJztcbmltcG9ydCB7IF9fY2FjaGVNYXBGaWxlIH0gZnJvbSAnLi4vbGliL2NvbnN0JztcbmltcG9ydCB7IHNwYXduU3luYyB9IGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XG5pbXBvcnQgeyBqb2luLCBiYXNlbmFtZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyByZWFkSlNPTiwgd3JpdGVKU09OLCByZWFkRmlsZSwgcmVtb3ZlIH0gZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHsgSUNhY2hlTWFwLCBJR3VuRXB1Yk5vZGUsIElHdW5FcHViRGF0YSwgSUNhY2hlTWFwUm93IH0gZnJvbSAnLi4vbGliL3R5cGVzJztcbmltcG9ydCB7IFBhc3NUaHJvdWdoIH0gZnJvbSBcInN0cmVhbVwiO1xuaW1wb3J0IHsgZnJvbUJ1ZmZlciB9IGZyb20gJ2ZpbGUtdHlwZSc7XG5pbXBvcnQgX19yb290IGZyb20gJy4uL2xpYi9fX3Jvb3QnO1xuaW1wb3J0IHVzZUd1biBmcm9tICcuL2d1bi9zZXR1cCc7XG5pbXBvcnQgeyByYWNlR3VuRXB1YkZpbGUsIGFsbEd1bkVwdWJGaWxlIH0gZnJvbSAnLi4vbGliL2d1bi9lcHViRmlsZSc7XG5cbmZ1bmN0aW9uIGZpbGVIYW5kbGVyKClcbntcblx0Y29uc3Qgcm91dGVyID0gUm91dGVyKCk7XG5cblx0cm91dGVyLnVzZSgnLzpzaXRlSUQvOmlkJywgKHJlcSwgcmVzKSA9PlxuXHR7XG5cdFx0Y29uc29sZS5sb2cocmVxLmJhc2VVcmwsIHJlcS51cmwsIHJlcS5wYXJhbXMpO1xuXG5cdFx0bGV0IHNpdGVJRCA9IHJlcS5wYXJhbXMuc2l0ZUlEO1xuXHRcdGxldCBub3ZlbF9pZCA9IHJlcS5wYXJhbXMuaWQ7XG5cblx0XHRpZiAoc2l0ZUlELnRvTG93ZXJDYXNlKCkgPT09ICdkbXpqJylcblx0XHR7XG5cdFx0XHRzaXRlSUQgPSBFbnVtTm92ZWxTaXRlTGlzdC5Ob3ZlbFNpdGVEbXpqQXBpXG5cdFx0fVxuXG5cdFx0bGV0IG1hcF9maWxlID0gX19jYWNoZU1hcEZpbGU7XG5cblx0XHRyZXR1cm4gQmx1ZWJpcmRcblx0XHRcdC5yZXNvbHZlKClcblx0XHRcdC50aGVuKGFzeW5jICgpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGxldCBndW5EYXRhID0gYXdhaXQgcmFjZUd1bkVwdWJGaWxlKFtcblx0XHRcdFx0XHRcdHJlcS5wYXJhbXMuc2l0ZUlELFxuXHRcdFx0XHRcdFx0c2l0ZUlELFxuXHRcdFx0XHRcdF0sIFtcblx0XHRcdFx0XHRcdHJlcS5wYXJhbXMuaWQsXG5cdFx0XHRcdFx0XHRub3ZlbF9pZCxcblx0XHRcdFx0XHRdKVxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChkYXRhKVxuXHRcdFx0XHRcdHtcblxuXHRcdFx0XHRcdFx0aWYgKGRhdGEgJiYgZGF0YS5leGlzdHMpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGxldCB7IGJhc2U2NCwgZmlsZW5hbWUsIGV4aXN0cywgdGltZXN0YW1wIH0gPSBkYXRhO1xuXHRcdFx0XHRcdFx0XHRsZXQgaXNHdW4gPSBmYWxzZTtcblxuXHRcdFx0XHRcdFx0XHRpZiAoIShiYXNlNjQgJiYgZmlsZW5hbWUgJiYgZXhpc3RzICYmIHRpbWVzdGFtcCkpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oYOaWvFAyUOe3qeWtmOeZvOePvuaqlOahiC4uLmAsIGDkvYbos4fmlpnkvLzkuY7lt7LmkI3mr4BgKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gbnVsbFxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYOaWvFAyUOe3qeWtmOeZvOePvuaqlOahiC4uLmAsIG5ldyBEYXRlKHRpbWVzdGFtcCkpO1xuXG5cdFx0XHRcdFx0XHRcdGlmICgoRGF0ZS5ub3coKSAtIGRhdGEudGltZXN0YW1wKSA8IDg2NDAwICogMTAwMClcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGlzR3VuID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhg55uu5qiZ5qqU5qGI5bey6YGO5pyf77yM6Kmm5ZyW6YeN5paw5bu656uL5qqU5qGIYClcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRcdFx0YmFzZTY0LFxuXHRcdFx0XHRcdFx0XHRcdGZpbGVuYW1lLFxuXHRcdFx0XHRcdFx0XHRcdGV4aXN0cyxcblx0XHRcdFx0XHRcdFx0XHR0aW1lc3RhbXAsXG5cdFx0XHRcdFx0XHRcdFx0aXNHdW4sXG5cdFx0XHRcdFx0XHRcdH0gYXMgSUd1bkVwdWJEYXRhXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGDmspLmnInnmbznj75QMlDnt6nlrZguLi5gKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQ7XG5cblx0XHRcdFx0cmV0dXJuIGd1bkRhdGFcblx0XHRcdH0pXG5cdFx0XHQudGhlbihhc3luYyAoZ3VuRGF0YSkgPT5cblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG5cdFx0XHRcdFx0LnRoZW4oYXN5bmMgKCkgPT5cblx0XHRcdFx0XHR7XG5cblx0XHRcdFx0XHRcdGlmIChndW5EYXRhICYmIGd1bkRhdGEuaXNHdW4pXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBndW5EYXRhXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGDlj5blvpfmqpTmoYjkuK0uLi5gKTtcblx0XHRcdFx0XHRcdGxldCBjcCA9IHNwYXduU3luYygnbm9kZScsIFtcblx0XHRcdFx0XHRcdFx0Jy0tZXhwZXJpbWVudGFsLXdvcmtlcicsXG5cdFx0XHRcdFx0XHRcdGpvaW4oX19yb290LCBgLi9jbGkvY2xpLmpzYCksXG5cdFx0XHRcdFx0XHRcdCctLW1vZCcsXG5cdFx0XHRcdFx0XHRcdCdhbGwnLFxuXHRcdFx0XHRcdFx0XHQnLS1zaXRlSUQnLFxuXHRcdFx0XHRcdFx0XHRzaXRlSUQsXG5cdFx0XHRcdFx0XHRcdCctLW5vdmVsX2lkJyxcblx0XHRcdFx0XHRcdFx0bm92ZWxfaWQsXG5cdFx0XHRcdFx0XHRdLCB7XG5cdFx0XHRcdFx0XHRcdHN0ZGlvOiAnaW5oZXJpdCcsXG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0aWYgKGNwLmVycm9yKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoY3AuZXJyb3IpXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGxldCBtYXA6IElDYWNoZU1hcCA9IGF3YWl0IHJlYWRKU09OKG1hcF9maWxlKTtcblxuXHRcdFx0XHRcdFx0aWYgKCFtYXAgfHwgIW1hcFtzaXRlSURdIHx8ICFtYXBbc2l0ZUlEXVtub3ZlbF9pZF0pXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoYOW7uueri+aqlOahiOaZguWkseaVl++8jCR7c2l0ZUlEfSAke25vdmVsX2lkfSDlj6/og73kuI3lrZjlnKjmiJbop6PmnpDlpLHmlZcuLi5gKSlcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0bGV0IF9kYXRhID0gbWFwW3NpdGVJRF1bbm92ZWxfaWRdO1xuXG5cdFx0XHRcdFx0XHRpZiAobWFwW3JlcS5wYXJhbXMuc2l0ZUlEXSkgZGVsZXRlIG1hcFtyZXEucGFyYW1zLnNpdGVJRF1bcmVxLnBhcmFtcy5pZF07XG5cdFx0XHRcdFx0XHRpZiAobWFwW19kYXRhLnNpdGVJRF0pIGRlbGV0ZSBtYXBbX2RhdGEuc2l0ZUlEXVtfZGF0YS5ub3ZlbF9pZDJdO1xuXHRcdFx0XHRcdFx0aWYgKG1hcFtfZGF0YS5JREtFWV0pIGRlbGV0ZSBtYXBbX2RhdGEuSURLRVldW19kYXRhLm5vdmVsX2lkMl07XG5cdFx0XHRcdFx0XHRpZiAobWFwW19kYXRhLnNpdGVJRF0pIGRlbGV0ZSBtYXBbX2RhdGEuc2l0ZUlEXVtfZGF0YS5ub3ZlbF9pZF07XG5cdFx0XHRcdFx0XHRpZiAobWFwW19kYXRhLklES0VZXSkgZGVsZXRlIG1hcFtfZGF0YS5JREtFWV1bX2RhdGEubm92ZWxfaWRdO1xuXHRcdFx0XHRcdFx0aWYgKG1hcFtzaXRlSURdKSBkZWxldGUgbWFwW3NpdGVJRF1bbm92ZWxfaWRdO1xuXG5cdFx0XHRcdFx0XHRhd2FpdCB3cml0ZUpTT04obWFwX2ZpbGUsIG1hcCwgeyBzcGFjZXM6IDIgfSkuY2F0Y2goZSA9PlxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGDnmbznlJ/pjK/oqqTvvIznhKHms5Xlr6vlhaXnt6nlrZjmqpTmoYggJHttYXBfZmlsZX1gKTtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihlKVxuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdHJldHVybiBfZGF0YVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmNhdGNoKGUgPT5cblx0XHRcdFx0XHR7XG5cblx0XHRcdFx0XHRcdGlmIChndW5EYXRhICYmIGd1bkRhdGEuZXhpc3RzKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oYOaqlOahiOW7uueri+WkseaVl++8jOS9v+eUqFAyUOe3qeWtmOS7o+abv2ApO1xuXG5cdFx0XHRcdFx0XHRcdGd1bkRhdGEuaXNHdW4gPSB0cnVlO1xuXG5cdFx0XHRcdFx0XHRcdHJldHVybiBndW5EYXRhXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlKVxuXHRcdFx0XHRcdH0pIGFzIFByb21pc2U8SUd1bkVwdWJEYXRhICYgSUNhY2hlTWFwUm93PlxuXHRcdFx0XHRcdDtcblx0XHRcdH0pXG5cdFx0XHQudGhlbihhc3luYyAoZGF0YSkgPT5cblx0XHRcdHtcblx0XHRcdFx0Y29uc29sZS5sb2coYOaIkOWKn+WPluW+l+aqlOahiC4uLmApO1xuXG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0bGV0IGZpbGVDb250ZW50czogQnVmZmVyID0gZGF0YS5iYXNlNjQgJiYgQnVmZmVyLmZyb20oZGF0YS5iYXNlNjQsICdiYXNlNjQnKSB8fCBhd2FpdCByZWFkRmlsZShkYXRhLmVwdWIpO1xuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdGxldCBmaWxlbmFtZTogc3RyaW5nID0gZGF0YS5maWxlbmFtZSB8fCBkYXRhLklES0VZICsgJ18nICsgYmFzZW5hbWUoZGF0YS5lcHViKTtcblxuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdGlmICghZGF0YS5pc0d1bilcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNvbnNvbGUuZGVidWcoYOWwh+aqlOahiOWEsuWtmOWIsFAyUOe3qeWtmGApO1xuXG5cdFx0XHRcdFx0bGV0IGd1bkRhdGE6IElHdW5FcHViTm9kZSA9IHtcblx0XHRcdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcblx0XHRcdFx0XHRcdGV4aXN0czogdHJ1ZSxcblx0XHRcdFx0XHRcdGZpbGVuYW1lLFxuXHRcdFx0XHRcdFx0YmFzZTY0OiBmaWxlQ29udGVudHMudG9TdHJpbmcoJ2Jhc2U2NCcpLFxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRhbGxHdW5FcHViRmlsZShbXG5cdFx0XHRcdFx0XHRzaXRlSUQsXG5cdFx0XHRcdFx0XHRyZXEucGFyYW1zLnNpdGVJRCxcblx0XHRcdFx0XHRcdGRhdGEuSURLRVksXG5cdFx0XHRcdFx0XSwgW1xuXHRcdFx0XHRcdFx0bm92ZWxfaWQsXG5cdFx0XHRcdFx0XHRyZXEucGFyYW1zLmlkLFxuXHRcdFx0XHRcdFx0ZGF0YS5ub3ZlbF9pZCxcblx0XHRcdFx0XHRcdGRhdGEubm92ZWxfaWQyLFxuXHRcdFx0XHRcdFx0bm92ZWxfaWQsXG5cdFx0XHRcdFx0XSkuZm9yRWFjaChub2RlID0+IG5vZGUucHV0KGd1bkRhdGEpKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCByZWFkU3RyZWFtID0gbmV3IFBhc3NUaHJvdWdoKCk7XG5cdFx0XHRcdHJlYWRTdHJlYW0uZW5kKGZpbGVDb250ZW50cyk7XG5cblx0XHRcdFx0bGV0IHsgbWltZSwgZXh0IH0gPSBhd2FpdCBmcm9tQnVmZmVyKGZpbGVDb250ZW50cyk7XG5cblx0XHRcdFx0aWYgKGV4dCA9PT0gJ2VwdWInICYmIG1pbWUgPT09ICdhcHBsaWNhdGlvbi96aXAnKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bWltZSA9ICdhcHBsaWNhdGlvbi9lcHViK3ppcCc7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXMuc2V0KCdDb250ZW50LWRpc3Bvc2l0aW9uJywgJ2F0dGFjaG1lbnQ7IGZpbGVuYW1lPScgKyBmaWxlbmFtZSk7XG5cdFx0XHRcdHJlcy5zZXQoJ0NvbnRlbnQtVHlwZScsIG1pbWUpO1xuXG5cdFx0XHRcdGNvbnNvbGUubG9nKGDlsIfmqpTmoYjlgrPpgIHoh7PlrqLmiLbnq68uLi5gKTtcblx0XHRcdFx0cmVhZFN0cmVhbS5waXBlKHJlcyk7XG5cblx0XHRcdFx0aWYgKHR5cGVvZiBkYXRhLnJlbW92ZUNhbGxiYWNrID09PSAnZnVuY3Rpb24nKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0ZGF0YS5yZW1vdmVDYWxsYmFjaygpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKGRhdGEub3V0cHV0RGlyKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmVtb3ZlKGRhdGEub3V0cHV0RGlyKVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGUgPT5cblx0XHRcdHtcblxuXHRcdFx0XHRsZXQgeyBtZXNzYWdlIH0gPSBlO1xuXHRcdFx0XHRpZiAoZS5jb2RlID09PSAnRU5PRU5UJylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG1lc3NhZ2UgPSBgaWQg5LiN5a2Y5ZyoIOaIliDkvLrmnI3lmajpm6Lnt5pgXG5cdFx0XHRcdH1cblxuXHRcdFx0XHR1c2VHdW4oKVxuXHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHQuZ2V0KCdlcHViLWZpbGUnKVxuXHRcdFx0XHRcdC5nZXQocmVxLnBhcmFtcy5zaXRlSUQpXG5cdFx0XHRcdFx0LmdldChyZXEucGFyYW1zLmlkKVxuXHRcdFx0XHRcdC5wdXQoe1xuXHRcdFx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpLFxuXHRcdFx0XHRcdFx0ZXhpc3RzOiBmYWxzZSxcblx0XHRcdFx0XHR9IGFzIElHdW5FcHViTm9kZSlcblx0XHRcdFx0O1xuXG5cdFx0XHRcdGxldCBkYXRhID0ge1xuXHRcdFx0XHRcdGVycm9yOiBtZXNzYWdlLFxuXHRcdFx0XHRcdHBhcmFtczogcmVxLnBhcmFtcyxcblx0XHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KCksXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0cmVzLnN0YXR1cyg0MDQpLmpzb24oZGF0YSk7XG5cblx0XHRcdFx0Y29uc29sZS53YXJuKGRhdGEpO1xuXG5cdFx0XHRcdGNvbnNvbGUud2Fybihg5Lul5LiL6Yyv6Kqk6KiK5oGv54K66Zmk6Yyv55So77yM5Lim6Z2e5q+P5YCL6YO95pyD5bCN56iL5byP6YCg5oiQ5b2x6Z+/ID0+YCwgZSlcblxuXHRcdFx0fSlcblx0fSk7XG5cblx0cmV0dXJuIHJvdXRlclxufVxuXG5leHBvcnQgZGVmYXVsdCBmaWxlSGFuZGxlclxuIl19