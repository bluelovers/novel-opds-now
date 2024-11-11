"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._abortController = _abortController;
const abort_controller_util_1 = require("abort-controller-util");
function _abortController(controller, signal) {
    var _a, _b;
    try {
        controller === null || controller === void 0 ? void 0 : controller.abort();
    }
    catch (e) {
    }
    if (signal) {
        try {
            (_a = (0, abort_controller_util_1._getControllerFromSignal)(signal)) === null || _a === void 0 ? void 0 : _a.abort();
            (_b = signal.abort) === null || _b === void 0 ? void 0 : _b.call(signal);
        }
        catch (e) {
        }
    }
}
//# sourceMappingURL=abort.js.map