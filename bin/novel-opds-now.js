#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const yargs_1 = (0, tslib_1.__importDefault)(require("yargs"));
const update_notifier_1 = (0, tslib_1.__importDefault)(require("@yarn-tool/update-notifier"));
const getPort_1 = (0, tslib_1.__importStar)(require("../lib/getPort"));
const index_1 = (0, tslib_1.__importDefault)(require("../index"));
(0, update_notifier_1.default)([__dirname, '..']);
let argv = yargs_1.default
    .option('port', {
    number: true,
    alias: ['p'],
    default: (0, getPort_1.default)((0, getPort_1.getPortEnv)())
})
    .option('proxy', {
    string: true,
})
    .parseSync();
exports.default = (0, index_1.default)(argv);
//# sourceMappingURL=novel-opds-now.js.map