"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchEpub = fetchEpub;
const tslib_1 = require("tslib");
const fetch_1 = require("../../fetch");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const SymbolSource = Symbol.for('href');
function fetchEpub(ipfs_href, timeout, options) {
    return (0, fetch_1.fetch)(ipfs_href, {
        ...options === null || options === void 0 ? void 0 : options.fetchOptions,
        timeout,
    })
        .then(res => res.buffer())
        .tap(buf => {
        buf[SymbolSource] = ipfs_href;
        if (!buf.length) {
            return bluebird_1.default.reject(buf);
        }
    });
}
//# sourceMappingURL=fetchEpub.js.map