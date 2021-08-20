"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const tslib_1 = require("tslib");
const http_1 = require("http");
const micro_1 = (0, tslib_1.__importDefault)(require("micro"));
const getPort_1 = (0, tslib_1.__importStar)(require("./lib/util/getPort"));
const ip_1 = (0, tslib_1.__importDefault)(require("./lib/ip"));
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const get_port_1 = (0, tslib_1.__importStar)(require("get-port"));
const use_1 = require("./lib/ipfs/use");
async function startServer(options = {}) {
    var _a;
    options = options || {};
    let { port } = options;
    if (options.proxy) {
        process.env.HTTP_PROXY = process.env.HTTPS_PROXY = options.proxy;
    }
    process.env.IPFS_DISPOSABLE = (_a = options.disposable) !== null && _a !== void 0 ? _a : process.env.IPFS_DISPOSABLE;
    if (typeof options.calibrePaths !== 'undefined') {
        process.env.CALIBRE_PATH = options.calibrePaths;
    }
    const web = await (0, http_1.createServer)((0, micro_1.default)(await Promise.resolve().then(() => (0, tslib_1.__importStar)(require('./server/index'))).then(m => m.default)));
    if (!options.port) {
        port = port || (0, getPort_1.default)((0, getPort_1.getPortEnv)());
        logger_1.default.debug(`[express]`, `port:init`, port);
        process.env.PORT = port = await (0, get_port_1.default)({
            port: (0, get_port_1.makeRange)(port, (port | 0) + 10),
        });
        logger_1.default.debug(`[express]`, `port:done`, port);
    }
    web.listen(port, async () => {
        await (0, ip_1.default)(port);
        (0, use_1.useIPFS)().catch(e => logger_1.default.error(`[IPFS]`, e)).tap(() => (0, use_1._info)());
    });
    return web;
}
exports.startServer = startServer;
exports.default = startServer;
//# sourceMappingURL=index.js.map