"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.raceFetchServerList = raceFetchServerList;
exports.raceFetchAll = raceFetchAll;
const tslib_1 = require("tslib");
const util_1 = require("fetch-ipfs/util");
const use_1 = require("../ipfs/use");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const fetch_1 = require("../fetch");
const abort_controller_timer_1 = tslib_1.__importDefault(require("abort-controller-timer"));
const make_url_list_1 = tslib_1.__importDefault(require("@lazy-ipfs/make-url-list"));
const multiaddr_1 = require("ipfs-util-lib/lib/api/multiaddr");
const abort_1 = require("./abort");
const promise_tap_then_catch_1 = require("promise-tap-then-catch");
async function raceFetchServerList(ipfs, ipfs_href, timeout, options) {
    const cid = (0, util_1.handleCID)(ipfs_href, true, options);
    ipfs = ipfs !== null && ipfs !== void 0 ? ipfs : await (0, use_1.getIPFSFromCache)();
    return (0, make_url_list_1.default)(cid, {
        serverList: [
            await (0, multiaddr_1.ipfsGatewayAddressesLink)(ipfs).catch(e => null),
        ],
        ipfsGatewayDomainList: [],
    }).filter(u => {
        return !/cloudflare-ipfs|cf-ipfs|jorropo\.net|ipfs\.runfission\.com|ipfs\.mrh\.io|ipfs\.yt|ipfs\.drink\.cafe|ipfs\.telos\.miami|ipfs\.itargo\.io|bluelight\.link|ipfs\.smartholdem\.io/i.test(u.hostname);
    });
}
function raceFetchAll(list, timeout, options) {
    const controller = new abort_controller_timer_1.default(timeout);
    return bluebird_1.default.resolve(list)
        .then(list => {
        const p = bluebird_1.default.any([...list].map(ipfs_href => {
            return (0, fetch_1.fetch)(ipfs_href, {
                timeout,
                signal: controller.signal,
            })
                .then(res => res.buffer())
                .tap(async (buf) => {
                var _a, _b;
                let result = (_b = (await ((_a = options === null || options === void 0 ? void 0 : options.filter) === null || _a === void 0 ? void 0 : _a.call(options, buf)))) !== null && _b !== void 0 ? _b : true;
                if (!result) {
                    return Promise.reject(new Error(`reject by filter: ${result}\n${ipfs_href}`));
                }
            });
        }));
        return (0, promise_tap_then_catch_1.promiseTapLazyBoth)(p, () => {
            (0, abort_1._abortController)(controller);
        });
    });
}
//# sourceMappingURL=raceFetchServerList.js.map