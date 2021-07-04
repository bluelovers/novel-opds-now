"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const opds_1 = (0, tslib_1.__importStar)(require("../../lib/demonovel/opds"));
function opdsDemoNovelHandler() {
    const router = (0, express_1.Router)();
    router.use(`${opds_1.prefix}/:type.xml`, async (req, res) => {
        let feed = await (0, opds_1.makeOPDSType)(req.params.type);
        res.setHeader('Content-Type', 'application/xml');
        res.send(feed.toXML());
    });
    router.use(`${opds_1.prefix}.xml`, async (req, res) => {
        let feed = await (0, opds_1.default)();
        res.setHeader('Content-Type', 'application/xml');
        res.send(feed.toXML());
    });
    return router;
}
exports.default = opdsDemoNovelHandler;
//# sourceMappingURL=demonovel.js.map