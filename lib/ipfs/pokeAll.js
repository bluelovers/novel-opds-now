"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterPokeAllSettledResult = exports.pokeAll = exports.getIpfsGatewayList = exports.notAllowedAddress = void 0;
const tslib_1 = require("tslib");
const poke_ipfs_1 = require("poke-ipfs");
const ipfs_server_list_1 = require("ipfs-server-list");
const array_hyper_unique_1 = require("array-hyper-unique");
const multiaddr_1 = require("ipfs-util-lib/lib/api/multiaddr");
const to_ipfs_url_1 = require("to-ipfs-url");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const bluebird_allsettled_1 = require("bluebird-allsettled");
const ipfs_subdomain_1 = (0, tslib_1.__importDefault)(require("@lazy-ipfs/ipfs-subdomain"));
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
function notAllowedAddress(url) {
    if (typeof url === 'string') {
        url = new URL(url.toString());
    }
    return url.protocol === 'ipfs:' || [
        'localhost',
        '127.0.0.1',
        '::',
        '::1',
    ].includes(url.hostname);
}
exports.notAllowedAddress = notAllowedAddress;
async function getIpfsGatewayList(ipfs) {
    let ipfsGatewayMain;
    const ipfsGatewayList = [];
    await (0, multiaddr_1.ipfsGatewayAddressesLink)(ipfs)
        .then(gateway => {
        ipfsGatewayList.push(ipfsGatewayMain = gateway);
    })
        .catch(e => null);
    (0, ipfs_server_list_1.filterList)('Gateway')
        .forEach(gateway => {
        ipfsGatewayList.push(gateway);
    });
    (0, array_hyper_unique_1.array_unique_overwrite)(ipfsGatewayList);
    return {
        ipfsGatewayMain,
        ipfsGatewayList,
    };
}
exports.getIpfsGatewayList = getIpfsGatewayList;
let cachePoke = new Set();
function pokeAll(cid, ipfs, options) {
    return bluebird_1.default.resolve(options).then(async (options) => {
        if (cachePoke.has(cid)) {
            return null;
        }
        cachePoke.add(cid);
        const { filename } = options !== null && options !== void 0 ? options : {};
        let list = await getIpfsGatewayList(ipfs)
            .then(v => v.ipfsGatewayList)
            .then(list => {
            return list.map(gateway => {
                return (0, to_ipfs_url_1.toLink)(cid, {
                    prefix: {
                        ipfs: gateway,
                    },
                });
            });
        })
            .then(list => {
            const ipfs_share_url = `https://share.ipfs.io/#/${cid}`;
            list.unshift(ipfs_share_url);
            (0, ipfs_server_list_1.filterList)('GatewayDomain')
                .forEach((gateway) => {
                list.push((0, ipfs_subdomain_1.default)(cid, gateway));
            });
            return list;
        });
        list = (0, array_hyper_unique_1.array_unique_overwrite)(list).filter(href => !notAllowedAddress(href));
        logger_1.default.debug(`[IPFS]`, `pokeAll:start`, list.length, cid, filename);
        return (0, bluebird_allsettled_1.allSettled)(list
            .map((href) => {
            if (filename === null || filename === void 0 ? void 0 : filename.length) {
                let url = new URL(href);
                url.searchParams.set('filename', filename);
                href = url.toString();
            }
            return (0, poke_ipfs_1.pokeURL)(href, {
                timeout: 10 * 60 * 1000,
            }).then(data => {
                return {
                    ...data,
                    href,
                };
            });
        }));
    }).finally(() => cachePoke.delete(cid));
}
exports.pokeAll = pokeAll;
function filterPokeAllSettledResult(settledResult) {
    return settledResult.filter(v => !v.value.error && v.value.value !== false);
}
exports.filterPokeAllSettledResult = filterPokeAllSettledResult;
exports.default = pokeAll;
//# sourceMappingURL=pokeAll.js.map