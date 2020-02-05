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
async function startServer(port = getPort_1.default(getPort_1.getPortEnv())) {
    const web = http_1.createServer(micro_1.default(await Promise.resolve().then(() => __importStar(require('./server/index'))).then(m => m.default)));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSwrQkFBcUQ7QUFDckQsa0RBQTBCO0FBRzFCLHlEQUFvRDtBQUNwRCxrREFBOEI7QUFDOUIsd0RBQWdDO0FBRWhDLCtEQUF1QztBQUVoQyxLQUFLLFVBQVUsV0FBVyxDQUFDLE9BQXdCLGlCQUFPLENBQUMsb0JBQVUsRUFBRSxDQUFDO0lBRTlFLE1BQU0sR0FBRyxHQUFHLG1CQUFhLENBQUMsZUFBSyxDQUFDLE1BQU0sa0RBQU8sZ0JBQWdCLElBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV0RixHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLElBQUksRUFBRTtRQUUzQixZQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFYixJQUFJLE9BQU8sR0FBRyxrQkFBUSxDQUFDLEdBQUcsRUFBRTtZQUMzQixZQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDZCxDQUFDLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBRWQsT0FBTyxFQUFFLENBQUM7UUFFVixrQkFBUTthQUNOLE9BQU8sbURBQVEsb0JBQW9CLElBQUU7YUFDckMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNoQixDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRWhCLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzFCLENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQzthQUNoQixLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQzthQUNmLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FDYjtJQUNGLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxHQUFHLENBQUE7QUFDWCxDQUFDO0FBNUJELGtDQTRCQztBQUVELGtCQUFlLFdBQVcsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZVNlcnZlciBhcyBfY3JlYXRlU2VydmVyIH0gZnJvbSBcImh0dHBcIjtcbmltcG9ydCBtaWNybyBmcm9tICdtaWNybyc7XG5pbXBvcnQgeyBnZW5lcmF0ZSBhcyBxcmNvZGUgfSBmcm9tICdxcmNvZGUtdGVybWluYWwnO1xuaW1wb3J0IHNlYXJjaElQQWRkcmVzcyBmcm9tICdhZGRyZXNzMic7XG5pbXBvcnQgZ2V0UG9ydCwgeyBnZXRQb3J0RW52IH0gZnJvbSAnLi9saWIvZ2V0UG9ydCc7XG5pbXBvcnQgc2hvd0lQIGZyb20gJy4vbGliL2lwJztcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgY29uc29sZSBmcm9tICdkZWJ1Zy1jb2xvcjIvbG9nZ2VyJztcbmltcG9ydCBkZWJvdW5jZSBmcm9tICdsb2Rhc2gvZGVib3VuY2UnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc3RhcnRTZXJ2ZXIocG9ydDogbnVtYmVyIHwgc3RyaW5nID0gZ2V0UG9ydChnZXRQb3J0RW52KCkpKVxue1xuXHRjb25zdCB3ZWIgPSBfY3JlYXRlU2VydmVyKG1pY3JvKGF3YWl0IGltcG9ydCgnLi9zZXJ2ZXIvaW5kZXgnKS50aGVuKG0gPT4gbS5kZWZhdWx0KSkpO1xuXG5cdHdlYi5saXN0ZW4ocG9ydCwgYXN5bmMgKCkgPT5cblx0e1xuXHRcdHNob3dJUChwb3J0KTtcblxuXHRcdGxldCBfc2hvd0lQID0gZGVib3VuY2UoKCkgPT4ge1xuXHRcdFx0c2hvd0lQKHBvcnQpO1xuXHRcdH0sIDEwICogMTAwMCk7XG5cblx0XHRfc2hvd0lQKCk7XG5cblx0XHRCbHVlYmlyZFxuXHRcdFx0LnJlc29sdmUoaW1wb3J0KCcuL3NlcnZlci9ndW4vc2V0dXAnKSlcblx0XHRcdC50YXAoYXN5bmMgKG0pID0+IHtcblx0XHRcdFx0bS5zZXR1cEd1bih3ZWIpO1xuXG5cdFx0XHRcdHJldHVybiBtLnVzZUd1bigpLnRoZW4oKTtcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goZSA9PiBudWxsKVxuXHRcdFx0LmRlbGF5KDUgKiAxMDAwKVxuXHRcdFx0LnRhcChfc2hvd0lQKVxuXHRcdDtcblx0fSk7XG5cblx0cmV0dXJuIHdlYlxufVxuXG5leHBvcnQgZGVmYXVsdCBzdGFydFNlcnZlclxuIl19