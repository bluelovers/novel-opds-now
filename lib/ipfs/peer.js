"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectPeersAll = exports.connectPeers = void 0;
const tslib_1 = require("tslib");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const pubsub_1 = require("./pubsub");
const multiaddr_1 = require("multiaddr");
const connectPeersCache = new Set();
async function connectPeers(ipfs, peerID, me, timeout, extra) {
    let peer_id = peerID;
    let _not_multiaddr = true;
    try {
        let m = (0, multiaddr_1.multiaddr)(peerID);
        peer_id = m.toString();
        _not_multiaddr = false;
    }
    catch (e) {
        peer_id = peerID;
    }
    if (connectPeersCache.has(peer_id)) {
        logger_1.default.debug(`[IPFS]`, `[connectPeers]:skip`, peerID);
        return;
    }
    return Promise.resolve(me !== null && me !== void 0 ? me : ipfs.id({
        timeout: 3000,
    }))
        .then(async (me) => {
        if ((me === null || me === void 0 ? void 0 : me.id) === peerID) {
            return;
        }
        let options = {
            timeout: timeout || 3 * 60 * 1000,
        };
        !(extra === null || extra === void 0 ? void 0 : extra.hidden) && logger_1.default.debug(`[IPFS]`, `[connectPeers]:start`, peerID);
        connectPeersCache.add(peer_id);
        return bluebird_1.default
            .any([
            _not_multiaddr && ipfs.swarm.connect(`/ip4/104.131.131.82/tcp/4001/p2p/${peerID}`, options),
            _not_multiaddr && ipfs.swarm.connect(`/p2p/${peerID}`, options),
            !_not_multiaddr && ipfs.swarm.connect(`/ip4/0.0.0.0/tcp/${peerID}`, options),
            ipfs.swarm.connect(`/ip4/0.0.0.0/tcp/4001/p2p/${peerID}`, options),
            ipfs.swarm.connect(`/ip4/0.0.0.0/tcp/4002/p2p/${peerID}`, options),
            !_not_multiaddr && ipfs.swarm.connect(`/ip4/0.0.0.0/tcp/4001/${peerID}`, options),
            !_not_multiaddr && ipfs.swarm.connect(`/ip4/0.0.0.0/tcp/4002/${peerID}`, options),
            ipfs.swarm.connect(peerID, options),
        ].filter(Boolean))
            .tap(e => {
            !(extra === null || extra === void 0 ? void 0 : extra.hidden) && logger_1.default.debug(`[IPFS]`, `[connectPeers]:end`, peerID, String(e));
        })
            .finally(() => {
            connectPeersCache.delete(peer_id);
        });
    })
        .catch(e => {
    });
}
exports.connectPeers = connectPeers;
function connectPeersAll(ipfs) {
    return bluebird_1.default
        .props({
        me: ipfs.id({
            timeout: 3000,
        }),
        peers: (0, pubsub_1.getPubsubPeers)(ipfs),
    })
        .then(data => {
        return bluebird_1.default.each(data.peers, async (peerID) => {
            return connectPeers(ipfs, peerID, data.me);
        });
    });
}
exports.connectPeersAll = connectPeersAll;
//# sourceMappingURL=peer.js.map