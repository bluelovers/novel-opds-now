"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initHello = void 0;
const tslib_1 = require("tslib");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const use_1 = require("../use");
const hello_1 = require("../pubsub/hello");
const types_1 = require("../types");
const connect_build_in_peers_1 = require("../util/connect-build-in-peers");
function initHello(ipfs) {
    return bluebird_1.default.resolve(ipfs)
        .then(async (ipfs) => {
        return bluebird_1.default.any([
            (0, connect_build_in_peers_1.connectBuildInPeers)(ipfs),
            (0, connect_build_in_peers_1.connectCachePeers)(ipfs),
        ])
            .catch(e => null)
            .then(() => (0, use_1.getIPFS)())
            .tap((ipfs) => (0, hello_1.pubsubPublishHello)(ipfs))
            .delay(30 * 60 * 1000)
            .then(() => (0, use_1.getIPFS)())
            .then((ipfs) => ipfs && (0, hello_1.pubsubPublishHello)(ipfs, types_1.EnumPubSubHello.HELLO_AGAIN));
    });
}
exports.initHello = initHello;
//# sourceMappingURL=initHello.js.map