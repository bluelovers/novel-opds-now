"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.demoNovelFileHandler = void 0;
const tslib_1 = require("tslib");
const express_1 = require("express");
const getNovelData_1 = require("../../../lib/site/cached-data/getNovelData");
const types_1 = require("../../../lib/site/demonovel/types");
const getDemoEpubUrl_1 = require("../../../lib/site/demonovel/getDemoEpubUrl");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const mimeFromBuffer_1 = require("../../../lib/util/mimeFromBuffer");
const path_1 = require("path");
const content_disposition_1 = (0, tslib_1.__importDefault)(require("@lazy-http/content-disposition"));
const publishAndPoke_1 = require("../../../lib/ipfs/publish/publishAndPoke");
const sanitize_filename_1 = require("@lazy-node/sanitize-filename");
const _addMutableFileSystem_1 = require("../../../lib/ipfs/mfs/_addMutableFileSystem");
const saveMutableFileSystemRoots_1 = require("../../../lib/ipfs/mfs/saveMutableFileSystemRoots");
const pokeMutableFileSystem_1 = require("../../../lib/ipfs/mfs/pokeMutableFileSystem");
const http_response_stream_1 = require("http-response-stream");
const index_1 = require("../../../lib/ipfs/index");
const to_ipfs_url_1 = require("to-ipfs-url");
const index_2 = require("../../../lib/ipfs/pubsub/index");
const getIPFSEpubFileBoth_1 = require("../../../lib/store/fetch/getIPFSEpubFileBoth");
function demoNovelFileHandler() {
    const router = (0, express_1.Router)();
    router.use('/:uuid/*', (req, res) => {
        return bluebird_1.default.resolve()
            .then(async () => {
            var _a, _b, _c;
            const uuid = req.params.uuid;
            const novel = await (0, getNovelData_1.getNovelData)(types_1.siteID, uuid);
            if (!((_b = (_a = novel === null || novel === void 0 ? void 0 : novel.cache) === null || _a === void 0 ? void 0 : _a.epub_basename) === null || _b === void 0 ? void 0 : _b.length)) {
                throw new Error(`${uuid} not exists`);
            }
            const url = (0, getDemoEpubUrl_1.getDemoEpubUrl)(novel);
            const gunData = await (0, getIPFSEpubFileBoth_1.getIPFSEpubFileBoth)(types_1.siteID, novel.id, {
                query: req.query,
                filename: novel.cache.epub_basename,
                timestamp: novel.cache.epub_date,
                href: url.href,
            });
            const content = Buffer.from(gunData.base64);
            let result = await (0, mimeFromBuffer_1.mimeFromBuffer)(content);
            let filename = novel.cache.epub_basename;
            let http_filename = filename;
            if ((_c = req.query.filename) === null || _c === void 0 ? void 0 : _c.length) {
                http_filename = (0, path_1.basename)(String(req.query.filename));
            }
            let attachment = (0, content_disposition_1.default)(http_filename);
            try {
                res.set('Content-disposition', attachment);
            }
            catch (e) { }
            (result === null || result === void 0 ? void 0 : result.mime) && res.set('Content-Type', result.mime);
            delete gunData.base64;
            delete gunData.isGun;
            (0, publishAndPoke_1.publishAndPokeIPFS)(content, {
                filename: http_filename,
                cb(cid, ipfs, data, result) {
                    gunData.href = (0, to_ipfs_url_1.toLink)(cid, data.filename);
                    logger_1.default.debug(`將檔案儲存到P2P緩存`, types_1.siteID, novel.id, novel.cache.epub_basename);
                    (0, index_1.putEpubFileInfo)(types_1.siteID, novel.id, gunData)
                        .tap(json => logger_1.default.debug(`putEpubFileInfo:return`, json));
                    ipfs && (0, index_2.pubsubPublishEpub)(ipfs, {
                        siteID: types_1.siteID,
                        novelID: novel.id,
                        data: {
                            path: result.path,
                            cid,
                            size: result.size,
                        },
                    }, (0, index_2.getPubsubPeers)(ipfs));
                    ipfs && (0, _addMutableFileSystem_1._addMutableFileSystem)(`/novel-opds-now/${types_1.siteID}/${novel.pathMain_base}/${novel.novelID}`, {
                        path: (0, sanitize_filename_1.sanitizeFilename)(http_filename, {
                            replaceToFullWidth: true,
                        }) || (0, sanitize_filename_1.sanitizeFilename)(filename, {
                            replaceToFullWidth: true,
                        }),
                        cid,
                    }, {
                        ipfs,
                        async done(file_path) {
                            await (0, saveMutableFileSystemRoots_1.saveMutableFileSystemRoots)(ipfs);
                            _addMutableFileSystem_1.waitingCache.delete(file_path);
                            logger_1.default.debug(`_addMutableFileSystem:done`, file_path);
                            return (0, pokeMutableFileSystem_1.pokeMutableFileSystemCore)(http_filename, [
                                `${types_1.siteID}/${novel.pathMain_base}/${novel.novelID}/`,
                                `${types_1.siteID}/${novel.pathMain_base}/`,
                                `${types_1.siteID}/`,
                            ]);
                        },
                    })
                        .catch(e => logger_1.default.error(`_addMutableFileSystem`, http_filename, e));
                },
            })
                .catch(e => logger_1.default.error(`publishAndPokeIPFS`, http_filename, e));
            logger_1.default.info(`將檔案傳送至客戶端 ( ${req.clientIp} )...`, filename, (filename !== http_filename)
                ? `=> ${http_filename}`
                : '');
            return (0, http_response_stream_1.responseStream)(res, content);
        })
            .catch(e => {
            let message = e.message;
            if (e.code === 'ENOENT') {
                message = `id 不存在 或 伺服器離線`;
            }
            let data = {
                error: message,
                params: req.params,
                timestamp: Date.now(),
            };
            logger_1.default.error(`[${types_1.siteID}]`, data, e);
            res.status(404).json(data);
        });
    });
    return router;
}
exports.demoNovelFileHandler = demoNovelFileHandler;
//# sourceMappingURL=demonovel.js.map