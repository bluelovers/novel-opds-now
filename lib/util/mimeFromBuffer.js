"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mimeFromBuffer = exports.fixFileTypeResult = void 0;
const tslib_1 = require("tslib");
const file_type_1 = require("file-type");
const mime_types_1 = require("mime-types");
const isBookFile_1 = require("calibre-server/lib/util/isBookFile");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const logger_1 = tslib_1.__importDefault(require("debug-color2/logger"));
async function fixFileTypeResult(result, fileExt) {
    var _a;
    if (!result) {
        return result;
    }
    let { mime, ext } = result;
    fileExt = (_a = fileExt === null || fileExt === void 0 ? void 0 : fileExt.replace) === null || _a === void 0 ? void 0 : _a.call(fileExt, /^\./, '');
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
function mimeFromBuffer(buffer, ext) {
    return bluebird_1.default.resolve().then(() => (0, file_type_1.fromBuffer)(buffer).then(result => fixFileTypeResult(result, ext)))
        .tapCatch(e => {
        logger_1.default.error(`mimeFromBuffer`, e);
    });
}
exports.mimeFromBuffer = mimeFromBuffer;
//# sourceMappingURL=mimeFromBuffer.js.map