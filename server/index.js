"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
const file_1 = __importDefault(require("./file"));
const __root_1 = __importDefault(require("../lib/__root"));
const serve_favicon_1 = __importDefault(require("serve-favicon"));
require("./init");
const opds_1 = __importDefault(require("./opds"));
const serve_1 = __importDefault(require("gun/lib/serve"));
const app = express_1.default();
app.use(serve_1.default);
app.use(serve_favicon_1.default(path_1.join(__root_1.default, 'static', 'favicon.png')));
app.use('/file', file_1.default());
app.use('/opds', opds_1.default());
app.use('/*', (req, res, next) => {
    console.log(req.method, req.baseUrl, req.url, req.params);
    next();
});
app.use('/*', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.charset = 'utf-8';
    let html = `<meta charset="utf-8"/><script src="/gun.js"><script src="/gun/lib/webrtc.js"></script><script>var gun = Gun(["https://gunjs.herokuapp.com/gun","http://nmr.io:8765/gun",window.location.origin + '/gun']);</script>`;
    res.end(`${html}Welcome to micro<p>請將 <a href="/opds"><script>document.write(window.location.origin + '/opds')</script></a> 加入閱讀器的訂閱內</p><p><script>document.write('<img src="https://chart.apis.google.com/chart?cht=qr&chs=300x300&chl= ' + window.location.origin + '/opds"/>')</script></p>`);
});
console.debug(`server setup ready`);
exports.default = app;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUlBLHNEQUE4QjtBQUk5QiwrQkFBc0M7QUFNdEMsa0RBQWlDO0FBQ2pDLDJEQUFtQztBQUNuQyxrRUFBb0M7QUFHcEMsa0JBQWdCO0FBQ2hCLGtEQUFpQztBQUNqQywwREFBcUM7QUFHckMsTUFBTSxHQUFHLEdBQUcsaUJBQU8sRUFBRSxDQUFDO0FBRXRCLEdBQUcsQ0FBQyxHQUFHLENBQUMsZUFBUSxDQUFDLENBQUM7QUFFbEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyx1QkFBTyxDQUFDLFdBQUksQ0FBQyxnQkFBTSxFQUFFLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFeEQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsY0FBVyxFQUFFLENBQUMsQ0FBQztBQUNoQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxjQUFXLEVBQUUsQ0FBQyxDQUFDO0FBRWhDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRTtJQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMxRCxJQUFJLEVBQUUsQ0FBQztBQUNSLENBQUMsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7SUFFMUIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsRUFBQyxjQUFjLEVBQUUsMEJBQTBCLEVBQUMsQ0FBQyxDQUFDO0lBQ2pFLEdBQUcsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBRXRCLElBQUksSUFBSSxHQUFHLHNOQUFzTixDQUFDO0lBRWxPLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLGlSQUFpUixDQUFDLENBQUE7QUFDbFMsQ0FBQyxDQUFDLENBQUM7QUFFSCxPQUFPLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDcEMsa0JBQWUsR0FBRyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8xLzI4LlxuICovXG5pbXBvcnQgbWljcm8sIHsgUmVxdWVzdEhhbmRsZXIsIGJ1ZmZlciwgdGV4dCwganNvbiB9IGZyb20gJ21pY3JvJztcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgRW51bU5vdmVsU2l0ZUxpc3QgfSBmcm9tICdub3ZlbC1kb3dubG9hZGVyL3NyYy9hbGwvY29uc3QnO1xuaW1wb3J0IHsgc3Bhd25TeW5jIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgeyByZWFkSlNPTiwgcmVhZEpTT05TeW5jLCByZWFkRmlsZSwgcmVtb3ZlLCB3cml0ZUpTT04gfSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgeyBqb2luLCBiYXNlbmFtZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHsgSUNhY2hlTWFwIH0gZnJvbSAnLi4vbGliL3R5cGVzJztcbmltcG9ydCB7IFBhc3NUaHJvdWdoIH0gZnJvbSAnc3RyZWFtJztcbmltcG9ydCB7IGZyb21CdWZmZXIgfSBmcm9tICdmaWxlLXR5cGUnO1xuaW1wb3J0IHsgX19jYWNoZU1hcEZpbGUgfSBmcm9tICcuLi9saWIvY29uc3QnO1xuaW1wb3J0IGZpbGVIYW5kbGVyIGZyb20gJy4vZmlsZSc7XG5pbXBvcnQgX19yb290IGZyb20gJy4uL2xpYi9fX3Jvb3QnO1xuaW1wb3J0IGZhdmljb24gZnJvbSAnc2VydmUtZmF2aWNvbic7XG5pbXBvcnQgeyBzZXR1cEd1biB9IGZyb20gJy4vZ3VuL3NldHVwJztcblxuaW1wb3J0ICcuL2luaXQnO1xuaW1wb3J0IG9wZHNIYW5kbGVyIGZyb20gJy4vb3Bkcyc7XG5pbXBvcnQgZ3VuU2VydmUgZnJvbSAnZ3VuL2xpYi9zZXJ2ZSc7XG5pbXBvcnQgZ3VuSHR0cCBmcm9tICdndW4vbGliL2h0dHAnO1xuXG5jb25zdCBhcHAgPSBleHByZXNzKCk7XG5cbmFwcC51c2UoZ3VuU2VydmUpO1xuLy9hcHAudXNlKCcvZ3VuJywgZ3VuSHR0cCk7XG5hcHAudXNlKGZhdmljb24oam9pbihfX3Jvb3QsICdzdGF0aWMnLCAnZmF2aWNvbi5wbmcnKSkpO1xuXG5hcHAudXNlKCcvZmlsZScsIGZpbGVIYW5kbGVyKCkpO1xuYXBwLnVzZSgnL29wZHMnLCBvcGRzSGFuZGxlcigpKTtcblxuYXBwLnVzZSgnLyonLCAocmVxLCByZXMsIG5leHQpID0+IHtcblx0Y29uc29sZS5sb2cocmVxLm1ldGhvZCwgcmVxLmJhc2VVcmwsIHJlcS51cmwsIHJlcS5wYXJhbXMpO1xuXHRuZXh0KCk7XG59KTtcblxuYXBwLnVzZSgnLyonLCAocmVxLCByZXMpID0+IHtcblxuXHRyZXMud3JpdGVIZWFkKDIwMCwgeydDb250ZW50LVR5cGUnOiAndGV4dC9odG1sOyBjaGFyc2V0PXV0Zi04J30pO1xuXHRyZXMuY2hhcnNldCA9ICd1dGYtOCc7XG5cblx0bGV0IGh0bWwgPSBgPG1ldGEgY2hhcnNldD1cInV0Zi04XCIvPjxzY3JpcHQgc3JjPVwiL2d1bi5qc1wiPjxzY3JpcHQgc3JjPVwiL2d1bi9saWIvd2VicnRjLmpzXCI+PC9zY3JpcHQ+PHNjcmlwdD52YXIgZ3VuID0gR3VuKFtcImh0dHBzOi8vZ3VuanMuaGVyb2t1YXBwLmNvbS9ndW5cIixcImh0dHA6Ly9ubXIuaW86ODc2NS9ndW5cIix3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgJy9ndW4nXSk7PC9zY3JpcHQ+YDtcblxuXHRyZXMuZW5kKGAke2h0bWx9V2VsY29tZSB0byBtaWNybzxwPuiri+WwhyA8YSBocmVmPVwiL29wZHNcIj48c2NyaXB0PmRvY3VtZW50LndyaXRlKHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyAnL29wZHMnKTwvc2NyaXB0PjwvYT4g5Yqg5YWl6Zax6K6A5Zmo55qE6KiC6Zax5YWnPC9wPjxwPjxzY3JpcHQ+ZG9jdW1lbnQud3JpdGUoJzxpbWcgc3JjPVwiaHR0cHM6Ly9jaGFydC5hcGlzLmdvb2dsZS5jb20vY2hhcnQ/Y2h0PXFyJmNocz0zMDB4MzAwJmNobD0gJyArIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyAnL29wZHNcIi8+Jyk8L3NjcmlwdD48L3A+YClcbn0pO1xuXG5jb25zb2xlLmRlYnVnKGBzZXJ2ZXIgc2V0dXAgcmVhZHlgKTtcbmV4cG9ydCBkZWZhdWx0IGFwcFxuIl19