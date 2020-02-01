"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gun_1 = __importDefault(require("gun"));
require("gun/lib/server");
let gun;
exports.gun = gun;
function setupGun(app) {
    exports.gun = gun = new gun_1.default({
        web: app,
        peers: [
            "https://gunjs.herokuapp.com/gun",
            "http://nmr.io:8765/gun",
        ],
    });
    return gun;
}
exports.setupGun = setupGun;
function useGun() {
    return gun || (exports.gun = gun = setupGun());
}
exports.useGun = useGun;
exports.default = useGun;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXR1cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUlBLDhDQUFzQjtBQUN0QiwwQkFBd0I7QUFHeEIsSUFBSSxHQUEyQixDQUFDO0FBcUJ2QixrQkFBRztBQW5CWixTQUFnQixRQUFRLENBQUMsR0FBYTtJQUdyQyxjQUFBLEdBQUcsR0FBRyxJQUFJLGFBQUcsQ0FBQztRQUNiLEdBQUcsRUFBRSxHQUFHO1FBQ1IsS0FBSyxFQUFFO1lBQ04saUNBQWlDO1lBQ2pDLHdCQUF3QjtTQUN4QjtLQUNELENBQUMsQ0FBQztJQUVILE9BQU8sR0FBRyxDQUFBO0FBQ1gsQ0FBQztBQVpELDRCQVlDO0FBRUQsU0FBZ0IsTUFBTTtJQUVyQixPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQUEsR0FBRyxHQUFHLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFDbEMsQ0FBQztBQUhELHdCQUdDO0FBSUQsa0JBQWUsTUFBTSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8yLzEuXG4gKi9cblxuaW1wb3J0IEd1biBmcm9tICdndW4nO1xuaW1wb3J0ICdndW4vbGliL3NlcnZlcic7XG5pbXBvcnQgeyBFeHByZXNzIH0gZnJvbSAnZXhwcmVzcyc7XG5cbmxldCBndW46IFJldHVyblR5cGU8dHlwZW9mIEd1bj47XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXR1cEd1bihhcHA/OiBFeHByZXNzKTogUmV0dXJuVHlwZTx0eXBlb2YgR3VuPlxue1xuXHQvLyBAdHMtaWdub3JlXG5cdGd1biA9IG5ldyBHdW4oe1xuXHRcdHdlYjogYXBwLFxuXHRcdHBlZXJzOiBbXG5cdFx0XHRcImh0dHBzOi8vZ3VuanMuaGVyb2t1YXBwLmNvbS9ndW5cIixcblx0XHRcdFwiaHR0cDovL25tci5pbzo4NzY1L2d1blwiLFxuXHRcdF0sXG5cdH0pO1xuXG5cdHJldHVybiBndW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUd1bigpOiBSZXR1cm5UeXBlPHR5cGVvZiBHdW4+XG57XG5cdHJldHVybiBndW4gfHwgKGd1biA9IHNldHVwR3VuKCkpO1xufVxuXG5leHBvcnQgeyBndW4gfVxuXG5leHBvcnQgZGVmYXVsdCB1c2VHdW5cblxuXG4iXX0=