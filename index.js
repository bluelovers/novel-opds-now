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
async function startServer(port = getPort_1.default(getPort_1.getPortEnv())) {
    const web = http_1.createServer(micro_1.default(await Promise.resolve().then(() => __importStar(require('./server/index'))).then(m => m.default)));
    web.listen(port, async () => {
        ip_1.default(port);
        bluebird_1.default.delay(5 * 1000)
            .tap(v => {
            ip_1.default(port);
        });
        bluebird_1.default.resolve(Promise.resolve().then(() => __importStar(require('./server/gun/setup'))))
            .then(m => m.setupGun(web))
            .delay(5 * 1000)
            .tap(v => {
            ip_1.default(port);
        });
    });
    return web;
}
exports.startServer = startServer;
exports.default = startServer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSwrQkFBcUQ7QUFDckQsa0RBQTBCO0FBRzFCLHlEQUFvRDtBQUNwRCxrREFBOEI7QUFDOUIsd0RBQWdDO0FBR3pCLEtBQUssVUFBVSxXQUFXLENBQUMsT0FBd0IsaUJBQU8sQ0FBQyxvQkFBVSxFQUFFLENBQUM7SUFFOUUsTUFBTSxHQUFHLEdBQUcsbUJBQWEsQ0FBQyxlQUFLLENBQUMsTUFBTSxrREFBTyxnQkFBZ0IsSUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXRGLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssSUFBSSxFQUFFO1FBRTNCLFlBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUViLGtCQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7YUFDdEIsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ1IsWUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2QsQ0FBQyxDQUFDLENBQ0Y7UUFFRCxrQkFBUSxDQUFDLE9BQU8sbURBQVEsb0JBQW9CLElBQUU7YUFDNUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUMxQixLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQzthQUNmLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNSLFlBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNkLENBQUMsQ0FBQyxDQUNGO0lBQ0YsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLEdBQUcsQ0FBQTtBQUNYLENBQUM7QUF4QkQsa0NBd0JDO0FBRUQsa0JBQWUsV0FBVyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlU2VydmVyIGFzIF9jcmVhdGVTZXJ2ZXIgfSBmcm9tIFwiaHR0cFwiO1xuaW1wb3J0IG1pY3JvIGZyb20gJ21pY3JvJztcbmltcG9ydCB7IGdlbmVyYXRlIGFzIHFyY29kZSB9IGZyb20gJ3FyY29kZS10ZXJtaW5hbCc7XG5pbXBvcnQgc2VhcmNoSVBBZGRyZXNzIGZyb20gJ2FkZHJlc3MyJztcbmltcG9ydCBnZXRQb3J0LCB7IGdldFBvcnRFbnYgfSBmcm9tICcuL2xpYi9nZXRQb3J0JztcbmltcG9ydCBzaG93SVAgZnJvbSAnLi9saWIvaXAnO1xuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcblxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc3RhcnRTZXJ2ZXIocG9ydDogbnVtYmVyIHwgc3RyaW5nID0gZ2V0UG9ydChnZXRQb3J0RW52KCkpKVxue1xuXHRjb25zdCB3ZWIgPSBfY3JlYXRlU2VydmVyKG1pY3JvKGF3YWl0IGltcG9ydCgnLi9zZXJ2ZXIvaW5kZXgnKS50aGVuKG0gPT4gbS5kZWZhdWx0KSkpO1xuXG5cdHdlYi5saXN0ZW4ocG9ydCwgYXN5bmMgKCkgPT5cblx0e1xuXHRcdHNob3dJUChwb3J0KTtcblxuXHRcdEJsdWViaXJkLmRlbGF5KDUgKiAxMDAwKVxuXHRcdFx0LnRhcCh2ID0+IHtcblx0XHRcdFx0c2hvd0lQKHBvcnQpO1xuXHRcdFx0fSlcblx0XHQ7XG5cblx0XHRCbHVlYmlyZC5yZXNvbHZlKGltcG9ydCgnLi9zZXJ2ZXIvZ3VuL3NldHVwJykpXG5cdFx0XHQudGhlbihtID0+IG0uc2V0dXBHdW4od2ViKSlcblx0XHRcdC5kZWxheSg1ICogMTAwMClcblx0XHRcdC50YXAodiA9PiB7XG5cdFx0XHRcdHNob3dJUChwb3J0KTtcblx0XHRcdH0pXG5cdFx0O1xuXHR9KTtcblxuXHRyZXR1cm4gd2ViXG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0YXJ0U2VydmVyXG4iXX0=