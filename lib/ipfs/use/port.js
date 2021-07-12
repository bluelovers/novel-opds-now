"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsedPorts = exports.isAvailablePort = exports.findFreeAddresses = exports.getPort2 = void 0;
const tslib_1 = require("tslib");
const addresses_1 = (0, tslib_1.__importStar)(require("ipfs-defaults/addresses"));
const net_1 = require("net");
const child_process_1 = require("child_process");
const usedPort = new Set(getUsedPorts());
const blacklistPort = new Set([
    4001,
    4002,
    5001,
    5002,
    8080,
    9090,
    3000,
]);
async function getPort2(options) {
    let port = await isAvailablePort(options.port).catch(e => null);
    if (!port) {
        port = options.port;
    }
    let start = port;
    while (!port || usedPort.has(port)) {
        start += 100;
        port = await isAvailablePort(start).catch(e => null);
        if (blacklistPort.has(port)) {
            port = null;
        }
    }
    usedPort.add(port);
    return port;
}
exports.getPort2 = getPort2;
async function findFreeAddresses(options) {
    getUsedPorts().forEach(port => usedPort.add(port));
    let ports = (0, addresses_1.getDefaultAddressesPorts)({}, options.type);
    let Swarm2 = 0;
    ports.Swarm = await getPort2({ port: ports.Swarm + Swarm2 });
    ports.API = await getPort2({ port: ports.API + Swarm2 });
    ports.Gateway = await getPort2({ port: ports.Gateway + Swarm2 });
    return {
        ...(0, addresses_1.default)(ports, options.type),
        Swarm: [
            `/ip4/0.0.0.0/tcp/${ports.Swarm}`,
            `/ip6/::/tcp/${ports.Swarm}`,
            `/ip4/0.0.0.0/udp/${ports.Swarm}/quic`,
            `/ip6/::/udp/${ports.Swarm}/quic`,
        ],
    };
}
exports.findFreeAddresses = findFreeAddresses;
function isAvailablePort(options) {
    return new Promise((resolve, reject) => {
        const server = (0, net_1.createServer)();
        server.unref();
        server.on('error', reject);
        server.listen(options, () => {
            const { port } = server.address();
            server.close(() => {
                resolve(port);
            });
        });
    });
}
exports.isAvailablePort = isAvailablePort;
function getUsedPorts() {
    let options = {
        start: 1,
        end: 65534,
        num: 1,
        ip: '0.0.0.0|127.0.0.1',
        _ipSpecial: '\\*|127.0.0.1',
        port: null
    };
    let stepIndex = 0, maxStep = 65536, freePort = null, res = '', portSplitStr = ':', reg = new RegExp(`\\s(${options.ip}):(\\d+)\\s`, 'g'), regSpecial = new RegExp(`\\s(${options._ipSpecial})\\.(\\d+)\\s`, 'g');
    res = (0, child_process_1.execSync)('netstat -an', {
        encoding: 'utf-8'
    });
    let usedPorts = res.match(reg);
    if (!usedPorts) {
        usedPorts = res.match(regSpecial);
        portSplitStr = '.';
    }
    return !usedPorts ? [] : usedPorts.map(item => {
        let port = item.split(portSplitStr);
        port = port.slice(-1)[0];
        return parseInt(port.slice(0, -1), 10);
    });
}
exports.getUsedPorts = getUsedPorts;
//# sourceMappingURL=port.js.map