"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCache = void 0;
const local_or_rebuild_file_1 = require("@demonovel/local-or-rebuild-file");
const util_1 = require("../util");
const logger_1 = __importDefault(require("debug-color2/logger"));
const build_1 = require("./build");
function loadCache() {
    return local_or_rebuild_file_1.getLocalOrRebuild(util_1.getCacheFilename('masiro/builded.json'), {
        console: logger_1.default,
        makeFns: [
            () => {
                logger_1.default.debug(`嘗試更新 masiro`);
                return build_1.buildCache()
                    .tap(v => logger_1.default.success(`[masiro] 更新完成`));
            },
        ],
    });
}
exports.loadCache = loadCache;
exports.default = loadCache;
//# sourceMappingURL=load.js.map