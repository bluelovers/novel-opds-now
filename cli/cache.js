#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("v8-compile-cache");
require("source-map-support/register");
const yargs_1 = tslib_1.__importDefault(require("yargs"));
const update_cache_1 = require("../lib/task/update-cache");
const connect_build_in_peers_1 = require("../lib/ipfs/util/connect-build-in-peers");
let argv = yargs_1.default
    .option('force', {
    boolean: true,
    alias: ['f'],
})
    .parseSync();
Promise.all([
    (0, connect_build_in_peers_1.getCachePeers)(true),
    (0, update_cache_1.updateAllCacheTask)(argv.force),
]);
//# sourceMappingURL=cache.js.map