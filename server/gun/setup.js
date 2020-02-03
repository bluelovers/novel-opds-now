"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gun_1 = __importDefault(require("gun"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXR1cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUlBLDhDQUFzQjtBQUl0QiwrQkFBNEI7QUFDNUIsMkNBQTZDO0FBQzdDLHVDQUF5QztBQUV6QyxJQUFJLEdBQTJCLENBQUM7QUE2QnZCLGtCQUFHO0FBM0JaLFNBQWdCLFFBQVEsQ0FBQyxHQUFhO0lBRXJDLElBQUksSUFBSSxHQUFHLFdBQUksQ0FBQyxrQkFBVSxFQUFFLHNCQUFzQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzlELHdCQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7SUFHcEIsY0FBQSxHQUFHLEdBQUcsSUFBSSxhQUFHLENBQUM7UUFDYixHQUFHLEVBQUUsR0FBRztRQUNSLEtBQUssRUFBRTtZQUVOLGlDQUFpQztZQUNqQyx3QkFBd0I7WUFDeEIsOENBQThDO1NBQzlDO1FBQ0QsSUFBSTtLQUNKLENBQUMsQ0FBQztJQUVILE9BQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBRWpDLE9BQU8sR0FBRyxDQUFBO0FBQ1gsQ0FBQztBQXBCRCw0QkFvQkM7QUFFRCxTQUFnQixNQUFNO0lBRXJCLE9BQU8sR0FBRyxJQUFJLENBQUMsY0FBQSxHQUFHLEdBQUcsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBSEQsd0JBR0M7QUFJRCxrQkFBZSxNQUFNLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzIvMS5cbiAqL1xuXG5pbXBvcnQgR3VuIGZyb20gJ2d1bic7XG4vL2ltcG9ydCAnZ3VuL2xpYi9zZXJ2ZXInO1xuaW1wb3J0IHsgRXhwcmVzcyB9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IF9fcm9vdCBmcm9tICcuLi8uLi9saWIvX19yb290JztcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IE9VVFBVVF9ESVIgfSBmcm9tICcuLi8uLi9saWIvY29uc3QnO1xuaW1wb3J0IHsgZW5zdXJlRGlyU3luYyB9IGZyb20gJ2ZzLWV4dHJhJztcblxubGV0IGd1bjogUmV0dXJuVHlwZTx0eXBlb2YgR3VuPjtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldHVwR3VuKGFwcD86IEV4cHJlc3MpOiBSZXR1cm5UeXBlPHR5cGVvZiBHdW4+XG57XG5cdGxldCBmaWxlID0gam9pbihPVVRQVVRfRElSLCAnbm92ZWwtb3Bkcy1ub3cuY2FjaGUnLCAncmFkYXRhJyk7XG5cdGVuc3VyZURpclN5bmMoZmlsZSk7XG5cblx0Ly8gQHRzLWlnbm9yZVxuXHRndW4gPSBuZXcgR3VuKHtcblx0XHR3ZWI6IGFwcCxcblx0XHRwZWVyczogW1xuXHRcdFx0Ly9cImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9ndW5cIixcblx0XHRcdFwiaHR0cHM6Ly9ndW5qcy5oZXJva3VhcHAuY29tL2d1blwiLFxuXHRcdFx0XCJodHRwOi8vbm1yLmlvOjg3NjUvZ3VuXCIsXG5cdFx0XHRcImh0dHBzOi8vbXktdGVzdC1ndW4tc2VydmVyLmhlcm9rdWFwcC5jb20vZ3VuXCIsXG5cdFx0XSxcblx0XHRmaWxlXG5cdH0pO1xuXG5cdGNvbnNvbGUuZGVidWcoYFAyUOe3qeWtmOS9jeaWvCAke2ZpbGV9YCk7XG5cblx0cmV0dXJuIGd1blxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlR3VuKCk6IFJldHVyblR5cGU8dHlwZW9mIEd1bj5cbntcblx0cmV0dXJuIGd1biB8fCAoZ3VuID0gc2V0dXBHdW4oKSk7XG59XG5cbmV4cG9ydCB7IGd1biB9XG5cbmV4cG9ydCBkZWZhdWx0IHVzZUd1blxuXG5cbiJdfQ==