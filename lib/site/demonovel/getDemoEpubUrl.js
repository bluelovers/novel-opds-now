"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDemoEpubRouterUrl = exports.getDemoEpubUrl = void 0;
const types_1 = require("./types");
function getDemoEpubUrl(novel) {
    return new URL([
        novel.pathMain_base,
        novel.cache.epub_basename,
    ].join('/'), types_1.rawUrl);
}
exports.getDemoEpubUrl = getDemoEpubUrl;
function getDemoEpubRouterUrl(novel) {
    return [
        '',
        'file',
        types_1.siteID,
        novel.uuid,
        novel.pathMain_base,
        novel.cache.epub_basename,
    ].join('/');
}
exports.getDemoEpubRouterUrl = getDemoEpubRouterUrl;
//# sourceMappingURL=getDemoEpubUrl.js.map