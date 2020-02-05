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
const getPort_1 = __importStar(require("./lib/getPort"));
const ip_1 = __importDefault(require("./lib/ip"));
const bluebird_1 = __importDefault(require("bluebird"));
const debounce_1 = __importDefault(require("lodash/debounce"));
async function startServer(port) {
    const web = await http_1.createServer(micro_1.default(await Promise.resolve().then(() => __importStar(require('./server/index'))).then(m => m.default)));
    port = port || getPort_1.default(getPort_1.getPortEnv());
    web.listen(port, async () => {
        ip_1.default(port);
        let _showIP = debounce_1.default(() => {
            ip_1.default(port);
        }, 10 * 1000);
        _showIP();
        bluebird_1.default
            .resolve(Promise.resolve().then(() => __importStar(require('./server/gun/setup'))))
            .tap(async (m) => {
            m.setupGun(web);
            return m.useGun().then();
        })
            .catch(e => null)
            .delay(5 * 1000)
            .tap(_showIP);
    });
    return web;
}
exports.startServer = startServer;
exports.default = startServer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSwrQkFBcUQ7QUFDckQsa0RBQTBCO0FBRzFCLHlEQUFvRDtBQUNwRCxrREFBOEI7QUFDOUIsd0RBQWdDO0FBRWhDLCtEQUF1QztBQUVoQyxLQUFLLFVBQVUsV0FBVyxDQUFDLElBQXNCO0lBRXZELE1BQU0sR0FBRyxHQUFHLE1BQU0sbUJBQWEsQ0FBQyxlQUFLLENBQUMsTUFBTSxrREFBTyxnQkFBZ0IsSUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTVGLElBQUksR0FBSSxJQUFtQixJQUFJLGlCQUFPLENBQUMsb0JBQVUsRUFBRSxDQUFDLENBQUM7SUFFckQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFFM0IsWUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWIsSUFBSSxPQUFPLEdBQUcsa0JBQVEsQ0FBQyxHQUFHLEVBQUU7WUFDM0IsWUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2QsQ0FBQyxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUVkLE9BQU8sRUFBRSxDQUFDO1FBRVYsa0JBQVE7YUFDTixPQUFPLG1EQUFRLG9CQUFvQixJQUFFO2FBQ3JDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDaEIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVoQixPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMxQixDQUFDLENBQUM7YUFDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUM7YUFDaEIsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7YUFDZixHQUFHLENBQUMsT0FBTyxDQUFDLENBQ2I7SUFDRixDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sR0FBRyxDQUFBO0FBQ1gsQ0FBQztBQTlCRCxrQ0E4QkM7QUFFRCxrQkFBZSxXQUFXLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVTZXJ2ZXIgYXMgX2NyZWF0ZVNlcnZlciB9IGZyb20gXCJodHRwXCI7XG5pbXBvcnQgbWljcm8gZnJvbSAnbWljcm8nO1xuaW1wb3J0IHsgZ2VuZXJhdGUgYXMgcXJjb2RlIH0gZnJvbSAncXJjb2RlLXRlcm1pbmFsJztcbmltcG9ydCBzZWFyY2hJUEFkZHJlc3MgZnJvbSAnYWRkcmVzczInO1xuaW1wb3J0IGdldFBvcnQsIHsgZ2V0UG9ydEVudiB9IGZyb20gJy4vbGliL2dldFBvcnQnO1xuaW1wb3J0IHNob3dJUCBmcm9tICcuL2xpYi9pcCc7XG5pbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IGNvbnNvbGUgZnJvbSAnZGVidWctY29sb3IyL2xvZ2dlcic7XG5pbXBvcnQgZGVib3VuY2UgZnJvbSAnbG9kYXNoL2RlYm91bmNlJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHN0YXJ0U2VydmVyKHBvcnQ/OiBudW1iZXIgfCBzdHJpbmcpXG57XG5cdGNvbnN0IHdlYiA9IGF3YWl0IF9jcmVhdGVTZXJ2ZXIobWljcm8oYXdhaXQgaW1wb3J0KCcuL3NlcnZlci9pbmRleCcpLnRoZW4obSA9PiBtLmRlZmF1bHQpKSk7XG5cblx0cG9ydCA9IChwb3J0IGFzIG51bWJlciB8IDApIHx8IGdldFBvcnQoZ2V0UG9ydEVudigpKTtcblxuXHR3ZWIubGlzdGVuKHBvcnQsIGFzeW5jICgpID0+XG5cdHtcblx0XHRzaG93SVAocG9ydCk7XG5cblx0XHRsZXQgX3Nob3dJUCA9IGRlYm91bmNlKCgpID0+IHtcblx0XHRcdHNob3dJUChwb3J0KTtcblx0XHR9LCAxMCAqIDEwMDApO1xuXG5cdFx0X3Nob3dJUCgpO1xuXG5cdFx0Qmx1ZWJpcmRcblx0XHRcdC5yZXNvbHZlKGltcG9ydCgnLi9zZXJ2ZXIvZ3VuL3NldHVwJykpXG5cdFx0XHQudGFwKGFzeW5jIChtKSA9PiB7XG5cdFx0XHRcdG0uc2V0dXBHdW4od2ViKTtcblxuXHRcdFx0XHRyZXR1cm4gbS51c2VHdW4oKS50aGVuKCk7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGUgPT4gbnVsbClcblx0XHRcdC5kZWxheSg1ICogMTAwMClcblx0XHRcdC50YXAoX3Nob3dJUClcblx0XHQ7XG5cdH0pO1xuXG5cdHJldHVybiB3ZWJcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3RhcnRTZXJ2ZXJcbiJdfQ==