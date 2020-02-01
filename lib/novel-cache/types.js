"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const __root_1 = __importDefault(require("../__root"));
exports.id_titles_map = {
    dmzj: 'cached-dmzj/data/novel/id_titles.json',
    esjzone: 'cached-esjzone/data/novel/id_titles.json',
    wenku8: 'cached-wenku8/data/novel/id_titles.json',
};
exports.id_update_map = {
    dmzj: 'cached-dmzj/data/novel/id_update.json',
    esjzone: 'cached-esjzone/data/novel/id_update.json',
    wenku8: 'cached-wenku8/data/novel/id_update.json',
};
exports.builded_map = {
    dmzj: 'builded.json',
    esjzone: 'builded.json',
    wenku8: 'builded.json',
};
exports.pathPrefix = {
    module: '@node-novel/',
    github: 'https://github.com/bluelovers/ws-rest/raw/master/packages/%40node-novel/',
    cache: path_1.join(__root_1.default, '.cache', 'cached') + '/',
};
function getLocalFilename(siteID, map) {
    return `${exports.pathPrefix.cache}${siteID}/${path_1.basename(map[siteID])}`;
}
exports.getLocalFilename = getLocalFilename;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0eXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLCtCQUFzQztBQUN0Qyx1REFBK0I7QUFJbEIsUUFBQSxhQUFhLEdBQUc7SUFDNUIsSUFBSSxFQUFFLHVDQUF1QztJQUM3QyxPQUFPLEVBQUUsMENBQTBDO0lBRW5ELE1BQU0sRUFBRSx5Q0FBeUM7Q0FDakQsQ0FBQztBQUVXLFFBQUEsYUFBYSxHQUFHO0lBQzVCLElBQUksRUFBRSx1Q0FBdUM7SUFDN0MsT0FBTyxFQUFFLDBDQUEwQztJQUVuRCxNQUFNLEVBQUUseUNBQXlDO0NBQ2pELENBQUM7QUFFVyxRQUFBLFdBQVcsR0FBRztJQUMxQixJQUFJLEVBQUUsY0FBYztJQUNwQixPQUFPLEVBQUUsY0FBYztJQUV2QixNQUFNLEVBQUUsY0FBYztDQUN0QixDQUFDO0FBRVcsUUFBQSxVQUFVLEdBQUc7SUFDekIsTUFBTSxFQUFFLGNBQWM7SUFDdEIsTUFBTSxFQUFFLDBFQUEwRTtJQUNsRixLQUFLLEVBQUUsV0FBSSxDQUFDLGdCQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxHQUFHLEdBQUc7Q0FDN0MsQ0FBQztBQUVGLFNBQWdCLGdCQUFnQixDQUFDLE1BQWdCLEVBQUUsR0FBNkI7SUFFL0UsT0FBTyxHQUFHLGtCQUFVLENBQUMsS0FBSyxHQUFHLE1BQU0sSUFBSSxlQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUNoRSxDQUFDO0FBSEQsNENBR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBqb2luLCBiYXNlbmFtZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgX19yb290IGZyb20gJy4uL19fcm9vdCc7XG5cbmV4cG9ydCB0eXBlIElTaXRlSURzID0ga2V5b2YgdHlwZW9mIGlkX3RpdGxlc19tYXA7XG5cbmV4cG9ydCBjb25zdCBpZF90aXRsZXNfbWFwID0ge1xuXHRkbXpqOiAnY2FjaGVkLWRtemovZGF0YS9ub3ZlbC9pZF90aXRsZXMuanNvbicsXG5cdGVzanpvbmU6ICdjYWNoZWQtZXNqem9uZS9kYXRhL25vdmVsL2lkX3RpdGxlcy5qc29uJyxcblx0Ly9tYXNpcm86ICdjYWNoZWQtbWFzaXJvL2RhdGEvbm92ZWwvaWRfdGl0bGVzLmpzb24nLFxuXHR3ZW5rdTg6ICdjYWNoZWQtd2Vua3U4L2RhdGEvbm92ZWwvaWRfdGl0bGVzLmpzb24nLFxufTtcblxuZXhwb3J0IGNvbnN0IGlkX3VwZGF0ZV9tYXAgPSB7XG5cdGRtemo6ICdjYWNoZWQtZG16ai9kYXRhL25vdmVsL2lkX3VwZGF0ZS5qc29uJyxcblx0ZXNqem9uZTogJ2NhY2hlZC1lc2p6b25lL2RhdGEvbm92ZWwvaWRfdXBkYXRlLmpzb24nLFxuXHQvL21hc2lybzogJ2NhY2hlZC1tYXNpcm8vZGF0YS9ub3ZlbC9pZF91cGRhdGUuanNvbicsXG5cdHdlbmt1ODogJ2NhY2hlZC13ZW5rdTgvZGF0YS9ub3ZlbC9pZF91cGRhdGUuanNvbicsXG59O1xuXG5leHBvcnQgY29uc3QgYnVpbGRlZF9tYXAgPSB7XG5cdGRtemo6ICdidWlsZGVkLmpzb24nLFxuXHRlc2p6b25lOiAnYnVpbGRlZC5qc29uJyxcblx0Ly9tYXNpcm86ICdidWlsZGVkLmpzb24nLFxuXHR3ZW5rdTg6ICdidWlsZGVkLmpzb24nLFxufTtcblxuZXhwb3J0IGNvbnN0IHBhdGhQcmVmaXggPSB7XG5cdG1vZHVsZTogJ0Bub2RlLW5vdmVsLycsXG5cdGdpdGh1YjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9ibHVlbG92ZXJzL3dzLXJlc3QvcmF3L21hc3Rlci9wYWNrYWdlcy8lNDBub2RlLW5vdmVsLycsXG5cdGNhY2hlOiBqb2luKF9fcm9vdCwgJy5jYWNoZScsICdjYWNoZWQnKSArICcvJyxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMb2NhbEZpbGVuYW1lKHNpdGVJRDogSVNpdGVJRHMsIG1hcDogUmVjb3JkPElTaXRlSURzLCBzdHJpbmc+KVxue1xuXHRyZXR1cm4gYCR7cGF0aFByZWZpeC5jYWNoZX0ke3NpdGVJRH0vJHtiYXNlbmFtZShtYXBbc2l0ZUlEXSl9YDtcbn1cblxuXG4iXX0=