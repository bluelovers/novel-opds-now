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
        return fetchCache(siteID, map)
            .tap(v => logger_1.default.debug(`[${siteID}] 更新完成 ${map[siteID]}`));
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
            .tapCatch(async (e) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXBkYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUdBLG1DQUFnSDtBQUNoSCx3REFBZ0M7QUFDaEMsdUNBQTZFO0FBRTdFLHFEQUE2QjtBQUM3QixvREFBbUM7QUFDbkMsaUVBQTBDO0FBQzFDLDJEQUFtQztBQUVuQyxTQUFnQixjQUFjLENBQUMsS0FBZTtJQUU3QyxPQUFPLGtCQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMscUJBQWEsQ0FBQztTQUM1QyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFHLEVBQUU7UUFFakIsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBUSxFQUFFLHFCQUFhLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFRLEVBQUUscUJBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQVEsRUFBRSx1QkFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFdEQsT0FBTyxDQUFDLENBQUE7SUFDVCxDQUFDLEVBQUUsRUFBd0IsQ0FBQyxDQUFDO1NBQzVCLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGVBQVksRUFBRSxDQUFDLENBQUE7QUFDNUIsQ0FBQztBQVpELHdDQVlDO0FBRU0sS0FBSyxVQUFVLFdBQVcsQ0FBQyxNQUFnQixFQUFFLEdBQTZCLEVBQUUsS0FBZTtJQUVqRyxJQUFJLFNBQVMsR0FBRyx3QkFBZ0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFOUMsT0FBTyxrQkFBUSxDQUFDLE9BQU8sQ0FBQyxlQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDdEMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRTtRQUNsQixJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksR0FBRyxJQUFJLEVBQ2hFO1lBQ0MsT0FBTyxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1NBQzFCO1FBQ0QsT0FBTyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUE7SUFDeEIsQ0FBQyxDQUFDO1NBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ1YsSUFBSSxLQUFLLEdBQUcsa0JBQVEsRUFBRSxDQUFDO1FBRXZCLElBQUksS0FBSyxFQUNUO1lBQ0MsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ2xDO1FBQ0QsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxNQUFNLFVBQVUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNqRCxPQUFPLFVBQVUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDO2FBQzVCLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGdCQUFPLENBQUMsS0FBSyxDQUFDLElBQUksTUFBTSxVQUFVLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUM3RCxDQUFDLENBQUM7U0FDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFFVixnQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVoQyxPQUFPLG1CQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDM0IsQ0FBQyxDQUFDO1NBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ1YsZ0JBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ3ZCLElBQUksVUFBVSxHQUFHLEdBQUcsa0JBQVUsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDdEQsT0FBTyxrREFBTyxVQUFVLElBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQTtJQUNwRCxDQUFDLENBQUM7U0FDRCxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxxQkFBVSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUN6RDtBQUNGLENBQUM7QUFwQ0Qsa0NBb0NDO0FBRUQsU0FBZ0IsVUFBVSxDQUFJLE1BQWdCLEVBQUUsR0FBNkI7SUFFNUUsT0FBTyxrQkFBUTtTQUNiLE9BQU8sQ0FBQyxlQUFLLENBQUMsR0FBRyxrQkFBVSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3BELElBQUksQ0FBSSxDQUFDLENBQUMsRUFBRTtRQUNaLE9BQU8sa0JBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2FBQy9CLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDckIsSUFDQTtnQkFDQyxnQkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQzthQUNoQztZQUNELE9BQU8sQ0FBQyxFQUNSO2FBRUM7UUFDRixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUNEO0FBQ0gsQ0FBQztBQWxCRCxnQ0FrQkM7QUFFRCxrQkFBZSxjQUFjLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzIvMS5cbiAqL1xuaW1wb3J0IHsgSVNpdGVJRHMsIHBhdGhQcmVmaXgsIGlkX3RpdGxlc19tYXAsIGlkX3VwZGF0ZV9tYXAsIGdldExvY2FsRmlsZW5hbWUsIGlkX2NoYXB0ZXJzX21hcCB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCB7IHBhdGhFeGlzdHMsIHN0YXQsIHJlYWRKU09OLCB3cml0ZUpTT04sIG91dHB1dEpTT04gfSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgeyBiYXNlbmFtZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IGZldGNoIGZyb20gJy4uL2ZldGNoJztcbmltcG9ydCBidWlsZFNvcnRBbGwgZnJvbSAnLi9idWlsZCc7XG5pbXBvcnQgY29uc29sZSBmcm9tICdkZWJ1Zy1jb2xvcjIvbG9nZ2VyJztcbmltcG9ydCBnZXRQcm94eSBmcm9tICcuLi9nZXRQcm94eSc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVDYWNoZUFsbChmb3JjZT86IGJvb2xlYW4pXG57XG5cdHJldHVybiBCbHVlYmlyZC5hbGwoT2JqZWN0LmtleXMoaWRfdGl0bGVzX21hcClcblx0XHQucmVkdWNlKChhLCBiICkgPT4ge1xuXG5cdFx0XHRhLnB1c2godXBkYXRlQ2FjaGUoYiBhcyBhbnksIGlkX3RpdGxlc19tYXAsIGZvcmNlKSk7XG5cdFx0XHRhLnB1c2godXBkYXRlQ2FjaGUoYiBhcyBhbnksIGlkX3VwZGF0ZV9tYXAsIGZvcmNlKSk7XG5cdFx0XHRhLnB1c2godXBkYXRlQ2FjaGUoYiBhcyBhbnksIGlkX2NoYXB0ZXJzX21hcCwgZm9yY2UpKTtcblxuXHRcdFx0cmV0dXJuIGFcblx0XHR9LCBbXSBhcyBQcm9taXNlPHVua25vd24+W10pKVxuXHRcdC50aGVuKHYgPT4gYnVpbGRTb3J0QWxsKCkpXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVDYWNoZShzaXRlSUQ6IElTaXRlSURzLCBtYXA6IFJlY29yZDxJU2l0ZUlEcywgc3RyaW5nPiwgZm9yY2U/OiBib29sZWFuKVxue1xuXHRsZXQgbG9jYWxGaWxlID0gZ2V0TG9jYWxGaWxlbmFtZShzaXRlSUQsIG1hcCk7XG5cblx0cmV0dXJuIEJsdWViaXJkLnJlc29sdmUoc3RhdChsb2NhbEZpbGUpKVxuXHRcdC50aGVuKGFzeW5jIChzdCkgPT4ge1xuXHRcdFx0aWYgKCFmb3JjZSAmJiBzdCAmJiAoRGF0ZS5ub3coKSAtIHN0Lm10aW1lTXMpIDwgMTIgKiAzNjAwICogMTAwMClcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIHJlYWRKU09OKGxvY2FsRmlsZSlcblx0XHRcdH1cblx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdCgpXG5cdFx0fSlcblx0XHQuY2F0Y2goZSA9PiB7XG5cdFx0XHRsZXQgcHJveHkgPSBnZXRQcm94eSgpO1xuXG5cdFx0XHRpZiAocHJveHkpXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnNvbGUuZGVidWcoYHVzZSBwcm94eWAsIHByb3h5KTtcblx0XHRcdH1cblx0XHRcdGNvbnNvbGUuZGVidWcoYFske3NpdGVJRH1dIOWYl+ippuabtOaWsCAke21hcFtzaXRlSURdfWApO1xuXHRcdFx0cmV0dXJuIGZldGNoQ2FjaGUoc2l0ZUlELCBtYXApXG5cdFx0XHRcdC50YXAodiA9PiBjb25zb2xlLmRlYnVnKGBbJHtzaXRlSUR9XSDmm7TmlrDlrozmiJAgJHttYXBbc2l0ZUlEXX1gKSlcblx0XHR9KVxuXHRcdC5jYXRjaChlID0+IHtcblxuXHRcdFx0Y29uc29sZS53YXJuKGUuY29kZSwgZS5tZXNzYWdlKTtcblxuXHRcdFx0cmV0dXJuIHJlYWRKU09OKGxvY2FsRmlsZSlcblx0XHR9KVxuXHRcdC5jYXRjaChlID0+IHtcblx0XHRcdGNvbnNvbGUud2FybihlLm1lc3NhZ2UpXG5cdFx0XHRsZXQgbW9kdWxlRmlsZSA9IGAke3BhdGhQcmVmaXgubW9kdWxlfSR7bWFwW3NpdGVJRF19YDtcblx0XHRcdHJldHVybiBpbXBvcnQobW9kdWxlRmlsZSkudGhlbih2ID0+IHYuZGVmYXVsdCB8fCB2KVxuXHRcdH0pXG5cdFx0LnRoZW4oZGF0YSA9PiBvdXRwdXRKU09OKGxvY2FsRmlsZSwgZGF0YSwgeyBzcGFjZXM6IDIgfSkpXG5cdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoQ2FjaGU8VD4oc2l0ZUlEOiBJU2l0ZUlEcywgbWFwOiBSZWNvcmQ8SVNpdGVJRHMsIHN0cmluZz4pXG57XG5cdHJldHVybiBCbHVlYmlyZFxuXHRcdC5yZXNvbHZlKGZldGNoKGAke3BhdGhQcmVmaXguZ2l0aHVifSR7bWFwW3NpdGVJRF19YCkpXG5cdFx0LnRoZW48VD4odiA9PiB7XG5cdFx0XHRyZXR1cm4gQmx1ZWJpcmQucmVzb2x2ZSh2Lmpzb24oKSlcblx0XHRcdFx0LnRhcENhdGNoKGFzeW5jIChlKSA9PiB7XG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc29sZS5yZWQuZGlyKGF3YWl0IHYudGV4dCgpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2F0Y2ggKGUpXG5cdFx0XHRcdFx0e1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdH0pXG5cdFx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCB1cGRhdGVDYWNoZUFsbFxuIl19