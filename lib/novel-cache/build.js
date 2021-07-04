"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSort = exports.buildSortAll = void 0;
const tslib_1 = require("tslib");
const load_1 = (0, tslib_1.__importDefault)(require("./load"));
const types_1 = require("./types");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const fs_extra_1 = require("fs-extra");
function buildSortAll() {
    return bluebird_1.default.resolve(Object.keys(types_1.id_titles_map))
        .map((siteID) => buildSort(siteID));
}
exports.buildSortAll = buildSortAll;
function buildSort(siteID) {
    return bluebird_1.default.props({
        id_titles: (0, load_1.default)(siteID, types_1.id_titles_map),
        id_update: (0, load_1.default)(siteID, types_1.id_update_map),
        id_chapters: (0, load_1.default)(siteID, types_1.id_chapters_map),
    })
        .then(({ id_titles, id_update, id_chapters, }) => {
        return id_update
            .filter(id => id_chapters[id] > 0)
            .map((id) => ({
            id,
            title: id_titles[id],
        }));
    })
        .then(data => {
        return (0, fs_extra_1.outputJSON)((0, types_1.getLocalFilename)(siteID, types_1.builded_map), data, {
            spaces: 2,
        });
    });
}
exports.buildSort = buildSort;
exports.default = buildSortAll;
//# sourceMappingURL=build.js.map