"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doSegment = exports.getSegment = void 0;
const useModules2_1 = require("novel-segment/lib/segment/methods/useModules2");
const mod_1 = __importDefault(require("novel-segment/lib/mod"));
const createSegment_1 = __importDefault(require("./segment/createSegment"));
const const_1 = require("./segment/const");
const fs_extra_1 = require("fs-extra");
let CACHED_SEGMENT;
async function getSegment() {
    if (CACHED_SEGMENT) {
        return CACHED_SEGMENT;
    }
    const DICT = await fs_extra_1.readJSON(const_1.file)
        .catch(e => void 0);
    CACHED_SEGMENT = createSegment_1.default();
    if (Object.keys(DICT).length > 2) {
        useModules2_1.useModules(CACHED_SEGMENT, mod_1.default(CACHED_SEGMENT.options.all_mod));
        CACHED_SEGMENT.DICT = DICT;
        CACHED_SEGMENT.inited = true;
    }
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