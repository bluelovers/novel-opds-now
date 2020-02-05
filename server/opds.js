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
const update_1 = __importDefault(require("../lib/novel-cache/update"));
const update_2 = __importDefault(require("../lib/demonovel/update"));
const other_1 = require("../lib/opds/other");
function opdsHandler() {
    const router = express_1.Router();
    router.use('/*', async (req, res, next) => {
        update_1.default();
        update_2.default();
        next();
    });
    router.use(demonovel_1.default());
    router.use('/other.xml', async (req, res) => {
        let feed = await other_1.makeOPDSOther();
        res.setHeader('Content-Type', 'application/xml');
        res.send(feed.toXML());
    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3Bkcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9wZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEscUNBQWlDO0FBRWpDLDJEQUFpRTtBQUNqRSxpRUFBb0Q7QUFDcEQsdUVBQXVEO0FBQ3ZELHFFQUFrRDtBQUNsRCw2Q0FBa0Q7QUFFbEQsU0FBUyxXQUFXO0lBRW5CLE1BQU0sTUFBTSxHQUFHLGdCQUFNLEVBQUUsQ0FBQztJQUV4QixNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUV6QyxnQkFBYyxFQUFFLENBQUM7UUFDakIsZ0JBQVcsRUFBRSxDQUFDO1FBRWQsSUFBSSxFQUFFLENBQUM7SUFDUixDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW9CLEVBQUUsQ0FBQyxDQUFDO0lBRW5DLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFFM0MsSUFBSSxJQUFJLEdBQUcsTUFBTSxxQkFBYSxFQUFFLENBQUM7UUFDakMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUNqRCxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFBO0lBQ3ZCLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUU3QyxJQUFJLElBQUksR0FBRyxNQUFNLG9CQUFZLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFhLENBQUMsQ0FBQztRQUN4RCxHQUFHLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBQ2pELEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUE7SUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBRW5DLElBQUksSUFBSSxHQUFHLE1BQU0sZUFBYyxFQUFFLENBQUM7UUFDbEMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUNqRCxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFBO0lBQ3ZCLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxNQUFNLENBQUE7QUFDZCxDQUFDO0FBRUQsa0JBQWUsV0FBVyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgeyBpZF90aXRsZXNfbWFwIH0gZnJvbSAnLi4vbGliL25vdmVsLWNhY2hlL3R5cGVzJztcbmltcG9ydCBtYWtlT1BEU1BvcnRhbCwgeyBtYWtlT1BEU1NpdGUgfSBmcm9tICcuLi9saWIvb3Bkcy9pbmRleCc7XG5pbXBvcnQgb3Bkc0RlbW9Ob3ZlbEhhbmRsZXIgZnJvbSAnLi9vcGRzL2RlbW9ub3ZlbCc7XG5pbXBvcnQgdXBkYXRlQ2FjaGVBbGwgZnJvbSAnLi4vbGliL25vdmVsLWNhY2hlL3VwZGF0ZSc7XG5pbXBvcnQgdXBkYXRlQ2FjaGUgZnJvbSAnLi4vbGliL2RlbW9ub3ZlbC91cGRhdGUnO1xuaW1wb3J0IHsgbWFrZU9QRFNPdGhlciB9IGZyb20gJy4uL2xpYi9vcGRzL290aGVyJztcblxuZnVuY3Rpb24gb3Bkc0hhbmRsZXIoKVxue1xuXHRjb25zdCByb3V0ZXIgPSBSb3V0ZXIoKTtcblxuXHRyb3V0ZXIudXNlKCcvKicsIGFzeW5jIChyZXEsIHJlcywgbmV4dCkgPT5cblx0e1xuXHRcdHVwZGF0ZUNhY2hlQWxsKCk7XG5cdFx0dXBkYXRlQ2FjaGUoKTtcblxuXHRcdG5leHQoKTtcblx0fSk7XG5cblx0cm91dGVyLnVzZShvcGRzRGVtb05vdmVsSGFuZGxlcigpKTtcblxuXHRyb3V0ZXIudXNlKCcvb3RoZXIueG1sJywgYXN5bmMgKHJlcSwgcmVzKSA9PlxuXHR7XG5cdFx0bGV0IGZlZWQgPSBhd2FpdCBtYWtlT1BEU090aGVyKCk7XG5cdFx0cmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3htbCcpO1xuXHRcdHJlcy5zZW5kKGZlZWQudG9YTUwoKSlcblx0fSk7XG5cblx0cm91dGVyLnVzZSgnLzpzaXRlSUQueG1sJywgYXN5bmMgKHJlcSwgcmVzKSA9PlxuXHR7XG5cdFx0bGV0IGZlZWQgPSBhd2FpdCBtYWtlT1BEU1NpdGUocmVxLnBhcmFtcy5zaXRlSUQgYXMgYW55KTtcblx0XHRyZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veG1sJyk7XG5cdFx0cmVzLnNlbmQoZmVlZC50b1hNTCgpKVxuXHR9KTtcblxuXHRyb3V0ZXIudXNlKCcvKicsIGFzeW5jIChyZXEsIHJlcykgPT5cblx0e1xuXHRcdGxldCBmZWVkID0gYXdhaXQgbWFrZU9QRFNQb3J0YWwoKTtcblx0XHRyZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veG1sJyk7XG5cdFx0cmVzLnNlbmQoZmVlZC50b1hNTCgpKVxuXHR9KTtcblxuXHRyZXR1cm4gcm91dGVyXG59XG5cbmV4cG9ydCBkZWZhdWx0IG9wZHNIYW5kbGVyXG4iXX0=