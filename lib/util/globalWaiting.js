"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveWaiting = exports.newWaitingPromise = exports.globalWaiting = void 0;
const tslib_1 = require("tslib");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
exports.globalWaiting = new Map();
function newWaitingPromise(waitingKey, fn) {
    return resolveWaiting(waitingKey)
        .then(() => {
        let p = fn();
        exports.globalWaiting.set(waitingKey, p);
        return p
            .finally(() => exports.globalWaiting.delete(waitingKey));
    });
}
exports.newWaitingPromise = newWaitingPromise;
function resolveWaiting(waitingKey) {
    return bluebird_1.default.resolve()
        .then(() => {
        var _a, _b;
        let p = exports.globalWaiting.get(waitingKey);
        if (p !== null && p !== void 0 ? p : false) {
            console.debug(`[GlobalWaiting]`, `wait`, waitingKey, (_b = (_a = p.isPending) === null || _a === void 0 ? void 0 : _a.call(p)) !== null && _b !== void 0 ? _b : p);
            return bluebird_1.default.resolve(p)
                .finally(() => {
                var _a, _b;
                console.debug(`[GlobalWaiting]`, `done`, waitingKey, (_b = (_a = p.isPending) === null || _a === void 0 ? void 0 : _a.call(p)) !== null && _b !== void 0 ? _b : p);
            });
        }
    });
}
exports.resolveWaiting = resolveWaiting;
//# sourceMappingURL=globalWaiting.js.map