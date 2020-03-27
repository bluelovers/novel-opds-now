"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cluster_1 = __importDefault(require("cluster"));
const __1 = require("../");
if (0 && cluster_1.default.isMaster) {
    cluster_1.default.fork() && cluster_1.default.on('exit', () => {
        console.log(`cluster.fork`);
        cluster_1.default.fork();
    });
}
else {
    __1.startServer();
}
//# sourceMappingURL=cluster.js.map