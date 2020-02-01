#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const child_process_1 = require("child_process");
const const_1 = require("../lib/const");
const path_1 = require("path");
let argv = yargs_1.default
    .option('mod', {
    string: true,
    demandOption: true,
    alias: ['m'],
})
    .option('siteID', {
    string: true,
    demandOption: true,
    alias: ['s'],
})
    .option('outputDir', {
    string: true,
    default: const_1.OUTPUT_DIR,
})
    .option('novel_id', {
    string: true,
    demandOption: true,
    alias: ['i'],
})
    .argv;
switch (argv.mod) {
    case 'handle':
        if (argv.mod.includes('..')) {
            console.dir(argv);
            throw new Error();
        }
        child_process_1.spawnSync('node', [
            '--experimental-worker',
            path_1.resolve(__dirname, `./mod/${argv.mod}`),
            '--IDKEY',
            argv.siteID,
            '--novel_id',
            argv.novel_id,
            '--outputDir',
            argv.outputDir,
        ], {
            stdio: 'inherit',
        });
        break;
    default:
        if (argv.mod.includes('..')) {
            console.dir(argv);
            throw new Error();
        }
        child_process_1.spawnSync('node', [
            path_1.resolve(__dirname, `./mod/${argv.mod}`),
            '--siteID',
            argv.siteID,
            '--novel_id',
            argv.novel_id,
            '--outputDir',
            argv.outputDir,
        ], {
            stdio: 'inherit',
        });
        break;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2xpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLGtEQUEwQjtBQUMxQixpREFBMEM7QUFDMUMsd0NBQTBDO0FBQzFDLCtCQUErQjtBQUUvQixJQUFJLElBQUksR0FBRyxlQUFLO0tBQ2QsTUFBTSxDQUFDLEtBQUssRUFBRTtJQUNkLE1BQU0sRUFBRSxJQUFJO0lBQ1osWUFBWSxFQUFFLElBQUk7SUFDbEIsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDO0NBQ1osQ0FBQztLQUNELE1BQU0sQ0FBQyxRQUFRLEVBQUU7SUFDakIsTUFBTSxFQUFFLElBQUk7SUFDWixZQUFZLEVBQUUsSUFBSTtJQUNsQixLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUM7Q0FDWixDQUFDO0tBQ0QsTUFBTSxDQUFDLFdBQVcsRUFBRTtJQUNwQixNQUFNLEVBQUUsSUFBSTtJQUNaLE9BQU8sRUFBRSxrQkFBVTtDQUNuQixDQUFDO0tBQ0QsTUFBTSxDQUFDLFVBQVUsRUFBRTtJQUNuQixNQUFNLEVBQUUsSUFBSTtJQUNaLFlBQVksRUFBRSxJQUFJO0lBQ2xCLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQztDQUNaLENBQUM7S0FDRCxJQUFJLENBQ0w7QUFFRCxRQUFRLElBQUksQ0FBQyxHQUE0QixFQUN6QztJQUNDLEtBQUssUUFBUTtRQUVaLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQzNCO1lBQ0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNqQixNQUFNLElBQUksS0FBSyxFQUFFLENBQUE7U0FDakI7UUFFRCx5QkFBUyxDQUFDLE1BQU0sRUFBRTtZQUNqQix1QkFBdUI7WUFDdkIsY0FBTyxDQUFDLFNBQVMsRUFBRSxTQUFTLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUN2QyxTQUFTO1lBQ1QsSUFBSSxDQUFDLE1BQU07WUFDWCxZQUFZO1lBQ1osSUFBSSxDQUFDLFFBQVE7WUFDYixhQUFhO1lBQ2IsSUFBSSxDQUFDLFNBQVM7U0FDZCxFQUFFO1lBQ0YsS0FBSyxFQUFFLFNBQVM7U0FDaEIsQ0FBQyxDQUFDO1FBQ0gsTUFBTTtJQUNQO1FBRUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFDM0I7WUFDQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ2pCLE1BQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQTtTQUNqQjtRQUVELHlCQUFTLENBQUMsTUFBTSxFQUFFO1lBQ2pCLGNBQU8sQ0FBQyxTQUFTLEVBQUUsU0FBUyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDdkMsVUFBVTtZQUNWLElBQUksQ0FBQyxNQUFNO1lBQ1gsWUFBWTtZQUNaLElBQUksQ0FBQyxRQUFRO1lBQ2IsYUFBYTtZQUNiLElBQUksQ0FBQyxTQUFTO1NBQ2QsRUFBRTtZQUNGLEtBQUssRUFBRSxTQUFTO1NBQ2hCLENBQUMsQ0FBQztRQUNILE1BQU07Q0FFUCIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcblxuaW1wb3J0IHlhcmdzIGZyb20gJ3lhcmdzJztcbmltcG9ydCB7IHNwYXduU3luYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0IHsgT1VUUFVUX0RJUiB9IGZyb20gJy4uL2xpYi9jb25zdCc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5cbmxldCBhcmd2ID0geWFyZ3Ncblx0Lm9wdGlvbignbW9kJywge1xuXHRcdHN0cmluZzogdHJ1ZSxcblx0XHRkZW1hbmRPcHRpb246IHRydWUsXG5cdFx0YWxpYXM6IFsnbSddLFxuXHR9KVxuXHQub3B0aW9uKCdzaXRlSUQnLCB7XG5cdFx0c3RyaW5nOiB0cnVlLFxuXHRcdGRlbWFuZE9wdGlvbjogdHJ1ZSxcblx0XHRhbGlhczogWydzJ10sXG5cdH0pXG5cdC5vcHRpb24oJ291dHB1dERpcicsIHtcblx0XHRzdHJpbmc6IHRydWUsXG5cdFx0ZGVmYXVsdDogT1VUUFVUX0RJUixcblx0fSlcblx0Lm9wdGlvbignbm92ZWxfaWQnLCB7XG5cdFx0c3RyaW5nOiB0cnVlLFxuXHRcdGRlbWFuZE9wdGlvbjogdHJ1ZSxcblx0XHRhbGlhczogWydpJ10sXG5cdH0pXG5cdC5hcmd2XG47XG5cbnN3aXRjaCAoYXJndi5tb2QgYXMgJ2hhbmRsZScgfCAnZG93bmxvYWQnKVxue1xuXHRjYXNlICdoYW5kbGUnOlxuXG5cdFx0aWYgKGFyZ3YubW9kLmluY2x1ZGVzKCcuLicpKVxuXHRcdHtcblx0XHRcdGNvbnNvbGUuZGlyKGFyZ3YpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoKVxuXHRcdH1cblxuXHRcdHNwYXduU3luYygnbm9kZScsIFtcblx0XHRcdCctLWV4cGVyaW1lbnRhbC13b3JrZXInLFxuXHRcdFx0cmVzb2x2ZShfX2Rpcm5hbWUsIGAuL21vZC8ke2FyZ3YubW9kfWApLFxuXHRcdFx0Jy0tSURLRVknLFxuXHRcdFx0YXJndi5zaXRlSUQsXG5cdFx0XHQnLS1ub3ZlbF9pZCcsXG5cdFx0XHRhcmd2Lm5vdmVsX2lkLFxuXHRcdFx0Jy0tb3V0cHV0RGlyJyxcblx0XHRcdGFyZ3Yub3V0cHV0RGlyLFxuXHRcdF0sIHtcblx0XHRcdHN0ZGlvOiAnaW5oZXJpdCcsXG5cdFx0fSk7XG5cdFx0YnJlYWs7XG5cdGRlZmF1bHQ6XG5cblx0XHRpZiAoYXJndi5tb2QuaW5jbHVkZXMoJy4uJykpXG5cdFx0e1xuXHRcdFx0Y29uc29sZS5kaXIoYXJndilcblx0XHRcdHRocm93IG5ldyBFcnJvcigpXG5cdFx0fVxuXG5cdFx0c3Bhd25TeW5jKCdub2RlJywgW1xuXHRcdFx0cmVzb2x2ZShfX2Rpcm5hbWUsIGAuL21vZC8ke2FyZ3YubW9kfWApLFxuXHRcdFx0Jy0tc2l0ZUlEJyxcblx0XHRcdGFyZ3Yuc2l0ZUlELFxuXHRcdFx0Jy0tbm92ZWxfaWQnLFxuXHRcdFx0YXJndi5ub3ZlbF9pZCxcblx0XHRcdCctLW91dHB1dERpcicsXG5cdFx0XHRhcmd2Lm91dHB1dERpcixcblx0XHRdLCB7XG5cdFx0XHRzdGRpbzogJ2luaGVyaXQnLFxuXHRcdH0pO1xuXHRcdGJyZWFrO1xuXG59XG4iXX0=