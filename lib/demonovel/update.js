"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
        logger_1.default.warn(e.message);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXBkYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBSUEsd0RBQWdDO0FBQ2hDLHVDQUFzRDtBQUN0RCxxREFBNkI7QUFFN0IsaUNBQTBDO0FBQzFDLG9EQUFpQztBQUNqQyxpRUFBMEM7QUFDMUMsMkRBQW1DO0FBRW5DLElBQUksR0FBRyxHQUFHLHNFQUFzRSxDQUFDO0FBRTFFLEtBQUssVUFBVSxXQUFXLENBQUMsS0FBZTtJQUVoRCxJQUFJLFNBQVMsR0FBRyx1QkFBZ0IsRUFBRSxDQUFDO0lBRW5DLE9BQU8sa0JBQVEsQ0FBQyxPQUFPLENBQUMsZUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3RDLElBQUksQ0FBa0IsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFO1FBQ25DLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLEVBQ25FO1lBQ0MsT0FBTyxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1NBQzFCO1FBQ0QsT0FBTyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUE7SUFDeEIsQ0FBQyxDQUFDO1NBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBRVYsSUFBSSxLQUFLLEdBQUcsa0JBQVEsRUFBRSxDQUFDO1FBRXZCLElBQUksS0FBSyxFQUNUO1lBQ0MsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ2xDO1FBRUQsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzdCLE9BQU8sVUFBVSxFQUFFO2FBQ2pCLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGdCQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBQ3pDLENBQUMsQ0FBQztTQUNELEtBQUssQ0FBa0IsQ0FBQyxDQUFDLEVBQUU7UUFDM0IsZ0JBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hCLE9BQU8sbUJBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUMzQixDQUFDLENBQUM7U0FDRCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxxQkFBVSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUN2RCxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxlQUFVLEVBQUUsQ0FBQyxDQUN0QjtBQUNILENBQUM7QUFoQ0Qsa0NBZ0NDO0FBRUQsU0FBUyxVQUFVO0lBRWxCLE9BQU8sa0JBQVE7U0FDYixPQUFPLENBQUMsZUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ25CLElBQUksQ0FBa0IsQ0FBQyxDQUFDLEVBQUU7UUFDMUIsT0FBTyxrQkFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDL0IsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNyQixJQUNBO2dCQUNDLGdCQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2FBQ2hDO1lBQ0QsT0FBTyxDQUFDLEVBQ1I7YUFFQztRQUNGLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQ0Q7QUFDSCxDQUFDO0FBRUQsa0JBQWUsV0FBVyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8yLzMuXG4gKi9cblxuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCB7IHN0YXQsIHJlYWRKU09OLCBvdXRwdXRKU09OIH0gZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IGZldGNoIGZyb20gJy4uL2ZldGNoJztcbmltcG9ydCB7IElOb3ZlbFN0YXRDYWNoZSB9IGZyb20gJ0Bub2RlLW5vdmVsL2NhY2hlLWxvYWRlcic7XG5pbXBvcnQgeyBnZXRMb2NhbEZpbGVuYW1lIH0gZnJvbSAnLi9sb2FkJztcbmltcG9ydCBidWlsZENhY2hlIGZyb20gJy4vYnVpbGQnO1xuaW1wb3J0IGNvbnNvbGUgZnJvbSAnZGVidWctY29sb3IyL2xvZ2dlcic7XG5pbXBvcnQgZ2V0UHJveHkgZnJvbSAnLi4vZ2V0UHJveHknO1xuXG5sZXQgdXJsID0gYGh0dHBzOi8vZ2l0bGFiLmNvbS9ub3ZlbC1ncm91cC90eHQtc291cmNlL3Jhdy9tYXN0ZXIvbm92ZWwtc3RhdC5qc29uYDtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUNhY2hlKGZvcmNlPzogYm9vbGVhbilcbntcblx0bGV0IGxvY2FsRmlsZSA9IGdldExvY2FsRmlsZW5hbWUoKTtcblxuXHRyZXR1cm4gQmx1ZWJpcmQucmVzb2x2ZShzdGF0KGxvY2FsRmlsZSkpXG5cdFx0LnRoZW48SU5vdmVsU3RhdENhY2hlPihhc3luYyAoc3QpID0+IHtcblx0XHRcdGlmICghZm9yY2UgJiYgc3QgJiYgKERhdGUubm93KCkgLSBzdC5tdGltZU1zKSA8IDEyICogNjAgKiA2MCAqIDEwMDApXG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiByZWFkSlNPTihsb2NhbEZpbGUpXG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoKVxuXHRcdH0pXG5cdFx0LmNhdGNoKGUgPT4ge1xuXG5cdFx0XHRsZXQgcHJveHkgPSBnZXRQcm94eSgpO1xuXG5cdFx0XHRpZiAocHJveHkpXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnNvbGUuZGVidWcoYHVzZSBwcm94eWAsIHByb3h5KTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc29sZS5kZWJ1Zyhg5ZiX6Kmm5pu05pawICR7dXJsfWApO1xuXHRcdFx0cmV0dXJuIGZldGNoQ2FjaGUoKVxuXHRcdFx0XHQudGFwKHYgPT4gY29uc29sZS5kZWJ1Zyhg5pu05paw5a6M5oiQICR7dXJsfWApKVxuXHRcdH0pXG5cdFx0LmNhdGNoPElOb3ZlbFN0YXRDYWNoZT4oZSA9PiB7XG5cdFx0XHRjb25zb2xlLndhcm4oZS5tZXNzYWdlKTtcblx0XHRcdHJldHVybiByZWFkSlNPTihsb2NhbEZpbGUpXG5cdFx0fSlcblx0XHQudGFwKGRhdGEgPT4gb3V0cHV0SlNPTihsb2NhbEZpbGUsIGRhdGEsIHsgc3BhY2VzOiAyIH0pKVxuXHRcdC50YXAodiA9PiBidWlsZENhY2hlKCkpXG5cdFx0O1xufVxuXG5mdW5jdGlvbiBmZXRjaENhY2hlKClcbntcblx0cmV0dXJuIEJsdWViaXJkXG5cdFx0LnJlc29sdmUoZmV0Y2godXJsKSlcblx0XHQudGhlbjxJTm92ZWxTdGF0Q2FjaGU+KHYgPT4ge1xuXHRcdFx0cmV0dXJuIEJsdWViaXJkLnJlc29sdmUodi5qc29uKCkpXG5cdFx0XHRcdC50YXBDYXRjaChhc3luYyAoZSkgPT4ge1xuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNvbnNvbGUucmVkLmRpcihhd2FpdCB2LnRleHQoKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNhdGNoIChlKVxuXHRcdFx0XHRcdHtcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHR9KVxuXHRcdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdXBkYXRlQ2FjaGVcblxuIl19