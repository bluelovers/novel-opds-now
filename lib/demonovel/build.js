"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJidWlsZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFHQSwrQ0FBcUQ7QUFDckQsaURBQXNEO0FBQ3RELDJEQUEyRztBQUMzRyx3Q0FBaUQ7QUFDakQsdUNBQXVDO0FBRXZDLDhEQUFvQztBQUNwQyx1Q0FBcUM7QUFFckMsU0FBZ0IsVUFBVTtJQUV6QixPQUFPLGNBQVMsRUFBRTtTQUNoQixJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFHYixJQUFJLEVBQUUsR0FBRyw2QkFBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRS9CLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUU5QixJQUFJLElBQUksR0FBRyxxQkFBVSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUF1QixDQUFDO1FBRS9ELElBQUksR0FBRyxJQUFJO2FBQ1QsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBRVosSUFBSSxJQUFJLEdBQUcscUJBQWEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRzlDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRTNCLE9BQU8sS0FBSyxDQUFBO1FBQ2IsQ0FBQyxDQUFDO2FBQ0QsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBRWQsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFDMUM7Z0JBQ0MsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQzthQUM3QztpQkFDSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQ2hEO2dCQUNDLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDVjtpQkFDSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQ2hEO2dCQUNDLE9BQU8sQ0FBQyxDQUFDO2FBQ1Q7WUFFRCxPQUFPLENBQUMsQ0FBQTtRQUNULENBQUMsQ0FBQyxDQUNGO1FBRUQsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDO1lBQ2xCLG9CQUFTLENBQUMsdUJBQWdCLENBQUMsWUFBWSxDQUFDLEVBQUUsSUFBSSxFQUFFO2dCQUMvQyxNQUFNLEVBQUUsQ0FBQzthQUNULENBQUM7U0FDRixDQUFDLENBQUE7SUFDSCxDQUFDLENBQUMsQ0FDRDtBQUNILENBQUM7QUFoREQsZ0NBZ0RDO0FBRUQsU0FBZ0IsY0FBYyxDQUFDLEtBQWtCO0lBRWhELElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQzdCLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUdoQixJQUFJLEVBQUUsR0FBRyxxQkFBZSxDQUFDLHNCQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV6QyxFQUFFLEdBQUc7WUFDSixNQUFNO1lBQ04sU0FBUztZQUNULHdDQUF3QztZQUN4QyxRQUFRO1lBQ1IsYUFBYTtZQUNiLHNDQUFzQztZQUN0QyxRQUFRO1lBQ1IsU0FBUztTQUNULENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO1lBR25CLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRTVCLElBQUksRUFBRSxDQUFDLE1BQU0sRUFDYjtnQkFDQyxPQUFPLEVBQUUsQ0FBQzthQUNWO1lBRUQsT0FBTyxFQUFFLENBQUE7UUFDVixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFUCxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNwQixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWQsT0FBTyxDQUFDLENBQUE7SUFDVCxDQUFDLEVBQUUsRUFBOEIsQ0FBQyxDQUNsQztJQUVELElBQUksV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFdEMsT0FBTztRQUNOLE1BQU07UUFDTixXQUFXO0tBQ1gsQ0FBQTtBQUNGLENBQUM7QUEzQ0Qsd0NBMkNDO0FBRUQsa0JBQWUsVUFBVSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8yLzMuXG4gKi9cbmltcG9ydCBsb2FkQ2FjaGUsIHsgZ2V0TG9jYWxGaWxlbmFtZSB9IGZyb20gJy4vbG9hZCc7XG5pbXBvcnQgeyBOb2RlTm92ZWxJbmZvIH0gZnJvbSAnbm9kZS1ub3ZlbC1pbmZvL2NsYXNzJztcbmltcG9ydCB7IElOb3ZlbFN0YXRDYWNoZSwgY3JlYXRlRnJvbUpTT04sIElGaWx0ZXJOb3ZlbERhdGEsIGNyZWF0ZU1vbWVudCB9IGZyb20gJ0Bub2RlLW5vdmVsL2NhY2hlLWxvYWRlcic7XG5pbXBvcnQgeyByZW1vdmVaZXJvV2lkdGggfSBmcm9tICd6ZXJvLXdpZHRoL2xpYic7XG5pbXBvcnQgeyB0b0hhbGZXaWR0aCB9IGZyb20gJ3N0ci11dGlsJztcbmltcG9ydCB7IElPdXRwdXRGaWxlIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgZG90VmFsdWVzMiBmcm9tICdkb3QtdmFsdWVzMidcbmltcG9ydCB7IHdyaXRlSlNPTiB9IGZyb20gJ2ZzLWV4dHJhJztcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkQ2FjaGUoKVxue1xuXHRyZXR1cm4gbG9hZENhY2hlKClcblx0XHQudGhlbih0YWJsZSA9PlxuXHRcdHtcblxuXHRcdFx0bGV0IG5jID0gY3JlYXRlRnJvbUpTT04odGFibGUpO1xuXG5cdFx0XHRsZXQgbm92ZWxzID0gbmMuZmlsdGVyTm92ZWwoKTtcblxuXHRcdFx0bGV0IGxpc3QgPSBkb3RWYWx1ZXMyLmdldChub3ZlbHMsIGAqLipgKSBhcyBJRmlsdGVyTm92ZWxEYXRhW107XG5cblx0XHRcdGxpc3QgPSBsaXN0XG5cdFx0XHRcdC5tYXAobm92ZWwgPT5cblx0XHRcdFx0e1xuXHRcdFx0XHRcdGxldCBpbmZvID0gTm9kZU5vdmVsSW5mby5jcmVhdGUobm92ZWwubWRjb25mKTtcblxuXHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRub3ZlbC50aXRsZSA9IGluZm8udGl0bGUoKTtcblxuXHRcdFx0XHRcdHJldHVybiBub3ZlbFxuXHRcdFx0XHR9KVxuXHRcdFx0XHQuc29ydCgoYSwgYikgPT5cblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlmIChiLmNhY2hlLmVwdWJfZGF0ZSAmJiBhLmNhY2hlLmVwdWJfZGF0ZSlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRyZXR1cm4gYi5jYWNoZS5lcHViX2RhdGUgLSBhLmNhY2hlLmVwdWJfZGF0ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSBpZiAoIWIuY2FjaGUuZXB1Yl9kYXRlICYmIGEuY2FjaGUuZXB1Yl9kYXRlKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSBpZiAoIWEuY2FjaGUuZXB1Yl9kYXRlICYmIGIuY2FjaGUuZXB1Yl9kYXRlKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiAwXG5cdFx0XHRcdH0pXG5cdFx0XHQ7XG5cblx0XHRcdHJldHVybiBQcm9taXNlLmFsbChbXG5cdFx0XHRcdHdyaXRlSlNPTihnZXRMb2NhbEZpbGVuYW1lKCdhcnJheS5qc29uJyksIGxpc3QsIHtcblx0XHRcdFx0XHRzcGFjZXM6IDIsXG5cdFx0XHRcdH0pLFxuXHRcdFx0XSlcblx0XHR9KVxuXHRcdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkVGl0bGVMaXN0KGNhY2hlOiBJT3V0cHV0RmlsZSlcbntcblx0bGV0IHRpdGxlcyA9IE9iamVjdC5rZXlzKGNhY2hlKVxuXHRcdC5yZWR1Y2UoKGEsIHMpID0+XG5cdFx0e1xuXG5cdFx0XHRsZXQgdDEgPSByZW1vdmVaZXJvV2lkdGgodG9IYWxmV2lkdGgocykpO1xuXG5cdFx0XHR0MSA9IFtcblx0XHRcdFx0L1xccysvZyxcblx0XHRcdFx0L1vigJknXCJdKy9nLFxuXHRcdFx0XHQvW1xcXFxcXC9cXFtcXF17fSgpfuOAjOOAjeOAkOOAkeOAgSzigKbjg7vjgILigJXjgIjjgInjgI7jgI/igJTjgIrjgIvvvIjvvInvvIzvuZFdKy9nLFxuXHRcdFx0XHQvWzw+XSsvZyxcblx0XHRcdFx0L1sjLj8hK8K3LV0rL2csXG5cdFx0XHRcdC9b4peG4peH4pag4pah4piF4pa877yK4piG4peKwqfvvZ4q4oaj77ydPeKVkFxcLe+8jeKUgOKAlOOAgCDigLvigKbii6/il6/il4t+4oieJiVdKy9nLFxuXHRcdFx0XHQvWyY9XSsvZyxcblx0XHRcdFx0L1vDlzpAXSsvZyxcblx0XHRcdF0ucmVkdWNlKCh0MSwgcmUpID0+XG5cdFx0XHR7XG5cblx0XHRcdFx0bGV0IHQyID0gdDEucmVwbGFjZShyZSwgJycpO1xuXG5cdFx0XHRcdGlmICh0Mi5sZW5ndGgpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gdDI7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gdDFcblx0XHRcdH0sIHQxKTtcblxuXHRcdFx0YVt0MV0gPSBhW3QxXSB8fCBbXTtcblx0XHRcdGFbdDFdLnB1c2gocyk7XG5cblx0XHRcdHJldHVybiBhXG5cdFx0fSwge30gYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nW10+KVxuXHQ7XG5cblx0bGV0IHRpdGxlc19saXN0ID0gT2JqZWN0LmtleXModGl0bGVzKTtcblxuXHRyZXR1cm4ge1xuXHRcdHRpdGxlcyxcblx0XHR0aXRsZXNfbGlzdCxcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBidWlsZENhY2hlXG4iXX0=