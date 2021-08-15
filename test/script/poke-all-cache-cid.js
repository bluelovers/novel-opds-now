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
let oldSet2 = new Set();
exports.default = bluebird_1.default.resolve()
    .then(async () => {
    let ls = [];
    let ls2 = [];
    await (0, deepEntryListMap_1.loadDeepEntryListMapFromFile)().then(m => ls.push(...m));
    console.debug(`loadDeepEntryListMapFromFile`, ls.length);
    await _always();
    await (0, deepEntryListMap_1.loadDeepEntryListMapFromServer)().then(m => ls.push(...m));
    console.debug(`loadDeepEntryListMapFromServer`, ls.length);
    await _always();
    async function _always() {
        [
            '/.cache/',
            '/.cache/novel-opds-now.cids.json',
            '/.cache/novel-opds-now.cids.json.bak',
            '/novel-opds-now/',
            '/novel-opds-now/calibre/',
            '/novel-opds-now/demonovel/',
            '/novel-opds-now/dmzj/',
            '/novel-opds-now/esjzone/',
            '/novel-opds-now/masiro/',
            '/novel-opds-now/wenku8/',
        ].forEach(json_path => {
            let cid = deepEntryListMap_1.deepEntryListMap.get(json_path);
            if ((cid === null || cid === void 0 ? void 0 : cid.length) && !oldSet2.has(cid)) {
                ls2.push([json_path, String(cid)]);
                oldSet2.add(cid);
            }
        });
        return Promise.all([
            _json(),
            _json((0, deepEntryListMap_1.pathDeepEntryListMapJson)() + '.bak'),
        ]);
    }
    async function _json(json_path = (0, deepEntryListMap_1.pathDeepEntryListMapJson)()) {
        let cid = deepEntryListMap_1.deepEntryListMap.get(json_path);
        if ((cid === null || cid === void 0 ? void 0 : cid.length) && !oldSet.has(cid)) {
            ls2.push([json_path, String(cid)]);
            await (0, raceFetchServerList_1.raceFetchAll)((0, raceFetchServerList_1.raceFetchServerList)(null, cid), 60 * 1000)
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
                console.debug(json_path, cid, ls.length);
            })
                .catchReturn(null)
                .finally(() => deepEntryListMap_1.deepEntryListMap.delete(json_path));
        }
        oldSet.add(cid);
    }
    ls = (0, array_hyper_unique_1.array_unique_overwrite)(ls);
    console.debug(`array_unique_overwrite`, ls.length);
    ls = (0, lodash_1.uniqBy)(ls, '1');
    console.debug(`lodash.uniqBy`, ls.length);
    let day = new Date().getDay();
    let chunk_len = Math.ceil(ls.length / 7);
    let ls3 = ls.slice(day * chunk_len, ((day + 1) * chunk_len) + 1);
    ls3.unshift(...ls2);
    return ls3;
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