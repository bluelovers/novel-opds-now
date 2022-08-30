"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._pokeMutableFileSystem = exports.pokeMutableFileSystemCore = exports.pokeMutableFileSystem = void 0;
const tslib_1 = require("tslib");
const use_1 = require("../use");
const pokeAll_1 = require("../pokeAll");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const array_hyper_unique_1 = require("array-hyper-unique");
const deepEntryListMap_1 = require("./deepEntryListMap");
function pokeMutableFileSystem(options, title, ...msg) {
    return pokeMutableFileSystemCore(title, [
        `${options.siteID}/${options.novelID}/`,
        `${options.siteID}/`,
    ], ...msg);
}
exports.pokeMutableFileSystem = pokeMutableFileSystem;
function pokeMutableFileSystemCore(title, paths, ...msg) {
    return (0, use_1.getIPFS)().then((ipfs) => {
        return bluebird_1.default.mapSeries((0, array_hyper_unique_1.array_unique)([
            ...paths,
            `/`,
        ]), (path, index) => {
            return _pokeMutableFileSystem(ipfs, path, title)
                .tap((arr) => {
                if (index === 0 && arr.length) {
                    return (0, pokeAll_1.reportPokeAllSettledResult)(arr[arr.length - 1], title, ...msg);
                }
            });
        });
    });
}
exports.pokeMutableFileSystemCore = pokeMutableFileSystemCore;
function _pokeMutableFileSystem(ipfs, path, title) {
    return bluebird_1.default.resolve(ipfs).then(async (ipfs) => {
        let list = [];
        const rootPath = `/novel-opds-now`;
        if (path !== '' && path !== '/') {
            let path_stat = await ipfs.files.stat(`${rootPath}/${path}`, {
                hash: true,
            });
            list.push(`/ipfs/${path_stat.cid}`);
            (0, deepEntryListMap_1.appendDeepEntryListMapByStatResult)(`${rootPath}/${path}`, path_stat);
        }
        else {
            path = '';
        }
        let root_stat = await ipfs.files.stat(`${rootPath}/`, {
            hash: true,
        });
        list.push(`/ipfs/${root_stat.cid}/${path}`);
        (0, deepEntryListMap_1.appendDeepEntryListMapByStatResult)(`${rootPath}`, root_stat);
        return Promise.all(list.map(cid => (0, pokeAll_1.pokeAll)(cid, ipfs, {
            hidden: true,
        })));
    });
}
exports._pokeMutableFileSystem = _pokeMutableFileSystem;
//# sourceMappingURL=pokeMutableFileSystem.js.map