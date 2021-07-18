"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMixinPeers = void 0;
const tslib_1 = require("tslib");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const index_1 = require("../pubsub/index");
const array_hyper_unique_1 = require("array-hyper-unique");
const use_1 = require("../use");
function getMixinPeers(ipfs) {
    return bluebird_1.default.resolve(ipfs !== null && ipfs !== void 0 ? ipfs : (0, use_1.getIPFS)())
        .then((ipfs) => {
        return bluebird_1.default.props({
            pubsub: (0, index_1.getPubsubPeers)(ipfs).then(ret => ret || []),
            swarm: ipfs.swarm.peers().catch(e => []),
            addrs: ipfs.swarm.addrs().catch(e => []),
        }).then(data => {
            let arr = [];
            data.addrs = data.addrs.map(value => {
                return value.id;
            });
            data.swarm = data.swarm.map(value => {
                return value.peer;
            });
            return (0, array_hyper_unique_1.array_unique_overwrite)([...data.pubsub, ...data.swarm, ...arr].filter(Boolean).map(String));
        });
    });
}
exports.getMixinPeers = getMixinPeers;
//# sourceMappingURL=getMixinPeers.js.map