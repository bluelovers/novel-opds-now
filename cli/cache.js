#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const update_cache_1 = require("../lib/task/update-cache");
let argv = yargs_1.default
    .option('force', {
    boolean: true,
    alias: ['f'],
})
    .argv;
update_cache_1.updateAllCacheTask(argv.force);
//# sourceMappingURL=cache.js.map