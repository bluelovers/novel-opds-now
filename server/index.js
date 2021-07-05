"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const path_1 = require("path");
const file_1 = (0, tslib_1.__importDefault)(require("./file"));
const __root_1 = (0, tslib_1.__importDefault)(require("../lib/__root"));
const serve_favicon_1 = (0, tslib_1.__importDefault)(require("serve-favicon"));
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
require("./init");
const opds_1 = (0, tslib_1.__importDefault)(require("./opds"));
const search_1 = (0, tslib_1.__importDefault)(require("./search"));
const request_ip_1 = require("request-ip");
const express_useragent_1 = (0, tslib_1.__importDefault)(require("express-useragent"));
const showClient_1 = require("./util/showClient");
const app = (0, express_1.default)();
app.use((0, serve_favicon_1.default)((0, path_1.join)(__root_1.default, 'static', 'favicon.png')));
app.use((0, request_ip_1.mw)());
app.use(express_useragent_1.default.express());
app.use('/file', (0, file_1.default)());
app.use('/opds', (0, opds_1.default)());
app.use('/search', (0, search_1.default)());
app.use('/*', (req, res, next) => {
    logger_1.default.log(req.method, req.baseUrl, req.url, req.params, req.query);
    (0, showClient_1.showClient)(req, res, next);
    next();
});
app.use('/.status', (req, res, next) => {
    logger_1.default.log(req.headers);
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
logger_1.default.debug(`server setup ready`);
exports.default = app;
//# sourceMappingURL=index.js.map