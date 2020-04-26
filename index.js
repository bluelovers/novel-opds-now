"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const http_1 = require("http");
const micro_1 = __importDefault(require("micro"));
const getPort_1 = __importStar(require("./lib/getPort"));
const ip_1 = __importDefault(require("./lib/ip"));
const bluebird_1 = __importDefault(require("bluebird"));
const logger_1 = __importDefault(require("debug-color2/logger"));
const debounce_1 = __importDefault(require("lodash/debounce"));
const get_port_1 = __importStar(require("get-port"));
const use_ipfs_1 = __importDefault(require("use-ipfs"));
const terminal_link_1 = __importDefault(require("terminal-link"));
const processExit_1 = require("./lib/processExit");
const pubsub_1 = require("./lib/ipfs/pubsub");
async function startServer(options = {}) {
    options = options || {};
    let { port } = options;
    if (options.proxy) {
        process.env.HTTP_PROXY = process.env.HTTPS_PROXY = options.proxy;
    }
    const web = await http_1.createServer(micro_1.default(await Promise.resolve().then(() => __importStar(require('./server/index'))).then(m => m.default)));
    port = port || getPort_1.default(getPort_1.getPortEnv());
    port = await get_port_1.default({
        port: get_port_1.makeRange(port, (port | 0) + 10),
    });
    web.listen(port, async () => {
        ip_1.default(port);
        let _showIP = debounce_1.default(() => {
        }, 11 * 1000);
        _showIP();
        if (0) {
        }
        else {
            bluebird_1.default
                .resolve(use_ipfs_1.default())
                .tap(async ({ ipfs, address, stop, }) => {
                await bluebird_1.default.props({
                    id: ipfs.id(),
                    version: ipfs.version(),
                })
                    .then(data => {
                    const { id, agentVersion, protocolVersion } = data.id;
                    logger_1.default.debug({
                        id,
                        agentVersion,
                        protocolVersion,
                        version: data.version.version,
                    });
                })
                    .catch(e => logger_1.default.error(`[IPFS]`, e));
                logger_1.default.success(`IPFS Web UI available at`, terminal_link_1.default(`webui`, `https://dev.webui.ipfs.io/`));
                processExit_1.processExit(stop);
                await pubsub_1.pubsubSubscribe(ipfs)
                    .then(e => pubsub_1.connectPeersAll(ipfs))
                    .then(() => pubsub_1.pubsubPublishHello(ipfs))
                    .catch(e => logger_1.default.error(`[IPFS]`, e));
            })
                .catch(e => {
                logger_1.default.error(`[IPFS]`, e);
            })
                .tap(() => _showIP());
        }
    });
    return web;
}
exports.startServer = startServer;
exports.default = startServer;
//# sourceMappingURL=index.js.map