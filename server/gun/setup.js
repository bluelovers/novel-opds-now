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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXR1cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUlBLDhDQUFzQjtBQUN0QiwwQkFBd0I7QUFHeEIsK0JBQTRCO0FBQzVCLDJDQUE2QztBQUM3Qyx1Q0FBeUM7QUFFekMsSUFBSSxHQUEyQixDQUFDO0FBMkJ2QixrQkFBRztBQXpCWixTQUFnQixRQUFRLENBQUMsR0FBYTtJQUVyQyxJQUFJLElBQUksR0FBRyxXQUFJLENBQUMsa0JBQVUsRUFBRSxzQkFBc0IsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM5RCx3QkFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBR3BCLGNBQUEsR0FBRyxHQUFHLElBQUksYUFBRyxDQUFDO1FBQ2IsR0FBRyxFQUFFLEdBQUc7UUFDUixLQUFLLEVBQUU7WUFDTixpQ0FBaUM7WUFDakMsd0JBQXdCO1NBQ3hCO1FBQ0QsSUFBSTtLQUNKLENBQUMsQ0FBQztJQUVILE9BQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBRWpDLE9BQU8sR0FBRyxDQUFBO0FBQ1gsQ0FBQztBQWxCRCw0QkFrQkM7QUFFRCxTQUFnQixNQUFNO0lBRXJCLE9BQU8sR0FBRyxJQUFJLENBQUMsY0FBQSxHQUFHLEdBQUcsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBSEQsd0JBR0M7QUFJRCxrQkFBZSxNQUFNLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzIvMS5cbiAqL1xuXG5pbXBvcnQgR3VuIGZyb20gJ2d1bic7XG5pbXBvcnQgJ2d1bi9saWIvc2VydmVyJztcbmltcG9ydCB7IEV4cHJlc3MgfSBmcm9tICdleHByZXNzJztcbmltcG9ydCBfX3Jvb3QgZnJvbSAnLi4vLi4vbGliL19fcm9vdCc7XG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBPVVRQVVRfRElSIH0gZnJvbSAnLi4vLi4vbGliL2NvbnN0JztcbmltcG9ydCB7IGVuc3VyZURpclN5bmMgfSBmcm9tICdmcy1leHRyYSc7XG5cbmxldCBndW46IFJldHVyblR5cGU8dHlwZW9mIEd1bj47XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXR1cEd1bihhcHA/OiBFeHByZXNzKTogUmV0dXJuVHlwZTx0eXBlb2YgR3VuPlxue1xuXHRsZXQgZmlsZSA9IGpvaW4oT1VUUFVUX0RJUiwgJ25vdmVsLW9wZHMtbm93LmNhY2hlJywgJ3JhZGF0YScpO1xuXHRlbnN1cmVEaXJTeW5jKGZpbGUpO1xuXG5cdC8vIEB0cy1pZ25vcmVcblx0Z3VuID0gbmV3IEd1bih7XG5cdFx0d2ViOiBhcHAsXG5cdFx0cGVlcnM6IFtcblx0XHRcdFwiaHR0cHM6Ly9ndW5qcy5oZXJva3VhcHAuY29tL2d1blwiLFxuXHRcdFx0XCJodHRwOi8vbm1yLmlvOjg3NjUvZ3VuXCIsXG5cdFx0XSxcblx0XHRmaWxlXG5cdH0pO1xuXG5cdGNvbnNvbGUuZGVidWcoYFAyUOe3qeWtmOS9jeaWvCAke2ZpbGV9YCk7XG5cblx0cmV0dXJuIGd1blxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlR3VuKCk6IFJldHVyblR5cGU8dHlwZW9mIEd1bj5cbntcblx0cmV0dXJuIGd1biB8fCAoZ3VuID0gc2V0dXBHdW4oKSk7XG59XG5cbmV4cG9ydCB7IGd1biB9XG5cbmV4cG9ydCBkZWZhdWx0IHVzZUd1blxuXG5cbiJdfQ==