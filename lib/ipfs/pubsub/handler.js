"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pubsubHandler = void 0;
const tslib_1 = require("tslib");
const use_1 = require("../use");
const types_1 = require("../types");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const index_1 = require("./index");
const pokeAll_1 = require("../pokeAll");
const mfs_1 = require("../mfs");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const array_hyper_unique_1 = require("array-hyper-unique");
const peer_1 = require("../peer");
const hello_1 = require("./hello");
const getMixinPeers_1 = require("../util/getMixinPeers");
async function pubsubHandler(msg) {
    var _a, _b, _c;
    const ipfs = await (0, use_1.getIPFS)().catch(e => null);
    if (!ipfs)
        return;
    const me = await ipfs.id().catch(e => null);
    try {
        const json = JSON.parse(Buffer.from(msg.data).toString());
        if (json) {
            let peerIDs = [];
            if (msg.topicIDs.includes(index_1.EPUB_TOPIC)) {
                if (typeof json.peerID !== 'undefined' && json.type && msg.from.toString() === json.peerID.toString()) {
                    logger_1.default.yellow.info(`[IPFS]`, `peer:online`, me.id === msg.from ? 'You!' : json.peerID, msg.topicIDs, `${types_1.EnumPubSubHello[json.type]}:${json.type}`, (_a = json.peers) === null || _a === void 0 ? void 0 : _a.length);
                    if (me.id !== msg.from) {
                        peerIDs.push(json.peerID);
                        if (json.type !== types_1.EnumPubSubHello.HELLO_REPLY && types_1.EnumPubSubHello[json.type]) {
                            let peers = (0, getMixinPeers_1.getMixinPeers)(ipfs);
                            (0, hello_1.pubsubPublishHello)(ipfs, types_1.EnumPubSubHello.HELLO_REPLY, peers);
                        }
                    }
                }
            }
            if ((me === null || me === void 0 ? void 0 : me.id) !== msg.from) {
                if (json.cid || ((_b = json.data) === null || _b === void 0 ? void 0 : _b.cid)) {
                    const cid = json.cid || ((_c = json.data) === null || _c === void 0 ? void 0 : _c.cid);
                    (0, pokeAll_1.pokeAll)(cid, ipfs)
                        .tap(settledResult => {
                        var _a;
                        return (0, pokeAll_1.reportPokeAllSettledResult)(settledResult, cid, (_a = json.data) === null || _a === void 0 ? void 0 : _a.path);
                    });
                }
                if (typeof json.data !== 'undefined' && json.data.cid) {
                    if (typeof json.siteID === 'string' && typeof json.novelID === 'string' && json.data.path && json.data.size) {
                        (0, mfs_1.addMutableFileSystem)({
                            siteID: json.siteID,
                            novelID: json.novelID,
                            data: {
                                cid: json.data.cid,
                                path: json.data.path,
                                size: json.data.size,
                            },
                        });
                    }
                    peerIDs.push(msg.from);
                }
            }
            if (me.id !== msg.from && Array.isArray(json.peers) && json.peers.length) {
                peerIDs.push(...json.peers);
            }
            if (me.id !== msg.from && peerIDs.length) {
                await bluebird_1.default.resolve((0, array_hyper_unique_1.array_unique_overwrite)(peerIDs.map(String)))
                    .each(peerID => (0, peer_1.connectPeers)(ipfs, peerID, me, null, {
                    hidden: true,
                }));
            }
        }
    }
    catch (e) {
        logger_1.default.debug(`[IPFS]`, `pubsubHandler:error`, Buffer.from(msg.data).toString(), e);
    }
}
exports.pubsubHandler = pubsubHandler;
//# sourceMappingURL=handler.js.map