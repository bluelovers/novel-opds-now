"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathWithPrefix = void 0;
const path_1 = require("path");
function pathWithPrefix(a = '', ...input) {
    var _a;
    let prefix = '/opds/calibre';
    let query = '';
    if (input.length) {
        let index = input.length - 1;
        let last = input[index];
        let ext = (0, path_1.extname)(last);
        if (ext) {
            prefix = '/file/calibre';
            if ((_a = this === null || this === void 0 ? void 0 : this.book_title) === null || _a === void 0 ? void 0 : _a.length) {
                let name = (0, path_1.basename)(last);
                let p = new URLSearchParams();
                p.set('book_id', `${this.book_id}`);
                p.set('author', `${this.authors[0].author_name}`);
                if (ext === '.jpg') {
                    p.set('filename', `${this.book_title} ${name}`);
                    query = '?' + p.toString();
                }
                else if (ext === '.epub') {
                    p.set('filename', `${this.book_title} - ${this.authors[0].author_name}${ext}`);
                    query = '?' + p.toString();
                }
            }
        }
    }
    return [prefix, a, ...input].join('/') + query;
}
exports.pathWithPrefix = pathWithPrefix;
//# sourceMappingURL=util.js.map