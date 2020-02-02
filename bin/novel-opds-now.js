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
const update_notifier_1 = __importDefault(require("@yarn-tool/update-notifier"));
const getPort_1 = __importStar(require("../lib/getPort"));
const index_1 = __importDefault(require("../index"));
update_notifier_1.default([__dirname, '..']);
let argv = yargs_1.default
    .option('port', {
    number: true,
    alias: ['p'],
    default: getPort_1.default(getPort_1.getPortEnv())
})
    .argv;
exports.default = index_1.default(argv.port);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92ZWwtb3Bkcy1ub3cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJub3ZlbC1vcGRzLW5vdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBRUEsa0RBQTBCO0FBQzFCLGlGQUF3RDtBQUN4RCwwREFBcUQ7QUFDckQscURBQW1DO0FBRW5DLHlCQUFjLENBQUMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUVsQyxJQUFJLElBQUksR0FBRyxlQUFLO0tBQ2QsTUFBTSxDQUFDLE1BQU0sRUFBRTtJQUNmLE1BQU0sRUFBRSxJQUFJO0lBQ1osS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDO0lBQ1osT0FBTyxFQUFFLGlCQUFPLENBQUMsb0JBQVUsRUFBRSxDQUFDO0NBQzlCLENBQUM7S0FDRCxJQUFJLENBQ0w7QUFFRCxrQkFBZSxlQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuXG5pbXBvcnQgeWFyZ3MgZnJvbSAneWFyZ3MnO1xuaW1wb3J0IHVwZGF0ZU5vdGlmaWVyIGZyb20gJ0B5YXJuLXRvb2wvdXBkYXRlLW5vdGlmaWVyJztcbmltcG9ydCBnZXRQb3J0LCB7IGdldFBvcnRFbnYgfSBmcm9tICcuLi9saWIvZ2V0UG9ydCc7XG5pbXBvcnQgc3RhcnRTZXJ2ZXIgZnJvbSAnLi4vaW5kZXgnO1xuXG51cGRhdGVOb3RpZmllcihbX19kaXJuYW1lLCAnLi4nXSk7XG5cbmxldCBhcmd2ID0geWFyZ3Ncblx0Lm9wdGlvbigncG9ydCcsIHtcblx0XHRudW1iZXI6IHRydWUsXG5cdFx0YWxpYXM6IFsncCddLFxuXHRcdGRlZmF1bHQ6IGdldFBvcnQoZ2V0UG9ydEVudigpKVxuXHR9KVxuXHQuYXJndlxuO1xuXG5leHBvcnQgZGVmYXVsdCBzdGFydFNlcnZlcihhcmd2LnBvcnQpO1xuIl19