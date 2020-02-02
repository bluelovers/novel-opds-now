"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mime_types_1 = require("mime-types");
const const_1 = require("opds-extra/lib/const");
function addCover(href) {
    let type = mime_types_1.lookup(href);
    if (!type || !/image/.test(type)) {
        type = const_1.EnumMIME.jpg;
    }
    return [
        {
            rel: const_1.EnumLinkRel.IMAGE,
            href,
            type,
        },
        {
            rel: const_1.EnumLinkRel.IMAGE_THUMBNAIL,
            href,
            type,
        },
    ];
}
exports.addCover = addCover;
exports.default = addCover;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkQ292ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhZGRDb3Zlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLDJDQUFvQztBQUNwQyxnREFBNkQ7QUFFN0QsU0FBZ0IsUUFBUSxDQUFDLElBQVk7SUFFcEMsSUFBSSxJQUFJLEdBQUcsbUJBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUV4QixJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNqQyxJQUFJLEdBQUcsZ0JBQVEsQ0FBQyxHQUFHLENBQUM7S0FDcEI7SUFFRCxPQUFPO1FBQ047WUFDQyxHQUFHLEVBQUUsbUJBQVcsQ0FBQyxLQUFLO1lBQ3RCLElBQUk7WUFDSixJQUFJO1NBQ0o7UUFDRDtZQUNDLEdBQUcsRUFBRSxtQkFBVyxDQUFDLGVBQWU7WUFDaEMsSUFBSTtZQUNKLElBQUk7U0FDSjtLQUNELENBQUE7QUFDRixDQUFDO0FBcEJELDRCQW9CQztBQUVELGtCQUFlLFFBQVEsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMjAvMi8zLlxuICovXG5cbmltcG9ydCB7IGxvb2t1cCB9IGZyb20gXCJtaW1lLXR5cGVzXCI7XG5pbXBvcnQgeyBFbnVtTUlNRSwgRW51bUxpbmtSZWwgfSBmcm9tICdvcGRzLWV4dHJhL2xpYi9jb25zdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRDb3ZlcihocmVmOiBzdHJpbmcpXG57XG5cdGxldCB0eXBlID0gbG9va3VwKGhyZWYpO1xuXG5cdGlmICghdHlwZSB8fCAhL2ltYWdlLy50ZXN0KHR5cGUpKSB7XG5cdFx0dHlwZSA9IEVudW1NSU1FLmpwZztcblx0fVxuXG5cdHJldHVybiBbXG5cdFx0e1xuXHRcdFx0cmVsOiBFbnVtTGlua1JlbC5JTUFHRSxcblx0XHRcdGhyZWYsXG5cdFx0XHR0eXBlLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0cmVsOiBFbnVtTGlua1JlbC5JTUFHRV9USFVNQk5BSUwsXG5cdFx0XHRocmVmLFxuXHRcdFx0dHlwZSxcblx0XHR9LFxuXHRdXG59XG5cbmV4cG9ydCBkZWZhdWx0IGFkZENvdmVyXG4iXX0=