#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const download_1 = __importDefault(require("../../lib/download"));
let argv = yargs_1.default
    .option('siteID', {
    string: true,
    demandOption: true,
})
    .option('novel_id', {
    string: true,
    demandOption: true,
})
    .option('outputDir', {
    string: true,
    demandOption: true,
})
    .argv;
download_1.default(argv.novel_id, argv.siteID, argv.outputDir)
    .then(v => console.log(true));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmxvYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkb3dubG9hZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSxrREFBMEI7QUFDMUIsa0VBQStDO0FBRS9DLElBQUksSUFBSSxHQUFHLGVBQUs7S0FDZCxNQUFNLENBQUMsUUFBUSxFQUFFO0lBQ2pCLE1BQU0sRUFBRSxJQUFJO0lBQ1osWUFBWSxFQUFFLElBQUk7Q0FDbEIsQ0FBQztLQUNELE1BQU0sQ0FBQyxVQUFVLEVBQUU7SUFDbkIsTUFBTSxFQUFFLElBQUk7SUFDWixZQUFZLEVBQUUsSUFBSTtDQUNsQixDQUFDO0tBQ0QsTUFBTSxDQUFDLFdBQVcsRUFBRTtJQUNwQixNQUFNLEVBQUUsSUFBSTtJQUNaLFlBQVksRUFBRSxJQUFJO0NBQ2xCLENBQUM7S0FDRCxJQUFJLENBQ0w7QUFFRCxrQkFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQWEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO0tBQzlELElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FDN0IiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5cbmltcG9ydCB5YXJncyBmcm9tICd5YXJncyc7XG5pbXBvcnQgZG93bmxvYWROb3ZlbCBmcm9tICcuLi8uLi9saWIvZG93bmxvYWQnO1xuXG5sZXQgYXJndiA9IHlhcmdzXG5cdC5vcHRpb24oJ3NpdGVJRCcsIHtcblx0XHRzdHJpbmc6IHRydWUsXG5cdFx0ZGVtYW5kT3B0aW9uOiB0cnVlLFxuXHR9KVxuXHQub3B0aW9uKCdub3ZlbF9pZCcsIHtcblx0XHRzdHJpbmc6IHRydWUsXG5cdFx0ZGVtYW5kT3B0aW9uOiB0cnVlLFxuXHR9KVxuXHQub3B0aW9uKCdvdXRwdXREaXInLCB7XG5cdFx0c3RyaW5nOiB0cnVlLFxuXHRcdGRlbWFuZE9wdGlvbjogdHJ1ZSxcblx0fSlcblx0LmFyZ3ZcbjtcblxuZG93bmxvYWROb3ZlbChhcmd2Lm5vdmVsX2lkLCBhcmd2LnNpdGVJRCBhcyBhbnksIGFyZ3Yub3V0cHV0RGlyKVxuXHQudGhlbih2ID0+IGNvbnNvbGUubG9nKHRydWUpKVxuO1xuIl19