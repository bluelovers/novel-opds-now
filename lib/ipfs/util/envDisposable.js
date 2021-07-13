"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envDisposable = void 0;
const env_bool_1 = require("env-bool");
function envDisposable(disposable) {
    var _a;
    return !!(0, env_bool_1.envBool)((_a = disposable !== null && disposable !== void 0 ? disposable : process.env.IPFS_DISPOSABLE) !== null && _a !== void 0 ? _a : false, true);
}
exports.envDisposable = envDisposable;
//# sourceMappingURL=envDisposable.js.map