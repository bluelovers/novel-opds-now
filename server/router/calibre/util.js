"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathWithPrefix = void 0;
const path_1 = require("path");
function pathWithPrefix(a = '', ...input) {
    let prefix = '/opds/calibre';
    if (input.length) {
        let last = input[input.length - 1];
        if ((0, path_1.extname)(last)) {
            prefix = '/file/calibre';
        }
    }
    return [prefix, a, ...input].join('/');
}
exports.pathWithPrefix = pathWithPrefix;
//# sourceMappingURL=util.js.map