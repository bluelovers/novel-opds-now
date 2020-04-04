"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectPeersAll = exports.connectPeers = exports.getPeers = exports.pubsubPublish = exports.pubsubPublishHello = exports.pubsubUnSubscribe = exports.pubsubSubscribe = exports.pubsubHandler = void 0;
const bluebird_1 = __importDefault(require("bluebird"));
const logger_1 = __importDefault(require("debug-color2/logger"));
const use_ipfs_1 = __importDefault(require("use-ipfs"));
const is_ipfs_1 = require("is-ipfs");
const EPUB_TOPIC = 'novel-opds-now';
const wssAddr = '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star';
async function pubsubHandler(msg) {
    const { ipfs } = await use_ipfs_1.default()
        .catch(e => null);
    if (!ipfs)
        return;
    const me = await ipfs.id().catch(e => null);
    try {
        const json = JSON.parse(msg.data.toString());
        if (json) {
            if (msg.topicIDs.includes(EPUB_TOPIC)) {
                if (json.peerID && json.type) {
                    await connectPeers(ipfs, json.peerID)
                        .catch(e => null);
                }
            }
            if (json.cid && (me === null || me === void 0 ? void 0 : me.id) !== msg.from) {
                const res = await ipfs
                    .resolve((is_ipfs_1.cid(json.cid) ? '/ipfs/' : '') + json.cid)
                    .catch(e => null);
            }
        }
    }
    catch (e) {
    }
    return connectPeers(ipfs, msg.from)
        .catch(e => null);
}
exports.pubsubHandler = pubsubHandler;
async function pubsubSubscribe(ipfs) {
    const AddressesSwarm = await ipfs.config.get('Addresses.Swarm')
        .catch(e => {
        return [];
    });
    if (!AddressesSwarm.includes(wssAddr)) {
        AddressesSwarm.push(wssAddr);
        await ipfs.config.set('Addresses.Swarm', AddressesSwarm);
    }
    return ipfs
        .pubsub
        .subscribe(EPUB_TOPIC, pubsubHandler)
        .then(r => logger_1.default.debug(`subscribed to ${EPUB_TOPIC}`))
        .catch(e => logger_1.default.warn(`[pubsub.subscribe]`, e));
}
exports.pubsubSubscribe = pubsubSubscribe;
async function pubsubUnSubscribe(ipfs) {
    return ipfs.pubsub.unsubscribe(EPUB_TOPIC, pubsubHandler)
        .then(r => logger_1.default.debug(`unsubscribed from ${EPUB_TOPIC}`))
        .catch(e => logger_1.default.warn(`[pubsub.unsubscribe]`, e));
}
exports.pubsubUnSubscribe = pubsubUnSubscribe;
async function pubsubPublishHello(ipfs) {
    return ipfs.id()
        .then(data => {
        return pubsubPublish(ipfs, {
            peerID: data.id,
            type: 1,
        });
    });
}
exports.pubsubPublishHello = pubsubPublishHello;
async function pubsubPublish(ipfs, data) {
    return ipfs
        .pubsub
        .publish(EPUB_TOPIC, Buffer.from(JSON.stringify(data)))
        .catch(e => logger_1.default.error(`[pubsubPublish]`, e));
}
exports.pubsubPublish = pubsubPublish;
async function getPeers(ipfs) {
    return ipfs.pubsub.peers(EPUB_TOPIC)
        .catch(e => {
        logger_1.default.warn(`[pubsub.peers]`, e);
        return [];
    });
}
exports.getPeers = getPeers;
async function connectPeers(ipfs, peerID) {
    return ipfs.id()
        .then(me => {
        return (me.id !== peerID) && bluebird_1.default
            .any([
            ipfs.swarm.connect(`/dns4/ws-star-signal-1.servep2p.com/tcp/443/wss/p2p-websocket-star/ipfs/${peerID}`)
                .catch(e => {
                if (String(e).includes('unknown protocol wss')) {
                    return;
                }
                logger_1.default.warn(`[connectPeers]`, e);
            }),
            ipfs.swarm.connect(`/p2p-circuit/ipfs/${peerID}`)
                .catch(e => logger_1.default.warn(`[connectPeers]`, e)),
        ])
            .catch(e => {
            logger_1.default.error(`[connectPeers]`, e);
        });
    });
}
exports.connectPeers = connectPeers;
function connectPeersAll(ipfs) {
    return bluebird_1.default
        .each(getPeers(ipfs), async (peerID) => {
        return connectPeers(ipfs, peerID);
    });
}
exports.connectPeersAll = connectPeersAll;
//# sourceMappingURL=pubsub.js.map