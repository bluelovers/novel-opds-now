"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadEpubRace = exports.fetchEpubAll = void 0;
const tslib_1 = require("tslib");
const util_1 = require("fetch-ipfs/util");
const race_1 = (0, tslib_1.__importDefault)(require("fetch-ipfs/race"));
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const use_1 = require("../ipfs/use");
const to_ipfs_url_1 = require("to-ipfs-url");
const pokeAll_1 = require("../ipfs/pokeAll");
const util_2 = require("./fetch/util");
const fetchEpub_1 = require("./fetch/fetchEpub");
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
    return bluebird_1.default.any(list.map(ipfs_href => (0, fetchEpub_1.fetchEpub)(ipfs_href, timeout, options)));
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
        return bluebird_1.default.any([
            (0, race_1.default)(ipfs_href, useIPFS, timeout, options),
            fetchEpubAll(ipfs_href, timeout, options),
        ]);
    })
        .tap(util_2.assertEpubByMime);
}
exports.downloadEpubRace = downloadEpubRace;
//# sourceMappingURL=downloadEpubRace.js.map