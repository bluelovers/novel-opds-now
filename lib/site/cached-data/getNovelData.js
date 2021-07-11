"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNovelData = void 0;
const tslib_1 = require("tslib");
const index_1 = require("../../util/index");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
function getNovelData(siteID, novelID) {
    return bluebird_1.default.resolve(Promise.resolve().then(() => (0, tslib_1.__importStar)(require((0, index_1.getCacheFilename)(`${siteID}/map.json`)))))
        .then(data => {
        return data[novelID];
    })
        .catch(e => null);
}
exports.getNovelData = getNovelData;
//# sourceMappingURL=getNovelData.js.map