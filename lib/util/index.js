"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleArgvList = void 0;
const array_hyper_unique_1 = require("array-hyper-unique");
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
//# sourceMappingURL=index.js.map