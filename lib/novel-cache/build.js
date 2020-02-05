"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJidWlsZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUErQjtBQUMvQixtQ0FRaUI7QUFDakIsd0RBQWdDO0FBRWhDLHVDQUFzQztBQUV0QyxTQUFnQixZQUFZO0lBRTNCLE9BQU8sa0JBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBYSxDQUFDLENBQUM7U0FDakQsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBYSxDQUFDLENBQUMsQ0FBQTtBQUM1QyxDQUFDO0FBSkQsb0NBSUM7QUFFRCxTQUFnQixTQUFTLENBQUMsTUFBZ0I7SUFFekMsT0FBTyxrQkFBUSxDQUFDLEtBQUssQ0FBQztRQUNwQixTQUFTLEVBQUUsY0FBUyxDQUF5QixNQUFNLEVBQUUscUJBQWEsQ0FBQztRQUNuRSxTQUFTLEVBQUUsY0FBUyxDQUFXLE1BQU0sRUFBRSxxQkFBYSxDQUFDO1FBQ3JELFdBQVcsRUFBRSxjQUFTLENBQVcsTUFBTSxFQUFFLHVCQUFlLENBQUM7S0FDekQsQ0FBQztTQUNELElBQUksQ0FBQyxDQUFDLEVBQ04sU0FBUyxFQUNULFNBQVMsRUFDVCxXQUFXLEdBQ1gsRUFBRSxFQUFFO1FBRUosT0FBUSxTQUFzQjthQUM1QixNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2pDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNiLEVBQUU7WUFDRixLQUFLLEVBQUcsU0FBb0MsQ0FBQyxFQUFFLENBQUM7U0FDaEQsQ0FBQyxDQUFDLENBQUE7SUFDTCxDQUFDLENBQUM7U0FDRCxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFFWixPQUFPLHFCQUFVLENBQUMsd0JBQWdCLENBQUMsTUFBTSxFQUFFLG1CQUFXLENBQUMsRUFBRSxJQUFJLEVBQUU7WUFDOUQsTUFBTSxFQUFFLENBQUM7U0FDVCxDQUFDLENBQUE7SUFDSCxDQUFDLENBQUMsQ0FDRDtBQUNILENBQUM7QUEzQkQsOEJBMkJDO0FBRUQsa0JBQWUsWUFBWSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGxvYWRDYWNoZSBmcm9tICcuL2xvYWQnO1xuaW1wb3J0IHtcblx0SVNpdGVJRHMsXG5cdHBhdGhQcmVmaXgsXG5cdGlkX3RpdGxlc19tYXAsXG5cdGlkX3VwZGF0ZV9tYXAsXG5cdGdldExvY2FsRmlsZW5hbWUsXG5cdGJ1aWxkZWRfbWFwLFxuXHRpZF9jaGFwdGVyc19tYXAsXG59IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCB7IHVwZGF0ZUNhY2hlIH0gZnJvbSAnLi91cGRhdGUnO1xuaW1wb3J0IHsgb3V0cHV0SlNPTiB9IGZyb20gJ2ZzLWV4dHJhJztcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkU29ydEFsbCgpXG57XG5cdHJldHVybiBCbHVlYmlyZC5yZXNvbHZlKE9iamVjdC5rZXlzKGlkX3RpdGxlc19tYXApKVxuXHRcdC5tYXAoKHNpdGVJRCkgPT4gYnVpbGRTb3J0KHNpdGVJRCBhcyBhbnkpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRTb3J0KHNpdGVJRDogSVNpdGVJRHMpXG57XG5cdHJldHVybiBCbHVlYmlyZC5wcm9wcyh7XG5cdFx0XHRpZF90aXRsZXM6IGxvYWRDYWNoZTxSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+PihzaXRlSUQsIGlkX3RpdGxlc19tYXApLFxuXHRcdFx0aWRfdXBkYXRlOiBsb2FkQ2FjaGU8c3RyaW5nW10+KHNpdGVJRCwgaWRfdXBkYXRlX21hcCksXG5cdFx0XHRpZF9jaGFwdGVyczogbG9hZENhY2hlPHN0cmluZ1tdPihzaXRlSUQsIGlkX2NoYXB0ZXJzX21hcCksXG5cdFx0fSlcblx0XHQudGhlbigoe1xuXHRcdFx0aWRfdGl0bGVzLFxuXHRcdFx0aWRfdXBkYXRlLFxuXHRcdFx0aWRfY2hhcHRlcnMsXG5cdFx0fSkgPT5cblx0XHR7XG5cdFx0XHRyZXR1cm4gKGlkX3VwZGF0ZSBhcyBzdHJpbmdbXSlcblx0XHRcdFx0LmZpbHRlcihpZCA9PiBpZF9jaGFwdGVyc1tpZF0gPiAwKVxuXHRcdFx0XHQubWFwKChpZCkgPT4gKHtcblx0XHRcdFx0XHRpZCxcblx0XHRcdFx0XHR0aXRsZTogKGlkX3RpdGxlcyBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KVtpZF0sXG5cdFx0XHRcdH0pKVxuXHRcdH0pXG5cdFx0LnRoZW4oZGF0YSA9PlxuXHRcdHtcblx0XHRcdHJldHVybiBvdXRwdXRKU09OKGdldExvY2FsRmlsZW5hbWUoc2l0ZUlELCBidWlsZGVkX21hcCksIGRhdGEsIHtcblx0XHRcdFx0c3BhY2VzOiAyLFxuXHRcdFx0fSlcblx0XHR9KVxuXHRcdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYnVpbGRTb3J0QWxsXG4iXX0=