"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mimeFromBuffer = void 0;
const file_type_1 = require("file-type");
async function mimeFromBuffer(buffer) {
    let { mime, ext } = await (0, file_type_1.fromBuffer)(buffer);
    if (mime === 'application/zip') {
        if (ext === 'zip') {
            mime = 'application/epub+zip';
            ext = 'epub';
        }
        else if (ext === 'epub') {
            mime = 'application/epub+zip';
        }
    }
    return {
        mime,
        ext,
    };
}
exports.mimeFromBuffer = mimeFromBuffer;
//# sourceMappingURL=mimeFromBuffer.js.map