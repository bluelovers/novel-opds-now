"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMixinPeers = exports.saveMixinPeersReduce = exports.saveMixinPeers = exports.cachePeersMixinFile = void 0;
const tslib_1 = require("tslib");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const index_1 = require("../pubsub/index");
const array_hyper_unique_1 = require("array-hyper-unique");
const use_1 = require("../use");
const throttle_1 = (0, tslib_1.__importDefault)(require("lodash/throttle"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const const_1 = require("../../const");
const debounce_1 = (0, tslib_1.__importDefault)(require("lodash/debounce"));
exports.cachePeersMixinFile = (0, path_1.join)(const_1.__root, 'test', '.peers.mixin.txt');
exports.saveMixinPeers = (0, debounce_1.default)((0, throttle_1.default)(() => {
    return (0, use_1.getIPFS)()
        .then(ipfs => ipfs && ipfs.swarm.peers()
        .then(peers => (0, fs_extra_1.appendFile)(exports.cachePeersMixinFile, `\n${peers.map(v => v.peer).join('\n')}\n`)))
        .catch(e => null)
        .finally(exports.saveMixinPeersReduce);
}, 30 * 60 * 1000), 60 * 1000);
exports.saveMixinPeersReduce = (0, debounce_1.default)(() => {
    return (0, fs_extra_1.readFile)((0, path_1.join)(const_1.__root, 'test', '.peers.mixin.txt'))
        .then(buf => (0, array_hyper_unique_1.array_unique)(buf.toString().split(/\s+/)).filter(Boolean))
        .then(peers => (0, fs_extra_1.outputFile)(exports.cachePeersMixinFile, `\n${peers.join('\n')}\n`))
        .catch(e => null);
}, 60 * 1000);
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
            return (0, array_hyper_unique_1.array_unique_overwrite)([...data.pubsub, ...data.swarm, data.addrs, ...arr].filter(Boolean).map(String));
        });
    });
}
exports.getMixinPeers = getMixinPeers;
//# sourceMappingURL=getMixinPeers.js.map