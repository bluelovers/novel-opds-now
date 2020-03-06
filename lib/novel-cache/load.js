"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCache = void 0;
const types_1 = require("./types");
const fs_extra_1 = require("fs-extra");
const bluebird_1 = __importDefault(require("bluebird"));
function loadCache(siteID, map) {
    return bluebird_1.default.resolve(fs_extra_1.readJSON(types_1.getLocalFilename(siteID, map)));
}
exports.loadCache = loadCache;
exports.default = loadCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsbUNBQXFEO0FBQ3JELHVDQUFvQztBQUNwQyx3REFBZ0M7QUFFaEMsU0FBZ0IsU0FBUyxDQUFJLE1BQWdCLEVBQUUsR0FBNkI7SUFFM0UsT0FBTyxrQkFBUSxDQUFDLE9BQU8sQ0FBSSxtQkFBUSxDQUFDLHdCQUFnQixDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDcEUsQ0FBQztBQUhELDhCQUdDO0FBRUQsa0JBQWUsU0FBUyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSVNpdGVJRHMsIGdldExvY2FsRmlsZW5hbWUgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IHJlYWRKU09OIH0gZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcblxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRDYWNoZTxUPihzaXRlSUQ6IElTaXRlSURzLCBtYXA6IFJlY29yZDxJU2l0ZUlEcywgc3RyaW5nPilcbntcblx0cmV0dXJuIEJsdWViaXJkLnJlc29sdmU8VD4ocmVhZEpTT04oZ2V0TG9jYWxGaWxlbmFtZShzaXRlSUQsIG1hcCkpKVxufVxuXG5leHBvcnQgZGVmYXVsdCBsb2FkQ2FjaGVcbiJdfQ==