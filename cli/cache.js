#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const update_1 = __importDefault(require("../lib/novel-cache/update"));
const logger_1 = __importDefault(require("debug-color2/logger"));
const buildCache_1 = __importDefault(require("../lib/buildCache"));
const update_2 = __importDefault(require("../lib/demonovel/update"));
let argv = yargs_1.default
    .option('force', {
    boolean: true,
    alias: ['f'],
})
    .argv;
buildCache_1.default(argv.force)
    .catch(e => logger_1.default.error(e));
update_1.default(argv.force)
    .catch(e => logger_1.default.error(e));
update_2.default(argv.force)
    .catch(e => logger_1.default.error(e));
//# sourceMappingURL=cache.js.map