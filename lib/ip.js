"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showIP = void 0;
const tslib_1 = require("tslib");
const address2_1 = (0, tslib_1.__importDefault)(require("address2"));
const qrcode_terminal_1 = (0, tslib_1.__importDefault)(require("qrcode-terminal"));
const terminal_link_1 = (0, tslib_1.__importDefault)(require("terminal-link"));
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const debug_color2_1 = (0, tslib_1.__importDefault)(require("debug-color2"));
const os_1 = require("os");
const url_1 = require("url");
function showIP(port) {
    logger_1.default.info(`如果不能連上伺服器的話\n請查詢自己的電腦IP\n或確認自己的防火牆與 wifi 設定\n或利用 ${(0, terminal_link_1.default)(`share-localhost`, `https://www.npmjs.com/package/share-localhost`)}\n這類工具來讓外部網路可以讀取自己內部網路的IP`);
    debug_color2_1.default.yellow.log(`\n請使用以下其中一個位址來連接至伺服器\n`);
    let ip = `localhost`;
    let href = (0, url_1.format)({
        protocol: 'http',
        hostname: ip,
        port,
        pathname: '/opds',
    });
    debug_color2_1.default.info((0, terminal_link_1.default)(ip, href));
    ip = (0, os_1.hostname)();
    href = (0, url_1.format)({
        protocol: 'http',
        hostname: ip,
        port,
        pathname: '/opds',
    });
    debug_color2_1.default.info((0, terminal_link_1.default)(ip, href));
    ip = (0, address2_1.default)();
    let interfaceName = ip;
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
        (ls.length ? ls : data)
            .forEach(v => {
            let ip = v.address;
            let href = (0, url_1.format)({
                protocol: 'http',
                hostname: ip,
                port,
                pathname: '/opds',
            });
            debug_color2_1.default.info((0, terminal_link_1.default)(name, href));
        });
    });
    if (ip != '127.0.0.1') {
        href = (0, url_1.format)({
            protocol: 'http',
            hostname: ip,
            port,
            pathname: '/opds',
        });
        debug_color2_1.default.log('');
        debug_color2_1.default.success((0, terminal_link_1.default)(interfaceName, href));
    }
    else {
        ip = `localhost`;
        href = (0, url_1.format)({
            protocol: 'http',
            hostname: ip,
            port,
            pathname: '/opds',
        });
    }
    qrcode_terminal_1.default.generate(href, { small: true });
}
exports.showIP = showIP;
exports.default = showIP;
//# sourceMappingURL=ip.js.map