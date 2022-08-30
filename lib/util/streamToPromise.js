"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamToPromise = void 0;
const tslib_1 = require("tslib");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
function streamToPromise(stream) {
    return new bluebird_1.default(function (resolve, reject) {
        stream.on("end", resolve);
        stream.on("error", reject);
    });
}
exports.streamToPromise = streamToPromise;
//# sourceMappingURL=streamToPromise.js.map