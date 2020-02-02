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
                let map = await fs_extra_1.readJSON(map_file).catch(e => null);
                if (!map || !map[siteID] || !map[siteID][novel_id]) {
                    console.dir(map);
                    return Promise.reject(new Error(`建立檔案時失敗，${siteID} ${novel_id} 可能不存在或解析失敗...`));
                }
                else if (map[siteID][novel_id].status === 504) {
                    let e = new Error(`抓取 ${siteID} ${novel_id} 來源時失敗，伺服器可能忙碌或拒絕回應，請之後再重試...`);
                    e.StatusCode = 504;
                    return Promise.reject(e);
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
            if (!data.isGun || true) {
                console.debug(`將檔案儲存到P2P緩存`);
                let gunData = {
                    timestamp: data.isGun ? data.timestamp : Date.now(),
                    exists: true,
                    filename,
                    base64: fileContents.toString('base64'),
                };
                epubFile_1.makeArrayEntrys([
                    siteID,
                    req.params.siteID,
                    data.IDKEY,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQSxxQ0FBaUM7QUFDakMsd0RBQWdDO0FBQ2hDLGtEQUE2RDtBQUM3RCx3Q0FBOEM7QUFDOUMsaURBQTBDO0FBQzFDLCtCQUFzQztBQUN0Qyx1Q0FBaUU7QUFFakUsbUNBQXFDO0FBQ3JDLHlDQUF1QztBQUN2QywyREFBbUM7QUFDbkMsa0RBQXdGO0FBRXhGLFNBQVMsV0FBVztJQUVuQixNQUFNLE1BQU0sR0FBRyxnQkFBTSxFQUFFLENBQUM7SUFFeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFFdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTlDLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQy9CLElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBRTdCLElBQUksTUFBTSxDQUFDLFdBQVcsRUFBRSxLQUFLLE1BQU0sRUFDbkM7WUFDQyxNQUFNLEdBQUcsdUJBQWlCLENBQUMsZ0JBQWdCLENBQUE7U0FDM0M7UUFFRCxJQUFJLFFBQVEsR0FBRyxzQkFBYyxDQUFDO1FBRTlCLE9BQU8sa0JBQVE7YUFDYixPQUFPLEVBQUU7YUFDVCxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFFaEIsSUFBSSxPQUFPLEdBQUcsTUFBTSwwQkFBZSxDQUFDO2dCQUNsQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU07Z0JBQ2pCLE1BQU07YUFDTixFQUFFO2dCQUNGLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDYixRQUFRO2FBQ1IsQ0FBQztpQkFDRCxJQUFJLENBQUMsVUFBVSxJ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QUFDLGNBQWMsS0FBSyxVQUFVLEVBQzdDO2dCQUNDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQzthQUN0QjtpQkFDSSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQ3ZCO2dCQUNDLGlCQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO2FBQ3RCO1FBQ0YsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBR1YsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNwQixJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUN2QjtnQkFDQyxPQUFPLEdBQUcsZ0JBQWdCLENBQUE7YUFDMUI7WUFlRCxJQUFJLElBQUksR0FBRztnQkFDVixLQUFLLEVBQUUsT0FBTztnQkFDZCxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU07Z0JBQ2xCLFNBQVMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFO2FBQ3JCLENBQUM7WUFFRixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUUzQixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRW5CLE9BQU8sQ0FBQyxJQUFJLENBQUMsNkJBQTZCLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFFL0MsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sTUFBTSxDQUFBO0FBQ2QsQ0FBQztBQUVELGtCQUFlLFdBQVcsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMjAvMi8xLlxuICovXG5cbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCB7IEVudW1Ob3ZlbFNpdGVMaXN0IH0gZnJvbSAnbm92ZWwtZG93bmxvYWRlci9zcmMvYWxsJztcbmltcG9ydCB7IF9fY2FjaGVNYXBGaWxlIH0gZnJvbSAnLi4vbGliL2NvbnN0JztcbmltcG9ydCB7IHNwYXduU3luYyB9IGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XG5pbXBvcnQgeyBqb2luLCBiYXNlbmFtZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyByZWFkSlNPTiwgd3JpdGVKU09OLCByZWFkRmlsZSwgcmVtb3ZlIH0gZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHsgSUNhY2hlTWFwLCBJR3VuRXB1Yk5vZGUsIElHdW5FcHViRGF0YSwgSUNhY2hlTWFwUm93LCBFbnVtQ2FjaGVNYXBSb3dTdGF0dXMgfSBmcm9tICcuLi9saWIvdHlwZXMnO1xuaW1wb3J0IHsgUGFzc1Rocm91Z2ggfSBmcm9tIFwic3RyZWFtXCI7XG5pbXBvcnQgeyBmcm9tQnVmZmVyIH0gZnJvbSAnZmlsZS10eXBlJztcbmltcG9ydCBfX3Jvb3QgZnJvbSAnLi4vbGliL19fcm9vdCc7XG5pbXBvcnQgeyByYWNlR3VuRXB1YkZpbGUsIG1ha2VBcnJheUVudHJ5cywgbm9kZUd1bkVwdWJGaWxlIH0gZnJvbSAnLi4vbGliL2d1bi9lcHViRmlsZSc7XG5cbmZ1bmN0aW9uIGZpbGVIYW5kbGVyKClcbntcblx0Y29uc3Qgcm91dGVyID0gUm91dGVyKCk7XG5cblx0cm91dGVyLnVzZSgnLzpzaXRlSUQvOmlkJywgKHJlcSwgcmVzKSA9PlxuXHR7XG5cdFx0Y29uc29sZS5sb2cocmVxLmJhc2VVcmwsIHJlcS51cmwsIHJlcS5wYXJhbXMpO1xuXG5cdFx0bGV0IHNpdGVJRCA9IHJlcS5wYXJhbXMuc2l0ZUlEO1xuXHRcdGxldCBub3ZlbF9pZCA9IHJlcS5wYXJhbXMuaWQ7XG5cblx0XHRpZiAoc2l0ZUlELnRvTG93ZXJDYXNlKCkgPT09ICdkbXpqJylcblx0XHR7XG5cdFx0XHRzaXRlSUQgPSBFbnVtTm92ZWxTaXRlTGlzdC5Ob3ZlbFNpdGVEbXpqQXBpXG5cdFx0fVxuXG5cdFx0bGV0IG1hcF9maWxlID0gX19jYWNoZU1hcEZpbGU7XG5cblx0XHRyZXR1cm4gQmx1ZWJpcmRcblx0XHRcdC5yZXNvbHZlKClcblx0XHRcdC50aGVuKGFzeW5jICgpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGxldCBndW5EYXRhID0gYXdhaXQgcmFjZUd1bkVwdWJGaWxlKFtcblx0XHRcdFx0XHRcdHJlcS5wYXJhbXMuc2l0ZUlELFxuXHRcdFx0XHRcdFx0c2l0ZUlELFxuXHRcdFx0XHRcdF0sIFtcblx0XHRcdFx0XHRcdHJlcS5wYXJhbXMuaWQsXG5cdFx0XHRcdFx0XHRub3ZlbF9pZCxcblx0XHRcdFx0XHRdKVxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChkYXRhKVxuXHRcdFx0XHRcdHtcblxuXHRcdFx0XHRcdFx0aWYgKGRhdGEgJiYgZGF0YS5leGlzdHMpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGxldCB7IGJhc2U2NCwgZmlsZW5hbWUsIGV4aXN0cywgdGltZXN0YW1wIH0gPSBkYXRhO1xuXHRcdFx0XHRcdFx0XHRsZXQgaXNHdW4gPSBmYWxzZTtcblxuXHRcdFx0XHRcdFx0XHRpZiAoIShiYXNlNjQgJiYgZmlsZW5hbWUgJiYgZXhpc3RzICYmIHRpbWVzdGFtcCkpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oYOaWvFAyUOe3qeWtmOeZvOePvuaqlOahiC4uLmAsIGDkvYbos4fmlpnkvLzkuY7lt7LmkI3mr4BgKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gbnVsbFxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYOaWvFAyUOe3qeWtmOeZvOePvuaqlOahiC4uLmAsIG5ldyBEYXRlKHRpbWVzdGFtcCkpO1xuXG5cdFx0XHRcdFx0XHRcdGlmICgoRGF0ZS5ub3coKSAtIGRhdGEudGltZXN0YW1wKSA8IDg2NDAwICogMTAwMClcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGlzR3VuID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhg55uu5qiZ5qqU5qGI5bey6YGO5pyf77yM6Kmm5ZyW6YeN5paw5bu656uL5qqU5qGIYClcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRcdFx0YmFzZTY0LFxuXHRcdFx0XHRcdFx0XHRcdGZpbGVuYW1lLFxuXHRcdFx0XHRcdFx0XHRcdGV4aXN0cyxcblx0XHRcdFx0XHRcdFx0XHR0aW1lc3RhbXAsXG5cdFx0XHRcdFx0XHRcdFx0aXNHdW4sXG5cdFx0XHRcdFx0XHRcdH0gYXMgSUd1bkVwdWJEYXRhXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGDmspLmnInnmbznj75QMlDnt6nlrZguLi5gKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQ7XG5cblx0XHRcdFx0cmV0dXJuIGd1bkRhdGFcblx0XHRcdH0pXG5cdFx0XHQudGhlbihhc3luYyAoZ3VuRGF0YSkgPT5cblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG5cdFx0XHRcdFx0LnRoZW4oYXN5bmMgKCkgPT5cblx0XHRcdFx0XHR7XG5cblx0XHRcdFx0XHRcdGlmIChndW5EYXRhICYmIGd1bkRhdGEuaXNHdW4pXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBndW5EYXRhXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGDlj5blvpfmqpTmoYjkuK0uLi5gKTtcblx0XHRcdFx0XHRcdGxldCBjcCA9IHNwYXduU3luYygnbm9kZScsIFtcblx0XHRcdFx0XHRcdFx0Jy0tZXhwZXJpbWVudGFsLXdvcmtlcicsXG5cdFx0XHRcdFx0XHRcdGpvaW4oX19yb290LCBgLi9jbGkvY2xpLmpzYCksXG5cdFx0XHRcdFx0XHRcdCctLW1vZCcsXG5cdFx0XHRcdFx0XHRcdCdhbGwnLFxuXHRcdFx0XHRcdFx0XHQnLS1zaXRlSUQnLFxuXHRcdFx0XHRcdFx0XHRzaXRlSUQsXG5cdFx0XHRcdFx0XHRcdCctLW5vdmVsX2lkJyxcblx0XHRcdFx0XHRcdFx0bm92ZWxfaWQsXG5cdFx0XHRcdFx0XHRdLCB7XG5cdFx0XHRcdFx0XHRcdHN0ZGlvOiAnaW5oZXJpdCcsXG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0aWYgKGNwLmVycm9yKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoY3AuZXJyb3IpXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGxldCBtYXA6IElDYWNoZU1hcCA9IGF3YWl0IHJlYWRKU09OKG1hcF9maWxlKS5jYXRjaChlID0+IG51bGwpO1xuXG5cdFx0XHRcdFx0XHRpZiAoIW1hcCB8fCAhbWFwW3NpdGVJRF0gfHwgIW1hcFtzaXRlSURdW25vdmVsX2lkXSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5kaXIobWFwKTtcblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKGDlu7rnq4vmqpTmoYjmmYLlpLHmlZfvvIwke3NpdGVJRH0gJHtub3ZlbF9pZH0g5Y+v6IO95LiN5a2Y5Zyo5oiW6Kej5p6Q5aSx5pWXLi4uYCkpXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChtYXBbc2l0ZUlEXVtub3ZlbF9pZF0uc3RhdHVzID09PSBFbnVtQ2FjaGVNYXBSb3dTdGF0dXMuV0FJVElOR19SRVRSWSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0bGV0IGUgPSBuZXcgRXJyb3IoYOaKk+WPliAke3NpdGVJRH0gJHtub3ZlbF9pZH0g5L6G5rqQ5pmC5aSx5pWX77yM5Ly65pyN5Zmo5Y+v6IO95b+Z56KM5oiW5ouS57WV5Zue5oeJ77yM6KuL5LmL5b6M5YaN6YeN6KmmLi4uYCk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdFx0XHRlLlN0YXR1c0NvZGUgPSA1MDQ7XG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGUpXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGxldCBfZGF0YSA9IG1hcFtzaXRlSURdW25vdmVsX2lkXTtcblxuXHRcdFx0XHRcdFx0aWYgKG1hcFtyZXEucGFyYW1zLnNpdGVJRF0pIGRlbGV0ZSBtYXBbcmVxLnBhcmFtcy5zaXRlSURdW3JlcS5wYXJhbXMuaWRdO1xuXHRcdFx0XHRcdFx0aWYgKG1hcFtfZGF0YS5zaXRlSURdKSBkZWxldGUgbWFwW19kYXRhLnNpdGVJRF1bX2RhdGEubm92ZWxfaWQyXTtcblx0XHRcdFx0XHRcdGlmIChtYXBbX2RhdGEuSURLRVldKSBkZWxldGUgbWFwW19kYXRhLklES0VZXVtfZGF0YS5ub3ZlbF9pZDJdO1xuXHRcdFx0XHRcdFx0aWYgKG1hcFtfZGF0YS5zaXRlSURdKSBkZWxldGUgbWFwW19kYXRhLnNpdGVJRF1bX2RhdGEubm92ZWxfaWRdO1xuXHRcdFx0XHRcdFx0aWYgKG1hcFtfZGF0YS5JREtFWV0pIGRlbGV0ZSBtYXBbX2RhdGEuSURLRVldW19kYXRhLm5vdmVsX2lkXTtcblx0XHRcdFx0XHRcdGlmIChtYXBbc2l0ZUlEXSkgZGVsZXRlIG1hcFtzaXRlSURdW25vdmVsX2lkXTtcblxuXHRcdFx0XHRcdFx0YXdhaXQgd3JpdGVKU09OKG1hcF9maWxlLCBtYXAsIHsgc3BhY2VzOiAyIH0pLmNhdGNoKGUgPT5cblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihg55m855Sf6Yyv6Kqk77yM54Sh5rOV5a+r5YWl57ep5a2Y5qqU5qGIICR7bWFwX2ZpbGV9YCk7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoZSlcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gX2RhdGFcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5jYXRjaChlID0+XG5cdFx0XHRcdFx0e1xuXG5cdFx0XHRcdFx0XHRpZiAoZ3VuRGF0YSAmJiBndW5EYXRhLmV4aXN0cylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKGDmqpTmoYjlu7rnq4vlpLHmlZfvvIzkvb/nlKhQMlDnt6nlrZjku6Pmm79gKTtcblxuXHRcdFx0XHRcdFx0XHRndW5EYXRhLmlzR3VuID0gdHJ1ZTtcblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZ3VuRGF0YVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZSlcblx0XHRcdFx0XHR9KSBhcyBQcm9taXNlPElHdW5FcHViRGF0YSAmIElDYWNoZU1hcFJvdz5cblx0XHRcdFx0XHQ7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oYXN5bmMgKGRhdGEpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGDmiJDlip/lj5blvpfmqpTmoYguLi5gKTtcblxuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdGxldCBmaWxlQ29udGVudHM6IEJ1ZmZlciA9IGRhdGEuYmFzZTY0ICYmIEJ1ZmZlci5mcm9tKGRhdGEuYmFzZTY0LCAnYmFzZTY0JykgfHwgYXdhaXQgcmVhZEZpbGUoZGF0YS5lcHViKTtcblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRsZXQgZmlsZW5hbWU6IHN0cmluZyA9IGRhdGEuZmlsZW5hbWUgfHwgZGF0YS5JREtFWSArICdfJyArIGJhc2VuYW1lKGRhdGEuZXB1Yik7XG5cblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRpZiAoIWRhdGEuaXNHdW4gfHwgdHJ1ZSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNvbnNvbGUuZGVidWcoYOWwh+aqlOahiOWEsuWtmOWIsFAyUOe3qeWtmGApO1xuXG5cdFx0XHRcdFx0bGV0IGd1bkRhdGE6IElHdW5FcHViTm9kZSA9IHtcblx0XHRcdFx0XHRcdHRpbWVzdGFtcDogZGF0YS5pc0d1biA/IGRhdGEudGltZXN0YW1wIDogRGF0ZS5ub3coKSxcblx0XHRcdFx0XHRcdGV4aXN0czogdHJ1ZSxcblx0XHRcdFx0XHRcdGZpbGVuYW1lLFxuXHRcdFx0XHRcdFx0YmFzZTY0OiBmaWxlQ29udGVudHMudG9TdHJpbmcoJ2Jhc2U2NCcpLFxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRtYWtlQXJyYXlFbnRyeXMoW1xuXHRcdFx0XHRcdFx0c2l0ZUlELFxuXHRcdFx0XHRcdFx0cmVxLnBhcmFtcy5zaXRlSUQsXG5cdFx0XHRcdFx0XHRkYXRhLklES0VZLFxuXHRcdFx0XHRcdF0sIFtcblx0XHRcdFx0XHRcdG5vdmVsX2lkLFxuXHRcdFx0XHRcdFx0cmVxLnBhcmFtcy5pZCxcblx0XHRcdFx0XHRcdGRhdGEubm92ZWxfaWQsXG5cdFx0XHRcdFx0XHRkYXRhLm5vdmVsX2lkMixcblx0XHRcdFx0XHRcdG5vdmVsX2lkLFxuXHRcdFx0XHRcdF0pLmZvckVhY2goKFtzaXRlSUQsIG5vdmVsX2lkXSkgPT4gbm9kZUd1bkVwdWJGaWxlKHNpdGVJRCwgbm92ZWxfaWQpLnB1dChndW5EYXRhKSk7XG5cblx0XHRcdFx0XHQvKlxuXHRcdFx0XHRcdGFsbEd1bkVwdWJGaWxlKFtcblx0XHRcdFx0XHRcdHNpdGVJRCxcblx0XHRcdFx0XHRcdHJlcS5wYXJhbXMuc2l0ZUlELFxuXHRcdFx0XHRcdFx0ZGF0YS5JREtFWSxcblx0XHRcdFx0XHRdLCBbXG5cdFx0XHRcdFx0XHRub3ZlbF9pZCxcblx0XHRcdFx0XHRcdHJlcS5wYXJhbXMuaWQsXG5cdFx0XHRcdFx0XHRkYXRhLm5vdmVsX2lkLFxuXHRcdFx0XHRcdFx0ZGF0YS5ub3ZlbF9pZDIsXG5cdFx0XHRcdFx0XHRub3ZlbF9pZCxcblx0XHRcdFx0XHRdKS5mb3JFYWNoKG5vZGUgPT4gbm9kZS5wdXQoZ3VuRGF0YSkpO1xuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IHJlYWRTdHJlYW0gPSBuZXcgUGFzc1Rocm91Z2goKTtcblx0XHRcdFx0cmVhZFN0cmVhbS5lbmQoZmlsZUNvbnRlbnRzKTtcblxuXHRcdFx0XHRsZXQgeyBtaW1lLCBleHQgfSA9IGF3YWl0IGZyb21CdWZmZXIoZmlsZUNvbnRlbnRzKTtcblxuXHRcdFx0XHRpZiAoZXh0ID09PSAnZXB1YicgJiYgbWltZSA9PT0gJ2FwcGxpY2F0aW9uL3ppcCcpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRtaW1lID0gJ2FwcGxpY2F0aW9uL2VwdWIremlwJztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJlcy5zZXQoJ0NvbnRlbnQtZGlzcG9zaXRpb24nLCAnYXR0YWNobWVudDsgZmlsZW5hbWU9JyArIGZpbGVuYW1lKTtcblx0XHRcdFx0cmVzLnNldCgnQ29udGVudC1UeXBlJywgbWltZSk7XG5cblx0XHRcdFx0Y29uc29sZS5sb2coYOWwh+aqlOahiOWCs+mAgeiHs+WuouaItuerry4uLmApO1xuXHRcdFx0XHRyZWFkU3RyZWFtLnBpcGUocmVzKTtcblxuXHRcdFx0XHRpZiAodHlwZW9mIGRhdGEucmVtb3ZlQ2FsbGJhY2sgPT09ICdmdW5jdGlvbicpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRkYXRhLnJlbW92ZUNhbGxiYWNrKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoZGF0YS5vdXRwdXREaXIpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZW1vdmUoZGF0YS5vdXRwdXREaXIpXG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goZSA9PlxuXHRcdFx0e1xuXG5cdFx0XHRcdGxldCB7IG1lc3NhZ2UgfSA9IGU7XG5cdFx0XHRcdGlmIChlLmNvZGUgPT09ICdFTk9FTlQnKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bWVzc2FnZSA9IGBpZCDkuI3lrZjlnKgg5oiWIOS8uuacjeWZqOmboue3mmBcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8qXG5cdFx0XHRcdHVzZUd1bigpXG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdC5nZXQoJ2VwdWItZmlsZScpXG5cdFx0XHRcdFx0LmdldChyZXEucGFyYW1zLnNpdGVJRClcblx0XHRcdFx0XHQuZ2V0KHJlcS5wYXJhbXMuaWQpXG5cdFx0XHRcdFx0LnB1dCh7XG5cdFx0XHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KCksXG5cdFx0XHRcdFx0XHRleGlzdHM6IGZhbHNlLFxuXHRcdFx0XHRcdH0gYXMgSUd1bkVwdWJOb2RlKVxuXHRcdFx0XHQ7XG5cdFx0XHRcdCAqL1xuXG5cdFx0XHRcdGxldCBkYXRhID0ge1xuXHRcdFx0XHRcdGVycm9yOiBtZXNzYWdlLFxuXHRcdFx0XHRcdHBhcmFtczogcmVxLnBhcmFtcyxcblx0XHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KCksXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0cmVzLnN0YXR1cyg0MDQpLmpzb24oZGF0YSk7XG5cblx0XHRcdFx0Y29uc29sZS53YXJuKGRhdGEpO1xuXG5cdFx0XHRcdGNvbnNvbGUud2Fybihg5Lul5LiL6Yyv6Kqk6KiK5oGv54K66Zmk6Yyv55So77yM5Lim6Z2e5q+P5YCL6YO95pyD5bCN56iL5byP6YCg5oiQ5b2x6Z+/ID0+YCwgZSlcblxuXHRcdFx0fSlcblx0fSk7XG5cblx0cmV0dXJuIHJvdXRlclxufVxuXG5leHBvcnQgZGVmYXVsdCBmaWxlSGFuZGxlclxuIl19