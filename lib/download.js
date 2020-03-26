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
//# sourceMappingURL=download.js.map