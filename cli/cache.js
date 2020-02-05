#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const __root_1 = __importDefault(require("../lib/__root"));
const update_1 = __importDefault(require("../lib/novel-cache/update"));
const update_2 = __importDefault(require("../lib/demonovel/update"));
let argv = yargs_1.default
    .option('force', {
    boolean: true,
    alias: ['f'],
})
    .argv;
if (argv.force) {
    fs_extra_1.removeSync(path_1.join(__root_1.default, `.cache/cache.json`));
}
Promise.resolve().then(() => __importStar(require('../lib/buildCache')));
update_1.default(argv.force);
update_2.default(argv.force);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjYWNoZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBR0Esa0RBQTBCO0FBRTFCLHVDQUFzQztBQUN0QywrQkFBNEI7QUFDNUIsMkRBQW1DO0FBQ25DLHVFQUF1RDtBQUV2RCxxRUFBa0Q7QUFFbEQsSUFBSSxJQUFJLEdBQUcsZUFBSztLQUNkLE1BQU0sQ0FBQyxPQUFPLEVBQUU7SUFDaEIsT0FBTyxFQUFFLElBQUk7SUFDYixLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUM7Q0FDWixDQUFDO0tBQ0QsSUFBSSxDQUNMO0FBRUQsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUNkO0lBQ0MscUJBQVUsQ0FBQyxXQUFJLENBQUMsZ0JBQU0sRUFBRSxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7Q0FDOUM7QUFFRCxrREFBTyxtQkFBbUIsSUFBRTtBQUM1QixnQkFBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FFekI7QUFDRCxnQkFBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcblxuXG5pbXBvcnQgeWFyZ3MgZnJvbSAneWFyZ3MnO1xuaW1wb3J0IHsgT1VUUFVUX0RJUiB9IGZyb20gJy4uL2xpYi9jb25zdCc7XG5pbXBvcnQgeyByZW1vdmVTeW5jIH0gZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgX19yb290IGZyb20gJy4uL2xpYi9fX3Jvb3QnO1xuaW1wb3J0IHVwZGF0ZUNhY2hlQWxsIGZyb20gJy4uL2xpYi9ub3ZlbC1jYWNoZS91cGRhdGUnO1xuaW1wb3J0IGNvbnNvbGUgZnJvbSAnZGVidWctY29sb3IyL2xvZ2dlcic7XG5pbXBvcnQgdXBkYXRlQ2FjaGUgZnJvbSAnLi4vbGliL2RlbW9ub3ZlbC91cGRhdGUnO1xuXG5sZXQgYXJndiA9IHlhcmdzXG5cdC5vcHRpb24oJ2ZvcmNlJywge1xuXHRcdGJvb2xlYW46IHRydWUsXG5cdFx0YWxpYXM6IFsnZiddLFxuXHR9KVxuXHQuYXJndlxuO1xuXG5pZiAoYXJndi5mb3JjZSlcbntcblx0cmVtb3ZlU3luYyhqb2luKF9fcm9vdCwgYC5jYWNoZS9jYWNoZS5qc29uYCkpO1xufVxuXG5pbXBvcnQoJy4uL2xpYi9idWlsZENhY2hlJyk7XG51cGRhdGVDYWNoZUFsbChhcmd2LmZvcmNlKVxuXHQvLy50YXAodiA9PiBjb25zb2xlLmRlYnVnKGBbVVBEQVRFXSDlsI/oqqrliJfooahgKSlcbjtcbnVwZGF0ZUNhY2hlKGFyZ3YuZm9yY2UpO1xuIl19