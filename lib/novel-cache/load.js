"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const fs_extra_1 = require("fs-extra");
const bluebird_1 = __importDefault(require("bluebird"));
function loadCache(siteID, map) {
    return bluebird_1.default.resolve(fs_extra_1.readJSON(types_1.getLocalFilename(siteID, map)));
}
exports.loadCache = loadCache;
exports.default = loadCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxtQ0FBcUQ7QUFDckQsdUNBQW9DO0FBQ3BDLHdEQUFnQztBQUVoQyxTQUFnQixTQUFTLENBQUksTUFBZ0IsRUFBRSxHQUE2QjtJQUUzRSxPQUFPLGtCQUFRLENBQUMsT0FBTyxDQUFJLG1CQUFRLENBQUMsd0JBQWdCLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNwRSxDQUFDO0FBSEQsOEJBR0M7QUFFRCxrQkFBZSxTQUFTLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJU2l0ZUlEcywgZ2V0TG9jYWxGaWxlbmFtZSB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgcmVhZEpTT04gfSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnO1xuXG5leHBvcnQgZnVuY3Rpb24gbG9hZENhY2hlPFQ+KHNpdGVJRDogSVNpdGVJRHMsIG1hcDogUmVjb3JkPElTaXRlSURzLCBzdHJpbmc+KVxue1xuXHRyZXR1cm4gQmx1ZWJpcmQucmVzb2x2ZTxUPihyZWFkSlNPTihnZXRMb2NhbEZpbGVuYW1lKHNpdGVJRCwgbWFwKSkpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGxvYWRDYWNoZVxuIl19