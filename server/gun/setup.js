"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gun_1 = __importDefault(require("gun"));
require("gun-tag");
const path_1 = require("path");
const const_1 = require("../../lib/const");
const fs_extra_1 = require("fs-extra");
const logger_1 = __importDefault(require("debug-color2/logger"));
let gun;
exports.gun = gun;
gun_1.default.log.off = true;
function setupGun(app) {
    let file = path_1.join(const_1.OUTPUT_DIR, 'novel-opds-now.cache', 'radata');
    fs_extra_1.ensureDirSync(file);
    let _gun = new gun_1.default({
        web: app,
        peers: [
            "https://gunjs.herokuapp.com/gun",
            "http://nmr.io:8765/gun",
            "https://my-test-gun-server.herokuapp.com/gun",
        ],
        file,
        log() {
        },
    });
    logger_1.default.debug(`P2P 緩存位於 ${file}`);
    exports.gun = gun = _gun;
    return _gun;
}
exports.setupGun = setupGun;
function useGun() {
    return useGunRoot()
        .get('epub-file');
}
exports.useGun = useGun;
function useGunRoot() {
    return gun || (exports.gun = gun = setupGun());
}
exports.useGunRoot = useGunRoot;
exports.default = useGun;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXR1cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUlBLDhDQUFzQjtBQUV0QixtQkFBaUI7QUFHakIsK0JBQTRCO0FBQzVCLDJDQUE2QztBQUM3Qyx1Q0FBeUM7QUFDekMsaUVBQTBDO0FBTzFDLElBQUksR0FBZ0MsQ0FBQztBQW1ENUIsa0JBQUc7QUE3Q1osYUFBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBRW5CLFNBQWdCLFFBQVEsQ0FBQyxHQUFzQjtJQUU5QyxJQUFJLElBQUksR0FBRyxXQUFJLENBQUMsa0JBQVUsRUFBRSxzQkFBc0IsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM5RCx3QkFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXBCLElBQUksSUFBSSxHQUFHLElBQUksYUFBRyxDQUlmO1FBQ0YsR0FBRyxFQUFFLEdBQUc7UUFDUixLQUFLLEVBQUU7WUFFTixpQ0FBaUM7WUFDakMsd0JBQXdCO1lBQ3hCLDhDQUE4QztTQUM5QztRQUNELElBQUk7UUFDSixHQUFHO1FBR0gsQ0FBQztLQUNELENBQUMsQ0FBQztJQUVILGdCQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksSUFBSSxFQUFFLENBQUMsQ0FBQztJQUVsQyxjQUFBLEdBQUcsR0FBRyxJQUFJLENBQUM7SUFFWCxPQUFPLElBQUksQ0FBQTtBQUNaLENBQUM7QUE3QkQsNEJBNkJDO0FBRUQsU0FBZ0IsTUFBTTtJQUVyQixPQUFPLFVBQVUsRUFBRTtTQUNqQixHQUFHLENBQUMsV0FBVyxDQUFDLENBQ2hCO0FBQ0gsQ0FBQztBQUxELHdCQUtDO0FBRUQsU0FBZ0IsVUFBVTtJQUV6QixPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQUEsR0FBRyxHQUFHLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFDbEMsQ0FBQztBQUhELGdDQUdDO0FBSUQsa0JBQWUsTUFBTSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8yLzEuXG4gKi9cblxuaW1wb3J0IEd1biBmcm9tICdndW4nO1xuLy9pbXBvcnQgJ2d1bi9saWIvc2VydmVyJztcbmltcG9ydCAnZ3VuLXRhZyc7XG5pbXBvcnQgdHlwZSB7IEV4cHJlc3MgfSBmcm9tICdleHByZXNzJztcbmltcG9ydCBfX3Jvb3QgZnJvbSAnLi4vLi4vbGliL19fcm9vdCc7XG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBPVVRQVVRfRElSIH0gZnJvbSAnLi4vLi4vbGliL2NvbnN0JztcbmltcG9ydCB7IGVuc3VyZURpclN5bmMgfSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgY29uc29sZSBmcm9tICdkZWJ1Zy1jb2xvcjIvbG9nZ2VyJztcbmltcG9ydCB0eXBlIHsgU2VydmVyIH0gZnJvbSAnaHR0cCc7XG5pbXBvcnQgeyBJR3VuU3RhdGljIH0gZnJvbSAnZ3VuL3R5cGVzL3N0YXRpYyc7XG5pbXBvcnQgdHlwZSB7IElHdW5FcHViTm9kZSB9IGZyb20gJy4uLy4uL2xpYi90eXBlcyc7XG5pbXBvcnQgdHlwZSB7IEVudW1JREtFWUxpc3QsIEVudW1JREtFWUxpc3RTdHJpbmcgfSBmcm9tICdub3ZlbC1kb3dubG9hZGVyL3NyYy9hbGwvY29uc3QnO1xuaW1wb3J0IFJhZGlzayBmcm9tICdndW4vbGliL3JhZGlzayc7XG5cbmxldCBndW46IFJldHVyblR5cGU8dHlwZW9mIHNldHVwR3VuPjtcblxuLy8gQHRzLWlnbm9yZVxuLy9HdW4ubG9nID0gT2JqZWN0LmFzc2lnbigoKSA9PiB7fSwgR3VuLmxvZywge1xuLy9cdHZlcmJvc2U6IGZhbHNlLFxuLy99KTtcbkd1bi5sb2cub2ZmID0gdHJ1ZTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldHVwR3VuKGFwcD86IEV4cHJlc3MgfCBTZXJ2ZXIpXG57XG5cdGxldCBmaWxlID0gam9pbihPVVRQVVRfRElSLCAnbm92ZWwtb3Bkcy1ub3cuY2FjaGUnLCAncmFkYXRhJyk7XG5cdGVuc3VyZURpclN5bmMoZmlsZSk7XG5cblx0bGV0IF9ndW4gPSBuZXcgR3VuPHtcblx0XHQnZXB1Yi1maWxlJzoge1xuXHRcdFx0W0sgaW4gRW51bUlES0VZTGlzdFN0cmluZyB8IEVudW1JREtFWUxpc3RdOiBSZWNvcmQ8c3RyaW5nLCBJR3VuRXB1Yk5vZGU+XG5cdFx0fVxuXHR9Pih7XG5cdFx0d2ViOiBhcHAsXG5cdFx0cGVlcnM6IFtcblx0XHRcdC8vXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvZ3VuXCIsXG5cdFx0XHRcImh0dHBzOi8vZ3VuanMuaGVyb2t1YXBwLmNvbS9ndW5cIixcblx0XHRcdFwiaHR0cDovL25tci5pbzo4NzY1L2d1blwiLFxuXHRcdFx0XCJodHRwczovL215LXRlc3QtZ3VuLXNlcnZlci5oZXJva3VhcHAuY29tL2d1blwiLFxuXHRcdF0sXG5cdFx0ZmlsZSxcblx0XHRsb2coKVxuXHRcdHtcblxuXHRcdH0sXG5cdH0pO1xuXG5cdGNvbnNvbGUuZGVidWcoYFAyUCDnt6nlrZjkvY3mlrwgJHtmaWxlfWApO1xuXG5cdGd1biA9IF9ndW47XG5cblx0cmV0dXJuIF9ndW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUd1bigpXG57XG5cdHJldHVybiB1c2VHdW5Sb290KClcblx0XHQuZ2V0KCdlcHViLWZpbGUnKVxuXHRcdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUd1blJvb3QoKVxue1xuXHRyZXR1cm4gZ3VuIHx8IChndW4gPSBzZXR1cEd1bigpKTtcbn1cblxuZXhwb3J0IHsgZ3VuIH1cblxuZXhwb3J0IGRlZmF1bHQgdXNlR3VuXG4iXX0=