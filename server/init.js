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
update_1.default().tap(v => console.debug(`[UPDATE] 小說列表`));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQSxpREFBaUQ7QUFDakQsK0JBQTRCO0FBQzVCLDJEQUFtQztBQUNuQyx1RUFBdUQ7QUFFdkQscUJBQUssQ0FBQyxNQUFNLEVBQUU7SUFDYixXQUFJLENBQUMsZ0JBQU0sRUFBRSxnQkFBZ0IsQ0FBQztDQUM5QixFQUFFO0lBQ0YsS0FBSyxFQUFFLFNBQVM7Q0FDaEIsQ0FBQyxDQUFDO0FBRUgsZ0JBQWMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMjAvMi8xLlxuICovXG5cbmltcG9ydCB7IHNwYXduU3luYywgc3Bhd24gfSBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgX19yb290IGZyb20gJy4uL2xpYi9fX3Jvb3QnO1xuaW1wb3J0IHVwZGF0ZUNhY2hlQWxsIGZyb20gJy4uL2xpYi9ub3ZlbC1jYWNoZS91cGRhdGUnO1xuXG5zcGF3bignbm9kZScsIFtcblx0am9pbihfX3Jvb3QsIGAuL2NsaS9jYWNoZS5qc2ApLFxuXSwge1xuXHRzdGRpbzogJ2luaGVyaXQnLFxufSk7XG5cbnVwZGF0ZUNhY2hlQWxsKCkudGFwKHYgPT4gY29uc29sZS5kZWJ1ZyhgW1VQREFURV0g5bCP6Kqq5YiX6KGoYCkpO1xuIl19