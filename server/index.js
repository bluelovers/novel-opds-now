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
app.use('/.status', (req, res, next) => {
    console.log(req.headers);
    let url;
    try {
        url = new URL('/opds', req.headers.host).href;
    }
    catch (e) { }
    ;
    if (!url) {
        url = (req.headers.host || '') + '/opds';
    }
    return res.json({
        timestamp: Date.now(),
        live: true,
        opds: url,
        opds_qr: 'https://chart.apis.google.com/chart?cht=qr&chs=300x300&chl=' + url,
    });
});
app.use('/*', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.charset = 'utf-8';
    let html = `<meta charset="utf-8"/><script src="/gun.js"><script src="/gun/lib/webrtc.js"></script><script>var gun = Gun(["https://gunjs.herokuapp.com/gun","http://nmr.io:8765/gun",window.location.origin + '/gun']);</script>`;
    res.end(`${html}Welcome to micro<p>請將 <a href="/opds"><script>document.write(window.location.origin + '/opds')</script></a> 加入閱讀器的訂閱內</p><p><script>document.write('<img src="https://chart.apis.google.com/chart?cht=qr&chs=300x300&chl=' + window.location.origin + '/opds"/>')</script></p>`);
});
console.debug(`server setup ready`);
exports.default = app;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUlBLHNEQUE4QjtBQUk5QiwrQkFBc0M7QUFNdEMsa0RBQWlDO0FBQ2pDLDJEQUFtQztBQUNuQyxrRUFBb0M7QUFHcEMsa0JBQWdCO0FBQ2hCLGtEQUFpQztBQUNqQywwREFBcUM7QUFHckMsTUFBTSxHQUFHLEdBQUcsaUJBQU8sRUFBRSxDQUFDO0FBRXRCLEdBQUcsQ0FBQyxHQUFHLENBQUMsZUFBUSxDQUFDLENBQUM7QUFFbEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyx1QkFBTyxDQUFDLFdBQUksQ0FBQyxnQkFBTSxFQUFFLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFeEQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsY0FBVyxFQUFFLENBQUMsQ0FBQztBQUNoQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxjQUFXLEVBQUUsQ0FBQyxDQUFDO0FBRWhDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRTtJQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMxRCxJQUFJLEVBQUUsQ0FBQztBQUNSLENBQUMsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO0lBRXRDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBRXhCLElBQUksR0FBVyxDQUFDO0lBRWhCLElBQ0E7UUFDQyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDO0tBQzlDO0lBQ0QsT0FBTyxDQUFDLEVBQUUsR0FBRTtJQUFBLENBQUM7SUFFYixJQUFJLENBQUMsR0FBRyxFQUNSO1FBQ0MsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFBO0tBQ3hDO0lBRUQsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDO1FBQ2YsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7UUFDckIsSUFBSSxFQUFFLElBQUk7UUFDVixJQUFJLEVBQUUsR0FBRztRQUNULE9BQU8sRUFBRSw2REFBNkQsR0FBRyxHQUFHO0tBQzVFLENBQUMsQ0FBQTtBQUVILENBQUMsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7SUFFMUIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsRUFBQyxjQUFjLEVBQUUsMEJBQTBCLEVBQUMsQ0FBQyxDQUFDO0lBQ2pFLEdBQUcsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBRXRCLElBQUksSUFBSSxHQUFHLHNOQUFzTixDQUFDO0lBRWxPLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLGdSQUFnUixDQUFDLENBQUE7QUFDalMsQ0FBQyxDQUFDLENBQUM7QUFFSCxPQUFPLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDcEMsa0JBQWUsR0FBRyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8xLzI4LlxuICovXG5pbXBvcnQgbWljcm8sIHsgUmVxdWVzdEhhbmRsZXIsIGJ1ZmZlciwgdGV4dCwganNvbiB9IGZyb20gJ21pY3JvJztcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgRW51bU5vdmVsU2l0ZUxpc3QgfSBmcm9tICdub3ZlbC1kb3dubG9hZGVyL3NyYy9hbGwvY29uc3QnO1xuaW1wb3J0IHsgc3Bhd25TeW5jIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgeyByZWFkSlNPTiwgcmVhZEpTT05TeW5jLCByZWFkRmlsZSwgcmVtb3ZlLCB3cml0ZUpTT04gfSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgeyBqb2luLCBiYXNlbmFtZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHsgSUNhY2hlTWFwIH0gZnJvbSAnLi4vbGliL3R5cGVzJztcbmltcG9ydCB7IFBhc3NUaHJvdWdoIH0gZnJvbSAnc3RyZWFtJztcbmltcG9ydCB7IGZyb21CdWZmZXIgfSBmcm9tICdmaWxlLXR5cGUnO1xuaW1wb3J0IHsgX19jYWNoZU1hcEZpbGUgfSBmcm9tICcuLi9saWIvY29uc3QnO1xuaW1wb3J0IGZpbGVIYW5kbGVyIGZyb20gJy4vZmlsZSc7XG5pbXBvcnQgX19yb290IGZyb20gJy4uL2xpYi9fX3Jvb3QnO1xuaW1wb3J0IGZhdmljb24gZnJvbSAnc2VydmUtZmF2aWNvbic7XG5pbXBvcnQgeyBzZXR1cEd1biB9IGZyb20gJy4vZ3VuL3NldHVwJztcblxuaW1wb3J0ICcuL2luaXQnO1xuaW1wb3J0IG9wZHNIYW5kbGVyIGZyb20gJy4vb3Bkcyc7XG5pbXBvcnQgZ3VuU2VydmUgZnJvbSAnZ3VuL2xpYi9zZXJ2ZSc7XG5pbXBvcnQgZ3VuSHR0cCBmcm9tICdndW4vbGliL2h0dHAnO1xuXG5jb25zdCBhcHAgPSBleHByZXNzKCk7XG5cbmFwcC51c2UoZ3VuU2VydmUpO1xuLy9hcHAudXNlKCcvZ3VuJywgZ3VuSHR0cCk7XG5hcHAudXNlKGZhdmljb24oam9pbihfX3Jvb3QsICdzdGF0aWMnLCAnZmF2aWNvbi5wbmcnKSkpO1xuXG5hcHAudXNlKCcvZmlsZScsIGZpbGVIYW5kbGVyKCkpO1xuYXBwLnVzZSgnL29wZHMnLCBvcGRzSGFuZGxlcigpKTtcblxuYXBwLnVzZSgnLyonLCAocmVxLCByZXMsIG5leHQpID0+IHtcblx0Y29uc29sZS5sb2cocmVxLm1ldGhvZCwgcmVxLmJhc2VVcmwsIHJlcS51cmwsIHJlcS5wYXJhbXMpO1xuXHRuZXh0KCk7XG59KTtcblxuYXBwLnVzZSgnLy5zdGF0dXMnLCAocmVxLCByZXMsIG5leHQpID0+IHtcblxuXHRjb25zb2xlLmxvZyhyZXEuaGVhZGVycylcblxuXHRsZXQgdXJsOiBzdHJpbmc7XG5cblx0dHJ5XG5cdHtcblx0XHR1cmwgPSBuZXcgVVJMKCcvb3BkcycsIHJlcS5oZWFkZXJzLmhvc3QpLmhyZWY7XG5cdH1cblx0Y2F0Y2ggKGUpIHt9O1xuXG5cdGlmICghdXJsKVxuXHR7XG5cdFx0dXJsID0gKHJlcS5oZWFkZXJzLmhvc3QgfHwgJycpICsgJy9vcGRzJ1xuXHR9XG5cblx0cmV0dXJuIHJlcy5qc29uKHtcblx0XHR0aW1lc3RhbXA6IERhdGUubm93KCksXG5cdFx0bGl2ZTogdHJ1ZSxcblx0XHRvcGRzOiB1cmwsXG5cdFx0b3Bkc19xcjogJ2h0dHBzOi8vY2hhcnQuYXBpcy5nb29nbGUuY29tL2NoYXJ0P2NodD1xciZjaHM9MzAweDMwMCZjaGw9JyArIHVybCxcblx0fSlcblxufSk7XG5cbmFwcC51c2UoJy8qJywgKHJlcSwgcmVzKSA9PiB7XG5cblx0cmVzLndyaXRlSGVhZCgyMDAsIHsnQ29udGVudC1UeXBlJzogJ3RleHQvaHRtbDsgY2hhcnNldD11dGYtOCd9KTtcblx0cmVzLmNoYXJzZXQgPSAndXRmLTgnO1xuXG5cdGxldCBodG1sID0gYDxtZXRhIGNoYXJzZXQ9XCJ1dGYtOFwiLz48c2NyaXB0IHNyYz1cIi9ndW4uanNcIj48c2NyaXB0IHNyYz1cIi9ndW4vbGliL3dlYnJ0Yy5qc1wiPjwvc2NyaXB0PjxzY3JpcHQ+dmFyIGd1biA9IEd1bihbXCJodHRwczovL2d1bmpzLmhlcm9rdWFwcC5jb20vZ3VuXCIsXCJodHRwOi8vbm1yLmlvOjg3NjUvZ3VuXCIsd2luZG93LmxvY2F0aW9uLm9yaWdpbiArICcvZ3VuJ10pOzwvc2NyaXB0PmA7XG5cblx0cmVzLmVuZChgJHtodG1sfVdlbGNvbWUgdG8gbWljcm88cD7oq4vlsIcgPGEgaHJlZj1cIi9vcGRzXCI+PHNjcmlwdD5kb2N1bWVudC53cml0ZSh3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgJy9vcGRzJyk8L3NjcmlwdD48L2E+IOWKoOWFpemWseiugOWZqOeahOiogumWseWFpzwvcD48cD48c2NyaXB0PmRvY3VtZW50LndyaXRlKCc8aW1nIHNyYz1cImh0dHBzOi8vY2hhcnQuYXBpcy5nb29nbGUuY29tL2NoYXJ0P2NodD1xciZjaHM9MzAweDMwMCZjaGw9JyArIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyAnL29wZHNcIi8+Jyk8L3NjcmlwdD48L3A+YClcbn0pO1xuXG5jb25zb2xlLmRlYnVnKGBzZXJ2ZXIgc2V0dXAgcmVhZHlgKTtcbmV4cG9ydCBkZWZhdWx0IGFwcFxuIl19