"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const address2_1 = __importDefault(require("address2"));
const qrcode_terminal_1 = require("qrcode-terminal");
const terminal_link_1 = __importDefault(require("terminal-link"));
const logger_1 = __importDefault(require("debug-color2/logger"));
function showIP(port) {
    logger_1.default.info(`如果使用以下位址依然不能連上伺服器的話，請利用網路搜尋如何查詢自己的電腦IP，或利用 ${terminal_link_1.default(`share-localhost`, `https://www.npmjs.com/package/share-localhost`)} 這類工具來讓外部網路可以讀取自己內部網路的IP`);
    let ip = `localhost`;
    let href = `http://${ip}:${port}/opds`;
    logger_1.default.success(terminal_link_1.default(ip, href));
    ip = address2_1.default();
    if (ip != '127.0.0.1') {
        href = `http://${ip}:${port}/opds`;
        logger_1.default.success(terminal_link_1.default(ip, href));
    }
    qrcode_terminal_1.generate(href, { small: true });
}
exports.showIP = showIP;
exports.default = showIP;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHdEQUF1QztBQUN2QyxxREFBcUQ7QUFDckQsa0VBQXlDO0FBQ3pDLGlFQUEwQztBQUUxQyxTQUFnQixNQUFNLENBQUMsSUFBcUI7SUFFM0MsZ0JBQU8sQ0FBQyxJQUFJLENBQUMsOENBQThDLHVCQUFZLENBQUMsaUJBQWlCLEVBQUUsK0NBQStDLENBQUMsMEJBQTBCLENBQUMsQ0FBQztJQUV2SyxJQUFJLEVBQUUsR0FBVyxXQUFXLENBQUM7SUFDN0IsSUFBSSxJQUFJLEdBQUcsVUFBVSxFQUFFLElBQUksSUFBSSxPQUFPLENBQUM7SUFDdkMsZ0JBQU8sQ0FBQyxPQUFPLENBQUMsdUJBQVksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUV4QyxFQUFFLEdBQUcsa0JBQWUsRUFBRSxDQUFDO0lBRXZCLElBQUksRUFBRSxJQUFJLFdBQVcsRUFDckI7UUFDQyxJQUFJLEdBQUcsVUFBVSxFQUFFLElBQUksSUFBSSxPQUFPLENBQUM7UUFDbkMsZ0JBQU8sQ0FBQyxPQUFPLENBQUMsdUJBQVksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUN4QztJQUVELDBCQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDL0IsQ0FBQztBQWpCRCx3QkFpQkM7QUFFRCxrQkFBZSxNQUFNLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc2VhcmNoSVBBZGRyZXNzIGZyb20gJ2FkZHJlc3MyJztcbmltcG9ydCB7IGdlbmVyYXRlIGFzIHFyY29kZSB9IGZyb20gJ3FyY29kZS10ZXJtaW5hbCc7XG5pbXBvcnQgdGVybWluYWxMaW5rIGZyb20gJ3Rlcm1pbmFsLWxpbmsnO1xuaW1wb3J0IGNvbnNvbGUgZnJvbSAnZGVidWctY29sb3IyL2xvZ2dlcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBzaG93SVAocG9ydDogc3RyaW5nIHwgbnVtYmVyKVxue1xuXHRjb25zb2xlLmluZm8oYOWmguaenOS9v+eUqOS7peS4i+S9jeWdgOS+neeEtuS4jeiDvemAo+S4iuS8uuacjeWZqOeahOipse+8jOiri+WIqeeUqOe2sui3r+aQnOWwi+WmguS9leafpeipouiHquW3seeahOmbu+iFpklQ77yM5oiW5Yip55SoICR7dGVybWluYWxMaW5rKGBzaGFyZS1sb2NhbGhvc3RgLCBgaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2Uvc2hhcmUtbG9jYWxob3N0YCl9IOmAmemhnuW3peWFt+S+huiuk+WklumDqOe2sui3r+WPr+S7peiugOWPluiHquW3seWFp+mDqOe2sui3r+eahElQYCk7XG5cblx0bGV0IGlwOiBzdHJpbmcgPSBgbG9jYWxob3N0YDtcblx0bGV0IGhyZWYgPSBgaHR0cDovLyR7aXB9OiR7cG9ydH0vb3Bkc2A7XG5cdGNvbnNvbGUuc3VjY2Vzcyh0ZXJtaW5hbExpbmsoaXAsIGhyZWYpKTtcblxuXHRpcCA9IHNlYXJjaElQQWRkcmVzcygpO1xuXG5cdGlmIChpcCAhPSAnMTI3LjAuMC4xJylcblx0e1xuXHRcdGhyZWYgPSBgaHR0cDovLyR7aXB9OiR7cG9ydH0vb3Bkc2A7XG5cdFx0Y29uc29sZS5zdWNjZXNzKHRlcm1pbmFsTGluayhpcCwgaHJlZikpO1xuXHR9XG5cblx0cXJjb2RlKGhyZWYsIHsgc21hbGw6IHRydWUgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHNob3dJUFxuIl19