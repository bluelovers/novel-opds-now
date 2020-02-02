"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importStar(require("../lib/opds/index"));
const demonovel_1 = __importDefault(require("./opds/demonovel"));
function opdsHandler() {
    const router = express_1.Router();
    router.use(demonovel_1.default());
    router.use('/:siteID.xml', async (req, res) => {
        let feed = await index_1.makeOPDSSite(req.params.siteID);
        res.setHeader('Content-Type', 'application/xml');
        res.send(feed.toXML());
    });
    router.use('/*', async (req, res) => {
        let feed = await index_1.default();
        res.setHeader('Content-Type', 'application/xml');
        res.send(feed.toXML());
    });
    return router;
}
exports.default = opdsHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3Bkcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9wZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEscUNBQWlDO0FBRWpDLDJEQUFpRTtBQUNqRSxpRUFBb0Q7QUFFcEQsU0FBUyxXQUFXO0lBRW5CLE1BQU0sTUFBTSxHQUFHLGdCQUFNLEVBQUUsQ0FBQztJQUV4QixNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFvQixFQUFFLENBQUMsQ0FBQztJQUVuQyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBRTdDLElBQUksSUFBSSxHQUFHLE1BQU0sb0JBQVksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQWEsQ0FBQyxDQUFDO1FBQ3hELEdBQUcsQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDakQsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQTtJQUN2QixDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFFbkMsSUFBSSxJQUFJLEdBQUcsTUFBTSxlQUFjLEVBQUUsQ0FBQztRQUNsQyxHQUFHLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBQ2pELEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUE7SUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLE1BQU0sQ0FBQTtBQUNkLENBQUM7QUFFRCxrQkFBZSxXQUFXLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdleHByZXNzJztcbmltcG9ydCB7IGlkX3RpdGxlc19tYXAgfSBmcm9tICcuLi9saWIvbm92ZWwtY2FjaGUvdHlwZXMnO1xuaW1wb3J0IG1ha2VPUERTUG9ydGFsLCB7IG1ha2VPUERTU2l0ZSB9IGZyb20gJy4uL2xpYi9vcGRzL2luZGV4JztcbmltcG9ydCBvcGRzRGVtb05vdmVsSGFuZGxlciBmcm9tICcuL29wZHMvZGVtb25vdmVsJztcblxuZnVuY3Rpb24gb3Bkc0hhbmRsZXIoKVxue1xuXHRjb25zdCByb3V0ZXIgPSBSb3V0ZXIoKTtcblxuXHRyb3V0ZXIudXNlKG9wZHNEZW1vTm92ZWxIYW5kbGVyKCkpO1xuXG5cdHJvdXRlci51c2UoJy86c2l0ZUlELnhtbCcsIGFzeW5jIChyZXEsIHJlcykgPT5cblx0e1xuXHRcdGxldCBmZWVkID0gYXdhaXQgbWFrZU9QRFNTaXRlKHJlcS5wYXJhbXMuc2l0ZUlEIGFzIGFueSk7XG5cdFx0cmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3htbCcpO1xuXHRcdHJlcy5zZW5kKGZlZWQudG9YTUwoKSlcblx0fSk7XG5cblx0cm91dGVyLnVzZSgnLyonLCBhc3luYyAocmVxLCByZXMpID0+XG5cdHtcblx0XHRsZXQgZmVlZCA9IGF3YWl0IG1ha2VPUERTUG9ydGFsKCk7XG5cdFx0cmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3htbCcpO1xuXHRcdHJlcy5zZW5kKGZlZWQudG9YTUwoKSlcblx0fSk7XG5cblx0cmV0dXJuIHJvdXRlclxufVxuXG5leHBvcnQgZGVmYXVsdCBvcGRzSGFuZGxlclxuIl19