"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const path_1 = require("path");
const __root_1 = __importDefault(require("../lib/__root"));
child_process_1.spawn('node', [
    path_1.join(__root_1.default, `./cli/cache.js`),
], {
    stdio: 'inherit',
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQSxpREFBaUQ7QUFDakQsK0JBQTRCO0FBQzVCLDJEQUFtQztBQUluQyxxQkFBSyxDQUFDLE1BQU0sRUFBRTtJQUNiLFdBQUksQ0FBQyxnQkFBTSxFQUFFLGdCQUFnQixDQUFDO0NBQzlCLEVBQUU7SUFDRixLQUFLLEVBQUUsU0FBUztDQUNoQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzIvMS5cbiAqL1xuXG5pbXBvcnQgeyBzcGF3blN5bmMsIHNwYXduIH0gZnJvbSBcImNoaWxkX3Byb2Nlc3NcIjtcbmltcG9ydCB7IGpvaW4gfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IF9fcm9vdCBmcm9tICcuLi9saWIvX19yb290JztcbmltcG9ydCB1cGRhdGVDYWNoZUFsbCBmcm9tICcuLi9saWIvbm92ZWwtY2FjaGUvdXBkYXRlJztcbmltcG9ydCBjb25zb2xlIGZyb20gJ2RlYnVnLWNvbG9yMi9sb2dnZXInO1xuXG5zcGF3bignbm9kZScsIFtcblx0am9pbihfX3Jvb3QsIGAuL2NsaS9jYWNoZS5qc2ApLFxuXSwge1xuXHRzdGRpbzogJ2luaGVyaXQnLFxufSk7XG4iXX0=