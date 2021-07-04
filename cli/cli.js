#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const yargs_1 = (0, tslib_1.__importDefault)(require("yargs"));
const child_process_1 = require("child_process");
const const_1 = require("../lib/const");
const path_1 = require("path");
let argv = yargs_1.default
    .option('mod', {
    string: true,
    demandOption: true,
    alias: ['m'],
})
    .option('siteID', {
    string: true,
    demandOption: true,
    alias: ['s'],
})
    .option('outputDir', {
    string: true,
    default: const_1.OUTPUT_DIR,
})
    .option('novel_id', {
    string: true,
    demandOption: true,
    alias: ['i'],
})
    .parseSync();
switch (argv.mod) {
    case 'handle':
        if (argv.mod.includes('..')) {
            console.dir(argv);
            throw new Error();
        }
        (0, child_process_1.spawnSync)('node', [
            '--experimental-worker',
            (0, path_1.resolve)(__dirname, `./mod/${argv.mod}`),
            '--IDKEY',
            argv.siteID,
            '--novel_id',
            argv.novel_id,
            '--outputDir',
            argv.outputDir,
        ], {
            stdio: 'inherit',
        });
        break;
    default:
        if (argv.mod.includes('..')) {
            console.dir(argv);
            throw new Error();
        }
        (0, child_process_1.spawnSync)('node', [
            (0, path_1.resolve)(__dirname, `./mod/${argv.mod}`),
            '--siteID',
            argv.siteID,
            '--novel_id',
            argv.novel_id,
            '--outputDir',
            argv.outputDir,
        ], {
            stdio: 'inherit',
        });
        break;
}
//# sourceMappingURL=cli.js.map