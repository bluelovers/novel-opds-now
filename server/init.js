"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const path_1 = require("path");
const __root_1 = __importDefault(require("../lib/__root"));
const update_1 = __importDefault(require("../lib/novel-cache/update"));
const logger_1 = __importDefault(require("debug-color2/logger"));
child_process_1.spawn('node', [
    path_1.join(__root_1.default, `./cli/cache.js`),
], {
    stdio: 'inherit',
});
update_1.default().tap(v => logger_1.default.debug(`[UPDATE] 小說列表`));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQSxpREFBaUQ7QUFDakQsK0JBQTRCO0FBQzVCLDJEQUFtQztBQUNuQyx1RUFBdUQ7QUFDdkQsaUVBQTBDO0FBRTFDLHFCQUFLLENBQUMsTUFBTSxFQUFFO0lBQ2IsV0FBSSxDQUFDLGdCQUFNLEVBQUUsZ0JBQWdCLENBQUM7Q0FDOUIsRUFBRTtJQUNGLEtBQUssRUFBRSxTQUFTO0NBQ2hCLENBQUMsQ0FBQztBQUVILGdCQUFjLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxnQkFBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8yLzEuXG4gKi9cblxuaW1wb3J0IHsgc3Bhd25TeW5jLCBzcGF3biB9IGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XG5pbXBvcnQgeyBqb2luIH0gZnJvbSBcInBhdGhcIjtcbmltcG9ydCBfX3Jvb3QgZnJvbSAnLi4vbGliL19fcm9vdCc7XG5pbXBvcnQgdXBkYXRlQ2FjaGVBbGwgZnJvbSAnLi4vbGliL25vdmVsLWNhY2hlL3VwZGF0ZSc7XG5pbXBvcnQgY29uc29sZSBmcm9tICdkZWJ1Zy1jb2xvcjIvbG9nZ2VyJztcblxuc3Bhd24oJ25vZGUnLCBbXG5cdGpvaW4oX19yb290LCBgLi9jbGkvY2FjaGUuanNgKSxcbl0sIHtcblx0c3RkaW86ICdpbmhlcml0Jyxcbn0pO1xuXG51cGRhdGVDYWNoZUFsbCgpLnRhcCh2ID0+IGNvbnNvbGUuZGVidWcoYFtVUERBVEVdIOWwj+iqquWIl+ihqGApKTtcbiJdfQ==