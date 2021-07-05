"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTitleList = exports.buildCache = void 0;
const tslib_1 = require("tslib");
const load_1 = (0, tslib_1.__importStar)(require("./load"));
const class_1 = require("node-novel-info/class");
const cache_loader_1 = require("@node-novel/cache-loader");
const lib_1 = require("zero-width/lib");
const str_util_1 = require("str-util");
const dot_values2_1 = (0, tslib_1.__importDefault)(require("dot-values2"));
const fs_extra_1 = require("fs-extra");
function buildCache() {
    return (0, load_1.default)()
        .then(table => {
        let nc = (0, cache_loader_1.createFromJSON)(table);
        let novels = nc.filterNovel();
        let list = dot_values2_1.default.get(novels, `*.*`);
        list = list
            .map(novel => {
            let info = class_1.NodeNovelInfo.create(novel.mdconf);
            novel.title = info.title();
            novel.authors = info.authors();
            return novel;
        })
            .sort((a, b) => {
            if (b.cache.epub_date && a.cache.epub_date) {
                return b.cache.epub_date - a.cache.epub_date;
            }
            else if (!b.cache.epub_date && a.cache.epub_date) {
                return -1;
            }
            else if (!a.cache.epub_date && b.cache.epub_date) {
                return 1;
            }
            return 0;
        });
        return Promise.all([
            (0, fs_extra_1.writeJSON)((0, load_1.getLocalFilename)('array.json'), list, {
                spaces: 2,
            }),
        ]);
    });
}
exports.buildCache = buildCache;
function buildTitleList(cache) {
    let titles = Object.keys(cache)
        .reduce((a, s) => {
        let t1 = (0, lib_1.removeZeroWidth)((0, str_util_1.toHalfWidth)(s));
        t1 = [
            /\s+/g,
            /[’'"]+/g,
            /[\\\/\[\]{}()~「」【】、,…・。―〈〉『』—《》（），﹑]+/g,
            /[<>]+/g,
            /[#.?!+·-]+/g,
            /[◆◇■□★▼＊☆◊§～*↣＝=═\-－─—　 ※…⋯◯○~∞&%]+/g,
            /[&=]+/g,
            /[×:@]+/g,
        ].reduce((t1, re) => {
            let t2 = t1.replace(re, '');
            if (t2.length) {
                return t2;
            }
            return t1;
        }, t1);
        a[t1] = a[t1] || [];
        a[t1].push(s);
        return a;
    }, {});
    let titles_list = Object.keys(titles);
    return {
        titles,
        titles_list,
    };
}
exports.buildTitleList = buildTitleList;
exports.default = buildCache;
//# sourceMappingURL=build.js.map