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
    useCached: true,
}))
    .then(async ({ options, download, }) => {
    let { cwd, novel_id, IDKEY, outputDir, novel, ...arr } = await download()
        .tapCatch(e => {
        console.error(`下載來源時發生錯誤`, e);
    });
    console.log(`來源下載完成，開始處理排版`, outputDir);
    await threads_1.default(argv.novel_id, IDKEY, outputDir)
        .tapCatch(e => {
        console.error(`處理排版時發生錯誤`, e);
    });
    console.log(`排版完成，開始打包 epub`);
    let epub = await novel_epub_1.default({
        inputPath: cwd,
        outputPath: cwd,
        padEndDate: false,
        filename: novel_id,
        downloadRemoteFile: true,
    })
        .tapCatch(e => {
        console.error(`打包 epub 時發生錯誤`, e);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLGtEQUEwQjtBQUMxQixpREFBMkQ7QUFDM0QsNkRBQXlDO0FBQ3pDLDREQUFtQztBQUNuQyx1Q0FBZ0Q7QUFFaEQsd0RBQWdDO0FBRWhDLDJDQUFpRDtBQUVqRCxJQUFJLElBQUksR0FBRyxlQUFLO0tBQ2QsTUFBTSxDQUFDLFFBQVEsRUFBRTtJQUNqQixNQUFNLEVBQUUsSUFBSTtJQUNaLFlBQVksRUFBRSxJQUFJO0NBQ2xCLENBQUM7S0FDRCxNQUFNLENBQUMsVUFBVSxFQUFFO0lBQ25CLE1BQU0sRUFBRSxJQUFJO0lBQ1osWUFBWSxFQUFFLElBQUk7Q0FDbEIsQ0FBQztLQUNELE1BQU0sQ0FBQyxXQUFXLEVBQUU7SUFDcEIsTUFBTSxFQUFFLElBQUk7Q0FDWixDQUFDO0tBQ0QsSUFBSSxDQUNMO0FBRUQsa0JBQVE7S0FDTixPQUFPLENBQUMseUJBQWMsQ0FBQztJQUN2QixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7SUFDdkIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO0lBQ25CLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUztJQUMxQixTQUFTLEVBQUUsSUFBSTtDQUNmLENBQUMsQ0FBQztLQUNGLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFDWixPQUFPLEVBQ1AsUUFBUSxHQUNSLEVBQUUsRUFBRTtJQUVKLElBQUksRUFDSCxHQUFHLEVBQ0gsUUFBUSxFQUNSLEtBQUssRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLEdBQUcsR0FBRyxFQUNOLEdBQUcsTUFBTSxRQUFRLEVBQUU7U0FDbEIsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFDOUIsQ0FBQyxDQUFDLENBQ0Y7SUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUV4QyxNQUFNLGlCQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDO1NBQ2hELFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBQzlCLENBQUMsQ0FBQyxDQUNGO0lBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBRTlCLElBQUksSUFBSSxHQUFHLE1BQU0sb0JBQVMsQ0FBQztRQUMxQixTQUFTLEVBQUUsR0FBRztRQUNkLFVBQVUsRUFBRSxHQUFHO1FBQ2YsVUFBVSxFQUFFLEtBQUs7UUFDakIsUUFBUSxFQUFFLFFBQVE7UUFFbEIsa0JBQWtCLEVBQUUsSUFBSTtLQUN4QixDQUFDO1NBQ0EsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFDbEMsQ0FBQyxDQUFDLENBQ0Y7SUFJRCxJQUFJLFFBQVEsR0FBRyxzQkFBYyxDQUFDO0lBRTlCLElBQUksR0FBRyxHQUFjLE1BQU0sbUJBQVEsQ0FBQyxRQUFRLENBQUM7U0FDM0MsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUNqQjtJQUVELEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBRTlCLElBQUksS0FBSyxHQUFpQjtRQUN6QixHQUFHLEdBQUc7UUFDTixHQUFHO1FBQ0gsS0FBSztRQUNMLFFBQVE7UUFDUixTQUFTO1FBQ1QsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1FBQ2YsTUFBTSxHQUE0QjtRQUNsQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTtLQUNyQixDQUFDO0lBRUYsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBRXpELE1BQU0scUJBQVUsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO1FBQy9CLE1BQU0sRUFBRSxDQUFDO0tBQ1QsQ0FBQyxDQUFBO0FBRUgsQ0FBQyxDQUFDLENBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5cbmltcG9ydCB5YXJncyBmcm9tICd5YXJncyc7XG5pbXBvcnQgeyBkb3dubG9hZE5vdmVsMiwgaXM1MDQgfSBmcm9tICcuLi8uLi9saWIvZG93bmxvYWQnO1xuaW1wb3J0IGhhbmRsZUFzeW5jIGZyb20gJy4uL2xpYi90aHJlYWRzJztcbmltcG9ydCBub3ZlbEVwdWIgZnJvbSAnbm92ZWwtZXB1Yic7XG5pbXBvcnQgeyBvdXRwdXRKU09OLCByZWFkSlNPTiB9IGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgeyBJQ2FjaGVNYXBSb3csIElDYWNoZU1hcCwgRW51bUNhY2hlTWFwUm93U3RhdHVzIH0gZnJvbSAnLi4vLi4vbGliL3R5cGVzJztcbmltcG9ydCB7IF9fY2FjaGVNYXBGaWxlIH0gZnJvbSAnLi4vLi4vbGliL2NvbnN0JztcblxubGV0IGFyZ3YgPSB5YXJnc1xuXHQub3B0aW9uKCdzaXRlSUQnLCB7XG5cdFx0c3RyaW5nOiB0cnVlLFxuXHRcdGRlbWFuZE9wdGlvbjogdHJ1ZSxcblx0fSlcblx0Lm9wdGlvbignbm92ZWxfaWQnLCB7XG5cdFx0c3RyaW5nOiB0cnVlLFxuXHRcdGRlbWFuZE9wdGlvbjogdHJ1ZSxcblx0fSlcblx0Lm9wdGlvbignb3V0cHV0RGlyJywge1xuXHRcdHN0cmluZzogdHJ1ZSxcblx0fSlcblx0LmFyZ3ZcbjtcblxuQmx1ZWJpcmRcblx0LnJlc29sdmUoZG93bmxvYWROb3ZlbDIoe1xuXHRcdG5vdmVsX2lkOiBhcmd2Lm5vdmVsX2lkLFxuXHRcdHNpdGVJRDogYXJndi5zaXRlSUQsXG5cdFx0b3V0cHV0Um9vdDogYXJndi5vdXRwdXREaXIsXG5cdFx0dXNlQ2FjaGVkOiB0cnVlLFxuXHR9KSlcblx0LnRoZW4oYXN5bmMgKHtcblx0XHRvcHRpb25zLFxuXHRcdGRvd25sb2FkLFxuXHR9KSA9PlxuXHR7XG5cdFx0bGV0IHtcblx0XHRcdGN3ZCxcblx0XHRcdG5vdmVsX2lkLFxuXHRcdFx0SURLRVksXG5cdFx0XHRvdXRwdXREaXIsXG5cdFx0XHRub3ZlbCxcblx0XHRcdC4uLmFyclxuXHRcdH0gPSBhd2FpdCBkb3dubG9hZCgpXG5cdFx0XHQudGFwQ2F0Y2goZSA9PiB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYOS4i+i8ieS+hua6kOaZgueZvOeUn+mMr+iqpGAsIGUpXG5cdFx0XHR9KVxuXHRcdDtcblxuXHRcdGNvbnNvbGUubG9nKGDkvobmupDkuIvovInlrozmiJDvvIzplovlp4vomZXnkIbmjpLniYhgLCBvdXRwdXREaXIpO1xuXG5cdFx0YXdhaXQgaGFuZGxlQXN5bmMoYXJndi5ub3ZlbF9pZCwgSURLRVksIG91dHB1dERpcilcblx0XHRcdC50YXBDYXRjaChlID0+IHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihg6JmV55CG5o6S54mI5pmC55m855Sf6Yyv6KqkYCwgZSlcblx0XHRcdH0pXG5cdFx0O1xuXG5cdFx0Y29uc29sZS5sb2coYOaOkueJiOWujOaIkO+8jOmWi+Wni+aJk+WMhSBlcHViYCk7XG5cblx0XHRsZXQgZXB1YiA9IGF3YWl0IG5vdmVsRXB1Yih7XG5cdFx0XHRpbnB1dFBhdGg6IGN3ZCxcblx0XHRcdG91dHB1dFBhdGg6IGN3ZCxcblx0XHRcdHBhZEVuZERhdGU6IGZhbHNlLFxuXHRcdFx0ZmlsZW5hbWU6IG5vdmVsX2lkLFxuXHRcdFx0Ly9ub0xvZzogdHJ1ZSxcblx0XHRcdGRvd25sb2FkUmVtb3RlRmlsZTogdHJ1ZSxcblx0XHR9KVxuXHRcdFx0LnRhcENhdGNoKGUgPT4ge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGDmiZPljIUgZXB1YiDmmYLnmbznlJ/pjK/oqqRgLCBlKVxuXHRcdFx0fSlcblx0XHQ7XG5cblx0XHQvL2NvbnNvbGUuZGlyKGVwdWIuZmlsZSk7XG5cblx0XHRsZXQgbWFwX2ZpbGUgPSBfX2NhY2hlTWFwRmlsZTtcblxuXHRcdGxldCBtYXA6IElDYWNoZU1hcCA9IGF3YWl0IHJlYWRKU09OKG1hcF9maWxlKVxuXHRcdFx0LmNhdGNoKGUgPT4gKHt9KSlcblx0XHQ7XG5cblx0XHRtYXBbSURLRVldID0gbWFwW0lES0VZXSB8fCB7fTtcblxuXHRcdGxldCBfZGF0YTogSUNhY2hlTWFwUm93ID0ge1xuXHRcdFx0Li4uYXJyLFxuXHRcdFx0Y3dkLFxuXHRcdFx0SURLRVksXG5cdFx0XHRub3ZlbF9pZCxcblx0XHRcdG91dHB1dERpcixcblx0XHRcdGVwdWI6IGVwdWIuZmlsZSxcblx0XHRcdHN0YXR1czogRW51bUNhY2hlTWFwUm93U3RhdHVzLkRPTkUsXG5cdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KCksXG5cdFx0fTtcblxuXHRcdG1hcFtJREtFWV1bbm92ZWxfaWRdID0gbWFwW0lES0VZXVthcmd2Lm5vdmVsX2lkXSA9IF9kYXRhO1xuXG5cdFx0YXdhaXQgb3V0cHV0SlNPTihtYXBfZmlsZSwgbWFwLCB7XG5cdFx0XHRzcGFjZXM6IDIsXG5cdFx0fSlcblxuXHR9KVxuO1xuIl19