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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmxvYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkb3dubG9hZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUlBLCtEQUErQztBQUMvQyxrREFBaUU7QUFFakUsK0JBQTRCO0FBQzVCLDhFQUFzRDtBQUN0RCx1Q0FXa0I7QUFDbEIsbUNBQXFEO0FBQ3JELHdEQUFnQztBQUNoQyxzREFBOEI7QUFFOUIsd0RBQTZEO0FBRTdELFNBQWdCLFlBQVksQ0FBQyxPQUs1QjtJQUVBLElBQUksS0FBSyxHQUFHLG1CQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXpDLElBQUksT0FBTyxDQUFDLFNBQVMsRUFDckI7UUFDQyxJQUNBO1lBQ0MsSUFBSSxHQUFHLEdBQWMsdUJBQVksQ0FBQyxzQkFBYyxDQUFDLENBQUM7WUFFbEQsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BCLElBQUksSUFBSSxHQUFpQixFQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRTlDLElBQUksQ0FBQyxJQUFJLEVBQ1Q7Z0JBQ0MsSUFBSSxFQUFFLEdBQUcsMkJBQXFCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUUvQyxJQUFJLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQztvQkFFZixjQUFjLEVBQUUsSUFBSTtvQkFDcEIsU0FBUyxFQUFFLElBQUk7b0JBQ2YsUUFBUSxFQUFFLElBQUk7b0JBQ2QsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLFFBQVEsRUFBRSxJQUFJO2lCQUNkLENBQUMsQ0FBQztnQkFFSCxJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFOUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDOUI7WUFFRCxJQUFJLElBQUksSUFBSSx5QkFBYyxDQUFDLFdBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDLEVBQ3REO2dCQUNDLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQztnQkFFaEIsSUFBSSxJQUFJLENBQUMsTUFBTSxNQUErQixJQUFJLHlCQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUMzRTtvQkFDQyxHQUFHLEdBQUcsSUFBSSxDQUFBO2lCQUNWO3FCQUNJLElBQUksSUFBSSxDQUFDLE1BQU0sUUFBd0MsRUFDNUQ7b0JBQ0MsR0FBRyxHQUFHLElBQUksQ0FBQTtpQkFDVjtnQkFFRCxJQUFJLEdBQUcsRUFDUDtvQkFDQyxPQUFPO3dCQUNOLEdBQUcsSUFBSTt3QkFDUCxjQUFjOzRCQUViLE9BQU8scUJBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7d0JBQ2xDLENBQUM7cUJBQ0QsQ0FBQTtpQkFDRDthQUNEO1NBQ0Q7UUFDRCxPQUFPLENBQUMsRUFDUjtTQUVDO0tBQ0Q7SUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFDdkI7UUFDQyxPQUFPLENBQUMsVUFBVSxHQUFHLGtCQUFVLENBQUM7S0FDaEM7SUFFRCx3QkFBYSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNsQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUUsR0FBRyxnQkFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUVyRSxJQUFJLEVBQUUsR0FBRywyQkFBcUIsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFL0MsSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUM7UUFDZCxTQUFTO1FBRVQsY0FBYyxFQUFFLElBQUk7UUFDcEIsU0FBUyxFQUFFLElBQUk7UUFDZixRQUFRLEVBQUUsSUFBSTtRQUNkLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLFFBQVEsRUFBRSxJQUFJO0tBQ2QsQ0FBQyxDQUFDO0lBRUgsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFNUMsSUFBSSxHQUFHLEdBQUcsV0FBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRXBELE9BQU87UUFDTixTQUFTO1FBQ1QsR0FBRztRQUNILE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTTtRQUN0QixLQUFLO1FBQ0wsUUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFrQjtRQUNyQyxTQUFTLEVBQUUsT0FBTyxDQUFDLFFBQVE7UUFDM0IsY0FBYztZQUViLE9BQU8scUJBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUM3QixDQUFDO1FBQ0QsVUFBVSxFQUFFLE9BQU8sQ0FBQyxVQUFVO1FBQzlCLFNBQVMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFO0tBQ3JCLENBQUE7QUFDRixDQUFDO0FBekdELG9DQXlHQztBQUVELFNBQWdCLEtBQUssQ0FBa0IsQ0FBSTtJQUcxQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLElBQUksR0FBRyxFQUNwRDtRQUNDLE9BQU8sSUFBSSxDQUFDO0tBQ1o7SUFFRCxPQUFPLEtBQUssQ0FBQTtBQUNiLENBQUM7QUFURCxzQkFTQztBQUVELFNBQWdCLGNBQWMsQ0FBQyxPQUs5QjtJQUVBLE9BQU8sa0JBQVEsQ0FBQyxPQUFPLEVBQUU7U0FDdkIsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNqQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFFZixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsT0FBTyxDQUFDO1FBRTFCLE9BQU87WUFDTixPQUFPO1lBQ1AsUUFBUTtnQkFFUCxPQUFPLGtCQUFRLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO3FCQUN6RixLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNsQixJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFDWjt3QkFDQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUVmLE1BQU0sa0JBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBRTNCLE9BQU8sYUFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7cUJBQ3pFO29CQUVELE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDekIsQ0FBQyxDQUFDO3FCQUNELFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDYixJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFDWjt3QkFDQyxDQUFDLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQzt3QkFDbkIsQ0FBQyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7cUJBQ3BCO2dCQUNGLENBQUMsQ0FBQztxQkFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ2IsT0FBTzt3QkFDTixHQUFHLE9BQU87d0JBQ1YsR0FBRyxLQUFLO3FCQUNSLENBQUE7Z0JBQ0YsQ0FBQyxDQUFDO3FCQUNELFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBRXJCLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUNaO3dCQUNDLElBQUksUUFBUSxHQUFHLHNCQUFjLENBQUM7d0JBRTlCLElBQUksR0FBRyxHQUFjLE1BQU0sbUJBQVEsQ0FBQyxRQUFRLENBQUM7NkJBQzNDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FDakI7d0JBRUQsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7d0JBRTFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxNQUErQixFQUM3Rjs0QkFDQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHO2dDQUN6QixVQUFVLEVBQUUsT0FBTyxDQUFDLFNBQVM7Z0NBRzdCLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7Z0NBQzFCLEdBQUcsT0FBTztnQ0FDVixHQUFHLENBQUMsQ0FBQyxPQUFPO2dDQUVaLE1BQU0sS0FBcUM7Z0NBQzNDLFNBQVMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFOzZCQUNkLENBQUM7NEJBRVQsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLGNBQWMsQ0FBQzs0QkFFOUMsTUFBTSxvQkFBUyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7Z0NBQzlCLE1BQU0sRUFBRSxDQUFDOzZCQUNULENBQUMsQ0FBQzt5QkFDSDt3QkFFRCxPQUFPO3FCQUNQO29CQUVELE9BQU8sT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFBO2dCQUNoQyxDQUFDLENBQUMsQ0FBQTtZQUNKLENBQUM7U0FDRCxDQUFBO0lBQ0YsQ0FBQyxDQUFDLENBQ0Y7QUFDRixDQUFDO0FBckZELHdDQXFGQztBQUVNLEtBQUssVUFBVSxhQUFhLENBQUMsUUFBeUIsRUFBRSxNQUFrQyxFQUFFLFNBQVMsR0FBRyxrQkFBVTtJQUV4SCxJQUFJLEtBQUssR0FBRyxtQkFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRWpDLE1BQU0sb0JBQVMsQ0FBQyxXQUFJLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRzFELE1BQU0scUJBQVUsQ0FBQyxXQUFJLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUV2RSxJQUFJLEtBQUssR0FBRyxNQUFNLCtCQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQzVDLGtCQUFrQixFQUFFLElBQUk7UUFFeEIsU0FBUyxFQUFFLElBQUk7UUFDZixRQUFRLEVBQUUsSUFBSTtRQUNkLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLFFBQVEsRUFBRSxJQUFJO0tBQ2QsRUFBRSxNQUEyQixFQUFFO1FBQy9CLFNBQVM7UUFDVCxjQUFjLEVBQUUsSUFBSTtRQUNwQixTQUFTLEVBQUUsSUFBSTtRQUNmLFFBQVEsRUFBRSxJQUFJO1FBQ2QsVUFBVSxFQUFFLElBQUk7UUFDaEIsUUFBUSxFQUFFLElBQUk7S0FDZCxDQUFDLENBQUM7SUFFSCxJQUFJLEdBQUcsR0FBRyxXQUFJLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRTFELE1BQU0sa0JBQVEsQ0FBQztRQUNkLFVBQVU7S0FDVixFQUFFO1FBQ0YsR0FBRztRQUNILFFBQVEsRUFBRSxJQUFJO0tBQ2QsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7UUFHdEIsSUFBSSxFQUFFLEdBQUcsTUFBTSxlQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFMUIsSUFBSSxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsRUFDZjtZQUNDLE9BQU8saUJBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUNuQjtJQUVGLENBQUMsQ0FBQyxDQUFBO0lBRUYsT0FBTztRQUNOLEdBQUc7UUFDSCxLQUFLO1FBQ0wsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBa0I7UUFDM0MsS0FBSztLQUNMLENBQUE7QUFDRixDQUFDO0FBbERELHNDQWtEQztBQUVELGtCQUFlLGFBQWEsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMjAvMS8zMC5cbiAqL1xuXG5pbXBvcnQgeyBkb3dubG9hZCB9IGZyb20gXCJub3ZlbC1kb3dubG9hZGVyLWNsaVwiXG5pbXBvcnQgeyByZXF1aXJlTm92ZWxTaXRlQ2xhc3MgfSBmcm9tICdub3ZlbC1kb3dubG9hZGVyL3NyYy9hbGwnO1xuaW1wb3J0IHsgRW51bU5vdmVsU2l0ZUxpc3QgfSBmcm9tICdub3ZlbC1kb3dubG9hZGVyL3NyYy9hbGwvY29uc3QnO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IEZhc3RHbG9iIGZyb20gJ0BibHVlbG92ZXJzL2Zhc3QtZ2xvYi9ibHVlYmlyZCc7XG5pbXBvcnQge1xuXHRzdGF0LFxuXHRyZW1vdmUsXG5cdHJlYWRKU09OU3luYyxcblx0cmVtb3ZlU3luYyxcblx0cGF0aEV4aXN0c1N5bmMsXG5cdGVuc3VyZUZpbGUsXG5cdGVuc3VyZURpcixcblx0ZW5zdXJlRGlyU3luYyxcblx0cmVhZEpTT04sXG5cdHdyaXRlSlNPTixcbn0gZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHsgT1VUUFVUX0RJUiwgX19jYWNoZU1hcEZpbGUgfSBmcm9tICcuL2NvbnN0JztcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgdG1wRGlyIGZyb20gJy4vdG1wRGlyJztcbmltcG9ydCB7IElDYWNoZU1hcCwgSUNhY2hlTWFwUm93LCBJRG93bmxvYWRJbmZvLCBFbnVtQ2FjaGVNYXBSb3dTdGF0dXMgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IHNpdGVJRDJJREtFWSB9IGZyb20gJ25vdmVsLWRvd25sb2FkZXIvc3JjL2FsbC91dGlsJztcblxuZXhwb3J0IGZ1bmN0aW9uIGRvd25sb2FkSW5mbyhvcHRpb25zOiB7XG5cdG5vdmVsX2lkOiBzdHJpbmcgfCBudW1iZXIsXG5cdHNpdGVJRDogc3RyaW5nIHwgRW51bU5vdmVsU2l0ZUxpc3QsXG5cdG91dHB1dFJvb3Q6IHN0cmluZyxcblx0dXNlQ2FjaGVkPzogYm9vbGVhbixcbn0pOiBJRG93bmxvYWRJbmZvXG57XG5cdGxldCBJREtFWSA9IHNpdGVJRDJJREtFWShvcHRpb25zLnNpdGVJRCk7XG5cblx0aWYgKG9wdGlvbnMudXNlQ2FjaGVkKVxuXHR7XG5cdFx0dHJ5XG5cdFx0e1xuXHRcdFx0bGV0IG1hcDogSUNhY2hlTWFwID0gcmVhZEpTT05TeW5jKF9fY2FjaGVNYXBGaWxlKTtcblxuXHRcdFx0bGV0IG8yID0gbWFwW0lES0VZXTtcblx0XHRcdGxldCBkYXRhOiBJQ2FjaGVNYXBSb3cgPSBvMltvcHRpb25zLm5vdmVsX2lkXTtcblxuXHRcdFx0aWYgKCFkYXRhKVxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgb2MgPSByZXF1aXJlTm92ZWxTaXRlQ2xhc3Mob3B0aW9ucy5zaXRlSUQpO1xuXG5cdFx0XHRcdGxldCBvMyA9IG5ldyBvYyh7XG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdHBhdGhOb3ZlbFN0eWxlOiB0cnVlLFxuXHRcdFx0XHRcdGtlZXBJbWFnZTogdHJ1ZSxcblx0XHRcdFx0XHRrZWVwUnVieTogdHJ1ZSxcblx0XHRcdFx0XHRrZWVwRm9ybWF0OiB0cnVlLFxuXHRcdFx0XHRcdGRlYnVnTG9nOiB0cnVlLFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRsZXQgdXJsX2RhdGEyID0gbzMucGFyc2VVcmwob3B0aW9ucy5ub3ZlbF9pZCk7XG5cblx0XHRcdFx0ZGF0YSA9IG8yW3VybF9kYXRhMi5ub3ZlbF9pZF07XG5cdFx0XHR9XG5cblx0XHRcdGlmIChkYXRhICYmIHBhdGhFeGlzdHNTeW5jKGpvaW4oZGF0YS5jd2QsICcuZ2l0a2VlcCcpKSlcblx0XHRcdHtcblx0XHRcdFx0bGV0IF9vayA9IGZhbHNlO1xuXG5cdFx0XHRcdGlmIChkYXRhLnN0YXR1cyA9PT0gRW51bUNhY2hlTWFwUm93U3RhdHVzLkRPTkUgJiYgcGF0aEV4aXN0c1N5bmMoZGF0YS5lcHViKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdF9vayA9IHRydWVcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmIChkYXRhLnN0YXR1cyA9PT0gRW51bUNhY2hlTWFwUm93U3RhdHVzLldBSVRJTkdfUkVUUlkpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRfb2sgPSB0cnVlXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoX29rKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdC4uLmRhdGEsXG5cdFx0XHRcdFx0XHRyZW1vdmVDYWxsYmFjaygpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHJldHVybiByZW1vdmVTeW5jKGRhdGEub3V0cHV0RGlyKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRjYXRjaCAoZSlcblx0XHR7XG5cblx0XHR9XG5cdH1cblxuXHRpZiAoIW9wdGlvbnMub3V0cHV0Um9vdClcblx0e1xuXHRcdG9wdGlvbnMub3V0cHV0Um9vdCA9IE9VVFBVVF9ESVI7XG5cdH1cblxuXHRlbnN1cmVEaXJTeW5jKG9wdGlvbnMub3V0cHV0Um9vdCk7XG5cdGxldCB7IG5hbWU6IG91dHB1dERpciwgcmVtb3ZlQ2FsbGJhY2sgfSA9IHRtcERpcihvcHRpb25zLm91dHB1dFJvb3QpO1xuXG5cdGxldCBvYyA9IHJlcXVpcmVOb3ZlbFNpdGVDbGFzcyhvcHRpb25zLnNpdGVJRCk7XG5cblx0bGV0IG8gPSBuZXcgb2Moe1xuXHRcdG91dHB1dERpcixcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0cGF0aE5vdmVsU3R5bGU6IHRydWUsXG5cdFx0a2VlcEltYWdlOiB0cnVlLFxuXHRcdGtlZXBSdWJ5OiB0cnVlLFxuXHRcdGtlZXBGb3JtYXQ6IHRydWUsXG5cdFx0ZGVidWdMb2c6IHRydWUsXG5cdH0pO1xuXG5cdGxldCB1cmxfZGF0YSA9IG8ucGFyc2VVcmwob3B0aW9ucy5ub3ZlbF9pZCk7XG5cblx0bGV0IGN3ZCA9IGpvaW4ob3V0cHV0RGlyLCBJREtFWSwgdXJsX2RhdGEubm92ZWxfaWQpO1xuXG5cdHJldHVybiB7XG5cdFx0b3V0cHV0RGlyLFxuXHRcdGN3ZCxcblx0XHRzaXRlSUQ6IG9wdGlvbnMuc2l0ZUlELFxuXHRcdElES0VZLFxuXHRcdG5vdmVsX2lkOiB1cmxfZGF0YS5ub3ZlbF9pZCBhcyBzdHJpbmcsXG5cdFx0bm92ZWxfaWQyOiBvcHRpb25zLm5vdmVsX2lkLFxuXHRcdHJlbW92ZUNhbGxiYWNrKClcblx0XHR7XG5cdFx0XHRyZXR1cm4gcmVtb3ZlU3luYyhvdXRwdXREaXIpXG5cdFx0fSxcblx0XHRvdXRwdXRSb290OiBvcHRpb25zLm91dHB1dFJvb3QsXG5cdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpLFxuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpczUwNDxFIGV4dGVuZHMgRXJyb3I+KGU6IEUpXG57XG5cdC8vIEB0cy1pZ25vcmVcblx0aWYgKGUubWVzc2FnZS5pbmNsdWRlcygnNTA0JykgfHwgZS5TdGF0dXNDb2RlID09IDUwNClcblx0e1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0cmV0dXJuIGZhbHNlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkb3dubG9hZE5vdmVsMihvcHRpb25zOiB7XG5cdG5vdmVsX2lkOiBzdHJpbmcgfCBudW1iZXIsXG5cdHNpdGVJRDogc3RyaW5nIHwgRW51bU5vdmVsU2l0ZUxpc3QsXG5cdG91dHB1dFJvb3Q6IHN0cmluZyxcblx0dXNlQ2FjaGVkPzogYm9vbGVhbixcbn0pXG57XG5cdHJldHVybiBCbHVlYmlyZC5yZXNvbHZlKClcblx0XHQudGhlbigoKSA9PiBkb3dubG9hZEluZm8ob3B0aW9ucykpXG5cdFx0LnRoZW4ob3B0aW9ucyA9PiB7XG5cblx0XHRcdGNvbnN0IHsgSURLRVkgfSA9IG9wdGlvbnM7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdG9wdGlvbnMsXG5cdFx0XHRcdGRvd25sb2FkKClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiBCbHVlYmlyZC5yZXNvbHZlKGRvd25sb2FkTm92ZWwob3B0aW9ucy5ub3ZlbF9pZCwgb3B0aW9ucy5zaXRlSUQsIG9wdGlvbnMub3V0cHV0RGlyKSlcblx0XHRcdFx0XHRcdC5jYXRjaChhc3luYyAoZSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAoaXM1MDQoZSkpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmRpcihlKTtcblxuXHRcdFx0XHRcdFx0XHRcdGF3YWl0IEJsdWViaXJkLmRlbGF5KDUwMDApO1xuXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGRvd25sb2FkTm92ZWwob3B0aW9ucy5ub3ZlbF9pZCwgb3B0aW9ucy5zaXRlSUQsIG9wdGlvbnMub3V0cHV0RGlyKVxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGUpXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnRhcENhdGNoKGUgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAoaXM1MDQoZSkpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRlLlN0YXR1c0NvZGUgPSA1MDQ7XG5cdFx0XHRcdFx0XHRcdFx0ZS5vcHRpb25zID0gb3B0aW9ucztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC50aGVuKHZhbHVlID0+IHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0XHQuLi5vcHRpb25zLFxuXHRcdFx0XHRcdFx0XHRcdC4uLnZhbHVlLFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LnRhcENhdGNoKGFzeW5jIChlKSA9PiB7XG5cblx0XHRcdFx0XHRcdFx0aWYgKGlzNTA0KGUpKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0bGV0IG1hcF9maWxlID0gX19jYWNoZU1hcEZpbGU7XG5cblx0XHRcdFx0XHRcdFx0XHRsZXQgbWFwOiBJQ2FjaGVNYXAgPSBhd2FpdCByZWFkSlNPTihtYXBfZmlsZSlcblx0XHRcdFx0XHRcdFx0XHRcdC5jYXRjaChlID0+ICh7fSkpXG5cdFx0XHRcdFx0XHRcdFx0O1xuXG5cdFx0XHRcdFx0XHRcdFx0bGV0IF9kYXRhID0gbWFwW0lES0VZXSA9IG1hcFtJREtFWV0gfHwge307XG5cblx0XHRcdFx0XHRcdFx0XHRpZiAoIV9kYXRhW29wdGlvbnMubm92ZWxfaWRdIHx8IF9kYXRhW29wdGlvbnMubm92ZWxfaWRdLnN0YXR1cyAhPT0gRW51bUNhY2hlTWFwUm93U3RhdHVzLkRPTkUpXG5cdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0X2RhdGFbb3B0aW9ucy5ub3ZlbF9pZF0gPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG91dHB1dFJvb3Q6IG9wdGlvbnMub3V0cHV0RGlyLFxuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdFx0XHRcdFx0Li4uX2RhdGFbb3B0aW9ucy5ub3ZlbF9pZF0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC4uLm9wdGlvbnMsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC4uLmUub3B0aW9ucyxcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IEVudW1DYWNoZU1hcFJvd1N0YXR1cy5XQUlUSU5HX1JFVFJZLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KCksXG5cdFx0XHRcdFx0XHRcdFx0XHR9IGFzIGFueTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIF9kYXRhW29wdGlvbnMubm92ZWxfaWRdLnJlbW92ZUNhbGxiYWNrO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRhd2FpdCB3cml0ZUpTT04obWFwX2ZpbGUsIG1hcCwge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRzcGFjZXM6IDIsXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gb3B0aW9ucy5yZW1vdmVDYWxsYmFjaygpXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZG93bmxvYWROb3ZlbChub3ZlbF9pZDogc3RyaW5nIHwgbnVtYmVyLCBzaXRlSUQ6IHN0cmluZyB8IEVudW1Ob3ZlbFNpdGVMaXN0LCBvdXRwdXREaXIgPSBPVVRQVVRfRElSKVxue1xuXHRsZXQgSURLRVkgPSBzaXRlSUQySURLRVkoc2l0ZUlEKTtcblxuXHRhd2FpdCBlbnN1cmVEaXIoam9pbihvdXRwdXREaXIsIElES0VZLCBTdHJpbmcobm92ZWxfaWQpKSk7XG5cdC8vYXdhaXQgZW1wdHlEaXIoam9pbihvdXRwdXREaXIsIElES0VZLCBTdHJpbmcobm92ZWxfaWQpKSk7XG5cblx0YXdhaXQgZW5zdXJlRmlsZShqb2luKG91dHB1dERpciwgSURLRVksIFN0cmluZyhub3ZlbF9pZCksICcuZ2l0a2VlcCcpKTtcblxuXHRsZXQgbm92ZWwgPSBhd2FpdCBkb3dubG9hZChTdHJpbmcobm92ZWxfaWQpLCB7XG5cdFx0ZGlzYWJsZVR4dGRvd25sb2FkOiB0cnVlLFxuXHRcdC8vZGlzYWJsZUNoZWNrRXhpc3RzOiB0cnVlLFxuXHRcdGtlZXBJbWFnZTogdHJ1ZSxcblx0XHRrZWVwUnVieTogdHJ1ZSxcblx0XHRrZWVwRm9ybWF0OiB0cnVlLFxuXHRcdGRlYnVnTG9nOiB0cnVlLFxuXHR9LCBzaXRlSUQgYXMgRW51bU5vdmVsU2l0ZUxpc3QsIHtcblx0XHRvdXRwdXREaXIsXG5cdFx0cGF0aE5vdmVsU3R5bGU6IHRydWUsXG5cdFx0a2VlcEltYWdlOiB0cnVlLFxuXHRcdGtlZXBSdWJ5OiB0cnVlLFxuXHRcdGtlZXBGb3JtYXQ6IHRydWUsXG5cdFx0ZGVidWdMb2c6IHRydWUsXG5cdH0pO1xuXG5cdGxldCBjd2QgPSBqb2luKG91dHB1dERpciwgSURLRVksIG5vdmVsLnVybF9kYXRhLm5vdmVsX2lkKTtcblxuXHRhd2FpdCBGYXN0R2xvYihbXG5cdFx0JyoqLyoudHh0Jyxcblx0XSwge1xuXHRcdGN3ZCxcblx0XHRhYnNvbHV0ZTogdHJ1ZSxcblx0fSkuZWFjaChhc3luYyAoZmlsZSkgPT5cblx0e1xuXG5cdFx0bGV0IHN0ID0gYXdhaXQgc3RhdChmaWxlKTtcblxuXHRcdGlmIChzdC5zaXplIDwgNSlcblx0XHR7XG5cdFx0XHRyZXR1cm4gcmVtb3ZlKGZpbGUpXG5cdFx0fVxuXG5cdH0pXG5cblx0cmV0dXJuIHtcblx0XHRjd2QsXG5cdFx0SURLRVksXG5cdFx0bm92ZWxfaWQ6IG5vdmVsLnVybF9kYXRhLm5vdmVsX2lkIGFzIHN0cmluZyxcblx0XHRub3ZlbCxcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBkb3dubG9hZE5vdmVsXG5cbiJdfQ==