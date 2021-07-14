"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMutableFileSystem = void 0;
const tslib_1 = require("tslib");
const use_1 = require("./use");
const to_cid_1 = require("@lazy-ipfs/to-cid");
const ipld_dag_pb_1 = require("ipld-dag-pb");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const getNovelData_1 = require("../site/cached-data/getNovelData");
const uni_string_1 = (0, tslib_1.__importDefault)(require("uni-string"));
const pokeMutableFileSystem_1 = require("./mfs/pokeMutableFileSystem");
function addMutableFileSystem(options) {
    return (0, use_1.getIPFS)().then(async (ipfs) => {
        let dir_path = `/novel-opds-now/${options.siteID}/${options.novelID}`;
        let file_path = `${dir_path}/${options.data.path}`;
        let dir_stat = await ipfs.files.stat(dir_path).catch(e => null);
        let file_cid = (0, to_cid_1.toCID)(options.data.cid);
        if (dir_stat) {
            let file_stat = await ipfs.files.stat(file_path).catch(e => null);
            if (file_stat.cid != file_cid) {
                await ipfs.files.rm(file_path).catch(e => null);
                await ipfs.files.cp(`/ipfs/${file_cid}`, file_path);
            }
        }
        else {
            await ipfs.files.mkdir(dir_path, {
                parents: true,
            });
            dir_stat = await ipfs.files.stat(dir_path);
            const link = new ipld_dag_pb_1.DAGLink(options.data.path, options.data.size, file_cid);
            let patched = await ipfs.object.patch.addLink(dir_stat.cid, link);
            await ipfs.files.rm(dir_path, {
                recursive: true,
            });
            await ipfs.files.cp(`/ipfs/${patched}`, dir_path);
        }
        let novel = await (0, getNovelData_1.getNovelData)(options.siteID, options.novelID);
        if (novel === null || novel === void 0 ? void 0 : novel.title) {
            let title = uni_string_1.default.slice(novel.title.replace(/[.]+/g, ''), 0, 15).replace(/\//g, '／');
            if (title.length) {
                let file_path2 = `${dir_path}/${title}.txt`;
                let file_stat2 = await ipfs.files.stat(file_path2).catch(e => null);
                if (!file_stat2) {
                    await ipfs.files.write(file_path2, novel.title, {
                        create: true,
                    });
                }
            }
        }
        (0, pokeMutableFileSystem_1.pokeMutableFileSystem)(options, novel === null || novel === void 0 ? void 0 : novel.title);
    }).catch(e => {
        logger_1.default.debug(`[IPFS]`, `addMutableFileSystem:error`, options);
        logger_1.default.error(e);
    });
}
exports.addMutableFileSystem = addMutableFileSystem;
//# sourceMappingURL=mfs.js.map