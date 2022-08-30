#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("source-map-support/register");
const yargs_1 = tslib_1.__importDefault(require("yargs"));
const download_1 = tslib_1.__importDefault(require("../../lib/epub/download"));
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
    demandOption: true,
})
    .parseSync();
(0, download_1.default)(argv.novel_id, argv.siteID, argv.outputDir)
    .then(v => console.log(true));
//# sourceMappingURL=download.js.map