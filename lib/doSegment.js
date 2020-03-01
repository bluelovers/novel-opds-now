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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9TZWdtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZG9TZWdtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUlBLCtFQUEyRTtBQUMzRSxnRUFBc0Q7QUFDdEQsc0RBQThCO0FBQzlCLDRFQUFvRDtBQUVwRCxJQUFJLGNBQXVCLENBQUM7QUFFNUIsS0FBSyxVQUFVLFVBQVU7SUFFeEIsSUFBSSxjQUFjLEVBQ2xCO1FBQ0MsT0FBTyxjQUFjLENBQUM7S0FDdEI7SUFFRCxNQUFNLElBQUksR0FBRyxNQUFNLGtEQUFPLEdBQUcsZ0JBQU0sb0JBQW9CLElBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQVEsQ0FBQztJQUUxRixjQUFjLEdBQUcsdUJBQWEsRUFBRSxDQUFDO0lBRWpDLHdCQUFVLENBQUMsY0FBcUIsRUFBRSxhQUFpQixDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUVyRixjQUFjLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUMzQixjQUFjLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztJQUU3QixPQUFPLGNBQWMsQ0FBQTtBQUN0QixDQUFDO0FBRUQsU0FBUyxTQUFTLENBQUMsSUFBWSxFQUFFLE9BQTJCO0lBRTNELE9BQU8sVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUU7UUFDL0MsR0FBRyxPQUFPO1FBQ1YsTUFBTSxFQUFFLElBQUk7S0FDWixDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDYixDQUFDO0FBRUQsa0JBQWUsU0FBUyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8xLzMwLlxuICovXG5pbXBvcnQgU2VnbWVudCwgeyBJT3B0aW9uc0RvU2VnbWVudCB9IGZyb20gJ25vdmVsLXNlZ21lbnQvbGliL3NlZ21lbnQvY29yZSc7XG5pbXBvcnQgeyB1c2VNb2R1bGVzIH0gZnJvbSAnbm92ZWwtc2VnbWVudC9saWIvc2VnbWVudC9tZXRob2RzL3VzZU1vZHVsZXMyJztcbmltcG9ydCBnZXREZWZhdWx0TW9kTGlzdCBmcm9tICdub3ZlbC1zZWdtZW50L2xpYi9tb2QnO1xuaW1wb3J0IF9fcm9vdCBmcm9tICcuL19fcm9vdCc7XG5pbXBvcnQgY3JlYXRlU2VnbWVudCBmcm9tICcuL3NlZ21lbnQvY3JlYXRlU2VnbWVudCc7XG5cbmxldCBDQUNIRURfU0VHTUVOVDogU2VnbWVudDtcblxuYXN5bmMgZnVuY3Rpb24gZ2V0U2VnbWVudCgpXG57XG5cdGlmIChDQUNIRURfU0VHTUVOVClcblx0e1xuXHRcdHJldHVybiBDQUNIRURfU0VHTUVOVDtcblx0fVxuXG5cdGNvbnN0IERJQ1QgPSBhd2FpdCBpbXBvcnQoYCR7X19yb290fS8uY2FjaGUvY2FjaGUuanNvbmApLnRoZW4odiA9PiB2LmRlZmF1bHQgfHwgdikgYXMgYW55O1xuXG5cdENBQ0hFRF9TRUdNRU5UID0gY3JlYXRlU2VnbWVudCgpO1xuXG5cdHVzZU1vZHVsZXMoQ0FDSEVEX1NFR01FTlQgYXMgYW55LCBnZXREZWZhdWx0TW9kTGlzdChDQUNIRURfU0VHTUVOVC5vcHRpb25zLmFsbF9tb2QpKTtcblxuXHRDQUNIRURfU0VHTUVOVC5ESUNUID0gRElDVDtcblx0Q0FDSEVEX1NFR01FTlQuaW5pdGVkID0gdHJ1ZTtcblxuXHRyZXR1cm4gQ0FDSEVEX1NFR01FTlRcbn1cblxuZnVuY3Rpb24gZG9TZWdtZW50KHRleHQ6IHN0cmluZywgb3B0aW9ucz86IElPcHRpb25zRG9TZWdtZW50KVxue1xuXHRyZXR1cm4gZ2V0U2VnbWVudCgpLnRoZW4odiA9PiB2LmRvU2VnbWVudCh0ZXh0LCB7XG5cdFx0Li4ub3B0aW9ucyxcblx0XHRzaW1wbGU6IHRydWUsXG5cdH0pLmpvaW4oJycpKVxufVxuXG5leHBvcnQgZGVmYXVsdCBkb1NlZ21lbnRcbiJdfQ==