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
        logger_1.default.warn(e.message || e);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXBkYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBSUEsd0RBQWdDO0FBQ2hDLHVDQUFzRDtBQUN0RCxxREFBNkI7QUFFN0IsaUNBQTBDO0FBQzFDLG9EQUFpQztBQUNqQyxpRUFBMEM7QUFDMUMsMkRBQW1DO0FBRW5DLElBQUksR0FBRyxHQUFHLHNFQUFzRSxDQUFDO0FBRTFFLEtBQUssVUFBVSxXQUFXLENBQUMsS0FBZTtJQUVoRCxJQUFJLFNBQVMsR0FBRyx1QkFBZ0IsRUFBRSxDQUFDO0lBRW5DLE9BQU8sa0JBQVEsQ0FBQyxPQUFPLENBQUMsZUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3RDLElBQUksQ0FBa0IsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFO1FBQ25DLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLEVBQ25FO1lBQ0MsT0FBTyxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1NBQzFCO1FBQ0QsT0FBTyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUE7SUFDeEIsQ0FBQyxDQUFDO1NBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBRVYsSUFBSSxLQUFLLEdBQUcsa0JBQVEsRUFBRSxDQUFDO1FBRXZCLElBQUksS0FBSyxFQUNUO1lBQ0MsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ2xDO1FBRUQsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzdCLE9BQU8sVUFBVSxFQUFFO2FBQ2pCLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGdCQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBQ3pDLENBQUMsQ0FBQztTQUNELEtBQUssQ0FBa0IsQ0FBQyxDQUFDLEVBQUU7UUFDM0IsZ0JBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM3QixPQUFPLG1CQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDM0IsQ0FBQyxDQUFDO1NBQ0QsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMscUJBQVUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDdkQsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsZUFBVSxFQUFFLENBQUMsQ0FDdEI7QUFDSCxDQUFDO0FBaENELGtDQWdDQztBQUVELFNBQVMsVUFBVTtJQUVsQixPQUFPLGtCQUFRO1NBQ2IsT0FBTyxDQUFDLGVBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNuQixJQUFJLENBQWtCLENBQUMsQ0FBQyxFQUFFO1FBQzFCLE9BQU8sa0JBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2FBQy9CLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDckIsSUFDQTtnQkFDQyxnQkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQzthQUNoQztZQUNELE9BQU8sQ0FBQyxFQUNSO2FBRUM7UUFDRixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUNEO0FBQ0gsQ0FBQztBQUVELGtCQUFlLFdBQVcsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMjAvMi8zLlxuICovXG5cbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgeyBzdGF0LCByZWFkSlNPTiwgb3V0cHV0SlNPTiB9IGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCBmZXRjaCBmcm9tICcuLi9mZXRjaCc7XG5pbXBvcnQgeyBJTm92ZWxTdGF0Q2FjaGUgfSBmcm9tICdAbm9kZS1ub3ZlbC9jYWNoZS1sb2FkZXInO1xuaW1wb3J0IHsgZ2V0TG9jYWxGaWxlbmFtZSB9IGZyb20gJy4vbG9hZCc7XG5pbXBvcnQgYnVpbGRDYWNoZSBmcm9tICcuL2J1aWxkJztcbmltcG9ydCBjb25zb2xlIGZyb20gJ2RlYnVnLWNvbG9yMi9sb2dnZXInO1xuaW1wb3J0IGdldFByb3h5IGZyb20gJy4uL2dldFByb3h5JztcblxubGV0IHVybCA9IGBodHRwczovL2dpdGxhYi5jb20vbm92ZWwtZ3JvdXAvdHh0LXNvdXJjZS9yYXcvbWFzdGVyL25vdmVsLXN0YXQuanNvbmA7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVDYWNoZShmb3JjZT86IGJvb2xlYW4pXG57XG5cdGxldCBsb2NhbEZpbGUgPSBnZXRMb2NhbEZpbGVuYW1lKCk7XG5cblx0cmV0dXJuIEJsdWViaXJkLnJlc29sdmUoc3RhdChsb2NhbEZpbGUpKVxuXHRcdC50aGVuPElOb3ZlbFN0YXRDYWNoZT4oYXN5bmMgKHN0KSA9PiB7XG5cdFx0XHRpZiAoIWZvcmNlICYmIHN0ICYmIChEYXRlLm5vdygpIC0gc3QubXRpbWVNcykgPCAxMiAqIDYwICogNjAgKiAxMDAwKVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4gcmVhZEpTT04obG9jYWxGaWxlKVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KClcblx0XHR9KVxuXHRcdC5jYXRjaChlID0+IHtcblxuXHRcdFx0bGV0IHByb3h5ID0gZ2V0UHJveHkoKTtcblxuXHRcdFx0aWYgKHByb3h5KVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zb2xlLmRlYnVnKGB1c2UgcHJveHlgLCBwcm94eSk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnNvbGUuZGVidWcoYOWYl+ippuabtOaWsCAke3VybH1gKTtcblx0XHRcdHJldHVybiBmZXRjaENhY2hlKClcblx0XHRcdFx0LnRhcCh2ID0+IGNvbnNvbGUuZGVidWcoYOabtOaWsOWujOaIkCAke3VybH1gKSlcblx0XHR9KVxuXHRcdC5jYXRjaDxJTm92ZWxTdGF0Q2FjaGU+KGUgPT4ge1xuXHRcdFx0Y29uc29sZS53YXJuKGUubWVzc2FnZSB8fCBlKTtcblx0XHRcdHJldHVybiByZWFkSlNPTihsb2NhbEZpbGUpXG5cdFx0fSlcblx0XHQudGFwKGRhdGEgPT4gb3V0cHV0SlNPTihsb2NhbEZpbGUsIGRhdGEsIHsgc3BhY2VzOiAyIH0pKVxuXHRcdC50YXAodiA9PiBidWlsZENhY2hlKCkpXG5cdFx0O1xufVxuXG5mdW5jdGlvbiBmZXRjaENhY2hlKClcbntcblx0cmV0dXJuIEJsdWViaXJkXG5cdFx0LnJlc29sdmUoZmV0Y2godXJsKSlcblx0XHQudGhlbjxJTm92ZWxTdGF0Q2FjaGU+KHYgPT4ge1xuXHRcdFx0cmV0dXJuIEJsdWViaXJkLnJlc29sdmUodi5qc29uKCkpXG5cdFx0XHRcdC50YXBDYXRjaChhc3luYyAoZSkgPT4ge1xuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNvbnNvbGUucmVkLmRpcihhd2FpdCB2LnRleHQoKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNhdGNoIChlKVxuXHRcdFx0XHRcdHtcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHR9KVxuXHRcdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdXBkYXRlQ2FjaGVcblxuIl19