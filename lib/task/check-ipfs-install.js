"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIpfsInstall = void 0;
const tslib_1 = require("tslib");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const path_1 = require("path");
function checkIpfsInstall() {
    return bluebird_1.default.resolve(Promise.resolve().then(() => tslib_1.__importStar(require('go-ipfs'))))
        .then(m => {
        return bluebird_1.default.resolve(m).then(m => m.path())
            .catch(async (e) => {
            console.warn(`checkIpfsInstall`, String(e));
            let cwd = (0, path_1.dirname)(require.resolve('go-ipfs/package.json'));
            const download = await Promise.resolve().then(() => tslib_1.__importStar(require('go-ipfs/src/download'))).then(m => { var _a; return (_a = m.default) !== null && _a !== void 0 ? _a : m; });
            return download(null, null, null, cwd);
        })
            .catch(async (e) => {
            return Promise.resolve().then(() => m.path()).catch(() => Promise.reject(e));
        });
    });
}
exports.checkIpfsInstall = checkIpfsInstall;
//# sourceMappingURL=check-ipfs-install.js.map