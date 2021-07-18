"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mimeFromBuffer = exports.fixFileTypeResult = void 0;
const file_type_1 = require("file-type");
const mime_types_1 = require("mime-types");
const isBookFile_1 = require("calibre-server/lib/util/isBookFile");
async function fixFileTypeResult(result, fileExt) {
    if (!result) {
        return result;
    }
    let { mime, ext } = result;
    fileExt = fileExt.replace(/^\./, '');
    if ((fileExt === null || fileExt === void 0 ? void 0 : fileExt.length) && (0, isBookFile_1.isBookFile)(fileExt)) {
        let mime2 = (0, mime_types_1.lookup)(fileExt);
        ext = fileExt;
        if (mime2) {
            mime = mime2 || mime;
        }
    }
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
async function mimeFromBuffer(buffer, ext) {
    return (0, file_type_1.fromBuffer)(buffer).then(result => fixFileTypeResult(result, ext));
}
exports.mimeFromBuffer = mimeFromBuffer;
//# sourceMappingURL=mimeFromBuffer.js.map