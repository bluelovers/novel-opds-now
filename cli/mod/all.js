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
const logger_1 = __importDefault(require("debug-color2/logger"));
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
    useCached: true,
}))
    .then(async ({ options, download, }) => {
    let { cwd, novel_id, IDKEY, outputDir, novel, ...arr } = await download()
        .tapCatch(e => {
        logger_1.default.error(`下載來源時發生錯誤`, e);
    });
    logger_1.default.log(`來源下載完成，開始處理排版`, outputDir);
    await threads_1.default(argv.novel_id, IDKEY, outputDir)
        .tapCatch(e => {
        logger_1.default.error(`處理排版時發生錯誤`, e);
    });
    logger_1.default.log(`排版完成，開始打包 epub`);
    let epub = await novel_epub_1.default({
        inputPath: cwd,
        outputPath: cwd,
        padEndDate: false,
        filename: novel_id,
        downloadRemoteFile: true,
    })
        .tapCatch(e => {
        logger_1.default.error(`打包 epub 時發生錯誤`, e);
    });
    let map_file = const_1.__cacheMapFile;
    let map = await fs_extra_1.readJSON(map_file)
        .catch(e => ({}));
    map[IDKEY] = map[IDKEY] || {};
    let _data = {
        ...arr,
        cwd,
        IDKEY,
        novel_id,
        outputDir,
        epub: epub.file,
        status: 2,
        timestamp: Date.now(),
    };
    map[IDKEY][novel_id] = map[IDKEY][argv.novel_id] = _data;
    await fs_extra_1.outputJSON(map_file, map, {
        spaces: 2,
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLGtEQUEwQjtBQUMxQixpREFBMkQ7QUFDM0QsNkRBQXlDO0FBQ3pDLDREQUFtQztBQUNuQyx1Q0FBZ0Q7QUFFaEQsd0RBQWdDO0FBRWhDLDJDQUFpRDtBQUNqRCxpRUFBMEM7QUFFMUMsSUFBSSxJQUFJLEdBQUcsZUFBSztLQUNkLE1BQU0sQ0FBQyxRQUFRLEVBQUU7SUFDakIsTUFBTSxFQUFFLElBQUk7SUFDWixZQUFZLEVBQUUsSUFBSTtDQUNsQixDQUFDO0tBQ0QsTUFBTSxDQUFDLFVBQVUsRUFBRTtJQUNuQixNQUFNLEVBQUUsSUFBSTtJQUNaLFlBQVksRUFBRSxJQUFJO0NBQ2xCLENBQUM7S0FDRCxNQUFNLENBQUMsV0FBVyxFQUFFO0lBQ3BCLE1BQU0sRUFBRSxJQUFJO0NBQ1osQ0FBQztLQUNELElBQUksQ0FDTDtBQUVELGtCQUFRO0tBQ04sT0FBTyxDQUFDLHlCQUFjLENBQUM7SUFDdkIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO0lBQ3ZCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtJQUNuQixVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVM7SUFDMUIsU0FBUyxFQUFFLElBQUk7Q0FDZixDQUFDLENBQUM7S0FDRixJQUFJLENBQUMsS0FBSyxFQUFFLEVBQ1osT0FBTyxFQUNQLFFBQVEsR0FDUixFQUFFLEVBQUU7SUFFSixJQUFJLEVBQ0gsR0FBRyxFQUNILFFBQVEsRUFDUixLQUFLLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxHQUFHLEdBQUcsRUFDTixHQUFHLE1BQU0sUUFBUSxFQUFFO1NBQ2xCLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNiLGdCQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUM5QixDQUFDLENBQUMsQ0FDRjtJQUVELGdCQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUV4QyxNQUFNLGlCQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDO1NBQ2hELFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNiLGdCQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUM5QixDQUFDLENBQUMsQ0FDRjtJQUVELGdCQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFFOUIsSUFBSSxJQUFJLEdBQUcsTUFBTSxvQkFBUyxDQUFDO1FBQzFCLFNBQVMsRUFBRSxHQUFHO1FBQ2QsVUFBVSxFQUFFLEdBQUc7UUFDZixVQUFVLEVBQUUsS0FBSztRQUNqQixRQUFRLEVBQUUsUUFBUTtRQUVsQixrQkFBa0IsRUFBRSxJQUFJO0tBQ3hCLENBQUM7U0FDQSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDYixnQkFBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFDbEMsQ0FBQyxDQUFDLENBQ0Y7SUFJRCxJQUFJLFFBQVEsR0FBRyxzQkFBYyxDQUFDO0lBRTlCLElBQUksR0FBRyxHQUFjLE1BQU0sbUJBQVEsQ0FBQyxRQUFRLENBQUM7U0FDM0MsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUNqQjtJQUVELEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBRTlCLElBQUksS0FBSyxHQUFpQjtRQUN6QixHQUFHLEdBQUc7UUFDTixHQUFHO1FBQ0gsS0FBSztRQUNMLFFBQVE7UUFDUixTQUFTO1FBQ1QsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1FBQ2YsTUFBTSxHQUE0QjtRQUNsQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTtLQUNyQixDQUFDO0lBRUYsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBRXpELE1BQU0scUJBQVUsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO1FBQy9CLE1BQU0sRUFBRSxDQUFDO0tBQ1QsQ0FBQyxDQUFBO0FBRUgsQ0FBQyxDQUFDLENBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5cbmltcG9ydCB5YXJncyBmcm9tICd5YXJncyc7XG5pbXBvcnQgeyBkb3dubG9hZE5vdmVsMiwgaXM1MDQgfSBmcm9tICcuLi8uLi9saWIvZG93bmxvYWQnO1xuaW1wb3J0IGhhbmRsZUFzeW5jIGZyb20gJy4uL2xpYi90aHJlYWRzJztcbmltcG9ydCBub3ZlbEVwdWIgZnJvbSAnbm92ZWwtZXB1Yic7XG5pbXBvcnQgeyBvdXRwdXRKU09OLCByZWFkSlNPTiB9IGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgeyBJQ2FjaGVNYXBSb3csIElDYWNoZU1hcCwgRW51bUNhY2hlTWFwUm93U3RhdHVzIH0gZnJvbSAnLi4vLi4vbGliL3R5cGVzJztcbmltcG9ydCB7IF9fY2FjaGVNYXBGaWxlIH0gZnJvbSAnLi4vLi4vbGliL2NvbnN0JztcbmltcG9ydCBjb25zb2xlIGZyb20gJ2RlYnVnLWNvbG9yMi9sb2dnZXInO1xuXG5sZXQgYXJndiA9IHlhcmdzXG5cdC5vcHRpb24oJ3NpdGVJRCcsIHtcblx0XHRzdHJpbmc6IHRydWUsXG5cdFx0ZGVtYW5kT3B0aW9uOiB0cnVlLFxuXHR9KVxuXHQub3B0aW9uKCdub3ZlbF9pZCcsIHtcblx0XHRzdHJpbmc6IHRydWUsXG5cdFx0ZGVtYW5kT3B0aW9uOiB0cnVlLFxuXHR9KVxuXHQub3B0aW9uKCdvdXRwdXREaXInLCB7XG5cdFx0c3RyaW5nOiB0cnVlLFxuXHR9KVxuXHQuYXJndlxuO1xuXG5CbHVlYmlyZFxuXHQucmVzb2x2ZShkb3dubG9hZE5vdmVsMih7XG5cdFx0bm92ZWxfaWQ6IGFyZ3Yubm92ZWxfaWQsXG5cdFx0c2l0ZUlEOiBhcmd2LnNpdGVJRCxcblx0XHRvdXRwdXRSb290OiBhcmd2Lm91dHB1dERpcixcblx0XHR1c2VDYWNoZWQ6IHRydWUsXG5cdH0pKVxuXHQudGhlbihhc3luYyAoe1xuXHRcdG9wdGlvbnMsXG5cdFx0ZG93bmxvYWQsXG5cdH0pID0+XG5cdHtcblx0XHRsZXQge1xuXHRcdFx0Y3dkLFxuXHRcdFx0bm92ZWxfaWQsXG5cdFx0XHRJREtFWSxcblx0XHRcdG91dHB1dERpcixcblx0XHRcdG5vdmVsLFxuXHRcdFx0Li4uYXJyXG5cdFx0fSA9IGF3YWl0IGRvd25sb2FkKClcblx0XHRcdC50YXBDYXRjaChlID0+IHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihg5LiL6LyJ5L6G5rqQ5pmC55m855Sf6Yyv6KqkYCwgZSlcblx0XHRcdH0pXG5cdFx0O1xuXG5cdFx0Y29uc29sZS5sb2coYOS+hua6kOS4i+i8ieWujOaIkO+8jOmWi+Wni+iZleeQhuaOkueJiGAsIG91dHB1dERpcik7XG5cblx0XHRhd2FpdCBoYW5kbGVBc3luYyhhcmd2Lm5vdmVsX2lkLCBJREtFWSwgb3V0cHV0RGlyKVxuXHRcdFx0LnRhcENhdGNoKGUgPT4ge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGDomZXnkIbmjpLniYjmmYLnmbznlJ/pjK/oqqRgLCBlKVxuXHRcdFx0fSlcblx0XHQ7XG5cblx0XHRjb25zb2xlLmxvZyhg5o6S54mI5a6M5oiQ77yM6ZaL5aeL5omT5YyFIGVwdWJgKTtcblxuXHRcdGxldCBlcHViID0gYXdhaXQgbm92ZWxFcHViKHtcblx0XHRcdGlucHV0UGF0aDogY3dkLFxuXHRcdFx0b3V0cHV0UGF0aDogY3dkLFxuXHRcdFx0cGFkRW5kRGF0ZTogZmFsc2UsXG5cdFx0XHRmaWxlbmFtZTogbm92ZWxfaWQsXG5cdFx0XHQvL25vTG9nOiB0cnVlLFxuXHRcdFx0ZG93bmxvYWRSZW1vdGVGaWxlOiB0cnVlLFxuXHRcdH0pXG5cdFx0XHQudGFwQ2F0Y2goZSA9PiB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYOaJk+WMhSBlcHViIOaZgueZvOeUn+mMr+iqpGAsIGUpXG5cdFx0XHR9KVxuXHRcdDtcblxuXHRcdC8vY29uc29sZS5kaXIoZXB1Yi5maWxlKTtcblxuXHRcdGxldCBtYXBfZmlsZSA9IF9fY2FjaGVNYXBGaWxlO1xuXG5cdFx0bGV0IG1hcDogSUNhY2hlTWFwID0gYXdhaXQgcmVhZEpTT04obWFwX2ZpbGUpXG5cdFx0XHQuY2F0Y2goZSA9PiAoe30pKVxuXHRcdDtcblxuXHRcdG1hcFtJREtFWV0gPSBtYXBbSURLRVldIHx8IHt9O1xuXG5cdFx0bGV0IF9kYXRhOiBJQ2FjaGVNYXBSb3cgPSB7XG5cdFx0XHQuLi5hcnIsXG5cdFx0XHRjd2QsXG5cdFx0XHRJREtFWSxcblx0XHRcdG5vdmVsX2lkLFxuXHRcdFx0b3V0cHV0RGlyLFxuXHRcdFx0ZXB1YjogZXB1Yi5maWxlLFxuXHRcdFx0c3RhdHVzOiBFbnVtQ2FjaGVNYXBSb3dTdGF0dXMuRE9ORSxcblx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcblx0XHR9O1xuXG5cdFx0bWFwW0lES0VZXVtub3ZlbF9pZF0gPSBtYXBbSURLRVldW2FyZ3Yubm92ZWxfaWRdID0gX2RhdGE7XG5cblx0XHRhd2FpdCBvdXRwdXRKU09OKG1hcF9maWxlLCBtYXAsIHtcblx0XHRcdHNwYWNlczogMixcblx0XHR9KVxuXG5cdH0pXG47XG4iXX0=