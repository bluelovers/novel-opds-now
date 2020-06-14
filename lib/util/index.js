"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCacheFilename = exports.handleArgvList = void 0;
const array_hyper_unique_1 = require("array-hyper-unique");
const path_1 = require("path");
function handleArgvList(siteID, novelID) {
    if (!Array.isArray(siteID)) {
        siteID = [siteID];
    }
    if (!Array.isArray(novelID)) {
        novelID = [novelID];
    }
    siteID = array_hyper_unique_1.array_unique_overwrite(siteID.map(v => String(v)));
    novelID = array_hyper_unique_1.array_unique_overwrite(novelID.map(v => String(v)));
    return {
        siteID,
        novelID,
    };
}
exports.handleArgvList = handleArgvList;
function getCacheFilename(filename) {
    return path_1.join(__dirname, '../../', '.cache', 'cached', filename);
}
exports.getCacheFilename = getCacheFilename;
//# sourceMappingURL=index.js.map