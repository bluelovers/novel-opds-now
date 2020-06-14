"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCache2 = exports.updateCache = void 0;
const logger_1 = __importDefault(require("debug-color2/logger"));
const fetch_1 = __importDefault(require("../fetch"));
const util_1 = require("../util");
const local_or_rebuild_file_1 = require("@demonovel/local-or-rebuild-file");
const url = `https://raw.githubusercontent.com/bluelovers/ws-rest/master/packages/%40demonovel/cached-data/cache/build/masiro.json`;
const url2 = `https://raw.githubusercontent.com/demonovel/masiro-mega-to-ipfs/master/test/cache/cache.json`;
function updateCache(force) {
    return local_or_rebuild_file_1.getLocalOrRebuild(util_1.getCacheFilename('masiro/masiro.json'), {
        console: logger_1.default,
        makeFns: [
            () => fetch_1.default(url).then(res => res.json()),
        ],
        fallback: {
            module: '@demonovel/cached-data/cache/build/masiro',
        },
    });
}
exports.updateCache = updateCache;
function updateCache2(force) {
    return local_or_rebuild_file_1.getLocalOrRebuild(util_1.getCacheFilename('masiro/update.json'), {
        console: logger_1.default,
        makeFns: [
            () => fetch_1.default(url2).then(res => res.json()),
        ],
    });
}
exports.updateCache2 = updateCache2;
exports.default = updateCache;
updateCache2();
//# sourceMappingURL=update.js.map