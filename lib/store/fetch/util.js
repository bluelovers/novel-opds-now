"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertEpubByMime = assertEpubByMime;
const tslib_1 = require("tslib");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const mimeFromBuffer_1 = require("../../util/mimeFromBuffer");
const logger_1 = tslib_1.__importDefault(require("debug-color2/logger"));
const SymbolSource = Symbol.for('href');
function assertEpubByMime(buffer) {
    return bluebird_1.default.resolve()
        .tap(async () => {
        let { mime, ext } = await (0, mimeFromBuffer_1.mimeFromBuffer)(buffer);
        if (ext !== 'epub' && ext !== 'zip') {
            throw new TypeError(JSON.stringify({ mime, ext }));
        }
    })
        .tapCatch(e => {
        e.href = e[SymbolSource] = buffer === null || buffer === void 0 ? void 0 : buffer[SymbolSource].toString();
        logger_1.default.error(`assertEpubByMime`, buffer === null || buffer === void 0 ? void 0 : buffer.length, e[SymbolSource]);
        if (buffer === null || buffer === void 0 ? void 0 : buffer.length) {
            logger_1.default.error(e);
            logger_1.default.trace();
        }
    });
}
//# sourceMappingURL=util.js.map