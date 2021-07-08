"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectPeersAll = exports.connectPeers = exports.getPeers = exports.pubsubPublish = exports.pubsubPublishEpub = exports.pubsubPublishHello = exports.pubsubUnSubscribe = exports.pubsubSubscribe = exports.pubsubHandler = void 0;
const tslib_1 = require("tslib");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const pokeAll_1 = require("./pokeAll");
const mfs_1 = require("./mfs");
const use_1 = require("./use");
const EPUB_TOPIC = 'novel-opds-now';
const wssAddr = '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star';
async function pubsubHandler(msg) {
    const ipfs = await (0, use_1.getIPFS)().catch(e => null);
    if (!ipfs)
        return;
    const me = await ipfs.id().catch(e => null);
    try {
        const json = JSON.parse(Buffer.from(msg.data).toString());
        if (json) {
            if (msg.topicIDs.includes(EPUB_TOPIC)) {
                if (json.peerID && json.type) {
                    logger_1.default.debug(`[IPFS]`, `peer:online`, me.id === msg.from ? 'You!' : json.peerID);
                    await connectPeers(ipfs, json.peerID)
                        .catch(e => null);
                }
            }
            if (json.cid && (me === null || me === void 0 ? void 0 : me.id) !== msg.from) {
                logger_1.default.debug(`[IPFS]`, `pubsubHandler`, json);
                (0, pokeAll_1.pokeAll)(json.cid, ipfs)
                    .tap(settledResult => {
                    return (0, pokeAll_1.reportPokeAllSettledResult)(settledResult, json.cid, json.path);
                });
                if (json.siteID && json.novelID && json.path && json.size) {
                    (0, mfs_1.addMutableFileSystem)({
                        siteID: json.siteID,
                        novelID: json.novelID,
                        data: {
                            cid: json.cid,
                            path: json.path,
                            size: json.size,
                        }
                    });
                }
            }
        }
    }
    catch (e) {
        logger_1.default.debug(`[IPFS]`, `pubsubHandler:error`, Buffer.from(msg.data).toString(), e);
    }
    return connectPeers(ipfs, msg.from)
        .catch(e => null);
}
exports.pubsubHandler = pubsubHandler;
async function pubsubSubscribe(ipfs) {
    return ipfs
        .pubsub
        .subscribe(EPUB_TOPIC, pubsubHandler)
        .then(r => logger_1.default.debug(`[IPFS]`, `subscribed to ${EPUB_TOPIC}`))
        .catch(e => logger_1.default.warn(`[IPFS]`, `[pubsub.subscribe]`, String(e)));
}
exports.pubsubSubscribe = pubsubSubscribe;
async function pubsubUnSubscribe(ipfs) {
    return ipfs.pubsub.unsubscribe(EPUB_TOPIC, pubsubHandler)
        .then(r => logger_1.default.debug(`[IPFS]`, `unsubscribed from ${EPUB_TOPIC}`))
        .catch(e => logger_1.default.warn(`[IPFS]`, `[pubsub.unsubscribe]`, String(e)));
}
exports.pubsubUnSubscribe = pubsubUnSubscribe;
async function pubsubPublishHello(ipfs) {
    return ipfs.id()
        .then(data => {
        return Promise.all([
            connectPeers(ipfs, `12D3KooWEJeVsMMPWdnxHFMaU5uqggtULrF3gHxu15uW5scP8DTJ`),
            pubsubPublish(ipfs, {
                peerID: data.id,
                type: 1,
            })
        ]);
    });
}
exports.pubsubPublishHello = pubsubPublishHello;
async function pubsubPublishEpub(ipfs, { siteID, novelID, ...data }) {
    return pubsubPublish(ipfs, {
        ...data,
        siteID,
        novelID,
    });
}
exports.pubsubPublishEpub = pubsubPublishEpub;
async function pubsubPublish(ipfs, data) {
    if (data && !(data.peerID && data.type === 1)) {
        logger_1.default.debug(`[IPFS]`, `[pubsubPublish]`, data);
    }
    return Promise.resolve().then(() => {
        return ipfs
            .pubsub
            .publish(EPUB_TOPIC, Buffer.from(JSON.stringify(data)));
    })
        .catch(e => logger_1.default.warn(`[IPFS]`, `[pubsubPublish]`, String(e)));
}
exports.pubsubPublish = pubsubPublish;
async function getPeers(ipfs) {
    return ipfs.pubsub.peers(EPUB_TOPIC)
        .catch(e => {
        logger_1.default.warn(`[IPFS]`, `[pubsub.peers]`, String(e));
        return [];
    });
}
exports.getPeers = getPeers;
async function connectPeers(ipfs, peerID, me) {
    return Promise.resolve(me !== null && me !== void 0 ? me : ipfs.id({
        timeout: 3000
    }))
        .then(me => {
        let options = {
            timeout: 20 * 1000,
        };
        return (me.id && me.id !== peerID) && bluebird_1.default
            .any([
            ipfs.swarm.connect(`/ip4/104.131.131.82/tcp/4001/p2p/${peerID}`, options),
            ipfs.swarm.connect(`/ip4/123.456.78.90/tcp/4001/p2p/${peerID}`, options),
            ipfs.swarm.connect(`/p2p/${peerID}`, options),
        ]);
    })
        .catch(e => {
        logger_1.default.warn(`[IPFS]`, `[connectPeers]`, String(e));
    });
}
exports.connectPeers = connectPeers;
function connectPeersAll(ipfs) {
    return bluebird_1.default
        .props({
        me: ipfs.id({
            timeout: 3000,
        }),
        peers: getPeers(ipfs),
    })
        .then(data => {
        return bluebird_1.default.each(data.peers, async (peerID) => {
            return connectPeers(ipfs, peerID, data.me);
        });
    });
}
exports.connectPeersAll = connectPeersAll;
//# sourceMappingURL=pubsub.js.map