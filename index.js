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
                .catch(e => null)
                .tap(e => _showIP());
        }
    });
    return web;
}
exports.startServer = startServer;
exports.default = startServer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSwrQkFBcUQ7QUFDckQsa0RBQTBCO0FBRzFCLHlEQUFvRDtBQUNwRCxrREFBOEI7QUFDOUIsd0RBQWdDO0FBRWhDLCtEQUF1QztBQUN2QyxxREFBK0M7QUFDL0Msd0RBQStCO0FBRXhCLEtBQUssVUFBVSxXQUFXLENBQUMsVUFHOUIsRUFBRTtJQUVMLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO0lBQ3hCLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUM7SUFFdkIsSUFBSSxPQUFPLENBQUMsS0FBSyxFQUNqQjtRQUNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7S0FDakU7SUFFRCxNQUFNLEdBQUcsR0FBRyxNQUFNLG1CQUFhLENBQUMsZUFBSyxDQUFDLE1BQU0sa0RBQU8sZ0JBQWdCLElBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUU1RixJQUFJLEdBQUksSUFBbUIsSUFBSSxpQkFBTyxDQUFDLG9CQUFVLEVBQUUsQ0FBQyxDQUFDO0lBRXJELElBQUksR0FBRyxNQUFNLGtCQUFRLENBQUM7UUFDckIsSUFBSSxFQUFFLG9CQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztLQUN0QyxDQUFDLENBQUM7SUFFSCxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLElBQUksRUFBRTtRQUUzQixZQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFYixJQUFJLE9BQU8sR0FBRyxrQkFBUSxDQUFDLEdBQUcsRUFBRTtZQUUzQixZQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDZCxDQUFDLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBRWQsT0FBTyxFQUFFLENBQUM7UUFFVixJQUFJLENBQUMsRUFDTDtZQUNDLGtCQUFRO2lCQUNOLE9BQU8sbURBQVEsb0JBQW9CLElBQUU7aUJBQ3JDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBRWhCLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRWhCLE9BQU8sa0JBQVEsQ0FBQyxPQUFPLENBQUM7b0JBQ3RCLE1BQU07b0JBQ04sUUFBUTtvQkFDUixTQUFTO2lCQUNBLENBQUM7cUJBQ1YsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUVaLE9BQU8sa0JBQVE7eUJBQ2IsT0FBTyxFQUFFO3lCQUNULElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7eUJBQ3ZDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO3lCQUNqQixLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFDbkIsQ0FBQyxDQUFDLENBQ0Q7WUFDSCxDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO2lCQUNoQixLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztpQkFDZixHQUFHLENBQUMsT0FBTyxDQUFDLENBQ2I7U0FDRDthQUVEO1lBQ0Msa0JBQVE7aUJBQ04sT0FBTyxDQUFDLGtCQUFPLEVBQVMsQ0FBQztpQkFDekIsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO2lCQUNoQixHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUNwQjtTQUNEO0lBQ0YsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLEdBQUcsQ0FBQTtBQUNYLENBQUM7QUF2RUQsa0NBdUVDO0FBRUQsa0JBQWUsV0FBVyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlU2VydmVyIGFzIF9jcmVhdGVTZXJ2ZXIgfSBmcm9tIFwiaHR0cFwiO1xuaW1wb3J0IG1pY3JvIGZyb20gJ21pY3JvJztcbmltcG9ydCB7IGdlbmVyYXRlIGFzIHFyY29kZSB9IGZyb20gJ3FyY29kZS10ZXJtaW5hbCc7XG5pbXBvcnQgc2VhcmNoSVBBZGRyZXNzIGZyb20gJ2FkZHJlc3MyJztcbmltcG9ydCBnZXRQb3J0LCB7IGdldFBvcnRFbnYgfSBmcm9tICcuL2xpYi9nZXRQb3J0JztcbmltcG9ydCBzaG93SVAgZnJvbSAnLi9saWIvaXAnO1xuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBjb25zb2xlIGZyb20gJ2RlYnVnLWNvbG9yMi9sb2dnZXInO1xuaW1wb3J0IGRlYm91bmNlIGZyb20gJ2xvZGFzaC9kZWJvdW5jZSc7XG5pbXBvcnQgZmluZFBvcnQsIHsgbWFrZVJhbmdlIH0gZnJvbSAnZ2V0LXBvcnQnO1xuaW1wb3J0IHVzZUlQRlMgZnJvbSAndXNlLWlwZnMnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc3RhcnRTZXJ2ZXIob3B0aW9uczoge1xuXHRwb3J0PzogbnVtYmVyIHwgc3RyaW5nLFxuXHRwcm94eT86IHN0cmluZ1xufSA9IHt9KVxue1xuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblx0bGV0IHsgcG9ydCB9ID0gb3B0aW9ucztcblxuXHRpZiAob3B0aW9ucy5wcm94eSlcblx0e1xuXHRcdHByb2Nlc3MuZW52LkhUVFBfUFJPWFkgPSBwcm9jZXNzLmVudi5IVFRQU19QUk9YWSA9IG9wdGlvbnMucHJveHk7XG5cdH1cblxuXHRjb25zdCB3ZWIgPSBhd2FpdCBfY3JlYXRlU2VydmVyKG1pY3JvKGF3YWl0IGltcG9ydCgnLi9zZXJ2ZXIvaW5kZXgnKS50aGVuKG0gPT4gbS5kZWZhdWx0KSkpO1xuXG5cdHBvcnQgPSAocG9ydCBhcyBudW1iZXIgfCAwKSB8fCBnZXRQb3J0KGdldFBvcnRFbnYoKSk7XG5cblx0cG9ydCA9IGF3YWl0IGZpbmRQb3J0KHtcblx0XHRwb3J0OiBtYWtlUmFuZ2UocG9ydCwgKHBvcnQgfCAwKSArIDEwKSxcblx0fSk7XG5cblx0d2ViLmxpc3Rlbihwb3J0LCBhc3luYyAoKSA9PlxuXHR7XG5cdFx0c2hvd0lQKHBvcnQpO1xuXG5cdFx0bGV0IF9zaG93SVAgPSBkZWJvdW5jZSgoKSA9PlxuXHRcdHtcblx0XHRcdHNob3dJUChwb3J0KTtcblx0XHR9LCAxMSAqIDEwMDApO1xuXG5cdFx0X3Nob3dJUCgpO1xuXG5cdFx0aWYgKDApXG5cdFx0e1xuXHRcdFx0Qmx1ZWJpcmRcblx0XHRcdFx0LnJlc29sdmUoaW1wb3J0KCcuL3NlcnZlci9ndW4vc2V0dXAnKSlcblx0XHRcdFx0LnRhcChhc3luYyAobSkgPT5cblx0XHRcdFx0e1xuXHRcdFx0XHRcdG0uc2V0dXBHdW4od2ViKTtcblxuXHRcdFx0XHRcdHJldHVybiBCbHVlYmlyZC5yZXNvbHZlKFtcblx0XHRcdFx0XHRcdFx0J2RtemonLFxuXHRcdFx0XHRcdFx0XHQnd2Vua3U4Jyxcblx0XHRcdFx0XHRcdFx0J2VzanpvbmUnLFxuXHRcdFx0XHRcdFx0XSBhcyBjb25zdClcblx0XHRcdFx0XHRcdC5tYXAoSURLRVkgPT5cblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIEJsdWViaXJkXG5cdFx0XHRcdFx0XHRcdFx0LnJlc29sdmUoKVxuXHRcdFx0XHRcdFx0XHRcdC50aGVuKHYgPT4gbS51c2VHdW4oKS5nZXQoSURLRVkpLnRoZW4oKSlcblx0XHRcdFx0XHRcdFx0XHQudGltZW91dCg1ICogMTAwMClcblx0XHRcdFx0XHRcdFx0XHQuY2F0Y2goZSA9PiBudWxsKVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdDtcblx0XHRcdFx0fSlcblx0XHRcdFx0LmNhdGNoKGUgPT4gbnVsbClcblx0XHRcdFx0LmRlbGF5KDUgKiAxMDAwKVxuXHRcdFx0XHQudGFwKF9zaG93SVApXG5cdFx0XHQ7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRCbHVlYmlyZFxuXHRcdFx0XHQucmVzb2x2ZSh1c2VJUEZTKCkgYXMgYW55KVxuXHRcdFx0XHQuY2F0Y2goZSA9PiBudWxsKVxuXHRcdFx0XHQudGFwKGUgPT4gX3Nob3dJUCgpKVxuXHRcdFx0O1xuXHRcdH1cblx0fSk7XG5cblx0cmV0dXJuIHdlYlxufVxuXG5leHBvcnQgZGVmYXVsdCBzdGFydFNlcnZlclxuIl19