"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCover = void 0;
const mime_types_1 = require("mime-types");
const const_1 = require("opds-extra/lib/const");
function addCover(href) {
    if (!(href === null || href === void 0 ? void 0 : href.length)) {
        return [];
    }
    let type = (0, mime_types_1.lookup)(href);
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
//# sourceMappingURL=addCover.js.map