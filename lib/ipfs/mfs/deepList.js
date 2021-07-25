"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepList = void 0;
async function deepList(ipfs, rootStart, options, isChild) {
    options !== null && options !== void 0 ? options : (options = {});
    let map = {};
    if (typeof isChild === 'undefined') {
        rootStart = rootStart.replace(/\/$/, '');
        if (rootStart[0] !== '/') {
            rootStart = '/' + rootStart;
        }
        let stat = await ipfs.files.stat(rootStart + '/', {
            timeout: 2000,
            hash: true,
        });
        map[rootStart + '/'] = stat.cid.toString();
        options.debug && debug(map, rootStart + '/');
    }
    for await (const entry of ipfs.files.ls(rootStart, {
        timeout: 2000,
    })) {
        let path = `${rootStart}/${entry.name}`;
        let c = '';
        if (entry.type === 'directory') {
            c = '/';
        }
        map[path + c] = entry.cid.toString();
        options.debug && debug(map, path + c);
        if (entry.type === 'directory') {
            Object.entries(await deepList(ipfs, path, options, true).catch(e => ({})))
                .forEach(([path, cid]) => {
                map[path] = cid;
            });
        }
    }
    return map;
}
exports.deepList = deepList;
function debug(map, path) {
    console.debug(`deepList`, path, map[path]);
}
//# sourceMappingURL=deepList.js.map