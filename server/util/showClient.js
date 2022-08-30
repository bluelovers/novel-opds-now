"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showClient = void 0;
const tslib_1 = require("tslib");
const logger_1 = tslib_1.__importDefault(require("debug-color2/logger"));
function showClient(req, res, ...argv) {
    logger_1.default.debug(`useragent`, req.useragent.source);
    logger_1.default.debug(`client`, req.clientIp);
}
exports.showClient = showClient;
//# sourceMappingURL=showClient.js.map