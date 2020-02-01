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
    })
        .then(({ id_titles, id_update, }) => {
        return id_update.map((id) => ({
            id,
            title: id_titles[id]
        }));
    })
        .then(data => {
        return fs_extra_1.outputJSON(types_1.getLocalFilename(siteID, types_1.builded_map), data, {
            spaces: 2
        });
    });
}
exports.buildSort = buildSort;
exports.default = buildSortAll;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJidWlsZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUErQjtBQUMvQixtQ0FBNEc7QUFDNUcsd0RBQWdDO0FBRWhDLHVDQUFzQztBQUV0QyxTQUFnQixZQUFZO0lBRTNCLE9BQU8sa0JBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBYSxDQUFDLENBQUM7U0FDakQsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBYSxDQUFDLENBQUMsQ0FBQTtBQUM1QyxDQUFDO0FBSkQsb0NBSUM7QUFFRCxTQUFnQixTQUFTLENBQUMsTUFBZ0I7SUFFekMsT0FBTyxrQkFBUSxDQUFDLEtBQUssQ0FBQztRQUNyQixTQUFTLEVBQUUsY0FBUyxDQUF5QixNQUFNLEVBQUUscUJBQWEsQ0FBQztRQUNuRSxTQUFTLEVBQUUsY0FBUyxDQUFXLE1BQU0sRUFBRSxxQkFBYSxDQUFDO0tBQ3JELENBQUM7U0FDQSxJQUFJLENBQUMsQ0FBQyxFQUNOLFNBQVMsRUFDVCxTQUFTLEdBQ1QsRUFBRSxFQUFFO1FBQ0osT0FBUSxTQUFzQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMzQyxFQUFFO1lBQ0YsS0FBSyxFQUFHLFNBQW9DLENBQUMsRUFBRSxDQUFDO1NBQ2hELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDO1NBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ1osT0FBTyxxQkFBVSxDQUFDLHdCQUFnQixDQUFDLE1BQU0sRUFBRSxtQkFBVyxDQUFDLEVBQUUsSUFBSSxFQUFFO1lBQzlELE1BQU0sRUFBRSxDQUFDO1NBQ1QsQ0FBQyxDQUFBO0lBQ0gsQ0FBQyxDQUFDLENBQ0Y7QUFDRixDQUFDO0FBckJELDhCQXFCQztBQUVELGtCQUFlLFlBQVksQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBsb2FkQ2FjaGUgZnJvbSAnLi9sb2FkJztcbmltcG9ydCB7IElTaXRlSURzLCBwYXRoUHJlZml4LCBpZF90aXRsZXNfbWFwLCBpZF91cGRhdGVfbWFwLCBnZXRMb2NhbEZpbGVuYW1lLCBidWlsZGVkX21hcCB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCB7IHVwZGF0ZUNhY2hlIH0gZnJvbSAnLi91cGRhdGUnO1xuaW1wb3J0IHsgb3V0cHV0SlNPTiB9IGZyb20gJ2ZzLWV4dHJhJztcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkU29ydEFsbCgpXG57XG5cdHJldHVybiBCbHVlYmlyZC5yZXNvbHZlKE9iamVjdC5rZXlzKGlkX3RpdGxlc19tYXApKVxuXHRcdC5tYXAoKHNpdGVJRCkgPT4gYnVpbGRTb3J0KHNpdGVJRCBhcyBhbnkpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRTb3J0KHNpdGVJRDogSVNpdGVJRHMpXG57XG5cdHJldHVybiBCbHVlYmlyZC5wcm9wcyh7XG5cdFx0aWRfdGl0bGVzOiBsb2FkQ2FjaGU8UmVjb3JkPHN0cmluZywgc3RyaW5nPj4oc2l0ZUlELCBpZF90aXRsZXNfbWFwKSxcblx0XHRpZF91cGRhdGU6IGxvYWRDYWNoZTxzdHJpbmdbXT4oc2l0ZUlELCBpZF91cGRhdGVfbWFwKSxcblx0fSlcblx0XHQudGhlbigoe1xuXHRcdFx0aWRfdGl0bGVzLFxuXHRcdFx0aWRfdXBkYXRlLFxuXHRcdH0pID0+IHtcblx0XHRcdHJldHVybiAoaWRfdXBkYXRlIGFzIHN0cmluZ1tdKS5tYXAoKGlkKSA9PiAoe1xuXHRcdFx0XHRpZCxcblx0XHRcdFx0dGl0bGU6IChpZF90aXRsZXMgYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPilbaWRdXG5cdFx0XHR9KSlcblx0XHR9KVxuXHRcdC50aGVuKGRhdGEgPT4ge1xuXHRcdFx0cmV0dXJuIG91dHB1dEpTT04oZ2V0TG9jYWxGaWxlbmFtZShzaXRlSUQsIGJ1aWxkZWRfbWFwKSwgZGF0YSwge1xuXHRcdFx0XHRzcGFjZXM6IDJcblx0XHRcdH0pXG5cdFx0fSlcblx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBidWlsZFNvcnRBbGxcbiJdfQ==