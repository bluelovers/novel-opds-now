"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const showClient_1 = require("../util/showClient");
const pokeAll_1 = (0, tslib_1.__importDefault)(require("../../lib/ipfs/pokeAll"));
const use_1 = require("../../lib/ipfs/use");
const lazy_url_1 = (0, tslib_1.__importDefault)(require("lazy-url"));
const parse_ipfs_path_1 = require("@lazy-ipfs/parse-ipfs-path");
const parsePath_1 = require("@lazy-ipfs/parse-ipfs-path/lib/parsePath");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
function routerPokeHandler() {
    const router = (0, express_1.Router)();
    router.use('/*', async (req, res, next) => {
        var _a, _b;
        logger_1.default.log(req.method, req.baseUrl, req.url, req.params, req.query);
        (0, showClient_1.showClient)(req, res, next);
        let cid = (_b = (_a = req.params) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : '';
        if (cid.length) {
            cid = await bluebird_1.default.resolve(cid)
                .then(() => {
                return Promise.resolve(cid)
                    .then((cid) => (0, parse_ipfs_path_1.parsePath)(cid))
                    .catch(() => {
                    let u = new lazy_url_1.default(cid);
                    try {
                        let cid = u.hostname.split('.')[0];
                        return (0, parse_ipfs_path_1.parsePath)(cid + u.pathname);
                    }
                    catch (e) {
                        return (0, parse_ipfs_path_1.parsePath)(u.pathname);
                    }
                });
            })
                .tap(e => {
                logger_1.default.dir(e);
            })
                .tapCatch(e => {
                logger_1.default.error(e);
            })
                .then(result => (0, parsePath_1.resultToPath)(result))
                .catch(() => cid);
        }
        if (cid.length) {
            let list = await (0, pokeAll_1.default)(cid, (0, use_1.getIPFS)().catch(e => null))
                .tap(e => {
                logger_1.default.success(`poke`, e);
            })
                .tapCatch(e => logger_1.default.error(`poke`, e))
                .catch(e => null);
            return res.json({
                cid,
                list,
                params: req.params,
                timestamp: Date.now(),
            });
        }
        return res.json({
            cid,
            params: req.params,
            timestamp: Date.now(),
        });
    });
    return router;
}
exports.default = routerPokeHandler;
//# sourceMappingURL=poke.js.map