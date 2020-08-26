"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTitleList = exports.buildCache = void 0;
const load_1 = __importStar(require("./load"));
const class_1 = require("node-novel-info/class");
const cache_loader_1 = require("@node-novel/cache-loader");
const lib_1 = require("zero-width/lib");
const str_util_1 = require("str-util");
const dot_values2_1 = __importDefault(require("dot-values2"));
const fs_extra_1 = require("fs-extra");
function buildCache() {
    return load_1.default()
        .then(table => {
        let nc = cache_loader_1.createFromJSON(table);
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
            fs_extra_1.writeJSON(load_1.getLocalFilename('array.json'), list, {
                spaces: 2,
            }),
        ]);
    });
}
exports.buildCache = buildCache;
function buildTitleList(cache) {
    let titles = Object.keys(cache)
        .reduce((a, s) => {
        let t1 = lib_1.removeZeroWidth(str_util_1.toHalfWidth(s));
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