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
const opds_1 = __importStar(require("../../lib/demonovel/opds"));
const update_1 = __importDefault(require("../../lib/demonovel/update"));
update_1.default();
function opdsDemoNovelHandler() {
    const router = express_1.Router();
    router.use(`${opds_1.prefix}/:type.xml`, async (req, res) => {
        let feed = await opds_1.makeOPDSType(req.params.type);
        res.setHeader('Content-Type', 'application/xml');
        res.send(feed.toXML());
    });
    router.use(`${opds_1.prefix}.xml`, async (req, res) => {
        let feed = await opds_1.default();
        res.setHeader('Content-Type', 'application/xml');
        res.send(feed.toXML());
    });
    return router;
}
exports.default = opdsDemoNovelHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVtb25vdmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGVtb25vdmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUVBLHFDQUFpQztBQUNqQyxpRUFBZ0Y7QUFFaEYsd0VBQXFEO0FBRXJELGdCQUFXLEVBQUUsQ0FBQztBQUVkLFNBQVMsb0JBQW9CO0lBRTVCLE1BQU0sTUFBTSxHQUFHLGdCQUFNLEVBQUUsQ0FBQztJQUV4QixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsYUFBTSxZQUFZLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUVwRCxJQUFJLElBQUksR0FBRyxNQUFNLG1CQUFZLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQyxHQUFHLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBQ2pELEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUE7SUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsYUFBTSxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUU5QyxJQUFJLElBQUksR0FBRyxNQUFNLGNBQWMsRUFBRSxDQUFDO1FBQ2xDLEdBQUcsQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDakQsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQTtJQUN2QixDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sTUFBTSxDQUFBO0FBQ2QsQ0FBQztBQUVELGtCQUFlLG9CQUFvQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGxvYWRDYWNoZSBmcm9tICcuLi8uLi9saWIvZGVtb25vdmVsL2xvYWQnO1xuaW1wb3J0IHsgY3JlYXRlRnJvbUpTT04gfSBmcm9tICdAbm9kZS1ub3ZlbC9jYWNoZS1sb2FkZXInO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgbWFrZU9QRFNQb3J0YWwsIHsgcHJlZml4LCBtYWtlT1BEU1R5cGUgfSBmcm9tICcuLi8uLi9saWIvZGVtb25vdmVsL29wZHMnO1xuaW1wb3J0IGJ1aWxkQ2FjaGUgZnJvbSAnLi4vLi4vbGliL2RlbW9ub3ZlbC9idWlsZCc7XG5pbXBvcnQgdXBkYXRlQ2FjaGUgZnJvbSAnLi4vLi4vbGliL2RlbW9ub3ZlbC91cGRhdGUnO1xuXG51cGRhdGVDYWNoZSgpO1xuXG5mdW5jdGlvbiBvcGRzRGVtb05vdmVsSGFuZGxlcigpXG57XG5cdGNvbnN0IHJvdXRlciA9IFJvdXRlcigpO1xuXG5cdHJvdXRlci51c2UoYCR7cHJlZml4fS86dHlwZS54bWxgLCBhc3luYyAocmVxLCByZXMpID0+XG5cdHtcblx0XHRsZXQgZmVlZCA9IGF3YWl0IG1ha2VPUERTVHlwZShyZXEucGFyYW1zLnR5cGUpO1xuXHRcdHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94bWwnKTtcblx0XHRyZXMuc2VuZChmZWVkLnRvWE1MKCkpXG5cdH0pO1xuXG5cdHJvdXRlci51c2UoYCR7cHJlZml4fS54bWxgLCBhc3luYyAocmVxLCByZXMpID0+XG5cdHtcblx0XHRsZXQgZmVlZCA9IGF3YWl0IG1ha2VPUERTUG9ydGFsKCk7XG5cdFx0cmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3htbCcpO1xuXHRcdHJlcy5zZW5kKGZlZWQudG9YTUwoKSlcblx0fSk7XG5cblx0cmV0dXJuIHJvdXRlclxufVxuXG5leHBvcnQgZGVmYXVsdCBvcGRzRGVtb05vdmVsSGFuZGxlclxuIl19