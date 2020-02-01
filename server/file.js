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
                if (data.exists) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQSxxQ0FBb0Q7QUFDcEQsd0RBQWdDO0FBQ2hDLGtEQUE2RDtBQUM3RCx3Q0FBOEM7QUFDOUMsaURBQTBDO0FBQzFDLCtCQUFzQztBQUN0Qyx1Q0FBaUU7QUFFakUsbUNBQXFDO0FBQ3JDLHlDQUF1QztBQUN2QywyREFBbUM7QUFDbkMsd0RBQWlDO0FBRWpDLFNBQVMsV0FBVztJQUVuQixNQUFNLE1BQU0sR0FBRyxnQkFBTSxFQUFFLENBQUM7SUFFeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFFdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTlDLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQy9CLElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBRTdCLElBQUksTUFBTSxDQUFDLFdBQVcsRUFBRSxLQUFLLE1BQU0sRUFDbkM7WUFDQyxNQUFNLEdBQUcsdUJBQWlCLENBQUMsZ0JBQWdCLENBQUE7U0FDM0M7UUFFRCxJQUFJLFFBQVEsR0FBRyxzQkFBYyxDQUFDO1FBRTlCLE9BQU8sa0JBQVE7YUFDYixPQUFPLEVBQUU7YUFDVCxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFFaEIsSUFBSSxPQUFPLEdBQUcsTUFBTSxlQUFNLEVBQUU7aUJBRTFCLEdBQUcsQ0FBQyxXQUFXLENBQUM7aUJBQ2hCLEdBQUcsQ0FBQyxNQUFNLENBQUM7aUJBQ1gsR0FBRyxDQUFDLFFBQVEsQ0FBQztpQkFDYixJQUFJLENBQUMsVUFBVSxJQUFJO2dCQUduQixJQUFJLElBQUksQ0FBQyxN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Q0FBQyxXQUFXLENBQUM7aUJBQ2hCLEdBQUcsQ0FBQyxNQUFNLENBQUM7aUJBQ1gsR0FBRyxDQUFDLFFBQVEsQ0FBQztpQkFDYixHQUFHLENBQUM7Z0JBQ0osU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQ3JCLE1BQU0sRUFBRSxLQUFLO2FBQ2IsQ0FBQyxDQUNGO1lBRUQsSUFBSSxJQUFJLEdBQUc7Z0JBQ1YsS0FBSyxFQUFFLE9BQU87Z0JBQ2QsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNO2FBQ2xCLENBQUM7WUFFRixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUUzQixPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQTtZQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBRWxCLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLE1BQU0sQ0FBQTtBQUNkLENBQUM7QUFFRCxrQkFBZSxXQUFXLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzIvMS5cbiAqL1xuXG5pbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSwgUm91dGVyIH0gZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHsgRW51bU5vdmVsU2l0ZUxpc3QgfSBmcm9tICdub3ZlbC1kb3dubG9hZGVyL3NyYy9hbGwnO1xuaW1wb3J0IHsgX19jYWNoZU1hcEZpbGUgfSBmcm9tICcuLi9saWIvY29uc3QnO1xuaW1wb3J0IHsgc3Bhd25TeW5jIH0gZnJvbSBcImNoaWxkX3Byb2Nlc3NcIjtcbmltcG9ydCB7IGpvaW4sIGJhc2VuYW1lIH0gZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IHJlYWRKU09OLCB3cml0ZUpTT04sIHJlYWRGaWxlLCByZW1vdmUgfSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgeyBJQ2FjaGVNYXAgfSBmcm9tICcuLi9saWIvdHlwZXMnO1xuaW1wb3J0IHsgUGFzc1Rocm91Z2ggfSBmcm9tIFwic3RyZWFtXCI7XG5pbXBvcnQgeyBmcm9tQnVmZmVyIH0gZnJvbSAnZmlsZS10eXBlJztcbmltcG9ydCBfX3Jvb3QgZnJvbSAnLi4vbGliL19fcm9vdCc7XG5pbXBvcnQgdXNlR3VuIGZyb20gJy4vZ3VuL3NldHVwJztcblxuZnVuY3Rpb24gZmlsZUhhbmRsZXIoKVxue1xuXHRjb25zdCByb3V0ZXIgPSBSb3V0ZXIoKTtcblxuXHRyb3V0ZXIudXNlKCcvOnNpdGVJRC86aWQnLCAocmVxLCByZXMpID0+XG5cdHtcblx0XHRjb25zb2xlLmxvZyhyZXEuYmFzZVVybCwgcmVxLnVybCwgcmVxLnBhcmFtcyk7XG5cblx0XHRsZXQgc2l0ZUlEID0gcmVxLnBhcmFtcy5zaXRlSUQ7XG5cdFx0bGV0IG5vdmVsX2lkID0gcmVxLnBhcmFtcy5pZDtcblxuXHRcdGlmIChzaXRlSUQudG9Mb3dlckNhc2UoKSA9PT0gJ2RtemonKVxuXHRcdHtcblx0XHRcdHNpdGVJRCA9IEVudW1Ob3ZlbFNpdGVMaXN0Lk5vdmVsU2l0ZURtempBcGlcblx0XHR9XG5cblx0XHRsZXQgbWFwX2ZpbGUgPSBfX2NhY2hlTWFwRmlsZTtcblxuXHRcdHJldHVybiBCbHVlYmlyZFxuXHRcdFx0LnJlc29sdmUoKVxuXHRcdFx0LnRoZW4oYXN5bmMgKCkgPT5cblx0XHRcdHtcblx0XHRcdFx0bGV0IGd1bkRhdGEgPSBhd2FpdCB1c2VHdW4oKVxuXHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHQuZ2V0KCdlcHViLWZpbGUnKVxuXHRcdFx0XHRcdC5nZXQoc2l0ZUlEKVxuXHRcdFx0XHRcdC5nZXQobm92ZWxfaWQpXG5cdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKGRhdGEpXG5cdFx0XHRcdFx0e1xuXG5cdFx0XHRcdFx0XHRpZiAoZGF0YS5leGlzdHMpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGxldCB7IGJhc2U2NCwgZmlsZW5hbWUsIGV4aXN0cywgdGltZXN0YW1wIH0gPSBkYXRhO1xuXHRcdFx0XHRcdFx0XHRsZXQgaXNHdW4gPSBmYWxzZTtcblxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhg5pa8UDJQ57ep5a2Y55m854++5qqU5qGILi4uYCwgbmV3IERhdGUodGltZXN0YW1wKSk7XG5cblx0XHRcdFx0XHRcdFx0aWYgKChEYXRlLm5vdygpIC0gZGF0YS50aW1lc3RhbXApIDwgODY0MDAgKiAxMDAwKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0aXNHdW4gPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGDnm67mqJnmqpTmoYjlt7LpgY7mnJ/vvIzoqablnJbph43mlrDlu7rnq4vmqpTmoYhgKVxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0XHRiYXNlNjQsXG5cdFx0XHRcdFx0XHRcdFx0ZmlsZW5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0ZXhpc3RzLFxuXHRcdFx0XHRcdFx0XHRcdHRpbWVzdGFtcCxcblx0XHRcdFx0XHRcdFx0XHRpc0d1bixcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdDtcblxuXHRcdFx0XHRyZXR1cm4gZ3VuRGF0YVxuXHRcdFx0fSlcblx0XHRcdC50aGVuKGFzeW5jIChndW5EYXRhKSA9PiB7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuXHRcdFx0XHRcdC50aGVuKGFzeW5jICgpID0+IHtcblxuXHRcdFx0XHRcdFx0aWYgKGd1bkRhdGEgJiYgZ3VuRGF0YS5pc0d1bilcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGd1bkRhdGFcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYOWPluW+l+aqlOahiOS4rS4uLmApO1xuXHRcdFx0XHRcdFx0bGV0IGNwID0gc3Bhd25TeW5jKCdub2RlJywgW1xuXHRcdFx0XHRcdFx0XHRqb2luKF9fcm9vdCwgYC4vY2xpL2NsaS5qc2ApLFxuXHRcdFx0XHRcdFx0XHQnLS1tb2QnLFxuXHRcdFx0XHRcdFx0XHQnYWxsJyxcblx0XHRcdFx0XHRcdFx0Jy0tc2l0ZUlEJyxcblx0XHRcdFx0XHRcdFx0c2l0ZUlELFxuXHRcdFx0XHRcdFx0XHQnLS1ub3ZlbF9pZCcsXG5cdFx0XHRcdFx0XHRcdG5vdmVsX2lkLFxuXHRcdFx0XHRcdFx0XSwge1xuXHRcdFx0XHRcdFx0XHRzdGRpbzogJ2luaGVyaXQnLFxuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdGxldCBtYXAgPSBhd2FpdCByZWFkSlNPTihtYXBfZmlsZSkgYXMgSUNhY2hlTWFwO1xuXG5cdFx0XHRcdFx0XHRsZXQgX2RhdGEgPSBtYXBbc2l0ZUlEXVtub3ZlbF9pZF07XG5cblx0XHRcdFx0XHRcdGlmIChtYXBbX2RhdGEuc2l0ZUlEXSkgZGVsZXRlIG1hcFtfZGF0YS5zaXRlSURdW19kYXRhLm5vdmVsX2lkMl07XG5cdFx0XHRcdFx0XHRpZiAobWFwW19kYXRhLklES0VZXSkgZGVsZXRlIG1hcFtfZGF0YS5JREtFWV1bX2RhdGEubm92ZWxfaWQyXTtcblx0XHRcdFx0XHRcdGlmIChtYXBbX2RhdGEuc2l0ZUlEXSkgZGVsZXRlIG1hcFtfZGF0YS5zaXRlSURdW19kYXRhLm5vdmVsX2lkXTtcblx0XHRcdFx0XHRcdGlmIChtYXBbX2RhdGEuSURLRVldKSBkZWxldGUgbWFwW19kYXRhLklES0VZXVtfZGF0YS5ub3ZlbF9pZF07XG5cdFx0XHRcdFx0XHRpZiAobWFwW3NpdGVJRF0pIGRlbGV0ZSBtYXBbc2l0ZUlEXVtub3ZlbF9pZF07XG5cblx0XHRcdFx0XHRcdGF3YWl0IHdyaXRlSlNPTihtYXBfZmlsZSwgbWFwLCB7IHNwYWNlczogMiB9KS5jYXRjaChlID0+XG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoZSlcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gX2RhdGFcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5jYXRjaChlID0+IHtcblxuXHRcdFx0XHRcdFx0aWYgKGd1bkRhdGEgJiYgZ3VuRGF0YS5leGlzdHMpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUud2Fybihg5qqU5qGI5bu656uL5aSx5pWX77yM5L2/55SoUDJQ57ep5a2Y5Luj5pu/YCk7XG5cblx0XHRcdFx0XHRcdFx0Z3VuRGF0YS5pc0d1biA9IHRydWU7XG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIGd1bkRhdGFcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGUpXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0O1xuXHRcdFx0fSlcblx0XHRcdC50aGVuKGFzeW5jIChkYXRhKSA9PlxuXHRcdFx0e1xuXHRcdFx0XHRjb25zb2xlLmxvZyhg5oiQ5Yqf5Y+W5b6X5qqU5qGILi4uYCk7XG5cblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRsZXQgZmlsZUNvbnRlbnRzOiBCdWZmZXIgPSBkYXRhLmJhc2U2NCAmJiBCdWZmZXIuZnJvbShkYXRhLmJhc2U2NCwgJ2Jhc2U2NCcpIHx8IGF3YWl0IHJlYWRGaWxlKGRhdGEuZXB1Yik7XG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0bGV0IGZpbGVuYW1lOiBzdHJpbmcgPSBkYXRhLmZpbGVuYW1lIHx8IGRhdGEuSURLRVkgKyAnXycgKyBiYXNlbmFtZShkYXRhLmVwdWIpO1xuXG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0aWYgKCFkYXRhLmlzR3VuKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bGV0IGd1bkRhdGEgPSB7XG5cdFx0XHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KCksXG5cdFx0XHRcdFx0XHRleGlzdHM6IHRydWUsXG5cdFx0XHRcdFx0XHRmaWxlbmFtZSxcblx0XHRcdFx0XHRcdGJhc2U2NDogZmlsZUNvbnRlbnRzLnRvU3RyaW5nKCdiYXNlNjQnKSxcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0dXNlR3VuKClcblx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdC5nZXQoJ2VwdWItZmlsZScpXG5cdFx0XHRcdFx0XHQuZ2V0KHNpdGVJRClcblx0XHRcdFx0XHRcdC5nZXQobm92ZWxfaWQpXG5cdFx0XHRcdFx0XHQucHV0KGd1bkRhdGEpXG5cdFx0XHRcdFx0O1xuXG5cdFx0XHRcdFx0dXNlR3VuKClcblx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdC5nZXQoJ2VwdWItZmlsZScpXG5cdFx0XHRcdFx0XHQuZ2V0KGRhdGEuSURLRVkpXG5cdFx0XHRcdFx0XHQuZ2V0KGRhdGEubm92ZWxfaWQpXG5cdFx0XHRcdFx0XHQucHV0KGd1bkRhdGEpXG5cdFx0XHRcdFx0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IHJlYWRTdHJlYW0gPSBuZXcgUGFzc1Rocm91Z2goKTtcblx0XHRcdFx0cmVhZFN0cmVhbS5lbmQoZmlsZUNvbnRlbnRzKTtcblxuXHRcdFx0XHRsZXQgeyBtaW1lLCBleHQgfSA9IGF3YWl0IGZyb21CdWZmZXIoZmlsZUNvbnRlbnRzKTtcblxuXHRcdFx0XHRpZiAoZXh0ID09PSAnZXB1YicgJiYgbWltZSA9PT0gJ2FwcGxpY2F0aW9uL3ppcCcpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRtaW1lID0gJ2FwcGxpY2F0aW9uL2VwdWIremlwJztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJlcy5zZXQoJ0NvbnRlbnQtZGlzcG9zaXRpb24nLCAnYXR0YWNobWVudDsgZmlsZW5hbWU9JyArIGZpbGVuYW1lKTtcblx0XHRcdFx0cmVzLnNldCgnQ29udGVudC1UeXBlJywgbWltZSk7XG5cblx0XHRcdFx0Y29uc29sZS5sb2coYOWwh+aqlOahiOWCs+mAgeiHs+WuouaItuerry4uLmApO1xuXHRcdFx0XHRyZWFkU3RyZWFtLnBpcGUocmVzKTtcblxuXHRcdFx0XHRpZiAodHlwZW9mIGRhdGEucmVtb3ZlQ2FsbGJhY2sgPT09ICdmdW5jdGlvbicpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRkYXRhLnJlbW92ZUNhbGxiYWNrKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoZGF0YS5vdXRwdXREaXIpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZW1vdmUoZGF0YS5vdXRwdXREaXIpXG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goZSA9PlxuXHRcdFx0e1xuXG5cdFx0XHRcdGxldCB7IG1lc3NhZ2UgfSA9IGU7XG5cdFx0XHRcdGlmIChlLmNvZGUgPT09ICdFTk9FTlQnKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bWVzc2FnZSA9IGBpZCDkuI3lrZjlnKgg5oiWIOS8uuacjeWZqOmboue3mmBcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHVzZUd1bigpXG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdC5nZXQoJ2VwdWItZmlsZScpXG5cdFx0XHRcdFx0LmdldChzaXRlSUQpXG5cdFx0XHRcdFx0LmdldChub3ZlbF9pZClcblx0XHRcdFx0XHQucHV0KHtcblx0XHRcdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcblx0XHRcdFx0XHRcdGV4aXN0czogZmFsc2UsXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0O1xuXG5cdFx0XHRcdGxldCBkYXRhID0ge1xuXHRcdFx0XHRcdGVycm9yOiBtZXNzYWdlLFxuXHRcdFx0XHRcdHBhcmFtczogcmVxLnBhcmFtcyxcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRyZXMuc3RhdHVzKDQwNCkuanNvbihkYXRhKTtcblxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBjYXRjaCBlcnJvcmAsIGUpXG5cdFx0XHRcdGNvbnNvbGUuZGlyKGRhdGEpXG5cblx0XHRcdH0pXG5cdH0pO1xuXG5cdHJldHVybiByb3V0ZXJcbn1cblxuZXhwb3J0IGRlZmF1bHQgZmlsZUhhbmRsZXJcbiJdfQ==