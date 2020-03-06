"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCache = void 0;
const bluebird_1 = __importDefault(require("bluebird"));
const fs_extra_1 = require("fs-extra");
const fetch_1 = __importDefault(require("../fetch"));
const load_1 = require("./load");
const build_1 = __importDefault(require("./build"));
const logger_1 = __importDefault(require("debug-color2/logger"));
const getProxy_1 = __importDefault(require("../getProxy"));
let url = `https://gitlab.com/novel-group/txt-source/raw/master/novel-stat.json`;
async function updateCache(force) {
    let localFile = load_1.getLocalFilename();
    return bluebird_1.default.resolve(fs_extra_1.stat(localFile))
        .then(async (st) => {
        if (!force && st && (Date.now() - st.mtimeMs) < 12 * 60 * 60 * 1000) {
            return fs_extra_1.readJSON(localFile);
        }
        return Promise.reject();
    })
        .catch(e => {
        let proxy = getProxy_1.default();
        if (proxy) {
            logger_1.default.debug(`use proxy`, proxy);
        }
        logger_1.default.debug(`嘗試更新 ${url}`);
        return fetchCache()
            .tap(v => logger_1.default.debug(`更新完成 ${url}`));
    })
        .catch(e => {
        logger_1.default.warn(e.message || e);
        return fs_extra_1.readJSON(localFile);
    })
        .tap(data => fs_extra_1.outputJSON(localFile, data, { spaces: 2 }))
        .tap(v => build_1.default());
}
exports.updateCache = updateCache;
function fetchCache() {
    return bluebird_1.default
        .resolve(fetch_1.default(url))
        .then(v => {
        return bluebird_1.default.resolve(v.json())
            .tapCatch(async (e) => {
            try {
                logger_1.default.red.dir(await v.text());
            }
            catch (e) {
            }
        });
    });
}
exports.default = updateCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXBkYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUlBLHdEQUFnQztBQUNoQyx1Q0FBc0Q7QUFDdEQscURBQTZCO0FBRTdCLGlDQUEwQztBQUMxQyxvREFBaUM7QUFDakMsaUVBQTBDO0FBQzFDLDJEQUFtQztBQUVuQyxJQUFJLEdBQUcsR0FBRyxzRUFBc0UsQ0FBQztBQUUxRSxLQUFLLFVBQVUsV0FBVyxDQUFDLEtBQWU7SUFFaEQsSUFBSSxTQUFTLEdBQUcsdUJBQWdCLEVBQUUsQ0FBQztJQUVuQyxPQUFPLGtCQUFRLENBQUMsT0FBTyxDQUFDLGVBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUN0QyxJQUFJLENBQWtCLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRTtRQUNuQyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxFQUNuRTtZQUNDLE9BQU8sbUJBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTtTQUMxQjtRQUNELE9BQU8sT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFBO0lBQ3hCLENBQUMsQ0FBQztTQUNELEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUVWLElBQUksS0FBSyxHQUFHLGtCQUFRLEVBQUUsQ0FBQztRQUV2QixJQUFJLEtBQUssRUFDVDtZQUNDLGdCQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNsQztRQUVELGdCQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUM3QixPQUFPLFVBQVUsRUFBRTthQUNqQixHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxnQkFBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUN6QyxDQUFDLENBQUM7U0FDRCxLQUFLLENBQWtCLENBQUMsQ0FBQyxFQUFFO1FBQzNCLGdCQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDN0IsT0FBTyxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQzNCLENBQUMsQ0FBQztTQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLHFCQUFVLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3ZELEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGVBQVUsRUFBRSxDQUFDLENBQ3RCO0FBQ0gsQ0FBQztBQWhDRCxrQ0FnQ0M7QUFFRCxTQUFTLFVBQVU7SUFFbEIsT0FBTyxrQkFBUTtTQUNiLE9BQU8sQ0FBQyxlQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbkIsSUFBSSxDQUFrQixDQUFDLENBQUMsRUFBRTtRQUMxQixPQUFPLGtCQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUMvQixRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JCLElBQ0E7Z0JBQ0MsZ0JBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7YUFDaEM7WUFDRCxPQUFPLENBQUMsRUFDUjthQUVDO1FBQ0YsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FDRDtBQUNILENBQUM7QUFFRCxrQkFBZSxXQUFXLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzIvMy5cbiAqL1xuXG5pbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHsgc3RhdCwgcmVhZEpTT04sIG91dHB1dEpTT04gfSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgZmV0Y2ggZnJvbSAnLi4vZmV0Y2gnO1xuaW1wb3J0IHsgSU5vdmVsU3RhdENhY2hlIH0gZnJvbSAnQG5vZGUtbm92ZWwvY2FjaGUtbG9hZGVyJztcbmltcG9ydCB7IGdldExvY2FsRmlsZW5hbWUgfSBmcm9tICcuL2xvYWQnO1xuaW1wb3J0IGJ1aWxkQ2FjaGUgZnJvbSAnLi9idWlsZCc7XG5pbXBvcnQgY29uc29sZSBmcm9tICdkZWJ1Zy1jb2xvcjIvbG9nZ2VyJztcbmltcG9ydCBnZXRQcm94eSBmcm9tICcuLi9nZXRQcm94eSc7XG5cbmxldCB1cmwgPSBgaHR0cHM6Ly9naXRsYWIuY29tL25vdmVsLWdyb3VwL3R4dC1zb3VyY2UvcmF3L21hc3Rlci9ub3ZlbC1zdGF0Lmpzb25gO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlQ2FjaGUoZm9yY2U/OiBib29sZWFuKVxue1xuXHRsZXQgbG9jYWxGaWxlID0gZ2V0TG9jYWxGaWxlbmFtZSgpO1xuXG5cdHJldHVybiBCbHVlYmlyZC5yZXNvbHZlKHN0YXQobG9jYWxGaWxlKSlcblx0XHQudGhlbjxJTm92ZWxTdGF0Q2FjaGU+KGFzeW5jIChzdCkgPT4ge1xuXHRcdFx0aWYgKCFmb3JjZSAmJiBzdCAmJiAoRGF0ZS5ub3coKSAtIHN0Lm10aW1lTXMpIDwgMTIgKiA2MCAqIDYwICogMTAwMClcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIHJlYWRKU09OKGxvY2FsRmlsZSlcblx0XHRcdH1cblx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdCgpXG5cdFx0fSlcblx0XHQuY2F0Y2goZSA9PiB7XG5cblx0XHRcdGxldCBwcm94eSA9IGdldFByb3h5KCk7XG5cblx0XHRcdGlmIChwcm94eSlcblx0XHRcdHtcblx0XHRcdFx0Y29uc29sZS5kZWJ1ZyhgdXNlIHByb3h5YCwgcHJveHkpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zb2xlLmRlYnVnKGDlmJfoqabmm7TmlrAgJHt1cmx9YCk7XG5cdFx0XHRyZXR1cm4gZmV0Y2hDYWNoZSgpXG5cdFx0XHRcdC50YXAodiA9PiBjb25zb2xlLmRlYnVnKGDmm7TmlrDlrozmiJAgJHt1cmx9YCkpXG5cdFx0fSlcblx0XHQuY2F0Y2g8SU5vdmVsU3RhdENhY2hlPihlID0+IHtcblx0XHRcdGNvbnNvbGUud2FybihlLm1lc3NhZ2UgfHwgZSk7XG5cdFx0XHRyZXR1cm4gcmVhZEpTT04obG9jYWxGaWxlKVxuXHRcdH0pXG5cdFx0LnRhcChkYXRhID0+IG91dHB1dEpTT04obG9jYWxGaWxlLCBkYXRhLCB7IHNwYWNlczogMiB9KSlcblx0XHQudGFwKHYgPT4gYnVpbGRDYWNoZSgpKVxuXHRcdDtcbn1cblxuZnVuY3Rpb24gZmV0Y2hDYWNoZSgpXG57XG5cdHJldHVybiBCbHVlYmlyZFxuXHRcdC5yZXNvbHZlKGZldGNoKHVybCkpXG5cdFx0LnRoZW48SU5vdmVsU3RhdENhY2hlPih2ID0+IHtcblx0XHRcdHJldHVybiBCbHVlYmlyZC5yZXNvbHZlKHYuanNvbigpKVxuXHRcdFx0XHQudGFwQ2F0Y2goYXN5bmMgKGUpID0+IHtcblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjb25zb2xlLnJlZC5kaXIoYXdhaXQgdi50ZXh0KCkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZSlcblx0XHRcdFx0XHR7XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0fSlcblx0XHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVwZGF0ZUNhY2hlXG5cbiJdfQ==