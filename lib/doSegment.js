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
const __root_1 = __importDefault(require("./__root"));
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
    const DICT = await Promise.resolve().then(() => __importStar(require(`${__root_1.default}/.cache/cache.json`))).then(v => v.default || v);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9TZWdtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZG9TZWdtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUdBLDBFQUE0RTtBQUM1RSwrRUFBMkU7QUFDM0UsZ0VBQXNEO0FBQ3RELHNEQUE4QjtBQUU5QixJQUFJLGNBQXVCLENBQUM7QUFFNUIsU0FBUyxhQUFhO0lBRXJCLE9BQU8sSUFBSSxjQUFPLENBQUM7UUFDbEIsT0FBTyxFQUFFLElBQUk7UUFDYixnQkFBZ0IsRUFBRTtZQUNqQixjQUFjLEVBQUUsSUFBSTtTQUNwQjtRQUNELE9BQU8sRUFBRSxJQUFJO0tBQ2IsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELEtBQUssVUFBVSxVQUFVO0lBRXhCLElBQUksY0FBYyxFQUNsQjtRQUNDLE9BQU8sY0FBYyxDQUFDO0tBQ3RCO0lBRUQsTUFBTSxJQUFJLEdBQUcsTUFBTSxrREFBTyxHQUFHLGdCQUFNLG9CQUFvQixJQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFRLENBQUM7SUFFMUYsY0FBYyxHQUFHLGFBQWEsRUFBRSxDQUFDO0lBRWpDLHdCQUFVLENBQUMsY0FBcUIsRUFBRSxhQUFpQixDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUVyRixjQUFjLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUMzQixjQUFjLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztJQUU3QixPQUFPLGNBQWMsQ0FBQTtBQUN0QixDQUFDO0FBRUQsU0FBUyxTQUFTLENBQUMsSUFBWSxFQUFFLE9BQTJCO0lBRTNELE9BQU8sVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUU7UUFDL0MsR0FBRyxPQUFPO1FBQ1YsTUFBTSxFQUFFLElBQUk7S0FDWixDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDYixDQUFDO0FBRUQsa0JBQWUsU0FBUyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8xLzMwLlxuICovXG5pbXBvcnQgU2VnbWVudCwgeyBJT3B0aW9uc0RvU2VnbWVudCB9IGZyb20gJ25vdmVsLXNlZ21lbnQvbGliL3NlZ21lbnQvY29yZSc7XG5pbXBvcnQgeyB1c2VNb2R1bGVzIH0gZnJvbSAnbm92ZWwtc2VnbWVudC9saWIvc2VnbWVudC9tZXRob2RzL3VzZU1vZHVsZXMyJztcbmltcG9ydCBnZXREZWZhdWx0TW9kTGlzdCBmcm9tICdub3ZlbC1zZWdtZW50L2xpYi9tb2QnO1xuaW1wb3J0IF9fcm9vdCBmcm9tICcuL19fcm9vdCc7XG5cbmxldCBDQUNIRURfU0VHTUVOVDogU2VnbWVudDtcblxuZnVuY3Rpb24gY3JlYXRlU2VnbWVudCgpXG57XG5cdHJldHVybiBuZXcgU2VnbWVudCh7XG5cdFx0YXV0b0NqazogdHJ1ZSxcblx0XHRvcHRpb25zRG9TZWdtZW50OiB7XG5cdFx0XHRjb252ZXJ0U3lub255bTogdHJ1ZSxcblx0XHR9LFxuXHRcdGFsbF9tb2Q6IHRydWUsXG5cdH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRTZWdtZW50KClcbntcblx0aWYgKENBQ0hFRF9TRUdNRU5UKVxuXHR7XG5cdFx0cmV0dXJuIENBQ0hFRF9TRUdNRU5UO1xuXHR9XG5cblx0Y29uc3QgRElDVCA9IGF3YWl0IGltcG9ydChgJHtfX3Jvb3R9Ly5jYWNoZS9jYWNoZS5qc29uYCkudGhlbih2ID0+IHYuZGVmYXVsdCB8fCB2KSBhcyBhbnk7XG5cblx0Q0FDSEVEX1NFR01FTlQgPSBjcmVhdGVTZWdtZW50KCk7XG5cblx0dXNlTW9kdWxlcyhDQUNIRURfU0VHTUVOVCBhcyBhbnksIGdldERlZmF1bHRNb2RMaXN0KENBQ0hFRF9TRUdNRU5ULm9wdGlvbnMuYWxsX21vZCkpO1xuXG5cdENBQ0hFRF9TRUdNRU5ULkRJQ1QgPSBESUNUO1xuXHRDQUNIRURfU0VHTUVOVC5pbml0ZWQgPSB0cnVlO1xuXG5cdHJldHVybiBDQUNIRURfU0VHTUVOVFxufVxuXG5mdW5jdGlvbiBkb1NlZ21lbnQodGV4dDogc3RyaW5nLCBvcHRpb25zPzogSU9wdGlvbnNEb1NlZ21lbnQpXG57XG5cdHJldHVybiBnZXRTZWdtZW50KCkudGhlbih2ID0+IHYuZG9TZWdtZW50KHRleHQsIHtcblx0XHQuLi5vcHRpb25zLFxuXHRcdHNpbXBsZTogdHJ1ZSxcblx0fSkuam9pbignJykpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGRvU2VnbWVudFxuIl19