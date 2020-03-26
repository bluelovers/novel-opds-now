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
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const useModules2_1 = require("novel-segment/lib/segment/methods/useModules2");
const mod_1 = __importDefault(require("novel-segment/lib/mod"));
const __root_1 = __importDefault(require("./__root"));
const createSegment_1 = __importDefault(require("./segment/createSegment"));
let CACHED_SEGMENT;
async function getSegment() {
    if (CACHED_SEGMENT) {
        return CACHED_SEGMENT;
    }
    const DICT = await Promise.resolve().then(() => __importStar(require(`${__root_1.default}/.cache/cache.json`))).then(v => v.default || v);
    CACHED_SEGMENT = createSegment_1.default();
    useModules2_1.useModules(CACHED_SEGMENT, mod_1.default(CACHED_SEGMENT.options.all_mod));
    CACHED_SEGMENT.DICT = DICT;
    CACHED_SEGMENT.inited = true;
    return CACHED_SEGMENT;
}
function doSegment(text, options) {
    return getSegment().then(v => v.doSegment(text, {
        ...options,
        simple: true,
    }).join(''));
}
exports.default = doSegment;
//# sourceMappingURL=doSegment.js.map