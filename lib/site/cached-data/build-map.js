"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._buildMap = void 0;
const fs_extra_1 = require("fs-extra");
const index_1 = require("../../util/index");
function _buildMap(siteID, list) {
    return (0, fs_extra_1.outputJSON)((0, index_1.getCacheFilename)(`${siteID}/map.json`), list.reduce((a, b) => {
        a[b.id] = b;
        return a;
    }, {}), {
        spaces: 2,
    });
}
exports._buildMap = _buildMap;
//# sourceMappingURL=build-map.js.map