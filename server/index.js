"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const path_1 = require("path");
const file_1 = (0, tslib_1.__importDefault)(require("./file"));
const __root_1 = (0, tslib_1.__importDefault)(require("../lib/__root"));
const serve_favicon_1 = (0, tslib_1.__importDefault)(require("serve-favicon"));
require("./init");
const opds_1 = (0, tslib_1.__importDefault)(require("./opds"));
const search_1 = (0, tslib_1.__importDefault)(require("./search"));
const app = (0, express_1.default)();
app.use((0, serve_favicon_1.default)((0, path_1.join)(__root_1.default, 'static', 'favicon.png')));
app.use('/file', (0, file_1.default)());
app.use('/opds', (0, opds_1.default)());
app.use('/search', (0, search_1.default)());
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