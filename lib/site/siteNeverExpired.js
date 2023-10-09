"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.siteNotExpireCheck = exports.siteNeverExpired = void 0;
const types_1 = require("./demonovel/types");
function siteNeverExpired(siteID) {
    return [siteID].flat()
        .findIndex(v => [
        'masiro',
        types_1.siteID,
        'calibre',
        'esjzone',
    ].includes(v)) !== -1;
}
exports.siteNeverExpired = siteNeverExpired;
function siteNotExpireCheck(siteIDs, timestamp) {
    const day = 86400 * 1000;
    let expire = day * 30 * 2;
    for (const siteID of [siteIDs].flat()) {
        if (/esjzone/i.test(siteID)) {
            expire = day * 5;
            break;
        }
    }
    return (Date.now() - timestamp) <= expire;
}
exports.siteNotExpireCheck = siteNotExpireCheck;
//# sourceMappingURL=siteNeverExpired.js.map