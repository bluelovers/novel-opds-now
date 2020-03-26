"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSort = exports.buildSortAll = void 0;
const load_1 = __importDefault(require("./load"));
const types_1 = require("./types");
const bluebird_1 = __importDefault(require("bluebird"));
const fs_extra_1 = require("fs-extra");
function buildSortAll() {
    return bluebird_1.default.resolve(Object.keys(types_1.id_titles_map))
        .map((siteID) => buildSort(siteID));
}
exports.buildSortAll = buildSortAll;
function buildSort(siteID) {
    return bluebird_1.default.props({
        id_titles: load_1.default(siteID, types_1.id_titles_map),
        id_update: load_1.default(siteID, types_1.id_update_map),
        id_chapters: load_1.default(siteID, types_1.id_chapters_map),
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
        return fs_extra_1.outputJSON(types_1.getLocalFilename(siteID, types_1.builded_map), data, {
            spaces: 2,
        });
    });
}
exports.buildSort = buildSort;
exports.default = buildSortAll;
//# sourceMappingURL=build.js.map