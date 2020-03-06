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
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJidWlsZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0EsK0NBQXFEO0FBQ3JELGlEQUFzRDtBQUN0RCwyREFBMkc7QUFDM0csd0NBQWlEO0FBQ2pELHVDQUF1QztBQUV2Qyw4REFBb0M7QUFDcEMsdUNBQXFDO0FBRXJDLFNBQWdCLFVBQVU7SUFFekIsT0FBTyxjQUFTLEVBQUU7U0FDaEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBR2IsSUFBSSxFQUFFLEdBQUcsNkJBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUvQixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7UUFFOUIsSUFBSSxJQUFJLEdBQUcscUJBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBMkIsQ0FBQztRQUVuRSxJQUFJLEdBQUcsSUFBSTthQUNULEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUVaLElBQUksSUFBSSxHQUFHLHFCQUFhLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUU5QyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUUzQixLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUUvQixPQUFPLEtBQUssQ0FBQTtRQUNiLENBQUMsQ0FBQzthQUNELElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUVkLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQzFDO2dCQUNDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7YUFDN0M7aUJBQ0ksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUNoRDtnQkFDQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQ1Y7aUJBQ0ksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUNoRDtnQkFDQyxPQUFPLENBQUMsQ0FBQzthQUNUO1lBRUQsT0FBTyxDQUFDLENBQUE7UUFDVCxDQUFDLENBQUMsQ0FDRjtRQUVELE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQztZQUNsQixvQkFBUyxDQUFDLHVCQUFnQixDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRTtnQkFDL0MsTUFBTSxFQUFFLENBQUM7YUFDVCxDQUFDO1NBQ0YsQ0FBQyxDQUFBO0lBQ0gsQ0FBQyxDQUFDLENBQ0Q7QUFDSCxDQUFDO0FBakRELGdDQWlEQztBQUVELFNBQWdCLGNBQWMsQ0FBQyxLQUFrQjtJQUVoRCxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztTQUM3QixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFHaEIsSUFBSSxFQUFFLEdBQUcscUJBQWUsQ0FBQyxzQkFBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFekMsRUFBRSxHQUFHO1lBQ0osTUFBTTtZQUNOLFNBQVM7WUFDVCx3Q0FBd0M7WUFDeEMsUUFBUTtZQUNSLGFBQWE7WUFDYixzQ0FBc0M7WUFDdEMsUUFBUTtZQUNSLFNBQVM7U0FDVCxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtZQUduQixJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUU1QixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQ2I7Z0JBQ0MsT0FBTyxFQUFFLENBQUM7YUFDVjtZQUVELE9BQU8sRUFBRSxDQUFBO1FBQ1YsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRVAsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDcEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVkLE9BQU8sQ0FBQyxDQUFBO0lBQ1QsQ0FBQyxFQUFFLEVBQThCLENBQUMsQ0FDbEM7SUFFRCxJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXRDLE9BQU87UUFDTixNQUFNO1FBQ04sV0FBVztLQUNYLENBQUE7QUFDRixDQUFDO0FBM0NELHdDQTJDQztBQUVELGtCQUFlLFVBQVUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMjAvMi8zLlxuICovXG5pbXBvcnQgbG9hZENhY2hlLCB7IGdldExvY2FsRmlsZW5hbWUgfSBmcm9tICcuL2xvYWQnO1xuaW1wb3J0IHsgTm9kZU5vdmVsSW5mbyB9IGZyb20gJ25vZGUtbm92ZWwtaW5mby9jbGFzcyc7XG5pbXBvcnQgeyBJTm92ZWxTdGF0Q2FjaGUsIGNyZWF0ZUZyb21KU09OLCBJRmlsdGVyTm92ZWxEYXRhLCBjcmVhdGVNb21lbnQgfSBmcm9tICdAbm9kZS1ub3ZlbC9jYWNoZS1sb2FkZXInO1xuaW1wb3J0IHsgcmVtb3ZlWmVyb1dpZHRoIH0gZnJvbSAnemVyby13aWR0aC9saWInO1xuaW1wb3J0IHsgdG9IYWxmV2lkdGggfSBmcm9tICdzdHItdXRpbCc7XG5pbXBvcnQgeyBJT3V0cHV0RmlsZSwgSUZpbHRlck5vdmVsRGF0YVBsdXMgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCBkb3RWYWx1ZXMyIGZyb20gJ2RvdC12YWx1ZXMyJ1xuaW1wb3J0IHsgd3JpdGVKU09OIH0gZnJvbSAnZnMtZXh0cmEnO1xuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRDYWNoZSgpXG57XG5cdHJldHVybiBsb2FkQ2FjaGUoKVxuXHRcdC50aGVuKHRhYmxlID0+XG5cdFx0e1xuXG5cdFx0XHRsZXQgbmMgPSBjcmVhdGVGcm9tSlNPTih0YWJsZSk7XG5cblx0XHRcdGxldCBub3ZlbHMgPSBuYy5maWx0ZXJOb3ZlbCgpO1xuXG5cdFx0XHRsZXQgbGlzdCA9IGRvdFZhbHVlczIuZ2V0KG5vdmVscywgYCouKmApIGFzIElGaWx0ZXJOb3ZlbERhdGFQbHVzW107XG5cblx0XHRcdGxpc3QgPSBsaXN0XG5cdFx0XHRcdC5tYXAobm92ZWwgPT5cblx0XHRcdFx0e1xuXHRcdFx0XHRcdGxldCBpbmZvID0gTm9kZU5vdmVsSW5mby5jcmVhdGUobm92ZWwubWRjb25mKTtcblxuXHRcdFx0XHRcdG5vdmVsLnRpdGxlID0gaW5mby50aXRsZSgpO1xuXG5cdFx0XHRcdFx0bm92ZWwuYXV0aG9ycyA9IGluZm8uYXV0aG9ycygpO1xuXG5cdFx0XHRcdFx0cmV0dXJuIG5vdmVsXG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5zb3J0KChhLCBiKSA9PlxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWYgKGIuY2FjaGUuZXB1Yl9kYXRlICYmIGEuY2FjaGUuZXB1Yl9kYXRlKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHJldHVybiBiLmNhY2hlLmVwdWJfZGF0ZSAtIGEuY2FjaGUuZXB1Yl9kYXRlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGlmICghYi5jYWNoZS5lcHViX2RhdGUgJiYgYS5jYWNoZS5lcHViX2RhdGUpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0cmV0dXJuIC0xO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGlmICghYS5jYWNoZS5lcHViX2RhdGUgJiYgYi5jYWNoZS5lcHViX2RhdGUpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIDBcblx0XHRcdFx0fSlcblx0XHRcdDtcblxuXHRcdFx0cmV0dXJuIFByb21pc2UuYWxsKFtcblx0XHRcdFx0d3JpdGVKU09OKGdldExvY2FsRmlsZW5hbWUoJ2FycmF5Lmpzb24nKSwgbGlzdCwge1xuXHRcdFx0XHRcdHNwYWNlczogMixcblx0XHRcdFx0fSksXG5cdFx0XHRdKVxuXHRcdH0pXG5cdFx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRUaXRsZUxpc3QoY2FjaGU6IElPdXRwdXRGaWxlKVxue1xuXHRsZXQgdGl0bGVzID0gT2JqZWN0LmtleXMoY2FjaGUpXG5cdFx0LnJlZHVjZSgoYSwgcykgPT5cblx0XHR7XG5cblx0XHRcdGxldCB0MSA9IHJlbW92ZVplcm9XaWR0aCh0b0hhbGZXaWR0aChzKSk7XG5cblx0XHRcdHQxID0gW1xuXHRcdFx0XHQvXFxzKy9nLFxuXHRcdFx0XHQvW+KAmSdcIl0rL2csXG5cdFx0XHRcdC9bXFxcXFxcL1xcW1xcXXt9KCl+44CM44CN44CQ44CR44CBLOKApuODu+OAguKAleOAiOOAieOAjuOAj+KAlOOAiuOAi++8iO+8ie+8jO+5kV0rL2csXG5cdFx0XHRcdC9bPD5dKy9nLFxuXHRcdFx0XHQvWyMuPyErwrctXSsvZyxcblx0XHRcdFx0L1vil4bil4filqDilqHimIXilrzvvIrimIbil4rCp++9nirihqPvvJ094pWQXFwt77yN4pSA4oCU44CAIOKAu+KApuKLr+KXr+KXi37iiJ4mJV0rL2csXG5cdFx0XHRcdC9bJj1dKy9nLFxuXHRcdFx0XHQvW8OXOkBdKy9nLFxuXHRcdFx0XS5yZWR1Y2UoKHQxLCByZSkgPT5cblx0XHRcdHtcblxuXHRcdFx0XHRsZXQgdDIgPSB0MS5yZXBsYWNlKHJlLCAnJyk7XG5cblx0XHRcdFx0aWYgKHQyLmxlbmd0aClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiB0Mjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB0MVxuXHRcdFx0fSwgdDEpO1xuXG5cdFx0XHRhW3QxXSA9IGFbdDFdIHx8IFtdO1xuXHRcdFx0YVt0MV0ucHVzaChzKTtcblxuXHRcdFx0cmV0dXJuIGFcblx0XHR9LCB7fSBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmdbXT4pXG5cdDtcblxuXHRsZXQgdGl0bGVzX2xpc3QgPSBPYmplY3Qua2V5cyh0aXRsZXMpO1xuXG5cdHJldHVybiB7XG5cdFx0dGl0bGVzLFxuXHRcdHRpdGxlc19saXN0LFxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJ1aWxkQ2FjaGVcbiJdfQ==