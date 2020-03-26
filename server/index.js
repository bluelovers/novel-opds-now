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
const search_1 = __importDefault(require("./search"));
const app = express_1.default();
app.use(serve_favicon_1.default(path_1.join(__root_1.default, 'static', 'favicon.png')));
app.use('/file', file_1.default());
app.use('/opds', opds_1.default());
app.use('/search', search_1.default());
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
    let html = '';
    res.end(`${html}Welcome to micro<p>請將 <a href="/opds"><script>document.write(window.location.origin + '/opds')</script></a> 加入閱讀器的訂閱內</p><p><script>document.write('<img src="https://chart.apis.google.com/chart?cht=qr&chs=300x300&chl=' + window.location.origin + '/opds"/>')</script></p>`);
});
console.debug(`server setup ready`);
exports.default = app;
//# sourceMappingURL=index.js.map