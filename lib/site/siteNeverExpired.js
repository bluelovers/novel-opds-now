"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.siteNeverExpired = void 0;
const types_1 = require("./demonovel/types");
function siteNeverExpired(siteID) {
    return [siteID].flat()
        .findIndex(v => ['masiro', types_1.siteID].includes(v)) !== -1;
}
exports.siteNeverExpired = siteNeverExpired;
//# sourceMappingURL=siteNeverExpired.js.map