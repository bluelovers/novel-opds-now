"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importStar(require("../lib/opds/index"));
function opdsHandler() {
    const router = express_1.Router();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3Bkcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9wZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEscUNBQWlDO0FBRWpDLDJEQUFpRTtBQUVqRSxTQUFTLFdBQVc7SUFFbkIsTUFBTSxNQUFNLEdBQUcsZ0JBQU0sRUFBRSxDQUFDO0lBRXhCLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFFN0MsSUFBSSxJQUFJLEdBQUcsTUFBTSxvQkFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBYSxDQUFDLENBQUM7UUFDeEQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUNqRCxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFBO0lBQ3ZCLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUVuQyxJQUFJLElBQUksR0FBRyxNQUFNLGVBQWMsRUFBRSxDQUFDO1FBQ2xDLEdBQUcsQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDakQsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQTtJQUN2QixDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sTUFBTSxDQUFBO0FBQ2QsQ0FBQztBQUVELGtCQUFlLFdBQVcsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJvdXRlciB9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgaWRfdGl0bGVzX21hcCB9IGZyb20gJy4uL2xpYi9ub3ZlbC1jYWNoZS90eXBlcyc7XG5pbXBvcnQgbWFrZU9QRFNQb3J0YWwsIHsgbWFrZU9QRFNTaXRlIH0gZnJvbSAnLi4vbGliL29wZHMvaW5kZXgnO1xuXG5mdW5jdGlvbiBvcGRzSGFuZGxlcigpXG57XG5cdGNvbnN0IHJvdXRlciA9IFJvdXRlcigpO1xuXG5cdHJvdXRlci51c2UoJy86c2l0ZUlELnhtbCcsIGFzeW5jIChyZXEsIHJlcykgPT5cblx0e1xuXHRcdGxldCBmZWVkID0gYXdhaXQgbWFrZU9QRFNTaXRlKHJlcS5wYXJhbXMuc2l0ZUlEIGFzIGFueSk7XG5cdFx0cmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3htbCcpO1xuXHRcdHJlcy5zZW5kKGZlZWQudG9YTUwoKSlcblx0fSk7XG5cblx0cm91dGVyLnVzZSgnLyonLCBhc3luYyAocmVxLCByZXMpID0+XG5cdHtcblx0XHRsZXQgZmVlZCA9IGF3YWl0IG1ha2VPUERTUG9ydGFsKCk7XG5cdFx0cmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3htbCcpO1xuXHRcdHJlcy5zZW5kKGZlZWQudG9YTUwoKSlcblx0fSk7XG5cblx0cmV0dXJuIHJvdXRlclxufVxuXG5leHBvcnQgZGVmYXVsdCBvcGRzSGFuZGxlclxuIl19