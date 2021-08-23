"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._ipfsFilesCopyCID = void 0;
const cp_1 = require("@lazy-ipfs/compatible-files/lib/cp");
const to_ipfs_url_1 = require("to-ipfs-url");
function _ipfsFilesCopyCID(ipfs, file_cid, file_path, options) {
    options = {
        parents: true,
        ...options,
        extraOptions: {
            validCheck: true,
            ...options.extraOptions,
        }
    };
    return (0, cp_1.ipfsFilesCopy)(ipfs, (0, to_ipfs_url_1.toPath)(file_cid), file_path, options);
}
exports._ipfsFilesCopyCID = _ipfsFilesCopyCID;
//# sourceMappingURL=_ipfsFilesCopy.js.map