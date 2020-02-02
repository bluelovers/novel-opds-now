"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gun_1 = __importDefault(require("gun"));
require("gun/lib/server");
const path_1 = require("path");
const const_1 = require("../../lib/const");
const fs_extra_1 = require("fs-extra");
let gun;
exports.gun = gun;
function setupGun(app) {
    let file = path_1.join(const_1.OUTPUT_DIR, 'novel-opds-now.cache', 'radata');
    fs_extra_1.ensureDirSync(file);
    exports.gun = gun = new gun_1.default({
        web: app,
        peers: [
            "https://gunjs.herokuapp.com/gun",
            "http://nmr.io:8765/gun",
            "https://my-test-gun-server.herokuapp.com/gun",
        ],
        file
    });
    console.debug(`P2P緩存位於 ${file}`);
    return gun;
}
exports.setupGun = setupGun;
function useGun() {
    return gun || (exports.gun = gun = setupGun());
}
exports.useGun = useGun;
exports.default = useGun;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXR1cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUlBLDhDQUFzQjtBQUN0QiwwQkFBd0I7QUFHeEIsK0JBQTRCO0FBQzVCLDJDQUE2QztBQUM3Qyx1Q0FBeUM7QUFFekMsSUFBSSxHQUEyQixDQUFDO0FBNkJ2QixrQkFBRztBQTNCWixTQUFnQixRQUFRLENBQUMsR0FBYTtJQUVyQyxJQUFJLElBQUksR0FBRyxXQUFJLENBQUMsa0JBQVUsRUFBRSxzQkFBc0IsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM5RCx3QkFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBR3BCLGNBQUEsR0FBRyxHQUFHLElBQUksYUFBRyxDQUFDO1FBQ2IsR0FBRyxFQUFFLEdBQUc7UUFDUixLQUFLLEVBQUU7WUFFTixpQ0FBaUM7WUFDakMsd0JBQXdCO1lBQ3hCLDhDQUE4QztTQUM5QztRQUNELElBQUk7S0FDSixDQUFDLENBQUM7SUFFSCxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUVqQyxPQUFPLEdBQUcsQ0FBQTtBQUNYLENBQUM7QUFwQkQsNEJBb0JDO0FBRUQsU0FBZ0IsTUFBTTtJQUVyQixPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQUEsR0FBRyxHQUFHLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFDbEMsQ0FBQztBQUhELHdCQUdDO0FBSUQsa0JBQWUsTUFBTSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8yLzEuXG4gKi9cblxuaW1wb3J0IEd1biBmcm9tICdndW4nO1xuaW1wb3J0ICdndW4vbGliL3NlcnZlcic7XG5pbXBvcnQgeyBFeHByZXNzIH0gZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgX19yb290IGZyb20gJy4uLy4uL2xpYi9fX3Jvb3QnO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgT1VUUFVUX0RJUiB9IGZyb20gJy4uLy4uL2xpYi9jb25zdCc7XG5pbXBvcnQgeyBlbnN1cmVEaXJTeW5jIH0gZnJvbSAnZnMtZXh0cmEnO1xuXG5sZXQgZ3VuOiBSZXR1cm5UeXBlPHR5cGVvZiBHdW4+O1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0dXBHdW4oYXBwPzogRXhwcmVzcyk6IFJldHVyblR5cGU8dHlwZW9mIEd1bj5cbntcblx0bGV0IGZpbGUgPSBqb2luKE9VVFBVVF9ESVIsICdub3ZlbC1vcGRzLW5vdy5jYWNoZScsICdyYWRhdGEnKTtcblx0ZW5zdXJlRGlyU3luYyhmaWxlKTtcblxuXHQvLyBAdHMtaWdub3JlXG5cdGd1biA9IG5ldyBHdW4oe1xuXHRcdHdlYjogYXBwLFxuXHRcdHBlZXJzOiBbXG5cdFx0XHQvL1wiaHR0cDovL2xvY2FsaG9zdDozMDAwL2d1blwiLFxuXHRcdFx0XCJodHRwczovL2d1bmpzLmhlcm9rdWFwcC5jb20vZ3VuXCIsXG5cdFx0XHRcImh0dHA6Ly9ubXIuaW86ODc2NS9ndW5cIixcblx0XHRcdFwiaHR0cHM6Ly9teS10ZXN0LWd1bi1zZXJ2ZXIuaGVyb2t1YXBwLmNvbS9ndW5cIixcblx0XHRdLFxuXHRcdGZpbGVcblx0fSk7XG5cblx0Y29uc29sZS5kZWJ1ZyhgUDJQ57ep5a2Y5L2N5pa8ICR7ZmlsZX1gKTtcblxuXHRyZXR1cm4gZ3VuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VHdW4oKTogUmV0dXJuVHlwZTx0eXBlb2YgR3VuPlxue1xuXHRyZXR1cm4gZ3VuIHx8IChndW4gPSBzZXR1cEd1bigpKTtcbn1cblxuZXhwb3J0IHsgZ3VuIH1cblxuZXhwb3J0IGRlZmF1bHQgdXNlR3VuXG5cblxuIl19