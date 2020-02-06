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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSwrQkFBcUQ7QUFDckQsa0RBQTBCO0FBRzFCLHlEQUFvRDtBQUNwRCxrREFBOEI7QUFDOUIsd0RBQWdDO0FBRWhDLCtEQUF1QztBQUVoQyxLQUFLLFVBQVUsV0FBVyxDQUFDLElBQXNCO0lBRXZELE1BQU0sR0FBRyxHQUFHLE1BQU0sbUJBQWEsQ0FBQyxlQUFLLENBQUMsTUFBTSxrREFBTyxnQkFBZ0IsSUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTVGLElBQUksR0FBSSxJQUFtQixJQUFJLGlCQUFPLENBQUMsb0JBQVUsRUFBRSxDQUFDLENBQUM7SUFFckQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFFM0IsWUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWIsSUFBSSxPQUFPLEdBQUcsa0JBQVEsQ0FBQyxHQUFHLEVBQUU7WUFDM0IsWUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2QsQ0FBQyxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUVkLE9BQU8sRUFBRSxDQUFDO1FBRVYsa0JBQVE7YUFDTixPQUFPLG1EQUFRLG9CQUFvQixJQUFFO2FBQ3JDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDaEIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVoQixPQUFPLGtCQUFRLENBQUMsT0FBTyxDQUFDO2dCQUN0QixNQUFNO2dCQUNOLFFBQVE7Z0JBQ1IsU0FBUzthQUNBLENBQUM7aUJBQ1YsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNaLE9BQU8sa0JBQVE7cUJBQ2IsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7cUJBQ3JDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO3FCQUNqQixLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNuQixDQUFDLENBQUMsQ0FDRDtRQUNILENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQzthQUNoQixLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQzthQUNmLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FDYjtJQUNGLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxHQUFHLENBQUE7QUFDWCxDQUFDO0FBekNELGtDQXlDQztBQUVELGtCQUFlLFdBQVcsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZVNlcnZlciBhcyBfY3JlYXRlU2VydmVyIH0gZnJvbSBcImh0dHBcIjtcbmltcG9ydCBtaWNybyBmcm9tICdtaWNybyc7XG5pbXBvcnQgeyBnZW5lcmF0ZSBhcyBxcmNvZGUgfSBmcm9tICdxcmNvZGUtdGVybWluYWwnO1xuaW1wb3J0IHNlYXJjaElQQWRkcmVzcyBmcm9tICdhZGRyZXNzMic7XG5pbXBvcnQgZ2V0UG9ydCwgeyBnZXRQb3J0RW52IH0gZnJvbSAnLi9saWIvZ2V0UG9ydCc7XG5pbXBvcnQgc2hvd0lQIGZyb20gJy4vbGliL2lwJztcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgY29uc29sZSBmcm9tICdkZWJ1Zy1jb2xvcjIvbG9nZ2VyJztcbmltcG9ydCBkZWJvdW5jZSBmcm9tICdsb2Rhc2gvZGVib3VuY2UnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc3RhcnRTZXJ2ZXIocG9ydD86IG51bWJlciB8IHN0cmluZylcbntcblx0Y29uc3Qgd2ViID0gYXdhaXQgX2NyZWF0ZVNlcnZlcihtaWNybyhhd2FpdCBpbXBvcnQoJy4vc2VydmVyL2luZGV4JykudGhlbihtID0+IG0uZGVmYXVsdCkpKTtcblxuXHRwb3J0ID0gKHBvcnQgYXMgbnVtYmVyIHwgMCkgfHwgZ2V0UG9ydChnZXRQb3J0RW52KCkpO1xuXG5cdHdlYi5saXN0ZW4ocG9ydCwgYXN5bmMgKCkgPT5cblx0e1xuXHRcdHNob3dJUChwb3J0KTtcblxuXHRcdGxldCBfc2hvd0lQID0gZGVib3VuY2UoKCkgPT4ge1xuXHRcdFx0c2hvd0lQKHBvcnQpO1xuXHRcdH0sIDExICogMTAwMCk7XG5cblx0XHRfc2hvd0lQKCk7XG5cblx0XHRCbHVlYmlyZFxuXHRcdFx0LnJlc29sdmUoaW1wb3J0KCcuL3NlcnZlci9ndW4vc2V0dXAnKSlcblx0XHRcdC50YXAoYXN5bmMgKG0pID0+IHtcblx0XHRcdFx0bS5zZXR1cEd1bih3ZWIpO1xuXG5cdFx0XHRcdHJldHVybiBCbHVlYmlyZC5yZXNvbHZlKFtcblx0XHRcdFx0XHRcdCdkbXpqJyxcblx0XHRcdFx0XHRcdCd3ZW5rdTgnLFxuXHRcdFx0XHRcdFx0J2VzanpvbmUnXG5cdFx0XHRcdFx0XSBhcyBjb25zdClcblx0XHRcdFx0XHQubWFwKElES0VZID0+IHtcblx0XHRcdFx0XHRcdHJldHVybiBCbHVlYmlyZFxuXHRcdFx0XHRcdFx0XHQucmVzb2x2ZShtLnVzZUd1bigpLmdldChJREtFWSkudGhlbigpKVxuXHRcdFx0XHRcdFx0XHQudGltZW91dCg1ICogMTAwMClcblx0XHRcdFx0XHRcdFx0LmNhdGNoKGUgPT4gbnVsbClcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdDtcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goZSA9PiBudWxsKVxuXHRcdFx0LmRlbGF5KDUgKiAxMDAwKVxuXHRcdFx0LnRhcChfc2hvd0lQKVxuXHRcdDtcblx0fSk7XG5cblx0cmV0dXJuIHdlYlxufVxuXG5leHBvcnQgZGVmYXVsdCBzdGFydFNlcnZlclxuIl19