"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const index_1 = (0, tslib_1.__importStar)(require("../lib/opds/index"));
const demonovel_1 = (0, tslib_1.__importDefault)(require("./opds/demonovel"));
const other_1 = require("../lib/opds/other");
const update_cache_1 = require("../lib/task/update-cache");
function opdsHandler() {
    const router = (0, express_1.Router)();
    router.use('/*', async (req, res, next) => {
        (0, update_cache_1.updateAllCacheTask)();
        next();
    });
    router.use((0, demonovel_1.default)());
    router.use('/other.xml', async (req, res) => {
        let feed = await (0, other_1.makeOPDSOther)();
        res.setHeader('Content-Type', 'application/xml');
        res.send(feed.toXML());
    });
    router.use('/:siteID.xml', async (req, res) => {
        let feed = await (0, index_1.makeOPDSSite)(req.params.siteID);
        res.setHeader('Content-Type', 'application/xml');
        res.send(feed.toXML());
    });
    router.use('/*', async (req, res) => {
        let feed = await (0, index_1.default)();
        res.setHeader('Content-Type', 'application/xml');
        res.send(feed.toXML());
    });
    return router;
}
exports.default = opdsHandler;
//# sourceMappingURL=opds.js.map