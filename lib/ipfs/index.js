"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../util/index");
const bluebird_1 = __importDefault(require("bluebird"));
const fetch_1 = __importDefault(require("../fetch"));
const hash_sum_1 = __importDefault(require("hash-sum"));
const server = `https://calm-inlet-73656.herokuapp.com`;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLHlDQUErQztBQUMvQyx3REFBZ0M7QUFFaEMscURBQTZCO0FBQzdCLHdEQUErQjtBQUkvQixNQUFNLE1BQU0sR0FBRyx3Q0FBd0MsQ0FBQztBQUV4RCxTQUFnQixNQUFNLENBQUMsTUFBYyxFQUFFLE9BQWU7SUFFckQsT0FBTyxJQUFJLEdBQUcsQ0FBQyxXQUFXLE1BQU0sSUFBSSxrQkFBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDakUsQ0FBQztBQUhELHdCQUdDO0FBRUQsU0FBZ0IsZUFBZSxDQUFDLE9BQTBCLEVBQUUsUUFBMkI7SUFFdEYsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxzQkFBYyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUU1RCxJQUFJLE9BQU8sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBRXZCLE9BQU8sSUFBSSxrQkFBUSxDQUFlLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBRXJELElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUN6QyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFVixTQUFTLFFBQVEsQ0FBQyxDQUFDO1lBRWxCLENBQUMsRUFBRSxDQUFDO1lBRUosSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLEVBQzFCO2dCQUNDLE9BQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQTthQUN0QjtZQUVELElBQUksQ0FBQyxJQUFJLEdBQUcsRUFDWjtnQkFDQyxPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTthQUNoQjtRQUNGLENBQUM7UUFFRCxTQUFTLE9BQU8sQ0FBQyxDQUFDO1lBRWpCLENBQUMsRUFBRSxDQUFDO1lBQ0osSUFBSSxDQUFDLElBQUksR0FBRyxFQUNaO2dCQUNDLE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO2FBQ2hCO1FBQ0YsQ0FBQztRQUVELE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFFdkIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFFekIsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFJbEMsZUFBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7b0JBQ2YsT0FBTztpQkFDUCxDQUFDO3FCQUNBLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztxQkFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FBQztxQkFDZCxLQUFLLENBQUMsT0FBTyxDQUFDLENBQ2Y7WUFDRixDQUFDLENBQUMsQ0FBQTtRQUVILENBQUMsQ0FBQyxDQUFBO0lBRUgsQ0FBQyxDQUFDO1NBQ0EsT0FBTyxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQzVCO0FBQ0YsQ0FBQztBQXpERCwwQ0F5REM7QUFFRCxTQUFnQixlQUFlLENBQUMsTUFBYyxFQUFFLE9BQWUsRUFBRSxJQUFrQjtJQUVsRixJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRWxDLElBQUksT0FBTyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7SUFhdkIsT0FBTyxlQUFLLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRTtRQUN0QixNQUFNLEVBQUUsTUFBTTtRQUNkLE9BQU8sRUFBRTtZQUNSLFFBQVEsRUFBRSxrQkFBa0I7WUFDNUIsY0FBYyxFQUFFLGtCQUFrQjtTQUNsQztRQUNELElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztRQUMxQixPQUFPO0tBQ1AsQ0FBQyxDQUFBO0FBQ0gsQ0FBQztBQTFCRCwwQ0EwQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhcnJheV91bmlxdWUsIGFycmF5X3VuaXF1ZV9vdmVyd3JpdGUgfSBmcm9tICdhcnJheS1oeXBlci11bmlxdWUnO1xuaW1wb3J0IHsgaGFuZGxlQXJndkxpc3QgfSBmcm9tICcuLi91dGlsL2luZGV4JztcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgZmV0Y2hJUEZTIGZyb20gJ2ZldGNoLWlwZnMnO1xuaW1wb3J0IGZldGNoIGZyb20gJy4uL2ZldGNoJztcbmltcG9ydCBoYXNoU3VtIGZyb20gJ2hhc2gtc3VtJztcbmltcG9ydCB7IElHdW5FcHViTm9kZSB9IGZyb20gJy4uL3R5cGVzJztcblxuLy9jb25zdCBzZXJ2ZXIgPSBgaHR0cHM6Ly9hcGktZmlsZS1zZXJ2ZXIuZXB1Yi5ub3cuc2gvYDtcbmNvbnN0IHNlcnZlciA9IGBodHRwczovL2NhbG0taW5sZXQtNzM2NTYuaGVyb2t1YXBwLmNvbWA7XG5cbmV4cG9ydCBmdW5jdGlvbiBuZXdVUkwoc2l0ZUlEOiBzdHJpbmcsIG5vdmVsSUQ6IHN0cmluZylcbntcblx0cmV0dXJuIG5ldyBVUkwoYGRiL2ZpbGUvJHtzaXRlSUR9LyR7aGFzaFN1bShub3ZlbElEKX1gLCBzZXJ2ZXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RXB1YkZpbGVJbmZvKF9zaXRlSUQ6IHN0cmluZyB8IHN0cmluZ1tdLCBfbm92ZWxJRDogc3RyaW5nIHwgc3RyaW5nW10pXG57XG5cdGxldCB7IHNpdGVJRCwgbm92ZWxJRCB9ID0gaGFuZGxlQXJndkxpc3QoX3NpdGVJRCwgX25vdmVsSUQpO1xuXG5cdGxldCB0aW1lb3V0ID0gNSAqIDEwMDA7XG5cblx0cmV0dXJuIG5ldyBCbHVlYmlyZDxJR3VuRXB1Yk5vZGU+KChyZXNvbHZlLCByZWplY3QpID0+XG5cdHtcblx0XHRsZXQgbWF4ID0gc2l0ZUlELmxlbmd0aCAqIG5vdmVsSUQubGVuZ3RoO1xuXHRcdGxldCBpID0gMDtcblxuXHRcdGZ1bmN0aW9uIF9yZXNvbHZlKGUpXG5cdFx0e1xuXHRcdFx0aSsrO1xuXG5cdFx0XHRpZiAoZSAmJiBlLmVycm9yID09PSBmYWxzZSlcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIHJlc29sdmUoZS5kYXRhKVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoaSA+PSBtYXgpXG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiByZWplY3QoZSlcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBfcmVqZWN0KGUpXG5cdFx0e1xuXHRcdFx0aSsrO1xuXHRcdFx0aWYgKGkgPj0gbWF4KVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4gcmVqZWN0KGUpXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0c2l0ZUlELmZvckVhY2goc2l0ZUlEID0+XG5cdFx0e1xuXHRcdFx0bm92ZWxJRC5mb3JFYWNoKG5vdmVsSUQgPT5cblx0XHRcdHtcblx0XHRcdFx0bGV0IHVybCA9IG5ld1VSTChzaXRlSUQsIG5vdmVsSUQpO1xuXG5cdFx0XHRcdC8vY29uc29sZS5kZWJ1Zyh1cmwuaHJlZilcblxuXHRcdFx0XHRmZXRjaCh1cmwuaHJlZiwge1xuXHRcdFx0XHRcdHRpbWVvdXQsXG5cdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnRoZW4odiA9PiB2Lmpzb24oKSlcblx0XHRcdFx0XHQudGhlbihfcmVzb2x2ZSlcblx0XHRcdFx0XHQuY2F0Y2goX3JlamVjdClcblx0XHRcdFx0O1xuXHRcdFx0fSlcblxuXHRcdH0pXG5cblx0fSlcblx0XHQudGltZW91dCh0aW1lb3V0ICsgNSAqIDEwMDApXG5cdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHB1dEVwdWJGaWxlSW5mbyhzaXRlSUQ6IHN0cmluZywgbm92ZWxJRDogc3RyaW5nLCBkYXRhOiBJR3VuRXB1Yk5vZGUpXG57XG5cdGxldCB1cmwgPSBuZXdVUkwoc2l0ZUlELCBub3ZlbElEKTtcblxuXHRsZXQgdGltZW91dCA9IDUgKiAxMDAwO1xuXG4vL1x0bGV0IGJvZHkgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKCk7XG4vL1xuLy9cdE9iamVjdC5lbnRyaWVzKGRhdGEpXG4vL1x0XHQvLyBAdHMtaWdub3JlXG4vL1x0XHQuZm9yRWFjaCgoW2ssIHZdKSA9PiBib2R5LnNldChrLCB2KSlcbi8vXHQ7XG5cblx0Ly9yZXR1cm4gQmx1ZWJpcmQucmVzb2x2ZShib2R5KTtcblxuXHQvL2NvbnNvbGUuZGVidWcodXJsLmhyZWYpO1xuXG5cdHJldHVybiBmZXRjaCh1cmwuaHJlZiwge1xuXHRcdG1ldGhvZDogJ1BPU1QnLFxuXHRcdGhlYWRlcnM6IHtcblx0XHRcdCdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG5cdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG5cdFx0fSxcblx0XHRib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKSxcblx0XHR0aW1lb3V0LFxuXHR9KVxufVxuIl19