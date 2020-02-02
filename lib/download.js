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
                let _ok = false;
                if (data.status === 2 && fs_extra_1.pathExistsSync(data.epub)) {
                    _ok = true;
                }
                else if (data.status === 504) {
                    _ok = true;
                }
                if (_ok) {
                    return {
                        ...data,
                        removeCallback() {
                            return fs_extra_1.removeSync(data.outputDir);
                        }
                    };
                }
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
    outputDir = `T:\\cache\\yarn-cache\\tmp\\tmp-18864MCwlTdjLia9p`;
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
        timestamp: Date.now(),
    };
}
exports.downloadInfo = downloadInfo;
function is504(e) {
    if (e.message.includes('504') || e.StatusCode == 504) {
        return true;
    }
    return false;
}
exports.is504 = is504;
function downloadNovel2(options) {
    return bluebird_2.default.resolve()
        .then(() => downloadInfo(options))
        .then(options => {
        return {
            options,
            download() {
                return bluebird_2.default.resolve(downloadNovel(options.novel_id, options.siteID, options.outputDir))
                    .catch(async (e) => {
                    if (is504(e)) {
                        console.dir(e);
                        await bluebird_2.default.delay(5000);
                        return downloadNovel(options.novel_id, options.siteID, options.outputDir);
                    }
                    return Promise.reject(e);
                })
                    .tapCatch(e => {
                    if (is504(e)) {
                        e.StatusCode = 504;
                        e.options = options;
                    }
                })
                    .then(value => {
                    return {
                        ...options,
                        ...value,
                    };
                })
                    .tapCatch(async (e) => {
                    if (is504(e)) {
                        let map_file = const_1.__cacheMapFile;
                        let map = await fs_extra_1.readJSON(map_file)
                            .catch(e => ({}));
                        map[options.siteID] = map[options.siteID] || {};
                        if (!map[options.siteID][options.novel_id] || map[options.siteID][options.novel_id].status !== 2) {
                            map[options.siteID][options.novel_id] = {
                                outputRoot: options.outputDir,
                                ...map[options.siteID][options.novel_id],
                                ...options,
                                ...e.options,
                                status: 504,
                                timestamp: Date.now(),
                            };
                            delete map[options.siteID][options.novel_id].removeCallback;
                            await fs_extra_1.writeJSON(map_file, map, {
                                spaces: 2,
                            });
                        }
                        return;
                    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmxvYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkb3dubG9hZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUlBLCtEQUErQztBQUMvQyx1REFBeUQ7QUFFekQsK0JBQTRCO0FBQzVCLDhFQUFzRDtBQUN0RCx1Q0FXa0I7QUFDbEIsbUNBQXFEO0FBQ3JELHdEQUFnQztBQUNoQyxzREFBOEI7QUFHOUIsU0FBZ0IsWUFBWSxDQUFDLE9BSzVCO0lBRUEsSUFBSSxFQUFFLEdBQUcsd0NBQXFCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9DLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFFbkIsSUFBSSxPQUFPLENBQUMsU0FBUyxFQUNyQjtRQUNDLElBQ0E7WUFDQyxJQUFJLEdBQUcsR0FBYyx1QkFBWSxDQUFDLHNCQUFjLENBQUMsQ0FBQztZQUVsRCxJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMzQyxJQUFJLElBQUksR0FBaUIsRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUU5QyxJQUFJLENBQUMsSUFBSSxFQUNUO2dCQUNDLElBQUksRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDO29CQUVmLGNBQWMsRUFBRSxJQUFJO29CQUNwQixTQUFTLEVBQUUsSUFBSTtvQkFDZixRQUFRLEVBQUUsSUFBSTtvQkFDZCxVQUFVLEVBQUUsSUFBSTtvQkFDaEIsUUFBUSxFQUFFLElBQUk7aUJBQ2QsQ0FBQyxDQUFDO2dCQUVILElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUU5QyxJQUFJLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUM5QjtZQUVELElBQUksSUFBSSxJQUFJLHlCQUFjLENBQUMs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QUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzEvMzAuXG4gKi9cblxuaW1wb3J0IHsgZG93bmxvYWQgfSBmcm9tIFwibm92ZWwtZG93bmxvYWRlci1jbGlcIlxuaW1wb3J0IHsgcmVxdWlyZU5vdmVsU2l0ZUNsYXNzIH0gZnJvbSAnbm92ZWwtZG93bmxvYWRlcic7XG5pbXBvcnQgeyBFbnVtTm92ZWxTaXRlTGlzdCB9IGZyb20gJ25vdmVsLWRvd25sb2FkZXIvc3JjL2FsbCc7XG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgRmFzdEdsb2IgZnJvbSAnQGJsdWVsb3ZlcnMvZmFzdC1nbG9iL2JsdWViaXJkJztcbmltcG9ydCB7XG5cdHN0YXQsXG5cdHJlbW92ZSxcblx0cmVhZEpTT05TeW5jLFxuXHRyZW1vdmVTeW5jLFxuXHRwYXRoRXhpc3RzU3luYyxcblx0ZW5zdXJlRmlsZSxcblx0ZW5zdXJlRGlyLFxuXHRlbnN1cmVEaXJTeW5jLFxuXHRyZWFkSlNPTixcblx0d3JpdGVKU09OLFxufSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgeyBPVVRQVVRfRElSLCBfX2NhY2hlTWFwRmlsZSB9IGZyb20gJy4vY29uc3QnO1xuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCB0bXBEaXIgZnJvbSAnLi90bXBEaXInO1xuaW1wb3J0IHsgSUNhY2hlTWFwLCBJQ2FjaGVNYXBSb3csIElEb3dubG9hZEluZm8sIEVudW1DYWNoZU1hcFJvd1N0YXR1cyB9IGZyb20gJy4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gZG93bmxvYWRJbmZvKG9wdGlvbnM6IHtcblx0bm92ZWxfaWQ6IHN0cmluZyB8IG51bWJlcixcblx0c2l0ZUlEOiBzdHJpbmcgfCBFbnVtTm92ZWxTaXRlTGlzdCxcblx0b3V0cHV0Um9vdDogc3RyaW5nLFxuXHR1c2VDYWNoZWQ/OiBib29sZWFuLFxufSk6IElEb3dubG9hZEluZm9cbntcblx0bGV0IG9jID0gcmVxdWlyZU5vdmVsU2l0ZUNsYXNzKG9wdGlvbnMuc2l0ZUlEKTtcblx0bGV0IHsgSURLRVkgfSA9IG9jO1xuXG5cdGlmIChvcHRpb25zLnVzZUNhY2hlZClcblx0e1xuXHRcdHRyeVxuXHRcdHtcblx0XHRcdGxldCBtYXA6IElDYWNoZU1hcCA9IHJlYWRKU09OU3luYyhfX2NhY2hlTWFwRmlsZSk7XG5cblx0XHRcdGxldCBvMiA9IG1hcFtJREtFWV0gfHwgbWFwW29wdGlvbnMuc2l0ZUlEXTtcblx0XHRcdGxldCBkYXRhOiBJQ2FjaGVNYXBSb3cgPSBvMltvcHRpb25zLm5vdmVsX2lkXTtcblxuXHRcdFx0aWYgKCFkYXRhKVxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgbzMgPSBuZXcgb2Moe1xuXHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRwYXRoTm92ZWxTdHlsZTogdHJ1ZSxcblx0XHRcdFx0XHRrZWVwSW1hZ2U6IHRydWUsXG5cdFx0XHRcdFx0a2VlcFJ1Ynk6IHRydWUsXG5cdFx0XHRcdFx0a2VlcEZvcm1hdDogdHJ1ZSxcblx0XHRcdFx0XHRkZWJ1Z0xvZzogdHJ1ZSxcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0bGV0IHVybF9kYXRhMiA9IG8zLnBhcnNlVXJsKG9wdGlvbnMubm92ZWxfaWQpO1xuXG5cdFx0XHRcdGRhdGEgPSBvMlt1cmxfZGF0YTIubm92ZWxfaWRdO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZGF0YSAmJiBwYXRoRXhpc3RzU3luYyhqb2luKGRhdGEuY3dkLCAnLmdpdGtlZXAnKSkpXG5cdFx0XHR7XG5cdFx0XHRcdGxldCBfb2sgPSBmYWxzZTtcblxuXHRcdFx0XHRpZiAoZGF0YS5zdGF0dXMgPT09IEVudW1DYWNoZU1hcFJvd1N0YXR1cy5ET05FICYmIHBhdGhFeGlzdHNTeW5jKGRhdGEuZXB1YikpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRfb2sgPSB0cnVlXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoZGF0YS5zdGF0dXMgPT09IEVudW1DYWNoZU1hcFJvd1N0YXR1cy5XQUlUSU5HX1JFVFJZKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0X29rID0gdHJ1ZVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKF9vaylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHQuLi5kYXRhLFxuXHRcdFx0XHRcdFx0cmVtb3ZlQ2FsbGJhY2soKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcmVtb3ZlU3luYyhkYXRhLm91dHB1dERpcilcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0Y2F0Y2ggKGUpXG5cdFx0e1xuXG5cdFx0fVxuXHR9XG5cblx0aWYgKCFvcHRpb25zLm91dHB1dFJvb3QpXG5cdHtcblx0XHRvcHRpb25zLm91dHB1dFJvb3QgPSBPVVRQVVRfRElSO1xuXHR9XG5cblx0ZW5zdXJlRGlyU3luYyhvcHRpb25zLm91dHB1dFJvb3QpO1xuXHRsZXQgeyBuYW1lOiBvdXRwdXREaXIsIHJlbW92ZUNhbGxiYWNrIH0gPSB0bXBEaXIob3B0aW9ucy5vdXRwdXRSb290KTtcblx0b3V0cHV0RGlyID0gYFQ6XFxcXGNhY2hlXFxcXHlhcm4tY2FjaGVcXFxcdG1wXFxcXHRtcC0xODg2NE1Dd2xUZGpMaWE5cGA7XG5cblx0bGV0IG8gPSBuZXcgb2Moe1xuXHRcdG91dHB1dERpcixcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0cGF0aE5vdmVsU3R5bGU6IHRydWUsXG5cdFx0a2VlcEltYWdlOiB0cnVlLFxuXHRcdGtlZXBSdWJ5OiB0cnVlLFxuXHRcdGtlZXBGb3JtYXQ6IHRydWUsXG5cdFx0ZGVidWdMb2c6IHRydWUsXG5cdH0pO1xuXG5cdGxldCB1cmxfZGF0YSA9IG8ucGFyc2VVcmwob3B0aW9ucy5ub3ZlbF9pZCk7XG5cblx0bGV0IGN3ZCA9IGpvaW4ob3V0cHV0RGlyLCBJREtFWSwgdXJsX2RhdGEubm92ZWxfaWQpO1xuXG5cdHJldHVybiB7XG5cdFx0b3V0cHV0RGlyLFxuXHRcdGN3ZCxcblx0XHRzaXRlSUQ6IG9wdGlvbnMuc2l0ZUlELFxuXHRcdElES0VZLFxuXHRcdG5vdmVsX2lkOiB1cmxfZGF0YS5ub3ZlbF9pZCBhcyBzdHJpbmcsXG5cdFx0bm92ZWxfaWQyOiBvcHRpb25zLm5vdmVsX2lkLFxuXHRcdHJlbW92ZUNhbGxiYWNrKClcblx0XHR7XG5cdFx0XHRyZXR1cm4gcmVtb3ZlU3luYyhvdXRwdXREaXIpXG5cdFx0fSxcblx0XHRvdXRwdXRSb290OiBvcHRpb25zLm91dHB1dFJvb3QsXG5cdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpLFxuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpczUwNDxFIGV4dGVuZHMgRXJyb3I+KGU6IEUpXG57XG5cdC8vIEB0cy1pZ25vcmVcblx0aWYgKGUubWVzc2FnZS5pbmNsdWRlcygnNTA0JykgfHwgZS5TdGF0dXNDb2RlID09IDUwNClcblx0e1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0cmV0dXJuIGZhbHNlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkb3dubG9hZE5vdmVsMihvcHRpb25zOiB7XG5cdG5vdmVsX2lkOiBzdHJpbmcgfCBudW1iZXIsXG5cdHNpdGVJRDogc3RyaW5nIHwgRW51bU5vdmVsU2l0ZUxpc3QsXG5cdG91dHB1dFJvb3Q6IHN0cmluZyxcblx0dXNlQ2FjaGVkPzogYm9vbGVhbixcbn0pXG57XG5cdHJldHVybiBCbHVlYmlyZC5yZXNvbHZlKClcblx0XHQudGhlbigoKSA9PiBkb3dubG9hZEluZm8ob3B0aW9ucykpXG5cdFx0LnRoZW4ob3B0aW9ucyA9PiB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRvcHRpb25zLFxuXHRcdFx0XHRkb3dubG9hZCgpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gQmx1ZWJpcmQucmVzb2x2ZShkb3dubG9hZE5vdmVsKG9wdGlvbnMubm92ZWxfaWQsIG9wdGlvbnMuc2l0ZUlELCBvcHRpb25zLm91dHB1dERpcikpXG5cdFx0XHRcdFx0XHQuY2F0Y2goYXN5bmMgKGUpID0+IHtcblx0XHRcdFx0XHRcdFx0aWYgKGlzNTA0KGUpKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5kaXIoZSk7XG5cblx0XHRcdFx0XHRcdFx0XHRhd2FpdCBCbHVlYmlyZC5kZWxheSg1MDAwKTtcblxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBkb3dubG9hZE5vdmVsKG9wdGlvbnMubm92ZWxfaWQsIG9wdGlvbnMuc2l0ZUlELCBvcHRpb25zLm91dHB1dERpcilcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlKVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC50YXBDYXRjaChlID0+IHtcblx0XHRcdFx0XHRcdFx0aWYgKGlzNTA0KGUpKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0ZS5TdGF0dXNDb2RlID0gNTA0O1xuXHRcdFx0XHRcdFx0XHRcdGUub3B0aW9ucyA9IG9wdGlvbnM7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQudGhlbih2YWx1ZSA9PiB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRcdFx0Li4ub3B0aW9ucyxcblx0XHRcdFx0XHRcdFx0XHQuLi52YWx1ZSxcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC50YXBDYXRjaChhc3luYyAoZSkgPT4ge1xuXG5cdFx0XHRcdFx0XHRcdGlmIChpczUwNChlKSlcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGxldCBtYXBfZmlsZSA9IF9fY2FjaGVNYXBGaWxlO1xuXG5cdFx0XHRcdFx0XHRcdFx0bGV0IG1hcDogSUNhY2hlTWFwID0gYXdhaXQgcmVhZEpTT04obWFwX2ZpbGUpXG5cdFx0XHRcdFx0XHRcdFx0XHQuY2F0Y2goZSA9PiAoe30pKVxuXHRcdFx0XHRcdFx0XHRcdDtcblxuXHRcdFx0XHRcdFx0XHRcdG1hcFtvcHRpb25zLnNpdGVJRF0gPSBtYXBbb3B0aW9ucy5zaXRlSURdIHx8IHt9O1xuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFtYXBbb3B0aW9ucy5zaXRlSURdW29wdGlvbnMubm92ZWxfaWRdIHx8IG1hcFtvcHRpb25zLnNpdGVJRF1bb3B0aW9ucy5ub3ZlbF9pZF0uc3RhdHVzICE9PSBFbnVtQ2FjaGVNYXBSb3dTdGF0dXMuRE9ORSlcblx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRtYXBbb3B0aW9ucy5zaXRlSURdW29wdGlvbnMubm92ZWxfaWRdID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRvdXRwdXRSb290OiBvcHRpb25zLm91dHB1dERpcixcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC4uLm1hcFtvcHRpb25zLnNpdGVJRF1bb3B0aW9ucy5ub3ZlbF9pZF0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC4uLm9wdGlvbnMsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC4uLmUub3B0aW9ucyxcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IEVudW1DYWNoZU1hcFJvd1N0YXR1cy5XQUlUSU5HX1JFVFJZLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KCksXG5cdFx0XHRcdFx0XHRcdFx0XHR9IGFzIGFueTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIG1hcFtvcHRpb25zLnNpdGVJRF1bb3B0aW9ucy5ub3ZlbF9pZF0ucmVtb3ZlQ2FsbGJhY2s7XG5cblx0XHRcdFx0XHRcdFx0XHRcdGF3YWl0IHdyaXRlSlNPTihtYXBfZmlsZSwgbWFwLCB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHNwYWNlczogMixcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdHJldHVybiBvcHRpb25zLnJlbW92ZUNhbGxiYWNrKClcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkb3dubG9hZE5vdmVsKG5vdmVsX2lkOiBzdHJpbmcgfCBudW1iZXIsIHNpdGVJRDogc3RyaW5nIHwgRW51bU5vdmVsU2l0ZUxpc3QsIG91dHB1dERpciA9IE9VVFBVVF9ESVIpXG57XG5cdGxldCBvYyA9IHJlcXVpcmVOb3ZlbFNpdGVDbGFzcyhzaXRlSUQpO1xuXHRsZXQgeyBJREtFWSB9ID0gb2M7XG5cblx0YXdhaXQgZW5zdXJlRGlyKGpvaW4ob3V0cHV0RGlyLCBJREtFWSwgU3RyaW5nKG5vdmVsX2lkKSkpO1xuXHQvL2F3YWl0IGVtcHR5RGlyKGpvaW4ob3V0cHV0RGlyLCBJREtFWSwgU3RyaW5nKG5vdmVsX2lkKSkpO1xuXG5cdGF3YWl0IGVuc3VyZUZpbGUoam9pbihvdXRwdXREaXIsIElES0VZLCBTdHJpbmcobm92ZWxfaWQpLCAnLmdpdGtlZXAnKSk7XG5cblx0bGV0IG5vdmVsID0gYXdhaXQgZG93bmxvYWQoU3RyaW5nKG5vdmVsX2lkKSwge1xuXHRcdGRpc2FibGVUeHRkb3dubG9hZDogdHJ1ZSxcblx0XHQvL2Rpc2FibGVDaGVja0V4aXN0czogdHJ1ZSxcblx0XHRrZWVwSW1hZ2U6IHRydWUsXG5cdFx0a2VlcFJ1Ynk6IHRydWUsXG5cdFx0a2VlcEZvcm1hdDogdHJ1ZSxcblx0XHRkZWJ1Z0xvZzogdHJ1ZSxcblx0fSwgc2l0ZUlEIGFzIEVudW1Ob3ZlbFNpdGVMaXN0LCB7XG5cdFx0b3V0cHV0RGlyLFxuXHRcdHBhdGhOb3ZlbFN0eWxlOiB0cnVlLFxuXHRcdGtlZXBJbWFnZTogdHJ1ZSxcblx0XHRrZWVwUnVieTogdHJ1ZSxcblx0XHRrZWVwRm9ybWF0OiB0cnVlLFxuXHRcdGRlYnVnTG9nOiB0cnVlLFxuXHR9KTtcblxuXHRsZXQgY3dkID0gam9pbihvdXRwdXREaXIsIElES0VZLCBub3ZlbC51cmxfZGF0YS5ub3ZlbF9pZCk7XG5cblx0YXdhaXQgRmFzdEdsb2IoW1xuXHRcdCcqKi8qLnR4dCcsXG5cdF0sIHtcblx0XHRjd2QsXG5cdFx0YWJzb2x1dGU6IHRydWUsXG5cdH0pLmVhY2goYXN5bmMgKGZpbGUpID0+XG5cdHtcblxuXHRcdGxldCBzdCA9IGF3YWl0IHN0YXQoZmlsZSk7XG5cblx0XHRpZiAoc3Quc2l6ZSA8IDUpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIHJlbW92ZShmaWxlKVxuXHRcdH1cblxuXHR9KVxuXG5cdHJldHVybiB7XG5cdFx0Y3dkLFxuXHRcdElES0VZLFxuXHRcdG5vdmVsX2lkOiBub3ZlbC51cmxfZGF0YS5ub3ZlbF9pZCBhcyBzdHJpbmcsXG5cdFx0bm92ZWwsXG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZG93bmxvYWROb3ZlbFxuXG4iXX0=