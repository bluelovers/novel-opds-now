"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPort = exports.getPortEnv = void 0;
function getPortEnv() {
    return process.env["OPENSHIFT_NODEJS_PORT"] || process.env["VCAP_APP_PORT"] || process.env["PORT"];
}
exports.getPortEnv = getPortEnv;
function getPort(port) {
    return port || 3000;
}
exports.getPort = getPort;
exports.default = getPort;
//# sourceMappingURL=getPort.js.map