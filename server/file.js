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
            let gunData = await setup_1.default()
                .get('epub-file')
                .get(siteID)
                .get(novel_id)
                .then(function (data) {
                if (data && data.exists) {
                    let { base64, filename, exists, timestamp } = data;
                    let isGun = false;
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
                let map = await fs_extra_1.readJSON(map_file);
                let _data = map[siteID][novel_id];
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
                let gunData = {
                    timestamp: Date.now(),
                    exists: true,
                    filename,
                    base64: fileContents.toString('base64'),
                };
                setup_1.default()
                    .get('epub-file')
                    .get(siteID)
                    .get(novel_id)
                    .put(gunData);
                setup_1.default()
                    .get('epub-file')
                    .get(data.IDKEY)
                    .get(data.novel_id)
                    .put(gunData);
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
                .get(siteID)
                .get(novel_id)
                .put({
                timestamp: Date.now(),
                exists: false,
            });
            let data = {
                error: message,
                params: req.params,
            };
            res.status(404).json(data);
            console.error(`catch error`, e);
            console.dir(data);
        });
    });
    return router;
}
exports.default = fileHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQSxxQ0FBb0Q7QUFDcEQsd0RBQWdDO0FBQ2hDLGtEQUE2RDtBQUM3RCx3Q0FBOEM7QUFDOUMsaURBQTBDO0FBQzFDLCtCQUFzQztBQUN0Qyx1Q0FBaUU7QUFFakUsbUNBQXFDO0FBQ3JDLHlDQUF1QztBQUN2QywyREFBbUM7QUFDbkMsd0RBQWlDO0FBRWpDLFNBQVMsV0FBVztJQUVuQixNQUFNLE1BQU0sR0FBRyxnQkFBTSxFQUFFLENBQUM7SUFFeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFFdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTlDLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQy9CLElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBRTdCLElBQUksTUFBTSxDQUFDLFdBQVcsRUFBRSxLQUFLLE1BQU0sRUFDbkM7WUFDQyxNQUFNLEdBQUcsdUJBQWlCLENBQUMsZ0JBQWdCLENBQUE7U0FDM0M7UUFFRCxJQUFJLFFBQVEsR0FBRyxzQkFBYyxDQUFDO1FBRTlCLE9BQU8sa0JBQVE7YUFDYixPQUFPLEVBQUU7YUFDVCxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFFaEIsSUFBSSxPQUFPLEdBQUcsTUFBTSxlQUFNLEVBQUU7aUJBRTFCLEdBQUcsQ0FBQyxXQUFXLENBQUM7aUJBQ2hCLEdBQUcsQ0FBQyxNQUFNLENBQUM7aUJBQ1gsR0FBRyxDQUFDLFFBQVEsQ0FBQztpQkFDYixJQUFJLENBQUMsVUFBVSxJQUFJO2dCQUduQixJQUFJLElBQUksSUFBSSxJ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QUVELGVBQU0sRUFBRTtpQkFFTixHQUFHLENBQUMsV0FBVyxDQUFDO2lCQUNoQixHQUFHLENBQUMsTUFBTSxDQUFDO2lCQUNYLEdBQUcsQ0FBQyxRQUFRLENBQUM7aUJBQ2IsR0FBRyxDQUFDO2dCQUNKLFNBQVMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNyQixNQUFNLEVBQUUsS0FBSzthQUNiLENBQUMsQ0FDRjtZQUVELElBQUksSUFBSSxHQUFHO2dCQUNWLEtBQUssRUFBRSxPQUFPO2dCQUNkLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTTthQUNsQixDQUFDO1lBRUYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFM0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUE7WUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUVsQixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxNQUFNLENBQUE7QUFDZCxDQUFDO0FBRUQsa0JBQWUsV0FBVyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8yLzEuXG4gKi9cblxuaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2UsIFJvdXRlciB9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCB7IEVudW1Ob3ZlbFNpdGVMaXN0IH0gZnJvbSAnbm92ZWwtZG93bmxvYWRlci9zcmMvYWxsJztcbmltcG9ydCB7IF9fY2FjaGVNYXBGaWxlIH0gZnJvbSAnLi4vbGliL2NvbnN0JztcbmltcG9ydCB7IHNwYXduU3luYyB9IGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XG5pbXBvcnQgeyBqb2luLCBiYXNlbmFtZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyByZWFkSlNPTiwgd3JpdGVKU09OLCByZWFkRmlsZSwgcmVtb3ZlIH0gZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHsgSUNhY2hlTWFwIH0gZnJvbSAnLi4vbGliL3R5cGVzJztcbmltcG9ydCB7IFBhc3NUaHJvdWdoIH0gZnJvbSBcInN0cmVhbVwiO1xuaW1wb3J0IHsgZnJvbUJ1ZmZlciB9IGZyb20gJ2ZpbGUtdHlwZSc7XG5pbXBvcnQgX19yb290IGZyb20gJy4uL2xpYi9fX3Jvb3QnO1xuaW1wb3J0IHVzZUd1biBmcm9tICcuL2d1bi9zZXR1cCc7XG5cbmZ1bmN0aW9uIGZpbGVIYW5kbGVyKClcbntcblx0Y29uc3Qgcm91dGVyID0gUm91dGVyKCk7XG5cblx0cm91dGVyLnVzZSgnLzpzaXRlSUQvOmlkJywgKHJlcSwgcmVzKSA9PlxuXHR7XG5cdFx0Y29uc29sZS5sb2cocmVxLmJhc2VVcmwsIHJlcS51cmwsIHJlcS5wYXJhbXMpO1xuXG5cdFx0bGV0IHNpdGVJRCA9IHJlcS5wYXJhbXMuc2l0ZUlEO1xuXHRcdGxldCBub3ZlbF9pZCA9IHJlcS5wYXJhbXMuaWQ7XG5cblx0XHRpZiAoc2l0ZUlELnRvTG93ZXJDYXNlKCkgPT09ICdkbXpqJylcblx0XHR7XG5cdFx0XHRzaXRlSUQgPSBFbnVtTm92ZWxTaXRlTGlzdC5Ob3ZlbFNpdGVEbXpqQXBpXG5cdFx0fVxuXG5cdFx0bGV0IG1hcF9maWxlID0gX19jYWNoZU1hcEZpbGU7XG5cblx0XHRyZXR1cm4gQmx1ZWJpcmRcblx0XHRcdC5yZXNvbHZlKClcblx0XHRcdC50aGVuKGFzeW5jICgpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGxldCBndW5EYXRhID0gYXdhaXQgdXNlR3VuKClcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0LmdldCgnZXB1Yi1maWxlJylcblx0XHRcdFx0XHQuZ2V0KHNpdGVJRClcblx0XHRcdFx0XHQuZ2V0KG5vdmVsX2lkKVxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChkYXRhKVxuXHRcdFx0XHRcdHtcblxuXHRcdFx0XHRcdFx0aWYgKGRhdGEgJiYgZGF0YS5leGlzdHMpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGxldCB7IGJhc2U2NCwgZmlsZW5hbWUsIGV4aXN0cywgdGltZXN0YW1wIH0gPSBkYXRhO1xuXHRcdFx0XHRcdFx0XHRsZXQgaXNHdW4gPSBmYWxzZTtcblxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhg5pa8UDJQ57ep5a2Y55m854++5qqU5qGILi4uYCwgbmV3IERhdGUodGltZXN0YW1wKSk7XG5cblx0XHRcdFx0XHRcdFx0aWYgKChEYXRlLm5vdygpIC0gZGF0YS50aW1lc3RhbXApIDwgODY0MDAgKiAxMDAwKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0aXNHdW4gPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGDnm67mqJnmqpTmoYjlt7LpgY7mnJ/vvIzoqablnJbph43mlrDlu7rnq4vmqpTmoYhgKVxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0XHRiYXNlNjQsXG5cdFx0XHRcdFx0XHRcdFx0ZmlsZW5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0ZXhpc3RzLFxuXHRcdFx0XHRcdFx0XHRcdHRpbWVzdGFtcCxcblx0XHRcdFx0XHRcdFx0XHRpc0d1bixcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdDtcblxuXHRcdFx0XHRyZXR1cm4gZ3VuRGF0YVxuXHRcdFx0fSlcblx0XHRcdC50aGVuKGFzeW5jIChndW5EYXRhKSA9PiB7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuXHRcdFx0XHRcdC50aGVuKGFzeW5jICgpID0+IHtcblxuXHRcdFx0XHRcdFx0aWYgKGd1bkRhdGEgJiYgZ3VuRGF0YS5pc0d1bilcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGd1bkRhdGFcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYOWPluW+l+aqlOahiOS4rS4uLmApO1xuXHRcdFx0XHRcdFx0bGV0IGNwID0gc3Bhd25TeW5jKCdub2RlJywgW1xuXHRcdFx0XHRcdFx0XHQnLS1leHBlcmltZW50YWwtd29ya2VyJyxcblx0XHRcdFx0XHRcdFx0am9pbihfX3Jvb3QsIGAuL2NsaS9jbGkuanNgKSxcblx0XHRcdFx0XHRcdFx0Jy0tbW9kJyxcblx0XHRcdFx0XHRcdFx0J2FsbCcsXG5cdFx0XHRcdFx0XHRcdCctLXNpdGVJRCcsXG5cdFx0XHRcdFx0XHRcdHNpdGVJRCxcblx0XHRcdFx0XHRcdFx0Jy0tbm92ZWxfaWQnLFxuXHRcdFx0XHRcdFx0XHRub3ZlbF9pZCxcblx0XHRcdFx0XHRcdF0sIHtcblx0XHRcdFx0XHRcdFx0c3RkaW86ICdpbmhlcml0Jyxcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRsZXQgbWFwID0gYXdhaXQgcmVhZEpTT04obWFwX2ZpbGUpIGFzIElDYWNoZU1hcDtcblxuXHRcdFx0XHRcdFx0bGV0IF9kYXRhID0gbWFwW3NpdGVJRF1bbm92ZWxfaWRdO1xuXG5cdFx0XHRcdFx0XHRpZiAobWFwW19kYXRhLnNpdGVJRF0pIGRlbGV0ZSBtYXBbX2RhdGEuc2l0ZUlEXVtfZGF0YS5ub3ZlbF9pZDJdO1xuXHRcdFx0XHRcdFx0aWYgKG1hcFtfZGF0YS5JREtFWV0pIGRlbGV0ZSBtYXBbX2RhdGEuSURLRVldW19kYXRhLm5vdmVsX2lkMl07XG5cdFx0XHRcdFx0XHRpZiAobWFwW19kYXRhLnNpdGVJRF0pIGRlbGV0ZSBtYXBbX2RhdGEuc2l0ZUlEXVtfZGF0YS5ub3ZlbF9pZF07XG5cdFx0XHRcdFx0XHRpZiAobWFwW19kYXRhLklES0VZXSkgZGVsZXRlIG1hcFtfZGF0YS5JREtFWV1bX2RhdGEubm92ZWxfaWRdO1xuXHRcdFx0XHRcdFx0aWYgKG1hcFtzaXRlSURdKSBkZWxldGUgbWFwW3NpdGVJRF1bbm92ZWxfaWRdO1xuXG5cdFx0XHRcdFx0XHRhd2FpdCB3cml0ZUpTT04obWFwX2ZpbGUsIG1hcCwgeyBzcGFjZXM6IDIgfSkuY2F0Y2goZSA9PlxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGUpXG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIF9kYXRhXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuY2F0Y2goZSA9PiB7XG5cblx0XHRcdFx0XHRcdGlmIChndW5EYXRhICYmIGd1bkRhdGEuZXhpc3RzKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oYOaqlOahiOW7uueri+WkseaVl++8jOS9v+eUqFAyUOe3qeWtmOS7o+abv2ApO1xuXG5cdFx0XHRcdFx0XHRcdGd1bkRhdGEuaXNHdW4gPSB0cnVlO1xuXG5cdFx0XHRcdFx0XHRcdHJldHVybiBndW5EYXRhXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlKVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdDtcblx0XHRcdH0pXG5cdFx0XHQudGhlbihhc3luYyAoZGF0YSkgPT5cblx0XHRcdHtcblx0XHRcdFx0Y29uc29sZS5sb2coYOaIkOWKn+WPluW+l+aqlOahiC4uLmApO1xuXG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0bGV0IGZpbGVDb250ZW50czogQnVmZmVyID0gZGF0YS5iYXNlNjQgJiYgQnVmZmVyLmZyb20oZGF0YS5iYXNlNjQsICdiYXNlNjQnKSB8fCBhd2FpdCByZWFkRmlsZShkYXRhLmVwdWIpO1xuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdGxldCBmaWxlbmFtZTogc3RyaW5nID0gZGF0YS5maWxlbmFtZSB8fCBkYXRhLklES0VZICsgJ18nICsgYmFzZW5hbWUoZGF0YS5lcHViKTtcblxuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdGlmICghZGF0YS5pc0d1bilcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGxldCBndW5EYXRhID0ge1xuXHRcdFx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpLFxuXHRcdFx0XHRcdFx0ZXhpc3RzOiB0cnVlLFxuXHRcdFx0XHRcdFx0ZmlsZW5hbWUsXG5cdFx0XHRcdFx0XHRiYXNlNjQ6IGZpbGVDb250ZW50cy50b1N0cmluZygnYmFzZTY0JyksXG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdHVzZUd1bigpXG5cdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0XHQuZ2V0KCdlcHViLWZpbGUnKVxuXHRcdFx0XHRcdFx0LmdldChzaXRlSUQpXG5cdFx0XHRcdFx0XHQuZ2V0KG5vdmVsX2lkKVxuXHRcdFx0XHRcdFx0LnB1dChndW5EYXRhKVxuXHRcdFx0XHRcdDtcblxuXHRcdFx0XHRcdHVzZUd1bigpXG5cdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0XHQuZ2V0KCdlcHViLWZpbGUnKVxuXHRcdFx0XHRcdFx0LmdldChkYXRhLklES0VZKVxuXHRcdFx0XHRcdFx0LmdldChkYXRhLm5vdmVsX2lkKVxuXHRcdFx0XHRcdFx0LnB1dChndW5EYXRhKVxuXHRcdFx0XHRcdDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCByZWFkU3RyZWFtID0gbmV3IFBhc3NUaHJvdWdoKCk7XG5cdFx0XHRcdHJlYWRTdHJlYW0uZW5kKGZpbGVDb250ZW50cyk7XG5cblx0XHRcdFx0bGV0IHsgbWltZSwgZXh0IH0gPSBhd2FpdCBmcm9tQnVmZmVyKGZpbGVDb250ZW50cyk7XG5cblx0XHRcdFx0aWYgKGV4dCA9PT0gJ2VwdWInICYmIG1pbWUgPT09ICdhcHBsaWNhdGlvbi96aXAnKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bWltZSA9ICdhcHBsaWNhdGlvbi9lcHViK3ppcCc7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXMuc2V0KCdDb250ZW50LWRpc3Bvc2l0aW9uJywgJ2F0dGFjaG1lbnQ7IGZpbGVuYW1lPScgKyBmaWxlbmFtZSk7XG5cdFx0XHRcdHJlcy5zZXQoJ0NvbnRlbnQtVHlwZScsIG1pbWUpO1xuXG5cdFx0XHRcdGNvbnNvbGUubG9nKGDlsIfmqpTmoYjlgrPpgIHoh7PlrqLmiLbnq68uLi5gKTtcblx0XHRcdFx0cmVhZFN0cmVhbS5waXBlKHJlcyk7XG5cblx0XHRcdFx0aWYgKHR5cGVvZiBkYXRhLnJlbW92ZUNhbGxiYWNrID09PSAnZnVuY3Rpb24nKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0ZGF0YS5yZW1vdmVDYWxsYmFjaygpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKGRhdGEub3V0cHV0RGlyKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmVtb3ZlKGRhdGEub3V0cHV0RGlyKVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGUgPT5cblx0XHRcdHtcblxuXHRcdFx0XHRsZXQgeyBtZXNzYWdlIH0gPSBlO1xuXHRcdFx0XHRpZiAoZS5jb2RlID09PSAnRU5PRU5UJylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG1lc3NhZ2UgPSBgaWQg5LiN5a2Y5ZyoIOaIliDkvLrmnI3lmajpm6Lnt5pgXG5cdFx0XHRcdH1cblxuXHRcdFx0XHR1c2VHdW4oKVxuXHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHQuZ2V0KCdlcHViLWZpbGUnKVxuXHRcdFx0XHRcdC5nZXQoc2l0ZUlEKVxuXHRcdFx0XHRcdC5nZXQobm92ZWxfaWQpXG5cdFx0XHRcdFx0LnB1dCh7XG5cdFx0XHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KCksXG5cdFx0XHRcdFx0XHRleGlzdHM6IGZhbHNlLFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdDtcblxuXHRcdFx0XHRsZXQgZGF0YSA9IHtcblx0XHRcdFx0XHRlcnJvcjogbWVzc2FnZSxcblx0XHRcdFx0XHRwYXJhbXM6IHJlcS5wYXJhbXMsXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0cmVzLnN0YXR1cyg0MDQpLmpzb24oZGF0YSk7XG5cblx0XHRcdFx0Y29uc29sZS5lcnJvcihgY2F0Y2ggZXJyb3JgLCBlKVxuXHRcdFx0XHRjb25zb2xlLmRpcihkYXRhKVxuXG5cdFx0XHR9KVxuXHR9KTtcblxuXHRyZXR1cm4gcm91dGVyXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZpbGVIYW5kbGVyXG4iXX0=