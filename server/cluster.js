"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cluster_1 = __importDefault(require("cluster"));
const __1 = require("../");
if (cluster_1.default.isMaster) {
    cluster_1.default.fork() && cluster_1.default.on('exit', () => {
        console.log(`cluster.fork`);
        cluster_1.default.fork();
    });
}
else {
    __1.startServer();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2x1c3Rlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsdXN0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQSxzREFBOEI7QUFDOUIsMkJBQWtDO0FBRWxDLElBQUksaUJBQU8sQ0FBQyxRQUFRLEVBQ3BCO0lBQ0MsaUJBQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxpQkFBTyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO1FBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDNUIsaUJBQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNoQixDQUFDLENBQUMsQ0FBQztDQUNIO0tBRUQ7SUFDQyxlQUFXLEVBQUUsQ0FBQztDQUNkIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8yLzIuXG4gKi9cblxuaW1wb3J0IGNsdXN0ZXIgZnJvbSAnY2x1c3Rlcic7XG5pbXBvcnQgeyBzdGFydFNlcnZlciB9IGZyb20gJy4uLyc7XG5cbmlmIChjbHVzdGVyLmlzTWFzdGVyKVxue1xuXHRjbHVzdGVyLmZvcmsoKSAmJiBjbHVzdGVyLm9uKCdleGl0JywgKCkgPT4ge1xuXHRcdGNvbnNvbGUubG9nKGBjbHVzdGVyLmZvcmtgKTtcblx0XHRjbHVzdGVyLmZvcmsoKTtcblx0fSk7XG59XG5lbHNlXG57XG5cdHN0YXJ0U2VydmVyKCk7XG59XG4iXX0=