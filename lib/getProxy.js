"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProxy = void 0;
function getProxy(proxy) {
    return proxy || process.env.HTTPS_PROXY || process.env.HTTP_PROXY || undefined;
}
exports.getProxy = getProxy;
exports.default = getProxy;
//# sourceMappingURL=getProxy.js.map