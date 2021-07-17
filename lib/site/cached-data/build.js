"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCache = exports.updateCache = void 0;
const tslib_1 = require("tslib");
const local_or_rebuild_file_1 = require("@demonovel/local-or-rebuild-file");
const index_1 = require("../../util/index");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const fetch_1 = (0, tslib_1.__importDefault)(require("../../fetch"));
const build_map_1 = require("./build-map");
function updateCache(siteID, force) {
    const url = `https://raw.githubusercontent.com/bluelovers/ws-rest/master/packages/%40demonovel/cached-data/cache/build/${siteID}.json`;
    return (0, local_or_rebuild_file_1.getLocalOrRebuild)((0, index_1.getCacheFilename)(`${siteID}/${siteID}.json`), {
        console: logger_1.default,
        force,
        makeFns: [
            () => (0, fetch_1.default)(url).then(res => res.json()),
        ],
        fallback: {
            module: `@demonovel/cached-data/cache/build/${siteID}`,
        },
    });
}
exports.updateCache = updateCache;
function buildCache(siteID, force) {
    return updateCache(siteID, force)
        .then(table => {
        return Object.values(table)
            .sort((a, b) => b.updated - a.updated)
            .map(novel => {
            var _a;
            let { title, id, authors, cover, content, updated, uuid, } = novel;
            content = (_a = content === null || content === void 0 ? void 0 : content.replace) === null || _a === void 0 ? void 0 : _a.call(content, /\u001f/g, '');
            return {
                uuid,
                id,
                title,
                authors,
                cover,
                updated,
                content,
            };
        });
    })
        .tap(list => {
        return (0, build_map_1._buildMap)(siteID, list);
    });
}
exports.buildCache = buildCache;
//# sourceMappingURL=build.js.map