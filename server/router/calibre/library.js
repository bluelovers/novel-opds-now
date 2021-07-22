"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLibraryHandler = void 0;
const tslib_1 = require("tslib");
const express_1 = require("express");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const index_1 = (0, tslib_1.__importDefault)(require("calibre-server/lib/opds/index"));
const db_1 = (0, tslib_1.__importDefault)(require("calibre-server/lib/opds/db"));
const search_1 = require("../../../lib/opds/search");
const moment_1 = (0, tslib_1.__importDefault)(require("moment"));
function createLibraryHandler(options) {
    const router = (0, express_1.Router)();
    logger_1.default.dir(options.dbList);
    router.use('/+:dbID/*', async (req, res, next) => {
        let { dbID } = req.params;
        if (dbID && options.dbList[dbID]) {
            logger_1.default.dir({
                dbID,
                name: options.dbList[dbID].name,
            });
            res.setHeader('Content-Type', 'application/xml');
            let feed = await (0, db_1.default)(options, { dbID });
            (0, search_1.addOpenSearch)(feed, 'calibre');
            feed.books.forEach(entry => {
                var _a;
                (_a = entry.authors) !== null && _a !== void 0 ? _a : (entry.authors = []);
                entry.authors.unshift({
                    name: dbID
                });
            });
            res.send(feed.toXML());
        }
        else {
            if (dbID) {
                logger_1.default.error(`dbID: ${dbID} 不存在`);
            }
            return next();
        }
    });
    let opdsIndex = async (req, res, next) => {
        res.setHeader('Content-Type', 'application/xml');
        let feed = await (0, index_1.default)(options);
        (0, search_1.addOpenSearch)(feed, 'calibre');
        feed.updated || (feed.updated = (0, moment_1.default)().startOf('day'));
        res.send(feed.toXML());
    };
    router.use('*', opdsIndex);
    return router;
}
exports.createLibraryHandler = createLibraryHandler;
//# sourceMappingURL=library.js.map