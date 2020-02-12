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
async function startServer(options) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSwrQkFBcUQ7QUFDckQsa0RBQTBCO0FBRzFCLHlEQUFvRDtBQUNwRCxrREFBOEI7QUFDOUIsd0RBQWdDO0FBRWhDLCtEQUF1QztBQUVoQyxLQUFLLFVBQVUsV0FBVyxDQUFDLE9BR2pDO0lBRUEsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQztJQUV2QixJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQ2pCO1FBQ0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztLQUNqRTtJQUVELE1BQU0sR0FBRyxHQUFHLE1BQU0sbUJBQWEsQ0FBQyxlQUFLLENBQUMsTUFBTSxrREFBTyxnQkFBZ0IsSUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTVGLElBQUksR0FBSSxJQUFtQixJQUFJLGlCQUFPLENBQUMsb0JBQVUsRUFBRSxDQUFDLENBQUM7SUFFckQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFFM0IsWUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWIsSUFBSSxPQUFPLEdBQUcsa0JBQVEsQ0FBQyxHQUFHLEVBQUU7WUFDM0IsWUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2QsQ0FBQyxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUVkLE9BQU8sRUFBRSxDQUFDO1FBRVYsa0JBQVE7YUFDTixPQUFPLG1EQUFRLG9CQUFvQixJQUFFO2FBQ3JDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDaEIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVoQixPQUFPLGtCQUFRLENBQUMsT0FBTyxDQUFDO2dCQUN0QixNQUFNO2dCQUNOLFFBQVE7Z0JBQ1IsU0FBUzthQUNBLENBQUM7aUJBQ1YsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNaLE9BQU8sa0JBQVE7cUJBQ2IsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7cUJBQ3JDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO3FCQUNqQixLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNuQixDQUFDLENBQUMsQ0FDRDtRQUNILENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQzthQUNoQixLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQzthQUNmLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FDYjtJQUNGLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxHQUFHLENBQUE7QUFDWCxDQUFDO0FBbkRELGtDQW1EQztBQUVELGtCQUFlLFdBQVcsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZVNlcnZlciBhcyBfY3JlYXRlU2VydmVyIH0gZnJvbSBcImh0dHBcIjtcbmltcG9ydCBtaWNybyBmcm9tICdtaWNybyc7XG5pbXBvcnQgeyBnZW5lcmF0ZSBhcyBxcmNvZGUgfSBmcm9tICdxcmNvZGUtdGVybWluYWwnO1xuaW1wb3J0IHNlYXJjaElQQWRkcmVzcyBmcm9tICdhZGRyZXNzMic7XG5pbXBvcnQgZ2V0UG9ydCwgeyBnZXRQb3J0RW52IH0gZnJvbSAnLi9saWIvZ2V0UG9ydCc7XG5pbXBvcnQgc2hvd0lQIGZyb20gJy4vbGliL2lwJztcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgY29uc29sZSBmcm9tICdkZWJ1Zy1jb2xvcjIvbG9nZ2VyJztcbmltcG9ydCBkZWJvdW5jZSBmcm9tICdsb2Rhc2gvZGVib3VuY2UnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc3RhcnRTZXJ2ZXIob3B0aW9uczoge1xuXHRwb3J0PzogbnVtYmVyIHwgc3RyaW5nLFxuXHRwcm94eT86IHN0cmluZ1xufSlcbntcblx0bGV0IHsgcG9ydCB9ID0gb3B0aW9ucztcblxuXHRpZiAob3B0aW9ucy5wcm94eSlcblx0e1xuXHRcdHByb2Nlc3MuZW52LkhUVFBfUFJPWFkgPSBwcm9jZXNzLmVudi5IVFRQU19QUk9YWSA9IG9wdGlvbnMucHJveHk7XG5cdH1cblxuXHRjb25zdCB3ZWIgPSBhd2FpdCBfY3JlYXRlU2VydmVyKG1pY3JvKGF3YWl0IGltcG9ydCgnLi9zZXJ2ZXIvaW5kZXgnKS50aGVuKG0gPT4gbS5kZWZhdWx0KSkpO1xuXG5cdHBvcnQgPSAocG9ydCBhcyBudW1iZXIgfCAwKSB8fCBnZXRQb3J0KGdldFBvcnRFbnYoKSk7XG5cblx0d2ViLmxpc3Rlbihwb3J0LCBhc3luYyAoKSA9PlxuXHR7XG5cdFx0c2hvd0lQKHBvcnQpO1xuXG5cdFx0bGV0IF9zaG93SVAgPSBkZWJvdW5jZSgoKSA9PiB7XG5cdFx0XHRzaG93SVAocG9ydCk7XG5cdFx0fSwgMTEgKiAxMDAwKTtcblxuXHRcdF9zaG93SVAoKTtcblxuXHRcdEJsdWViaXJkXG5cdFx0XHQucmVzb2x2ZShpbXBvcnQoJy4vc2VydmVyL2d1bi9zZXR1cCcpKVxuXHRcdFx0LnRhcChhc3luYyAobSkgPT4ge1xuXHRcdFx0XHRtLnNldHVwR3VuKHdlYik7XG5cblx0XHRcdFx0cmV0dXJuIEJsdWViaXJkLnJlc29sdmUoW1xuXHRcdFx0XHRcdFx0J2RtemonLFxuXHRcdFx0XHRcdFx0J3dlbmt1OCcsXG5cdFx0XHRcdFx0XHQnZXNqem9uZSdcblx0XHRcdFx0XHRdIGFzIGNvbnN0KVxuXHRcdFx0XHRcdC5tYXAoSURLRVkgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIEJsdWViaXJkXG5cdFx0XHRcdFx0XHRcdC5yZXNvbHZlKG0udXNlR3VuKCkuZ2V0KElES0VZKS50aGVuKCkpXG5cdFx0XHRcdFx0XHRcdC50aW1lb3V0KDUgKiAxMDAwKVxuXHRcdFx0XHRcdFx0XHQuY2F0Y2goZSA9PiBudWxsKVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0O1xuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChlID0+IG51bGwpXG5cdFx0XHQuZGVsYXkoNSAqIDEwMDApXG5cdFx0XHQudGFwKF9zaG93SVApXG5cdFx0O1xuXHR9KTtcblxuXHRyZXR1cm4gd2ViXG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0YXJ0U2VydmVyXG4iXX0=