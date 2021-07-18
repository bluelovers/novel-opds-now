"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const handler_1 = (0, tslib_1.__importDefault)(require("calibre-server/lib/handler"));
const buildList_1 = require("calibre-server/lib/db/buildList");
const util_1 = require("./util");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const showClient_1 = require("../../util/showClient");
const express_1 = require("express");
const path_1 = require("path");
const mimeFromBuffer_1 = require("../../../lib/util/mimeFromBuffer");
const content_disposition_1 = (0, tslib_1.__importDefault)(require("@lazy-http/content-disposition"));
const path_2 = require("path");
const calibre_env_1 = require("calibre-env");
const fs_extra_1 = require("fs-extra");
const http_response_stream_1 = require("http-response-stream");
const publishAndPoke_1 = require("../../../lib/ipfs/publish/publishAndPoke");
const _addMutableFileSystem_1 = require("../../../lib/ipfs/mfs/_addMutableFileSystem");
const sanitize_filename_1 = require("@lazy-node/sanitize-filename");
const pokeMutableFileSystem_1 = require("../../../lib/ipfs/mfs/pokeMutableFileSystem");
const saveMutableFileSystemRoots_1 = require("../../../lib/ipfs/mfs/saveMutableFileSystemRoots");
const index_1 = require("../../../lib/ipfs/pubsub/index");
const isBookFile_1 = require("calibre-server/lib/util/isBookFile");
async function calibreHandlerCore() {
    let calibrePaths = (0, calibre_env_1.envCalibrePath)(process.env);
    if (typeof calibrePaths === 'string') {
        calibrePaths = calibrePaths.split(path_2.delimiter);
    }
    else {
        calibrePaths = [calibrePaths];
    }
    calibrePaths = calibrePaths.flat().filter(v => Boolean(v) && v !== 'undefined' && v !== 'null');
    logger_1.default.debug(`[Calibre]`, `delimiter`, path_2.delimiter);
    logger_1.default.debug(`[Calibre]`, `calibrePaths`, calibrePaths);
    if (!calibrePaths.length) {
        return (req, res, next) => {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.charset = 'utf-8';
            logger_1.default.error(`[Calibre]`, `請使用 CALIBRE_PATH 或 --calibre-paths 來啟用 Calibre 模組`);
            res.status(404).end(`請使用 CALIBRE_PATH 或 --calibre-paths 來啟用 Calibre 模組`);
        };
    }
    const dbList = await (0, buildList_1.buildLibraryList)({
        calibrePaths,
        cwd: calibrePaths[0],
    });
    logger_1.default.debug(`[Calibre]`, `dbList`, dbList);
    const router = (0, express_1.Router)();
    const routerOPDS = (0, handler_1.default)({
        dbList,
        pathWithPrefix: util_1.pathWithPrefix,
        siteTitle: `Calibre 書庫`,
    });
    router.use('/opds/calibre(\.xml)?', routerOPDS);
    router.use('/file/calibre/+:dbID/*', async (req, res, next) => {
        var _a;
        const { dbID } = req.params;
        let file = req.params[0];
        let db = dbList[dbID];
        if (!db) {
            return res.status(500).end(`${dbID} not exists`);
        }
        if (file === null || file === void 0 ? void 0 : file.length) {
            let ext = (0, path_1.extname)(file).toLowerCase();
            if (['.epub', '.jpg'].includes(ext) || (0, isBookFile_1.isBookFile)(ext.replace(/^\./, ''))) {
                logger_1.default.log(req.method, req.baseUrl, req.url, req.params, req.query);
                (0, showClient_1.showClient)(req, res, next);
                let local_path = (0, path_1.join)(db === null || db === void 0 ? void 0 : db._fulldir, file);
                let content = await (0, fs_extra_1.readFile)(local_path);
                let result = await (0, mimeFromBuffer_1.mimeFromBuffer)(content, ext);
                let filename = (0, path_1.basename)(file);
                let http_filename = filename;
                if ((_a = req.query.filename) === null || _a === void 0 ? void 0 : _a.length) {
                    http_filename = (0, path_1.basename)(String(req.query.filename));
                }
                let attachment = (0, content_disposition_1.default)(http_filename);
                try {
                    res.set('Content-disposition', attachment);
                }
                catch (e) { }
                (result === null || result === void 0 ? void 0 : result.mime) && res.set('Content-Type', result.mime);
                logger_1.default.debug(`[Calibre]`, {
                    dbID,
                    file,
                    local_path,
                    filename,
                    http_filename,
                    result,
                });
                if (['.epub', '.jpg'].includes(ext) || (0, isBookFile_1.isBookFile)(result.ext)) {
                    const siteID = 'calibre';
                    (0, publishAndPoke_1.publishAndPokeIPFS)(content, {
                        filename: http_filename,
                        cb(cid, ipfs, data, result) {
                            var _a;
                            let author = (0, sanitize_filename_1.sanitizeFilename)(((_a = req.query) === null || _a === void 0 ? void 0 : _a.author) || 'unknown', {
                                replaceToFullWidth: true,
                            }) || 'unknown';
                            ipfs && (0, index_1.pubsubPublishEpub)(ipfs, {
                                siteID,
                                novelID: `${dbID}/${author}`,
                                data: {
                                    path: result.path,
                                    cid,
                                    size: result.size,
                                },
                            }, (0, index_1.getPubsubPeers)(ipfs));
                            ipfs && (0, _addMutableFileSystem_1._addMutableFileSystem)(`/novel-opds-now/${siteID}/${dbID}/${author}`, {
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
                                        `${siteID}/${dbID}/${author}/`,
                                        `${siteID}/${dbID}/`,
                                        `${siteID}/`,
                                    ]);
                                },
                            })
                                .catch(e => logger_1.default.error(`_addMutableFileSystem`, http_filename, e));
                        },
                    })
                        .catch(e => logger_1.default.error(`publishAndPokeIPFS`, http_filename, e));
                }
                return (0, http_response_stream_1.responseStream)(res, content);
            }
        }
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.charset = 'utf-8';
        logger_1.default.error(`[Calibre]`, dbID, file);
        res.status(404).end([dbID, file].join('/'));
    });
    return router;
}
exports.default = calibreHandlerCore();
//# sourceMappingURL=core.js.map