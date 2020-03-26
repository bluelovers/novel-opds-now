"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doAll = void 0;
const child_process_1 = require("child_process");
async function doAll(id, siteID) {
    child_process_1.spawnSync('node', [
        `../cli/cli`,
        '--IDKEY',
        siteID,
        '--novel_id',
        String(id),
    ], {
        stdio: 'inherit',
    });
}
exports.doAll = doAll;
exports.default = doAll;
//# sourceMappingURL=doAll.js.map