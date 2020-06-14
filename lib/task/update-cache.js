"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAllCacheTask = void 0;
const update_1 = __importDefault(require("../novel-cache/update"));
const update_2 = __importDefault(require("../demonovel/update"));
const load_1 = __importDefault(require("../masiro/load"));
function updateAllCacheTask() {
    return Promise.all([
        update_1.default(),
        update_2.default(),
        load_1.default(),
    ]).catch(e => null);
}
exports.updateAllCacheTask = updateAllCacheTask;
//# sourceMappingURL=update-cache.js.map