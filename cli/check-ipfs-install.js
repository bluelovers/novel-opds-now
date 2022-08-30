#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("v8-compile-cache");
const check_ipfs_install_1 = require("../lib/task/check-ipfs-install");
const logger_1 = tslib_1.__importDefault(require("debug-color2/logger"));
exports.default = (0, check_ipfs_install_1.checkIpfsInstall)()
    .then(path => logger_1.default.success(`checkIpfsInstall`, path))
    .catch(err => {
    logger_1.default.error(`checkIpfsInstall`, err);
    process.exit(1);
});
//# sourceMappingURL=check-ipfs-install.js.map