"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const path_1 = require("path");
const __root_1 = __importDefault(require("../lib/__root"));
const update_1 = __importDefault(require("../lib/novel-cache/update"));
child_process_1.spawn('node', [
    path_1.join(__root_1.default, `./cli/cache.js`),
], {
    stdio: 'inherit',
});
update_1.default();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQSxpREFBaUQ7QUFDakQsK0JBQTRCO0FBQzVCLDJEQUFtQztBQUNuQyx1RUFBdUQ7QUFFdkQscUJBQUssQ0FBQyxNQUFNLEVBQUU7SUFDYixXQUFJLENBQUMsZ0JBQU0sRUFBRSxnQkFBZ0IsQ0FBQztDQUM5QixFQUFFO0lBQ0YsS0FBSyxFQUFFLFNBQVM7Q0FDaEIsQ0FBQyxDQUFDO0FBRUgsZ0JBQWMsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8yLzEuXG4gKi9cblxuaW1wb3J0IHsgc3Bhd25TeW5jLCBzcGF3biB9IGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XG5pbXBvcnQgeyBqb2luIH0gZnJvbSBcInBhdGhcIjtcbmltcG9ydCBfX3Jvb3QgZnJvbSAnLi4vbGliL19fcm9vdCc7XG5pbXBvcnQgdXBkYXRlQ2FjaGVBbGwgZnJvbSAnLi4vbGliL25vdmVsLWNhY2hlL3VwZGF0ZSc7XG5cbnNwYXduKCdub2RlJywgW1xuXHRqb2luKF9fcm9vdCwgYC4vY2xpL2NhY2hlLmpzYCksXG5dLCB7XG5cdHN0ZGlvOiAnaW5oZXJpdCcsXG59KTtcblxudXBkYXRlQ2FjaGVBbGwoKTtcbiJdfQ==