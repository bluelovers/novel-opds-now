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
const fs_1 = require("fs");
const mimeFromBuffer_1 = require("../../../lib/util/mimeFromBuffer");
const file_type_1 = require("file-type");
const content_disposition_1 = (0, tslib_1.__importDefault)(require("@lazy-http/content-disposition"));
const path_2 = require("path");
const calibre_env_1 = require("calibre-env");
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
            if (['.epub', '.jpg'].includes(ext)) {
                logger_1.default.log(req.method, req.baseUrl, req.url, req.params, req.query);
                (0, showClient_1.showClient)(req, res, next);
                let local_path = (0, path_1.join)(db === null || db === void 0 ? void 0 : db._fulldir, file);
                let result = await (0, file_type_1.fromStream)((0, fs_1.createReadStream)(local_path)).then(mimeFromBuffer_1.fixFileTypeResult);
                let filename = (0, path_1.basename)(file);
                let http_filename = filename;
                if ((_a = req.query.filename) === null || _a === void 0 ? void 0 : _a.length) {
                    http_filename = String(req.query.filename);
                }
                let attachment = (0, content_disposition_1.default)(http_filename);
                res.set('Content-disposition', attachment);
                (result === null || result === void 0 ? void 0 : result.mime) && res.set('Content-Type', result.mime);
                logger_1.default.debug(`[Calibre]`, {
                    dbID,
                    file,
                    local_path,
                    filename,
                    http_filename,
                    result,
                });
                return (0, fs_1.createReadStream)(local_path).pipe(res);
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