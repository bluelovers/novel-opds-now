"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSegment = void 0;
const Segment_1 = __importDefault(require("novel-segment/lib/Segment"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlU2VnbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNyZWF0ZVNlZ21lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBSUEsd0VBQWdEO0FBRWhELFNBQWdCLGFBQWE7SUFFNUIsT0FBTyxJQUFJLGlCQUFPLENBQUM7UUFDbEIsT0FBTyxFQUFFLElBQUk7UUFDYixnQkFBZ0IsRUFBRTtZQUNqQixjQUFjLEVBQUUsSUFBSTtTQUNwQjtRQUNELE9BQU8sRUFBRSxJQUFJO1FBQ2IsYUFBYSxFQUFFLElBQUk7S0FDbkIsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQVZELHNDQVVDO0FBRUQsa0JBQWUsYUFBYSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8yLzE2LlxuICovXG5cbmltcG9ydCBTZWdtZW50IGZyb20gJ25vdmVsLXNlZ21lbnQvbGliL1NlZ21lbnQnO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU2VnbWVudCgpXG57XG5cdHJldHVybiBuZXcgU2VnbWVudCh7XG5cdFx0YXV0b0NqazogdHJ1ZSxcblx0XHRvcHRpb25zRG9TZWdtZW50OiB7XG5cdFx0XHRjb252ZXJ0U3lub255bTogdHJ1ZSxcblx0XHR9LFxuXHRcdGFsbF9tb2Q6IHRydWUsXG5cdFx0bm9kZU5vdmVsTW9kZTogdHJ1ZSxcblx0fSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVNlZ21lbnRcbiJdfQ==