"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const types_1 = require("../lib/site/types");
const index_1 = (0, tslib_1.__importStar)(require("../lib/opds/index"));
const demonovel_1 = (0, tslib_1.__importDefault)(require("./opds/demonovel"));
const other_1 = require("../lib/opds/other");
const update_cache_1 = require("../lib/task/update-cache");
const showClient_1 = require("./util/showClient");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const moment_1 = (0, tslib_1.__importDefault)(require("moment"));
function opdsHandler() {
    const router = (0, express_1.Router)();
    router.use('/*', async (req, res, next) => {
        logger_1.default.log(req.method, req.baseUrl, req.url, req.params, req.query);
        (0, showClient_1.showClient)(req, res, next);
        (0, update_cache_1.updateAllCacheTask)();
        next();
    });
    router.use((0, demonovel_1.default)());
    router.use('/other.xml', async (req, res) => {
        let feed = await (0, other_1.makeOPDSOther)();
        res.setHeader('Content-Type', 'application/xml');
        feed.updated || (feed.updated = (0, moment_1.default)().startOf('day'));
        let xml = feed.toXML();
        res.send(xml);
    });
    router.use('/:siteID.xml', async (req, res, next) => {
        let siteID = req.params.siteID;
        if (!Object.keys(types_1.builded_map).includes(siteID)) {
            logger_1.default.warn(`[OPDS]`, siteID, `不存在`);
            res.status(404);
            return next();
        }
        let feed = await (0, index_1.makeOPDSSite)(siteID);
        res.setHeader('Content-Type', 'application/xml');
        feed.updated || (feed.updated = (0, moment_1.default)().startOf('day'));
        let xml = feed.toXML();
        res.send(xml);
    });
    router.use('/*', async (req, res) => {
        let feed = await (0, index_1.default)();
        res.setHeader('Content-Type', 'application/xml');
        feed.updated = (0, moment_1.default)().startOf('day');
        let xml = feed.toXML();
        res.send(xml);
    });
    return router;
}
exports.default = opdsHandler;
//# sourceMappingURL=opds.js.map