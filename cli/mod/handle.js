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
    .then(v => console.log(v));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaGFuZGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLGtEQUEwQjtBQUMxQiw2REFBeUM7QUFHekMsSUFBSSxJQUFJLEdBQUcsZUFBSztLQUNkLE1BQU0sQ0FBQyxPQUFPLEVBQUU7SUFDaEIsTUFBTSxFQUFFLElBQUk7SUFDWixZQUFZLEVBQUUsSUFBSTtDQUNsQixDQUFDO0tBQ0QsTUFBTSxDQUFDLFVBQVUsRUFBRTtJQUNuQixNQUFNLEVBQUUsSUFBSTtJQUNaLFlBQVksRUFBRSxJQUFJO0NBQ2xCLENBQUM7S0FDRCxNQUFNLENBQUMsV0FBVyxFQUFFO0lBQ3BCLE1BQU0sRUFBRSxJQUFJO0lBQ1osWUFBWSxFQUFFLElBQUk7Q0FDbEIsQ0FBQztLQUNELElBQUksQ0FDTDtBQUVELGlCQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7S0FDcEQsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUMxQiIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcblxuaW1wb3J0IHlhcmdzIGZyb20gJ3lhcmdzJztcbmltcG9ydCBoYW5kbGVBc3luYyBmcm9tICcuLi9saWIvdGhyZWFkcyc7XG5pbXBvcnQgeyBFbnVtTm92ZWxTaXRlTGlzdCB9IGZyb20gJ25vdmVsLWRvd25sb2FkZXIvc3JjL2FsbCc7XG5cbmxldCBhcmd2ID0geWFyZ3Ncblx0Lm9wdGlvbignSURLRVknLCB7XG5cdFx0c3RyaW5nOiB0cnVlLFxuXHRcdGRlbWFuZE9wdGlvbjogdHJ1ZSxcblx0fSlcblx0Lm9wdGlvbignbm92ZWxfaWQnLCB7XG5cdFx0c3RyaW5nOiB0cnVlLFxuXHRcdGRlbWFuZE9wdGlvbjogdHJ1ZSxcblx0fSlcblx0Lm9wdGlvbignb3V0cHV0RGlyJywge1xuXHRcdHN0cmluZzogdHJ1ZSxcblx0XHRkZW1hbmRPcHRpb246IHRydWUsXG5cdH0pXG5cdC5hcmd2XG47XG5cbmhhbmRsZUFzeW5jKGFyZ3Yubm92ZWxfaWQsIGFyZ3YuSURLRVksIGFyZ3Yub3V0cHV0RGlyKVxuXHQudGhlbih2ID0+IGNvbnNvbGUubG9nKHYpKVxuO1xuIl19