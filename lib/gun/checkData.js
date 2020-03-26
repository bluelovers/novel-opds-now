"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkGunData = void 0;
function checkGunData(data) {
    if (data && data.timestamp) {
        if (data.exists) {
            let { base64, filename, exists, timestamp, href } = data;
            if (href && filename && exists && timestamp) {
                return true;
            }
            if (!(base64 && filename && exists && timestamp)) {
                return false;
            }
            return true;
        }
    }
    return null;
}
exports.checkGunData = checkGunData;
exports.default = checkGunData;
//# sourceMappingURL=checkData.js.map