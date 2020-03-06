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
exports.fetchCache = exports.updateCache = exports.updateCacheAll = void 0;
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
        logger_1.default.warn(e.code, e.message || e);
        return fs_extra_1.readJSON(localFile);
    })
        .catch(e => {
        logger_1.default.warn(e.message || e);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXBkYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQSxtQ0FBZ0g7QUFDaEgsd0RBQWdDO0FBQ2hDLHVDQUE2RTtBQUU3RSxxREFBNkI7QUFDN0Isb0RBQW1DO0FBQ25DLGlFQUEwQztBQUMxQywyREFBbUM7QUFFbkMsU0FBZ0IsY0FBYyxDQUFDLEtBQWU7SUFFN0MsT0FBTyxrQkFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLHFCQUFhLENBQUM7U0FDNUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRyxFQUFFO1FBRWpCLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQVEsRUFBRSxxQkFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBUSxFQUFFLHFCQUFhLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFRLEVBQUUsdUJBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBRXRELE9BQU8sQ0FBQyxDQUFBO0lBQ1QsQ0FBQyxFQUFFLEVBQXdCLENBQUMsQ0FBQztTQUM1QixJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxlQUFZLEVBQUUsQ0FBQyxDQUFBO0FBQzVCLENBQUM7QUFaRCx3Q0FZQztBQUVNLEtBQUssVUFBVSxXQUFXLENBQUMsTUFBZ0IsRUFBRSxHQUE2QixFQUFFLEtBQWU7SUFFakcsSUFBSSxTQUFTLEdBQUcsd0JBQWdCLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBRTlDLE9BQU8sa0JBQVEsQ0FBQyxPQUFPLENBQUMsZUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3RDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUU7UUFDbEIsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLEdBQUcsSUFBSSxFQUNoRTtZQUNDLE9BQU8sbUJBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTtTQUMxQjtRQUNELE9BQU8sT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFBO0lBQ3hCLENBQUMsQ0FBQztTQUNELEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNWLElBQUksS0FBSyxHQUFHLGtCQUFRLEVBQUUsQ0FBQztRQUV2QixJQUFJLEtBQUssRUFDVDtZQUNDLGdCQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNsQztRQUNELGdCQUFPLENBQUMsS0FBSyxDQUFDLElBQUksTUFBTSxVQUFVLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDakQsT0FBTyxVQUFVLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQzthQUM1QixHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxnQkFBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLE1BQU0sVUFBVSxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFDN0QsQ0FBQyxDQUFDO1NBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBRVYsZ0JBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRXJDLE9BQU8sbUJBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUMzQixDQUFDLENBQUM7U0FDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDVixnQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFBO1FBQzVCLElBQUksVUFBVSxHQUFHLEdBQUcsa0JBQVUsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDdEQsT0FBTyxrREFBTyxVQUFVLElBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQTtJQUNwRCxDQUFDLENBQUM7U0FDRCxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxxQkFBVSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUN6RDtBQUNGLENBQUM7QUFwQ0Qsa0NBb0NDO0FBRUQsU0FBZ0IsVUFBVSxDQUFJLE1BQWdCLEVBQUUsR0FBNkI7SUFFNUUsT0FBTyxrQkFBUTtTQUNiLE9BQU8sQ0FBQyxlQUFLLENBQUMsR0FBRyxrQkFBVSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3BELElBQUksQ0FBSSxDQUFDLENBQUMsRUFBRTtRQUNaLE9BQU8sa0JBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2FBQy9CLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDckIsSUFDQTtnQkFDQyxnQkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQzthQUNoQztZQUNELE9BQU8sQ0FBQyxFQUNSO2FBRUM7UUFDRixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUNEO0FBQ0gsQ0FBQztBQWxCRCxnQ0FrQkM7QUFFRCxrQkFBZSxjQUFjLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzIvMS5cbiAqL1xuaW1wb3J0IHsgSVNpdGVJRHMsIHBhdGhQcmVmaXgsIGlkX3RpdGxlc19tYXAsIGlkX3VwZGF0ZV9tYXAsIGdldExvY2FsRmlsZW5hbWUsIGlkX2NoYXB0ZXJzX21hcCB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCB7IHBhdGhFeGlzdHMsIHN0YXQsIHJlYWRKU09OLCB3cml0ZUpTT04sIG91dHB1dEpTT04gfSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgeyBiYXNlbmFtZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IGZldGNoIGZyb20gJy4uL2ZldGNoJztcbmltcG9ydCBidWlsZFNvcnRBbGwgZnJvbSAnLi9idWlsZCc7XG5pbXBvcnQgY29uc29sZSBmcm9tICdkZWJ1Zy1jb2xvcjIvbG9nZ2VyJztcbmltcG9ydCBnZXRQcm94eSBmcm9tICcuLi9nZXRQcm94eSc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVDYWNoZUFsbChmb3JjZT86IGJvb2xlYW4pXG57XG5cdHJldHVybiBCbHVlYmlyZC5hbGwoT2JqZWN0LmtleXMoaWRfdGl0bGVzX21hcClcblx0XHQucmVkdWNlKChhLCBiICkgPT4ge1xuXG5cdFx0XHRhLnB1c2godXBkYXRlQ2FjaGUoYiBhcyBhbnksIGlkX3RpdGxlc19tYXAsIGZvcmNlKSk7XG5cdFx0XHRhLnB1c2godXBkYXRlQ2FjaGUoYiBhcyBhbnksIGlkX3VwZGF0ZV9tYXAsIGZvcmNlKSk7XG5cdFx0XHRhLnB1c2godXBkYXRlQ2FjaGUoYiBhcyBhbnksIGlkX2NoYXB0ZXJzX21hcCwgZm9yY2UpKTtcblxuXHRcdFx0cmV0dXJuIGFcblx0XHR9LCBbXSBhcyBQcm9taXNlPHVua25vd24+W10pKVxuXHRcdC50aGVuKHYgPT4gYnVpbGRTb3J0QWxsKCkpXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVDYWNoZShzaXRlSUQ6IElTaXRlSURzLCBtYXA6IFJlY29yZDxJU2l0ZUlEcywgc3RyaW5nPiwgZm9yY2U/OiBib29sZWFuKVxue1xuXHRsZXQgbG9jYWxGaWxlID0gZ2V0TG9jYWxGaWxlbmFtZShzaXRlSUQsIG1hcCk7XG5cblx0cmV0dXJuIEJsdWViaXJkLnJlc29sdmUoc3RhdChsb2NhbEZpbGUpKVxuXHRcdC50aGVuKGFzeW5jIChzdCkgPT4ge1xuXHRcdFx0aWYgKCFmb3JjZSAmJiBzdCAmJiAoRGF0ZS5ub3coKSAtIHN0Lm10aW1lTXMpIDwgMTIgKiAzNjAwICogMTAwMClcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIHJlYWRKU09OKGxvY2FsRmlsZSlcblx0XHRcdH1cblx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdCgpXG5cdFx0fSlcblx0XHQuY2F0Y2goZSA9PiB7XG5cdFx0XHRsZXQgcHJveHkgPSBnZXRQcm94eSgpO1xuXG5cdFx0XHRpZiAocHJveHkpXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnNvbGUuZGVidWcoYHVzZSBwcm94eWAsIHByb3h5KTtcblx0XHRcdH1cblx0XHRcdGNvbnNvbGUuZGVidWcoYFske3NpdGVJRH1dIOWYl+ippuabtOaWsCAke21hcFtzaXRlSURdfWApO1xuXHRcdFx0cmV0dXJuIGZldGNoQ2FjaGUoc2l0ZUlELCBtYXApXG5cdFx0XHRcdC50YXAodiA9PiBjb25zb2xlLmRlYnVnKGBbJHtzaXRlSUR9XSDmm7TmlrDlrozmiJAgJHttYXBbc2l0ZUlEXX1gKSlcblx0XHR9KVxuXHRcdC5jYXRjaChlID0+IHtcblxuXHRcdFx0Y29uc29sZS53YXJuKGUuY29kZSwgZS5tZXNzYWdlIHx8IGUpO1xuXG5cdFx0XHRyZXR1cm4gcmVhZEpTT04obG9jYWxGaWxlKVxuXHRcdH0pXG5cdFx0LmNhdGNoKGUgPT4ge1xuXHRcdFx0Y29uc29sZS53YXJuKGUubWVzc2FnZSB8fCBlKVxuXHRcdFx0bGV0IG1vZHVsZUZpbGUgPSBgJHtwYXRoUHJlZml4Lm1vZHVsZX0ke21hcFtzaXRlSURdfWA7XG5cdFx0XHRyZXR1cm4gaW1wb3J0KG1vZHVsZUZpbGUpLnRoZW4odiA9PiB2LmRlZmF1bHQgfHwgdilcblx0XHR9KVxuXHRcdC50aGVuKGRhdGEgPT4gb3V0cHV0SlNPTihsb2NhbEZpbGUsIGRhdGEsIHsgc3BhY2VzOiAyIH0pKVxuXHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaENhY2hlPFQ+KHNpdGVJRDogSVNpdGVJRHMsIG1hcDogUmVjb3JkPElTaXRlSURzLCBzdHJpbmc+KVxue1xuXHRyZXR1cm4gQmx1ZWJpcmRcblx0XHQucmVzb2x2ZShmZXRjaChgJHtwYXRoUHJlZml4LmdpdGh1Yn0ke21hcFtzaXRlSURdfWApKVxuXHRcdC50aGVuPFQ+KHYgPT4ge1xuXHRcdFx0cmV0dXJuIEJsdWViaXJkLnJlc29sdmUodi5qc29uKCkpXG5cdFx0XHRcdC50YXBDYXRjaChhc3luYyAoZSkgPT4ge1xuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNvbnNvbGUucmVkLmRpcihhd2FpdCB2LnRleHQoKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNhdGNoIChlKVxuXHRcdFx0XHRcdHtcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHR9KVxuXHRcdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdXBkYXRlQ2FjaGVBbGxcbiJdfQ==