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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
const get_port_1 = __importStar(require("get-port"));
const use_ipfs_1 = __importDefault(require("use-ipfs"));
const terminal_link_1 = __importDefault(require("terminal-link"));
const processExit_1 = require("./lib/processExit");
const pubsub_1 = require("./lib/ipfs/pubsub");
const computer_info_1 = __importDefault(require("computer-info"));
const package_json_1 = __importDefault(require("./package.json"));
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
        bluebird_1.default
            .resolve(use_ipfs_1.default())
            .tapCatch(e => {
            logger_1.default.error(`[IPFS]`, `無法啟動 IPFS，將無法連接至 IPFS 網路`, e);
        })
            .tap(async ({ ipfs, address, stop, }) => {
            await bluebird_1.default.props({
                id: ipfs.id(),
                version: ipfs.version(),
            })
                .then(data => {
                const { id, agentVersion, protocolVersion } = data.id;
                _info({
                    ipfs: {
                        id,
                        agentVersion,
                        protocolVersion,
                        version: data.version.version,
                    },
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
            .tap(() => {
            _info();
        });
    });
    return web;
}
exports.startServer = startServer;
exports.default = startServer;
function _info(data) {
    if (_info.disable) {
        return;
    }
    let { osystem, ram, cpu, arch, node, } = computer_info_1.default();
    logger_1.default.info({
        ...data,
        osystem,
        ram,
        cpu,
        arch,
        node,
        [package_json_1.default.name]: package_json_1.default.version,
    });
    _info.disable = true;
}
//# sourceMappingURL=index.js.map