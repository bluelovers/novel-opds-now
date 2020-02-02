"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const micro_1 = __importDefault(require("micro"));
const qrcode_terminal_1 = require("qrcode-terminal");
const address2_1 = __importDefault(require("address2"));
const getPort_1 = __importStar(require("./lib/getPort"));
async function startServer(port = getPort_1.default(getPort_1.getPortEnv())) {
    const web = http_1.createServer(micro_1.default(await Promise.resolve().then(() => __importStar(require('./server/index'))).then(m => m.default)));
    web.listen(port, async () => {
        await Promise.resolve().then(() => __importStar(require('./server/gun/setup'))).then(m => m.setupGun(web));
        console.log(`http://localhost:${port}`);
        let ip = address2_1.default();
        let href = `http://${ip}:${port}/opds`;
        console.log(href);
        qrcode_terminal_1.generate(href, { small: true });
    });
    return web;
}
exports.startServer = startServer;
exports.default = startServer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSwrQkFBcUQ7QUFDckQsa0RBQTBCO0FBQzFCLHFEQUFxRDtBQUNyRCx3REFBdUM7QUFDdkMseURBQW9EO0FBRTdDLEtBQUssVUFBVSxXQUFXLENBQUMsT0FBd0IsaUJBQU8sQ0FBQyxvQkFBVSxFQUFFLENBQUM7SUFFOUUsTUFBTSxHQUFHLEdBQUcsbUJBQWEsQ0FBQyxlQUFLLENBQUMsTUFBTSxrREFBTyxnQkFBZ0IsSUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXRGLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssSUFBSSxFQUFFO1FBRzNCLE1BQU0sa0RBQU8sb0JBQW9CLElBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRTlELE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLElBQUksRUFBRSxDQUFDLENBQUM7UUFFeEMsSUFBSSxFQUFFLEdBQVcsa0JBQWUsRUFBRSxDQUFDO1FBRW5DLElBQUksSUFBSSxHQUFHLFVBQVUsRUFBRSxJQUFJLElBQUksT0FBTyxDQUFDO1FBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFbEIsMEJBQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUMvQixDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sR0FBRyxDQUFBO0FBQ1gsQ0FBQztBQXBCRCxrQ0FvQkM7QUFFRCxrQkFBZSxXQUFXLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVTZXJ2ZXIgYXMgX2NyZWF0ZVNlcnZlciB9IGZyb20gXCJodHRwXCI7XG5pbXBvcnQgbWljcm8gZnJvbSAnbWljcm8nO1xuaW1wb3J0IHsgZ2VuZXJhdGUgYXMgcXJjb2RlIH0gZnJvbSAncXJjb2RlLXRlcm1pbmFsJztcbmltcG9ydCBzZWFyY2hJUEFkZHJlc3MgZnJvbSAnYWRkcmVzczInO1xuaW1wb3J0IGdldFBvcnQsIHsgZ2V0UG9ydEVudiB9IGZyb20gJy4vbGliL2dldFBvcnQnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc3RhcnRTZXJ2ZXIocG9ydDogbnVtYmVyIHwgc3RyaW5nID0gZ2V0UG9ydChnZXRQb3J0RW52KCkpKVxue1xuXHRjb25zdCB3ZWIgPSBfY3JlYXRlU2VydmVyKG1pY3JvKGF3YWl0IGltcG9ydCgnLi9zZXJ2ZXIvaW5kZXgnKS50aGVuKG0gPT4gbS5kZWZhdWx0KSkpO1xuXG5cdHdlYi5saXN0ZW4ocG9ydCwgYXN5bmMgKCkgPT5cblx0e1xuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRhd2FpdCBpbXBvcnQoJy4vc2VydmVyL2d1bi9zZXR1cCcpLnRoZW4obSA9PiBtLnNldHVwR3VuKHdlYikpO1xuXG5cdFx0Y29uc29sZS5sb2coYGh0dHA6Ly9sb2NhbGhvc3Q6JHtwb3J0fWApO1xuXG5cdFx0bGV0IGlwOiBzdHJpbmcgPSBzZWFyY2hJUEFkZHJlc3MoKTtcblxuXHRcdGxldCBocmVmID0gYGh0dHA6Ly8ke2lwfToke3BvcnR9L29wZHNgO1xuXHRcdGNvbnNvbGUubG9nKGhyZWYpO1xuXG5cdFx0cXJjb2RlKGhyZWYsIHsgc21hbGw6IHRydWUgfSk7XG5cdH0pO1xuXG5cdHJldHVybiB3ZWJcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3RhcnRTZXJ2ZXJcbiJdfQ==