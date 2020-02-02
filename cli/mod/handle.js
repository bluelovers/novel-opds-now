#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const threads_1 = __importDefault(require("../lib/threads"));
let argv = yargs_1.default
    .option('IDKEY', {
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
threads_1.default(argv.novel_id, argv.IDKEY, argv.outputDir)
    .then(v => console.log(`ok`, v))
    .tapCatch(e => console.error(`fail`, e));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaGFuZGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLGtEQUEwQjtBQUMxQiw2REFBeUM7QUFHekMsSUFBSSxJQUFJLEdBQUcsZUFBSztLQUNkLE1BQU0sQ0FBQyxPQUFPLEVBQUU7SUFDaEIsTUFBTSxFQUFFLElBQUk7SUFDWixZQUFZLEVBQUUsSUFBSTtDQUNsQixDQUFDO0tBQ0QsTUFBTSxDQUFDLFVBQVUsRUFBRTtJQUNuQixNQUFNLEVBQUUsSUFBSTtJQUNaLFlBQVksRUFBRSxJQUFJO0NBQ2xCLENBQUM7S0FDRCxNQUFNLENBQUMsV0FBVyxFQUFFO0lBQ3BCLE1BQU0sRUFBRSxJQUFJO0lBQ1osWUFBWSxFQUFFLElBQUk7Q0FDbEIsQ0FBQztLQUNELElBQUksQ0FDTDtBQUVELGlCQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7S0FDcEQsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDL0IsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FDeEMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5cbmltcG9ydCB5YXJncyBmcm9tICd5YXJncyc7XG5pbXBvcnQgaGFuZGxlQXN5bmMgZnJvbSAnLi4vbGliL3RocmVhZHMnO1xuaW1wb3J0IHsgRW51bU5vdmVsU2l0ZUxpc3QgfSBmcm9tICdub3ZlbC1kb3dubG9hZGVyL3NyYy9hbGwnO1xuXG5sZXQgYXJndiA9IHlhcmdzXG5cdC5vcHRpb24oJ0lES0VZJywge1xuXHRcdHN0cmluZzogdHJ1ZSxcblx0XHRkZW1hbmRPcHRpb246IHRydWUsXG5cdH0pXG5cdC5vcHRpb24oJ25vdmVsX2lkJywge1xuXHRcdHN0cmluZzogdHJ1ZSxcblx0XHRkZW1hbmRPcHRpb246IHRydWUsXG5cdH0pXG5cdC5vcHRpb24oJ291dHB1dERpcicsIHtcblx0XHRzdHJpbmc6IHRydWUsXG5cdFx0ZGVtYW5kT3B0aW9uOiB0cnVlLFxuXHR9KVxuXHQuYXJndlxuO1xuXG5oYW5kbGVBc3luYyhhcmd2Lm5vdmVsX2lkLCBhcmd2LklES0VZLCBhcmd2Lm91dHB1dERpcilcblx0LnRoZW4odiA9PiBjb25zb2xlLmxvZyhgb2tgLCB2KSlcblx0LnRhcENhdGNoKGUgPT4gY29uc29sZS5lcnJvcihgZmFpbGAsIGUpKVxuO1xuIl19