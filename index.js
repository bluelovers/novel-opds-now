"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const micro_1 = __importDefault(require("micro"));
const getPort_1 = __importStar(require("./lib/getPort"));
const ip_1 = __importDefault(require("./lib/ip"));
const bluebird_1 = __importDefault(require("bluebird"));
const logger_1 = __importDefault(require("debug-color2/logger"));
const debounce_1 = __importDefault(require("lodash/debounce"));
const get_port_1 = __importStar(require("get-port"));
const use_ipfs_1 = __importDefault(require("use-ipfs"));
async function startServer(options = {}) {
    options = options || {};
    let { port } = options;
    if (options.proxy) {
        process.env.HTTP_PROXY = process.env.HTTPS_PROXY = options.proxy;
    }
    const web = await http_1.createServer(micro_1.default(await Promise.resolve().then(() => __importStar(require('./server/index'))).then(m => m.default)));
    port = port || getPort_1.default(getPort_1.getPortEnv());
    port = await get_port_1.default({
        port: get_port_1.makeRange(port, (port | 0) + 10),
    });
    web.listen(port, async () => {
        ip_1.default(port);
        let _showIP = debounce_1.default(() => {
            ip_1.default(port);
        }, 11 * 1000);
        _showIP();
        if (0) {
            bluebird_1.default
                .resolve(Promise.resolve().then(() => __importStar(require('./server/gun/setup'))))
                .tap(async (m) => {
                m.setupGun(web);
                return bluebird_1.default.resolve([
                    'dmzj',
                    'wenku8',
                    'esjzone',
                ])
                    .map(IDKEY => {
                    return bluebird_1.default
                        .resolve()
                        .then(v => m.useGun().get(IDKEY).then())
                        .timeout(5 * 1000)
                        .catch(e => null);
                });
            })
                .catch(e => null)
                .delay(5 * 1000)
                .tap(_showIP);
        }
        else {
            bluebird_1.default
                .resolve(use_ipfs_1.default())
                .tap(async ({ address }) => {
                logger_1.default.info(await address());
            })
                .catch(e => null)
                .tap(() => _showIP());
        }
    });
    return web;
}
exports.startServer = startServer;
exports.default = startServer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQkFBcUQ7QUFDckQsa0RBQTBCO0FBRzFCLHlEQUFvRDtBQUNwRCxrREFBOEI7QUFDOUIsd0RBQWdDO0FBQ2hDLGlFQUEwQztBQUMxQywrREFBdUM7QUFDdkMscURBQStDO0FBQy9DLHdEQUErQjtBQUV4QixLQUFLLFVBQVUsV0FBVyxDQUFDLFVBRzlCLEVBQUU7SUFFTCxPQUFPLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztJQUN4QixJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDO0lBRXZCLElBQUksT0FBTyxDQUFDLEtBQUssRUFDakI7UUFDQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO0tBQ2pFO0lBRUQsTUFBTSxHQUFHLEdBQUcsTUFBTSxtQkFBYSxDQUFDLGVBQUssQ0FBQyxNQUFNLGtEQUFPLGdCQUFnQixJQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFNUYsSUFBSSxHQUFJLElBQW1CLElBQUksaUJBQU8sQ0FBQyxvQkFBVSxFQUFFLENBQUMsQ0FBQztJQUVyRCxJQUFJLEdBQUcsTUFBTSxrQkFBUSxDQUFDO1FBQ3JCLElBQUksRUFBRSxvQkFBUyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7S0FDdEMsQ0FBQyxDQUFDO0lBRUgsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFFM0IsWUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWIsSUFBSSxPQUFPLEdBQUcsa0JBQVEsQ0FBQyxHQUFHLEVBQUU7WUFFM0IsWUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2QsQ0FBQyxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUVkLE9BQU8sRUFBRSxDQUFDO1FBRVYsSUFBSSxDQUFDLEVBQ0w7WUFDQyxrQkFBUTtpQkFDTixPQUFPLG1EQUFRLG9CQUFvQixJQUFFO2lCQUNyQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUVoQixDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUVoQixPQUFPLGtCQUFRLENBQUMsT0FBTyxDQUFDO29CQUN0QixNQUFNO29CQUNOLFFBQVE7b0JBQ1IsU0FBUztpQkFDQSxDQUFDO3FCQUNWLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFFWixPQUFPLGtCQUFRO3lCQUNiLE9BQU8sRUFBRTt5QkFDVCxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO3lCQUN2QyxPQUFPLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQzt5QkFDakIsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQ25CLENBQUMsQ0FBQyxDQUNEO1lBQ0gsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQztpQkFDaEIsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7aUJBQ2YsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUNiO1NBQ0Q7YUFFRDtZQUNDLGtCQUFRO2lCQUNOLE9BQU8sQ0FBQyxrQkFBTyxFQUFFLENBQUM7aUJBQ2xCLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFDWCxPQUFPLEVBQ1AsRUFBRSxFQUFFO2dCQUNKLGdCQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sT0FBTyxFQUFFLENBQUMsQ0FBQTtZQUM5QixDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO2lCQUNoQixHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FDckI7U0FDRDtJQUNGLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxHQUFHLENBQUE7QUFDWCxDQUFDO0FBNUVELGtDQTRFQztBQUVELGtCQUFlLFdBQVcsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZVNlcnZlciBhcyBfY3JlYXRlU2VydmVyIH0gZnJvbSBcImh0dHBcIjtcbmltcG9ydCBtaWNybyBmcm9tICdtaWNybyc7XG5pbXBvcnQgeyBnZW5lcmF0ZSBhcyBxcmNvZGUgfSBmcm9tICdxcmNvZGUtdGVybWluYWwnO1xuaW1wb3J0IHNlYXJjaElQQWRkcmVzcyBmcm9tICdhZGRyZXNzMic7XG5pbXBvcnQgZ2V0UG9ydCwgeyBnZXRQb3J0RW52IH0gZnJvbSAnLi9saWIvZ2V0UG9ydCc7XG5pbXBvcnQgc2hvd0lQIGZyb20gJy4vbGliL2lwJztcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgY29uc29sZSBmcm9tICdkZWJ1Zy1jb2xvcjIvbG9nZ2VyJztcbmltcG9ydCBkZWJvdW5jZSBmcm9tICdsb2Rhc2gvZGVib3VuY2UnO1xuaW1wb3J0IGZpbmRQb3J0LCB7IG1ha2VSYW5nZSB9IGZyb20gJ2dldC1wb3J0JztcbmltcG9ydCB1c2VJUEZTIGZyb20gJ3VzZS1pcGZzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHN0YXJ0U2VydmVyKG9wdGlvbnM6IHtcblx0cG9ydD86IG51bWJlciB8IHN0cmluZyxcblx0cHJveHk/OiBzdHJpbmdcbn0gPSB7fSlcbntcblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cdGxldCB7IHBvcnQgfSA9IG9wdGlvbnM7XG5cblx0aWYgKG9wdGlvbnMucHJveHkpXG5cdHtcblx0XHRwcm9jZXNzLmVudi5IVFRQX1BST1hZID0gcHJvY2Vzcy5lbnYuSFRUUFNfUFJPWFkgPSBvcHRpb25zLnByb3h5O1xuXHR9XG5cblx0Y29uc3Qgd2ViID0gYXdhaXQgX2NyZWF0ZVNlcnZlcihtaWNybyhhd2FpdCBpbXBvcnQoJy4vc2VydmVyL2luZGV4JykudGhlbihtID0+IG0uZGVmYXVsdCkpKTtcblxuXHRwb3J0ID0gKHBvcnQgYXMgbnVtYmVyIHwgMCkgfHwgZ2V0UG9ydChnZXRQb3J0RW52KCkpO1xuXG5cdHBvcnQgPSBhd2FpdCBmaW5kUG9ydCh7XG5cdFx0cG9ydDogbWFrZVJhbmdlKHBvcnQsIChwb3J0IHwgMCkgKyAxMCksXG5cdH0pO1xuXG5cdHdlYi5saXN0ZW4ocG9ydCwgYXN5bmMgKCkgPT5cblx0e1xuXHRcdHNob3dJUChwb3J0KTtcblxuXHRcdGxldCBfc2hvd0lQID0gZGVib3VuY2UoKCkgPT5cblx0XHR7XG5cdFx0XHRzaG93SVAocG9ydCk7XG5cdFx0fSwgMTEgKiAxMDAwKTtcblxuXHRcdF9zaG93SVAoKTtcblxuXHRcdGlmICgwKVxuXHRcdHtcblx0XHRcdEJsdWViaXJkXG5cdFx0XHRcdC5yZXNvbHZlKGltcG9ydCgnLi9zZXJ2ZXIvZ3VuL3NldHVwJykpXG5cdFx0XHRcdC50YXAoYXN5bmMgKG0pID0+XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRtLnNldHVwR3VuKHdlYik7XG5cblx0XHRcdFx0XHRyZXR1cm4gQmx1ZWJpcmQucmVzb2x2ZShbXG5cdFx0XHRcdFx0XHRcdCdkbXpqJyxcblx0XHRcdFx0XHRcdFx0J3dlbmt1OCcsXG5cdFx0XHRcdFx0XHRcdCdlc2p6b25lJyxcblx0XHRcdFx0XHRcdF0gYXMgY29uc3QpXG5cdFx0XHRcdFx0XHQubWFwKElES0VZID0+XG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBCbHVlYmlyZFxuXHRcdFx0XHRcdFx0XHRcdC5yZXNvbHZlKClcblx0XHRcdFx0XHRcdFx0XHQudGhlbih2ID0+IG0udXNlR3VuKCkuZ2V0KElES0VZKS50aGVuKCkpXG5cdFx0XHRcdFx0XHRcdFx0LnRpbWVvdXQoNSAqIDEwMDApXG5cdFx0XHRcdFx0XHRcdFx0LmNhdGNoKGUgPT4gbnVsbClcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQ7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5jYXRjaChlID0+IG51bGwpXG5cdFx0XHRcdC5kZWxheSg1ICogMTAwMClcblx0XHRcdFx0LnRhcChfc2hvd0lQKVxuXHRcdFx0O1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0Qmx1ZWJpcmRcblx0XHRcdFx0LnJlc29sdmUodXNlSVBGUygpKVxuXHRcdFx0XHQudGFwKGFzeW5jICh7XG5cdFx0XHRcdFx0YWRkcmVzc1xuXHRcdFx0XHR9KSA9PiB7XG5cdFx0XHRcdFx0Y29uc29sZS5pbmZvKGF3YWl0IGFkZHJlc3MoKSlcblx0XHRcdFx0fSlcblx0XHRcdFx0LmNhdGNoKGUgPT4gbnVsbClcblx0XHRcdFx0LnRhcCgoKSA9PiBfc2hvd0lQKCkpXG5cdFx0XHQ7XG5cdFx0fVxuXHR9KTtcblxuXHRyZXR1cm4gd2ViXG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0YXJ0U2VydmVyXG4iXX0=