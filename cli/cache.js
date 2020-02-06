#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const update_1 = __importDefault(require("../lib/novel-cache/update"));
const logger_1 = __importDefault(require("debug-color2/logger"));
const buildCache_1 = __importDefault(require("../lib/buildCache"));
const update_2 = __importDefault(require("../lib/demonovel/update"));
let argv = yargs_1.default
    .option('force', {
    boolean: true,
    alias: ['f'],
})
    .argv;
buildCache_1.default(argv.force)
    .catch(e => logger_1.default.error(e));
update_1.default(argv.force)
    .catch(e => logger_1.default.error(e));
update_2.default(argv.force)
    .catch(e => logger_1.default.error(e));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjYWNoZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFHQSxrREFBMEI7QUFLMUIsdUVBQXVEO0FBQ3ZELGlFQUEwQztBQUMxQyxtRUFBNEM7QUFDNUMscUVBQW1EO0FBRW5ELElBQUksSUFBSSxHQUFHLGVBQUs7S0FDZCxNQUFNLENBQUMsT0FBTyxFQUFFO0lBQ2hCLE9BQU8sRUFBRSxJQUFJO0lBQ2IsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDO0NBQ1osQ0FBQztLQUNELElBQUksQ0FDTDtBQUVELG9CQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztLQUNyQixLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxnQkFBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUM3QjtBQUVELGdCQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztLQUN4QixLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxnQkFBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUM3QjtBQUVELGdCQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztLQUN0QixLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxnQkFBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUM3QiIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcblxuXG5pbXBvcnQgeWFyZ3MgZnJvbSAneWFyZ3MnO1xuaW1wb3J0IHsgT1VUUFVUX0RJUiB9IGZyb20gJy4uL2xpYi9jb25zdCc7XG5pbXBvcnQgeyByZW1vdmVTeW5jIH0gZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgX19yb290IGZyb20gJy4uL2xpYi9fX3Jvb3QnO1xuaW1wb3J0IHVwZGF0ZUNhY2hlQWxsIGZyb20gJy4uL2xpYi9ub3ZlbC1jYWNoZS91cGRhdGUnO1xuaW1wb3J0IGNvbnNvbGUgZnJvbSAnZGVidWctY29sb3IyL2xvZ2dlcic7XG5pbXBvcnQgdXBkYXRlQ2FjaGUgZnJvbSAnLi4vbGliL2J1aWxkQ2FjaGUnO1xuaW1wb3J0IHVwZGF0ZUNhY2hlMiBmcm9tICcuLi9saWIvZGVtb25vdmVsL3VwZGF0ZSc7XG5cbmxldCBhcmd2ID0geWFyZ3Ncblx0Lm9wdGlvbignZm9yY2UnLCB7XG5cdFx0Ym9vbGVhbjogdHJ1ZSxcblx0XHRhbGlhczogWydmJ10sXG5cdH0pXG5cdC5hcmd2XG47XG5cbnVwZGF0ZUNhY2hlKGFyZ3YuZm9yY2UpXG5cdC5jYXRjaChlID0+IGNvbnNvbGUuZXJyb3IoZSkpXG47XG5cbnVwZGF0ZUNhY2hlQWxsKGFyZ3YuZm9yY2UpXG5cdC5jYXRjaChlID0+IGNvbnNvbGUuZXJyb3IoZSkpXG47XG5cbnVwZGF0ZUNhY2hlMihhcmd2LmZvcmNlKVxuXHQuY2F0Y2goZSA9PiBjb25zb2xlLmVycm9yKGUpKVxuO1xuIl19