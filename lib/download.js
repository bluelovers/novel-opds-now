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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmxvYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkb3dubG9hZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUlBLCtEQUErQztBQUMvQyxrREFBaUU7QUFFakUsK0JBQXNDO0FBQ3RDLDhFQUFzRDtBQUN0RCx1Q0FXa0I7QUFDbEIsbUNBQXFEO0FBQ3JELHdEQUFnQztBQUNoQyxzREFBOEI7QUFFOUIsd0RBQTZEO0FBQzdELGlFQUEwQztBQUMxQywwREFBa0M7QUFFbEMsU0FBZ0IsWUFBWSxDQUFDLE9BSzVCO0lBRUEsSUFBSSxLQUFLLEdBQUcsbUJBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFekMsSUFBSSxPQUFPLENBQUMsU0FBUyxFQUNyQjtRQUNDLElBQ0E7WUFDQyxJQUFJLEdBQUcsR0FBYyx1QkFBWSxDQUFDLHNCQUFjLENBQUMsQ0FBQztZQUVsRCxJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEIsSUFBSSxJQUFJLEdBQWlCLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFOUMsSUFBSSxDQUFDLElBQUksRUFDVDtnQkFDQyxJQUFJLEVBQUUsR0FBRywyQkFBcUIsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBRS9DLElBQUksRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDO29CQUVmLGNBQWMsRUFBRSxJQUFJO29CQUNwQixTQUFTLEVBQUUsSUFBSTtvQkFDZixRQUFRLEVBQUUsSUFBSTtvQkFDZCxVQUFVLEVBQUUsSUFBSTtvQkFDaEIsUUFBUSxFQUFFLElBQUk7aUJBQ2QsQ0FBQyxDQUFDO2dCQUVILElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQWUsQ0FBQyxDQUFDO2dCQUVyRCxJQUFJLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUM5QjtZQUVELElBQUks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LENBQUE7U0FDbkI7SUFFRixDQUFDLENBQUMsQ0FBQztJQUVILE9BQU87UUFDTixHQUFHO1FBQ0gsS0FBSztRQUNMLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQWtCO1FBQzNDLEtBQUs7S0FDTCxDQUFBO0FBQ0YsQ0FBQztBQWpFRCxzQ0FpRUM7QUFFRCxrQkFBZSxhQUFhLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzEvMzAuXG4gKi9cblxuaW1wb3J0IHsgZG93bmxvYWQgfSBmcm9tIFwibm92ZWwtZG93bmxvYWRlci1jbGlcIlxuaW1wb3J0IHsgcmVxdWlyZU5vdmVsU2l0ZUNsYXNzIH0gZnJvbSAnbm92ZWwtZG93bmxvYWRlci9zcmMvYWxsJztcbmltcG9ydCB7IEVudW1Ob3ZlbFNpdGVMaXN0IH0gZnJvbSAnbm92ZWwtZG93bmxvYWRlci9zcmMvYWxsL2NvbnN0JztcbmltcG9ydCB7IGpvaW4sIHJlbGF0aXZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgRmFzdEdsb2IgZnJvbSAnQGJsdWVsb3ZlcnMvZmFzdC1nbG9iL2JsdWViaXJkJztcbmltcG9ydCB7XG5cdHN0YXQsXG5cdHJlbW92ZSxcblx0cmVhZEpTT05TeW5jLFxuXHRyZW1vdmVTeW5jLFxuXHRwYXRoRXhpc3RzU3luYyxcblx0ZW5zdXJlRmlsZSxcblx0ZW5zdXJlRGlyLFxuXHRlbnN1cmVEaXJTeW5jLFxuXHRyZWFkSlNPTixcblx0d3JpdGVKU09OLFxufSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgeyBPVVRQVVRfRElSLCBfX2NhY2hlTWFwRmlsZSB9IGZyb20gJy4vY29uc3QnO1xuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCB0bXBEaXIgZnJvbSAnLi90bXBEaXInO1xuaW1wb3J0IHsgSUNhY2hlTWFwLCBJQ2FjaGVNYXBSb3csIElEb3dubG9hZEluZm8sIEVudW1DYWNoZU1hcFJvd1N0YXR1cyB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgc2l0ZUlEMklES0VZIH0gZnJvbSAnbm92ZWwtZG93bmxvYWRlci9zcmMvYWxsL3V0aWwnO1xuaW1wb3J0IGNvbnNvbGUgZnJvbSAnZGVidWctY29sb3IyL2xvZ2dlcic7XG5pbXBvcnQgZ2V0UHJveHkgZnJvbSAnLi9nZXRQcm94eSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBkb3dubG9hZEluZm8ob3B0aW9uczoge1xuXHRub3ZlbF9pZDogc3RyaW5nIHwgbnVtYmVyLFxuXHRzaXRlSUQ6IHN0cmluZyB8IEVudW1Ob3ZlbFNpdGVMaXN0LFxuXHRvdXRwdXRSb290OiBzdHJpbmcsXG5cdHVzZUNhY2hlZD86IGJvb2xlYW4sXG59KTogSURvd25sb2FkSW5mb1xue1xuXHRsZXQgSURLRVkgPSBzaXRlSUQySURLRVkob3B0aW9ucy5zaXRlSUQpO1xuXG5cdGlmIChvcHRpb25zLnVzZUNhY2hlZClcblx0e1xuXHRcdHRyeVxuXHRcdHtcblx0XHRcdGxldCBtYXA6IElDYWNoZU1hcCA9IHJlYWRKU09OU3luYyhfX2NhY2hlTWFwRmlsZSk7XG5cblx0XHRcdGxldCBvMiA9IG1hcFtJREtFWV07XG5cdFx0XHRsZXQgZGF0YTogSUNhY2hlTWFwUm93ID0gbzJbb3B0aW9ucy5ub3ZlbF9pZF07XG5cblx0XHRcdGlmICghZGF0YSlcblx0XHRcdHtcblx0XHRcdFx0bGV0IG9jID0gcmVxdWlyZU5vdmVsU2l0ZUNsYXNzKG9wdGlvbnMuc2l0ZUlEKTtcblxuXHRcdFx0XHRsZXQgbzMgPSBuZXcgb2Moe1xuXHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRwYXRoTm92ZWxTdHlsZTogdHJ1ZSxcblx0XHRcdFx0XHRrZWVwSW1hZ2U6IHRydWUsXG5cdFx0XHRcdFx0a2VlcFJ1Ynk6IHRydWUsXG5cdFx0XHRcdFx0a2VlcEZvcm1hdDogdHJ1ZSxcblx0XHRcdFx0XHRkZWJ1Z0xvZzogdHJ1ZSxcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0bGV0IHVybF9kYXRhMiA9IG8zLnBhcnNlVXJsKG9wdGlvbnMubm92ZWxfaWQgYXMgYW55KTtcblxuXHRcdFx0XHRkYXRhID0gbzJbdXJsX2RhdGEyLm5vdmVsX2lkXTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGRhdGEgJiYgcGF0aEV4aXN0c1N5bmMoam9pbihkYXRhLmN3ZCwgJy5naXRrZWVwJykpKVxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgX29rID0gZmFsc2U7XG5cblx0XHRcdFx0aWYgKGRhdGEuc3RhdHVzID09PSBFbnVtQ2FjaGVNYXBSb3dTdGF0dXMuRE9ORSAmJiBwYXRoRXhpc3RzU3luYyhkYXRhLmVwdWIpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0X29rID0gdHJ1ZVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKGRhdGEuc3RhdHVzID09PSBFbnVtQ2FjaGVNYXBSb3dTdGF0dXMuV0FJVElOR19SRVRSWSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdF9vayA9IHRydWVcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChfb2spXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0Li4uZGF0YSxcblx0XHRcdFx0XHRcdHJlbW92ZUNhbGxiYWNrKClcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlbW92ZVN5bmMoZGF0YS5vdXRwdXREaXIpXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGNhdGNoIChlKVxuXHRcdHtcblxuXHRcdH1cblx0fVxuXG5cdGlmICghb3B0aW9ucy5vdXRwdXRSb290KVxuXHR7XG5cdFx0b3B0aW9ucy5vdXRwdXRSb290ID0gT1VUUFVUX0RJUjtcblx0fVxuXG5cdGVuc3VyZURpclN5bmMob3B0aW9ucy5vdXRwdXRSb290KTtcblx0bGV0IHsgbmFtZTogb3V0cHV0RGlyLCByZW1vdmVDYWxsYmFjayB9ID0gdG1wRGlyKG9wdGlvbnMub3V0cHV0Um9vdCk7XG5cblx0bGV0IG9jID0gcmVxdWlyZU5vdmVsU2l0ZUNsYXNzKG9wdGlvbnMuc2l0ZUlEKTtcblxuXHRsZXQgbyA9IG5ldyBvYyh7XG5cdFx0b3V0cHV0RGlyLFxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRwYXRoTm92ZWxTdHlsZTogdHJ1ZSxcblx0XHRrZWVwSW1hZ2U6IHRydWUsXG5cdFx0a2VlcFJ1Ynk6IHRydWUsXG5cdFx0a2VlcEZvcm1hdDogdHJ1ZSxcblx0XHRkZWJ1Z0xvZzogdHJ1ZSxcblx0fSk7XG5cblx0bGV0IHVybF9kYXRhID0gby5wYXJzZVVybChvcHRpb25zLm5vdmVsX2lkIGFzIGFueSk7XG5cblx0bGV0IGN3ZCA9IGpvaW4ob3V0cHV0RGlyLCBJREtFWSwgdXJsX2RhdGEubm92ZWxfaWQpO1xuXG5cdHJldHVybiB7XG5cdFx0b3V0cHV0RGlyLFxuXHRcdGN3ZCxcblx0XHRzaXRlSUQ6IG9wdGlvbnMuc2l0ZUlELFxuXHRcdElES0VZLFxuXHRcdG5vdmVsX2lkOiB1cmxfZGF0YS5ub3ZlbF9pZCBhcyBzdHJpbmcsXG5cdFx0bm92ZWxfaWQyOiBvcHRpb25zLm5vdmVsX2lkLFxuXHRcdHJlbW92ZUNhbGxiYWNrKClcblx0XHR7XG5cdFx0XHRyZXR1cm4gcmVtb3ZlU3luYyhvdXRwdXREaXIpXG5cdFx0fSxcblx0XHRvdXRwdXRSb290OiBvcHRpb25zLm91dHB1dFJvb3QsXG5cdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpLFxuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpczUwNDxFIGV4dGVuZHMgRXJyb3I+KGU6IEUpXG57XG5cdC8vIEB0cy1pZ25vcmVcblx0aWYgKGUubWVzc2FnZS5pbmNsdWRlcygnNTA0JykgfHwgZS5TdGF0dXNDb2RlID09IDUwNClcblx0e1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0cmV0dXJuIGZhbHNlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkb3dubG9hZE5vdmVsMihvcHRpb25zOiB7XG5cdG5vdmVsX2lkOiBzdHJpbmcgfCBudW1iZXIsXG5cdHNpdGVJRDogc3RyaW5nIHwgRW51bU5vdmVsU2l0ZUxpc3QsXG5cdG91dHB1dFJvb3Q6IHN0cmluZyxcblx0dXNlQ2FjaGVkPzogYm9vbGVhbixcbn0pXG57XG5cdHJldHVybiBCbHVlYmlyZC5yZXNvbHZlKClcblx0XHQudGhlbigoKSA9PiBkb3dubG9hZEluZm8ob3B0aW9ucykpXG5cdFx0LnRoZW4ob3B0aW9ucyA9PiB7XG5cblx0XHRcdGNvbnN0IHsgSURLRVkgfSA9IG9wdGlvbnM7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdG9wdGlvbnMsXG5cdFx0XHRcdGRvd25sb2FkKClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiBCbHVlYmlyZC5yZXNvbHZlKGRvd25sb2FkTm92ZWwob3B0aW9ucy5ub3ZlbF9pZCwgb3B0aW9ucy5zaXRlSUQsIG9wdGlvbnMub3V0cHV0RGlyKSlcblx0XHRcdFx0XHRcdC5jYXRjaChhc3luYyAoZSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAoaXM1MDQoZSkpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmRpcihlKTtcblxuXHRcdFx0XHRcdFx0XHRcdGF3YWl0IEJsdWViaXJkLmRlbGF5KDUwMDApO1xuXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGRvd25sb2FkTm92ZWwob3B0aW9ucy5ub3ZlbF9pZCwgb3B0aW9ucy5zaXRlSUQsIG9wdGlvbnMub3V0cHV0RGlyKVxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGUpXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnRhcENhdGNoKGUgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAoaXM1MDQoZSkpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRlLlN0YXR1c0NvZGUgPSA1MDQ7XG5cdFx0XHRcdFx0XHRcdFx0ZS5vcHRpb25zID0gb3B0aW9ucztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC50aGVuKHZhbHVlID0+IHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0XHQuLi5vcHRpb25zLFxuXHRcdFx0XHRcdFx0XHRcdC4uLnZhbHVlLFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnRhcENhdGNoKGFzeW5jIChlKSA9PiB7XG5cblx0XHRcdFx0XHRcdFx0aWYgKGlzNTA0KGUpKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0bGV0IG1hcF9maWxlID0gX19jYWNoZU1hcEZpbGU7XG5cblx0XHRcdFx0XHRcdFx0XHRsZXQgbWFwOiBJQ2FjaGVNYXAgPSBhd2FpdCByZWFkSlNPTihtYXBfZmlsZSlcblx0XHRcdFx0XHRcdFx0XHRcdC5jYXRjaChlID0+ICh7fSkpXG5cdFx0XHRcdFx0XHRcdFx0O1xuXG5cdFx0XHRcdFx0XHRcdFx0bGV0IF9kYXRhID0gbWFwW0lES0VZXSA9IG1hcFtJREtFWV0gfHwge307XG5cblx0XHRcdFx0XHRcdFx0XHRpZiAoIV9kYXRhW29wdGlvbnMubm92ZWxfaWRdIHx8IF9kYXRhW29wdGlvbnMubm92ZWxfaWRdLnN0YXR1cyAhPT0gRW51bUNhY2hlTWFwUm93U3RhdHVzLkRPTkUpXG5cdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0X2RhdGFbb3B0aW9ucy5ub3ZlbF9pZF0gPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG91dHB1dFJvb3Q6IG9wdGlvbnMub3V0cHV0RGlyLFxuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdFx0XHRcdFx0Li4uX2RhdGFbb3B0aW9ucy5ub3ZlbF9pZF0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC4uLm9wdGlvbnMsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC4uLmUub3B0aW9ucyxcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IEVudW1DYWNoZU1hcFJvd1N0YXR1cy5XQUlUSU5HX1JFVFJZLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KCksXG5cdFx0XHRcdFx0XHRcdFx0XHR9IGFzIGFueTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIF9kYXRhW29wdGlvbnMubm92ZWxfaWRdLnJlbW92ZUNhbGxiYWNrO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRhd2FpdCB3cml0ZUpTT04obWFwX2ZpbGUsIG1hcCwge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRzcGFjZXM6IDIsXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy5yZW1vdmVDYWxsYmFjaygpXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZG93bmxvYWROb3ZlbChub3ZlbF9pZDogc3RyaW5nIHwgbnVtYmVyLCBzaXRlSUQ6IHN0cmluZyB8IEVudW1Ob3ZlbFNpdGVMaXN0LCBvdXRwdXREaXIgPSBPVVRQVVRfRElSKVxue1xuXHRsZXQgSURLRVkgPSBzaXRlSUQySURLRVkoc2l0ZUlEKTtcblxuXHRhd2FpdCBlbnN1cmVEaXIoam9pbihvdXRwdXREaXIsIElES0VZLCBTdHJpbmcobm92ZWxfaWQpKSk7XG5cdC8vYXdhaXQgZW1wdHlEaXIoam9pbihvdXRwdXREaXIsIElES0VZLCBTdHJpbmcobm92ZWxfaWQpKSk7XG5cblx0YXdhaXQgZW5zdXJlRmlsZShqb2luKG91dHB1dERpciwgSURLRVksIFN0cmluZyhub3ZlbF9pZCksICcuZ2l0a2VlcCcpKTtcblxuXHRsZXQgcHJveHkgPSBnZXRQcm94eSgpO1xuXG5cdGlmIChwcm94eSlcblx0e1xuXHRcdGNvbnNvbGUuZGVidWcoYHVzZSBwcm94eWAsIHByb3h5KTtcblx0fVxuXG5cdGxldCBub3ZlbCA9IGF3YWl0IGRvd25sb2FkKFN0cmluZyhub3ZlbF9pZCksIHtcblx0XHRkaXNhYmxlVHh0ZG93bmxvYWQ6IHRydWUsXG5cdFx0Ly9kaXNhYmxlQ2hlY2tFeGlzdHM6IHRydWUsXG5cdFx0a2VlcEltYWdlOiB0cnVlLFxuXHRcdGtlZXBSdWJ5OiB0cnVlLFxuXHRcdGtlZXBGb3JtYXQ6IHRydWUsXG5cdFx0ZGVidWdMb2c6IHRydWUsXG5cdFx0b3B0aW9uc0pTRE9NOiB7XG5cdFx0XHRyZXF1ZXN0T3B0aW9uczoge1xuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdHByb3h5LFxuXHRcdFx0fVxuXHRcdH1cblx0fSwgc2l0ZUlEIGFzIEVudW1Ob3ZlbFNpdGVMaXN0LCB7XG5cdFx0b3V0cHV0RGlyLFxuXHRcdHBhdGhOb3ZlbFN0eWxlOiB0cnVlLFxuXHRcdGtlZXBJbWFnZTogdHJ1ZSxcblx0XHRrZWVwUnVieTogdHJ1ZSxcblx0XHRrZWVwRm9ybWF0OiB0cnVlLFxuXHRcdGRlYnVnTG9nOiB0cnVlLFxuXG5cdH0pO1xuXG5cdGxldCBjd2QgPSBqb2luKG91dHB1dERpciwgSURLRVksIG5vdmVsLnVybF9kYXRhLm5vdmVsX2lkKTtcblxuXHRhd2FpdCBGYXN0R2xvYihbXG5cdFx0JyoqLyoudHh0Jyxcblx0XSwge1xuXHRcdGN3ZCxcblx0XHRhYnNvbHV0ZTogdHJ1ZSxcblx0fSkuZWFjaChhc3luYyAoZmlsZSkgPT5cblx0e1xuXG5cdFx0bGV0IHN0ID0gYXdhaXQgc3RhdChmaWxlKTtcblxuXHRcdGlmIChzdC5zaXplIDwgMSlcblx0XHR7XG5cdFx0XHRjb25zb2xlLndhcm4oYCR7cmVsYXRpdmUoY3dkLCBmaWxlKX0g5q2k5qqU5qGI5rKS5pyJ5YWn5a6577yM6YCy6KGM5Yiq6ZmkLi4uYCk7XG5cdFx0XHRyZXR1cm4gcmVtb3ZlKGZpbGUpXG5cdFx0fVxuXG5cdH0pO1xuXG5cdHJldHVybiB7XG5cdFx0Y3dkLFxuXHRcdElES0VZLFxuXHRcdG5vdmVsX2lkOiBub3ZlbC51cmxfZGF0YS5ub3ZlbF9pZCBhcyBzdHJpbmcsXG5cdFx0bm92ZWwsXG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZG93bmxvYWROb3ZlbFxuXG4iXX0=