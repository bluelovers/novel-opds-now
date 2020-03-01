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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJidWlsZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQSwrQ0FBcUQ7QUFDckQsaURBQXNEO0FBQ3RELDJEQUEyRztBQUMzRyx3Q0FBaUQ7QUFDakQsdUNBQXVDO0FBRXZDLDhEQUFvQztBQUNwQyx1Q0FBcUM7QUFFckMsU0FBZ0IsVUFBVTtJQUV6QixPQUFPLGNBQVMsRUFBRTtTQUNoQixJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFHYixJQUFJLEVBQUUsR0FBRyw2QkFBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRS9CLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUU5QixJQUFJLElBQUksR0FBRyxxQkFBVSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUEyQixDQUFDO1FBRW5FLElBQUksR0FBRyxJQUFJO2FBQ1QsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBRVosSUFBSSxJQUFJLEdBQUcscUJBQWEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRTlDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRTNCLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRS9CLE9BQU8sS0FBSyxDQUFBO1FBQ2IsQ0FBQyxDQUFDO2FBQ0QsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBRWQsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFDMUM7Z0JBQ0MsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQzthQUM3QztpQkFDSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQ2hEO2dCQUNDLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDVjtpQkFDSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQ2hEO2dCQUNDLE9BQU8sQ0FBQyxDQUFDO2FBQ1Q7WUFFRCxPQUFPLENBQUMsQ0FBQTtRQUNULENBQUMsQ0FBQyxDQUNGO1FBRUQsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDO1lBQ2xCLG9CQUFTLENBQUMsdUJBQWdCLENBQUMsWUFBWSxDQUFDLEVBQUUsSUFBSSxFQUFFO2dCQUMvQyxNQUFNLEVBQUUsQ0FBQzthQUNULENBQUM7U0FDRixDQUFDLENBQUE7SUFDSCxDQUFDLENBQUMsQ0FDRDtBQUNILENBQUM7QUFqREQsZ0NBaURDO0FBRUQsU0FBZ0IsY0FBYyxDQUFDLEtBQWtCO0lBRWhELElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQzdCLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUdoQixJQUFJLEVBQUUsR0FBRyxxQkFBZSxDQUFDLHNCQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV6QyxFQUFFLEdBQUc7WUFDSixNQUFNO1lBQ04sU0FBUztZQUNULHdDQUF3QztZQUN4QyxRQUFRO1lBQ1IsYUFBYTtZQUNiLHNDQUFzQztZQUN0QyxRQUFRO1lBQ1IsU0FBUztTQUNULENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO1lBR25CLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRTVCLElBQUksRUFBRSxDQUFDLE1BQU0sRUFDYjtnQkFDQyxPQUFPLEVBQUUsQ0FBQzthQUNWO1lBRUQsT0FBTyxFQUFFLENBQUE7UUFDVixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFUCxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNwQixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWQsT0FBTyxDQUFDLENBQUE7SUFDVCxDQUFDLEVBQUUsRUFBOEIsQ0FBQyxDQUNsQztJQUVELElBQUksV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFdEMsT0FBTztRQUNOLE1BQU07UUFDTixXQUFXO0tBQ1gsQ0FBQTtBQUNGLENBQUM7QUEzQ0Qsd0NBMkNDO0FBRUQsa0JBQWUsVUFBVSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8yLzMuXG4gKi9cbmltcG9ydCBsb2FkQ2FjaGUsIHsgZ2V0TG9jYWxGaWxlbmFtZSB9IGZyb20gJy4vbG9hZCc7XG5pbXBvcnQgeyBOb2RlTm92ZWxJbmZvIH0gZnJvbSAnbm9kZS1ub3ZlbC1pbmZvL2NsYXNzJztcbmltcG9ydCB7IElOb3ZlbFN0YXRDYWNoZSwgY3JlYXRlRnJvbUpTT04sIElGaWx0ZXJOb3ZlbERhdGEsIGNyZWF0ZU1vbWVudCB9IGZyb20gJ0Bub2RlLW5vdmVsL2NhY2hlLWxvYWRlcic7XG5pbXBvcnQgeyByZW1vdmVaZXJvV2lkdGggfSBmcm9tICd6ZXJvLXdpZHRoL2xpYic7XG5pbXBvcnQgeyB0b0hhbGZXaWR0aCB9IGZyb20gJ3N0ci11dGlsJztcbmltcG9ydCB7IElPdXRwdXRGaWxlLCBJRmlsdGVyTm92ZWxEYXRhUGx1cyB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IGRvdFZhbHVlczIgZnJvbSAnZG90LXZhbHVlczInXG5pbXBvcnQgeyB3cml0ZUpTT04gfSBmcm9tICdmcy1leHRyYSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZENhY2hlKClcbntcblx0cmV0dXJuIGxvYWRDYWNoZSgpXG5cdFx0LnRoZW4odGFibGUgPT5cblx0XHR7XG5cblx0XHRcdGxldCBuYyA9IGNyZWF0ZUZyb21KU09OKHRhYmxlKTtcblxuXHRcdFx0bGV0IG5vdmVscyA9IG5jLmZpbHRlck5vdmVsKCk7XG5cblx0XHRcdGxldCBsaXN0ID0gZG90VmFsdWVzMi5nZXQobm92ZWxzLCBgKi4qYCkgYXMgSUZpbHRlck5vdmVsRGF0YVBsdXNbXTtcblxuXHRcdFx0bGlzdCA9IGxpc3Rcblx0XHRcdFx0Lm1hcChub3ZlbCA9PlxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bGV0IGluZm8gPSBOb2RlTm92ZWxJbmZvLmNyZWF0ZShub3ZlbC5tZGNvbmYpO1xuXG5cdFx0XHRcdFx0bm92ZWwudGl0bGUgPSBpbmZvLnRpdGxlKCk7XG5cblx0XHRcdFx0XHRub3ZlbC5hdXRob3JzID0gaW5mby5hdXRob3JzKCk7XG5cblx0XHRcdFx0XHRyZXR1cm4gbm92ZWxcblx0XHRcdFx0fSlcblx0XHRcdFx0LnNvcnQoKGEsIGIpID0+XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZiAoYi5jYWNoZS5lcHViX2RhdGUgJiYgYS5jYWNoZS5lcHViX2RhdGUpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0cmV0dXJuIGIuY2FjaGUuZXB1Yl9kYXRlIC0gYS5jYWNoZS5lcHViX2RhdGU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgaWYgKCFiLmNhY2hlLmVwdWJfZGF0ZSAmJiBhLmNhY2hlLmVwdWJfZGF0ZSlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRyZXR1cm4gLTE7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgaWYgKCFhLmNhY2hlLmVwdWJfZGF0ZSAmJiBiLmNhY2hlLmVwdWJfZGF0ZSlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gMFxuXHRcdFx0XHR9KVxuXHRcdFx0O1xuXG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5hbGwoW1xuXHRcdFx0XHR3cml0ZUpTT04oZ2V0TG9jYWxGaWxlbmFtZSgnYXJyYXkuanNvbicpLCBsaXN0LCB7XG5cdFx0XHRcdFx0c3BhY2VzOiAyLFxuXHRcdFx0XHR9KSxcblx0XHRcdF0pXG5cdFx0fSlcblx0XHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFRpdGxlTGlzdChjYWNoZTogSU91dHB1dEZpbGUpXG57XG5cdGxldCB0aXRsZXMgPSBPYmplY3Qua2V5cyhjYWNoZSlcblx0XHQucmVkdWNlKChhLCBzKSA9PlxuXHRcdHtcblxuXHRcdFx0bGV0IHQxID0gcmVtb3ZlWmVyb1dpZHRoKHRvSGFsZldpZHRoKHMpKTtcblxuXHRcdFx0dDEgPSBbXG5cdFx0XHRcdC9cXHMrL2csXG5cdFx0XHRcdC9b4oCZJ1wiXSsvZyxcblx0XHRcdFx0L1tcXFxcXFwvXFxbXFxde30oKX7jgIzjgI3jgJDjgJHjgIEs4oCm44O744CC4oCV44CI44CJ44CO44CP4oCU44CK44CL77yI77yJ77yM77mRXSsvZyxcblx0XHRcdFx0L1s8Pl0rL2csXG5cdFx0XHRcdC9bIy4/ISvCty1dKy9nLFxuXHRcdFx0XHQvW+KXhuKXh+KWoOKWoeKYheKWvO+8iuKYhuKXisKn772eKuKGo++8nT3ilZBcXC3vvI3ilIDigJTjgIAg4oC74oCm4ouv4pev4peLfuKIniYlXSsvZyxcblx0XHRcdFx0L1smPV0rL2csXG5cdFx0XHRcdC9bw5c6QF0rL2csXG5cdFx0XHRdLnJlZHVjZSgodDEsIHJlKSA9PlxuXHRcdFx0e1xuXG5cdFx0XHRcdGxldCB0MiA9IHQxLnJlcGxhY2UocmUsICcnKTtcblxuXHRcdFx0XHRpZiAodDIubGVuZ3RoKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIHQyO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHQxXG5cdFx0XHR9LCB0MSk7XG5cblx0XHRcdGFbdDFdID0gYVt0MV0gfHwgW107XG5cdFx0XHRhW3QxXS5wdXNoKHMpO1xuXG5cdFx0XHRyZXR1cm4gYVxuXHRcdH0sIHt9IGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZ1tdPilcblx0O1xuXG5cdGxldCB0aXRsZXNfbGlzdCA9IE9iamVjdC5rZXlzKHRpdGxlcyk7XG5cblx0cmV0dXJuIHtcblx0XHR0aXRsZXMsXG5cdFx0dGl0bGVzX2xpc3QsXG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgYnVpbGRDYWNoZVxuIl19