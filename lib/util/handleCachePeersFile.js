"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCachePeersFile = exports.handleCachePeersArray = void 0;
const array_hyper_unique_1 = require("array-hyper-unique");
function handleCachePeersArray(arr) {
    return (0, array_hyper_unique_1.array_unique_overwrite)(arr.map(s => s.toString().replace(/^\s+|\s+$/g, '')).filter(Boolean));
}
exports.handleCachePeersArray = handleCachePeersArray;
function handleCachePeersFile(buf) {
    return handleCachePeersArray(buf.toString().split(/\s+/g));
}
exports.handleCachePeersFile = handleCachePeersFile;
//# sourceMappingURL=handleCachePeersFile.js.map