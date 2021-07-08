"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processExit = exports.processListener = void 0;
const map = new WeakMap();
function processListener(eventName, fn) {
    let cb = map.get(fn);
    if (!cb) {
        cb = (...argv) => {
            return fn();
        };
        map.set(fn, cb);
    }
    process.removeListener(eventName, cb);
    process.once(eventName, cb);
    return {
        eventName,
        cb,
        fn,
    };
}
exports.processListener = processListener;
function processExit(stop) {
    processListener('SIGINT', stop);
    processListener('SIGTERM', stop);
    processListener('exit', stop);
}
exports.processExit = processExit;
exports.default = processExit;
//# sourceMappingURL=processExit.js.map