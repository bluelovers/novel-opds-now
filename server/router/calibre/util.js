"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathWithPrefix = void 0;
const path_1 = require("path");
const isBookFile_1 = require("calibre-server/lib/util/isBookFile");
function pathWithPrefix(a = '', ...input) {
    var _a, _b, _c, _d;
    let prefix = '/opds/calibre';
    let query = '';
    if (input.length) {
        let index = input.length - 1;
        let last = input[index];
        let ext = (0, path_1.extname)(last);
        if (ext) {
            prefix = '/file/calibre';
            if ((_a = this === null || this === void 0 ? void 0 : this.book_title) === null || _a === void 0 ? void 0 : _a.length) {
                input.unshift(this.book_id);
                let name = (0, path_1.basename)(last);
                let author = (_d = (_c = (_b = this.authors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.author_name) !== null && _d !== void 0 ? _d : 'unknown';
                let p = new URLSearchParams();
                if (ext === '.jpg') {
                    p.set('filename', `${this.book_title} - ${author} - ${name}`);
                    query = '?' + p.toString();
                }
                else if (ext === '.epub' || (0, isBookFile_1.isBookFile)(ext.replace(/^\./, ''))) {
                    p.set('filename', `${this.book_title} - ${author}${ext}`);
                    query = '?' + p.toString();
                }
            }
        }
    }
    return [prefix, a, ...input].join('/') + query;
}
exports.pathWithPrefix = pathWithPrefix;
//# sourceMappingURL=util.js.map