#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const threads_1 = __importDefault(require("../lib/threads"));
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
    .argv;
threads_1.default(argv.novel_id, argv.IDKEY, argv.outputDir)
    .then(v => console.log(`ok`, v))
    .tapCatch(e => console.error(`fail`, e));
//# sourceMappingURL=handle.js.map