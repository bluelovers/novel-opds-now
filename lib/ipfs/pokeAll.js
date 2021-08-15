"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportPokeAllSettledResult = exports.pokeAll = void 0;
const tslib_1 = require("tslib");
const poke_ipfs_1 = require("poke-ipfs");
const multiaddr_1 = require("ipfs-util-lib/lib/api/multiaddr");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const make_url_list_1 = (0, tslib_1.__importStar)(require("@lazy-ipfs/make-url-list"));
const filterPokeAllSettledResult_1 = require("poke-ipfs/lib/util/filterPokeAllSettledResult");
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
            let list = (0, make_url_list_1.default)(cid, {
                serverList: [
                    await (0, multiaddr_1.ipfsGatewayAddressesLink)(ipfs).catch(e => null),
                ],
                handleOptions: {
                    filename,
                }
            }).filter(href => !(0, make_url_list_1._notAllowedAddress)(href));
            !(options === null || options === void 0 ? void 0 : options.hidden) && logger_1.default.debug(`[IPFS]`, `pokeAll:start`, list.length, cid, filename, ...msg);
            return (0, poke_ipfs_1.pokeAllURL)(list, {
                timeout: ((options === null || options === void 0 ? void 0 : options.timeout) | 0) || 10 * 60 * 1000,
            });
        }).finally(() => cachePoke.delete(cid_str));
    });
}
exports.pokeAll = pokeAll;
function reportPokeAllSettledResult(settledResult, ...msg) {
    return bluebird_1.default.resolve(settledResult).tap(settledResult => {
        let list = (0, filterPokeAllSettledResult_1.getPokeAllSettledResultWithHref)(settledResult !== null && settledResult !== void 0 ? settledResult : []);
        if (list === null || list === void 0 ? void 0 : list.length) {
            logger_1.default.debug(`[IPFS]`, `pokeAll:done`, list);
            logger_1.default.info(`[IPFS]`, `pokeAll:end`, `結束於 ${list.length} ／ ${settledResult.length} 節點中請求分流`, ...msg);
            return list;
        }
    });
}
exports.reportPokeAllSettledResult = reportPokeAllSettledResult;
exports.default = pokeAll;
//# sourceMappingURL=pokeAll.js.map