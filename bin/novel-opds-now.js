#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const yargs_1 = (0, tslib_1.__importDefault)(require("yargs"));
const update_notifier_1 = (0, tslib_1.__importDefault)(require("@yarn-tool/update-notifier"));
const index_1 = (0, tslib_1.__importDefault)(require("../index"));
(0, update_notifier_1.default)([__dirname, '..']);
let argv = yargs_1.default
    .option('port', {
    number: true,
    alias: ['p'],
})
    .option('proxy', {
    string: true,
})
    .option('disposable', {
    boolean: true,
    desc: `啟用 disposable 模式來執行拋棄式 IPFS 伺服器`,
    default: process.env.IPFS_DISPOSABLE,
})
    .option('calibrePaths', {
    desc: `CALIBRE_PATH=${process.env.CALIBRE_PATH}`,
    array: true,
    string: true,
})
    .showHelp()
    .parseSync();
exports.default = (0, index_1.default)(argv);
//# sourceMappingURL=novel-opds-now.js.map