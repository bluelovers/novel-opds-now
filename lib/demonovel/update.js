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
        if (!force && st && (Date.now() - st.mtimeMs) < 86400 * 1000) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXBkYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBSUEsd0RBQWdDO0FBQ2hDLHVDQUFzRDtBQUN0RCw4REFBZ0M7QUFFaEMsaUNBQTBDO0FBQzFDLG9EQUFpQztBQUNqQyxpRUFBMEM7QUFFMUMsSUFBSSxHQUFHLEdBQUcsc0VBQXNFLENBQUM7QUFFMUUsS0FBSyxVQUFVLFdBQVcsQ0FBQyxLQUFlO0lBRWhELElBQUksU0FBUyxHQUFHLHVCQUFnQixFQUFFLENBQUM7SUFFbkMsT0FBTyxrQkFBUSxDQUFDLE9BQU8sQ0FBQyxlQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDdEMsSUFBSSxDQUFrQixLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUU7UUFDbkMsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLEVBQzVEO1lBQ0MsT0FBTyxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1NBQzFCO1FBQ0QsT0FBTyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUE7SUFDeEIsQ0FBQyxDQUFDO1NBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ1YsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzNCLE9BQU8sVUFBVSxFQUFFLENBQUE7SUFDcEIsQ0FBQyxDQUFDO1NBQ0QsS0FBSyxDQUFrQixDQUFDLENBQUMsRUFBRTtRQUMzQixnQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDeEIsT0FBTyxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQzNCLENBQUMsQ0FBQztTQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLHFCQUFVLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3ZELEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGVBQVUsRUFBRSxDQUFDLENBQ3RCO0FBQ0gsQ0FBQztBQXZCRCxrQ0F1QkM7QUFFRCxTQUFTLFVBQVU7SUFFbEIsT0FBTyxrQkFBUTtTQUNiLE9BQU8sQ0FBQyxxQkFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ25CLElBQUksQ0FBa0IsQ0FBQyxDQUFDLEVBQUU7UUFDMUIsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUE7SUFDaEIsQ0FBQyxDQUFDLENBQ0Q7QUFDSCxDQUFDO0FBRUQsa0JBQWUsV0FBVyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8yLzMuXG4gKi9cblxuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCB7IHN0YXQsIHJlYWRKU09OLCBvdXRwdXRKU09OIH0gZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IGZldGNoIGZyb20gJ2Nyb3NzLWZldGNoJztcbmltcG9ydCB7IElOb3ZlbFN0YXRDYWNoZSB9IGZyb20gJ0Bub2RlLW5vdmVsL2NhY2hlLWxvYWRlcic7XG5pbXBvcnQgeyBnZXRMb2NhbEZpbGVuYW1lIH0gZnJvbSAnLi9sb2FkJztcbmltcG9ydCBidWlsZENhY2hlIGZyb20gJy4vYnVpbGQnO1xuaW1wb3J0IGNvbnNvbGUgZnJvbSAnZGVidWctY29sb3IyL2xvZ2dlcic7XG5cbmxldCB1cmwgPSBgaHR0cHM6Ly9naXRsYWIuY29tL25vdmVsLWdyb3VwL3R4dC1zb3VyY2UvcmF3L21hc3Rlci9ub3ZlbC1zdGF0Lmpzb25gO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlQ2FjaGUoZm9yY2U/OiBib29sZWFuKVxue1xuXHRsZXQgbG9jYWxGaWxlID0gZ2V0TG9jYWxGaWxlbmFtZSgpO1xuXG5cdHJldHVybiBCbHVlYmlyZC5yZXNvbHZlKHN0YXQobG9jYWxGaWxlKSlcblx0XHQudGhlbjxJTm92ZWxTdGF0Q2FjaGU+KGFzeW5jIChzdCkgPT4ge1xuXHRcdFx0aWYgKCFmb3JjZSAmJiBzdCAmJiAoRGF0ZS5ub3coKSAtIHN0Lm10aW1lTXMpIDwgODY0MDAgKiAxMDAwKVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4gcmVhZEpTT04obG9jYWxGaWxlKVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KClcblx0XHR9KVxuXHRcdC5jYXRjaChlID0+IHtcblx0XHRcdGNvbnNvbGUuZGVidWcoYOabtOaWsCAke3VybH1gKTtcblx0XHRcdHJldHVybiBmZXRjaENhY2hlKClcblx0XHR9KVxuXHRcdC5jYXRjaDxJTm92ZWxTdGF0Q2FjaGU+KGUgPT4ge1xuXHRcdFx0Y29uc29sZS53YXJuKGUubWVzc2FnZSk7XG5cdFx0XHRyZXR1cm4gcmVhZEpTT04obG9jYWxGaWxlKVxuXHRcdH0pXG5cdFx0LnRhcChkYXRhID0+IG91dHB1dEpTT04obG9jYWxGaWxlLCBkYXRhLCB7IHNwYWNlczogMiB9KSlcblx0XHQudGFwKHYgPT4gYnVpbGRDYWNoZSgpKVxuXHRcdDtcbn1cblxuZnVuY3Rpb24gZmV0Y2hDYWNoZSgpXG57XG5cdHJldHVybiBCbHVlYmlyZFxuXHRcdC5yZXNvbHZlKGZldGNoKHVybCkpXG5cdFx0LnRoZW48SU5vdmVsU3RhdENhY2hlPih2ID0+IHtcblx0XHRcdHJldHVybiB2Lmpzb24oKVxuXHRcdH0pXG5cdFx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCB1cGRhdGVDYWNoZVxuXG4iXX0=