"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initHello = void 0;
const tslib_1 = require("tslib");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const use_1 = require("../use");
const fs_extra_1 = require("fs-extra");
const peer_1 = require("../peer");
const hello_1 = require("../pubsub/hello");
const types_1 = require("../types");
const connect_build_in_peers_1 = require("../util/connect-build-in-peers");
const index_1 = require("../pubsub/index");
const logger_1 = tslib_1.__importDefault(require("debug-color2/logger"));
const getMixinPeers_1 = require("../util/getMixinPeers");
const array_hyper_unique_1 = require("array-hyper-unique");
function initHello(ipfs) {
    return bluebird_1.default.resolve(ipfs)
        .then(async (ipfs) => {
        return bluebird_1.default.any([
            (0, connect_build_in_peers_1.connectBuildInPeers)(ipfs),
            (0, connect_build_in_peers_1.connectCachePeers)(ipfs),
            (0, connect_build_in_peers_1._connectPeers)(ipfs, (0, fs_extra_1.readFile)(getMixinPeers_1.cachePeersMixinFile).then(buf => (0, array_hyper_unique_1.array_unique)(buf.toString().split(/\s+/)).filter(Boolean)).catch(e => []), {
                hidden: true,
            }),
        ])
            .catch(e => null)
            .delay(60 * 1000)
            .tap(async () => logger_1.default.debug(`initHello:peer`, await (0, index_1.getPubsubPeers)(ipfs)))
            .then(() => ipfs !== null && ipfs !== void 0 ? ipfs : (0, use_1.getIPFS)())
            .tap((ipfs) => {
            return bluebird_1.default.any([
                (0, hello_1.pubsubPublishHello)(ipfs),
                (0, peer_1.connectPeersAll)(ipfs, (0, getMixinPeers_1.getMixinPeers)(ipfs), {
                    hidden: true,
                }),
            ]);
        })
            .tap(getMixinPeers_1.saveMixinPeersReduce)
            .delay(30 * 60 * 1000)
            .then(() => (0, use_1.getIPFS)())
            .tap(async (ipfs) => {
            if (ipfs) {
                return bluebird_1.default.allSettled([
                    (0, hello_1.pubsubPublishHello)(ipfs, types_1.EnumPubSubHello.HELLO_AGAIN, (0, getMixinPeers_1.getMixinPeers)(ipfs)),
                    logger_1.default.debug(`initHello:again`, await (0, index_1.getPubsubPeers)(ipfs)),
                ]);
            }
        });
    });
}
exports.initHello = initHello;
//# sourceMappingURL=initHello.js.map