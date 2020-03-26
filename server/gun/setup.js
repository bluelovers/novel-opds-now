"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gun = exports.useGunRoot = exports.useGun = exports.setupGun = void 0;
const gun_1 = __importDefault(require("gun"));
require("gun-tag");
const path_1 = require("path");
const const_1 = require("../../lib/const");
const fs_extra_1 = require("fs-extra");
const logger_1 = __importDefault(require("debug-color2/logger"));
let gun;
exports.gun = gun;
gun_1.default.log = Object.assign(() => { }, gun_1.default.log, {
    verbose: false,
});
gun_1.default.log.off = true;
console.LOG = false;
function setupGun(app) {
    let file = path_1.join(const_1.OUTPUT_DIR, 'novel-opds-now.cache', 'radata');
    fs_extra_1.ensureDirSync(file);
    let _gun = new gun_1.default({
        web: app,
        peers: [
            "https://my-test-gun-server.herokuapp.com/gun",
        ],
        file,
        log() {
        },
    });
    logger_1.default.debug(`P2P 緩存位於 ${file}`);
    exports.gun = gun = _gun;
    return _gun;
}
exports.setupGun = setupGun;
function useGun() {
    return useGunRoot()
        .get('epub-file');
}
exports.useGun = useGun;
function useGunRoot() {
    return gun || (exports.gun = gun = setupGun());
}
exports.useGunRoot = useGunRoot;
exports.default = useGun;
//# sourceMappingURL=setup.js.map