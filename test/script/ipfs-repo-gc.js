"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const use_1 = require("../../lib/ipfs/use");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
(0, use_1.searchIpfs)()
    .tap(async ({ ipfs, stop }) => {
    let i = 0;
    for await (const result of ipfs.pin.ls()) {
        console.log(`pin`, result.type, result.cid, result.metadata);
    }
    for await (const result of ipfs.repo.gc()) {
        console.log(`gc`, result.err, result.cid);
        if (++i > 10) {
            await bluebird_1.default.delay(200);
        }
    }
    await ipfs.repo.stat().then(console.log);
    return stop();
});
//# sourceMappingURL=ipfs-repo-gc.js.map