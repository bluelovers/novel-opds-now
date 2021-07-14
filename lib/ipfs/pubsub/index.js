"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPubsubPeers = exports.pubsubSubscribe = exports.pubsubPublish = exports.pubsubPublishEpub = exports.pubsubUnSubscribe = exports.EPUB_TOPIC = void 0;
const tslib_1 = require("tslib");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const handler_1 = require("./handler");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
exports.EPUB_TOPIC = 'novel-opds-now';
async function pubsubUnSubscribe(ipfs) {
    return ipfs.pubsub.unsubscribe(exports.EPUB_TOPIC, handler_1.pubsubHandler)
        .then(r => logger_1.default.debug(`[IPFS]`, `[pubsub.unsubscribe]`, `unsubscribed from ${exports.EPUB_TOPIC}`))
        .catch(e => logger_1.default.warn(`[IPFS]`, `[pubsub.unsubscribe]`, String(e)));
}
exports.pubsubUnSubscribe = pubsubUnSubscribe;
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
exports.pubsubPublishEpub = pubsubPublishEpub;
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
exports.pubsubPublish = pubsubPublish;
function pubsubSubscribe(ipfs) {
    return bluebird_1.default.resolve(ipfs.pubsub.subscribe(exports.EPUB_TOPIC, handler_1.pubsubHandler))
        .then(r => logger_1.default.debug(`[IPFS]`, `[pubsub.subscribe]`, `subscribed to ${exports.EPUB_TOPIC}`))
        .catch(e => logger_1.default.warn(`[IPFS]`, `[pubsub.subscribe]`, String(e)));
}
exports.pubsubSubscribe = pubsubSubscribe;
async function getPubsubPeers(ipfs) {
    return ipfs.pubsub.peers(exports.EPUB_TOPIC)
        .catch(e => {
        return null;
    });
}
exports.getPubsubPeers = getPubsubPeers;
//# sourceMappingURL=index.js.map