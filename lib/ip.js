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
    logger_1.default.info(`如果使用以下位址依然不能連上伺服器的話\n請利用網路搜尋如何查詢自己的電腦IP\n或利用 ${terminal_link_1.default(`share-localhost`, `https://www.npmjs.com/package/share-localhost`)}\n這類工具來讓外部網路可以讀取自己內部網路的IP`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHdEQUF1QztBQUN2QyxxREFBcUQ7QUFDckQsa0VBQXlDO0FBQ3pDLGlFQUEwQztBQUUxQyxTQUFnQixNQUFNLENBQUMsSUFBcUI7SUFFM0MsZ0JBQU8sQ0FBQyxJQUFJLENBQUMsZ0RBQWdELHVCQUFZLENBQUMsaUJBQWlCLEVBQUUsK0NBQStDLENBQUMsMkJBQTJCLENBQUMsQ0FBQztJQUUxSyxJQUFJLEVBQUUsR0FBVyxXQUFXLENBQUM7SUFDN0IsSUFBSSxJQUFJLEdBQUcsVUFBVSxFQUFFLElBQUksSUFBSSxPQUFPLENBQUM7SUFDdkMsZ0JBQU8sQ0FBQyxPQUFPLENBQUMsdUJBQVksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUV4QyxFQUFFLEdBQUcsa0JBQWUsRUFBRSxDQUFDO0lBRXZCLElBQUksRUFBRSxJQUFJLFdBQVcsRUFDckI7UUFDQyxJQUFJLEdBQUcsVUFBVSxFQUFFLElBQUksSUFBSSxPQUFPLENBQUM7UUFDbkMsZ0JBQU8sQ0FBQyxPQUFPLENBQUMsdUJBQVksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUN4QztJQUVELDBCQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDL0IsQ0FBQztBQWpCRCx3QkFpQkM7QUFFRCxrQkFBZSxNQUFNLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc2VhcmNoSVBBZGRyZXNzIGZyb20gJ2FkZHJlc3MyJztcbmltcG9ydCB7IGdlbmVyYXRlIGFzIHFyY29kZSB9IGZyb20gJ3FyY29kZS10ZXJtaW5hbCc7XG5pbXBvcnQgdGVybWluYWxMaW5rIGZyb20gJ3Rlcm1pbmFsLWxpbmsnO1xuaW1wb3J0IGNvbnNvbGUgZnJvbSAnZGVidWctY29sb3IyL2xvZ2dlcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBzaG93SVAocG9ydDogc3RyaW5nIHwgbnVtYmVyKVxue1xuXHRjb25zb2xlLmluZm8oYOWmguaenOS9v+eUqOS7peS4i+S9jeWdgOS+neeEtuS4jeiDvemAo+S4iuS8uuacjeWZqOeahOipsVxcbuiri+WIqeeUqOe2sui3r+aQnOWwi+WmguS9leafpeipouiHquW3seeahOmbu+iFpklQXFxu5oiW5Yip55SoICR7dGVybWluYWxMaW5rKGBzaGFyZS1sb2NhbGhvc3RgLCBgaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2Uvc2hhcmUtbG9jYWxob3N0YCl9XFxu6YCZ6aGe5bel5YW35L6G6K6T5aSW6YOo57ay6Lev5Y+v5Lul6K6A5Y+W6Ieq5bex5YWn6YOo57ay6Lev55qESVBgKTtcblxuXHRsZXQgaXA6IHN0cmluZyA9IGBsb2NhbGhvc3RgO1xuXHRsZXQgaHJlZiA9IGBodHRwOi8vJHtpcH06JHtwb3J0fS9vcGRzYDtcblx0Y29uc29sZS5zdWNjZXNzKHRlcm1pbmFsTGluayhpcCwgaHJlZikpO1xuXG5cdGlwID0gc2VhcmNoSVBBZGRyZXNzKCk7XG5cblx0aWYgKGlwICE9ICcxMjcuMC4wLjEnKVxuXHR7XG5cdFx0aHJlZiA9IGBodHRwOi8vJHtpcH06JHtwb3J0fS9vcGRzYDtcblx0XHRjb25zb2xlLnN1Y2Nlc3ModGVybWluYWxMaW5rKGlwLCBocmVmKSk7XG5cdH1cblxuXHRxcmNvZGUoaHJlZiwgeyBzbWFsbDogdHJ1ZSB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc2hvd0lQXG4iXX0=