"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectPeersAll = exports._connectPeers = exports.connectPeers = exports.getPeerCacheKey = exports.peerAbortController = void 0;
const tslib_1 = require("tslib");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const pubsub_1 = require("./pubsub");
const multiaddr_1 = require("multiaddr");
const abort_controller_timer_1 = (0, tslib_1.__importDefault)(require("abort-controller-timer"));
const getMixinPeers_1 = require("./util/getMixinPeers");
const array_hyper_unique_1 = require("array-hyper-unique");
const connectPeersCache = new Set();
exports.peerAbortController = new abort_controller_timer_1.default();
exports.peerAbortController.on('abort', () => logger_1.default.debug(`[IPFS]`, `[connectPeers]`, `aborted`));
function getPeerCacheKey(peerID) {
    let peer_id = peerID;
    let _not_multiaddr = true;
    let peer_addr;
    try {
        peer_addr = (0, multiaddr_1.multiaddr)(peerID);
        peer_id = peer_addr.toString();
        _not_multiaddr = false;
    }
    catch (e) {
        peer_id = peerID;
    }
    return {
        peer_id,
        _not_multiaddr,
        peer_addr,
    };
}
exports.getPeerCacheKey = getPeerCacheKey;
async function connectPeers(ipfs, peerID, me, timeout, extra) {
    const { peer_id, _not_multiaddr } = getPeerCacheKey(peerID);
    if (connectPeersCache.has(peer_id)) {
        return;
    }
    return _connectPeers(ipfs, peerID, me !== null && me !== void 0 ? me : ipfs.id({
        timeout: 3000,
    }), timeout, extra);
}
exports.connectPeers = connectPeers;
async function _connectPeers(ipfs, peerID, me, timeout, extra, ...msg) {
    const { peer_id, _not_multiaddr, peer_addr } = getPeerCacheKey(peerID);
    connectPeersCache.add(peer_id);
    return Promise.resolve(me)
        .then(async (me) => {
        var _a;
        let id = me.id;
        let id2 = (_a = peer_addr === null || peer_addr === void 0 ? void 0 : peer_addr.getPeerId) === null || _a === void 0 ? void 0 : _a.call(peer_addr);
        connectPeersCache.add(peer_id);
        if (id === peerID || id2 === id || peer_id.includes(id) || peerID.includes(id)) {
            return;
        }
        const subAbortController = exports.peerAbortController.child(timeout || 3 * 60 * 1000);
        let options = {
            signal: subAbortController.signal,
        };
        !(extra === null || extra === void 0 ? void 0 : extra.hidden) && logger_1.default.debug(`[IPFS]`, `[connectPeers]:start`, peerID, ...msg);
        let list = (0, array_hyper_unique_1.array_unique_overwrite)([
            _not_multiaddr && `/p2p/${peerID}`,
            _not_multiaddr && `/ip4/0.0.0.0/tcp/4001/p2p/${peerID}`,
            _not_multiaddr && `/ip4/0.0.0.0/tcp/4002/p2p/${peerID}`,
            !_not_multiaddr && peerID,
        ].filter(Boolean));
        return bluebird_1.default
            .any(list.map(peerID => ipfs.swarm.connect(peerID, options)))
            .tap(e => {
            !(extra === null || extra === void 0 ? void 0 : extra.hidden) && logger_1.default.debug(`[IPFS]`, `[connectPeers]:end`, peerID, String(e), ...msg);
        })
            .finally(() => {
            subAbortController.abort();
        });
    })
        .catch(e => {
        !(extra === null || extra === void 0 ? void 0 : extra.hidden) && logger_1.default.warn(`[IPFS]`, `[connectPeers]`, peerID, String(e), ...msg);
    });
}
exports._connectPeers = _connectPeers;
function connectPeersAll(ipfs, peers, extra, ...msg) {
    return bluebird_1.default
        .props({
        me: ipfs.id(),
        peers,
        myPeers: (0, pubsub_1.getPubsubPeers)(ipfs),
    })
        .then(({ me, peers, myPeers, }) => {
        let id = me.id;
        if (!(peers === null || peers === void 0 ? void 0 : peers.length)) {
            return;
        }
        peers = (0, array_hyper_unique_1.array_unique_overwrite)(peers.map(String).filter(peerID => {
            var _a;
            const { peer_id, peer_addr } = getPeerCacheKey(peerID);
            const id2 = (_a = peer_addr === null || peer_addr === void 0 ? void 0 : peer_addr.getPeerId) === null || _a === void 0 ? void 0 : _a.call(peer_addr);
            if (myPeers.includes(peer_id) || myPeers.includes(peerID)) {
                return false;
            }
            else if (id2 === id || peer_id.includes(id) || peerID.includes(id)) {
                return false;
            }
            connectPeersCache.add(peer_id);
            return true;
        }));
        if (!(peers === null || peers === void 0 ? void 0 : peers.length)) {
            return;
        }
        return bluebird_1.default.mapSeries(peers, (peerID, index, length) => {
            return _connectPeers(ipfs, peerID, me, extra === null || extra === void 0 ? void 0 : extra.timeout, extra, `[${index}／${length}]`, ...msg);
        })
            .finally(getMixinPeers_1.saveMixinPeers);
    });
}
exports.connectPeersAll = connectPeersAll;
//# sourceMappingURL=peer.js.map