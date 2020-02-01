"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const http_1 = __importDefault(require("http"));
const micro_1 = __importDefault(require("micro"));
const index_1 = __importDefault(require("../index"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92ZWwtb3Bkcy1ub3cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJub3ZlbC1vcGRzLW5vdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUlBLGtEQUEwQjtBQUcxQixnREFBd0I7QUFDeEIsa0RBQTBCO0FBQzFCLHFEQUEyQjtBQUUzQixJQUFJLElBQUksR0FBRyxlQUFLO0tBQ2QsTUFBTSxDQUFDLE1BQU0sRUFBRTtJQUNmLE1BQU0sRUFBRSxJQUFJO0lBQ1osS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDO0lBQ1osT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLElBQUk7Q0FDakMsQ0FBQztLQUNELElBQUksQ0FDTDtBQUVELE1BQU0sTUFBTSxHQUFHLElBQUksY0FBSSxDQUFDLE1BQU0sQ0FBQyxlQUFLLENBQUMsZUFBRyxDQUFDLENBQUMsQ0FBQztBQUMzQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO0lBQzdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFBO0FBQzdDLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8yLzEuXG4gKi9cblxuaW1wb3J0IHlhcmdzIGZyb20gJ3lhcmdzJztcbmltcG9ydCB7IE9VVFBVVF9ESVIgfSBmcm9tICcuLi9saWIvY29uc3QnO1xuaW1wb3J0IHsgc3Bhd25TeW5jIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgaHR0cCBmcm9tICdodHRwJztcbmltcG9ydCBtaWNybyBmcm9tICdtaWNybyc7XG5pbXBvcnQgYXBwIGZyb20gJy4uL2luZGV4JztcblxubGV0IGFyZ3YgPSB5YXJnc1xuXHQub3B0aW9uKCdwb3J0Jywge1xuXHRcdG51bWJlcjogdHJ1ZSxcblx0XHRhbGlhczogWydwJ10sXG5cdFx0ZGVmYXVsdDogcHJvY2Vzcy5lbnYuUE9SVCB8fCAzMDAwXG5cdH0pXG5cdC5hcmd2XG47XG5cbmNvbnN0IHNlcnZlciA9IG5ldyBodHRwLlNlcnZlcihtaWNybyhhcHApKTtcbnNlcnZlci5saXN0ZW4oYXJndi5wb3J0LCAoKSA9PiB7XG5cdGNvbnNvbGUubG9nKGBodHRwOi8vbG9jYWxob3N0OiR7YXJndi5wb3J0fWApXG59KTtcbiJdfQ==