"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMutableFileSystem = void 0;
const tslib_1 = require("tslib");
const use_1 = require("./use");
const to_cid_1 = require("@lazy-ipfs/to-cid");
const ipld_dag_pb_1 = require("ipld-dag-pb");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const pokeAll_1 = require("./pokeAll");
function addMutableFileSystem(options) {
    return (0, use_1.useIPFS)().then(async ({ ipfs, stop }) => {
        let dir_path = `/novel-opds-now/${options.siteID}/${options.novelID}`;
        let file_path = `${dir_path}/${options.data.path}`;
        logger_1.default.debug(`[IPFS]`, `addMutableFileSystem`, dir_path, options);
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
        let root_stat = await ipfs.files.stat(`/novel-opds-now/`, {
            hash: true,
        });
        let root_cid = root_stat.cid;
        root_stat = void 0;
        logger_1.default.debug(`[IPFS]`, `addMutableFileSystem:root`, `poke`, root_cid);
        (0, pokeAll_1.pokeAll)(root_cid, ipfs)
            .tap(settledResult => {
            return (0, pokeAll_1.reportPokeAllSettledResult)(settledResult, root_cid);
        });
        logger_1.default.debug(`[IPFS]`, `addMutableFileSystem:done`, dir_path, dir_stat);
    }).catch(e => {
        logger_1.default.debug(`[IPFS]`, `addMutableFileSystem:error`, options);
        logger_1.default.error(e);
    });
}
exports.addMutableFileSystem = addMutableFileSystem;
//# sourceMappingURL=mfs.js.map