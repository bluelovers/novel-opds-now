#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("source-map-support/register");
const yargs_1 = (0, tslib_1.__importDefault)(require("yargs"));
const download_1 = require("../../lib/epub/download");
const threads_1 = (0, tslib_1.__importDefault)(require("../lib/threads"));
const novel_epub_1 = (0, tslib_1.__importDefault)(require("novel-epub"));
const fs_extra_1 = require("fs-extra");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const const_1 = require("../../lib/const");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const getNovelData_1 = require("../../lib/site/cached-data/getNovelData");
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
    .parseSync();
bluebird_1.default
    .resolve((0, download_1.downloadNovel2)({
    novel_id: argv.novel_id,
    siteID: argv.siteID,
    outputRoot: argv.outputDir,
    useCached: true,
}))
    .then(async ({ options, download, }) => {
    let { cwd, novel_id, IDKEY, outputDir, novel, ...arr } = await download()
        .tapCatch(e => {
        logger_1.default.error(`[epub]`, IDKEY, novel_id, `下載來源時發生錯誤`, e);
    });
    let _info = await (0, getNovelData_1.getNovelData)(arr.siteID, novel_id);
    logger_1.default.success(`[epub]`, IDKEY, novel_id, _info === null || _info === void 0 ? void 0 : _info.title, `來源下載完成，開始處理排版`, outputDir);
    await (0, threads_1.default)(argv.novel_id, IDKEY, outputDir)
        .tapCatch(e => {
        logger_1.default.error(`[epub]`, IDKEY, novel_id, _info === null || _info === void 0 ? void 0 : _info.title, `處理排版時發生錯誤`, e);
    });
    logger_1.default.success(`[epub]`, IDKEY, novel_id, _info === null || _info === void 0 ? void 0 : _info.title, `排版結束，開始打包 epub`);
    let epub = await (0, novel_epub_1.default)({
        inputPath: cwd,
        outputPath: cwd,
        padEndDate: false,
        filename: novel_id,
        downloadRemoteFile: true,
        epubContextDate: true,
        beforeMakeEpub() {
            logger_1.default.debug(`[epub]`, IDKEY, novel_id, _info === null || _info === void 0 ? void 0 : _info.title, `結構分析完成，開始打包 epub`);
        },
    })
        .tapCatch(e => {
        logger_1.default.error(`[epub]`, IDKEY, novel_id, _info === null || _info === void 0 ? void 0 : _info.title, `打包 epub 時發生錯誤`, e);
    });
    logger_1.default.success(`[epub]`, IDKEY, novel_id, _info === null || _info === void 0 ? void 0 : _info.title, `打包 epub 結束`);
    let map_file = const_1.__cacheMapFile;
    let map = await (0, fs_extra_1.readJSON)(map_file)
        .catch(e => {
        return {};
    });
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
    await (0, fs_extra_1.outputJSON)(map_file, map, {
        spaces: 2,
    });
})
    .tapCatch(e => logger_1.default.error(`[epub]`, e));
//# sourceMappingURL=all.js.map