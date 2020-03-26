"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const path_1 = require("path");
const __root_1 = __importDefault(require("../lib/__root"));
child_process_1.spawn('node', [
    path_1.join(__root_1.default, `./cli/cache.js`),
], {
    stdio: 'inherit',
});
//# sourceMappingURL=init.js.map