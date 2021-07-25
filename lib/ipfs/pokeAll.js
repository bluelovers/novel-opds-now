"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportPokeAllSettledResult = exports.filterPokeAllSettledResult = exports.pokeAll = exports.getIpfsGatewayList = exports.notAllowedAddress = void 0;
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
const parse_ipfs_path_1 = require("@lazy-ipfs/parse-ipfs-path");
const parsePath_1 = require("@lazy-ipfs/parse-ipfs-path/lib/parsePath");
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
function pokeAll(cid, ipfs, options, ...msg) {
    const cid_str = cid.toString();
    return bluebird_1.default.resolve(ipfs)
        .then((ipfs) => {
        if (cachePoke.has(cid_str)) {
            !(options === null || options === void 0 ? void 0 : options.hidden) && logger_1.default.gray.debug(`poke`, `skip`, cid_str);
            return null;
        }
        return bluebird_1.default
            .resolve(options)
            .then(async (options) => {
            cachePoke.add(cid_str);
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
                let data;
                try {
                    data = (0, parse_ipfs_path_1.parsePath)(cid);
                }
                catch (e) {
                    data = {
                        ns: "ipfs",
                        hash: cid,
                        path: '',
                    };
                }
                const ipfs_share_url = `https://share.ipfs.io/#/${data.hash}`;
                list.unshift(ipfs_share_url);
                (0, ipfs_server_list_1.filterList)('GatewayDomain')
                    .forEach((gateway) => {
                    try {
                        list.push((0, ipfs_subdomain_1.default)((0, parsePath_1.resultToPath)(data), gateway));
                    }
                    catch (e) {
                    }
                });
                return list;
            });
            list = (0, array_hyper_unique_1.array_unique_overwrite)(list).filter(href => !notAllowedAddress(href));
            !(options === null || options === void 0 ? void 0 : options.hidden) && logger_1.default.debug(`[IPFS]`, `pokeAll:start`, list.length, cid, filename, ...msg);
            return (0, bluebird_allsettled_1.allSettled)(list
                .map((href) => {
                if (filename === null || filename === void 0 ? void 0 : filename.length) {
                    let url = new URL(href);
                    url.searchParams.set('filename', filename);
                    href = url.toString();
                }
                return (0, poke_ipfs_1.pokeURL)(href, {
                    timeout: ((options === null || options === void 0 ? void 0 : options.timeout) | 0) || 10 * 60 * 1000,
                }).then(data => {
                    return {
                        ...data,
                        href,
                    };
                });
            }));
        }).finally(() => cachePoke.delete(cid_str));
    });
}
exports.pokeAll = pokeAll;
function filterPokeAllSettledResult(settledResult) {
    return settledResult.filter(v => { var _a; return !v.value.error && v.value.value !== false && ((_a = v.value.value) === null || _a === void 0 ? void 0 : _a.length); });
}
exports.filterPokeAllSettledResult = filterPokeAllSettledResult;
function reportPokeAllSettledResult(settledResult, ...msg) {
    return bluebird_1.default.resolve(settledResult).tap(settledResult => {
        if (settledResult === null || settledResult === void 0 ? void 0 : settledResult.length) {
            let list = filterPokeAllSettledResult(settledResult)
                .map(m => {
                var _a, _b;
                if ((_b = (_a = m.value) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.length) {
                    return m.value.href;
                }
                return m;
            });
            logger_1.default.debug(`[IPFS]`, `pokeAll:done`, list);
            logger_1.default.info(`[IPFS]`, `pokeAll:end`, `結束於 ${list.length} ／ ${settledResult.length} 節點中請求分流`, ...msg);
            return list;
        }
    });
}
exports.reportPokeAllSettledResult = reportPokeAllSettledResult;
exports.default = pokeAll;
//# sourceMappingURL=pokeAll.js.map