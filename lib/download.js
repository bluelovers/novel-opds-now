"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const novel_downloader_cli_1 = require("novel-downloader-cli");
const all_1 = require("novel-downloader/src/all");
const path_1 = require("path");
const bluebird_1 = __importDefault(require("@bluelovers/fast-glob/bluebird"));
const fs_extra_1 = require("fs-extra");
const const_1 = require("./const");
const bluebird_2 = __importDefault(require("bluebird"));
const tmpDir_1 = __importDefault(require("./tmpDir"));
const util_1 = require("novel-downloader/src/all/util");
const logger_1 = __importDefault(require("debug-color2/logger"));
function downloadInfo(options) {
    let IDKEY = util_1.siteID2IDKEY(options.siteID);
    if (options.useCached) {
        try {
            let map = fs_extra_1.readJSONSync(const_1.__cacheMapFile);
            let o2 = map[IDKEY];
            let data = o2[options.novel_id];
            if (!data) {
                let oc = all_1.requireNovelSiteClass(options.siteID);
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
    let oc = all_1.requireNovelSiteClass(options.siteID);
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
        const { IDKEY } = options;
        return {
            options,
            download() {
                return bluebird_2.default.resolve(downloadNovel(options.novel_id, options.siteID, options.outputDir))
                    .catch(async (e) => {
                    if (is504(e)) {
                        logger_1.default.dir(e);
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
                        let _data = map[IDKEY] = map[IDKEY] || {};
                        if (!_data[options.novel_id] || _data[options.novel_id].status !== 2) {
                            _data[options.novel_id] = {
                                outputRoot: options.outputDir,
                                ..._data[options.novel_id],
                                ...options,
                                ...e.options,
                                status: 504,
                                timestamp: Date.now(),
                            };
                            delete _data[options.novel_id].removeCallback;
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
    let IDKEY = util_1.siteID2IDKEY(siteID);
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
        if (st.size < 1) {
            logger_1.default.warn(`${path_1.relative(cwd, file)} 此檔案沒有內容，進行刪除...`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmxvYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkb3dubG9hZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUlBLCtEQUErQztBQUMvQyxrREFBaUU7QUFFakUsK0JBQXNDO0FBQ3RDLDhFQUFzRDtBQUN0RCx1Q0FXa0I7QUFDbEIsbUNBQXFEO0FBQ3JELHdEQUFnQztBQUNoQyxzREFBOEI7QUFFOUIsd0RBQTZEO0FBQzdELGlFQUEwQztBQUUxQyxTQUFnQixZQUFZLENBQUMsT0FLNUI7SUFFQSxJQUFJLEtBQUssR0FBRyxtQkFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUV6QyxJQUFJLE9BQU8sQ0FBQyxTQUFTLEVBQ3JCO1FBQ0MsSUFDQTtZQUNDLElBQUksR0FBRyxHQUFjLHVCQUFZLENBQUMsc0JBQWMsQ0FBQyxDQUFDO1lBRWxELElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQixJQUFJLElBQUksR0FBaUIsRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUU5QyxJQUFJLENBQUMsSUFBSSxFQUNUO2dCQUNDLElBQUksRUFBRSxHQUFHLDJCQUFxQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFFL0MsSUFBSSxFQUFFLEdBQUcsSUFBSSxFQUFFLENBQUM7b0JBRWYsY0FBYyxFQUFFLElBQUk7b0JBQ3BCLFNBQVMsRUFBRSxJQUFJO29CQUNmLFFBQVEsRUFBRSxJQUFJO29CQUNkLFVBQVUsRUFBRSxJQUFJO29CQUNoQixRQUFRLEVBQUUsSUFBSTtpQkFDZCxDQUFDLENBQUM7Z0JBRUgsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRTlDLElBQUksR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQzlCO1lBRUQsSUFBSSxJQUFJLElBQUkseUJB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b250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMjAvMS8zMC5cbiAqL1xuXG5pbXBvcnQgeyBkb3dubG9hZCB9IGZyb20gXCJub3ZlbC1kb3dubG9hZGVyLWNsaVwiXG5pbXBvcnQgeyByZXF1aXJlTm92ZWxTaXRlQ2xhc3MgfSBmcm9tICdub3ZlbC1kb3dubG9hZGVyL3NyYy9hbGwnO1xuaW1wb3J0IHsgRW51bU5vdmVsU2l0ZUxpc3QgfSBmcm9tICdub3ZlbC1kb3dubG9hZGVyL3NyYy9hbGwvY29uc3QnO1xuaW1wb3J0IHsgam9pbiwgcmVsYXRpdmUgfSBmcm9tICdwYXRoJztcbmltcG9ydCBGYXN0R2xvYiBmcm9tICdAYmx1ZWxvdmVycy9mYXN0LWdsb2IvYmx1ZWJpcmQnO1xuaW1wb3J0IHtcblx0c3RhdCxcblx0cmVtb3ZlLFxuXHRyZWFkSlNPTlN5bmMsXG5cdHJlbW92ZVN5bmMsXG5cdHBhdGhFeGlzdHNTeW5jLFxuXHRlbnN1cmVGaWxlLFxuXHRlbnN1cmVEaXIsXG5cdGVuc3VyZURpclN5bmMsXG5cdHJlYWRKU09OLFxuXHR3cml0ZUpTT04sXG59IGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCB7IE9VVFBVVF9ESVIsIF9fY2FjaGVNYXBGaWxlIH0gZnJvbSAnLi9jb25zdCc7XG5pbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHRtcERpciBmcm9tICcuL3RtcERpcic7XG5pbXBvcnQgeyBJQ2FjaGVNYXAsIElDYWNoZU1hcFJvdywgSURvd25sb2FkSW5mbywgRW51bUNhY2hlTWFwUm93U3RhdHVzIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBzaXRlSUQySURLRVkgfSBmcm9tICdub3ZlbC1kb3dubG9hZGVyL3NyYy9hbGwvdXRpbCc7XG5pbXBvcnQgY29uc29sZSBmcm9tICdkZWJ1Zy1jb2xvcjIvbG9nZ2VyJztcblxuZXhwb3J0IGZ1bmN0aW9uIGRvd25sb2FkSW5mbyhvcHRpb25zOiB7XG5cdG5vdmVsX2lkOiBzdHJpbmcgfCBudW1iZXIsXG5cdHNpdGVJRDogc3RyaW5nIHwgRW51bU5vdmVsU2l0ZUxpc3QsXG5cdG91dHB1dFJvb3Q6IHN0cmluZyxcblx0dXNlQ2FjaGVkPzogYm9vbGVhbixcbn0pOiBJRG93bmxvYWRJbmZvXG57XG5cdGxldCBJREtFWSA9IHNpdGVJRDJJREtFWShvcHRpb25zLnNpdGVJRCk7XG5cblx0aWYgKG9wdGlvbnMudXNlQ2FjaGVkKVxuXHR7XG5cdFx0dHJ5XG5cdFx0e1xuXHRcdFx0bGV0IG1hcDogSUNhY2hlTWFwID0gcmVhZEpTT05TeW5jKF9fY2FjaGVNYXBGaWxlKTtcblxuXHRcdFx0bGV0IG8yID0gbWFwW0lES0VZXTtcblx0XHRcdGxldCBkYXRhOiBJQ2FjaGVNYXBSb3cgPSBvMltvcHRpb25zLm5vdmVsX2lkXTtcblxuXHRcdFx0aWYgKCFkYXRhKVxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgb2MgPSByZXF1aXJlTm92ZWxTaXRlQ2xhc3Mob3B0aW9ucy5zaXRlSUQpO1xuXG5cdFx0XHRcdGxldCBvMyA9IG5ldyBvYyh7XG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdHBhdGhOb3ZlbFN0eWxlOiB0cnVlLFxuXHRcdFx0XHRcdGtlZXBJbWFnZTogdHJ1ZSxcblx0XHRcdFx0XHRrZWVwUnVieTogdHJ1ZSxcblx0XHRcdFx0XHRrZWVwRm9ybWF0OiB0cnVlLFxuXHRcdFx0XHRcdGRlYnVnTG9nOiB0cnVlLFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRsZXQgdXJsX2RhdGEyID0gbzMucGFyc2VVcmwob3B0aW9ucy5ub3ZlbF9pZCk7XG5cblx0XHRcdFx0ZGF0YSA9IG8yW3VybF9kYXRhMi5ub3ZlbF9pZF07XG5cdFx0XHR9XG5cblx0XHRcdGlmIChkYXRhICYmIHBhdGhFeGlzdHNTeW5jKGpvaW4oZGF0YS5jd2QsICcuZ2l0a2VlcCcpKSlcblx0XHRcdHtcblx0XHRcdFx0bGV0IF9vayA9IGZhbHNlO1xuXG5cdFx0XHRcdGlmIChkYXRhLnN0YXR1cyA9PT0gRW51bUNhY2hlTWFwUm93U3RhdHVzLkRPTkUgJiYgcGF0aEV4aXN0c1N5bmMoZGF0YS5lcHViKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdF9vayA9IHRydWVcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmIChkYXRhLnN0YXR1cyA9PT0gRW51bUNhY2hlTWFwUm93U3RhdHVzLldBSVRJTkdfUkVUUlkpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRfb2sgPSB0cnVlXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoX29rKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdC4uLmRhdGEsXG5cdFx0XHRcdFx0XHRyZW1vdmVDYWxsYmFjaygpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHJldHVybiByZW1vdmVTeW5jKGRhdGEub3V0cHV0RGlyKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRjYXRjaCAoZSlcblx0XHR7XG5cblx0XHR9XG5cdH1cblxuXHRpZiAoIW9wdGlvbnMub3V0cHV0Um9vdClcblx0e1xuXHRcdG9wdGlvbnMub3V0cHV0Um9vdCA9IE9VVFBVVF9ESVI7XG5cdH1cblxuXHRlbnN1cmVEaXJTeW5jKG9wdGlvbnMub3V0cHV0Um9vdCk7XG5cdGxldCB7IG5hbWU6IG91dHB1dERpciwgcmVtb3ZlQ2FsbGJhY2sgfSA9IHRtcERpcihvcHRpb25zLm91dHB1dFJvb3QpO1xuXG5cdGxldCBvYyA9IHJlcXVpcmVOb3ZlbFNpdGVDbGFzcyhvcHRpb25zLnNpdGVJRCk7XG5cblx0bGV0IG8gPSBuZXcgb2Moe1xuXHRcdG91dHB1dERpcixcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0cGF0aE5vdmVsU3R5bGU6IHRydWUsXG5cdFx0a2VlcEltYWdlOiB0cnVlLFxuXHRcdGtlZXBSdWJ5OiB0cnVlLFxuXHRcdGtlZXBGb3JtYXQ6IHRydWUsXG5cdFx0ZGVidWdMb2c6IHRydWUsXG5cdH0pO1xuXG5cdGxldCB1cmxfZGF0YSA9IG8ucGFyc2VVcmwob3B0aW9ucy5ub3ZlbF9pZCk7XG5cblx0bGV0IGN3ZCA9IGpvaW4ob3V0cHV0RGlyLCBJREtFWSwgdXJsX2RhdGEubm92ZWxfaWQpO1xuXG5cdHJldHVybiB7XG5cdFx0b3V0cHV0RGlyLFxuXHRcdGN3ZCxcblx0XHRzaXRlSUQ6IG9wdGlvbnMuc2l0ZUlELFxuXHRcdElES0VZLFxuXHRcdG5vdmVsX2lkOiB1cmxfZGF0YS5ub3ZlbF9pZCBhcyBzdHJpbmcsXG5cdFx0bm92ZWxfaWQyOiBvcHRpb25zLm5vdmVsX2lkLFxuXHRcdHJlbW92ZUNhbGxiYWNrKClcblx0XHR7XG5cdFx0XHRyZXR1cm4gcmVtb3ZlU3luYyhvdXRwdXREaXIpXG5cdFx0fSxcblx0XHRvdXRwdXRSb290OiBvcHRpb25zLm91dHB1dFJvb3QsXG5cdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpLFxuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpczUwNDxFIGV4dGVuZHMgRXJyb3I+KGU6IEUpXG57XG5cdC8vIEB0cy1pZ25vcmVcblx0aWYgKGUubWVzc2FnZS5pbmNsdWRlcygnNTA0JykgfHwgZS5TdGF0dXNDb2RlID09IDUwNClcblx0e1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0cmV0dXJuIGZhbHNlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkb3dubG9hZE5vdmVsMihvcHRpb25zOiB7XG5cdG5vdmVsX2lkOiBzdHJpbmcgfCBudW1iZXIsXG5cdHNpdGVJRDogc3RyaW5nIHwgRW51bU5vdmVsU2l0ZUxpc3QsXG5cdG91dHB1dFJvb3Q6IHN0cmluZyxcblx0dXNlQ2FjaGVkPzogYm9vbGVhbixcbn0pXG57XG5cdHJldHVybiBCbHVlYmlyZC5yZXNvbHZlKClcblx0XHQudGhlbigoKSA9PiBkb3dubG9hZEluZm8ob3B0aW9ucykpXG5cdFx0LnRoZW4ob3B0aW9ucyA9PiB7XG5cblx0XHRcdGNvbnN0IHsgSURLRVkgfSA9IG9wdGlvbnM7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdG9wdGlvbnMsXG5cdFx0XHRcdGRvd25sb2FkKClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiBCbHVlYmlyZC5yZXNvbHZlKGRvd25sb2FkTm92ZWwob3B0aW9ucy5ub3ZlbF9pZCwgb3B0aW9ucy5zaXRlSUQsIG9wdGlvbnMub3V0cHV0RGlyKSlcblx0XHRcdFx0XHRcdC5jYXRjaChhc3luYyAoZSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAoaXM1MDQoZSkpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmRpcihlKTtcblxuXHRcdFx0XHRcdFx0XHRcdGF3YWl0IEJsdWViaXJkLmRlbGF5KDUwMDApO1xuXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGRvd25sb2FkTm92ZWwob3B0aW9ucy5ub3ZlbF9pZCwgb3B0aW9ucy5zaXRlSUQsIG9wdGlvbnMub3V0cHV0RGlyKVxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGUpXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnRhcENhdGNoKGUgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAoaXM1MDQoZSkpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRlLlN0YXR1c0NvZGUgPSA1MDQ7XG5cdFx0XHRcdFx0XHRcdFx0ZS5vcHRpb25zID0gb3B0aW9ucztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC50aGVuKHZhbHVlID0+IHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0XHQuLi5vcHRpb25zLFxuXHRcdFx0XHRcdFx0XHRcdC4uLnZhbHVlLFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnRhcENhdGNoKGFzeW5jIChlKSA9PiB7XG5cblx0XHRcdFx0XHRcdFx0aWYgKGlzNTA0KGUpKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0bGV0IG1hcF9maWxlID0gX19jYWNoZU1hcEZpbGU7XG5cblx0XHRcdFx0XHRcdFx0XHRsZXQgbWFwOiBJQ2FjaGVNYXAgPSBhd2FpdCByZWFkSlNPTihtYXBfZmlsZSlcblx0XHRcdFx0XHRcdFx0XHRcdC5jYXRjaChlID0+ICh7fSkpXG5cdFx0XHRcdFx0XHRcdFx0O1xuXG5cdFx0XHRcdFx0XHRcdFx0bGV0IF9kYXRhID0gbWFwW0lES0VZXSA9IG1hcFtJREtFWV0gfHwge307XG5cblx0XHRcdFx0XHRcdFx0XHRpZiAoIV9kYXRhW29wdGlvbnMubm92ZWxfaWRdIHx8IF9kYXRhW29wdGlvbnMubm92ZWxfaWRdLnN0YXR1cyAhPT0gRW51bUNhY2hlTWFwUm93U3RhdHVzLkRPTkUpXG5cdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0X2RhdGFbb3B0aW9ucy5ub3ZlbF9pZF0gPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG91dHB1dFJvb3Q6IG9wdGlvbnMub3V0cHV0RGlyLFxuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdFx0XHRcdFx0Li4uX2RhdGFbb3B0aW9ucy5ub3ZlbF9pZF0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC4uLm9wdGlvbnMsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC4uLmUub3B0aW9ucyxcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IEVudW1DYWNoZU1hcFJvd1N0YXR1cy5XQUlUSU5HX1JFVFJZLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KCksXG5cdFx0XHRcdFx0XHRcdFx0XHR9IGFzIGFueTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIF9kYXRhW29wdGlvbnMubm92ZWxfaWRdLnJlbW92ZUNhbGxiYWNrO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRhd2FpdCB3cml0ZUpTT04obWFwX2ZpbGUsIG1hcCwge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRzcGFjZXM6IDIsXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy5yZW1vdmVDYWxsYmFjaygpXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZG93bmxvYWROb3ZlbChub3ZlbF9pZDogc3RyaW5nIHwgbnVtYmVyLCBzaXRlSUQ6IHN0cmluZyB8IEVudW1Ob3ZlbFNpdGVMaXN0LCBvdXRwdXREaXIgPSBPVVRQVVRfRElSKVxue1xuXHRsZXQgSURLRVkgPSBzaXRlSUQySURLRVkoc2l0ZUlEKTtcblxuXHRhd2FpdCBlbnN1cmVEaXIoam9pbihvdXRwdXREaXIsIElES0VZLCBTdHJpbmcobm92ZWxfaWQpKSk7XG5cdC8vYXdhaXQgZW1wdHlEaXIoam9pbihvdXRwdXREaXIsIElES0VZLCBTdHJpbmcobm92ZWxfaWQpKSk7XG5cblx0YXdhaXQgZW5zdXJlRmlsZShqb2luKG91dHB1dERpciwgSURLRVksIFN0cmluZyhub3ZlbF9pZCksICcuZ2l0a2VlcCcpKTtcblxuXHRsZXQgbm92ZWwgPSBhd2FpdCBkb3dubG9hZChTdHJpbmcobm92ZWxfaWQpLCB7XG5cdFx0ZGlzYWJsZVR4dGRvd25sb2FkOiB0cnVlLFxuXHRcdC8vZGlzYWJsZUNoZWNrRXhpc3RzOiB0cnVlLFxuXHRcdGtlZXBJbWFnZTogdHJ1ZSxcblx0XHRrZWVwUnVieTogdHJ1ZSxcblx0XHRrZWVwRm9ybWF0OiB0cnVlLFxuXHRcdGRlYnVnTG9nOiB0cnVlLFxuXHR9LCBzaXRlSUQgYXMgRW51bU5vdmVsU2l0ZUxpc3QsIHtcblx0XHRvdXRwdXREaXIsXG5cdFx0cGF0aE5vdmVsU3R5bGU6IHRydWUsXG5cdFx0a2VlcEltYWdlOiB0cnVlLFxuXHRcdGtlZXBSdWJ5OiB0cnVlLFxuXHRcdGtlZXBGb3JtYXQ6IHRydWUsXG5cdFx0ZGVidWdMb2c6IHRydWUsXG5cdH0pO1xuXG5cdGxldCBjd2QgPSBqb2luKG91dHB1dERpciwgSURLRVksIG5vdmVsLnVybF9kYXRhLm5vdmVsX2lkKTtcblxuXHRhd2FpdCBGYXN0R2xvYihbXG5cdFx0JyoqLyoudHh0Jyxcblx0XSwge1xuXHRcdGN3ZCxcblx0XHRhYnNvbHV0ZTogdHJ1ZSxcblx0fSkuZWFjaChhc3luYyAoZmlsZSkgPT5cblx0e1xuXG5cdFx0bGV0IHN0ID0gYXdhaXQgc3RhdChmaWxlKTtcblxuXHRcdGlmIChzdC5zaXplIDwgMSlcblx0XHR7XG5cdFx0XHRjb25zb2xlLndhcm4oYCR7cmVsYXRpdmUoY3dkLCBmaWxlKX0g5q2k5qqU5qGI5rKS5pyJ5YWn5a6577yM6YCy6KGM5Yiq6ZmkLi4uYCk7XG5cdFx0XHRyZXR1cm4gcmVtb3ZlKGZpbGUpXG5cdFx0fVxuXG5cdH0pO1xuXG5cdHJldHVybiB7XG5cdFx0Y3dkLFxuXHRcdElES0VZLFxuXHRcdG5vdmVsX2lkOiBub3ZlbC51cmxfZGF0YS5ub3ZlbF9pZCBhcyBzdHJpbmcsXG5cdFx0bm92ZWwsXG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZG93bmxvYWROb3ZlbFxuXG4iXX0=