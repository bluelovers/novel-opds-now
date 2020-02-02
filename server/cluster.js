"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cluster_1 = __importDefault(require("cluster"));
const __1 = require("../");
if (cluster_1.default.isMaster) {
    cluster_1.default.fork() && cluster_1.default.on('exit', function () { cluster_1.default.fork(); });
}
else {
    __1.startServer();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2x1c3Rlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsdXN0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQSxzREFBOEI7QUFDOUIsMkJBQWtDO0FBRWxDLElBQUksaUJBQU8sQ0FBQyxRQUFRLEVBQ3BCO0lBQ0MsaUJBQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxpQkFBTyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsY0FBYyxpQkFBTyxDQUFDLElBQUksRUFBRSxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDckU7S0FFRDtJQUNDLGVBQVcsRUFBRSxDQUFDO0NBQ2QiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzIvMi5cbiAqL1xuXG5pbXBvcnQgY2x1c3RlciBmcm9tICdjbHVzdGVyJztcbmltcG9ydCB7IHN0YXJ0U2VydmVyIH0gZnJvbSAnLi4vJztcblxuaWYgKGNsdXN0ZXIuaXNNYXN0ZXIpXG57XG5cdGNsdXN0ZXIuZm9yaygpICYmIGNsdXN0ZXIub24oJ2V4aXQnLCBmdW5jdGlvbiAoKSB7IGNsdXN0ZXIuZm9yaygpIH0pO1xufVxuZWxzZVxue1xuXHRzdGFydFNlcnZlcigpO1xufVxuIl19