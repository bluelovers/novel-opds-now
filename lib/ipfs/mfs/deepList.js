"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepList = void 0;
const tslib_1 = require("tslib");
const micromatch_1 = require("micromatch");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const logger_1 = tslib_1.__importDefault(require("debug-color2/logger"));
const deepEntryListMap_1 = require("./deepEntryListMap");
function deepList(ipfs, rootStart, options, isChild) {
    return bluebird_1.default.resolve()
        .then(async () => {
        var _a, _b, _c;
        options !== null && options !== void 0 ? options : (options = {});
        let map = new Map();
        if (typeof isChild === 'undefined') {
            rootStart = rootStart.replace(/\/$/, '');
            if (rootStart[0] !== '/') {
                rootStart = '/' + rootStart;
            }
            let stat = await ipfs.files.stat(rootStart + '/', {
                timeout: 2000,
                hash: true,
            });
            map.set(rootStart + '/', stat.cid.toString());
            options.debug && debug(map, rootStart + '/');
            options.glob = [options.glob].flat().filter(v => v === null || v === void 0 ? void 0 : v.length);
            if (!((_a = options.glob) === null || _a === void 0 ? void 0 : _a.length)) {
                delete options.glob;
            }
            options.ignore = [options.ignore].flat().filter(v => v === null || v === void 0 ? void 0 : v.length);
            if (!((_b = options.ignore) === null || _b === void 0 ? void 0 : _b.length)) {
                delete options.ignore;
            }
        }
        for await (const entry of ipfs.files.ls(rootStart, {
            timeout: 2000,
        })) {
            let path = `${rootStart}/${entry.name}`;
            let path2 = path;
            if (entry.type === 'directory') {
                path2 += '/';
                let ls2 = await deepList(ipfs, path, options, true).catch(e => null);
                if (ls2 === null || ls2 === void 0 ? void 0 : ls2.size) {
                    map.set(path2, entry.cid.toString());
                    options.debug && debug(map, path2);
                    (0, deepEntryListMap_1.mergeDeepEntryListMap)(ls2, map);
                }
                else {
                    logger_1.default.red.debug(`deepList`, path, entry.cid.toString(), ls2 === null || ls2 === void 0 ? void 0 : ls2.size);
                }
            }
            else if (!((_c = options.glob) === null || _c === void 0 ? void 0 : _c.length) || (0, micromatch_1.isMatch)(entry.name, options.glob, {
                ignore: options.ignore,
            })) {
                map.set(path2, entry.cid.toString());
                options.debug && debug(map, path2);
            }
        }
        return map;
    });
}
exports.deepList = deepList;
function debug(map, path) {
    logger_1.default.debug(`deepList`, path, map.get(path));
}
//# sourceMappingURL=deepList.js.map