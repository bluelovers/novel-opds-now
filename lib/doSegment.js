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
        nodeNovelMode: true,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9TZWdtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZG9TZWdtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUdBLDBFQUE0RTtBQUM1RSwrRUFBMkU7QUFDM0UsZ0VBQXNEO0FBQ3RELHNEQUE4QjtBQUU5QixJQUFJLGNBQXVCLENBQUM7QUFFNUIsU0FBUyxhQUFhO0lBRXJCLE9BQU8sSUFBSSxjQUFPLENBQUM7UUFDbEIsT0FBTyxFQUFFLElBQUk7UUFDYixnQkFBZ0IsRUFBRTtZQUNqQixjQUFjLEVBQUUsSUFBSTtTQUNwQjtRQUNELE9BQU8sRUFBRSxJQUFJO1FBQ2IsYUFBYSxFQUFFLElBQUk7S0FDbkIsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELEtBQUssVUFBVSxVQUFVO0lBRXhCLElBQUksY0FBYyxFQUNsQjtRQUNDLE9BQU8sY0FBYyxDQUFDO0tBQ3RCO0lBRUQsTUFBTSxJQUFJLEdBQUcsTUFBTSxrREFBTyxHQUFHLGdCQUFNLG9CQUFvQixJQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFRLENBQUM7SUFFMUYsY0FBYyxHQUFHLGFBQWEsRUFBRSxDQUFDO0lBRWpDLHdCQUFVLENBQUMsY0FBcUIsRUFBRSxhQUFpQixDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUVyRixjQUFjLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUMzQixjQUFjLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztJQUU3QixPQUFPLGNBQWMsQ0FBQTtBQUN0QixDQUFDO0FBRUQsU0FBUyxTQUFTLENBQUMsSUFBWSxFQUFFLE9BQTJCO0lBRTNELE9BQU8sVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUU7UUFDL0MsR0FBRyxPQUFPO1FBQ1YsTUFBTSxFQUFFLElBQUk7S0FDWixDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDYixDQUFDO0FBRUQsa0JBQWUsU0FBUyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8xLzMwLlxuICovXG5pbXBvcnQgU2VnbWVudCwgeyBJT3B0aW9uc0RvU2VnbWVudCB9IGZyb20gJ25vdmVsLXNlZ21lbnQvbGliL3NlZ21lbnQvY29yZSc7XG5pbXBvcnQgeyB1c2VNb2R1bGVzIH0gZnJvbSAnbm92ZWwtc2VnbWVudC9saWIvc2VnbWVudC9tZXRob2RzL3VzZU1vZHVsZXMyJztcbmltcG9ydCBnZXREZWZhdWx0TW9kTGlzdCBmcm9tICdub3ZlbC1zZWdtZW50L2xpYi9tb2QnO1xuaW1wb3J0IF9fcm9vdCBmcm9tICcuL19fcm9vdCc7XG5cbmxldCBDQUNIRURfU0VHTUVOVDogU2VnbWVudDtcblxuZnVuY3Rpb24gY3JlYXRlU2VnbWVudCgpXG57XG5cdHJldHVybiBuZXcgU2VnbWVudCh7XG5cdFx0YXV0b0NqazogdHJ1ZSxcblx0XHRvcHRpb25zRG9TZWdtZW50OiB7XG5cdFx0XHRjb252ZXJ0U3lub255bTogdHJ1ZSxcblx0XHR9LFxuXHRcdGFsbF9tb2Q6IHRydWUsXG5cdFx0bm9kZU5vdmVsTW9kZTogdHJ1ZSxcblx0fSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldFNlZ21lbnQoKVxue1xuXHRpZiAoQ0FDSEVEX1NFR01FTlQpXG5cdHtcblx0XHRyZXR1cm4gQ0FDSEVEX1NFR01FTlQ7XG5cdH1cblxuXHRjb25zdCBESUNUID0gYXdhaXQgaW1wb3J0KGAke19fcm9vdH0vLmNhY2hlL2NhY2hlLmpzb25gKS50aGVuKHYgPT4gdi5kZWZhdWx0IHx8IHYpIGFzIGFueTtcblxuXHRDQUNIRURfU0VHTUVOVCA9IGNyZWF0ZVNlZ21lbnQoKTtcblxuXHR1c2VNb2R1bGVzKENBQ0hFRF9TRUdNRU5UIGFzIGFueSwgZ2V0RGVmYXVsdE1vZExpc3QoQ0FDSEVEX1NFR01FTlQub3B0aW9ucy5hbGxfbW9kKSk7XG5cblx0Q0FDSEVEX1NFR01FTlQuRElDVCA9IERJQ1Q7XG5cdENBQ0hFRF9TRUdNRU5ULmluaXRlZCA9IHRydWU7XG5cblx0cmV0dXJuIENBQ0hFRF9TRUdNRU5UXG59XG5cbmZ1bmN0aW9uIGRvU2VnbWVudCh0ZXh0OiBzdHJpbmcsIG9wdGlvbnM/OiBJT3B0aW9uc0RvU2VnbWVudClcbntcblx0cmV0dXJuIGdldFNlZ21lbnQoKS50aGVuKHYgPT4gdi5kb1NlZ21lbnQodGV4dCwge1xuXHRcdC4uLm9wdGlvbnMsXG5cdFx0c2ltcGxlOiB0cnVlLFxuXHR9KS5qb2luKCcnKSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgZG9TZWdtZW50XG4iXX0=