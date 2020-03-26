"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putGunEpubFile = exports.getGunEpubFile2 = exports.getGunEpubFile = void 0;
const ipfs_1 = require("./ipfs");
Object.defineProperty(exports, "getGunEpubFile", { enumerable: true, get: function () { return ipfs_1.getIPFSEpubFile; } });
Object.defineProperty(exports, "putGunEpubFile", { enumerable: true, get: function () { return ipfs_1.putIPFSEpubFile; } });
function getGunEpubFile2(...argv) {
    return ipfs_1.getIPFSEpubFile(...argv)
        .then(data => {
        if (data) {
            data.isGun = true;
        }
        return data;
    });
}
exports.getGunEpubFile2 = getGunEpubFile2;
//# sourceMappingURL=index.js.map