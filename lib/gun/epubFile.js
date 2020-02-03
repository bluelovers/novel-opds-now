"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const setup_1 = __importDefault(require("../../server/gun/setup"));
const bluebird_1 = __importDefault(require("bluebird"));
const array_hyper_unique_1 = require("array-hyper-unique");
function makeArrayEntrys(siteID, novel_id) {
    if (!Array.isArray(siteID)) {
        siteID = [siteID];
    }
    if (!Array.isArray(novel_id)) {
        novel_id = [novel_id];
    }
    siteID = array_hyper_unique_1.array_unique_overwrite(siteID.map(v => String(v)));
    novel_id = array_hyper_unique_1.array_unique_overwrite(novel_id.map(v => String(v)));
    return siteID
        .reduce((a, siteID) => {
        siteID && novel_id.forEach(novel_id => {
            novel_id && a.push([siteID, novel_id]);
        });
        return a;
    }, []);
}
exports.makeArrayEntrys = makeArrayEntrys;
function allGunEpubFile(siteID, novel_id) {
    if (!Array.isArray(siteID)) {
        siteID = [siteID];
    }
    if (!Array.isArray(novel_id)) {
        novel_id = [novel_id];
    }
    siteID = array_hyper_unique_1.array_unique_overwrite(siteID.map(v => String(v)));
    novel_id = array_hyper_unique_1.array_unique_overwrite(novel_id.map(v => String(v)));
    let gun = setup_1.default();
    return siteID
        .reduce((a, siteID) => {
        siteID && novel_id.forEach(novel_id => {
            novel_id && a.push(gun.get('epub-file').get(siteID).get(novel_id));
        });
        return a;
    }, []);
}
exports.allGunEpubFile = allGunEpubFile;
function promiseGunEpubFile(siteID, novel_id) {
    return allGunEpubFile(siteID, novel_id).map(node => node.then());
}
exports.promiseGunEpubFile = promiseGunEpubFile;
function nodeGunEpubFile(siteID, novel_id) {
    return setup_1.default().get('epub-file').get(siteID).get(novel_id);
}
exports.nodeGunEpubFile = nodeGunEpubFile;
function raceGunEpubFile(siteID, novel_id) {
    return bluebird_1.default.race(promiseGunEpubFile(siteID, novel_id));
}
exports.raceGunEpubFile = raceGunEpubFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXB1YkZpbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlcHViRmlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG1FQUE0QztBQUM1Qyx3REFBZ0M7QUFDaEMsMkRBQTREO0FBSzVELFNBQWdCLGVBQWUsQ0FBQyxNQUErQixFQUFFLFFBQTBDO0lBRTFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUMxQjtRQUNDLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ2xCO0lBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQzVCO1FBQ0MsUUFBUSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDdEI7SUFFRCxNQUFNLEdBQUcsMkNBQXNCLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUQsUUFBUSxHQUFHLDJDQUFzQixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWhFLE9BQU8sTUFBTTtTQUNYLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUdyQixNQUFNLElBQUssUUFBcUIsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFFbkQsUUFBUSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQTtRQUN2QyxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sQ0FBQyxDQUFDO0lBQ1YsQ0FBQyxFQUFFLEVBQXdCLENBQUMsQ0FBQTtBQUM5QixDQUFDO0FBekJELDBDQXlCQztBQUVELFNBQWdCLGNBQWMsQ0FBQyxNQUErQixFQUFFLFFBQTBDO0lBRXpHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUMxQjtRQUNDLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ2xCO0lBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQzVCO1FBQ0MsUUFBUSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDdEI7SUFFRCxNQUFNLEdBQUcsMkNBQXNCLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUQsUUFBUSxHQUFHLDJDQUFzQixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWhFLElBQUksR0FBRyxHQUFHLGVBQU0sRUFBRSxDQUFDO0lBRW5CLE9BQU8sTUFBTTtTQUNYLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUdyQixNQUFNLElBQUssUUFBcUIsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFLbkQsUUFBUSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7UUFDcEUsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsQ0FBQztJQUNWLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUNQLENBQUM7QUE5QkQsd0NBOEJDO0FBRUQsU0FBZ0Isa0JBQWtCLENBQUksTUFBeUIsRUFBRSxRQUEyQjtJQUUzRixPQUFPLGNBQWMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBZ0IsQ0FBQyxDQUFBO0FBQy9FLENBQUM7QUFIRCxnREFHQztBQUVELFNBQWdCLGVBQWUsQ0FBQyxNQUFjLEVBQUUsUUFBZ0I7SUFHL0QsT0FBTyxlQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUMzRCxDQUFDO0FBSkQsMENBSUM7QUFFRCxTQUFnQixlQUFlLENBQUMsTUFBeUIsRUFBRSxRQUEyQjtJQUVyRixPQUFPLGtCQUFRLENBQUMsSUFBSSxDQUFlLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUV2RTtBQUNGLENBQUM7QUFMRCwwQ0FLQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB1c2VHdW4gZnJvbSAnLi4vLi4vc2VydmVyL2d1bi9zZXR1cCc7XG5pbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHsgYXJyYXlfdW5pcXVlX292ZXJ3cml0ZSB9IGZyb20gJ2FycmF5LWh5cGVyLXVuaXF1ZSc7XG5pbXBvcnQgeyBJR3VuRXB1Yk5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgR3VuIGZyb20gJ2d1bic7XG5pbXBvcnQgeyBJVFNWYWx1ZU9yQXJyYXkgfSBmcm9tICd0cy10eXBlJztcblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VBcnJheUVudHJ5cyhzaXRlSUQ6IElUU1ZhbHVlT3JBcnJheTxzdHJpbmc+LCBub3ZlbF9pZDogSVRTVmFsdWVPckFycmF5PHN0cmluZyB8IG51bWJlcj4pXG57XG5cdGlmICghQXJyYXkuaXNBcnJheShzaXRlSUQpKVxuXHR7XG5cdFx0c2l0ZUlEID0gW3NpdGVJRF07XG5cdH1cblx0aWYgKCFBcnJheS5pc0FycmF5KG5vdmVsX2lkKSlcblx0e1xuXHRcdG5vdmVsX2lkID0gW25vdmVsX2lkXTtcblx0fVxuXG5cdHNpdGVJRCA9IGFycmF5X3VuaXF1ZV9vdmVyd3JpdGUoc2l0ZUlELm1hcCh2ID0+IFN0cmluZyh2KSkpO1xuXHRub3ZlbF9pZCA9IGFycmF5X3VuaXF1ZV9vdmVyd3JpdGUobm92ZWxfaWQubWFwKHYgPT4gU3RyaW5nKHYpKSk7XG5cblx0cmV0dXJuIHNpdGVJRFxuXHRcdC5yZWR1Y2UoKGEsIHNpdGVJRCkgPT4ge1xuXG5cblx0XHRcdHNpdGVJRCAmJiAobm92ZWxfaWQgYXMgc3RyaW5nW10pLmZvckVhY2gobm92ZWxfaWQgPT4ge1xuXG5cdFx0XHRcdG5vdmVsX2lkICYmIGEucHVzaChbc2l0ZUlELCBub3ZlbF9pZF0pXG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIGE7XG5cdFx0fSwgW10gYXMgW3N0cmluZywgc3RyaW5nXVtdKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWxsR3VuRXB1YkZpbGUoc2l0ZUlEOiBJVFNWYWx1ZU9yQXJyYXk8c3RyaW5nPiwgbm92ZWxfaWQ6IElUU1ZhbHVlT3JBcnJheTxzdHJpbmcgfCBudW1iZXI+KTogUmV0dXJuVHlwZTx0eXBlb2YgR3VuPltdXG57XG5cdGlmICghQXJyYXkuaXNBcnJheShzaXRlSUQpKVxuXHR7XG5cdFx0c2l0ZUlEID0gW3NpdGVJRF07XG5cdH1cblx0aWYgKCFBcnJheS5pc0FycmF5KG5vdmVsX2lkKSlcblx0e1xuXHRcdG5vdmVsX2lkID0gW25vdmVsX2lkXTtcblx0fVxuXG5cdHNpdGVJRCA9IGFycmF5X3VuaXF1ZV9vdmVyd3JpdGUoc2l0ZUlELm1hcCh2ID0+IFN0cmluZyh2KSkpO1xuXHRub3ZlbF9pZCA9IGFycmF5X3VuaXF1ZV9vdmVyd3JpdGUobm92ZWxfaWQubWFwKHYgPT4gU3RyaW5nKHYpKSk7XG5cblx0bGV0IGd1biA9IHVzZUd1bigpO1xuXG5cdHJldHVybiBzaXRlSURcblx0XHQucmVkdWNlKChhLCBzaXRlSUQpID0+IHtcblxuXG5cdFx0XHRzaXRlSUQgJiYgKG5vdmVsX2lkIGFzIHN0cmluZ1tdKS5mb3JFYWNoKG5vdmVsX2lkID0+IHtcblxuXHRcdFx0Ly9jb25zb2xlLmxvZyhzaXRlSUQsIG5vdmVsX2lkKTtcblxuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRub3ZlbF9pZCAmJiBhLnB1c2goZ3VuLmdldCgnZXB1Yi1maWxlJykuZ2V0KHNpdGVJRCkuZ2V0KG5vdmVsX2lkKSlcblx0XHR9KTtcblxuXHRcdHJldHVybiBhO1xuXHR9LCBbXSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb21pc2VHdW5FcHViRmlsZTxUPihzaXRlSUQ6IHN0cmluZyB8IHN0cmluZ1tdLCBub3ZlbF9pZDogc3RyaW5nIHwgc3RyaW5nW10pXG57XG5cdHJldHVybiBhbGxHdW5FcHViRmlsZShzaXRlSUQsIG5vdmVsX2lkKS5tYXAobm9kZSA9PiBub2RlLnRoZW4oKSBhcyBQcm9taXNlPFQ+KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbm9kZUd1bkVwdWJGaWxlKHNpdGVJRDogc3RyaW5nLCBub3ZlbF9pZDogc3RyaW5nKVxue1xuXHQvLyBAdHMtaWdub3JlXG5cdHJldHVybiB1c2VHdW4oKS5nZXQoJ2VwdWItZmlsZScpLmdldChzaXRlSUQpLmdldChub3ZlbF9pZClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJhY2VHdW5FcHViRmlsZShzaXRlSUQ6IHN0cmluZyB8IHN0cmluZ1tdLCBub3ZlbF9pZDogc3RyaW5nIHwgc3RyaW5nW10pXG57XG5cdHJldHVybiBCbHVlYmlyZC5yYWNlPElHdW5FcHViTm9kZT4ocHJvbWlzZUd1bkVwdWJGaWxlKHNpdGVJRCwgbm92ZWxfaWQpKVxuXHRcdC8vLnRhcCh2ID0+IGNvbnNvbGUuZGlyKHYpKVxuXHQ7XG59XG4iXX0=