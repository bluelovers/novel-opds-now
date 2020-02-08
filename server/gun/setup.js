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
gun_1.default.log = Object.assign(() => { }, gun_1.default.log, {
    verbose: false,
});
gun_1.default.log.off = true;
console.LOG = false;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXR1cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUlBLDhDQUFzQjtBQUV0QixtQkFBaUI7QUFHakIsK0JBQTRCO0FBQzVCLDJDQUE2QztBQUM3Qyx1Q0FBeUM7QUFDekMsaUVBQTJDO0FBTzNDLElBQUksR0FBZ0MsQ0FBQztBQXNENUIsa0JBQUc7QUFuRFosYUFBRyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFFLENBQUMsRUFBRSxhQUFHLENBQUMsR0FBRyxFQUFFO0lBQzFDLE9BQU8sRUFBRSxLQUFLO0NBQ2QsQ0FBQyxDQUFDO0FBRUgsYUFBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBRW5CLE9BQU8sQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDO0FBRXBCLFNBQWdCLFFBQVEsQ0FBQyxHQUFzQjtJQUU5QyxJQUFJLElBQUksR0FBRyxXQUFJLENBQUMsa0JBQVUsRUFBRSxzQkFBc0IsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM5RCx3QkFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXBCLElBQUksSUFBSSxHQUFHLElBQUksYUFBRyxDQUlmO1FBQ0YsR0FBRyxFQUFFLEdBQUc7UUFDUixLQUFLLEVBQUU7WUFFTixpQ0FBaUM7WUFDakMsd0JBQXdCO1lBQ3hCLDhDQUE4QztTQUM5QztRQUNELElBQUk7UUFDSixHQUFHO1FBR0gsQ0FBQztLQUNELENBQUMsQ0FBQztJQUVILGdCQUFRLENBQUMsS0FBSyxDQUFDLFlBQVksSUFBSSxFQUFFLENBQUMsQ0FBQztJQUVuQyxjQUFBLEdBQUcsR0FBRyxJQUFJLENBQUM7SUFFWCxPQUFPLElBQUksQ0FBQTtBQUNaLENBQUM7QUE3QkQsNEJBNkJDO0FBRUQsU0FBZ0IsTUFBTTtJQUVyQixPQUFPLFVBQVUsRUFBRTtTQUNqQixHQUFHLENBQUMsV0FBVyxDQUFDLENBQ2hCO0FBQ0gsQ0FBQztBQUxELHdCQUtDO0FBRUQsU0FBZ0IsVUFBVTtJQUV6QixPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQUEsR0FBRyxHQUFHLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFDbEMsQ0FBQztBQUhELGdDQUdDO0FBSUQsa0JBQWUsTUFBTSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8yLzEuXG4gKi9cblxuaW1wb3J0IEd1biBmcm9tICdndW4nO1xuLy9pbXBvcnQgJ2d1bi9saWIvc2VydmVyJztcbmltcG9ydCAnZ3VuLXRhZyc7XG5pbXBvcnQgdHlwZSB7IEV4cHJlc3MgfSBmcm9tICdleHByZXNzJztcbmltcG9ydCBfX3Jvb3QgZnJvbSAnLi4vLi4vbGliL19fcm9vdCc7XG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBPVVRQVVRfRElSIH0gZnJvbSAnLi4vLi4vbGliL2NvbnN0JztcbmltcG9ydCB7IGVuc3VyZURpclN5bmMgfSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgX2NvbnNvbGUgZnJvbSAnZGVidWctY29sb3IyL2xvZ2dlcic7XG5pbXBvcnQgdHlwZSB7IFNlcnZlciB9IGZyb20gJ2h0dHAnO1xuaW1wb3J0IHsgSUd1blN0YXRpYyB9IGZyb20gJ2d1bi90eXBlcy9zdGF0aWMnO1xuaW1wb3J0IHR5cGUgeyBJR3VuRXB1Yk5vZGUgfSBmcm9tICcuLi8uLi9saWIvdHlwZXMnO1xuaW1wb3J0IHR5cGUgeyBFbnVtSURLRVlMaXN0LCBFbnVtSURLRVlMaXN0U3RyaW5nIH0gZnJvbSAnbm92ZWwtZG93bmxvYWRlci9zcmMvYWxsL2NvbnN0JztcbmltcG9ydCBSYWRpc2sgZnJvbSAnZ3VuL2xpYi9yYWRpc2snO1xuXG5sZXQgZ3VuOiBSZXR1cm5UeXBlPHR5cGVvZiBzZXR1cEd1bj47XG5cbi8vIEB0cy1pZ25vcmVcbkd1bi5sb2cgPSBPYmplY3QuYXNzaWduKCgpID0+IHt9LCBHdW4ubG9nLCB7XG5cdHZlcmJvc2U6IGZhbHNlLFxufSk7XG4vLyBAdHMtaWdub3JlXG5HdW4ubG9nLm9mZiA9IHRydWU7XG4vLyBAdHMtaWdub3JlXG5jb25zb2xlLkxPRyA9IGZhbHNlO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0dXBHdW4oYXBwPzogRXhwcmVzcyB8IFNlcnZlcilcbntcblx0bGV0IGZpbGUgPSBqb2luKE9VVFBVVF9ESVIsICdub3ZlbC1vcGRzLW5vdy5jYWNoZScsICdyYWRhdGEnKTtcblx0ZW5zdXJlRGlyU3luYyhmaWxlKTtcblxuXHRsZXQgX2d1biA9IG5ldyBHdW48e1xuXHRcdCdlcHViLWZpbGUnOiB7XG5cdFx0XHRbSyBpbiBFbnVtSURLRVlMaXN0U3RyaW5nIHwgRW51bUlES0VZTGlzdF06IFJlY29yZDxzdHJpbmcsIElHdW5FcHViTm9kZT5cblx0XHR9XG5cdH0+KHtcblx0XHR3ZWI6IGFwcCxcblx0XHRwZWVyczogW1xuXHRcdFx0Ly9cImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9ndW5cIixcblx0XHRcdFwiaHR0cHM6Ly9ndW5qcy5oZXJva3VhcHAuY29tL2d1blwiLFxuXHRcdFx0XCJodHRwOi8vbm1yLmlvOjg3NjUvZ3VuXCIsXG5cdFx0XHRcImh0dHBzOi8vbXktdGVzdC1ndW4tc2VydmVyLmhlcm9rdWFwcC5jb20vZ3VuXCIsXG5cdFx0XSxcblx0XHRmaWxlLFxuXHRcdGxvZygpXG5cdFx0e1xuXG5cdFx0fSxcblx0fSk7XG5cblx0X2NvbnNvbGUuZGVidWcoYFAyUCDnt6nlrZjkvY3mlrwgJHtmaWxlfWApO1xuXG5cdGd1biA9IF9ndW47XG5cblx0cmV0dXJuIF9ndW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUd1bigpXG57XG5cdHJldHVybiB1c2VHdW5Sb290KClcblx0XHQuZ2V0KCdlcHViLWZpbGUnKVxuXHRcdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUd1blJvb3QoKVxue1xuXHRyZXR1cm4gZ3VuIHx8IChndW4gPSBzZXR1cEd1bigpKTtcbn1cblxuZXhwb3J0IHsgZ3VuIH1cblxuZXhwb3J0IGRlZmF1bHQgdXNlR3VuXG4iXX0=