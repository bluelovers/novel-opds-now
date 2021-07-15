"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishAndPokeIPFS = void 0;
const tslib_1 = require("tslib");
const use_1 = require("../use");
const put_1 = require("fetch-ipfs/put");
const ipfs_server_list_1 = require("ipfs-server-list");
const pokeAll_1 = require("../pokeAll");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
function publishAndPokeIPFS(content, options, ...msg) {
    var _a, _b;
    return bluebird_1.default.props({
        ipfs: (_a = options === null || options === void 0 ? void 0 : options.ipfs) !== null && _a !== void 0 ? _a : (0, use_1.getIPFS)().catch(e => null),
        timeout: (_b = options === null || options === void 0 ? void 0 : options.timeout) !== null && _b !== void 0 ? _b : 30 * 60 * 1000,
        filename: options === null || options === void 0 ? void 0 : options.filename,
        content,
        options,
    })
        .then(({ ipfs, timeout, filename, content, options, }) => {
        return (0, put_1.publishToIPFSRace)({
            path: filename,
            content,
        }, [
            ipfs,
            ...(0, ipfs_server_list_1.filterList)('API'),
        ], {
            addOptions: {
                pin: false,
            },
            timeout,
        })
            .tap((ret) => {
            let cid;
            ret.find(settledResult => {
                var _a, _b;
                let value = (_a = settledResult.value) !== null && _a !== void 0 ? _a : (_b = settledResult.reason) === null || _b === void 0 ? void 0 : _b.value;
                if (value === null || value === void 0 ? void 0 : value.length) {
                    const resultCID = value[0].cid.toString();
                    if (resultCID.length) {
                        cid = resultCID;
                        logger_1.default.debug(`[IPFS]`, `publishAndPokeIPFS`, `[${settledResult.status}]`, cid, ...msg);
                        return true;
                    }
                }
            });
            let data = {
                filename,
            };
            return (0, pokeAll_1.pokeAll)(cid, ipfs, data)
                .tap(settledResult => {
                return (0, pokeAll_1.reportPokeAllSettledResult)(settledResult, cid, data.filename, ...msg);
            });
        });
    });
}
exports.publishAndPokeIPFS = publishAndPokeIPFS;
//# sourceMappingURL=publishAndPoke.js.map