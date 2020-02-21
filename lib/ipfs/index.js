"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../util/index");
const bluebird_1 = __importDefault(require("bluebird"));
const fetch_1 = __importDefault(require("../fetch"));
const hash_sum_1 = __importDefault(require("hash-sum"));
const server = `https://api-file-server.epub.now.sh/`;
function newURL(siteID, novelID) {
    return new URL(`db/file/${siteID}/${hash_sum_1.default(novelID)}`, server);
}
exports.newURL = newURL;
function getEpubFileInfo(_siteID, _novelID) {
    let { siteID, novelID } = index_1.handleArgvList(_siteID, _novelID);
    let timeout = 5 * 1000;
    return new bluebird_1.default((resolve, reject) => {
        let max = siteID.length * novelID.length;
        let i = 0;
        function _resolve(e) {
            i++;
            if (e && e.error === false) {
                return resolve(e.data);
            }
            if (i >= max) {
                return reject(e);
            }
        }
        function _reject(e) {
            i++;
            if (i >= max) {
                return reject(e);
            }
        }
        siteID.forEach(siteID => {
            novelID.forEach(novelID => {
                let url = newURL(siteID, novelID);
                console.debug(url.href);
                fetch_1.default(url.href, {
                    timeout,
                })
                    .then(v => v.json())
                    .then(_resolve)
                    .catch(_reject);
            });
        });
    })
        .timeout(timeout + 5 * 1000);
}
exports.getEpubFileInfo = getEpubFileInfo;
function putEpubFileInfo(siteID, novelID, data) {
    let url = newURL(siteID, novelID);
    let timeout = 5 * 1000;
    console.debug(url.href);
    return fetch_1.default(url.href, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        timeout,
    });
}
exports.putEpubFileInfo = putEpubFileInfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLHlDQUErQztBQUMvQyx3REFBZ0M7QUFFaEMscURBQTZCO0FBQzdCLHdEQUErQjtBQUcvQixNQUFNLE1BQU0sR0FBRyxzQ0FBc0MsQ0FBQztBQUV0RCxTQUFnQixNQUFNLENBQUMsTUFBYyxFQUFFLE9BQWU7SUFFckQsT0FBTyxJQUFJLEdBQUcsQ0FBQyxXQUFXLE1BQU0sSUFBSSxrQkFBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDakUsQ0FBQztBQUhELHdCQUdDO0FBRUQsU0FBZ0IsZUFBZSxDQUFDLE9BQTBCLEVBQUUsUUFBMkI7SUFFdEYsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxzQkFBYyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUU1RCxJQUFJLE9BQU8sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBRXZCLE9BQU8sSUFBSSxrQkFBUSxDQUFlLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBRXJELElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUN6QyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFVixTQUFTLFFBQVEsQ0FBQyxDQUFDO1lBRWxCLENBQUMsRUFBRSxDQUFDO1lBRUosSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLEVBQzFCO2dCQUNDLE9BQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQTthQUN0QjtZQUVELElBQUksQ0FBQyxJQUFJLEdBQUcsRUFDWjtnQkFDQyxPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTthQUNoQjtRQUNGLENBQUM7UUFFRCxTQUFTLE9BQU8sQ0FBQyxDQUFDO1lBRWpCLENBQUMsRUFBRSxDQUFDO1lBQ0osSUFBSSxDQUFDLElBQUksR0FBRyxFQUNaO2dCQUNDLE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO2FBQ2hCO1FBQ0YsQ0FBQztRQUVELE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFFdkIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFFekIsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFFbEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBRXZCLGVBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFO29CQUNmLE9BQU87aUJBQ1AsQ0FBQztxQkFDQSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7cUJBQ25CLElBQUksQ0FBQyxRQUFRLENBQUM7cUJBQ2QsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUNmO1lBQ0YsQ0FBQyxDQUFDLENBQUE7UUFFSCxDQUFDLENBQUMsQ0FBQTtJQUVILENBQUMsQ0FBQztTQUNBLE9BQU8sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUM1QjtBQUNGLENBQUM7QUF6REQsMENBeURDO0FBRUQsU0FBZ0IsZUFBZSxDQUFDLE1BQWMsRUFBRSxPQUFlLEVBQUUsSUFBa0I7SUFFbEYsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUVsQyxJQUFJLE9BQU8sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBV3ZCLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXhCLE9BQU8sZUFBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7UUFDdEIsTUFBTSxFQUFFLE1BQU07UUFDZCxPQUFPLEVBQUU7WUFDUixRQUFRLEVBQUUsa0JBQWtCO1lBQzVCLGNBQWMsRUFBRSxrQkFBa0I7U0FDbEM7UUFDRCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDMUIsT0FBTztLQUNQLENBQUMsQ0FBQTtBQUNILENBQUM7QUExQkQsMENBMEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXJyYXlfdW5pcXVlLCBhcnJheV91bmlxdWVfb3ZlcndyaXRlIH0gZnJvbSAnYXJyYXktaHlwZXItdW5pcXVlJztcbmltcG9ydCB7IGhhbmRsZUFyZ3ZMaXN0IH0gZnJvbSAnLi4vdXRpbC9pbmRleCc7XG5pbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IGZldGNoSVBGUyBmcm9tICdmZXRjaC1pcGZzJztcbmltcG9ydCBmZXRjaCBmcm9tICcuLi9mZXRjaCc7XG5pbXBvcnQgaGFzaFN1bSBmcm9tICdoYXNoLXN1bSc7XG5pbXBvcnQgeyBJR3VuRXB1Yk5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5cbmNvbnN0IHNlcnZlciA9IGBodHRwczovL2FwaS1maWxlLXNlcnZlci5lcHViLm5vdy5zaC9gO1xuXG5leHBvcnQgZnVuY3Rpb24gbmV3VVJMKHNpdGVJRDogc3RyaW5nLCBub3ZlbElEOiBzdHJpbmcpXG57XG5cdHJldHVybiBuZXcgVVJMKGBkYi9maWxlLyR7c2l0ZUlEfS8ke2hhc2hTdW0obm92ZWxJRCl9YCwgc2VydmVyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVwdWJGaWxlSW5mbyhfc2l0ZUlEOiBzdHJpbmcgfCBzdHJpbmdbXSwgX25vdmVsSUQ6IHN0cmluZyB8IHN0cmluZ1tdKVxue1xuXHRsZXQgeyBzaXRlSUQsIG5vdmVsSUQgfSA9IGhhbmRsZUFyZ3ZMaXN0KF9zaXRlSUQsIF9ub3ZlbElEKTtcblxuXHRsZXQgdGltZW91dCA9IDUgKiAxMDAwO1xuXG5cdHJldHVybiBuZXcgQmx1ZWJpcmQ8SUd1bkVwdWJOb2RlPigocmVzb2x2ZSwgcmVqZWN0KSA9PlxuXHR7XG5cdFx0bGV0IG1heCA9IHNpdGVJRC5sZW5ndGggKiBub3ZlbElELmxlbmd0aDtcblx0XHRsZXQgaSA9IDA7XG5cblx0XHRmdW5jdGlvbiBfcmVzb2x2ZShlKVxuXHRcdHtcblx0XHRcdGkrKztcblxuXHRcdFx0aWYgKGUgJiYgZS5lcnJvciA9PT0gZmFsc2UpXG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiByZXNvbHZlKGUuZGF0YSlcblx0XHRcdH1cblxuXHRcdFx0aWYgKGkgPj0gbWF4KVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4gcmVqZWN0KGUpXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gX3JlamVjdChlKVxuXHRcdHtcblx0XHRcdGkrKztcblx0XHRcdGlmIChpID49IG1heClcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIHJlamVjdChlKVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHNpdGVJRC5mb3JFYWNoKHNpdGVJRCA9PlxuXHRcdHtcblx0XHRcdG5vdmVsSUQuZm9yRWFjaChub3ZlbElEID0+XG5cdFx0XHR7XG5cdFx0XHRcdGxldCB1cmwgPSBuZXdVUkwoc2l0ZUlELCBub3ZlbElEKTtcblxuXHRcdFx0XHRjb25zb2xlLmRlYnVnKHVybC5ocmVmKVxuXG5cdFx0XHRcdGZldGNoKHVybC5ocmVmLCB7XG5cdFx0XHRcdFx0dGltZW91dCxcblx0XHRcdFx0fSlcblx0XHRcdFx0XHQudGhlbih2ID0+IHYuanNvbigpKVxuXHRcdFx0XHRcdC50aGVuKF9yZXNvbHZlKVxuXHRcdFx0XHRcdC5jYXRjaChfcmVqZWN0KVxuXHRcdFx0XHQ7XG5cdFx0XHR9KVxuXG5cdFx0fSlcblxuXHR9KVxuXHRcdC50aW1lb3V0KHRpbWVvdXQgKyA1ICogMTAwMClcblx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHV0RXB1YkZpbGVJbmZvKHNpdGVJRDogc3RyaW5nLCBub3ZlbElEOiBzdHJpbmcsIGRhdGE6IElHdW5FcHViTm9kZSlcbntcblx0bGV0IHVybCA9IG5ld1VSTChzaXRlSUQsIG5vdmVsSUQpO1xuXG5cdGxldCB0aW1lb3V0ID0gNSAqIDEwMDA7XG5cbi8vXHRsZXQgYm9keSA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoKTtcbi8vXG4vL1x0T2JqZWN0LmVudHJpZXMoZGF0YSlcbi8vXHRcdC8vIEB0cy1pZ25vcmVcbi8vXHRcdC5mb3JFYWNoKChbaywgdl0pID0+IGJvZHkuc2V0KGssIHYpKVxuLy9cdDtcblxuXHQvL3JldHVybiBCbHVlYmlyZC5yZXNvbHZlKGJvZHkpO1xuXG5cdGNvbnNvbGUuZGVidWcodXJsLmhyZWYpO1xuXG5cdHJldHVybiBmZXRjaCh1cmwuaHJlZiwge1xuXHRcdG1ldGhvZDogJ1BPU1QnLFxuXHRcdGhlYWRlcnM6IHtcblx0XHRcdCdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG5cdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG5cdFx0fSxcblx0XHRib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKSxcblx0XHR0aW1lb3V0LFxuXHR9KVxufVxuIl19