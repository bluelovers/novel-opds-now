"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectBuildInPeers = exports.connectCachePeers = exports._connectPeers = exports.getCachePeers = exports.getBuildInPeers = void 0;
const tslib_1 = require("tslib");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const const_1 = require("../../const");
const peer_1 = require("../peer");
const tmpPath_1 = require("../../util/tmpPath");
const handleCachePeersFile_1 = require("../../util/handleCachePeersFile");
const cache_1 = require("../pubsub/cache");
function getBuildInPeers() {
    return bluebird_1.default.resolve((0, fs_extra_1.readFile)((0, path_1.join)(const_1.__root, 'lib/static/build-in-peers.txt'))
        .then(buf => (0, handleCachePeersFile_1.handleCachePeersFile)(buf)));
}
exports.getBuildInPeers = getBuildInPeers;
function getCachePeers(force) {
    return bluebird_1.default.props({
        c1: (0, fs_extra_1.readFile)((0, path_1.join)((0, tmpPath_1.tmpPath)(), '.novel-opds-now.peers.txt')).catch(e => null),
        c2: (0, fs_extra_1.readFile)((0, path_1.join)(const_1.__root, '.cache', '.novel-opds-now.peers.txt')).catch(e => null),
    })
        .then(({ c1, c2, }) => {
        c1 = (c1 !== null && c1 !== void 0 ? c1 : '').toString();
        c2 = (c2 !== null && c2 !== void 0 ? c2 : '').toString();
        return (0, handleCachePeersFile_1.handleCachePeersFile)(c1 + '\n' + c2);
    })
        .tap(peers => {
        if (!force && !peers.filter(peer => !cache_1.cachePubSubPeers.has(peer)).length) {
            return;
        }
        let content = `\n${peers.join('\n')}\n`;
        return Promise.all([
            (0, fs_extra_1.outputFile)((0, path_1.join)((0, tmpPath_1.tmpPath)(), '.novel-opds-now.peers.txt'), content),
            (0, fs_extra_1.outputFile)((0, path_1.join)(const_1.__root, '.cache', '.novel-opds-now.peers.txt'), content),
        ]);
    });
}
exports.getCachePeers = getCachePeers;
function _connectPeers(ipfs, ls, extra) {
    return bluebird_1.default.resolve(ipfs)
        .then(async (ipfs) => {
        const me = await ipfs.id({ timeout: 3000 }).catch(e => null);
        return bluebird_1.default.resolve(ls).map(peer => {
            cache_1.cachePubSubPeers.add(peer);
            return (0, peer_1.connectPeers)(ipfs, peer, me, 30 * 60 * 1000, extra);
        }, {
            concurrency: 3,
        }).tap(ls => !(ls === null || ls === void 0 ? void 0 : ls.length) && Promise.reject(new Error(`peers is empty`)));
    });
}
exports._connectPeers = _connectPeers;
function connectCachePeers(ipfs) {
    return _connectPeers(ipfs, getCachePeers(), {
        hidden: true,
    });
}
exports.connectCachePeers = connectCachePeers;
function connectBuildInPeers(ipfs) {
    return _connectPeers(ipfs, getBuildInPeers(), {
        hidden: true,
    });
}
exports.connectBuildInPeers = connectBuildInPeers;
//# sourceMappingURL=connect-build-in-peers.js.map