#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const http_1 = __importDefault(require("http"));
const micro_1 = __importDefault(require("micro"));
const index_1 = __importDefault(require("../index"));
const update_notifier_1 = __importDefault(require("@yarn-tool/update-notifier"));
const qrcode_terminal_1 = require("qrcode-terminal");
const address2_1 = __importDefault(require("address2"));
update_notifier_1.default([__dirname, '..']);
let argv = yargs_1.default
    .option('port', {
    number: true,
    alias: ['p'],
    default: process.env.PORT || 3000
})
    .argv;
const server = new http_1.default.Server(micro_1.default(index_1.default));
server.listen(argv.port, () => {
    console.log(`http://localhost:${argv.port}`);
    let ip = address2_1.default();
    let href = `http://${ip}:${argv.port}/opds`;
    console.log(href);
    qrcode_terminal_1.generate(href, { small: true });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92ZWwtb3Bkcy1ub3cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJub3ZlbC1vcGRzLW5vdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFNQSxrREFBMEI7QUFHMUIsZ0RBQXdCO0FBQ3hCLGtEQUEwQjtBQUMxQixxREFBMkI7QUFDM0IsaUZBQXdEO0FBQ3hELHFEQUFxRDtBQUNyRCx3REFBdUM7QUFFdkMseUJBQWMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBRWxDLElBQUksSUFBSSxHQUFHLGVBQUs7S0FDZCxNQUFNLENBQUMsTUFBTSxFQUFFO0lBQ2YsTUFBTSxFQUFFLElBQUk7SUFDWixLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUM7SUFDWixPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSTtDQUNqQyxDQUFDO0tBQ0QsSUFBSSxDQUNMO0FBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxjQUFJLENBQUMsTUFBTSxDQUFDLGVBQUssQ0FBQyxlQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzNDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7SUFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUE7SUFFNUMsSUFBSSxFQUFFLEdBQVcsa0JBQWUsRUFBRSxDQUFDO0lBRW5DLElBQUksSUFBSSxHQUFHLFVBQVUsRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQztJQUM1QyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRWxCLDBCQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDL0IsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5cbi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMjAvMi8xLlxuICovXG5cbmltcG9ydCB5YXJncyBmcm9tICd5YXJncyc7XG5pbXBvcnQgeyBPVVRQVVRfRElSIH0gZnJvbSAnLi4vbGliL2NvbnN0JztcbmltcG9ydCB7IHNwYXduU3luYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XG5pbXBvcnQgbWljcm8gZnJvbSAnbWljcm8nO1xuaW1wb3J0IGFwcCBmcm9tICcuLi9pbmRleCc7XG5pbXBvcnQgdXBkYXRlTm90aWZpZXIgZnJvbSAnQHlhcm4tdG9vbC91cGRhdGUtbm90aWZpZXInO1xuaW1wb3J0IHsgZ2VuZXJhdGUgYXMgcXJjb2RlIH0gZnJvbSAncXJjb2RlLXRlcm1pbmFsJztcbmltcG9ydCBzZWFyY2hJUEFkZHJlc3MgZnJvbSAnYWRkcmVzczInO1xuXG51cGRhdGVOb3RpZmllcihbX19kaXJuYW1lLCAnLi4nXSk7XG5cbmxldCBhcmd2ID0geWFyZ3Ncblx0Lm9wdGlvbigncG9ydCcsIHtcblx0XHRudW1iZXI6IHRydWUsXG5cdFx0YWxpYXM6IFsncCddLFxuXHRcdGRlZmF1bHQ6IHByb2Nlc3MuZW52LlBPUlQgfHwgMzAwMFxuXHR9KVxuXHQuYXJndlxuO1xuXG5jb25zdCBzZXJ2ZXIgPSBuZXcgaHR0cC5TZXJ2ZXIobWljcm8oYXBwKSk7XG5zZXJ2ZXIubGlzdGVuKGFyZ3YucG9ydCwgKCkgPT4ge1xuXHRjb25zb2xlLmxvZyhgaHR0cDovL2xvY2FsaG9zdDoke2FyZ3YucG9ydH1gKVxuXG5cdGxldCBpcDogc3RyaW5nID0gc2VhcmNoSVBBZGRyZXNzKCk7XG5cblx0bGV0IGhyZWYgPSBgaHR0cDovLyR7aXB9OiR7YXJndi5wb3J0fS9vcGRzYDtcblx0Y29uc29sZS5sb2coaHJlZik7XG5cblx0cXJjb2RlKGhyZWYsIHsgc21hbGw6IHRydWUgfSk7XG59KTtcbiJdfQ==