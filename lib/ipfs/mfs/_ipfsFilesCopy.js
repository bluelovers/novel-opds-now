"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._ipfsFilesCopyCID = void 0;
const compatible_files_1 = require("@lazy-ipfs/compatible-files");
const is_same_cid_1 = require("@lazy-ipfs/is-same-cid");
const to_ipfs_url_1 = require("to-ipfs-url");
function _ipfsFilesCopyCID(ipfs, file_cid, file_path, options) {
    return (0, compatible_files_1.ipfsFilesCopy)(ipfs, (0, to_ipfs_url_1.toPath)(file_cid), file_path, {
        parents: true,
        ...options,
    })
        .catch(async (e) => {
        let file_stat = await ipfs.files.stat(file_path, {
            hash: true,
        }).catch(e => null);
        if (!file_stat || !(0, is_same_cid_1.isSameCID)(file_stat.cid, (0, to_ipfs_url_1.pathToCid)(file_cid))) {
            return Promise.reject(e);
        }
    });
}
exports._ipfsFilesCopyCID = _ipfsFilesCopyCID;
//# sourceMappingURL=_ipfsFilesCopy.js.map