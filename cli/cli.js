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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2xpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLGtEQUEwQjtBQUMxQixpREFBMEM7QUFDMUMsd0NBQTBDO0FBQzFDLCtCQUErQjtBQUUvQixJQUFJLElBQUksR0FBRyxlQUFLO0tBQ2QsTUFBTSxDQUFDLEtBQUssRUFBRTtJQUNkLE1BQU0sRUFBRSxJQUFJO0lBQ1osWUFBWSxFQUFFLElBQUk7SUFDbEIsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDO0NBQ1osQ0FBQztLQUNELE1BQU0sQ0FBQyxRQUFRLEVBQUU7SUFDakIsTUFBTSxFQUFFLElBQUk7SUFDWixZQUFZLEVBQUUsSUFBSTtJQUNsQixLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUM7Q0FDWixDQUFDO0tBQ0QsTUFBTSxDQUFDLFdBQVcsRUFBRTtJQUNwQixNQUFNLEVBQUUsSUFBSTtJQUNaLE9BQU8sRUFBRSxrQkFBVTtDQUNuQixDQUFDO0tBQ0QsTUFBTSxDQUFDLFVBQVUsRUFBRTtJQUNuQixNQUFNLEVBQUUsSUFBSTtJQUNaLFlBQVksRUFBRSxJQUFJO0lBQ2xCLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQztDQUNaLENBQUM7S0FDRCxJQUFJLENBQ0w7QUFFRCxRQUFRLElBQUksQ0FBQyxHQUE0QixFQUN6QztJQUNDLEtBQUssUUFBUTtRQUVaLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQzNCO1lBQ0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNqQixNQUFNLElBQUksS0FBSyxFQUFFLENBQUE7U0FDakI7UUFFRCx5QkFBUyxDQUFDLE1BQU0sRUFBRTtZQUNqQixjQUFPLENBQUMsU0FBUyxFQUFFLFNBQVMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3ZDLFNBQVM7WUFDVCxJQUFJLENBQUMsTUFBTTtZQUNYLFlBQVk7WUFDWixJQUFJLENBQUMsUUFBUTtZQUNiLGFBQWE7WUFDYixJQUFJLENBQUMsU0FBUztTQUNkLEVBQUU7WUFDRixLQUFLLEVBQUUsU0FBUztTQUNoQixDQUFDLENBQUM7UUFDSCxNQUFNO0lBQ1A7UUFFQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUMzQjtZQUNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDakIsTUFBTSxJQUFJLEtBQUssRUFBRSxDQUFBO1NBQ2pCO1FBRUQseUJBQVMsQ0FBQyxNQUFNLEVBQUU7WUFDakIsY0FBTyxDQUFDLFNBQVMsRUFBRSxTQUFTLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUN2QyxVQUFVO1lBQ1YsSUFBSSxDQUFDLE1BQU07WUFDWCxZQUFZO1lBQ1osSUFBSSxDQUFDLFFBQVE7WUFDYixhQUFhO1lBQ2IsSUFBSSxDQUFDLFNBQVM7U0FDZCxFQUFFO1lBQ0YsS0FBSyxFQUFFLFNBQVM7U0FDaEIsQ0FBQyxDQUFDO1FBQ0gsTUFBTTtDQUVQIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuXG5pbXBvcnQgeWFyZ3MgZnJvbSAneWFyZ3MnO1xuaW1wb3J0IHsgc3Bhd25TeW5jIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgeyBPVVRQVVRfRElSIH0gZnJvbSAnLi4vbGliL2NvbnN0JztcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcblxubGV0IGFyZ3YgPSB5YXJnc1xuXHQub3B0aW9uKCdtb2QnLCB7XG5cdFx0c3RyaW5nOiB0cnVlLFxuXHRcdGRlbWFuZE9wdGlvbjogdHJ1ZSxcblx0XHRhbGlhczogWydtJ10sXG5cdH0pXG5cdC5vcHRpb24oJ3NpdGVJRCcsIHtcblx0XHRzdHJpbmc6IHRydWUsXG5cdFx0ZGVtYW5kT3B0aW9uOiB0cnVlLFxuXHRcdGFsaWFzOiBbJ3MnXSxcblx0fSlcblx0Lm9wdGlvbignb3V0cHV0RGlyJywge1xuXHRcdHN0cmluZzogdHJ1ZSxcblx0XHRkZWZhdWx0OiBPVVRQVVRfRElSLFxuXHR9KVxuXHQub3B0aW9uKCdub3ZlbF9pZCcsIHtcblx0XHRzdHJpbmc6IHRydWUsXG5cdFx0ZGVtYW5kT3B0aW9uOiB0cnVlLFxuXHRcdGFsaWFzOiBbJ2knXSxcblx0fSlcblx0LmFyZ3Zcbjtcblxuc3dpdGNoIChhcmd2Lm1vZCBhcyAnaGFuZGxlJyB8ICdkb3dubG9hZCcpXG57XG5cdGNhc2UgJ2hhbmRsZSc6XG5cblx0XHRpZiAoYXJndi5tb2QuaW5jbHVkZXMoJy4uJykpXG5cdFx0e1xuXHRcdFx0Y29uc29sZS5kaXIoYXJndilcblx0XHRcdHRocm93IG5ldyBFcnJvcigpXG5cdFx0fVxuXG5cdFx0c3Bhd25TeW5jKCdub2RlJywgW1xuXHRcdFx0cmVzb2x2ZShfX2Rpcm5hbWUsIGAuL21vZC8ke2FyZ3YubW9kfWApLFxuXHRcdFx0Jy0tSURLRVknLFxuXHRcdFx0YXJndi5zaXRlSUQsXG5cdFx0XHQnLS1ub3ZlbF9pZCcsXG5cdFx0XHRhcmd2Lm5vdmVsX2lkLFxuXHRcdFx0Jy0tb3V0cHV0RGlyJyxcblx0XHRcdGFyZ3Yub3V0cHV0RGlyLFxuXHRcdF0sIHtcblx0XHRcdHN0ZGlvOiAnaW5oZXJpdCcsXG5cdFx0fSk7XG5cdFx0YnJlYWs7XG5cdGRlZmF1bHQ6XG5cblx0XHRpZiAoYXJndi5tb2QuaW5jbHVkZXMoJy4uJykpXG5cdFx0e1xuXHRcdFx0Y29uc29sZS5kaXIoYXJndilcblx0XHRcdHRocm93IG5ldyBFcnJvcigpXG5cdFx0fVxuXG5cdFx0c3Bhd25TeW5jKCdub2RlJywgW1xuXHRcdFx0cmVzb2x2ZShfX2Rpcm5hbWUsIGAuL21vZC8ke2FyZ3YubW9kfWApLFxuXHRcdFx0Jy0tc2l0ZUlEJyxcblx0XHRcdGFyZ3Yuc2l0ZUlELFxuXHRcdFx0Jy0tbm92ZWxfaWQnLFxuXHRcdFx0YXJndi5ub3ZlbF9pZCxcblx0XHRcdCctLW91dHB1dERpcicsXG5cdFx0XHRhcmd2Lm91dHB1dERpcixcblx0XHRdLCB7XG5cdFx0XHRzdGRpbzogJ2luaGVyaXQnLFxuXHRcdH0pO1xuXHRcdGJyZWFrO1xuXG59XG4iXX0=