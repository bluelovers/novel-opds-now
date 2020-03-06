"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSort = exports.buildSortAll = void 0;
const load_1 = __importDefault(require("./load"));
const types_1 = require("./types");
const bluebird_1 = __importDefault(require("bluebird"));
const fs_extra_1 = require("fs-extra");
function buildSortAll() {
    return bluebird_1.default.resolve(Object.keys(types_1.id_titles_map))
        .map((siteID) => buildSort(siteID));
}
exports.buildSortAll = buildSortAll;
function buildSort(siteID) {
    return bluebird_1.default.props({
        id_titles: load_1.default(siteID, types_1.id_titles_map),
        id_update: load_1.default(siteID, types_1.id_update_map),
        id_chapters: load_1.default(siteID, types_1.id_chapters_map),
    })
        .then(({ id_titles, id_update, id_chapters, }) => {
        return id_update
            .filter(id => id_chapters[id] > 0)
            .map((id) => ({
            id,
            title: id_titles[id],
        }));
    })
        .then(data => {
        return fs_extra_1.outputJSON(types_1.getLocalFilename(siteID, types_1.builded_map), data, {
            spaces: 2,
        });
    });
}
exports.buildSort = buildSort;
exports.default = buildSortAll;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJidWlsZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxrREFBK0I7QUFDL0IsbUNBUWlCO0FBQ2pCLHdEQUFnQztBQUVoQyx1Q0FBc0M7QUFFdEMsU0FBZ0IsWUFBWTtJQUUzQixPQUFPLGtCQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMscUJBQWEsQ0FBQyxDQUFDO1NBQ2pELEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQWEsQ0FBQyxDQUFDLENBQUE7QUFDNUMsQ0FBQztBQUpELG9DQUlDO0FBRUQsU0FBZ0IsU0FBUyxDQUFDLE1BQWdCO0lBRXpDLE9BQU8sa0JBQVEsQ0FBQyxLQUFLLENBQUM7UUFDcEIsU0FBUyxFQUFFLGNBQVMsQ0FBeUIsTUFBTSxFQUFFLHFCQUFhLENBQUM7UUFDbkUsU0FBUyxFQUFFLGNBQVMsQ0FBVyxNQUFNLEVBQUUscUJBQWEsQ0FBQztRQUNyRCxXQUFXLEVBQUUsY0FBUyxDQUFXLE1BQU0sRUFBRSx1QkFBZSxDQUFDO0tBQ3pELENBQUM7U0FDRCxJQUFJLENBQUMsQ0FBQyxFQUNOLFNBQVMsRUFDVCxTQUFTLEVBQ1QsV0FBVyxHQUNYLEVBQUUsRUFBRTtRQUVKLE9BQVEsU0FBc0I7YUFDNUIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNqQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDYixFQUFFO1lBQ0YsS0FBSyxFQUFHLFNBQW9DLENBQUMsRUFBRSxDQUFDO1NBQ2hELENBQUMsQ0FBQyxDQUFBO0lBQ0wsQ0FBQyxDQUFDO1NBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBRVosT0FBTyxxQkFBVSxDQUFDLHdCQUFnQixDQUFDLE1BQU0sRUFBRSxtQkFBVyxDQUFDLEVBQUUsSUFBSSxFQUFFO1lBQzlELE1BQU0sRUFBRSxDQUFDO1NBQ1QsQ0FBQyxDQUFBO0lBQ0gsQ0FBQyxDQUFDLENBQ0Q7QUFDSCxDQUFDO0FBM0JELDhCQTJCQztBQUVELGtCQUFlLFlBQVksQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBsb2FkQ2FjaGUgZnJvbSAnLi9sb2FkJztcbmltcG9ydCB7XG5cdElTaXRlSURzLFxuXHRwYXRoUHJlZml4LFxuXHRpZF90aXRsZXNfbWFwLFxuXHRpZF91cGRhdGVfbWFwLFxuXHRnZXRMb2NhbEZpbGVuYW1lLFxuXHRidWlsZGVkX21hcCxcblx0aWRfY2hhcHRlcnNfbWFwLFxufSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgeyB1cGRhdGVDYWNoZSB9IGZyb20gJy4vdXBkYXRlJztcbmltcG9ydCB7IG91dHB1dEpTT04gfSBmcm9tICdmcy1leHRyYSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFNvcnRBbGwoKVxue1xuXHRyZXR1cm4gQmx1ZWJpcmQucmVzb2x2ZShPYmplY3Qua2V5cyhpZF90aXRsZXNfbWFwKSlcblx0XHQubWFwKChzaXRlSUQpID0+IGJ1aWxkU29ydChzaXRlSUQgYXMgYW55KSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkU29ydChzaXRlSUQ6IElTaXRlSURzKVxue1xuXHRyZXR1cm4gQmx1ZWJpcmQucHJvcHMoe1xuXHRcdFx0aWRfdGl0bGVzOiBsb2FkQ2FjaGU8UmVjb3JkPHN0cmluZywgc3RyaW5nPj4oc2l0ZUlELCBpZF90aXRsZXNfbWFwKSxcblx0XHRcdGlkX3VwZGF0ZTogbG9hZENhY2hlPHN0cmluZ1tdPihzaXRlSUQsIGlkX3VwZGF0ZV9tYXApLFxuXHRcdFx0aWRfY2hhcHRlcnM6IGxvYWRDYWNoZTxzdHJpbmdbXT4oc2l0ZUlELCBpZF9jaGFwdGVyc19tYXApLFxuXHRcdH0pXG5cdFx0LnRoZW4oKHtcblx0XHRcdGlkX3RpdGxlcyxcblx0XHRcdGlkX3VwZGF0ZSxcblx0XHRcdGlkX2NoYXB0ZXJzLFxuXHRcdH0pID0+XG5cdFx0e1xuXHRcdFx0cmV0dXJuIChpZF91cGRhdGUgYXMgc3RyaW5nW10pXG5cdFx0XHRcdC5maWx0ZXIoaWQgPT4gaWRfY2hhcHRlcnNbaWRdID4gMClcblx0XHRcdFx0Lm1hcCgoaWQpID0+ICh7XG5cdFx0XHRcdFx0aWQsXG5cdFx0XHRcdFx0dGl0bGU6IChpZF90aXRsZXMgYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPilbaWRdLFxuXHRcdFx0XHR9KSlcblx0XHR9KVxuXHRcdC50aGVuKGRhdGEgPT5cblx0XHR7XG5cdFx0XHRyZXR1cm4gb3V0cHV0SlNPTihnZXRMb2NhbEZpbGVuYW1lKHNpdGVJRCwgYnVpbGRlZF9tYXApLCBkYXRhLCB7XG5cdFx0XHRcdHNwYWNlczogMixcblx0XHRcdH0pXG5cdFx0fSlcblx0XHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJ1aWxkU29ydEFsbFxuIl19