"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadNovel = exports.downloadNovel2 = exports.is504 = exports.downloadInfo = void 0;
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
const getProxy_1 = __importDefault(require("./getProxy"));
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
    let proxy = getProxy_1.default();
    if (proxy) {
        logger_1.default.debug(`use proxy`, proxy);
    }
    let novel = await novel_downloader_cli_1.download(String(novel_id), {
        disableTxtdownload: true,
        keepImage: true,
        keepRuby: true,
        keepFormat: true,
        debugLog: true,
        optionsJSDOM: {
            requestOptions: {
                proxy,
            }
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmxvYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkb3dubG9hZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFJQSwrREFBK0M7QUFDL0Msa0RBQWlFO0FBRWpFLCtCQUFzQztBQUN0Qyw4RUFBc0Q7QUFDdEQsdUNBV2tCO0FBQ2xCLG1DQUFxRDtBQUNyRCx3REFBZ0M7QUFDaEMsc0RBQThCO0FBRTlCLHdEQUE2RDtBQUM3RCxpRUFBMEM7QUFDMUMsMERBQWtDO0FBRWxDLFNBQWdCLFlBQVksQ0FBQyxPQUs1QjtJQUVBLElBQUksS0FBSyxHQUFHLG1CQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXpDLElBQUksT0FBTyxDQUFDLFNBQVMsRUFDckI7UUFDQyxJQUNBO1lBQ0MsSUFBSSxHQUFHLEdBQWMsdUJBQVksQ0FBQyxzQkFBYyxDQUFDLENBQUM7WUFFbEQsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BCLElBQUksSUFBSSxHQUFpQixFQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRTlDLElBQUksQ0FBQyxJQUFJLEVBQ1Q7Z0JBQ0MsSUFBSSxFQUFFLEdBQUcsMkJBQXFCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUUvQyxJQUFJLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQztvQkFFZixjQUFjLEVBQUUsSUFBSTtvQkFDcEIsU0FBUyxFQUFFLElBQUk7b0JBQ2YsUUFBUSxFQUFFLElBQUk7b0JBQ2QsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLFFBQVEsRUFBRSxJQUFJO2lCQUNkLENBQUMsQ0FBQztnQkFFSCxJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFlLENBQUMsQ0FBQztnQkFFckQsSUFBSSxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDOUI7WUFFRCxJQUFJ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QyxDQUFBO1NBQ25CO0lBRUYsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPO1FBQ04sR0FBRztRQUNILEtBQUs7UUFDTCxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFrQjtRQUMzQyxLQUFLO0tBQ0wsQ0FBQTtBQUNGLENBQUM7QUFqRUQsc0NBaUVDO0FBRUQsa0JBQWUsYUFBYSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8xLzMwLlxuICovXG5cbmltcG9ydCB7IGRvd25sb2FkIH0gZnJvbSBcIm5vdmVsLWRvd25sb2FkZXItY2xpXCJcbmltcG9ydCB7IHJlcXVpcmVOb3ZlbFNpdGVDbGFzcyB9IGZyb20gJ25vdmVsLWRvd25sb2FkZXIvc3JjL2FsbCc7XG5pbXBvcnQgeyBFbnVtTm92ZWxTaXRlTGlzdCB9IGZyb20gJ25vdmVsLWRvd25sb2FkZXIvc3JjL2FsbC9jb25zdCc7XG5pbXBvcnQgeyBqb2luLCByZWxhdGl2ZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IEZhc3RHbG9iIGZyb20gJ0BibHVlbG92ZXJzL2Zhc3QtZ2xvYi9ibHVlYmlyZCc7XG5pbXBvcnQge1xuXHRzdGF0LFxuXHRyZW1vdmUsXG5cdHJlYWRKU09OU3luYyxcblx0cmVtb3ZlU3luYyxcblx0cGF0aEV4aXN0c1N5bmMsXG5cdGVuc3VyZUZpbGUsXG5cdGVuc3VyZURpcixcblx0ZW5zdXJlRGlyU3luYyxcblx0cmVhZEpTT04sXG5cdHdyaXRlSlNPTixcbn0gZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHsgT1VUUFVUX0RJUiwgX19jYWNoZU1hcEZpbGUgfSBmcm9tICcuL2NvbnN0JztcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgdG1wRGlyIGZyb20gJy4vdG1wRGlyJztcbmltcG9ydCB7IElDYWNoZU1hcCwgSUNhY2hlTWFwUm93LCBJRG93bmxvYWRJbmZvLCBFbnVtQ2FjaGVNYXBSb3dTdGF0dXMgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IHNpdGVJRDJJREtFWSB9IGZyb20gJ25vdmVsLWRvd25sb2FkZXIvc3JjL2FsbC91dGlsJztcbmltcG9ydCBjb25zb2xlIGZyb20gJ2RlYnVnLWNvbG9yMi9sb2dnZXInO1xuaW1wb3J0IGdldFByb3h5IGZyb20gJy4vZ2V0UHJveHknO1xuXG5leHBvcnQgZnVuY3Rpb24gZG93bmxvYWRJbmZvKG9wdGlvbnM6IHtcblx0bm92ZWxfaWQ6IHN0cmluZyB8IG51bWJlcixcblx0c2l0ZUlEOiBzdHJpbmcgfCBFbnVtTm92ZWxTaXRlTGlzdCxcblx0b3V0cHV0Um9vdDogc3RyaW5nLFxuXHR1c2VDYWNoZWQ/OiBib29sZWFuLFxufSk6IElEb3dubG9hZEluZm9cbntcblx0bGV0IElES0VZID0gc2l0ZUlEMklES0VZKG9wdGlvbnMuc2l0ZUlEKTtcblxuXHRpZiAob3B0aW9ucy51c2VDYWNoZWQpXG5cdHtcblx0XHR0cnlcblx0XHR7XG5cdFx0XHRsZXQgbWFwOiBJQ2FjaGVNYXAgPSByZWFkSlNPTlN5bmMoX19jYWNoZU1hcEZpbGUpO1xuXG5cdFx0XHRsZXQgbzIgPSBtYXBbSURLRVldO1xuXHRcdFx0bGV0IGRhdGE6IElDYWNoZU1hcFJvdyA9IG8yW29wdGlvbnMubm92ZWxfaWRdO1xuXG5cdFx0XHRpZiAoIWRhdGEpXG5cdFx0XHR7XG5cdFx0XHRcdGxldCBvYyA9IHJlcXVpcmVOb3ZlbFNpdGVDbGFzcyhvcHRpb25zLnNpdGVJRCk7XG5cblx0XHRcdFx0bGV0IG8zID0gbmV3IG9jKHtcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0cGF0aE5vdmVsU3R5bGU6IHRydWUsXG5cdFx0XHRcdFx0a2VlcEltYWdlOiB0cnVlLFxuXHRcdFx0XHRcdGtlZXBSdWJ5OiB0cnVlLFxuXHRcdFx0XHRcdGtlZXBGb3JtYXQ6IHRydWUsXG5cdFx0XHRcdFx0ZGVidWdMb2c6IHRydWUsXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGxldCB1cmxfZGF0YTIgPSBvMy5wYXJzZVVybChvcHRpb25zLm5vdmVsX2lkIGFzIGFueSk7XG5cblx0XHRcdFx0ZGF0YSA9IG8yW3VybF9kYXRhMi5ub3ZlbF9pZF07XG5cdFx0XHR9XG5cblx0XHRcdGlmIChkYXRhICYmIHBhdGhFeGlzdHNTeW5jKGpvaW4oZGF0YS5jd2QsICcuZ2l0a2VlcCcpKSlcblx0XHRcdHtcblx0XHRcdFx0bGV0IF9vayA9IGZhbHNlO1xuXG5cdFx0XHRcdGlmIChkYXRhLnN0YXR1cyA9PT0gRW51bUNhY2hlTWFwUm93U3RhdHVzLkRPTkUgJiYgcGF0aEV4aXN0c1N5bmMoZGF0YS5lcHViKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdF9vayA9IHRydWVcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmIChkYXRhLnN0YXR1cyA9PT0gRW51bUNhY2hlTWFwUm93U3RhdHVzLldBSVRJTkdfUkVUUlkpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRfb2sgPSB0cnVlXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoX29rKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdC4uLmRhdGEsXG5cdFx0XHRcdFx0XHRyZW1vdmVDYWxsYmFjaygpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHJldHVybiByZW1vdmVTeW5jKGRhdGEub3V0cHV0RGlyKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRjYXRjaCAoZSlcblx0XHR7XG5cblx0XHR9XG5cdH1cblxuXHRpZiAoIW9wdGlvbnMub3V0cHV0Um9vdClcblx0e1xuXHRcdG9wdGlvbnMub3V0cHV0Um9vdCA9IE9VVFBVVF9ESVI7XG5cdH1cblxuXHRlbnN1cmVEaXJTeW5jKG9wdGlvbnMub3V0cHV0Um9vdCk7XG5cdGxldCB7IG5hbWU6IG91dHB1dERpciwgcmVtb3ZlQ2FsbGJhY2sgfSA9IHRtcERpcihvcHRpb25zLm91dHB1dFJvb3QpO1xuXG5cdGxldCBvYyA9IHJlcXVpcmVOb3ZlbFNpdGVDbGFzcyhvcHRpb25zLnNpdGVJRCk7XG5cblx0bGV0IG8gPSBuZXcgb2Moe1xuXHRcdG91dHB1dERpcixcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0cGF0aE5vdmVsU3R5bGU6IHRydWUsXG5cdFx0a2VlcEltYWdlOiB0cnVlLFxuXHRcdGtlZXBSdWJ5OiB0cnVlLFxuXHRcdGtlZXBGb3JtYXQ6IHRydWUsXG5cdFx0ZGVidWdMb2c6IHRydWUsXG5cdH0pO1xuXG5cdGxldCB1cmxfZGF0YSA9IG8ucGFyc2VVcmwob3B0aW9ucy5ub3ZlbF9pZCBhcyBhbnkpO1xuXG5cdGxldCBjd2QgPSBqb2luKG91dHB1dERpciwgSURLRVksIHVybF9kYXRhLm5vdmVsX2lkKTtcblxuXHRyZXR1cm4ge1xuXHRcdG91dHB1dERpcixcblx0XHRjd2QsXG5cdFx0c2l0ZUlEOiBvcHRpb25zLnNpdGVJRCxcblx0XHRJREtFWSxcblx0XHRub3ZlbF9pZDogdXJsX2RhdGEubm92ZWxfaWQgYXMgc3RyaW5nLFxuXHRcdG5vdmVsX2lkMjogb3B0aW9ucy5ub3ZlbF9pZCxcblx0XHRyZW1vdmVDYWxsYmFjaygpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIHJlbW92ZVN5bmMob3V0cHV0RGlyKVxuXHRcdH0sXG5cdFx0b3V0cHV0Um9vdDogb3B0aW9ucy5vdXRwdXRSb290LFxuXHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXM1MDQ8RSBleHRlbmRzIEVycm9yPihlOiBFKVxue1xuXHQvLyBAdHMtaWdub3JlXG5cdGlmIChlLm1lc3NhZ2UuaW5jbHVkZXMoJzUwNCcpIHx8IGUuU3RhdHVzQ29kZSA9PSA1MDQpXG5cdHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHJldHVybiBmYWxzZVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZG93bmxvYWROb3ZlbDIob3B0aW9uczoge1xuXHRub3ZlbF9pZDogc3RyaW5nIHwgbnVtYmVyLFxuXHRzaXRlSUQ6IHN0cmluZyB8IEVudW1Ob3ZlbFNpdGVMaXN0LFxuXHRvdXRwdXRSb290OiBzdHJpbmcsXG5cdHVzZUNhY2hlZD86IGJvb2xlYW4sXG59KVxue1xuXHRyZXR1cm4gQmx1ZWJpcmQucmVzb2x2ZSgpXG5cdFx0LnRoZW4oKCkgPT4gZG93bmxvYWRJbmZvKG9wdGlvbnMpKVxuXHRcdC50aGVuKG9wdGlvbnMgPT4ge1xuXG5cdFx0XHRjb25zdCB7IElES0VZIH0gPSBvcHRpb25zO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRvcHRpb25zLFxuXHRcdFx0XHRkb3dubG9hZCgpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gQmx1ZWJpcmQucmVzb2x2ZShkb3dubG9hZE5vdmVsKG9wdGlvbnMubm92ZWxfaWQsIG9wdGlvbnMuc2l0ZUlELCBvcHRpb25zLm91dHB1dERpcikpXG5cdFx0XHRcdFx0XHQuY2F0Y2goYXN5bmMgKGUpID0+IHtcblx0XHRcdFx0XHRcdFx0aWYgKGlzNTA0KGUpKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5kaXIoZSk7XG5cblx0XHRcdFx0XHRcdFx0XHRhd2FpdCBCbHVlYmlyZC5kZWxheSg1MDAwKTtcblxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBkb3dubG9hZE5vdmVsKG9wdGlvbnMubm92ZWxfaWQsIG9wdGlvbnMuc2l0ZUlELCBvcHRpb25zLm91dHB1dERpcilcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlKVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC50YXBDYXRjaChlID0+IHtcblx0XHRcdFx0XHRcdFx0aWYgKGlzNTA0KGUpKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0ZS5TdGF0dXNDb2RlID0gNTA0O1xuXHRcdFx0XHRcdFx0XHRcdGUub3B0aW9ucyA9IG9wdGlvbnM7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQudGhlbih2YWx1ZSA9PiB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRcdFx0Li4ub3B0aW9ucyxcblx0XHRcdFx0XHRcdFx0XHQuLi52YWx1ZSxcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC50YXBDYXRjaChhc3luYyAoZSkgPT4ge1xuXG5cdFx0XHRcdFx0XHRcdGlmIChpczUwNChlKSlcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGxldCBtYXBfZmlsZSA9IF9fY2FjaGVNYXBGaWxlO1xuXG5cdFx0XHRcdFx0XHRcdFx0bGV0IG1hcDogSUNhY2hlTWFwID0gYXdhaXQgcmVhZEpTT04obWFwX2ZpbGUpXG5cdFx0XHRcdFx0XHRcdFx0XHQuY2F0Y2goZSA9PiAoe30pKVxuXHRcdFx0XHRcdFx0XHRcdDtcblxuXHRcdFx0XHRcdFx0XHRcdGxldCBfZGF0YSA9IG1hcFtJREtFWV0gPSBtYXBbSURLRVldIHx8IHt9O1xuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFfZGF0YVtvcHRpb25zLm5vdmVsX2lkXSB8fCBfZGF0YVtvcHRpb25zLm5vdmVsX2lkXS5zdGF0dXMgIT09IEVudW1DYWNoZU1hcFJvd1N0YXR1cy5ET05FKVxuXHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdF9kYXRhW29wdGlvbnMubm92ZWxfaWRdID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRvdXRwdXRSb290OiBvcHRpb25zLm91dHB1dERpcixcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC4uLl9kYXRhW29wdGlvbnMubm92ZWxfaWRdLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHQuLi5vcHRpb25zLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHQuLi5lLm9wdGlvbnMsXG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiBFbnVtQ2FjaGVNYXBSb3dTdGF0dXMuV0FJVElOR19SRVRSWSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpLFxuXHRcdFx0XHRcdFx0XHRcdFx0fSBhcyBhbnk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdGRlbGV0ZSBfZGF0YVtvcHRpb25zLm5vdmVsX2lkXS5yZW1vdmVDYWxsYmFjaztcblxuXHRcdFx0XHRcdFx0XHRcdFx0YXdhaXQgd3JpdGVKU09OKG1hcF9maWxlLCBtYXAsIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3BhY2VzOiAyLFxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIG9wdGlvbnMucmVtb3ZlQ2FsbGJhY2soKVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRvd25sb2FkTm92ZWwobm92ZWxfaWQ6IHN0cmluZyB8IG51bWJlciwgc2l0ZUlEOiBzdHJpbmcgfCBFbnVtTm92ZWxTaXRlTGlzdCwgb3V0cHV0RGlyID0gT1VUUFVUX0RJUilcbntcblx0bGV0IElES0VZID0gc2l0ZUlEMklES0VZKHNpdGVJRCk7XG5cblx0YXdhaXQgZW5zdXJlRGlyKGpvaW4ob3V0cHV0RGlyLCBJREtFWSwgU3RyaW5nKG5vdmVsX2lkKSkpO1xuXHQvL2F3YWl0IGVtcHR5RGlyKGpvaW4ob3V0cHV0RGlyLCBJREtFWSwgU3RyaW5nKG5vdmVsX2lkKSkpO1xuXG5cdGF3YWl0IGVuc3VyZUZpbGUoam9pbihvdXRwdXREaXIsIElES0VZLCBTdHJpbmcobm92ZWxfaWQpLCAnLmdpdGtlZXAnKSk7XG5cblx0bGV0IHByb3h5ID0gZ2V0UHJveHkoKTtcblxuXHRpZiAocHJveHkpXG5cdHtcblx0XHRjb25zb2xlLmRlYnVnKGB1c2UgcHJveHlgLCBwcm94eSk7XG5cdH1cblxuXHRsZXQgbm92ZWwgPSBhd2FpdCBkb3dubG9hZChTdHJpbmcobm92ZWxfaWQpLCB7XG5cdFx0ZGlzYWJsZVR4dGRvd25sb2FkOiB0cnVlLFxuXHRcdC8vZGlzYWJsZUNoZWNrRXhpc3RzOiB0cnVlLFxuXHRcdGtlZXBJbWFnZTogdHJ1ZSxcblx0XHRrZWVwUnVieTogdHJ1ZSxcblx0XHRrZWVwRm9ybWF0OiB0cnVlLFxuXHRcdGRlYnVnTG9nOiB0cnVlLFxuXHRcdG9wdGlvbnNKU0RPTToge1xuXHRcdFx0cmVxdWVzdE9wdGlvbnM6IHtcblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRwcm94eSxcblx0XHRcdH1cblx0XHR9XG5cdH0sIHNpdGVJRCBhcyBFbnVtTm92ZWxTaXRlTGlzdCwge1xuXHRcdG91dHB1dERpcixcblx0XHRwYXRoTm92ZWxTdHlsZTogdHJ1ZSxcblx0XHRrZWVwSW1hZ2U6IHRydWUsXG5cdFx0a2VlcFJ1Ynk6IHRydWUsXG5cdFx0a2VlcEZvcm1hdDogdHJ1ZSxcblx0XHRkZWJ1Z0xvZzogdHJ1ZSxcblxuXHR9KTtcblxuXHRsZXQgY3dkID0gam9pbihvdXRwdXREaXIsIElES0VZLCBub3ZlbC51cmxfZGF0YS5ub3ZlbF9pZCk7XG5cblx0YXdhaXQgRmFzdEdsb2IoW1xuXHRcdCcqKi8qLnR4dCcsXG5cdF0sIHtcblx0XHRjd2QsXG5cdFx0YWJzb2x1dGU6IHRydWUsXG5cdH0pLmVhY2goYXN5bmMgKGZpbGUpID0+XG5cdHtcblxuXHRcdGxldCBzdCA9IGF3YWl0IHN0YXQoZmlsZSk7XG5cblx0XHRpZiAoc3Quc2l6ZSA8IDEpXG5cdFx0e1xuXHRcdFx0Y29uc29sZS53YXJuKGAke3JlbGF0aXZlKGN3ZCwgZmlsZSl9IOatpOaqlOahiOaykuacieWFp+Wuue+8jOmAsuihjOWIqumZpC4uLmApO1xuXHRcdFx0cmV0dXJuIHJlbW92ZShmaWxlKVxuXHRcdH1cblxuXHR9KTtcblxuXHRyZXR1cm4ge1xuXHRcdGN3ZCxcblx0XHRJREtFWSxcblx0XHRub3ZlbF9pZDogbm92ZWwudXJsX2RhdGEubm92ZWxfaWQgYXMgc3RyaW5nLFxuXHRcdG5vdmVsLFxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRvd25sb2FkTm92ZWxcblxuIl19