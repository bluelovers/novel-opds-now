"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalFilename = exports.pathPrefix = exports.builded_map = void 0;
const tslib_1 = require("tslib");
const path_1 = require("path");
const __root_1 = (0, tslib_1.__importDefault)(require("../__root"));
exports.builded_map = {
    dmzj: 'builded.json',
    esjzone: 'builded.json',
    masiro: 'builded.json',
    wenku8: 'builded.json',
};
exports.pathPrefix = {
    module: '@node-novel/',
    github: 'https://github.com/bluelovers/ws-rest/raw/master/packages/%40node-novel/',
    cache: (0, path_1.join)(__root_1.default, '.cache', 'cached') + '/',
};
function getLocalFilename(siteID, map) {
    return `${exports.pathPrefix.cache}${siteID}/${(0, path_1.basename)(map[siteID])}`;
}
exports.getLocalFilename = getLocalFilename;
//# sourceMappingURL=types.js.map