"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGunEpubFile2 = void 0;
const ipfs_1 = require("./ipfs");
function getGunEpubFile2(...argv) {
    return (0, ipfs_1.getIPFSEpubFile)(...argv)
        .then(data => {
        if (data) {
            data.isGun = true;
        }
        return data;
    });
}
exports.getGunEpubFile2 = getGunEpubFile2;
//# sourceMappingURL=index.js.map