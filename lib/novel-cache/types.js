"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalFilename = exports.pathPrefix = exports.builded_map = exports.id_chapters_map = exports.id_update_map = exports.id_titles_map = void 0;
const path_1 = require("path");
const __root_1 = __importDefault(require("../__root"));
exports.id_titles_map = {
    dmzj: 'cached-dmzj/data/novel/id_titles.json',
    esjzone: 'cached-esjzone/data/novel/id_titles.json',
    wenku8: 'cached-wenku8/data/novel/id_titles.json',
};
exports.id_update_map = {
    dmzj: 'cached-dmzj/data/novel/id_update.json',
    esjzone: 'cached-esjzone/data/novel/id_update.json',
    wenku8: 'cached-wenku8/data/novel/id_update.json',
};
exports.id_chapters_map = {
    dmzj: 'cached-dmzj/data/novel/id_chapters.json',
    esjzone: 'cached-esjzone/data/novel/id_chapters.json',
    wenku8: 'cached-wenku8/data/novel/id_chapters.json',
};
exports.builded_map = {
    dmzj: 'builded.json',
    esjzone: 'builded.json',
    masiro: 'builded.json',
    wenku8: 'builded.json',
};
exports.pathPrefix = {
    module: '@node-novel/',
    github: 'https://github.com/bluelovers/ws-rest/raw/master/packages/%40node-novel/',
    cache: path_1.join(__root_1.default, '.cache', 'cached') + '/',
};
function getLocalFilename(siteID, map) {
    return `${exports.pathPrefix.cache}${siteID}/${path_1.basename(map[siteID])}`;
}
exports.getLocalFilename = getLocalFilename;
//# sourceMappingURL=types.js.map