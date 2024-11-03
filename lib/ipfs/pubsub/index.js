"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EPUB_TOPIC = void 0;
exports.pubsubUnSubscribe = pubsubUnSubscribe;
exports.pubsubPublishEpub = pubsubPublishEpub;
exports.pubsubPublish = pubsubPublish;
exports.pubsubSubscribe = pubsubSubscribe;
exports.getPubsubPeers = getPubsubPeers;
const tslib_1 = require("tslib");
const logger_1 = tslib_1.__importDefault(require("debug-color2/logger"));
const handler_1 = require("./handler");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const get_mixin_peers_1 = require("@lazy-ipfs/get-mixin-peers");
exports.EPUB_TOPIC = 'novel-opds-now';
async function pubsubUnSubscribe(ipfs) {
    return ipfs.pubsub.unsubscribe(exports.EPUB_TOPIC, handler_1.pubsubHandler)
        .then(r => logger_1.default.debug(`[IPFS]`, `[pubsub.unsubscribe]`, `unsubscribed from ${exports.EPUB_TOPIC}`))
        .catch(e => logger_1.default.warn(`[IPFS]`, `[pubsub.unsubscribe]`, String(e)));
}
async function pubsubPublishEpub(ipfs, { siteID, novelID, ...data }, peers) {
    let msgData = {
        ...data,
        siteID,
        novelID,
    };
    msgData.data = {
        ...msgData.data,
        cid: msgData.data.cid.toString(),
    };
    return pubsubPublish(ipfs, msgData, peers);
}
async function pubsubPublish(ipfs, data, peers) {
    return Promise.resolve(peers).then((peers) => {
        if (data && !(data.peerID && data.type)) {
            logger_1.default.debug(`[IPFS]`, `[pubsubPublish]`, data, peers === null || peers === void 0 ? void 0 : peers.length);
        }
        return ipfs
            .pubsub
            .publish(exports.EPUB_TOPIC, Buffer.from(JSON.stringify({
            ...data,
            peers: peers !== null && peers !== void 0 ? peers : data.peers,
        })));
    })
        .catch(e => logger_1.default.warn(`[IPFS]`, `[pubsubPublish]`, String(e)));
}
function pubsubSubscribe(ipfs) {
    return bluebird_1.default.resolve(ipfs.pubsub.subscribe(exports.EPUB_TOPIC, handler_1.pubsubHandler))
        .then(r => logger_1.default.debug(`[IPFS]`, `[pubsub.subscribe]`, `subscribed to ${exports.EPUB_TOPIC}`))
        .catch(e => logger_1.default.warn(`[IPFS]`, `[pubsub.subscribe]`, String(e)));
}
function getPubsubPeers(ipfs) {
    return (0, get_mixin_peers_1.ipfsPubsubPeers)(ipfs, exports.EPUB_TOPIC)
        .catch(e => {
        return null;
    });
}
//# sourceMappingURL=index.js.map