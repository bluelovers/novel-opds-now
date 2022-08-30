"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMixinPeers = exports.saveMixinPeersReduce = exports.saveMixinPeers = exports.cachePeersMixinFile = void 0;
const tslib_1 = require("tslib");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const index_1 = require("../pubsub/index");
const array_hyper_unique_1 = require("array-hyper-unique");
const use_1 = require("../use");
const throttle_1 = tslib_1.__importDefault(require("lodash/throttle"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const const_1 = require("../../const");
const debounce_1 = tslib_1.__importDefault(require("lodash/debounce"));
const get_mixin_peers_1 = require("@lazy-ipfs/get-mixin-peers");
exports.cachePeersMixinFile = (0, path_1.join)(const_1.__root, 'test', '.peers.mixin.txt');
exports.saveMixinPeers = (0, debounce_1.default)((0, throttle_1.default)(() => {
    return (0, use_1.getIPFS)()
        .then(ipfs => ipfs && ipfs.swarm.peers()
        .then(peers => (0, fs_extra_1.appendFile)(exports.cachePeersMixinFile, `\n${peers.map(v => v.peer).join('\n')}\n`)))
        .catch(e => null)
        .finally(exports.saveMixinPeersReduce);
}, 60 * 60 * 1000), 60 * 1000);
exports.saveMixinPeersReduce = (0, debounce_1.default)(() => {
    return (0, fs_extra_1.readFile)((0, path_1.join)(const_1.__root, 'test', '.peers.mixin.txt'))
        .then(buf => {
        let peers = buf.toString().split(/\s+/).filter(Boolean);
        let old = peers.length;
        (0, array_hyper_unique_1.array_unique_overwrite)(peers, {
            removeFromFirst: true,
        });
        if (peers.length != old) {
            if (peers.length > 6000) {
                peers = peers.slice(peers.length - 3000);
            }
            return (0, fs_extra_1.outputFile)(exports.cachePeersMixinFile, `\n${peers.join('\n')}\n`);
        }
    })
        .catch(e => null);
}, 5 * 60 * 1000);
function getMixinPeers(ipfs) {
    return bluebird_1.default.resolve(ipfs !== null && ipfs !== void 0 ? ipfs : (0, use_1.getIPFS)())
        .then((ipfs) => {
        return (0, get_mixin_peers_1.ipfsMixinPeers)(ipfs, index_1.EPUB_TOPIC);
    })
        .tap(exports.saveMixinPeers);
}
exports.getMixinPeers = getMixinPeers;
//# sourceMappingURL=getMixinPeers.js.map