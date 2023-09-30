"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchEpub = void 0;
const tslib_1 = require("tslib");
const fetch_1 = tslib_1.__importDefault(require("../../fetch"));
const SymbolSource = Symbol.for('href');
function fetchEpub(ipfs_href, timeout, options) {
    return (0, fetch_1.default)(ipfs_href, {
        ...options === null || options === void 0 ? void 0 : options.fetchOptions,
        timeout,
    }).then(res => res.buffer()).tap(buf => {
        buf[SymbolSource] = ipfs_href;
    });
}
exports.fetchEpub = fetchEpub;
//# sourceMappingURL=fetchEpub.js.map