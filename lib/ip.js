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
    logger_1.default.info(`如果使用以下位址依然不能連上伺服器的話，請利用網路搜尋 如何查詢自己的電腦IP`);
    logger_1.default.info(`或利用 ${terminal_link_1.default(`share-localhost`, `https://www.npmjs.com/package/share-localhost`)} 這類工具 來讓外部網路可以讀取自己內部網路的IP`);
    let ip = `localhost`;
    let href = `http://${ip}:${port}/opds`;
    logger_1.default.success(terminal_link_1.default(ip, href));
    ip = address2_1.default();
    href = `http://${ip}:${port}/opds`;
    logger_1.default.success(terminal_link_1.default(ip, href));
    qrcode_terminal_1.generate(href, { small: true });
}
exports.showIP = showIP;
exports.default = showIP;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHdEQUF1QztBQUN2QyxxREFBcUQ7QUFDckQsa0VBQXlDO0FBQ3pDLGlFQUEwQztBQUUxQyxTQUFnQixNQUFNLENBQUMsSUFBcUI7SUFFMUMsZ0JBQU8sQ0FBQyxJQUFJLENBQUMseUNBQXlDLENBQUMsQ0FBQztJQUN6RCxnQkFBTyxDQUFDLElBQUksQ0FBQyxPQUFPLHVCQUFZLENBQUMsaUJBQWlCLEVBQUUsK0NBQStDLENBQUMsMkJBQTJCLENBQUMsQ0FBQztJQUVqSSxJQUFJLEVBQUUsR0FBVyxXQUFXLENBQUM7SUFDN0IsSUFBSSxJQUFJLEdBQUcsVUFBVSxFQUFFLElBQUksSUFBSSxPQUFPLENBQUM7SUFDdkMsZ0JBQU8sQ0FBQyxPQUFPLENBQUMsdUJBQVksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUV4QyxFQUFFLEdBQUcsa0JBQWUsRUFBRSxDQUFDO0lBQ3ZCLElBQUksR0FBRyxVQUFVLEVBQUUsSUFBSSxJQUFJLE9BQU8sQ0FBQztJQUNuQyxnQkFBTyxDQUFDLE9BQU8sQ0FBQyx1QkFBWSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRXhDLDBCQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDL0IsQ0FBQztBQWRELHdCQWNDO0FBRUQsa0JBQWUsTUFBTSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNlYXJjaElQQWRkcmVzcyBmcm9tICdhZGRyZXNzMic7XG5pbXBvcnQgeyBnZW5lcmF0ZSBhcyBxcmNvZGUgfSBmcm9tICdxcmNvZGUtdGVybWluYWwnO1xuaW1wb3J0IHRlcm1pbmFsTGluayBmcm9tICd0ZXJtaW5hbC1saW5rJztcbmltcG9ydCBjb25zb2xlIGZyb20gJ2RlYnVnLWNvbG9yMi9sb2dnZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gc2hvd0lQKHBvcnQ6IHN0cmluZyB8IG51bWJlcilcbntcblx0XHRjb25zb2xlLmluZm8oYOWmguaenOS9v+eUqOS7peS4i+S9jeWdgOS+neeEtuS4jeiDvemAo+S4iuS8uuacjeWZqOeahOipse+8jOiri+WIqeeUqOe2sui3r+aQnOWwiyDlpoLkvZXmn6XoqaLoh6rlt7HnmoTpm7vohaZJUGApO1xuXHRjb25zb2xlLmluZm8oYOaIluWIqeeUqCAke3Rlcm1pbmFsTGluayhgc2hhcmUtbG9jYWxob3N0YCwgYGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL3NoYXJlLWxvY2FsaG9zdGApfSDpgJnpoZ7lt6Xlhbcg5L6G6K6T5aSW6YOo57ay6Lev5Y+v5Lul6K6A5Y+W6Ieq5bex5YWn6YOo57ay6Lev55qESVBgKTtcblxuXHRsZXQgaXA6IHN0cmluZyA9IGBsb2NhbGhvc3RgO1xuXHRsZXQgaHJlZiA9IGBodHRwOi8vJHtpcH06JHtwb3J0fS9vcGRzYDtcblx0Y29uc29sZS5zdWNjZXNzKHRlcm1pbmFsTGluayhpcCwgaHJlZikpO1xuXG5cdGlwID0gc2VhcmNoSVBBZGRyZXNzKCk7XG5cdGhyZWYgPSBgaHR0cDovLyR7aXB9OiR7cG9ydH0vb3Bkc2A7XG5cdGNvbnNvbGUuc3VjY2Vzcyh0ZXJtaW5hbExpbmsoaXAsIGhyZWYpKTtcblxuXHRxcmNvZGUoaHJlZiwgeyBzbWFsbDogdHJ1ZSB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc2hvd0lQXG4iXX0=