"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectPeersAll = exports._connectPeers = exports.connectPeers = exports.getPeerCacheKey = exports.peerAbortController = void 0;
const tslib_1 = require("tslib");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const multiaddr_1 = require("multiaddr");
const abort_controller_timer_1 = (0, tslib_1.__importDefault)(require("abort-controller-timer"));
const getMixinPeers_1 = require("./util/getMixinPeers");
const array_hyper_unique_1 = require("array-hyper-unique");
const connectPeersCache = new Set();
exports.peerAbortController = new abort_controller_timer_1.default();
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
async function _connectPeers(ipfs, peerID, me, timeout, extra) {
    const { peer_id, _not_multiaddr, peer_addr } = getPeerCacheKey(peerID);
    return Promise.resolve(me)
        .then(async (me) => {
        var _a;
        let id = me.id;
        let id2 = (_a = peer_addr === null || peer_addr === void 0 ? void 0 : peer_addr.getPeerId) === null || _a === void 0 ? void 0 : _a.call(peer_addr);
        if (id === peerID || id2 === id || peer_id.includes(id) || peerID.includes(id)) {
            return;
        }
        const subAbortController = new abort_controller_timer_1.default(timeout || 3 * 60 * 1000);
        let options = {
            timeout: timeout || 3 * 60 * 1000,
            signal: subAbortController.signal,
        };
        !(extra === null || extra === void 0 ? void 0 : extra.hidden) && logger_1.default.debug(`[IPFS]`, `[connectPeers]:start`, peerID);
        connectPeersCache.add(peer_id);
        const fn = () => {
            try {
                subAbortController.abort();
            }
            catch (e) { }
            subAbortController.clear();
        };
        exports.peerAbortController.on('abort', fn);
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
            fn();
            exports.peerAbortController.off('abort', fn);
            connectPeersCache.delete(peer_id);
        });
    })
        .catch(e => {
    });
}
exports._connectPeers = _connectPeers;
function connectPeersAll(ipfs, peers, extra) {
    return bluebird_1.default
        .props({
        me: ipfs.id(),
        peers,
        myPeers: (0, getMixinPeers_1.getMixinPeers)(ipfs),
    })
        .then(({ me, peers, myPeers, }) => {
        let id = me.id;
        if (!(peers === null || peers === void 0 ? void 0 : peers.length)) {
            return;
        }
        peers = (0, array_hyper_unique_1.array_unique_overwrite)(peers.map(String).filter(peerID => {
            var _a;
            const { peer_id, peer_addr } = getPeerCacheKey(peerID);
            if (myPeers.includes(peer_id) || myPeers.includes(peerID)) {
                return false;
            }
            else if (((_a = peer_addr === null || peer_addr === void 0 ? void 0 : peer_addr.getPeerId) === null || _a === void 0 ? void 0 : _a.call(peer_addr)) === id || peer_id.includes(id) || peerID.includes(id)) {
                return false;
            }
            connectPeersCache.add(peer_id);
            return true;
        }));
        if (!(peers === null || peers === void 0 ? void 0 : peers.length)) {
            return;
        }
        return bluebird_1.default.map(peers, async (peerID) => {
            return _connectPeers(ipfs, peerID, me, extra === null || extra === void 0 ? void 0 : extra.timeout, extra);
        }, {
            concurrency: 3,
        });
    });
}
exports.connectPeersAll = connectPeersAll;
//# sourceMappingURL=peer.js.map