"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const bluebird_1 = __importDefault(require("bluebird"));
const fs_extra_1 = require("fs-extra");
const fetch_1 = __importDefault(require("../fetch"));
const build_1 = __importDefault(require("./build"));
const logger_1 = __importDefault(require("debug-color2/logger"));
const getProxy_1 = __importDefault(require("../getProxy"));
function updateCacheAll(force) {
    return bluebird_1.default.all(Object.keys(types_1.id_titles_map)
        .reduce((a, b) => {
        a.push(updateCache(b, types_1.id_titles_map, force));
        a.push(updateCache(b, types_1.id_update_map, force));
        a.push(updateCache(b, types_1.id_chapters_map, force));
        return a;
    }, []))
        .then(v => build_1.default());
}
exports.updateCacheAll = updateCacheAll;
async function updateCache(siteID, map, force) {
    let localFile = types_1.getLocalFilename(siteID, map);
    return bluebird_1.default.resolve(fs_extra_1.stat(localFile))
        .then(async (st) => {
        if (!force && st && (Date.now() - st.mtimeMs) < 12 * 3600 * 1000) {
            return fs_extra_1.readJSON(localFile);
        }
        return Promise.reject();
    })
        .catch(e => {
        let proxy = getProxy_1.default();
        if (proxy) {
            logger_1.default.debug(`use proxy`, proxy);
        }
        logger_1.default.debug(`[${siteID}] 嘗試更新 ${map[siteID]}`);
        return fetchCache(siteID, map);
    })
        .catch(e => {
        logger_1.default.warn(e.code, e.message);
        return fs_extra_1.readJSON(localFile);
    })
        .catch(e => {
        logger_1.default.warn(e.message);
        let moduleFile = `${types_1.pathPrefix.module}${map[siteID]}`;
        return Promise.resolve().then(() => __importStar(require(moduleFile))).then(v => v.default || v);
    })
        .then(data => fs_extra_1.outputJSON(localFile, data, { spaces: 2 }));
}
exports.updateCache = updateCache;
function fetchCache(siteID, map) {
    return bluebird_1.default
        .resolve(fetch_1.default(`${types_1.pathPrefix.github}${map[siteID]}`))
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
exports.fetchCache = fetchCache;
exports.default = updateCacheAll;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXBkYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUdBLG1DQUFnSDtBQUNoSCx3REFBZ0M7QUFDaEMsdUNBQTZFO0FBRTdFLHFEQUE2QjtBQUM3QixvREFBbUM7QUFDbkMsaUVBQTBDO0FBQzFDLDJEQUFtQztBQUVuQyxTQUFnQixjQUFjLENBQUMsS0FBZTtJQUU3QyxPQUFPLGtCQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMscUJBQWEsQ0FBQztTQUM1QyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFHLEVBQUU7UUFFakIsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBUSxFQUFFLHFCQUFhLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFRLEVBQUUscUJBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQVEsRUFBRSx1QkFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFdEQsT0FBTyxDQUFDLENBQUE7SUFDVCxDQUFDLEVBQUUsRUFBd0IsQ0FBQyxDQUFDO1NBQzVCLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGVBQVksRUFBRSxDQUFDLENBQUE7QUFDNUIsQ0FBQztBQVpELHdDQVlDO0FBRU0sS0FBSyxVQUFVLFdBQVcsQ0FBQyxNQUFnQixFQUFFLEdBQTZCLEVBQUUsS0FBZTtJQUVqRyxJQUFJLFNBQVMsR0FBRyx3QkFBZ0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFOUMsT0FBTyxrQkFBUSxDQUFDLE9BQU8sQ0FBQyxlQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDdEMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRTtRQUNsQixJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksR0FBRyxJQUFJLEVBQ2hFO1lBQ0MsT0FBTyxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1NBQzFCO1FBQ0QsT0FBTyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUE7SUFDeEIsQ0FBQyxDQUFDO1NBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ1YsSUFBSSxLQUFLLEdBQUcsa0JBQVEsRUFBRSxDQUFDO1FBRXZCLElBQUksS0FBSyxFQUNUO1lBQ0MsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ2xDO1FBQ0QsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxNQUFNLFVBQVUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNqRCxPQUFPLFVBQVUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUE7SUFDL0IsQ0FBQyxDQUFDO1NBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBRVYsZ0JBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFaEMsT0FBTyxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQzNCLENBQUMsQ0FBQztTQUNELEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNWLGdCQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUN2QixJQUFJLFVBQVUsR0FBRyxHQUFHLGtCQUFVLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQ3RELE9BQU8sa0RBQU8sVUFBVSxJQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUE7SUFDcEQsQ0FBQyxDQUFDO1NBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMscUJBQVUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FDekQ7QUFDRixDQUFDO0FBbkNELGtDQW1DQztBQUVELFNBQWdCLFVBQVUsQ0FBSSxNQUFnQixFQUFFLEdBQTZCO0lBRTVFLE9BQU8sa0JBQVE7U0FDYixPQUFPLENBQUMsZUFBSyxDQUFDLEdBQUcsa0JBQVUsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNwRCxJQUFJLENBQUksQ0FBQyxDQUFDLEVBQUU7UUFDWixPQUFPLGtCQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUMvQixHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2hCLElBQ0E7Z0JBQ0MsZ0JBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7YUFDaEM7WUFDRCxPQUFPLENBQUMsRUFDUjthQUVDO1FBQ0YsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FDRDtBQUNILENBQUM7QUFsQkQsZ0NBa0JDO0FBRUQsa0JBQWUsY0FBYyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8yLzEuXG4gKi9cbmltcG9ydCB7IElTaXRlSURzLCBwYXRoUHJlZml4LCBpZF90aXRsZXNfbWFwLCBpZF91cGRhdGVfbWFwLCBnZXRMb2NhbEZpbGVuYW1lLCBpZF9jaGFwdGVyc19tYXAgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgeyBwYXRoRXhpc3RzLCBzdGF0LCByZWFkSlNPTiwgd3JpdGVKU09OLCBvdXRwdXRKU09OIH0gZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHsgYmFzZW5hbWUgfSBmcm9tICdwYXRoJztcbmltcG9ydCBmZXRjaCBmcm9tICcuLi9mZXRjaCc7XG5pbXBvcnQgYnVpbGRTb3J0QWxsIGZyb20gJy4vYnVpbGQnO1xuaW1wb3J0IGNvbnNvbGUgZnJvbSAnZGVidWctY29sb3IyL2xvZ2dlcic7XG5pbXBvcnQgZ2V0UHJveHkgZnJvbSAnLi4vZ2V0UHJveHknO1xuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQ2FjaGVBbGwoZm9yY2U/OiBib29sZWFuKVxue1xuXHRyZXR1cm4gQmx1ZWJpcmQuYWxsKE9iamVjdC5rZXlzKGlkX3RpdGxlc19tYXApXG5cdFx0LnJlZHVjZSgoYSwgYiApID0+IHtcblxuXHRcdFx0YS5wdXNoKHVwZGF0ZUNhY2hlKGIgYXMgYW55LCBpZF90aXRsZXNfbWFwLCBmb3JjZSkpO1xuXHRcdFx0YS5wdXNoKHVwZGF0ZUNhY2hlKGIgYXMgYW55LCBpZF91cGRhdGVfbWFwLCBmb3JjZSkpO1xuXHRcdFx0YS5wdXNoKHVwZGF0ZUNhY2hlKGIgYXMgYW55LCBpZF9jaGFwdGVyc19tYXAsIGZvcmNlKSk7XG5cblx0XHRcdHJldHVybiBhXG5cdFx0fSwgW10gYXMgUHJvbWlzZTx1bmtub3duPltdKSlcblx0XHQudGhlbih2ID0+IGJ1aWxkU29ydEFsbCgpKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlQ2FjaGUoc2l0ZUlEOiBJU2l0ZUlEcywgbWFwOiBSZWNvcmQ8SVNpdGVJRHMsIHN0cmluZz4sIGZvcmNlPzogYm9vbGVhbilcbntcblx0bGV0IGxvY2FsRmlsZSA9IGdldExvY2FsRmlsZW5hbWUoc2l0ZUlELCBtYXApO1xuXG5cdHJldHVybiBCbHVlYmlyZC5yZXNvbHZlKHN0YXQobG9jYWxGaWxlKSlcblx0XHQudGhlbihhc3luYyAoc3QpID0+IHtcblx0XHRcdGlmICghZm9yY2UgJiYgc3QgJiYgKERhdGUubm93KCkgLSBzdC5tdGltZU1zKSA8IDEyICogMzYwMCAqIDEwMDApXG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiByZWFkSlNPTihsb2NhbEZpbGUpXG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoKVxuXHRcdH0pXG5cdFx0LmNhdGNoKGUgPT4ge1xuXHRcdFx0bGV0IHByb3h5ID0gZ2V0UHJveHkoKTtcblxuXHRcdFx0aWYgKHByb3h5KVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zb2xlLmRlYnVnKGB1c2UgcHJveHlgLCBwcm94eSk7XG5cdFx0XHR9XG5cdFx0XHRjb25zb2xlLmRlYnVnKGBbJHtzaXRlSUR9XSDlmJfoqabmm7TmlrAgJHttYXBbc2l0ZUlEXX1gKTtcblx0XHRcdHJldHVybiBmZXRjaENhY2hlKHNpdGVJRCwgbWFwKVxuXHRcdH0pXG5cdFx0LmNhdGNoKGUgPT4ge1xuXG5cdFx0XHRjb25zb2xlLndhcm4oZS5jb2RlLCBlLm1lc3NhZ2UpO1xuXG5cdFx0XHRyZXR1cm4gcmVhZEpTT04obG9jYWxGaWxlKVxuXHRcdH0pXG5cdFx0LmNhdGNoKGUgPT4ge1xuXHRcdFx0Y29uc29sZS53YXJuKGUubWVzc2FnZSlcblx0XHRcdGxldCBtb2R1bGVGaWxlID0gYCR7cGF0aFByZWZpeC5tb2R1bGV9JHttYXBbc2l0ZUlEXX1gO1xuXHRcdFx0cmV0dXJuIGltcG9ydChtb2R1bGVGaWxlKS50aGVuKHYgPT4gdi5kZWZhdWx0IHx8IHYpXG5cdFx0fSlcblx0XHQudGhlbihkYXRhID0+IG91dHB1dEpTT04obG9jYWxGaWxlLCBkYXRhLCB7IHNwYWNlczogMiB9KSlcblx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hDYWNoZTxUPihzaXRlSUQ6IElTaXRlSURzLCBtYXA6IFJlY29yZDxJU2l0ZUlEcywgc3RyaW5nPilcbntcblx0cmV0dXJuIEJsdWViaXJkXG5cdFx0LnJlc29sdmUoZmV0Y2goYCR7cGF0aFByZWZpeC5naXRodWJ9JHttYXBbc2l0ZUlEXX1gKSlcblx0XHQudGhlbjxUPih2ID0+IHtcblx0XHRcdHJldHVybiBCbHVlYmlyZC5yZXNvbHZlKHYuanNvbigpKVxuXHRcdFx0XHQudGFwKGFzeW5jIChlKSA9PiB7XG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc29sZS5yZWQuZGlyKGF3YWl0IHYudGV4dCgpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2F0Y2ggKGUpXG5cdFx0XHRcdFx0e1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdH0pXG5cdFx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCB1cGRhdGVDYWNoZUFsbFxuIl19