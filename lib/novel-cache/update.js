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
function updateCacheAll() {
    return bluebird_1.default.all(Object.keys(types_1.id_titles_map)
        .reduce((a, b) => {
        a.push(updateCache(b, types_1.id_titles_map));
        a.push(updateCache(b, types_1.id_update_map));
        return a;
    }, []))
        .then(v => build_1.default());
}
exports.updateCacheAll = updateCacheAll;
async function updateCache(siteID, map) {
    let localFile = types_1.getLocalFilename(siteID, map);
    return bluebird_1.default.resolve(fs_extra_1.stat(localFile))
        .then(async (st) => {
        if (st && (Date.now() - st.mtimeMs) < 86400 * 1000) {
            return fs_extra_1.readJSON(localFile);
        }
        return Promise.reject();
    })
        .catch(e => {
        return fetchCache(siteID, map);
    })
        .catch(e => {
        console.warn(e.message);
        return fs_extra_1.readJSON(localFile);
    })
        .catch(e => {
        console.warn(e.message);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXBkYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUdBLG1DQUErRjtBQUMvRix3REFBZ0M7QUFDaEMsdUNBQTZFO0FBRTdFLDhEQUFnQztBQUNoQyxvREFBbUM7QUFFbkMsU0FBZ0IsY0FBYztJQUU3QixPQUFPLGtCQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMscUJBQWEsQ0FBQztTQUM1QyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFHLEVBQUU7UUFFakIsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBUSxFQUFFLHFCQUFhLENBQUMsQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQVEsRUFBRSxxQkFBYSxDQUFDLENBQUMsQ0FBQztRQUU3QyxPQUFPLENBQUMsQ0FBQTtJQUNULENBQUMsRUFBRSxFQUF3QixDQUFDLENBQUM7U0FDNUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsZUFBWSxFQUFFLENBQUMsQ0FBQTtBQUM1QixDQUFDO0FBWEQsd0NBV0M7QUFFTSxLQUFLLFVBQVUsV0FBVyxDQUFDLE1BQWdCLEVBQUUsR0FBNkI7SUFFaEYsSUFBSSxTQUFTLEdBQUcsd0JBQWdCLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBRTlDLE9BQU8sa0JBQVEsQ0FBQyxPQUFPLENBQUMsZUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3RDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUU7UUFDbEIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLEVBQ2xEO1lBQ0MsT0FBTyxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1NBQzFCO1FBQ0QsT0FBTyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUE7SUFDeEIsQ0FBQyxDQUFDO1NBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ1YsT0FBTyxVQUFVLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFBO0lBQy9CLENBQUMsQ0FBQztTQUNELEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNWLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ3ZCLE9BQU8sbUJBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUMzQixDQUFDLENBQUM7U0FDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDVixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUN2QixJQUFJLFVBQVUsR0FBRyxHQUFHLGtCQUFVLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQ3RELE9BQU8sa0RBQU8sVUFBVSxJQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUE7SUFDcEQsQ0FBQyxDQUFDO1NBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMscUJBQVUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FDekQ7QUFDRixDQUFDO0FBMUJELGtDQTBCQztBQUVELFNBQWdCLFVBQVUsQ0FBSSxNQUFnQixFQUFFLEdBQTZCO0lBRTVFLE9BQU8sa0JBQVE7U0FDYixPQUFPLENBQUMscUJBQUssQ0FBQyxHQUFHLGtCQUFVLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDcEQsSUFBSSxDQUFJLENBQUMsQ0FBQyxFQUFFO1FBQ1osT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUE7SUFDaEIsQ0FBQyxDQUFDLENBQ0Q7QUFDSCxDQUFDO0FBUkQsZ0NBUUM7QUFFRCxrQkFBZSxjQUFjLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzIvMS5cbiAqL1xuaW1wb3J0IHsgSVNpdGVJRHMsIHBhdGhQcmVmaXgsIGlkX3RpdGxlc19tYXAsIGlkX3VwZGF0ZV9tYXAsIGdldExvY2FsRmlsZW5hbWUgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgeyBwYXRoRXhpc3RzLCBzdGF0LCByZWFkSlNPTiwgd3JpdGVKU09OLCBvdXRwdXRKU09OIH0gZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHsgYmFzZW5hbWUgfSBmcm9tICdwYXRoJztcbmltcG9ydCBmZXRjaCBmcm9tICdjcm9zcy1mZXRjaCc7XG5pbXBvcnQgYnVpbGRTb3J0QWxsIGZyb20gJy4vYnVpbGQnO1xuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQ2FjaGVBbGwoKVxue1xuXHRyZXR1cm4gQmx1ZWJpcmQuYWxsKE9iamVjdC5rZXlzKGlkX3RpdGxlc19tYXApXG5cdFx0LnJlZHVjZSgoYSwgYiApID0+IHtcblxuXHRcdFx0YS5wdXNoKHVwZGF0ZUNhY2hlKGIgYXMgYW55LCBpZF90aXRsZXNfbWFwKSk7XG5cdFx0XHRhLnB1c2godXBkYXRlQ2FjaGUoYiBhcyBhbnksIGlkX3VwZGF0ZV9tYXApKTtcblxuXHRcdFx0cmV0dXJuIGFcblx0XHR9LCBbXSBhcyBQcm9taXNlPHVua25vd24+W10pKVxuXHRcdC50aGVuKHYgPT4gYnVpbGRTb3J0QWxsKCkpXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVDYWNoZShzaXRlSUQ6IElTaXRlSURzLCBtYXA6IFJlY29yZDxJU2l0ZUlEcywgc3RyaW5nPilcbntcblx0bGV0IGxvY2FsRmlsZSA9IGdldExvY2FsRmlsZW5hbWUoc2l0ZUlELCBtYXApO1xuXG5cdHJldHVybiBCbHVlYmlyZC5yZXNvbHZlKHN0YXQobG9jYWxGaWxlKSlcblx0XHQudGhlbihhc3luYyAoc3QpID0+IHtcblx0XHRcdGlmIChzdCAmJiAoRGF0ZS5ub3coKSAtIHN0Lm10aW1lTXMpIDwgODY0MDAgKiAxMDAwKVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4gcmVhZEpTT04obG9jYWxGaWxlKVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KClcblx0XHR9KVxuXHRcdC5jYXRjaChlID0+IHtcblx0XHRcdHJldHVybiBmZXRjaENhY2hlKHNpdGVJRCwgbWFwKVxuXHRcdH0pXG5cdFx0LmNhdGNoKGUgPT4ge1xuXHRcdFx0Y29uc29sZS53YXJuKGUubWVzc2FnZSlcblx0XHRcdHJldHVybiByZWFkSlNPTihsb2NhbEZpbGUpXG5cdFx0fSlcblx0XHQuY2F0Y2goZSA9PiB7XG5cdFx0XHRjb25zb2xlLndhcm4oZS5tZXNzYWdlKVxuXHRcdFx0bGV0IG1vZHVsZUZpbGUgPSBgJHtwYXRoUHJlZml4Lm1vZHVsZX0ke21hcFtzaXRlSURdfWA7XG5cdFx0XHRyZXR1cm4gaW1wb3J0KG1vZHVsZUZpbGUpLnRoZW4odiA9PiB2LmRlZmF1bHQgfHwgdilcblx0XHR9KVxuXHRcdC50aGVuKGRhdGEgPT4gb3V0cHV0SlNPTihsb2NhbEZpbGUsIGRhdGEsIHsgc3BhY2VzOiAyIH0pKVxuXHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaENhY2hlPFQ+KHNpdGVJRDogSVNpdGVJRHMsIG1hcDogUmVjb3JkPElTaXRlSURzLCBzdHJpbmc+KVxue1xuXHRyZXR1cm4gQmx1ZWJpcmRcblx0XHQucmVzb2x2ZShmZXRjaChgJHtwYXRoUHJlZml4LmdpdGh1Yn0ke21hcFtzaXRlSURdfWApKVxuXHRcdC50aGVuPFQ+KHYgPT4ge1xuXHRcdFx0cmV0dXJuIHYuanNvbigpXG5cdFx0fSlcblx0XHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVwZGF0ZUNhY2hlQWxsXG4iXX0=