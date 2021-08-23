"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreIdentity = exports.backupIdentity = exports.FILE_IDENTITY = void 0;
const path_1 = require("path");
const const_1 = require("../../const");
const identity_1 = require("@lazy-ipfs/identity");
const FILE_IDENTITY = (0, identity_1.getIdentityPath)((0, path_1.join)(const_1.__root, 'test'));
exports.FILE_IDENTITY = FILE_IDENTITY;
async function backupIdentity(ipfsd) {
    return (0, identity_1.backupIdentityFromRepoToFile)(ipfsd.path, FILE_IDENTITY);
}
exports.backupIdentity = backupIdentity;
function restoreIdentity(ipfsd) {
    return (0, identity_1.restoreIdentityFromFileSync)(ipfsd.path, FILE_IDENTITY);
}
exports.restoreIdentity = restoreIdentity;
//# sourceMappingURL=back-up-identity.js.map