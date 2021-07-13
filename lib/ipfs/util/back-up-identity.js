"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreIdentity = exports.backupIdentity = void 0;
const tslib_1 = require("tslib");
const path_1 = require("path");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const fs_extra_1 = require("fs-extra");
const const_1 = require("../../const");
async function backupIdentity(ipfsd) {
    return (0, fs_extra_1.readJSON)((0, path_1.join)(ipfsd.path, 'config'))
        .then(config => (0, fs_extra_1.outputJSON)((0, path_1.join)(const_1.__root, 'test', '.identity.json'), config["Identity"], {
        spaces: 2,
    }));
}
exports.backupIdentity = backupIdentity;
function restoreIdentity(ipfsd) {
    return bluebird_1.default.props({
        Identity: (0, fs_extra_1.readJSON)((0, path_1.join)(const_1.__root, 'test', '.identity.json')),
        config: (0, fs_extra_1.readJSON)((0, path_1.join)(ipfsd.path, 'config'))
    }).then(({ Identity, config, }) => {
        Identity.PeerID.length && Identity.PrivKey.length;
        config["Identity"] = Identity;
        return (0, fs_extra_1.outputJSON)((0, path_1.join)(ipfsd.path, 'config'), config, {
            spaces: 2,
        });
    });
}
exports.restoreIdentity = restoreIdentity;
//# sourceMappingURL=back-up-identity.js.map