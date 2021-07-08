"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTempOutputDir = void 0;
const tslib_1 = require("tslib");
const express_1 = require("express");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const const_1 = require("novel-downloader/src/all/const");
const const_2 = require("../lib/const");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const stream_1 = require("stream");
const __root_1 = (0, tslib_1.__importDefault)(require("../lib/__root"));
const util_1 = require("novel-downloader/src/all/util");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const cross_spawn_extra_1 = require("cross-spawn-extra");
const store_1 = require("../lib/store");
const content_disposition_1 = (0, tslib_1.__importDefault)(require("@lazy-http/content-disposition"));
const showClient_1 = require("./util/showClient");
const ipfs_1 = require("../lib/store/ipfs");
const mimeFromBuffer_1 = require("../lib/util/mimeFromBuffer");
function fileHandler() {
    const router = (0, express_1.Router)();
    router.use('/:siteID/:novelID', (req, res) => {
        let query = {
            ...req.params,
            ...req.query,
        };
        delete query.siteID;
        delete query.id;
        logger_1.default.debug(req.method, req.baseUrl, req.url, req.params, query);
        (0, showClient_1.showClient)(req, res);
        let siteID = String(req.params.siteID || '')
            .trim()
            .replace(/\.xml$|[\/\\]+/ig, '');
        let novel_id = String(req.params.novelID || '')
            .trim();
        if (siteID.toLowerCase() === 'dmzj') {
            siteID = const_1.EnumNovelSiteList.NovelSiteDmzjApi;
        }
        let IDKEY = (0, util_1.siteID2IDKEY)(siteID);
        if (siteID === 'masiro') {
            IDKEY = 'masiro';
        }
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
            return (0, ipfs_1.getIPFSEpubFile)(IDKEY, [
                req.params.novelID,
                novel_id,
            ], {
                query,
            })
                .tap(gunData => {
                if (gunData === null || gunData === void 0 ? void 0 : gunData.exists) {
                    let msg = '';
                    if (query.debug || query.force) {
                        let mod = ` FORCE 模式`;
                        if (query.debug) {
                            mod = ` DEBUG 模式`;
                        }
                        msg = `，但${mod}已啟動，將試圖先從原始網站抓取更新`;
                    }
                    else if (!gunData.isGun) {
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
                let cp = await (0, cross_spawn_extra_1.async)('node', [
                    '--experimental-worker',
                    (0, path_1.join)(__root_1.default, `./cli/cli.js`),
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
                let map = await (0, fs_extra_1.readJSON)(map_file)
                    .catch(e => logger_1.default.error(e));
                if (!gunData && (!map || !map[IDKEY] || !map[IDKEY][novel_id])) {
                    gunData = await (0, store_1.getGunEpubFile2)([
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
                await (0, fs_extra_1.writeJSON)(map_file, map, { spaces: 2 }).catch(e => {
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
            var _a;
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
                fileContents = await (0, fs_extra_1.readFile)(data.epub);
            }
            removeTempOutputDir(query, data);
            let filename = data.filename || IDKEY + '_' + (0, path_1.basename)(data.epub);
            if (!data.isGun || true) {
                logger_1.default.debug(`將檔案儲存到P2P緩存`);
                let gunData = {
                    timestamp: isFromBuffer && data.timestamp ? data.timestamp : Date.now(),
                    exists: true,
                    filename,
                    base64: isFromBuffer ? data.base64 : fileContents.toString('base64'),
                };
                (0, ipfs_1.putIPFSEpubFile)([
                    IDKEY,
                ], [
                    novel_id,
                    req.params.novelID,
                    data.novel_id,
                    data.novel_id2,
                    novel_id,
                ], gunData, {});
            }
            if ((_a = res.connection) === null || _a === void 0 ? void 0 : _a.destroyed) {
                logger_1.default.info(`客戶端 ( ${req.clientIp} )  已斷線，停止傳送檔案`);
                res.end();
            }
            else {
                let readStream = new stream_1.PassThrough();
                readStream.end(fileContents);
                let { mime, ext } = await (0, mimeFromBuffer_1.mimeFromBuffer)(fileContents);
                let http_filename = filename;
                if (query.filename) {
                    http_filename = String(query.filename);
                }
                let attachment = (0, content_disposition_1.default)(http_filename);
                res.set('Content-disposition', attachment);
                res.set('Content-Type', mime);
                logger_1.default.info(`將檔案傳送至客戶端 ( ${req.clientIp} )...`, filename, (filename !== http_filename) ? `=> ${http_filename}` : '');
                readStream.pipe(res);
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
function removeTempOutputDir(query, data) {
    if (query.debug) {
        logger_1.default.debug(`忽略刪除下載暫存 ${data.outputDir}`);
    }
    else if (typeof data.removeCallback === 'function') {
        return data.removeCallback();
    }
    else if (data.outputDir) {
        return (0, fs_extra_1.remove)(data.outputDir);
    }
}
exports.removeTempOutputDir = removeTempOutputDir;
exports.default = fileHandler;
//# sourceMappingURL=file.js.map