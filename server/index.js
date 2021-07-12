"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const path_1 = require("path");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const file_1 = (0, tslib_1.__importDefault)(require("./file"));
const __root_1 = (0, tslib_1.__importDefault)(require("../lib/__root"));
const serve_favicon_1 = (0, tslib_1.__importDefault)(require("serve-favicon"));
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
require("./init");
const opds_1 = (0, tslib_1.__importDefault)(require("./opds"));
const search_1 = (0, tslib_1.__importDefault)(require("./search"));
const request_ip_1 = require("request-ip");
const express_useragent_1 = require("express-useragent");
const showClient_1 = require("./util/showClient");
const use_1 = require("../lib/ipfs/use");
const ip_1 = require("../lib/ip");
const os_1 = require("os");
const url_1 = require("url");
const address2_1 = (0, tslib_1.__importDefault)(require("address2"));
const poke_1 = (0, tslib_1.__importDefault)(require("./router/poke"));
const index_1 = require("../lib/ipfs/pubsub/index");
const app = (0, express_1.default)();
app.use((0, serve_favicon_1.default)((0, path_1.join)(__root_1.default, 'static', 'favicon.png')));
app.use((0, request_ip_1.mw)());
app.use((0, express_useragent_1.express)());
app.use('/file', (0, file_1.default)());
app.use('/opds', (0, opds_1.default)());
app.use('/search', (0, search_1.default)());
app.use('/poke', (0, poke_1.default)());
app.use('/*', (req, res, next) => {
    logger_1.default.log(req.method, req.baseUrl, req.url, req.params, req.query);
    (0, showClient_1.showClient)(req, res, next);
    next();
});
app.use('/.status', async (req, res, next) => {
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
    let isLocal = await Promise.resolve().then(() => (0, ip_1.isLocalNetwork)(req.clientIp)).catch(e => null);
    let interfaces = isLocal && Promise.resolve().then(() => {
        let ip = (0, address2_1.default)();
        let interfaceName = ip;
        let port = process.env.PORT;
        let interfaces = (0, os_1.networkInterfaces)();
        Object.entries(interfaces)
            .forEach(([name, data]) => {
            let _skip = false;
            data = data
                .filter(v => {
                if (ip && v.address === ip) {
                    interfaceName = name;
                    _skip = true;
                }
                else if (v.address === '127.0.0.1' || v.address === '::1') {
                    _skip = true;
                }
                return v.address && !_skip;
            });
            if (_skip) {
                return;
            }
            let ls = data
                .filter(v => {
                return v.family === 'IPv4';
            });
            return (ls.length ? ls : data)
                .forEach(v => {
                let ip = v.address;
                return (0, url_1.format)({
                    protocol: 'http',
                    hostname: ip,
                    port,
                    pathname: '/opds',
                });
            });
        });
        return interfaces;
    }).catch(e => null);
    let ipfs = await (0, use_1.useIPFS)().timeout(3000).then(_cache => {
        return bluebird_1.default.props({
            id: _cache.ipfs.id({
                timeout: 3000,
            }).then(v => {
                let { id, agentVersion, protocolVersion } = v;
                return {
                    id, agentVersion, protocolVersion
                };
            }).catch(e => null),
            version: _cache.ipfs.version({
                timeout: 3000,
            }).catch(e => null),
            address: isLocal && bluebird_1.default.resolve(_cache.address()).timeout(3000).catch(e => null),
            pubsub: (0, index_1.getPubsubPeers)(_cache.ipfs),
        });
    }).catch(e => null);
    return res.json({
        timestamp: Date.now(),
        live: true,
        opds: url,
        opds_qr: 'https://chart.apis.google.com/chart?cht=qr&chs=300x300&chl=' + url,
        ipfs: await ipfs,
        interfaces: await interfaces,
        user: {
            client: req.clientIp,
            useragent: req.useragent,
            headers: req.headers,
        },
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