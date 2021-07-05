"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addContent = void 0;
function addContent(content) {
    if (!(content === null || content === void 0 ? void 0 : content.length)) {
        return null;
    }
    return {
        value: content.replace(/\n/g, '<br/>')
    };
}
exports.addContent = addContent;
//# sourceMappingURL=addContent.js.map