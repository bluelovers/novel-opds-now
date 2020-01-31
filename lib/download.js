"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const novel_downloader_cli_1 = require("novel-downloader-cli");
const novel_downloader_1 = require("novel-downloader");
const path_1 = require("path");
const bluebird_1 = __importDefault(require("@bluelovers/fast-glob/bluebird"));
const fs_extra_1 = require("fs-extra");
const const_1 = require("./const");
const bluebird_2 = __importDefault(require("bluebird"));
const tmpDir_1 = __importDefault(require("./tmpDir"));
function downloadInfo(options) {
    let oc = novel_downloader_1.requireNovelSiteClass(options.siteID);
    let { IDKEY } = oc;
    if (options.useCached) {
        try {
            let map = fs_extra_1.readJSONSync(const_1.__cacheMapFile);
            let o2 = map[IDKEY] || map[options.siteID];
            let data = o2[options.novel_id];
            if (!data) {
                let o3 = new oc({
                    pathNovelStyle: true,
                    keepImage: true,
                    keepRuby: true,
                    keepFormat: true,
                    debugLog: true,
                });
                let url_data2 = o3.parseUrl(options.novel_id);
                data = o2[url_data2.novel_id];
            }
            if (data && fs_extra_1.pathExistsSync(path_1.join(data.cwd, '.gitkeep'))) {
                return {
                    ...data,
                    removeCallback() {
                        return fs_extra_1.removeSync(data.outputDir);
                    }
                };
            }
        }
        catch (e) {
        }
    }
    if (!options.outputRoot) {
        options.outputRoot = const_1.OUTPUT_DIR;
    }
    fs_extra_1.ensureDirSync(options.outputRoot);
    let { name: outputDir, removeCallback } = tmpDir_1.default(options.outputRoot);
    let o = new oc({
        outputDir,
        pathNovelStyle: true,
        keepImage: true,
        keepRuby: true,
        keepFormat: true,
        debugLog: true,
    });
    let url_data = o.parseUrl(options.novel_id);
    let cwd = path_1.join(outputDir, IDKEY, url_data.novel_id);
    return {
        outputDir,
        cwd,
        siteID: options.siteID,
        IDKEY,
        novel_id: url_data.novel_id,
        novel_id2: options.novel_id,
        removeCallback() {
            return fs_extra_1.removeSync(outputDir);
        },
        outputRoot: options.outputRoot,
    };
}
exports.downloadInfo = downloadInfo;
function downloadNovel2(options) {
    return bluebird_2.default.resolve()
        .then(() => downloadInfo(options))
        .then(options => {
        return {
            options,
            download() {
                return bluebird_2.default.resolve(downloadNovel(options.novel_id, options.siteID, options.outputDir))
                    .then(value => {
                    return {
                        ...options,
                        ...value,
                    };
                })
                    .tapCatch(e => {
                    return options.removeCallback();
                });
            }
        };
    });
}
exports.downloadNovel2 = downloadNovel2;
async function downloadNovel(novel_id, siteID, outputDir = const_1.OUTPUT_DIR) {
    let oc = novel_downloader_1.requireNovelSiteClass(siteID);
    let { IDKEY } = oc;
    await fs_extra_1.ensureDir(path_1.join(outputDir, IDKEY, String(novel_id)));
    await fs_extra_1.emptyDir(path_1.join(outputDir, IDKEY, String(novel_id)));
    await fs_extra_1.ensureFile(path_1.join(outputDir, IDKEY, String(novel_id), '.gitkeep'));
    let novel = await novel_downloader_cli_1.download(String(novel_id), {
        disableTxtdownload: true,
        keepImage: true,
        keepRuby: true,
        keepFormat: true,
        debugLog: true,
    }, siteID, {
        outputDir,
        pathNovelStyle: true,
        keepImage: true,
        keepRuby: true,
        keepFormat: true,
        debugLog: true,
    });
    let cwd = path_1.join(outputDir, IDKEY, novel.url_data.novel_id);
    await bluebird_1.default([
        '**/*.txt',
    ], {
        cwd,
        absolute: true,
    }).each(async (file) => {
        let st = await fs_extra_1.stat(file);
        if (st.size < 5) {
            return fs_extra_1.remove(file);
        }
    });
    return {
        cwd,
        IDKEY,
        novel_id: novel.url_data.novel_id,
        novel,
    };
}
exports.downloadNovel = downloadNovel;
exports.default = downloadNovel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmxvYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkb3dubG9hZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUlBLCtEQUErQztBQUMvQyx1REFBeUQ7QUFFekQsK0JBQTRCO0FBQzVCLDhFQUFzRDtBQUN0RCx1Q0FVa0I7QUFDbEIsbUNBQXFEO0FBQ3JELHdEQUFnQztBQUNoQyxzREFBOEI7QUFHOUIsU0FBZ0IsWUFBWSxDQUFDLE9BSzVCO0lBRUEsSUFBSSxFQUFFLEdBQUcsd0NBQXFCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9DLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFFbkIsSUFBSSxPQUFPLENBQUMsU0FBUyxFQUNyQjtRQUNDLElBQ0E7WUFDQyxJQUFJLEdBQUcsR0FBYyx1QkFBWSxDQUFDLHNCQUFjLENBQUMsQ0FBQztZQUVsRCxJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMzQyxJQUFJLElBQUksR0FBaUIsRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUU5QyxJQUFJLENBQUMsSUFBSSxFQUNUO2dCQUNDLElBQUksRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDO29CQUVmLGNBQWMsRUFBRSxJQUFJO29CQUNwQixTQUFTLEVBQUUsSUFBSTtvQkFDZixRQUFRLEVBQUUsSUFBSTtvQkFDZCxVQUFVLEVBQUUsSUFBSTtvQkFDaEIsUUFBUSxFQUFFLElBQUk7aUJBQ2QsQ0FBQyxDQUFDO2dCQUVILElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUU5QyxJQUFJLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUM5QjtZQUVELElBQUksSUFBSSxJQUFJLHlCQUFjLENBQUMs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QUM7QUFuREQsc0NBbURDO0FBRUQsa0JBQWUsYUFBYSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8xLzMwLlxuICovXG5cbmltcG9ydCB7IGRvd25sb2FkIH0gZnJvbSBcIm5vdmVsLWRvd25sb2FkZXItY2xpXCJcbmltcG9ydCB7IHJlcXVpcmVOb3ZlbFNpdGVDbGFzcyB9IGZyb20gJ25vdmVsLWRvd25sb2FkZXInO1xuaW1wb3J0IHsgRW51bU5vdmVsU2l0ZUxpc3QgfSBmcm9tICdub3ZlbC1kb3dubG9hZGVyL3NyYy9hbGwnO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IEZhc3RHbG9iIGZyb20gJ0BibHVlbG92ZXJzL2Zhc3QtZ2xvYi9ibHVlYmlyZCc7XG5pbXBvcnQge1xuXHRzdGF0LFxuXHRyZW1vdmUsXG5cdGVtcHR5RGlyLFxuXHRyZWFkSlNPTixcblx0cmVhZEpTT05TeW5jLFxuXHRyZW1vdmVTeW5jLFxuXHRwYXRoRXhpc3RzU3luYyxcblx0ZW5zdXJlRmlsZSxcblx0ZW5zdXJlRGlyLCBlbnN1cmVEaXJTeW5jLFxufSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgeyBPVVRQVVRfRElSLCBfX2NhY2hlTWFwRmlsZSB9IGZyb20gJy4vY29uc3QnO1xuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCB0bXBEaXIgZnJvbSAnLi90bXBEaXInO1xuaW1wb3J0IHsgSUNhY2hlTWFwLCBJQ2FjaGVNYXBSb3csIElEb3dubG9hZEluZm8gfSBmcm9tICcuL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGRvd25sb2FkSW5mbyhvcHRpb25zOiB7XG5cdG5vdmVsX2lkOiBzdHJpbmcgfCBudW1iZXIsXG5cdHNpdGVJRDogc3RyaW5nIHwgRW51bU5vdmVsU2l0ZUxpc3QsXG5cdG91dHB1dFJvb3Q6IHN0cmluZyxcblx0dXNlQ2FjaGVkPzogYm9vbGVhbixcbn0pOiBJRG93bmxvYWRJbmZvXG57XG5cdGxldCBvYyA9IHJlcXVpcmVOb3ZlbFNpdGVDbGFzcyhvcHRpb25zLnNpdGVJRCk7XG5cdGxldCB7IElES0VZIH0gPSBvYztcblxuXHRpZiAob3B0aW9ucy51c2VDYWNoZWQpXG5cdHtcblx0XHR0cnlcblx0XHR7XG5cdFx0XHRsZXQgbWFwOiBJQ2FjaGVNYXAgPSByZWFkSlNPTlN5bmMoX19jYWNoZU1hcEZpbGUpO1xuXG5cdFx0XHRsZXQgbzIgPSBtYXBbSURLRVldIHx8IG1hcFtvcHRpb25zLnNpdGVJRF07XG5cdFx0XHRsZXQgZGF0YTogSUNhY2hlTWFwUm93ID0gbzJbb3B0aW9ucy5ub3ZlbF9pZF07XG5cblx0XHRcdGlmICghZGF0YSlcblx0XHRcdHtcblx0XHRcdFx0bGV0IG8zID0gbmV3IG9jKHtcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0cGF0aE5vdmVsU3R5bGU6IHRydWUsXG5cdFx0XHRcdFx0a2VlcEltYWdlOiB0cnVlLFxuXHRcdFx0XHRcdGtlZXBSdWJ5OiB0cnVlLFxuXHRcdFx0XHRcdGtlZXBGb3JtYXQ6IHRydWUsXG5cdFx0XHRcdFx0ZGVidWdMb2c6IHRydWUsXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGxldCB1cmxfZGF0YTIgPSBvMy5wYXJzZVVybChvcHRpb25zLm5vdmVsX2lkKTtcblxuXHRcdFx0XHRkYXRhID0gbzJbdXJsX2RhdGEyLm5vdmVsX2lkXTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGRhdGEgJiYgcGF0aEV4aXN0c1N5bmMoam9pbihkYXRhLmN3ZCwgJy5naXRrZWVwJykpKVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdC4uLmRhdGEsXG5cdFx0XHRcdFx0cmVtb3ZlQ2FsbGJhY2soKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHJldHVybiByZW1vdmVTeW5jKGRhdGEub3V0cHV0RGlyKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRjYXRjaCAoZSlcblx0XHR7XG5cblx0XHR9XG5cdH1cblxuXHRpZiAoIW9wdGlvbnMub3V0cHV0Um9vdClcblx0e1xuXHRcdG9wdGlvbnMub3V0cHV0Um9vdCA9IE9VVFBVVF9ESVI7XG5cdH1cblxuXHRlbnN1cmVEaXJTeW5jKG9wdGlvbnMub3V0cHV0Um9vdCk7XG5cdGxldCB7IG5hbWU6IG91dHB1dERpciwgcmVtb3ZlQ2FsbGJhY2sgfSA9IHRtcERpcihvcHRpb25zLm91dHB1dFJvb3QpO1xuXG5cdGxldCBvID0gbmV3IG9jKHtcblx0XHRvdXRwdXREaXIsXG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdHBhdGhOb3ZlbFN0eWxlOiB0cnVlLFxuXHRcdGtlZXBJbWFnZTogdHJ1ZSxcblx0XHRrZWVwUnVieTogdHJ1ZSxcblx0XHRrZWVwRm9ybWF0OiB0cnVlLFxuXHRcdGRlYnVnTG9nOiB0cnVlLFxuXHR9KTtcblxuXHRsZXQgdXJsX2RhdGEgPSBvLnBhcnNlVXJsKG9wdGlvbnMubm92ZWxfaWQpO1xuXG5cdGxldCBjd2QgPSBqb2luKG91dHB1dERpciwgSURLRVksIHVybF9kYXRhLm5vdmVsX2lkKTtcblxuXHRyZXR1cm4ge1xuXHRcdG91dHB1dERpcixcblx0XHRjd2QsXG5cdFx0c2l0ZUlEOiBvcHRpb25zLnNpdGVJRCxcblx0XHRJREtFWSxcblx0XHRub3ZlbF9pZDogdXJsX2RhdGEubm92ZWxfaWQgYXMgc3RyaW5nLFxuXHRcdG5vdmVsX2lkMjogb3B0aW9ucy5ub3ZlbF9pZCxcblx0XHRyZW1vdmVDYWxsYmFjaygpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIHJlbW92ZVN5bmMob3V0cHV0RGlyKVxuXHRcdH0sXG5cdFx0b3V0cHV0Um9vdDogb3B0aW9ucy5vdXRwdXRSb290LFxuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkb3dubG9hZE5vdmVsMihvcHRpb25zOiB7XG5cdG5vdmVsX2lkOiBzdHJpbmcgfCBudW1iZXIsXG5cdHNpdGVJRDogc3RyaW5nIHwgRW51bU5vdmVsU2l0ZUxpc3QsXG5cdG91dHB1dFJvb3Q6IHN0cmluZyxcbn0pXG57XG5cdHJldHVybiBCbHVlYmlyZC5yZXNvbHZlKClcblx0XHQudGhlbigoKSA9PiBkb3dubG9hZEluZm8ob3B0aW9ucykpXG5cdFx0LnRoZW4ob3B0aW9ucyA9PiB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRvcHRpb25zLFxuXHRcdFx0XHRkb3dubG9hZCgpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gQmx1ZWJpcmQucmVzb2x2ZShkb3dubG9hZE5vdmVsKG9wdGlvbnMubm92ZWxfaWQsIG9wdGlvbnMuc2l0ZUlELCBvcHRpb25zLm91dHB1dERpcikpXG5cdFx0XHRcdFx0XHQudGhlbih2YWx1ZSA9PiB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRcdFx0Li4ub3B0aW9ucyxcblx0XHRcdFx0XHRcdFx0XHQuLi52YWx1ZSxcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC50YXBDYXRjaChlID0+IHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIG9wdGlvbnMucmVtb3ZlQ2FsbGJhY2soKVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRvd25sb2FkTm92ZWwobm92ZWxfaWQ6IHN0cmluZyB8IG51bWJlciwgc2l0ZUlEOiBzdHJpbmcgfCBFbnVtTm92ZWxTaXRlTGlzdCwgb3V0cHV0RGlyID0gT1VUUFVUX0RJUilcbntcblx0bGV0IG9jID0gcmVxdWlyZU5vdmVsU2l0ZUNsYXNzKHNpdGVJRCk7XG5cdGxldCB7IElES0VZIH0gPSBvYztcblxuXHRhd2FpdCBlbnN1cmVEaXIoam9pbihvdXRwdXREaXIsIElES0VZLCBTdHJpbmcobm92ZWxfaWQpKSk7XG5cdGF3YWl0IGVtcHR5RGlyKGpvaW4ob3V0cHV0RGlyLCBJREtFWSwgU3RyaW5nKG5vdmVsX2lkKSkpO1xuXG5cdGF3YWl0IGVuc3VyZUZpbGUoam9pbihvdXRwdXREaXIsIElES0VZLCBTdHJpbmcobm92ZWxfaWQpLCAnLmdpdGtlZXAnKSk7XG5cblx0bGV0IG5vdmVsID0gYXdhaXQgZG93bmxvYWQoU3RyaW5nKG5vdmVsX2lkKSwge1xuXHRcdGRpc2FibGVUeHRkb3dubG9hZDogdHJ1ZSxcblx0XHQvL2Rpc2FibGVDaGVja0V4aXN0czogdHJ1ZSxcblx0XHRrZWVwSW1hZ2U6IHRydWUsXG5cdFx0a2VlcFJ1Ynk6IHRydWUsXG5cdFx0a2VlcEZvcm1hdDogdHJ1ZSxcblx0XHRkZWJ1Z0xvZzogdHJ1ZSxcblx0fSwgc2l0ZUlEIGFzIEVudW1Ob3ZlbFNpdGVMaXN0LCB7XG5cdFx0b3V0cHV0RGlyLFxuXHRcdHBhdGhOb3ZlbFN0eWxlOiB0cnVlLFxuXHRcdGtlZXBJbWFnZTogdHJ1ZSxcblx0XHRrZWVwUnVieTogdHJ1ZSxcblx0XHRrZWVwRm9ybWF0OiB0cnVlLFxuXHRcdGRlYnVnTG9nOiB0cnVlLFxuXHR9KTtcblxuXHRsZXQgY3dkID0gam9pbihvdXRwdXREaXIsIElES0VZLCBub3ZlbC51cmxfZGF0YS5ub3ZlbF9pZCk7XG5cblx0YXdhaXQgRmFzdEdsb2IoW1xuXHRcdCcqKi8qLnR4dCcsXG5cdF0sIHtcblx0XHRjd2QsXG5cdFx0YWJzb2x1dGU6IHRydWUsXG5cdH0pLmVhY2goYXN5bmMgKGZpbGUpID0+XG5cdHtcblxuXHRcdGxldCBzdCA9IGF3YWl0IHN0YXQoZmlsZSk7XG5cblx0XHRpZiAoc3Quc2l6ZSA8IDUpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIHJlbW92ZShmaWxlKVxuXHRcdH1cblxuXHR9KVxuXG5cdHJldHVybiB7XG5cdFx0Y3dkLFxuXHRcdElES0VZLFxuXHRcdG5vdmVsX2lkOiBub3ZlbC51cmxfZGF0YS5ub3ZlbF9pZCBhcyBzdHJpbmcsXG5cdFx0bm92ZWwsXG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZG93bmxvYWROb3ZlbFxuXG4iXX0=