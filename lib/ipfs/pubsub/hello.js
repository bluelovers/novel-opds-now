"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pubsubPublishHello = void 0;
const tslib_1 = require("tslib");
const index_1 = require("./index");
const types_1 = require("../types");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
function pubsubPublishHello(ipfs, helloType, peers) {
    return bluebird_1.default.props({
        me: ipfs.id(),
        pubsubPeers: peers !== null && peers !== void 0 ? peers : (0, index_1.getPubsubPeers)(ipfs),
    })
        .then(({ me, pubsubPeers, }) => {
        helloType !== null && helloType !== void 0 ? helloType : (helloType = types_1.EnumPubSubHello.HELLO);
        logger_1.default.yellow.info(`[IPFS]`, `peer:hello`, `${types_1.EnumPubSubHello[helloType]}:${helloType}`, pubsubPeers === null || pubsubPeers === void 0 ? void 0 : pubsubPeers.length);
        return (0, index_1.pubsubPublish)(ipfs, {
            peerID: me.id,
            type: helloType,
            peers: pubsubPeers,
        });
    });
}
exports.pubsubPublishHello = pubsubPublishHello;
//# sourceMappingURL=hello.js.map