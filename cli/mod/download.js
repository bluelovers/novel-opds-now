#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const download_1 = __importDefault(require("../../lib/download"));
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
    .argv;
download_1.default(argv.novel_id, argv.siteID, argv.outputDir)
    .then(v => console.log(true));
//# sourceMappingURL=download.js.map