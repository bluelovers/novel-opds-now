"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const path_1 = require("path");
const __root_1 = (0, tslib_1.__importDefault)(require("../lib/__root"));
(0, child_process_1.spawn)('node', [
    (0, path_1.join)(__root_1.default, `./cli/cache.js`),
], {
    stdio: 'inherit',
});
//# sourceMappingURL=init.js.map