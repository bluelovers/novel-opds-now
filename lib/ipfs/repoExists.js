"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repoExists = void 0;
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
function repoExists(repoPath) {
    return (0, fs_extra_1.pathExists)((0, path_1.join)(repoPath, 'config'));
}
exports.repoExists = repoExists;
//# sourceMappingURL=repoExists.js.map