"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const deepEntryListMap_1 = require("../../lib/ipfs/mfs/deepEntryListMap");
const pokeAll_1 = (0, tslib_1.__importStar)(require("../../lib/ipfs/pokeAll"));
exports.default = (0, deepEntryListMap_1.loadDeepEntryListMapFromFile)()
    .then(deepEntryListMap => [...deepEntryListMap])
    .map(([path, cid], index, length) => {
    let label = `${index.toString().padStart(5, '0')}／${length.toString().padStart(5, '0')}`;
    return (0, pokeAll_1.default)(cid, null, {
        timeout: 10 * 1000,
    }, label, path)
        .tap(ls => (0, pokeAll_1.reportPokeAllSettledResult)(ls, label, path))
        .catchReturn(null);
}, {
    concurrency: 5,
});
//# sourceMappingURL=poke-all-cache-cid.js.map