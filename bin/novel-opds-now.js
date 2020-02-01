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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92ZWwtb3Bkcy1ub3cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJub3ZlbC1vcGRzLW5vdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUlBLGtEQUEwQjtBQUcxQixnREFBd0I7QUFDeEIsa0RBQTBCO0FBQzFCLHFEQUEyQjtBQUMzQixpRkFBd0Q7QUFFeEQseUJBQWMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBRWxDLElBQUksSUFBSSxHQUFHLGVBQUs7S0FDZCxNQUFNLENBQUMsTUFBTSxFQUFFO0lBQ2YsTUFBTSxFQUFFLElBQUk7SUFDWixLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUM7SUFDWixPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSTtDQUNqQyxDQUFDO0tBQ0QsSUFBSSxDQUNMO0FBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxjQUFJLENBQUMsTUFBTSxDQUFDLGVBQUssQ0FBQyxlQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzNDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7SUFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUE7QUFDN0MsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzIvMS5cbiAqL1xuXG5pbXBvcnQgeWFyZ3MgZnJvbSAneWFyZ3MnO1xuaW1wb3J0IHsgT1VUUFVUX0RJUiB9IGZyb20gJy4uL2xpYi9jb25zdCc7XG5pbXBvcnQgeyBzcGF3blN5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xuaW1wb3J0IG1pY3JvIGZyb20gJ21pY3JvJztcbmltcG9ydCBhcHAgZnJvbSAnLi4vaW5kZXgnO1xuaW1wb3J0IHVwZGF0ZU5vdGlmaWVyIGZyb20gJ0B5YXJuLXRvb2wvdXBkYXRlLW5vdGlmaWVyJztcblxudXBkYXRlTm90aWZpZXIoW19fZGlybmFtZSwgJy4uJ10pO1xuXG5sZXQgYXJndiA9IHlhcmdzXG5cdC5vcHRpb24oJ3BvcnQnLCB7XG5cdFx0bnVtYmVyOiB0cnVlLFxuXHRcdGFsaWFzOiBbJ3AnXSxcblx0XHRkZWZhdWx0OiBwcm9jZXNzLmVudi5QT1JUIHx8IDMwMDBcblx0fSlcblx0LmFyZ3ZcbjtcblxuY29uc3Qgc2VydmVyID0gbmV3IGh0dHAuU2VydmVyKG1pY3JvKGFwcCkpO1xuc2VydmVyLmxpc3Rlbihhcmd2LnBvcnQsICgpID0+IHtcblx0Y29uc29sZS5sb2coYGh0dHA6Ly9sb2NhbGhvc3Q6JHthcmd2LnBvcnR9YClcbn0pO1xuIl19