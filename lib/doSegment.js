"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doSegment = exports.getSegment = exports.replaceSegmentDict = exports.existsSegment = void 0;
const tslib_1 = require("tslib");
const useModules2_1 = require("novel-segment/lib/segment/methods/useModules2");
const mod_1 = tslib_1.__importDefault(require("novel-segment/lib/mod"));
const createSegment_1 = tslib_1.__importDefault(require("./segment/createSegment"));
const const_1 = require("./segment/const");
const fs_extra_1 = require("fs-extra");
let CACHED_SEGMENT;
function existsSegment() {
    return !!CACHED_SEGMENT;
}
exports.existsSegment = existsSegment;
async function replaceSegmentDict() {
    if (existsSegment()) {
        const DICT = await (0, fs_extra_1.readJSON)(const_1.file)
            .catch(e => void 0);
        if (Object.keys(DICT).length > 2) {
            await (0, useModules2_1.useModules)(CACHED_SEGMENT, (0, mod_1.default)(CACHED_SEGMENT.options.all_mod));
            CACHED_SEGMENT.DICT = DICT;
            CACHED_SEGMENT.inited = true;
        }
        return true;
    }
}
exports.replaceSegmentDict = replaceSegmentDict;
async function getSegment() {
    if (CACHED_SEGMENT) {
        return CACHED_SEGMENT;
    }
    CACHED_SEGMENT = (0, createSegment_1.default)();
    await replaceSegmentDict();
    return CACHED_SEGMENT;
}
exports.getSegment = getSegment;
function doSegment(text, options) {
    return getSegment().then(v => v.doSegment(text, {
        ...options,
        simple: true,
    }).join(''));
}
exports.doSegment = doSegment;
exports.default = doSegment;
//# sourceMappingURL=doSegment.js.map