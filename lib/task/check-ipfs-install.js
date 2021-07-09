"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIpfsInstall = void 0;
const tslib_1 = require("tslib");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
function checkIpfsInstall() {
    return bluebird_1.default.resolve(Promise.resolve().then(() => (0, tslib_1.__importStar)(require('go-ipfs'))))
        .then(m => m.path())
        .catch(async (e) => {
        console.warn(`checkIpfsInstall`, String(e));
        const download = await Promise.resolve().then(() => (0, tslib_1.__importStar)(require('go-ipfs/src/download'))).then(m => { var _a; return (_a = m.default) !== null && _a !== void 0 ? _a : m; });
        return download();
    });
}
exports.checkIpfsInstall = checkIpfsInstall;
//# sourceMappingURL=check-ipfs-install.js.map