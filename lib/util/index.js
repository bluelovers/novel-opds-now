"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const array_hyper_unique_1 = require("array-hyper-unique");
function handleArgvList(siteID, novelID) {
    if (!Array.isArray(siteID)) {
        siteID = [siteID];
    }
    if (!Array.isArray(novelID)) {
        novelID = [novelID];
    }
    siteID = array_hyper_unique_1.array_unique_overwrite(siteID.map(v => String(v)));
    novelID = array_hyper_unique_1.array_unique_overwrite(novelID.map(v => String(v)));
    return {
        siteID,
        novelID,
    };
}
exports.handleArgvList = handleArgvList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJEQUE0RDtBQU01RCxTQUFnQixjQUFjLENBQUMsTUFBeUIsRUFBRSxPQUEwQjtJQUVuRixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFDMUI7UUFDQyxNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNsQjtJQUNELElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUMzQjtRQUNDLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3BCO0lBRUQsTUFBTSxHQUFHLDJDQUFzQixDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVELE9BQU8sR0FBRywyQ0FBc0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUU5RCxPQUFPO1FBQ04sTUFBTTtRQUNOLE9BQU87S0FDUCxDQUFBO0FBQ0YsQ0FBQztBQWxCRCx3Q0FrQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhcnJheV91bmlxdWVfb3ZlcndyaXRlIH0gZnJvbSAnYXJyYXktaHlwZXItdW5pcXVlJztcblxuLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8yLzIxLlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVBcmd2TGlzdChzaXRlSUQ6IHN0cmluZyB8IHN0cmluZ1tdLCBub3ZlbElEOiBzdHJpbmcgfCBzdHJpbmdbXSlcbntcblx0aWYgKCFBcnJheS5pc0FycmF5KHNpdGVJRCkpXG5cdHtcblx0XHRzaXRlSUQgPSBbc2l0ZUlEXTtcblx0fVxuXHRpZiAoIUFycmF5LmlzQXJyYXkobm92ZWxJRCkpXG5cdHtcblx0XHRub3ZlbElEID0gW25vdmVsSURdO1xuXHR9XG5cblx0c2l0ZUlEID0gYXJyYXlfdW5pcXVlX292ZXJ3cml0ZShzaXRlSUQubWFwKHYgPT4gU3RyaW5nKHYpKSk7XG5cdG5vdmVsSUQgPSBhcnJheV91bmlxdWVfb3ZlcndyaXRlKG5vdmVsSUQubWFwKHYgPT4gU3RyaW5nKHYpKSk7XG5cblx0cmV0dXJuIHtcblx0XHRzaXRlSUQsXG5cdFx0bm92ZWxJRCxcblx0fVxufVxuIl19