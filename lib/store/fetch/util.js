"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertEpubByMime = void 0;
const mimeFromBuffer_1 = require("../../util/mimeFromBuffer");
async function assertEpubByMime(buffer) {
    let { mime, ext } = await (0, mimeFromBuffer_1.mimeFromBuffer)(buffer);
    if (ext !== 'epub' && ext !== 'zip') {
        return Promise.reject(new Error(JSON.stringify({ mime, ext })));
    }
}
exports.assertEpubByMime = assertEpubByMime;
//# sourceMappingURL=util.js.map