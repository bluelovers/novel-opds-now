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
    logger_1.default.log(`排版結束，開始打包 epub`);
    let epub = await novel_epub_1.default({
        inputPath: cwd,
        outputPath: cwd,
        padEndDate: false,
        filename: novel_id,
        downloadRemoteFile: true,
        epubContextDate: true,
    })
        .tapCatch(e => {
        logger_1.default.error(`打包 epub 時發生錯誤`, e);
    });
    logger_1.default.log(`打包 epub 結束`);
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
    logger_1.default.dir({
        IDKEY,
        novel_id,
    });
    await fs_extra_1.outputJSON(map_file, map, {
        spaces: 2,
    });
});
//# sourceMappingURL=all.js.map