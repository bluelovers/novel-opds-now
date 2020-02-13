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
async function startServer(options = {}) {
    options = options || {};
    let { port } = options;
    if (options.proxy) {
        process.env.HTTP_PROXY = process.env.HTTPS_PROXY = options.proxy;
    }
    const web = await http_1.createServer(micro_1.default(await Promise.resolve().then(() => __importStar(require('./server/index'))).then(m => m.default)));
    port = port || getPort_1.default(getPort_1.getPortEnv());
    web.listen(port, async () => {
        ip_1.default(port);
        let _showIP = debounce_1.default(() => {
            ip_1.default(port);
        }, 11 * 1000);
        _showIP();
        bluebird_1.default
            .resolve(Promise.resolve().then(() => __importStar(require('./server/gun/setup'))))
            .tap(async (m) => {
            m.setupGun(web);
            return bluebird_1.default.resolve([
                'dmzj',
                'wenku8',
                'esjzone'
            ])
                .map(IDKEY => {
                return bluebird_1.default
                    .resolve(m.useGun().get(IDKEY).then())
                    .timeout(5 * 1000)
                    .catch(e => null);
            });
        })
            .catch(e => null)
            .delay(5 * 1000)
            .tap(_showIP);
    });
    return web;
}
exports.startServer = startServer;
exports.default = startServer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSwrQkFBcUQ7QUFDckQsa0RBQTBCO0FBRzFCLHlEQUFvRDtBQUNwRCxrREFBOEI7QUFDOUIsd0RBQWdDO0FBRWhDLCtEQUF1QztBQUVoQyxLQUFLLFVBQVUsV0FBVyxDQUFDLFVBRzlCLEVBQUU7SUFFTCxPQUFPLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztJQUN4QixJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDO0lBRXZCLElBQUksT0FBTyxDQUFDLEtBQUssRUFDakI7UUFDQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO0tBQ2pFO0lBRUQsTUFBTSxHQUFHLEdBQUcsTUFBTSxtQkFBYSxDQUFDLGVBQUssQ0FBQyxNQUFNLGtEQUFPLGdCQUFnQixJQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFNUYsSUFBSSxHQUFJLElBQW1CLElBQUksaUJBQU8sQ0FBQyxvQkFBVSxFQUFFLENBQUMsQ0FBQztJQUVyRCxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLElBQUksRUFBRTtRQUUzQixZQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFYixJQUFJLE9BQU8sR0FBRyxrQkFBUSxDQUFDLEdBQUcsRUFBRTtZQUMzQixZQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDZCxDQUFDLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBRWQsT0FBTyxFQUFFLENBQUM7UUFFVixrQkFBUTthQUNOLE9BQU8sbURBQVEsb0JBQW9CLElBQUU7YUFDckMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNoQixDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRWhCLE9BQU8sa0JBQVEsQ0FBQyxPQUFPLENBQUM7Z0JBQ3RCLE1BQU07Z0JBQ04sUUFBUTtnQkFDUixTQUFTO2FBQ0EsQ0FBQztpQkFDVixHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ1osT0FBTyxrQkFBUTtxQkFDYixPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztxQkFDckMsT0FBTyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7cUJBQ2pCLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ25CLENBQUMsQ0FBQyxDQUNEO1FBQ0gsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO2FBQ2hCLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO2FBQ2YsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUNiO0lBQ0YsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLEdBQUcsQ0FBQTtBQUNYLENBQUM7QUFwREQsa0NBb0RDO0FBRUQsa0JBQWUsV0FBVyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlU2VydmVyIGFzIF9jcmVhdGVTZXJ2ZXIgfSBmcm9tIFwiaHR0cFwiO1xuaW1wb3J0IG1pY3JvIGZyb20gJ21pY3JvJztcbmltcG9ydCB7IGdlbmVyYXRlIGFzIHFyY29kZSB9IGZyb20gJ3FyY29kZS10ZXJtaW5hbCc7XG5pbXBvcnQgc2VhcmNoSVBBZGRyZXNzIGZyb20gJ2FkZHJlc3MyJztcbmltcG9ydCBnZXRQb3J0LCB7IGdldFBvcnRFbnYgfSBmcm9tICcuL2xpYi9nZXRQb3J0JztcbmltcG9ydCBzaG93SVAgZnJvbSAnLi9saWIvaXAnO1xuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBjb25zb2xlIGZyb20gJ2RlYnVnLWNvbG9yMi9sb2dnZXInO1xuaW1wb3J0IGRlYm91bmNlIGZyb20gJ2xvZGFzaC9kZWJvdW5jZSc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzdGFydFNlcnZlcihvcHRpb25zOiB7XG5cdHBvcnQ/OiBudW1iZXIgfCBzdHJpbmcsXG5cdHByb3h5Pzogc3RyaW5nXG59ID0ge30pXG57XG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXHRsZXQgeyBwb3J0IH0gPSBvcHRpb25zO1xuXG5cdGlmIChvcHRpb25zLnByb3h5KVxuXHR7XG5cdFx0cHJvY2Vzcy5lbnYuSFRUUF9QUk9YWSA9IHByb2Nlc3MuZW52LkhUVFBTX1BST1hZID0gb3B0aW9ucy5wcm94eTtcblx0fVxuXG5cdGNvbnN0IHdlYiA9IGF3YWl0IF9jcmVhdGVTZXJ2ZXIobWljcm8oYXdhaXQgaW1wb3J0KCcuL3NlcnZlci9pbmRleCcpLnRoZW4obSA9PiBtLmRlZmF1bHQpKSk7XG5cblx0cG9ydCA9IChwb3J0IGFzIG51bWJlciB8IDApIHx8IGdldFBvcnQoZ2V0UG9ydEVudigpKTtcblxuXHR3ZWIubGlzdGVuKHBvcnQsIGFzeW5jICgpID0+XG5cdHtcblx0XHRzaG93SVAocG9ydCk7XG5cblx0XHRsZXQgX3Nob3dJUCA9IGRlYm91bmNlKCgpID0+IHtcblx0XHRcdHNob3dJUChwb3J0KTtcblx0XHR9LCAxMSAqIDEwMDApO1xuXG5cdFx0X3Nob3dJUCgpO1xuXG5cdFx0Qmx1ZWJpcmRcblx0XHRcdC5yZXNvbHZlKGltcG9ydCgnLi9zZXJ2ZXIvZ3VuL3NldHVwJykpXG5cdFx0XHQudGFwKGFzeW5jIChtKSA9PiB7XG5cdFx0XHRcdG0uc2V0dXBHdW4od2ViKTtcblxuXHRcdFx0XHRyZXR1cm4gQmx1ZWJpcmQucmVzb2x2ZShbXG5cdFx0XHRcdFx0XHQnZG16aicsXG5cdFx0XHRcdFx0XHQnd2Vua3U4Jyxcblx0XHRcdFx0XHRcdCdlc2p6b25lJ1xuXHRcdFx0XHRcdF0gYXMgY29uc3QpXG5cdFx0XHRcdFx0Lm1hcChJREtFWSA9PiB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gQmx1ZWJpcmRcblx0XHRcdFx0XHRcdFx0LnJlc29sdmUobS51c2VHdW4oKS5nZXQoSURLRVkpLnRoZW4oKSlcblx0XHRcdFx0XHRcdFx0LnRpbWVvdXQoNSAqIDEwMDApXG5cdFx0XHRcdFx0XHRcdC5jYXRjaChlID0+IG51bGwpXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQ7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGUgPT4gbnVsbClcblx0XHRcdC5kZWxheSg1ICogMTAwMClcblx0XHRcdC50YXAoX3Nob3dJUClcblx0XHQ7XG5cdH0pO1xuXG5cdHJldHVybiB3ZWJcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3RhcnRTZXJ2ZXJcbiJdfQ==