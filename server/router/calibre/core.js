"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const buildList_1 = require("calibre-server/lib/db/buildList");
const util_1 = require("./util");
const logger_1 = tslib_1.__importDefault(require("debug-color2/logger"));
const showClient_1 = require("../../util/showClient");
const express_1 = require("express");
const path_1 = require("path");
const mimeFromBuffer_1 = require("../../../lib/util/mimeFromBuffer");
const content_disposition_1 = tslib_1.__importDefault(require("@lazy-http/content-disposition"));
const path_2 = require("path");
const fs_extra_1 = require("fs-extra");
const http_response_stream_1 = require("http-response-stream");
const publishAndPoke_1 = require("../../../lib/ipfs/publish/publishAndPoke");
const _addMutableFileSystem_1 = require("../../../lib/ipfs/mfs/_addMutableFileSystem");
const sanitize_filename_1 = require("@lazy-node/sanitize-filename");
const pokeMutableFileSystem_1 = require("../../../lib/ipfs/mfs/pokeMutableFileSystem");
const saveMutableFileSystemRoots_1 = require("../../../lib/ipfs/mfs/saveMutableFileSystemRoots");
const index_1 = require("../../../lib/ipfs/pubsub/index");
const isBookFile_1 = require("calibre-server/lib/util/isBookFile");
const util_2 = require("util");
const library_1 = require("./library");
const search_1 = require("./search");
const lodash_1 = require("lodash");
async function calibreHandlerCore() {
    let calibrePaths = (0, util_1.getCalibrePaths)();
    logger_1.default.debug(`[Calibre]`, `delimiter`, path_2.delimiter);
    logger_1.default.debug(`[Calibre]`, `calibrePaths`, calibrePaths);
    if (!calibrePaths.length) {
        return (req, res, next) => {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.charset = 'utf-8';
            logger_1.default.warn(`[Calibre]`, `請使用 CALIBRE_PATH 或 --calibre-paths 來啟用 Calibre 模組`);
            res.status(404).end(`請使用 CALIBRE_PATH 或 --calibre-paths 來啟用 Calibre 模組`);
        };
    }
    const calibreOptions = {
        dbList: {},
        pathWithPrefix: util_1.pathWithPrefix,
        siteTitle: `Calibre 書庫`,
    };
    const updateLibraryList = (0, lodash_1.throttle)(() => {
        return (0, buildList_1.buildLibraryList)({
            calibrePaths,
            cwd: calibrePaths[0],
        }).then(dbList => calibreOptions.dbList = dbList);
    }, 12 * 60 * 60 * 1000);
    await updateLibraryList();
    logger_1.default.debug(`[Calibre]`, `dbList`, calibreOptions.dbList);
    const router = (0, express_1.Router)();
    const routerOPDS = (0, library_1.createLibraryHandler)(calibreOptions);
    router.use('/search/calibre', (req, res, next) => {
        updateLibraryList();
        next();
    });
    router.use('/search/calibre', (0, search_1.calibreSearchHandler)(calibreOptions));
    router.use('/opds/calibre(\.xml)?', async (req, res, next) => {
        logger_1.default.log(req.method, req.baseUrl, req.url, req.params, req.query);
        (0, showClient_1.showClient)(req, res, next);
        next();
    });
    router.use('/opds/calibre(\.xml)?', routerOPDS);
    router.use('/file/calibre/+:dbID/+:book_id/*', async (req, res, next) => {
        logger_1.default.log(req.method, req.baseUrl, req.url, req.params, req.query);
        (0, showClient_1.showClient)(req, res, next);
        const { dbID, book_id } = req.params;
        let file = req.params[0];
        let db = calibreOptions.dbList[dbID];
        if (!db) {
            return res.status(404).end(`calibre '${dbID}' not exists`);
        }
        return Promise.resolve(db.lazyload().then(db => db.getBook(book_id)))
            .then(async (book) => {
            var _a, _b, _c;
            if (file.length) {
                let ext = (0, path_1.extname)(file).toLowerCase();
                if (['.epub', '.jpg'].includes(ext) || (0, isBookFile_1.isBookFile)(ext.replace(/^\./, ''))) {
                    logger_1.default.log(req.method, req.baseUrl, req.url, req.params, req.query);
                    (0, showClient_1.showClient)(req, res, next);
                    let local_path = (0, path_1.join)(db._fulldir, file);
                    let content = await (0, fs_extra_1.readFile)(local_path)
                        .catch(e => Promise.reject(new Error(`'${file}' not exists`)));
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
                    logger_1.default.debug(`[Calibre]`, (0, util_2.inspect)({
                        dbID,
                        book_id,
                        book,
                        file,
                        local_path,
                        filename,
                        http_filename,
                        result,
                    }, {
                        depth: 5,
                    }));
                    if (true) {
                        const siteID = 'calibre';
                        let author = (_c = (_b = book.authors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.author_name;
                        author = (0, sanitize_filename_1.sanitizeFilename)(author || 'unknown', {
                            replaceToFullWidth: true,
                        }) || 'unknown';
                        let filename = `${book.book_title} - ${author}${ext}`;
                        if (ext === '.jpg') {
                            filename = `${book.book_title} - ${author} - cover${ext}`;
                        }
                        filename = (0, sanitize_filename_1.sanitizeFilename)(filename, {
                            replaceToFullWidth: true,
                        });
                        (0, publishAndPoke_1.publishAndPokeIPFS)(content, {
                            filename,
                            cb(cid, ipfs, data, result) {
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
                                    path: filename,
                                    cid,
                                }, {
                                    ipfs,
                                    async done(file_path) {
                                        await (0, saveMutableFileSystemRoots_1.saveMutableFileSystemRoots)(ipfs);
                                        _addMutableFileSystem_1.waitingCache.delete(file_path);
                                        logger_1.default.debug(`_addMutableFileSystem:done`, file_path);
                                        return (0, pokeMutableFileSystem_1.pokeMutableFileSystemCore)(filename, [
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
            return Promise.reject();
        })
            .catch(e => {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.charset = 'utf-8';
            logger_1.default.error(`[Calibre]`, dbID, file, e);
            res.status(404).end([dbID, file].join('/'));
        });
    });
    return router;
}
exports.default = calibreHandlerCore();
//# sourceMappingURL=core.js.map