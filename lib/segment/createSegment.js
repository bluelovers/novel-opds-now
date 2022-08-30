"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSegment = void 0;
const tslib_1 = require("tslib");
const Segment_1 = tslib_1.__importDefault(require("novel-segment/lib/Segment"));
function createSegment() {
    return new Segment_1.default({
        autoCjk: true,
        optionsDoSegment: {
            convertSynonym: true,
        },
        all_mod: true,
        nodeNovelMode: true,
    });
}
exports.createSegment = createSegment;
exports.default = createSegment;
//# sourceMappingURL=createSegment.js.map