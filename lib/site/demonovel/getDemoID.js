"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDemoUUID = exports._getDemoID = void 0;
const tslib_1 = require("tslib");
const types_1 = require("./types");
const uuid_1 = tslib_1.__importDefault(require("@demonovel/uuid"));
function _getDemoID(novel) {
    return `${novel.pathMain_base}/${novel.novelID}`;
}
exports._getDemoID = _getDemoID;
function getDemoUUID(novel) {
    return (0, uuid_1.default)(types_1.siteID, _getDemoID(novel));
}
exports.getDemoUUID = getDemoUUID;
//# sourceMappingURL=getDemoID.js.map