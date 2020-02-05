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
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const build_1 = __importDefault(require("./build"));
const logger_1 = __importDefault(require("debug-color2/logger"));
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
        logger_1.default.debug(`[${siteID}] 更新 ${map[siteID]}`);
        return fetchCache(siteID, map);
    })
        .catch(e => {
        logger_1.default.warn(e.message);
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
        .resolve(cross_fetch_1.default(`${types_1.pathPrefix.github}${map[siteID]}`))
        .then(v => {
        return v.json();
    });
}
exports.fetchCache = fetchCache;
exports.default = updateCacheAll;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXBkYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUdBLG1DQUFnSDtBQUNoSCx3REFBZ0M7QUFDaEMsdUNBQTZFO0FBRTdFLDhEQUFnQztBQUNoQyxvREFBbUM7QUFDbkMsaUVBQTBDO0FBRTFDLFNBQWdCLGNBQWMsQ0FBQyxLQUFlO0lBRTdDLE9BQU8sa0JBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBYSxDQUFDO1NBQzVDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUcsRUFBRTtRQUVqQixDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFRLEVBQUUscUJBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQVEsRUFBRSxxQkFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBUSxFQUFFLHVCQUFlLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUV0RCxPQUFPLENBQUMsQ0FBQTtJQUNULENBQUMsRUFBRSxFQUF3QixDQUFDLENBQUM7U0FDNUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsZUFBWSxFQUFFLENBQUMsQ0FBQTtBQUM1QixDQUFDO0FBWkQsd0NBWUM7QUFFTSxLQUFLLFVBQVUsV0FBVyxDQUFDLE1BQWdCLEVBQUUsR0FBNkIsRUFBRSxLQUFlO0lBRWpHLElBQUksU0FBUyxHQUFHLHdCQUFnQixDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztJQUU5QyxPQUFPLGtCQUFRLENBQUMsT0FBTyxDQUFDLGVBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUN0QyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFO1FBQ2xCLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxHQUFHLElBQUksRUFDaEU7WUFDQyxPQUFPLG1CQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7U0FDMUI7UUFDRCxPQUFPLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQTtJQUN4QixDQUFDLENBQUM7U0FDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDVixnQkFBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLE1BQU0sUUFBUSxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQy9DLE9BQU8sVUFBVSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQTtJQUMvQixDQUFDLENBQUM7U0FDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDVixnQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDdkIsT0FBTyxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQzNCLENBQUMsQ0FBQztTQUNELEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNWLGdCQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUN2QixJQUFJLFVBQVUsR0FBRyxHQUFHLGtCQUFVLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQ3RELE9BQU8sa0RBQU8sVUFBVSxJQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUE7SUFDcEQsQ0FBQyxDQUFDO1NBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMscUJBQVUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FDekQ7QUFDRixDQUFDO0FBM0JELGtDQTJCQztBQUVELFNBQWdCLFVBQVUsQ0FBSSxNQUFnQixFQUFFLEdBQTZCO0lBRTVFLE9BQU8sa0JBQVE7U0FDYixPQUFPLENBQUMscUJBQUssQ0FBQyxHQUFHLGtCQUFVLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDcEQsSUFBSSxDQUFJLENBQUMsQ0FBQyxFQUFFO1FBQ1osT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUE7SUFDaEIsQ0FBQyxDQUFDLENBQ0Q7QUFDSCxDQUFDO0FBUkQsZ0NBUUM7QUFFRCxrQkFBZSxjQUFjLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzIvMS5cbiAqL1xuaW1wb3J0IHsgSVNpdGVJRHMsIHBhdGhQcmVmaXgsIGlkX3RpdGxlc19tYXAsIGlkX3VwZGF0ZV9tYXAsIGdldExvY2FsRmlsZW5hbWUsIGlkX2NoYXB0ZXJzX21hcCB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCB7IHBhdGhFeGlzdHMsIHN0YXQsIHJlYWRKU09OLCB3cml0ZUpTT04sIG91dHB1dEpTT04gfSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgeyBiYXNlbmFtZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IGZldGNoIGZyb20gJ2Nyb3NzLWZldGNoJztcbmltcG9ydCBidWlsZFNvcnRBbGwgZnJvbSAnLi9idWlsZCc7XG5pbXBvcnQgY29uc29sZSBmcm9tICdkZWJ1Zy1jb2xvcjIvbG9nZ2VyJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUNhY2hlQWxsKGZvcmNlPzogYm9vbGVhbilcbntcblx0cmV0dXJuIEJsdWViaXJkLmFsbChPYmplY3Qua2V5cyhpZF90aXRsZXNfbWFwKVxuXHRcdC5yZWR1Y2UoKGEsIGIgKSA9PiB7XG5cblx0XHRcdGEucHVzaCh1cGRhdGVDYWNoZShiIGFzIGFueSwgaWRfdGl0bGVzX21hcCwgZm9yY2UpKTtcblx0XHRcdGEucHVzaCh1cGRhdGVDYWNoZShiIGFzIGFueSwgaWRfdXBkYXRlX21hcCwgZm9yY2UpKTtcblx0XHRcdGEucHVzaCh1cGRhdGVDYWNoZShiIGFzIGFueSwgaWRfY2hhcHRlcnNfbWFwLCBmb3JjZSkpO1xuXG5cdFx0XHRyZXR1cm4gYVxuXHRcdH0sIFtdIGFzIFByb21pc2U8dW5rbm93bj5bXSkpXG5cdFx0LnRoZW4odiA9PiBidWlsZFNvcnRBbGwoKSlcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUNhY2hlKHNpdGVJRDogSVNpdGVJRHMsIG1hcDogUmVjb3JkPElTaXRlSURzLCBzdHJpbmc+LCBmb3JjZT86IGJvb2xlYW4pXG57XG5cdGxldCBsb2NhbEZpbGUgPSBnZXRMb2NhbEZpbGVuYW1lKHNpdGVJRCwgbWFwKTtcblxuXHRyZXR1cm4gQmx1ZWJpcmQucmVzb2x2ZShzdGF0KGxvY2FsRmlsZSkpXG5cdFx0LnRoZW4oYXN5bmMgKHN0KSA9PiB7XG5cdFx0XHRpZiAoIWZvcmNlICYmIHN0ICYmIChEYXRlLm5vdygpIC0gc3QubXRpbWVNcykgPCAxMiAqIDM2MDAgKiAxMDAwKVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4gcmVhZEpTT04obG9jYWxGaWxlKVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KClcblx0XHR9KVxuXHRcdC5jYXRjaChlID0+IHtcblx0XHRcdGNvbnNvbGUuZGVidWcoYFske3NpdGVJRH1dIOabtOaWsCAke21hcFtzaXRlSURdfWApO1xuXHRcdFx0cmV0dXJuIGZldGNoQ2FjaGUoc2l0ZUlELCBtYXApXG5cdFx0fSlcblx0XHQuY2F0Y2goZSA9PiB7XG5cdFx0XHRjb25zb2xlLndhcm4oZS5tZXNzYWdlKVxuXHRcdFx0cmV0dXJuIHJlYWRKU09OKGxvY2FsRmlsZSlcblx0XHR9KVxuXHRcdC5jYXRjaChlID0+IHtcblx0XHRcdGNvbnNvbGUud2FybihlLm1lc3NhZ2UpXG5cdFx0XHRsZXQgbW9kdWxlRmlsZSA9IGAke3BhdGhQcmVmaXgubW9kdWxlfSR7bWFwW3NpdGVJRF19YDtcblx0XHRcdHJldHVybiBpbXBvcnQobW9kdWxlRmlsZSkudGhlbih2ID0+IHYuZGVmYXVsdCB8fCB2KVxuXHRcdH0pXG5cdFx0LnRoZW4oZGF0YSA9PiBvdXRwdXRKU09OKGxvY2FsRmlsZSwgZGF0YSwgeyBzcGFjZXM6IDIgfSkpXG5cdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoQ2FjaGU8VD4oc2l0ZUlEOiBJU2l0ZUlEcywgbWFwOiBSZWNvcmQ8SVNpdGVJRHMsIHN0cmluZz4pXG57XG5cdHJldHVybiBCbHVlYmlyZFxuXHRcdC5yZXNvbHZlKGZldGNoKGAke3BhdGhQcmVmaXguZ2l0aHVifSR7bWFwW3NpdGVJRF19YCkpXG5cdFx0LnRoZW48VD4odiA9PiB7XG5cdFx0XHRyZXR1cm4gdi5qc29uKClcblx0XHR9KVxuXHRcdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdXBkYXRlQ2FjaGVBbGxcbiJdfQ==