"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetch = fetch;
const tslib_1 = require("tslib");
const cross_fetch_1 = tslib_1.__importDefault(require("cross-fetch"));
const getProxy_1 = tslib_1.__importDefault(require("./util/getProxy"));
const http_proxy_agent_1 = tslib_1.__importDefault(require("http-proxy-agent"));
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const is_error_code_1 = tslib_1.__importDefault(require("is-error-code"));
const abort_controller_timer_1 = tslib_1.__importDefault(require("abort-controller-timer"));
const events_1 = require("events");
events_1.EventEmitter.defaultMaxListeners = 50;
function fetch(...argv) {
    let proxy = (0, getProxy_1.default)();
    let options = argv[1] || {};
    if (proxy) {
        options.agent = (0, http_proxy_agent_1.default)(proxy);
    }
    let cb = () => { };
    if (options.timeout > 0 && !options.signal) {
        if (options.timeout |= 0) {
            const controller = new abort_controller_timer_1.default(options.timeout);
            options.signal = controller.signal;
            cb = () => controller.clear();
        }
        else {
            delete options.timeout;
        }
    }
    options.redirect = 'follow';
    argv[1] = options;
    return bluebird_1.default.resolve((0, cross_fetch_1.default)(...argv))
        .tap(v => {
        if ((0, is_error_code_1.default)(v.status)) {
            return bluebird_1.default.reject(v);
        }
    })
        .finally(cb);
}
exports.default = fetch;
//# sourceMappingURL=fetch.js.map