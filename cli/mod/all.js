#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const download_1 = require("../../lib/download");
const threads_1 = __importDefault(require("../lib/threads"));
const novel_epub_1 = __importDefault(require("novel-epub"));
const fs_extra_1 = require("fs-extra");
const bluebird_1 = __importDefault(require("bluebird"));
const const_1 = require("../../lib/const");
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
})
    .argv;
bluebird_1.default
    .resolve(download_1.downloadNovel2({
    novel_id: argv.novel_id,
    siteID: argv.siteID,
    outputRoot: argv.outputDir,
}))
    .then(async ({ options, download, }) => {
    let { cwd, novel_id, IDKEY, outputDir, novel, ...arr } = await download();
    await threads_1.default(argv.novel_id, IDKEY, outputDir);
    let epub = await novel_epub_1.default({
        inputPath: cwd,
        outputPath: cwd,
        padEndDate: false,
        filename: novel_id,
        noLog: true,
        downloadRemoteFile: true,
    });
    let map_file = const_1.__cacheMapFile;
    let map = await fs_extra_1.readJSON(map_file)
        .catch(e => ({})) || {};
    map[argv.siteID] = map[argv.siteID] || {};
    map[IDKEY] = map[IDKEY] || {};
    let _data = {
        ...arr,
        cwd,
        IDKEY,
        novel_id,
        outputDir,
        epub: epub.file,
        status: 2,
    };
    map[argv.siteID][novel_id] = map[argv.siteID][argv.novel_id] = map[IDKEY][novel_id] = map[IDKEY][argv.novel_id] = _data;
    await fs_extra_1.outputJSON(map_file, map, {
        spaces: 2,
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLGtEQUEwQjtBQUMxQixpREFBb0Q7QUFDcEQsNkRBQXlDO0FBQ3pDLDREQUFtQztBQUNuQyx1Q0FBZ0Q7QUFFaEQsd0RBQWdDO0FBRWhDLDJDQUFpRDtBQUVqRCxJQUFJLElBQUksR0FBRyxlQUFLO0tBQ2QsTUFBTSxDQUFDLFFBQVEsRUFBRTtJQUNqQixNQUFNLEVBQUUsSUFBSTtJQUNaLFlBQVksRUFBRSxJQUFJO0NBQ2xCLENBQUM7S0FDRCxNQUFNLENBQUMsVUFBVSxFQUFFO0lBQ25CLE1BQU0sRUFBRSxJQUFJO0lBQ1osWUFBWSxFQUFFLElBQUk7Q0FDbEIsQ0FBQztLQUNELE1BQU0sQ0FBQyxXQUFXLEVBQUU7SUFDcEIsTUFBTSxFQUFFLElBQUk7Q0FDWixDQUFDO0tBQ0QsSUFBSSxDQUNMO0FBRUQsa0JBQVE7S0FDTixPQUFPLENBQUMseUJBQWMsQ0FBQztJQUN2QixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7SUFDdkIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO0lBQ25CLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUztDQUMxQixDQUFDLENBQUM7S0FDRixJQUFJLENBQUMsS0FBSyxFQUFFLEVBQ1osT0FBTyxFQUNQLFFBQVEsR0FDUixFQUFFLEVBQUU7SUFFSixJQUFJLEVBQ0gsR0FBRyxFQUNILFFBQVEsRUFDUixLQUFLLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxHQUFHLEdBQUcsRUFDTixHQUFHLE1BQU0sUUFBUSxFQUFFLENBQUM7SUFFckIsTUFBTSxpQkFBVyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBRW5ELElBQUksSUFBSSxHQUFHLE1BQU0sb0JBQVMsQ0FBQztRQUMxQixTQUFTLEVBQUUsR0FBRztRQUNkLFVBQVUsRUFBRSxHQUFHO1FBQ2YsVUFBVSxFQUFFLEtBQUs7UUFDakIsUUFBUSxFQUFFLFFBQVE7UUFDbEIsS0FBSyxFQUFFLElBQUk7UUFDWCxrQkFBa0IsRUFBRSxJQUFJO0tBQ3hCLENBQUMsQ0FBQztJQUlILElBQUksUUFBUSxHQUFHLHNCQUFjLENBQUM7SUFFOUIsSUFBSSxHQUFHLEdBQWMsTUFBTSxtQkFBUSxDQUFDLFFBQVEsQ0FBQztTQUMzQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUN2QjtJQUVELEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDMUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFOUIsSUFBSSxLQUFLLEdBQWlCO1FBQ3pCLEdBQUcsR0FBRztRQUNOLEdBQUc7UUFDSCxLQUFLO1FBQ0wsUUFBUTtRQUNSLFNBQVM7UUFDVCxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7UUFDZixNQUFNLEdBQTRCO0tBQ2xDLENBQUM7SUFFRixHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUssQ0FBQztJQUV4SCxNQUFNLHFCQUFVLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtRQUMvQixNQUFNLEVBQUUsQ0FBQztLQUNULENBQUMsQ0FBQTtBQUVILENBQUMsQ0FBQyxDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuXG5pbXBvcnQgeWFyZ3MgZnJvbSAneWFyZ3MnO1xuaW1wb3J0IHsgZG93bmxvYWROb3ZlbDIgfSBmcm9tICcuLi8uLi9saWIvZG93bmxvYWQnO1xuaW1wb3J0IGhhbmRsZUFzeW5jIGZyb20gJy4uL2xpYi90aHJlYWRzJztcbmltcG9ydCBub3ZlbEVwdWIgZnJvbSAnbm92ZWwtZXB1Yic7XG5pbXBvcnQgeyBvdXRwdXRKU09OLCByZWFkSlNPTiB9IGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgeyBJQ2FjaGVNYXBSb3csIElDYWNoZU1hcCwgRW51bUNhY2hlTWFwUm93U3RhdHVzIH0gZnJvbSAnLi4vLi4vbGliL3R5cGVzJztcbmltcG9ydCB7IF9fY2FjaGVNYXBGaWxlIH0gZnJvbSAnLi4vLi4vbGliL2NvbnN0JztcblxubGV0IGFyZ3YgPSB5YXJnc1xuXHQub3B0aW9uKCdzaXRlSUQnLCB7XG5cdFx0c3RyaW5nOiB0cnVlLFxuXHRcdGRlbWFuZE9wdGlvbjogdHJ1ZSxcblx0fSlcblx0Lm9wdGlvbignbm92ZWxfaWQnLCB7XG5cdFx0c3RyaW5nOiB0cnVlLFxuXHRcdGRlbWFuZE9wdGlvbjogdHJ1ZSxcblx0fSlcblx0Lm9wdGlvbignb3V0cHV0RGlyJywge1xuXHRcdHN0cmluZzogdHJ1ZSxcblx0fSlcblx0LmFyZ3ZcbjtcblxuQmx1ZWJpcmRcblx0LnJlc29sdmUoZG93bmxvYWROb3ZlbDIoe1xuXHRcdG5vdmVsX2lkOiBhcmd2Lm5vdmVsX2lkLFxuXHRcdHNpdGVJRDogYXJndi5zaXRlSUQsXG5cdFx0b3V0cHV0Um9vdDogYXJndi5vdXRwdXREaXIsXG5cdH0pKVxuXHQudGhlbihhc3luYyAoe1xuXHRcdG9wdGlvbnMsXG5cdFx0ZG93bmxvYWQsXG5cdH0pID0+XG5cdHtcblx0XHRsZXQge1xuXHRcdFx0Y3dkLFxuXHRcdFx0bm92ZWxfaWQsXG5cdFx0XHRJREtFWSxcblx0XHRcdG91dHB1dERpcixcblx0XHRcdG5vdmVsLFxuXHRcdFx0Li4uYXJyXG5cdFx0fSA9IGF3YWl0IGRvd25sb2FkKCk7XG5cblx0XHRhd2FpdCBoYW5kbGVBc3luYyhhcmd2Lm5vdmVsX2lkLCBJREtFWSwgb3V0cHV0RGlyKTtcblxuXHRcdGxldCBlcHViID0gYXdhaXQgbm92ZWxFcHViKHtcblx0XHRcdGlucHV0UGF0aDogY3dkLFxuXHRcdFx0b3V0cHV0UGF0aDogY3dkLFxuXHRcdFx0cGFkRW5kRGF0ZTogZmFsc2UsXG5cdFx0XHRmaWxlbmFtZTogbm92ZWxfaWQsXG5cdFx0XHRub0xvZzogdHJ1ZSxcblx0XHRcdGRvd25sb2FkUmVtb3RlRmlsZTogdHJ1ZSxcblx0XHR9KTtcblxuXHRcdC8vY29uc29sZS5kaXIoZXB1Yi5maWxlKTtcblxuXHRcdGxldCBtYXBfZmlsZSA9IF9fY2FjaGVNYXBGaWxlO1xuXG5cdFx0bGV0IG1hcDogSUNhY2hlTWFwID0gYXdhaXQgcmVhZEpTT04obWFwX2ZpbGUpXG5cdFx0XHQuY2F0Y2goZSA9PiAoe30pKSB8fCB7fVxuXHRcdDtcblxuXHRcdG1hcFthcmd2LnNpdGVJRF0gPSBtYXBbYXJndi5zaXRlSURdIHx8IHt9O1xuXHRcdG1hcFtJREtFWV0gPSBtYXBbSURLRVldIHx8IHt9O1xuXG5cdFx0bGV0IF9kYXRhOiBJQ2FjaGVNYXBSb3cgPSB7XG5cdFx0XHQuLi5hcnIsXG5cdFx0XHRjd2QsXG5cdFx0XHRJREtFWSxcblx0XHRcdG5vdmVsX2lkLFxuXHRcdFx0b3V0cHV0RGlyLFxuXHRcdFx0ZXB1YjogZXB1Yi5maWxlLFxuXHRcdFx0c3RhdHVzOiBFbnVtQ2FjaGVNYXBSb3dTdGF0dXMuRE9ORSxcblx0XHR9O1xuXG5cdFx0bWFwW2FyZ3Yuc2l0ZUlEXVtub3ZlbF9pZF0gPSBtYXBbYXJndi5zaXRlSURdW2FyZ3Yubm92ZWxfaWRdID0gbWFwW0lES0VZXVtub3ZlbF9pZF0gPSBtYXBbSURLRVldW2FyZ3Yubm92ZWxfaWRdID0gX2RhdGE7XG5cblx0XHRhd2FpdCBvdXRwdXRKU09OKG1hcF9maWxlLCBtYXAsIHtcblx0XHRcdHNwYWNlczogMixcblx0XHR9KVxuXG5cdH0pXG47XG4iXX0=