"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = __importDefault(require("bluebird"));
const fs_extra_1 = require("fs-extra");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const load_1 = require("./load");
const build_1 = __importDefault(require("./build"));
const logger_1 = __importDefault(require("debug-color2/logger"));
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
        logger_1.default.debug(`更新 ${url}`);
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
        .resolve(cross_fetch_1.default(url))
        .then(v => {
        return v.json();
    });
}
exports.default = updateCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXBkYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBSUEsd0RBQWdDO0FBQ2hDLHVDQUFzRDtBQUN0RCw4REFBZ0M7QUFFaEMsaUNBQTBDO0FBQzFDLG9EQUFpQztBQUNqQyxpRUFBMEM7QUFFMUMsSUFBSSxHQUFHLEdBQUcsc0VBQXNFLENBQUM7QUFFMUUsS0FBSyxVQUFVLFdBQVcsQ0FBQyxLQUFlO0lBRWhELElBQUksU0FBUyxHQUFHLHVCQUFnQixFQUFFLENBQUM7SUFFbkMsT0FBTyxrQkFBUSxDQUFDLE9BQU8sQ0FBQyxlQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDdEMsSUFBSSxDQUFrQixLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUU7UUFDbkMsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksRUFDbkU7WUFDQyxPQUFPLG1CQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7U0FDMUI7UUFDRCxPQUFPLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQTtJQUN4QixDQUFDLENBQUM7U0FDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDVixnQkFBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDM0IsT0FBTyxVQUFVLEVBQUUsQ0FBQTtJQUNwQixDQUFDLENBQUM7U0FDRCxLQUFLLENBQWtCLENBQUMsQ0FBQyxFQUFFO1FBQzNCLGdCQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4QixPQUFPLG1CQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDM0IsQ0FBQyxDQUFDO1NBQ0QsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMscUJBQVUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDdkQsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsZUFBVSxFQUFFLENBQUMsQ0FDdEI7QUFDSCxDQUFDO0FBdkJELGtDQXVCQztBQUVELFNBQVMsVUFBVTtJQUVsQixPQUFPLGtCQUFRO1NBQ2IsT0FBTyxDQUFDLHFCQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbkIsSUFBSSxDQUFrQixDQUFDLENBQUMsRUFBRTtRQUMxQixPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUNoQixDQUFDLENBQUMsQ0FDRDtBQUNILENBQUM7QUFFRCxrQkFBZSxXQUFXLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzIvMy5cbiAqL1xuXG5pbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHsgc3RhdCwgcmVhZEpTT04sIG91dHB1dEpTT04gfSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgZmV0Y2ggZnJvbSAnY3Jvc3MtZmV0Y2gnO1xuaW1wb3J0IHsgSU5vdmVsU3RhdENhY2hlIH0gZnJvbSAnQG5vZGUtbm92ZWwvY2FjaGUtbG9hZGVyJztcbmltcG9ydCB7IGdldExvY2FsRmlsZW5hbWUgfSBmcm9tICcuL2xvYWQnO1xuaW1wb3J0IGJ1aWxkQ2FjaGUgZnJvbSAnLi9idWlsZCc7XG5pbXBvcnQgY29uc29sZSBmcm9tICdkZWJ1Zy1jb2xvcjIvbG9nZ2VyJztcblxubGV0IHVybCA9IGBodHRwczovL2dpdGxhYi5jb20vbm92ZWwtZ3JvdXAvdHh0LXNvdXJjZS9yYXcvbWFzdGVyL25vdmVsLXN0YXQuanNvbmA7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVDYWNoZShmb3JjZT86IGJvb2xlYW4pXG57XG5cdGxldCBsb2NhbEZpbGUgPSBnZXRMb2NhbEZpbGVuYW1lKCk7XG5cblx0cmV0dXJuIEJsdWViaXJkLnJlc29sdmUoc3RhdChsb2NhbEZpbGUpKVxuXHRcdC50aGVuPElOb3ZlbFN0YXRDYWNoZT4oYXN5bmMgKHN0KSA9PiB7XG5cdFx0XHRpZiAoIWZvcmNlICYmIHN0ICYmIChEYXRlLm5vdygpIC0gc3QubXRpbWVNcykgPCAxMiAqIDYwICogNjAgKiAxMDAwKVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4gcmVhZEpTT04obG9jYWxGaWxlKVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KClcblx0XHR9KVxuXHRcdC5jYXRjaChlID0+IHtcblx0XHRcdGNvbnNvbGUuZGVidWcoYOabtOaWsCAke3VybH1gKTtcblx0XHRcdHJldHVybiBmZXRjaENhY2hlKClcblx0XHR9KVxuXHRcdC5jYXRjaDxJTm92ZWxTdGF0Q2FjaGU+KGUgPT4ge1xuXHRcdFx0Y29uc29sZS53YXJuKGUubWVzc2FnZSk7XG5cdFx0XHRyZXR1cm4gcmVhZEpTT04obG9jYWxGaWxlKVxuXHRcdH0pXG5cdFx0LnRhcChkYXRhID0+IG91dHB1dEpTT04obG9jYWxGaWxlLCBkYXRhLCB7IHNwYWNlczogMiB9KSlcblx0XHQudGFwKHYgPT4gYnVpbGRDYWNoZSgpKVxuXHRcdDtcbn1cblxuZnVuY3Rpb24gZmV0Y2hDYWNoZSgpXG57XG5cdHJldHVybiBCbHVlYmlyZFxuXHRcdC5yZXNvbHZlKGZldGNoKHVybCkpXG5cdFx0LnRoZW48SU5vdmVsU3RhdENhY2hlPih2ID0+IHtcblx0XHRcdHJldHVybiB2Lmpzb24oKVxuXHRcdH0pXG5cdFx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCB1cGRhdGVDYWNoZVxuXG4iXX0=