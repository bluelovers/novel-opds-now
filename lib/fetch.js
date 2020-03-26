"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetch = void 0;
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const getProxy_1 = __importDefault(require("./getProxy"));
const http_proxy_agent_1 = __importDefault(require("http-proxy-agent"));
const abort_controller_1 = __importDefault(require("abort-controller"));
const bluebird_1 = __importDefault(require("bluebird"));
const is_error_code_1 = __importDefault(require("is-error-code"));
function fetch(...argv) {
    let proxy = getProxy_1.default();
    let options = argv[1] || {};
    if (proxy) {
        options.agent = http_proxy_agent_1.default(proxy);
    }
    if (options.timeout > 0 && !options.signal) {
        if (options.timeout |= 0) {
            const controller = new abort_controller_1.default();
            const timer = setTimeout(() => controller.abort(), options.timeout);
            options.signal = controller.signal;
        }
        else {
            delete options.timeout;
        }
    }
    options.redirect = 'follow';
    argv[1] = options;
    return bluebird_1.default.resolve(cross_fetch_1.default(...argv))
        .tap(v => {
        if (is_error_code_1.default(v.status)) {
            return Promise.reject(v);
        }
    });
}
exports.fetch = fetch;
exports.default = fetch;
//# sourceMappingURL=fetch.js.map