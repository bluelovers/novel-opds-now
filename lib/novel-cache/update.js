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
        return v.json();
    });
}
exports.fetchCache = fetchCache;
exports.default = updateCacheAll;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXBkYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUdBLG1DQUFnSDtBQUNoSCx3REFBZ0M7QUFDaEMsdUNBQTZFO0FBRTdFLHFEQUE2QjtBQUM3QixvREFBbUM7QUFDbkMsaUVBQTBDO0FBQzFDLDJEQUFtQztBQUVuQyxTQUFnQixjQUFjLENBQUMsS0FBZTtJQUU3QyxPQUFPLGtCQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMscUJBQWEsQ0FBQztTQUM1QyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFHLEVBQUU7UUFFakIsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBUSxFQUFFLHFCQUFhLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFRLEVBQUUscUJBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQVEsRUFBRSx1QkFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFdEQsT0FBTyxDQUFDLENBQUE7SUFDVCxDQUFDLEVBQUUsRUFBd0IsQ0FBQyxDQUFDO1NBQzVCLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGVBQVksRUFBRSxDQUFDLENBQUE7QUFDNUIsQ0FBQztBQVpELHdDQVlDO0FBRU0sS0FBSyxVQUFVLFdBQVcsQ0FBQyxNQUFnQixFQUFFLEdBQTZCLEVBQUUsS0FBZTtJQUVqRyxJQUFJLFNBQVMsR0FBRyx3QkFBZ0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFOUMsT0FBTyxrQkFBUSxDQUFDLE9BQU8sQ0FBQyxlQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDdEMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRTtRQUNsQixJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksR0FBRyxJQUFJLEVBQ2hFO1lBQ0MsT0FBTyxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1NBQzFCO1FBQ0QsT0FBTyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUE7SUFDeEIsQ0FBQyxDQUFDO1NBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ1YsSUFBSSxLQUFLLEdBQUcsa0JBQVEsRUFBRSxDQUFDO1FBRXZCLElBQUksS0FBSyxFQUNUO1lBQ0MsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ2xDO1FBQ0QsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxNQUFNLFVBQVUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNqRCxPQUFPLFVBQVUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUE7SUFDL0IsQ0FBQyxDQUFDO1NBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBRVYsZ0JBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFaEMsT0FBTyxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQzNCLENBQUMsQ0FBQztTQUNELEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNWLGdCQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUN2QixJQUFJLFVBQVUsR0FBRyxHQUFHLGtCQUFVLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQ3RELE9BQU8sa0RBQU8sVUFBVSxJQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUE7SUFDcEQsQ0FBQyxDQUFDO1NBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMscUJBQVUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FDekQ7QUFDRixDQUFDO0FBbkNELGtDQW1DQztBQUVELFNBQWdCLFVBQVUsQ0FBSSxNQUFnQixFQUFFLEdBQTZCO0lBRTVFLE9BQU8sa0JBQVE7U0FDYixPQUFPLENBQUMsZUFBSyxDQUFDLEdBQUcsa0JBQVUsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNwRCxJQUFJLENBQUksQ0FBQyxDQUFDLEVBQUU7UUFDWixPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUNoQixDQUFDLENBQUMsQ0FDRDtBQUNILENBQUM7QUFSRCxnQ0FRQztBQUVELGtCQUFlLGNBQWMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMjAvMi8xLlxuICovXG5pbXBvcnQgeyBJU2l0ZUlEcywgcGF0aFByZWZpeCwgaWRfdGl0bGVzX21hcCwgaWRfdXBkYXRlX21hcCwgZ2V0TG9jYWxGaWxlbmFtZSwgaWRfY2hhcHRlcnNfbWFwIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHsgcGF0aEV4aXN0cywgc3RhdCwgcmVhZEpTT04sIHdyaXRlSlNPTiwgb3V0cHV0SlNPTiB9IGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCB7IGJhc2VuYW1lIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgZmV0Y2ggZnJvbSAnLi4vZmV0Y2gnO1xuaW1wb3J0IGJ1aWxkU29ydEFsbCBmcm9tICcuL2J1aWxkJztcbmltcG9ydCBjb25zb2xlIGZyb20gJ2RlYnVnLWNvbG9yMi9sb2dnZXInO1xuaW1wb3J0IGdldFByb3h5IGZyb20gJy4uL2dldFByb3h5JztcblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUNhY2hlQWxsKGZvcmNlPzogYm9vbGVhbilcbntcblx0cmV0dXJuIEJsdWViaXJkLmFsbChPYmplY3Qua2V5cyhpZF90aXRsZXNfbWFwKVxuXHRcdC5yZWR1Y2UoKGEsIGIgKSA9PiB7XG5cblx0XHRcdGEucHVzaCh1cGRhdGVDYWNoZShiIGFzIGFueSwgaWRfdGl0bGVzX21hcCwgZm9yY2UpKTtcblx0XHRcdGEucHVzaCh1cGRhdGVDYWNoZShiIGFzIGFueSwgaWRfdXBkYXRlX21hcCwgZm9yY2UpKTtcblx0XHRcdGEucHVzaCh1cGRhdGVDYWNoZShiIGFzIGFueSwgaWRfY2hhcHRlcnNfbWFwLCBmb3JjZSkpO1xuXG5cdFx0XHRyZXR1cm4gYVxuXHRcdH0sIFtdIGFzIFByb21pc2U8dW5rbm93bj5bXSkpXG5cdFx0LnRoZW4odiA9PiBidWlsZFNvcnRBbGwoKSlcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUNhY2hlKHNpdGVJRDogSVNpdGVJRHMsIG1hcDogUmVjb3JkPElTaXRlSURzLCBzdHJpbmc+LCBmb3JjZT86IGJvb2xlYW4pXG57XG5cdGxldCBsb2NhbEZpbGUgPSBnZXRMb2NhbEZpbGVuYW1lKHNpdGVJRCwgbWFwKTtcblxuXHRyZXR1cm4gQmx1ZWJpcmQucmVzb2x2ZShzdGF0KGxvY2FsRmlsZSkpXG5cdFx0LnRoZW4oYXN5bmMgKHN0KSA9PiB7XG5cdFx0XHRpZiAoIWZvcmNlICYmIHN0ICYmIChEYXRlLm5vdygpIC0gc3QubXRpbWVNcykgPCAxMiAqIDM2MDAgKiAxMDAwKVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4gcmVhZEpTT04obG9jYWxGaWxlKVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KClcblx0XHR9KVxuXHRcdC5jYXRjaChlID0+IHtcblx0XHRcdGxldCBwcm94eSA9IGdldFByb3h5KCk7XG5cblx0XHRcdGlmIChwcm94eSlcblx0XHRcdHtcblx0XHRcdFx0Y29uc29sZS5kZWJ1ZyhgdXNlIHByb3h5YCwgcHJveHkpO1xuXHRcdFx0fVxuXHRcdFx0Y29uc29sZS5kZWJ1ZyhgWyR7c2l0ZUlEfV0g5ZiX6Kmm5pu05pawICR7bWFwW3NpdGVJRF19YCk7XG5cdFx0XHRyZXR1cm4gZmV0Y2hDYWNoZShzaXRlSUQsIG1hcClcblx0XHR9KVxuXHRcdC5jYXRjaChlID0+IHtcblxuXHRcdFx0Y29uc29sZS53YXJuKGUuY29kZSwgZS5tZXNzYWdlKTtcblxuXHRcdFx0cmV0dXJuIHJlYWRKU09OKGxvY2FsRmlsZSlcblx0XHR9KVxuXHRcdC5jYXRjaChlID0+IHtcblx0XHRcdGNvbnNvbGUud2FybihlLm1lc3NhZ2UpXG5cdFx0XHRsZXQgbW9kdWxlRmlsZSA9IGAke3BhdGhQcmVmaXgubW9kdWxlfSR7bWFwW3NpdGVJRF19YDtcblx0XHRcdHJldHVybiBpbXBvcnQobW9kdWxlRmlsZSkudGhlbih2ID0+IHYuZGVmYXVsdCB8fCB2KVxuXHRcdH0pXG5cdFx0LnRoZW4oZGF0YSA9PiBvdXRwdXRKU09OKGxvY2FsRmlsZSwgZGF0YSwgeyBzcGFjZXM6IDIgfSkpXG5cdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoQ2FjaGU8VD4oc2l0ZUlEOiBJU2l0ZUlEcywgbWFwOiBSZWNvcmQ8SVNpdGVJRHMsIHN0cmluZz4pXG57XG5cdHJldHVybiBCbHVlYmlyZFxuXHRcdC5yZXNvbHZlKGZldGNoKGAke3BhdGhQcmVmaXguZ2l0aHVifSR7bWFwW3NpdGVJRF19YCkpXG5cdFx0LnRoZW48VD4odiA9PiB7XG5cdFx0XHRyZXR1cm4gdi5qc29uKClcblx0XHR9KVxuXHRcdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdXBkYXRlQ2FjaGVBbGxcbiJdfQ==