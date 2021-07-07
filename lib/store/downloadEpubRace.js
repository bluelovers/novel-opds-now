"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertEpubByMime = exports.downloadEpubRace = exports.fetchEpubAll = exports.fetchEpub = void 0;
const tslib_1 = require("tslib");
const util_1 = require("fetch-ipfs/util");
const race_1 = (0, tslib_1.__importDefault)(require("fetch-ipfs/race"));
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const fetch_1 = (0, tslib_1.__importDefault)(require("../fetch"));
const use_1 = require("../ipfs/use");
const p_any_1 = (0, tslib_1.__importDefault)(require("p-any"));
const mimeFromBuffer_1 = require("../util/mimeFromBuffer");
const to_ipfs_url_1 = require("to-ipfs-url");
const pokeAll_1 = require("../ipfs/pokeAll");
function fetchEpub(ipfs_href, timeout, options) {
    return (0, fetch_1.default)(ipfs_href, { timeout }).then(res => res.buffer()).tap(assertEpubByMime);
}
exports.fetchEpub = fetchEpub;
async function fetchEpubAll(ipfs_href, timeout, options) {
    const cid = (0, util_1.handleCID)(ipfs_href, true, options);
    let ipfs = (0, use_1.getIPFS)().timeout(3 * 1000)
        .catch(e => null);
    let list = await (0, pokeAll_1.getIpfsGatewayList)(ipfs)
        .then(v => v.ipfsGatewayList)
        .then(list => {
        return list.map(gateway => {
            return (0, to_ipfs_url_1.toLink)(cid, {
                prefix: {
                    ipfs: gateway,
                },
            });
        });
    });
    return (0, p_any_1.default)(list.map(ipfs_href => fetchEpub(ipfs_href, timeout, options)));
}
exports.fetchEpubAll = fetchEpubAll;
function downloadEpubRace(ipfs_href, useIPFS, timeout, options) {
    timeout !== null && timeout !== void 0 ? timeout : (timeout = 20 * 60 * 1000);
    return bluebird_1.default.resolve(useIPFS)
        .then(useIPFS => {
        return useIPFS !== null && useIPFS !== void 0 ? useIPFS : bluebird_1.default.resolve((0, use_1.getIPFS)().timeout(3 * 1000)
            .catch(e => null))
            .then(ipfs => {
            return [
                ipfs,
                ...(0, util_1.lazyRaceServerList)(),
            ];
        });
    })
        .then(useIPFS => {
        return (0, p_any_1.default)([
            (0, race_1.default)(ipfs_href, useIPFS, timeout, options),
            fetchEpubAll(ipfs_href, timeout, options),
        ]);
    })
        .tap(assertEpubByMime);
}
exports.downloadEpubRace = downloadEpubRace;
async function assertEpubByMime(buffer) {
    let { mime, ext } = await (0, mimeFromBuffer_1.mimeFromBuffer)(buffer);
    if (ext !== 'epub' && ext !== 'zip') {
        return Promise.reject(new Error(JSON.stringify({ mime, ext })));
    }
}
exports.assertEpubByMime = assertEpubByMime;
//# sourceMappingURL=downloadEpubRace.js.map