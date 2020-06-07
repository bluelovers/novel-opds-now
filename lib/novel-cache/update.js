"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCache = exports.updateCache = exports.updateCacheAll = void 0;
const types_1 = require("./types");
const bluebird_1 = __importDefault(require("bluebird"));
const fs_extra_1 = require("fs-extra");
const fetch_1 = __importDefault(require("../fetch"));
const build_1 = __importDefault(require("./build"));
const logger_1 = __importDefault(require("debug-color2/logger"));
const getProxy_1 = __importDefault(require("../getProxy"));
function updateCacheAll(force) {
    return bluebird_1.default.all(Object.keys(types_1.id_titles_map)
        .reduce((a, b) => {
        a.push(updateCache(b, types_1.id_titles_map, force));
        a.push(updateCache(b, types_1.id_update_map, force));
        a.push(updateCache(b, types_1.id_chapters_map, force));
        return a;
    }, []))
        .then(v => build_1.default());
}
exports.updateCacheAll = updateCacheAll;
async function updateCache(siteID, map, force) {
    let localFile = types_1.getLocalFilename(siteID, map);
    return bluebird_1.default.resolve(fs_extra_1.stat(localFile))
        .then(async (st) => {
        if (!force && st && (Date.now() - st.mtimeMs) < 12 * 3600 * 1000) {
            return fs_extra_1.readJSON(localFile);
        }
        return Promise.reject();
    })
        .catch(e => {
        let proxy = getProxy_1.default();
        if (proxy) {
            logger_1.default.debug(`use proxy`, proxy);
        }
        logger_1.default.debug(`[${siteID}] 嘗試更新 ${map[siteID]}`);
        return fetchCache(siteID, map)
            .tap(v => logger_1.default.debug(`[${siteID}] 更新完成 ${map[siteID]}`));
    })
        .catch(e => {
        logger_1.default.warn(e.code, e.message || e);
        return fs_extra_1.readJSON(localFile);
    })
        .catch(e => {
        logger_1.default.warn(e.message || e);
        let moduleFile = `${types_1.pathPrefix.module}${map[siteID]}`;
        return Promise.resolve().then(() => __importStar(require(moduleFile))).then(v => v.default || v);
    })
        .then(data => fs_extra_1.outputJSON(localFile, data, { spaces: 2 }));
}
exports.updateCache = updateCache;
function fetchCache(siteID, map) {
    return bluebird_1.default
        .resolve(fetch_1.default(`${types_1.pathPrefix.github}${map[siteID]}`))
        .then(v => {
        return bluebird_1.default.resolve(v.json())
            .tapCatch(async (e) => {
            try {
                logger_1.default.red.dir(await v.text());
            }
            catch (e) {
            }
        });
    });
}
exports.fetchCache = fetchCache;
exports.default = updateCacheAll;
//# sourceMappingURL=update.js.map