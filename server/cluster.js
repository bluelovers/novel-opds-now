"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cluster_1 = tslib_1.__importDefault(require("cluster"));
const index_1 = require("../index");
if (0 && cluster_1.default.isMaster) {
    cluster_1.default.fork() && cluster_1.default.on('exit', () => {
        console.log(`cluster.fork`);
        cluster_1.default.fork();
    });
}
else {
    (0, index_1.startServer)({
        port: 3000,
    });
}
//# sourceMappingURL=cluster.js.map