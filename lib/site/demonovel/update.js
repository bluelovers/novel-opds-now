"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCache = void 0;
const tslib_1 = require("tslib");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const fs_extra_1 = require("fs-extra");
const fetch_1 = (0, tslib_1.__importDefault)(require("../../fetch"));
const load_1 = require("./load");
const build_1 = (0, tslib_1.__importDefault)(require("./build"));
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const getProxy_1 = (0, tslib_1.__importDefault)(require("../../util/getProxy"));
let url = `https://gitlab.com/novel-group/txt-source/raw/master/novel-stat.json`;
async function updateCache(force) {
    let localFile = (0, load_1.getLocalFilename)();
    return bluebird_1.default.resolve((0, fs_extra_1.stat)(localFile))
        .then(async (st) => {
        if (!force && st && (Date.now() - st.mtimeMs) < 12 * 60 * 60 * 1000) {
            return (0, fs_extra_1.readJSON)(localFile);
        }
        return Promise.reject();
    })
        .catch(e => {
        let proxy = (0, getProxy_1.default)();
        if (proxy) {
            logger_1.default.debug(`use proxy`, proxy);
        }
        logger_1.default.debug(`嘗試更新 demonovel`);
        return fetchCache()
            .tap(v => logger_1.default.debug(`更新完成`));
    })
        .catch(e => {
        logger_1.default.warn(e.message || e);
        return (0, fs_extra_1.readJSON)(localFile);
    })
        .tap(data => (0, fs_extra_1.outputJSON)(localFile, data, { spaces: 2 }))
        .tap(v => (0, build_1.default)());
}
exports.updateCache = updateCache;
function fetchCache() {
    return bluebird_1.default
        .resolve((0, fetch_1.default)(url))
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
exports.default = updateCache;
//# sourceMappingURL=update.js.map