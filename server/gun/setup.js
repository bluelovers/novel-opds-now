"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gun_1 = __importDefault(require("gun"));
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
    return gun;
}
exports.useGun = useGun;
exports.default = useGun;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXR1cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUlBLDhDQUFzQjtBQUV0QixJQUFJLEdBQTJCLENBQUM7QUFxQnZCLGtCQUFHO0FBbkJaLFNBQWdCLFFBQVEsQ0FBQyxHQUFHO0lBRzNCLGNBQUEsR0FBRyxHQUFHLElBQUksYUFBRyxDQUFDO1FBQ2IsR0FBRyxFQUFFLEdBQUc7UUFDUixLQUFLLEVBQUU7WUFDTixpQ0FBaUM7WUFDakMsd0JBQXdCO1NBQ3hCO0tBQ0QsQ0FBQyxDQUFDO0lBRUgsT0FBTyxHQUFHLENBQUE7QUFDWCxDQUFDO0FBWkQsNEJBWUM7QUFFRCxTQUFnQixNQUFNO0lBRXJCLE9BQU8sR0FBRyxDQUFDO0FBQ1osQ0FBQztBQUhELHdCQUdDO0FBSUQsa0JBQWUsTUFBTSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8yLzEuXG4gKi9cblxuaW1wb3J0IEd1biBmcm9tICdndW4nO1xuXG5sZXQgZ3VuOiBSZXR1cm5UeXBlPHR5cGVvZiBHdW4+O1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0dXBHdW4oYXBwKTogUmV0dXJuVHlwZTx0eXBlb2YgR3VuPlxue1xuXHQvLyBAdHMtaWdub3JlXG5cdGd1biA9IG5ldyBHdW4oe1xuXHRcdHdlYjogYXBwLFxuXHRcdHBlZXJzOiBbXG5cdFx0XHRcImh0dHBzOi8vZ3VuanMuaGVyb2t1YXBwLmNvbS9ndW5cIixcblx0XHRcdFwiaHR0cDovL25tci5pbzo4NzY1L2d1blwiLFxuXHRcdF0sXG5cdH0pO1xuXG5cdHJldHVybiBndW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUd1bigpOiBSZXR1cm5UeXBlPHR5cGVvZiBHdW4+XG57XG5cdHJldHVybiBndW47XG59XG5cbmV4cG9ydCB7IGd1biB9XG5cbmV4cG9ydCBkZWZhdWx0IHVzZUd1blxuXG5cbiJdfQ==