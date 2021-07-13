"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectBuildInPeers = void 0;
const tslib_1 = require("tslib");
const use_1 = require("../use");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const const_1 = require("../../const");
const peer_1 = require("../peer");
const bluebird_allsettled_1 = require("bluebird-allsettled");
const hello_1 = require("../pubsub/hello");
const types_1 = require("../types");
function connectBuildInPeers(ipfs) {
    return bluebird_1.default.props({
        ipfs: ipfs !== null && ipfs !== void 0 ? ipfs : (0, use_1.getIPFS)(),
        peers: (0, fs_extra_1.readFile)((0, path_1.join)(const_1.__root, 'lib/ipfs/build-in-peers.txt')),
    })
        .then(async ({ ipfs, peers, }) => {
        const me = await ipfs.id({ timeout: 3000 }).catch(e => null);
        return (0, bluebird_allsettled_1.allSettled)(peers.toString().split(/\s+/g).map(peer => peer && (0, peer_1.connectPeers)(ipfs, peer, me, 30 * 60 * 1000)))
            .tap(() => (0, hello_1.pubsubPublishHello)(ipfs))
            .delay(30 * 60 * 1000)
            .then(() => (0, use_1.getIPFS)())
            .then((ipfs) => ipfs && (0, hello_1.pubsubPublishHello)(ipfs, types_1.EnumPubSubHello.HELLO_AGAIN));
    });
}
exports.connectBuildInPeers = connectBuildInPeers;
//# sourceMappingURL=connect-build-in-peers.js.map