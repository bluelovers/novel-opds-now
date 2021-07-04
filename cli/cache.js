#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const yargs_1 = (0, tslib_1.__importDefault)(require("yargs"));
const update_cache_1 = require("../lib/task/update-cache");
let argv = yargs_1.default
    .option('force', {
    boolean: true,
    alias: ['f'],
})
    .argv;
(0, update_cache_1.updateAllCacheTask)(argv.force);
//# sourceMappingURL=cache.js.map