"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mimeFromBuffer = exports.fixFileTypeResult = void 0;
const file_type_1 = require("file-type");
async function fixFileTypeResult(result) {
    if (!result) {
        return result;
    }
    let { mime, ext } = result;
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
        ...result,
        mime,
        ext,
    };
}
exports.fixFileTypeResult = fixFileTypeResult;
async function mimeFromBuffer(buffer) {
    return (0, file_type_1.fromBuffer)(buffer).then(fixFileTypeResult);
}
exports.mimeFromBuffer = mimeFromBuffer;
//# sourceMappingURL=mimeFromBuffer.js.map