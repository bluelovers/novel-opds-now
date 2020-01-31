"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("novel-segment/lib/segment/core"));
const useModules2_1 = require("novel-segment/lib/segment/methods/useModules2");
const mod_1 = __importDefault(require("novel-segment/lib/mod"));
let CACHED_SEGMENT;
function createSegment() {
    return new core_1.default({
        autoCjk: true,
        optionsDoSegment: {
            convertSynonym: true,
        },
        all_mod: true,
    });
}
async function getSegment() {
    if (CACHED_SEGMENT) {
        return CACHED_SEGMENT;
    }
    const DICT = await Promise.resolve().then(() => __importStar(require(`${__dirname}/../.cache/cache.json`))).then(v => v.default || v);
    CACHED_SEGMENT = createSegment();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9TZWdtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZG9TZWdtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUdBLDBFQUE0RTtBQUM1RSwrRUFBMkU7QUFDM0UsZ0VBQXNEO0FBRXRELElBQUksY0FBdUIsQ0FBQztBQUU1QixTQUFTLGFBQWE7SUFFckIsT0FBTyxJQUFJLGNBQU8sQ0FBQztRQUNsQixPQUFPLEVBQUUsSUFBSTtRQUNiLGdCQUFnQixFQUFFO1lBQ2pCLGNBQWMsRUFBRSxJQUFJO1NBQ3BCO1FBQ0QsT0FBTyxFQUFFLElBQUk7S0FDYixDQUFDLENBQUM7QUFDSixDQUFDO0FBRUQsS0FBSyxVQUFVLFVBQVU7SUFFeEIsSUFBSSxjQUFjLEVBQ2xCO1FBQ0MsT0FBTyxjQUFjLENBQUM7S0FDdEI7SUFFRCxNQUFNLElBQUksR0FBRyxNQUFNLGtEQUFPLEdBQUcsU0FBUyx1QkFBdUIsSUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBUSxDQUFDO0lBRWhHLGNBQWMsR0FBRyxhQUFhLEVBQUUsQ0FBQztJQUVqQyx3QkFBVSxDQUFDLGNBQXFCLEVBQUUsYUFBaUIsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFFckYsY0FBYyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDM0IsY0FBYyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFFN0IsT0FBTyxjQUFjLENBQUE7QUFDdEIsQ0FBQztBQUVELFNBQVMsU0FBUyxDQUFDLElBQVksRUFBRSxPQUEyQjtJQUUzRCxPQUFPLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFO1FBQy9DLEdBQUcsT0FBTztRQUNWLE1BQU0sRUFBRSxJQUFJO0tBQ1osQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ2IsQ0FBQztBQUVELGtCQUFlLFNBQVMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMjAvMS8zMC5cbiAqL1xuaW1wb3J0IFNlZ21lbnQsIHsgSU9wdGlvbnNEb1NlZ21lbnQgfSBmcm9tICdub3ZlbC1zZWdtZW50L2xpYi9zZWdtZW50L2NvcmUnO1xuaW1wb3J0IHsgdXNlTW9kdWxlcyB9IGZyb20gJ25vdmVsLXNlZ21lbnQvbGliL3NlZ21lbnQvbWV0aG9kcy91c2VNb2R1bGVzMic7XG5pbXBvcnQgZ2V0RGVmYXVsdE1vZExpc3QgZnJvbSAnbm92ZWwtc2VnbWVudC9saWIvbW9kJztcblxubGV0IENBQ0hFRF9TRUdNRU5UOiBTZWdtZW50O1xuXG5mdW5jdGlvbiBjcmVhdGVTZWdtZW50KClcbntcblx0cmV0dXJuIG5ldyBTZWdtZW50KHtcblx0XHRhdXRvQ2prOiB0cnVlLFxuXHRcdG9wdGlvbnNEb1NlZ21lbnQ6IHtcblx0XHRcdGNvbnZlcnRTeW5vbnltOiB0cnVlLFxuXHRcdH0sXG5cdFx0YWxsX21vZDogdHJ1ZSxcblx0fSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldFNlZ21lbnQoKVxue1xuXHRpZiAoQ0FDSEVEX1NFR01FTlQpXG5cdHtcblx0XHRyZXR1cm4gQ0FDSEVEX1NFR01FTlQ7XG5cdH1cblxuXHRjb25zdCBESUNUID0gYXdhaXQgaW1wb3J0KGAke19fZGlybmFtZX0vLi4vLmNhY2hlL2NhY2hlLmpzb25gKS50aGVuKHYgPT4gdi5kZWZhdWx0IHx8IHYpIGFzIGFueTtcblxuXHRDQUNIRURfU0VHTUVOVCA9IGNyZWF0ZVNlZ21lbnQoKTtcblxuXHR1c2VNb2R1bGVzKENBQ0hFRF9TRUdNRU5UIGFzIGFueSwgZ2V0RGVmYXVsdE1vZExpc3QoQ0FDSEVEX1NFR01FTlQub3B0aW9ucy5hbGxfbW9kKSk7XG5cblx0Q0FDSEVEX1NFR01FTlQuRElDVCA9IERJQ1Q7XG5cdENBQ0hFRF9TRUdNRU5ULmluaXRlZCA9IHRydWU7XG5cblx0cmV0dXJuIENBQ0hFRF9TRUdNRU5UXG59XG5cbmZ1bmN0aW9uIGRvU2VnbWVudCh0ZXh0OiBzdHJpbmcsIG9wdGlvbnM/OiBJT3B0aW9uc0RvU2VnbWVudClcbntcblx0cmV0dXJuIGdldFNlZ21lbnQoKS50aGVuKHYgPT4gdi5kb1NlZ21lbnQodGV4dCwge1xuXHRcdC4uLm9wdGlvbnMsXG5cdFx0c2ltcGxlOiB0cnVlLFxuXHR9KS5qb2luKCcnKSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgZG9TZWdtZW50XG4iXX0=