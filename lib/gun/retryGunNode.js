"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryGunNode = void 0;
const bluebird_1 = __importDefault(require("bluebird"));
function retryGunNode(gunNode, maxRetryAttempts = 5) {
    maxRetryAttempts = Math.max(maxRetryAttempts | 0, 0);
    let retryAttempts = 0;
    return new bluebird_1.default((resolve, reject) => {
        function f() {
            gunNode
                .once(function (a) {
                for (let k in a) {
                    if (k === '_')
                        continue;
                    return resolve(a);
                }
                if (retryAttempts >= maxRetryAttempts) {
                    return resolve(a);
                }
                setTimeout(f, 1000);
            });
        }
        f();
    });
}
exports.retryGunNode = retryGunNode;
exports.default = retryGunNode;
//# sourceMappingURL=retryGunNode.js.map