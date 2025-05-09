"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMutableFileSystem = addMutableFileSystem;
const tslib_1 = require("tslib");
const use_1 = require("./use");
const logger_1 = tslib_1.__importDefault(require("debug-color2/logger"));
const getNovelData_1 = require("../site/cached-data/getNovelData");
const uni_string_1 = tslib_1.__importDefault(require("uni-string"));
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const pokeMutableFileSystem_1 = require("./mfs/pokeMutableFileSystem");
const saveMutableFileSystemRoots_1 = require("./mfs/saveMutableFileSystemRoots");
const _addMutableFileSystem_1 = require("./mfs/_addMutableFileSystem");
const globalWaiting_1 = require("../util/globalWaiting");
function addMutableFileSystem(options, ...msg) {
    return bluebird_1.default.resolve((0, globalWaiting_1.resolveWaiting)('initMutableFileSystem').catchReturn(null))
        .then(() => {
        const dir_path = `/novel-opds-now/${options.siteID}/${options.novelID}`;
        const file_path = `${dir_path}/${options.data.path}`;
        if (_addMutableFileSystem_1.waitingCache.has(file_path)) {
            return;
        }
        return (0, use_1.useIPFS)()
            .then(async ({ ipfs, ipfsd, }) => {
            var _a;
            await (0, _addMutableFileSystem_1._addMutableFileSystem)(dir_path, options.data, { ipfs }, true);
            let novel = await (0, getNovelData_1.getNovelData)(options.siteID, options.novelID);
            if (novel === null || novel === void 0 ? void 0 : novel.title) {
                let title = uni_string_1.default.slice(novel.title.replace(/[.]+/g, ''), 0, 15).replace(/\//g, '／');
                if (title.length) {
                    let file_path2 = `${dir_path}/${title}.txt`;
                    await ipfs.files.write(file_path2, novel.title, {
                        create: true,
                    }).catch(e => null);
                }
            }
            await (0, saveMutableFileSystemRoots_1.saveMutableFileSystemRoots)(ipfs);
            (0, pokeMutableFileSystem_1.pokeMutableFileSystem)(options, (_a = novel === null || novel === void 0 ? void 0 : novel.title) !== null && _a !== void 0 ? _a : file_path, ...msg);
        })
            .catch(e => {
            logger_1.default.warn(`[IPFS]`, `addMutableFileSystem:error`, options);
            logger_1.default.trace(e);
        })
            .finally(() => _addMutableFileSystem_1.waitingCache.delete(file_path));
    });
}
//# sourceMappingURL=mfs.js.map