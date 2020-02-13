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
        return fetchCache();
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
            .tap(async (e) => {
            try {
                logger_1.default.red.dir(await v.text());
            }
            catch (e) {
            }
        });
    });
}
exports.default = updateCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXBkYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBSUEsd0RBQWdDO0FBQ2hDLHVDQUFzRDtBQUN0RCxxREFBNkI7QUFFN0IsaUNBQTBDO0FBQzFDLG9EQUFpQztBQUNqQyxpRUFBMEM7QUFDMUMsMkRBQW1DO0FBRW5DLElBQUksR0FBRyxHQUFHLHNFQUFzRSxDQUFDO0FBRTFFLEtBQUssVUFBVSxXQUFXLENBQUMsS0FBZTtJQUVoRCxJQUFJLFNBQVMsR0FBRyx1QkFBZ0IsRUFBRSxDQUFDO0lBRW5DLE9BQU8sa0JBQVEsQ0FBQyxPQUFPLENBQUMsZUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3RDLElBQUksQ0FBa0IsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFO1FBQ25DLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLEVBQ25FO1lBQ0MsT0FBTyxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1NBQzFCO1FBQ0QsT0FBTyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUE7SUFDeEIsQ0FBQyxDQUFDO1NBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBRVYsSUFBSSxLQUFLLEdBQUcsa0JBQVEsRUFBRSxDQUFDO1FBRXZCLElBQUksS0FBSyxFQUNUO1lBQ0MsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ2xDO1FBRUQsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzdCLE9BQU8sVUFBVSxFQUFFLENBQUE7SUFDcEIsQ0FBQyxDQUFDO1NBQ0QsS0FBSyxDQUFrQixDQUFDLENBQUMsRUFBRTtRQUMzQixnQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDeEIsT0FBTyxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQzNCLENBQUMsQ0FBQztTQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLHFCQUFVLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3ZELEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGVBQVUsRUFBRSxDQUFDLENBQ3RCO0FBQ0gsQ0FBQztBQS9CRCxrQ0ErQkM7QUFFRCxTQUFTLFVBQVU7SUFFbEIsT0FBTyxrQkFBUTtTQUNiLE9BQU8sQ0FBQyxlQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbkIsSUFBSSxDQUFrQixDQUFDLENBQUMsRUFBRTtRQUMxQixPQUFPLGtCQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUMvQixHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2hCLElBQ0E7Z0JBQ0MsZ0JBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7YUFDaEM7WUFDRCxPQUFPLENBQUMsRUFDUjthQUVDO1FBQ0YsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FDRDtBQUNILENBQUM7QUFFRCxrQkFBZSxXQUFXLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzIvMy5cbiAqL1xuXG5pbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHsgc3RhdCwgcmVhZEpTT04sIG91dHB1dEpTT04gfSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgZmV0Y2ggZnJvbSAnLi4vZmV0Y2gnO1xuaW1wb3J0IHsgSU5vdmVsU3RhdENhY2hlIH0gZnJvbSAnQG5vZGUtbm92ZWwvY2FjaGUtbG9hZGVyJztcbmltcG9ydCB7IGdldExvY2FsRmlsZW5hbWUgfSBmcm9tICcuL2xvYWQnO1xuaW1wb3J0IGJ1aWxkQ2FjaGUgZnJvbSAnLi9idWlsZCc7XG5pbXBvcnQgY29uc29sZSBmcm9tICdkZWJ1Zy1jb2xvcjIvbG9nZ2VyJztcbmltcG9ydCBnZXRQcm94eSBmcm9tICcuLi9nZXRQcm94eSc7XG5cbmxldCB1cmwgPSBgaHR0cHM6Ly9naXRsYWIuY29tL25vdmVsLWdyb3VwL3R4dC1zb3VyY2UvcmF3L21hc3Rlci9ub3ZlbC1zdGF0Lmpzb25gO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlQ2FjaGUoZm9yY2U/OiBib29sZWFuKVxue1xuXHRsZXQgbG9jYWxGaWxlID0gZ2V0TG9jYWxGaWxlbmFtZSgpO1xuXG5cdHJldHVybiBCbHVlYmlyZC5yZXNvbHZlKHN0YXQobG9jYWxGaWxlKSlcblx0XHQudGhlbjxJTm92ZWxTdGF0Q2FjaGU+KGFzeW5jIChzdCkgPT4ge1xuXHRcdFx0aWYgKCFmb3JjZSAmJiBzdCAmJiAoRGF0ZS5ub3coKSAtIHN0Lm10aW1lTXMpIDwgMTIgKiA2MCAqIDYwICogMTAwMClcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIHJlYWRKU09OKGxvY2FsRmlsZSlcblx0XHRcdH1cblx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdCgpXG5cdFx0fSlcblx0XHQuY2F0Y2goZSA9PiB7XG5cblx0XHRcdGxldCBwcm94eSA9IGdldFByb3h5KCk7XG5cblx0XHRcdGlmIChwcm94eSlcblx0XHRcdHtcblx0XHRcdFx0Y29uc29sZS5kZWJ1ZyhgdXNlIHByb3h5YCwgcHJveHkpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zb2xlLmRlYnVnKGDlmJfoqabmm7TmlrAgJHt1cmx9YCk7XG5cdFx0XHRyZXR1cm4gZmV0Y2hDYWNoZSgpXG5cdFx0fSlcblx0XHQuY2F0Y2g8SU5vdmVsU3RhdENhY2hlPihlID0+IHtcblx0XHRcdGNvbnNvbGUud2FybihlLm1lc3NhZ2UpO1xuXHRcdFx0cmV0dXJuIHJlYWRKU09OKGxvY2FsRmlsZSlcblx0XHR9KVxuXHRcdC50YXAoZGF0YSA9PiBvdXRwdXRKU09OKGxvY2FsRmlsZSwgZGF0YSwgeyBzcGFjZXM6IDIgfSkpXG5cdFx0LnRhcCh2ID0+IGJ1aWxkQ2FjaGUoKSlcblx0XHQ7XG59XG5cbmZ1bmN0aW9uIGZldGNoQ2FjaGUoKVxue1xuXHRyZXR1cm4gQmx1ZWJpcmRcblx0XHQucmVzb2x2ZShmZXRjaCh1cmwpKVxuXHRcdC50aGVuPElOb3ZlbFN0YXRDYWNoZT4odiA9PiB7XG5cdFx0XHRyZXR1cm4gQmx1ZWJpcmQucmVzb2x2ZSh2Lmpzb24oKSlcblx0XHRcdFx0LnRhcChhc3luYyAoZSkgPT4ge1xuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNvbnNvbGUucmVkLmRpcihhd2FpdCB2LnRleHQoKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNhdGNoIChlKVxuXHRcdFx0XHRcdHtcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHR9KVxuXHRcdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdXBkYXRlQ2FjaGVcblxuIl19