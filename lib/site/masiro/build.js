"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCache = void 0;
const tslib_1 = require("tslib");
const update_1 = require("./update");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const uuid_1 = (0, tslib_1.__importDefault)(require("@demonovel/uuid"));
const build_1 = require("../cached-data/build");
const build_map_1 = require("../cached-data/build-map");
function buildCache(force) {
    const siteID = 'masiro';
    return bluebird_1.default.props({
        table: (0, build_1.updateCache)(siteID, force),
        table_update: (0, update_1.updateCache2)(force),
    })
        .then(({ table, table_update, }) => {
        return Object.entries(table_update)
            .sort((a, b) => b[1] - a[1])
            .reduce((a, [id, value]) => {
            let uuid = (0, uuid_1.default)(siteID, id);
            let row = table[uuid];
            if (row.title) {
                a.push({
                    uuid,
                    id,
                    title: row.title,
                    authors: void 0,
                    cover: row.cover,
                    updated: row.updated,
                    content: row.content,
                });
            }
            return a;
        }, []);
    })
        .tap(list => {
        return (0, build_map_1._buildMap)(siteID, list);
    });
}
exports.buildCache = buildCache;
//# sourceMappingURL=build.js.map