"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCachePubSubPeers = exports.cachePubSubPeers = void 0;
const tslib_1 = require("tslib");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const index_1 = require("./index");
const path_1 = require("path");
const tmpPath_1 = require("../../util/tmpPath");
const fs_extra_1 = require("fs-extra");
const const_1 = require("../../const");
const array_hyper_unique_1 = require("array-hyper-unique");
const getMixinPeers_1 = require("../util/getMixinPeers");
exports.cachePubSubPeers = new Set();
function updateCachePubSubPeers(ipfs, plusPeers) {
    return bluebird_1.default.props({
        ipfs,
        plusPeers,
    })
        .then(async ({ ipfs, plusPeers, }) => {
        let peers = await (0, index_1.getPubsubPeers)(ipfs);
        if (plusPeers === null || plusPeers === void 0 ? void 0 : plusPeers.length) {
            peers = [plusPeers, peers].flat();
        }
        peers = (0, array_hyper_unique_1.array_unique_overwrite)(peers.filter(peer => {
            let bool = !exports.cachePubSubPeers.has(peer);
            if (bool)
                exports.cachePubSubPeers.add(peer);
            return bool && Boolean(peer);
        }));
        if (!peers.length) {
            return peers;
        }
        let content = `\n${peers.join('\n')}\n`;
        return Promise.all([
            (0, fs_extra_1.appendFile)((0, path_1.join)((0, tmpPath_1.tmpPath)(), '.novel-opds-now.peers.txt'), content),
            (0, fs_extra_1.appendFile)((0, path_1.join)(const_1.__root, '.cache', '.novel-opds-now.peers.txt'), content),
        ]).then(() => peers);
    })
        .catch(e => {
        console.error(`updateCachePubSubPeers`, e);
        return null;
    })
        .tap(getMixinPeers_1.saveMixinPeers);
}
exports.updateCachePubSubPeers = updateCachePubSubPeers;
//# sourceMappingURL=cache.js.map