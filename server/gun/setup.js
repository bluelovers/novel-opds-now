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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXR1cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUlBLDhDQUFzQjtBQUV0QixtQkFBaUI7QUFHakIsK0JBQTRCO0FBQzVCLDJDQUE2QztBQUM3Qyx1Q0FBeUM7QUFDekMsaUVBQTBDO0FBTzFDLElBQUksR0FBZ0MsQ0FBQztBQWtENUIsa0JBQUc7QUEvQ1osYUFBRyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFFLENBQUMsRUFBRSxhQUFHLENBQUMsR0FBRyxFQUFFO0lBQzFDLE9BQU8sRUFBRSxLQUFLO0NBQ2QsQ0FBQyxDQUFDO0FBRUgsU0FBZ0IsUUFBUSxDQUFDLEdBQXNCO0lBRTlDLElBQUksSUFBSSxHQUFHLFdBQUksQ0FBQyxrQkFBVSxFQUFFLHNCQUFzQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzlELHdCQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFcEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxhQUFHLENBSWY7UUFDRixHQUFHLEVBQUUsR0FBRztRQUNSLEtBQUssRUFBRTtZQUVOLGlDQUFpQztZQUNqQyx3QkFBd0I7WUFDeEIsOENBQThDO1NBQzlDO1FBQ0QsSUFBSTtRQUNKLEdBQUc7UUFHSCxDQUFDO0tBQ0QsQ0FBQyxDQUFDO0lBRUgsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBRWxDLGNBQUEsR0FBRyxHQUFHLElBQUksQ0FBQztJQUVYLE9BQU8sSUFBSSxDQUFBO0FBQ1osQ0FBQztBQTdCRCw0QkE2QkM7QUFFRCxTQUFnQixNQUFNO0lBRXJCLE9BQU8sVUFBVSxFQUFFO1NBQ2pCLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FDaEI7QUFDSCxDQUFDO0FBTEQsd0JBS0M7QUFFRCxTQUFnQixVQUFVO0lBRXpCLE9BQU8sR0FBRyxJQUFJLENBQUMsY0FBQSxHQUFHLEdBQUcsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBSEQsZ0NBR0M7QUFJRCxrQkFBZSxNQUFNLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzIvMS5cbiAqL1xuXG5pbXBvcnQgR3VuIGZyb20gJ2d1bic7XG4vL2ltcG9ydCAnZ3VuL2xpYi9zZXJ2ZXInO1xuaW1wb3J0ICdndW4tdGFnJztcbmltcG9ydCB7IEV4cHJlc3MgfSBmcm9tICdleHByZXNzJztcbmltcG9ydCBfX3Jvb3QgZnJvbSAnLi4vLi4vbGliL19fcm9vdCc7XG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBPVVRQVVRfRElSIH0gZnJvbSAnLi4vLi4vbGliL2NvbnN0JztcbmltcG9ydCB7IGVuc3VyZURpclN5bmMgfSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgY29uc29sZSBmcm9tICdkZWJ1Zy1jb2xvcjIvbG9nZ2VyJztcbmltcG9ydCB7IFNlcnZlciB9IGZyb20gJ2h0dHAnO1xuaW1wb3J0IHsgSUd1blN0YXRpYyB9IGZyb20gJ2d1bi90eXBlcy9zdGF0aWMnO1xuaW1wb3J0IHsgSUd1bkVwdWJOb2RlIH0gZnJvbSAnLi4vLi4vbGliL3R5cGVzJztcbmltcG9ydCB7IEVudW1JREtFWUxpc3QsIEVudW1JREtFWUxpc3RTdHJpbmcgfSBmcm9tICdub3ZlbC1kb3dubG9hZGVyL3NyYy9hbGwvY29uc3QnO1xuaW1wb3J0IFJhZGlzayBmcm9tICdndW4vbGliL3JhZGlzayc7XG5cbmxldCBndW46IFJldHVyblR5cGU8dHlwZW9mIHNldHVwR3VuPjtcblxuLy8gQHRzLWlnbm9yZVxuR3VuLmxvZyA9IE9iamVjdC5hc3NpZ24oKCkgPT4ge30sIEd1bi5sb2csIHtcblx0dmVyYm9zZTogZmFsc2UsXG59KTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldHVwR3VuKGFwcD86IEV4cHJlc3MgfCBTZXJ2ZXIpXG57XG5cdGxldCBmaWxlID0gam9pbihPVVRQVVRfRElSLCAnbm92ZWwtb3Bkcy1ub3cuY2FjaGUnLCAncmFkYXRhJyk7XG5cdGVuc3VyZURpclN5bmMoZmlsZSk7XG5cblx0bGV0IF9ndW4gPSBuZXcgR3VuPHtcblx0XHQnZXB1Yi1maWxlJzoge1xuXHRcdFx0W0sgaW4gRW51bUlES0VZTGlzdFN0cmluZyB8IEVudW1JREtFWUxpc3RdOiBSZWNvcmQ8c3RyaW5nLCBJR3VuRXB1Yk5vZGU+XG5cdFx0fVxuXHR9Pih7XG5cdFx0d2ViOiBhcHAsXG5cdFx0cGVlcnM6IFtcblx0XHRcdC8vXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvZ3VuXCIsXG5cdFx0XHRcImh0dHBzOi8vZ3VuanMuaGVyb2t1YXBwLmNvbS9ndW5cIixcblx0XHRcdFwiaHR0cDovL25tci5pbzo4NzY1L2d1blwiLFxuXHRcdFx0XCJodHRwczovL215LXRlc3QtZ3VuLXNlcnZlci5oZXJva3VhcHAuY29tL2d1blwiLFxuXHRcdF0sXG5cdFx0ZmlsZSxcblx0XHRsb2coKVxuXHRcdHtcblxuXHRcdH0sXG5cdH0pO1xuXG5cdGNvbnNvbGUuZGVidWcoYFAyUCDnt6nlrZjkvY3mlrwgJHtmaWxlfWApO1xuXG5cdGd1biA9IF9ndW47XG5cblx0cmV0dXJuIF9ndW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUd1bigpXG57XG5cdHJldHVybiB1c2VHdW5Sb290KClcblx0XHQuZ2V0KCdlcHViLWZpbGUnKVxuXHRcdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUd1blJvb3QoKVxue1xuXHRyZXR1cm4gZ3VuIHx8IChndW4gPSBzZXR1cEd1bigpKTtcbn1cblxuZXhwb3J0IHsgZ3VuIH1cblxuZXhwb3J0IGRlZmF1bHQgdXNlR3VuXG4iXX0=