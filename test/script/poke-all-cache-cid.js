"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const deepEntryListMap_1 = require("../../lib/ipfs/mfs/deepEntryListMap");
const pokeAll_1 = (0, tslib_1.__importStar)(require("../../lib/ipfs/pokeAll"));
const raceFetchServerList_1 = require("../../lib/util/raceFetchServerList");
const array_hyper_unique_1 = require("array-hyper-unique");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const lodash_1 = require("lodash");
let oldSet = new Set();
exports.default = bluebird_1.default.resolve()
    .then(async () => {
    let ls = [];
    await (0, deepEntryListMap_1.loadDeepEntryListMapFromFile)().then(m => ls.push(...m));
    console.debug(`loadDeepEntryListMapFromFile`, ls.length);
    await _json();
    await (0, deepEntryListMap_1.loadDeepEntryListMapFromServer)().then(m => ls.push(...m));
    console.debug(`loadDeepEntryListMapFromServer`, ls.length);
    await _json();
    async function _json() {
        let json_path = deepEntryListMap_1.deepEntryListMap.get((0, deepEntryListMap_1.pathDeepEntryListMapJson)());
        if ((json_path === null || json_path === void 0 ? void 0 : json_path.length) && !oldSet.has(json_path)) {
            await (0, raceFetchServerList_1.raceFetchAll)((0, raceFetchServerList_1.raceFetchServerList)(null, json_path), 60 * 1000)
                .then(buf => JSON.parse(String(buf)))
                .tap(row => {
                if (!row.length) {
                    const e = new TypeError(`deepEntryListMap data is broken`);
                    e.data = row;
                    return Promise.reject(e);
                }
            })
                .tap((map) => {
                let tmp = new Map();
                (0, deepEntryListMap_1.mergeDeepEntryListMap)(map, tmp);
                (0, deepEntryListMap_1.fixDeepEntryListMap)(tmp);
                ls.push(...tmp);
                console.debug((0, deepEntryListMap_1.pathDeepEntryListMapJson)(), json_path, ls.length);
            })
                .catchReturn(null)
                .finally(() => deepEntryListMap_1.deepEntryListMap.delete((0, deepEntryListMap_1.pathDeepEntryListMapJson)()));
        }
        oldSet.add(json_path);
    }
    ls = (0, array_hyper_unique_1.array_unique_overwrite)(ls);
    console.debug(`array_unique_overwrite`, ls.length);
    ls = (0, lodash_1.uniqBy)(ls, '1');
    console.debug(`lodash.uniqBy`, ls.length);
    let day = new Date().getDay();
    let chunk_len = Math.ceil(ls.length / 7);
    return ls.slice(day * chunk_len, ((day + 1) * chunk_len) + 1);
})
    .map(([path, cid], index, length) => {
    let label = `${index.toString().padStart(5, '0')}／${length.toString().padStart(5, '0')}`;
    return (0, pokeAll_1.default)(cid, null, {
        timeout: 10 * 1000,
    }, label, path)
        .tap(ls => (0, pokeAll_1.reportPokeAllSettledResult)(ls, label, path))
        .catchReturn(null);
}, {
    concurrency: 3,
});
//# sourceMappingURL=poke-all-cache-cid.js.map