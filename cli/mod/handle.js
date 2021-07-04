#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const yargs_1 = (0, tslib_1.__importDefault)(require("yargs"));
const threads_1 = (0, tslib_1.__importDefault)(require("../lib/threads"));
let argv = yargs_1.default
    .option('IDKEY', {
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
(0, threads_1.default)(argv.novel_id, argv.IDKEY, argv.outputDir)
    .then(v => console.log(`ok`, v))
    .tapCatch(e => console.error(`fail`, e));
//# sourceMappingURL=handle.js.map