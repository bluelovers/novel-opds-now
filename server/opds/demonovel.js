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
const opds_1 = __importStar(require("../../lib/demonovel/opds"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVtb25vdmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGVtb25vdmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUVBLHFDQUFpQztBQUNqQyxpRUFBZ0Y7QUFJaEYsU0FBUyxvQkFBb0I7SUFFNUIsTUFBTSxNQUFNLEdBQUcsZ0JBQU0sRUFBRSxDQUFDO0lBRXhCLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxhQUFNLFlBQVksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBRXBELElBQUksSUFBSSxHQUFHLE1BQU0sbUJBQVksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9DLEdBQUcsQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDakQsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQTtJQUN2QixDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxhQUFNLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBRTlDLElBQUksSUFBSSxHQUFHLE1BQU0sY0FBYyxFQUFFLENBQUM7UUFDbEMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUNqRCxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFBO0lBQ3ZCLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxNQUFNLENBQUE7QUFDZCxDQUFDO0FBRUQsa0JBQWUsb0JBQW9CLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbG9hZENhY2hlIGZyb20gJy4uLy4uL2xpYi9kZW1vbm92ZWwvbG9hZCc7XG5pbXBvcnQgeyBjcmVhdGVGcm9tSlNPTiB9IGZyb20gJ0Bub2RlLW5vdmVsL2NhY2hlLWxvYWRlcic7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdleHByZXNzJztcbmltcG9ydCBtYWtlT1BEU1BvcnRhbCwgeyBwcmVmaXgsIG1ha2VPUERTVHlwZSB9IGZyb20gJy4uLy4uL2xpYi9kZW1vbm92ZWwvb3Bkcyc7XG5pbXBvcnQgYnVpbGRDYWNoZSBmcm9tICcuLi8uLi9saWIvZGVtb25vdmVsL2J1aWxkJztcbmltcG9ydCB1cGRhdGVDYWNoZSBmcm9tICcuLi8uLi9saWIvZGVtb25vdmVsL3VwZGF0ZSc7XG5cbmZ1bmN0aW9uIG9wZHNEZW1vTm92ZWxIYW5kbGVyKClcbntcblx0Y29uc3Qgcm91dGVyID0gUm91dGVyKCk7XG5cblx0cm91dGVyLnVzZShgJHtwcmVmaXh9Lzp0eXBlLnhtbGAsIGFzeW5jIChyZXEsIHJlcykgPT5cblx0e1xuXHRcdGxldCBmZWVkID0gYXdhaXQgbWFrZU9QRFNUeXBlKHJlcS5wYXJhbXMudHlwZSk7XG5cdFx0cmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3htbCcpO1xuXHRcdHJlcy5zZW5kKGZlZWQudG9YTUwoKSlcblx0fSk7XG5cblx0cm91dGVyLnVzZShgJHtwcmVmaXh9LnhtbGAsIGFzeW5jIChyZXEsIHJlcykgPT5cblx0e1xuXHRcdGxldCBmZWVkID0gYXdhaXQgbWFrZU9QRFNQb3J0YWwoKTtcblx0XHRyZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veG1sJyk7XG5cdFx0cmVzLnNlbmQoZmVlZC50b1hNTCgpKVxuXHR9KTtcblxuXHRyZXR1cm4gcm91dGVyXG59XG5cbmV4cG9ydCBkZWZhdWx0IG9wZHNEZW1vTm92ZWxIYW5kbGVyXG4iXX0=