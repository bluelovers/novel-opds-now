"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pokeRoot = void 0;
const tslib_1 = require("tslib");
const pokeAll_1 = (0, tslib_1.__importDefault)(require("../pokeAll"));
const lodash_1 = require("lodash");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const use_1 = require("../use");
exports.pokeRoot = (0, lodash_1.throttle)(async function (ipfs) {
    return bluebird_1.default.resolve(ipfs !== null && ipfs !== void 0 ? ipfs : (0, use_1.getIPFS)())
        .then(async (ipfs) => {
        for await (const ret of ipfs.files.ls('/')) {
            (0, pokeAll_1.default)(ret.cid, ipfs, {
                filename: ret.name,
                hidden: true,
            }).catchReturn(null);
        }
    }).catchReturn(null);
}, 60 * 60 * 1000);
//# sourceMappingURL=pokeRoot.js.map