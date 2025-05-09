"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchEpubAll = fetchEpubAll;
exports.downloadEpubRace = downloadEpubRace;
const tslib_1 = require("tslib");
const util_1 = require("fetch-ipfs/util");
const race_1 = require("fetch-ipfs/race");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const use_1 = require("../ipfs/use");
const util_2 = require("./fetch/util");
const fetchEpub_1 = require("./fetch/fetchEpub");
const make_url_list_1 = tslib_1.__importDefault(require("@lazy-ipfs/make-url-list"));
const multiaddr_1 = require("ipfs-util-lib/lib/api/multiaddr");
const abort_controller_timer_1 = tslib_1.__importDefault(require("abort-controller-timer"));
const logger_1 = tslib_1.__importDefault(require("debug-color2/logger"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const promise_tap_then_catch_1 = require("promise-tap-then-catch");
const abort_1 = require("../util/abort");
const SymbolSource = Symbol.for('href');
function fetchEpubAll(ipfs_href, timeout, options) {
    return bluebird_1.default.resolve()
        .then(async () => {
        var _a, _b, _c;
        var _d, _e;
        const cid = (0, util_1.handleCID)(ipfs_href, true, options);
        let ipfs = (0, use_1.getIPFS)().timeout(3 * 1000)
            .catch(e => null);
        let list = (0, make_url_list_1.default)(cid, {
            serverList: [
                await (0, multiaddr_1.ipfsGatewayAddressesLink)(ipfs).catch(e => null),
            ],
        });
        let controller;
        if (timeout) {
            controller = new abort_controller_timer_1.default(timeout);
            options !== null && options !== void 0 ? options : (options = {});
            (_a = options.fetchOptions) !== null && _a !== void 0 ? _a : (options.fetchOptions = {});
            (_b = (_d = options.fetchOptions).signal) !== null && _b !== void 0 ? _b : (_d.signal = controller.signal);
            (_c = (_e = options.fetchOptions).timeout) !== null && _c !== void 0 ? _c : (_e.timeout = controller.timeout);
        }
        const p = bluebird_1.default.any(list.map(ipfs_href => (0, fetchEpub_1.fetchEpub)(ipfs_href, timeout, options).then(ret => {
            ret[SymbolSource] = ipfs_href;
            return ret;
        }).tap(util_2.assertEpubByMime)));
        return (0, promise_tap_then_catch_1.promiseTapLazyBoth)(p, () => {
            var _a;
            (0, abort_1._abortController)(controller, (_a = options === null || options === void 0 ? void 0 : options.fetchOptions) === null || _a === void 0 ? void 0 : _a.signal);
        });
    });
}
function downloadEpubRace(ipfs_href, useIPFS, timeout, options) {
    var _a, _b, _c;
    var _d, _e;
    timeout !== null && timeout !== void 0 ? timeout : (timeout = 20 * 60 * 1000);
    let controller;
    if (timeout) {
        controller = new abort_controller_timer_1.default(timeout);
        options !== null && options !== void 0 ? options : (options = {});
        (_a = options.fetchOptions) !== null && _a !== void 0 ? _a : (options.fetchOptions = {});
        (_b = (_d = options.fetchOptions).signal) !== null && _b !== void 0 ? _b : (_d.signal = controller.signal);
        (_c = (_e = options.fetchOptions).timeout) !== null && _c !== void 0 ? _c : (_e.timeout = controller.timeout);
    }
    logger_1.default.debug(`downloadEpubRace`, ipfs_href, options, timeout && (0, moment_1.default)()
        .locale('zh-tw').add(timeout / 1000, 'seconds').fromNow(true));
    const p = bluebird_1.default.resolve(useIPFS)
        .then(useIPFS => {
        return useIPFS !== null && useIPFS !== void 0 ? useIPFS : (0, use_1.getIPFSFromCache)()
            .then(ipfs => {
            return [
                ipfs,
                ...(0, util_1.lazyRaceServerList)(),
            ];
        });
    })
        .then(useIPFS => {
        return bluebird_1.default.any([
            (0, race_1.raceFetchIPFS)(ipfs_href, useIPFS, timeout, options),
            fetchEpubAll(ipfs_href, timeout, options),
        ]);
    })
        .tap(util_2.assertEpubByMime);
    return (0, promise_tap_then_catch_1.promiseTapLazyBoth)(p, () => {
        var _a;
        (0, abort_1._abortController)(controller, (_a = options === null || options === void 0 ? void 0 : options.fetchOptions) === null || _a === void 0 ? void 0 : _a.signal);
    });
}
//# sourceMappingURL=downloadEpubRace.js.map