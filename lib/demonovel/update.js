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
let url = `https://gitlab.com/novel-group/txt-source/raw/master/novel-stat.json`;
async function updateCache() {
    let localFile = load_1.getLocalFilename();
    return bluebird_1.default.resolve(fs_extra_1.stat(localFile))
        .then(async (st) => {
        if (st && (Date.now() - st.mtimeMs) < 86400 * 1000) {
            return fs_extra_1.readJSON(localFile);
        }
        return Promise.reject();
    })
        .catch(e => fetchCache())
        .catch(e => {
        console.warn(e.message);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXBkYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBSUEsd0RBQWdDO0FBQ2hDLHVDQUFzRDtBQUN0RCw4REFBZ0M7QUFFaEMsaUNBQTBDO0FBQzFDLG9EQUFpQztBQUVqQyxJQUFJLEdBQUcsR0FBRyxzRUFBc0UsQ0FBQztBQUUxRSxLQUFLLFVBQVUsV0FBVztJQUVoQyxJQUFJLFNBQVMsR0FBRyx1QkFBZ0IsRUFBRSxDQUFDO0lBRW5DLE9BQU8sa0JBQVEsQ0FBQyxPQUFPLENBQUMsZUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3RDLElBQUksQ0FBa0IsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFO1FBQ25DLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxFQUNsRDtZQUNDLE9BQU8sbUJBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTtTQUMxQjtRQUNELE9BQU8sT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFBO0lBQ3hCLENBQUMsQ0FBQztTQUNELEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQ3hCLEtBQUssQ0FBa0IsQ0FBQyxDQUFDLEVBQUU7UUFDM0IsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDeEIsT0FBTyxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQzNCLENBQUMsQ0FBQztTQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLHFCQUFVLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3ZELEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGVBQVUsRUFBRSxDQUFDLENBQ3RCO0FBQ0gsQ0FBQztBQXBCRCxrQ0FvQkM7QUFFRCxTQUFTLFVBQVU7SUFFbEIsT0FBTyxrQkFBUTtTQUNiLE9BQU8sQ0FBQyxxQkFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ25CLElBQUksQ0FBa0IsQ0FBQyxDQUFDLEVBQUU7UUFDMUIsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUE7SUFDaEIsQ0FBQyxDQUFDLENBQ0Q7QUFDSCxDQUFDO0FBRUQsa0JBQWUsV0FBVyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8yLzMuXG4gKi9cblxuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCB7IHN0YXQsIHJlYWRKU09OLCBvdXRwdXRKU09OIH0gZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IGZldGNoIGZyb20gJ2Nyb3NzLWZldGNoJztcbmltcG9ydCB7IElOb3ZlbFN0YXRDYWNoZSB9IGZyb20gJ0Bub2RlLW5vdmVsL2NhY2hlLWxvYWRlcic7XG5pbXBvcnQgeyBnZXRMb2NhbEZpbGVuYW1lIH0gZnJvbSAnLi9sb2FkJztcbmltcG9ydCBidWlsZENhY2hlIGZyb20gJy4vYnVpbGQnO1xuXG5sZXQgdXJsID0gYGh0dHBzOi8vZ2l0bGFiLmNvbS9ub3ZlbC1ncm91cC90eHQtc291cmNlL3Jhdy9tYXN0ZXIvbm92ZWwtc3RhdC5qc29uYDtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUNhY2hlKClcbntcblx0bGV0IGxvY2FsRmlsZSA9IGdldExvY2FsRmlsZW5hbWUoKTtcblxuXHRyZXR1cm4gQmx1ZWJpcmQucmVzb2x2ZShzdGF0KGxvY2FsRmlsZSkpXG5cdFx0LnRoZW48SU5vdmVsU3RhdENhY2hlPihhc3luYyAoc3QpID0+IHtcblx0XHRcdGlmIChzdCAmJiAoRGF0ZS5ub3coKSAtIHN0Lm10aW1lTXMpIDwgODY0MDAgKiAxMDAwKVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4gcmVhZEpTT04obG9jYWxGaWxlKVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KClcblx0XHR9KVxuXHRcdC5jYXRjaChlID0+IGZldGNoQ2FjaGUoKSlcblx0XHQuY2F0Y2g8SU5vdmVsU3RhdENhY2hlPihlID0+IHtcblx0XHRcdGNvbnNvbGUud2FybihlLm1lc3NhZ2UpO1xuXHRcdFx0cmV0dXJuIHJlYWRKU09OKGxvY2FsRmlsZSlcblx0XHR9KVxuXHRcdC50YXAoZGF0YSA9PiBvdXRwdXRKU09OKGxvY2FsRmlsZSwgZGF0YSwgeyBzcGFjZXM6IDIgfSkpXG5cdFx0LnRhcCh2ID0+IGJ1aWxkQ2FjaGUoKSlcblx0XHQ7XG59XG5cbmZ1bmN0aW9uIGZldGNoQ2FjaGUoKVxue1xuXHRyZXR1cm4gQmx1ZWJpcmRcblx0XHQucmVzb2x2ZShmZXRjaCh1cmwpKVxuXHRcdC50aGVuPElOb3ZlbFN0YXRDYWNoZT4odiA9PiB7XG5cdFx0XHRyZXR1cm4gdi5qc29uKClcblx0XHR9KVxuXHRcdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdXBkYXRlQ2FjaGVcblxuIl19