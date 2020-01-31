"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = __importDefault(require("novel-segment/lib"));
const fs_extra_1 = require("fs-extra");
function buildCache() {
    const CACHED_SEGMENT = createSegment();
    CACHED_SEGMENT.doSegment('');
    return fs_extra_1.outputJSON(`${__dirname}/../.cache/cache.json`, CACHED_SEGMENT.DICT)
        .then(() => {
        console.log('[buildCache] done');
    });
}
function createSegment() {
    return new lib_1.default({
        autoCjk: true,
        optionsDoSegment: {
            convertSynonym: true,
        },
        all_mod: true,
    });
}
exports.default = buildCache();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRDYWNoZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJ1aWxkQ2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQSw0REFBd0M7QUFDeEMsdUNBQXNDO0FBR3RDLFNBQVMsVUFBVTtJQUVsQixNQUFNLGNBQWMsR0FBRyxhQUFhLEVBQUUsQ0FBQztJQUV2QyxjQUFjLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRTdCLE9BQU8scUJBQVUsQ0FBQyxHQUFHLFNBQVMsdUJBQXVCLEVBQUUsY0FBYyxDQUFDLElBQUksQ0FBQztTQUN6RSxJQUFJLENBQUMsR0FBRyxFQUFFO1FBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0lBQ2pDLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQUVELFNBQVMsYUFBYTtJQUVyQixPQUFPLElBQUksYUFBTyxDQUFDO1FBQ2xCLE9BQU8sRUFBRSxJQUFJO1FBQ2IsZ0JBQWdCLEVBQUU7WUFDakIsY0FBYyxFQUFFLElBQUk7U0FDcEI7UUFDRCxPQUFPLEVBQUUsSUFBSTtLQUNiLENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRCxrQkFBZSxVQUFVLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMjAvMS8zMC5cbiAqL1xuXG5pbXBvcnQgU2VnbWVudCBmcm9tICdub3ZlbC1zZWdtZW50L2xpYic7XG5pbXBvcnQgeyBvdXRwdXRKU09OIH0gZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xuXG5mdW5jdGlvbiBidWlsZENhY2hlKClcbntcblx0Y29uc3QgQ0FDSEVEX1NFR01FTlQgPSBjcmVhdGVTZWdtZW50KCk7XG5cblx0Q0FDSEVEX1NFR01FTlQuZG9TZWdtZW50KCcnKTtcblxuXHRyZXR1cm4gb3V0cHV0SlNPTihgJHtfX2Rpcm5hbWV9Ly4uLy5jYWNoZS9jYWNoZS5qc29uYCwgQ0FDSEVEX1NFR01FTlQuRElDVClcblx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnW2J1aWxkQ2FjaGVdIGRvbmUnKVxuXHRcdH0pXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNlZ21lbnQoKVxue1xuXHRyZXR1cm4gbmV3IFNlZ21lbnQoe1xuXHRcdGF1dG9Dams6IHRydWUsXG5cdFx0b3B0aW9uc0RvU2VnbWVudDoge1xuXHRcdFx0Y29udmVydFN5bm9ueW06IHRydWUsXG5cdFx0fSxcblx0XHRhbGxfbW9kOiB0cnVlLFxuXHR9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYnVpbGRDYWNoZSgpO1xuXG4iXX0=