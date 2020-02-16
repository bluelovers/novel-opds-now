"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlU2VnbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNyZWF0ZVNlZ21lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQSx3RUFBZ0Q7QUFFaEQsU0FBZ0IsYUFBYTtJQUU1QixPQUFPLElBQUksaUJBQU8sQ0FBQztRQUNsQixPQUFPLEVBQUUsSUFBSTtRQUNiLGdCQUFnQixFQUFFO1lBQ2pCLGNBQWMsRUFBRSxJQUFJO1NBQ3BCO1FBQ0QsT0FBTyxFQUFFLElBQUk7UUFDYixhQUFhLEVBQUUsSUFBSTtLQUNuQixDQUFDLENBQUM7QUFDSixDQUFDO0FBVkQsc0NBVUM7QUFFRCxrQkFBZSxhQUFhLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzIvMTYuXG4gKi9cblxuaW1wb3J0IFNlZ21lbnQgZnJvbSAnbm92ZWwtc2VnbWVudC9saWIvU2VnbWVudCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTZWdtZW50KClcbntcblx0cmV0dXJuIG5ldyBTZWdtZW50KHtcblx0XHRhdXRvQ2prOiB0cnVlLFxuXHRcdG9wdGlvbnNEb1NlZ21lbnQ6IHtcblx0XHRcdGNvbnZlcnRTeW5vbnltOiB0cnVlLFxuXHRcdH0sXG5cdFx0YWxsX21vZDogdHJ1ZSxcblx0XHRub2RlTm92ZWxNb2RlOiB0cnVlLFxuXHR9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlU2VnbWVudFxuIl19