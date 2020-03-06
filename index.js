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
exports.startServer = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsK0JBQXFEO0FBQ3JELGtEQUEwQjtBQUcxQix5REFBb0Q7QUFDcEQsa0RBQThCO0FBQzlCLHdEQUFnQztBQUNoQyxpRUFBMEM7QUFDMUMsK0RBQXVDO0FBQ3ZDLHFEQUErQztBQUMvQyx3REFBK0I7QUFFeEIsS0FBSyxVQUFVLFdBQVcsQ0FBQyxVQUc5QixFQUFFO0lBRUwsT0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7SUFDeEIsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQztJQUV2QixJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQ2pCO1FBQ0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztLQUNqRTtJQUVELE1BQU0sR0FBRyxHQUFHLE1BQU0sbUJBQWEsQ0FBQyxlQUFLLENBQUMsTUFBTSxrREFBTyxnQkFBZ0IsSUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTVGLElBQUksR0FBSSxJQUFtQixJQUFJLGlCQUFPLENBQUMsb0JBQVUsRUFBRSxDQUFDLENBQUM7SUFFckQsSUFBSSxHQUFHLE1BQU0sa0JBQVEsQ0FBQztRQUNyQixJQUFJLEVBQUUsb0JBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0tBQ3RDLENBQUMsQ0FBQztJQUVILEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssSUFBSSxFQUFFO1FBRTNCLFlBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUViLElBQUksT0FBTyxHQUFHLGtCQUFRLENBQUMsR0FBRyxFQUFFO1lBRTNCLFlBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNkLENBQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFFZCxPQUFPLEVBQUUsQ0FBQztRQUVWLElBQUksQ0FBQyxFQUNMO1NBNEJDO2FBRUQ7WUFDQyxrQkFBUTtpQkFDTixPQUFPLENBQUMsa0JBQU8sRUFBRSxDQUFDO2lCQUNsQixHQUFHLENBQUMsS0FBSyxFQUFFLEVBQ1gsT0FBTyxFQUNQLEVBQUUsRUFBRTtnQkFDSixnQkFBTyxDQUFDLElBQUksQ0FBQyxNQUFNLE9BQU8sRUFBRSxDQUFDLENBQUE7WUFDOUIsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQztpQkFDaEIsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQ3JCO1NBQ0Q7SUFDRixDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sR0FBRyxDQUFBO0FBQ1gsQ0FBQztBQTlFRCxrQ0E4RUM7QUFFRCxrQkFBZSxXQUFXLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVTZXJ2ZXIgYXMgX2NyZWF0ZVNlcnZlciB9IGZyb20gXCJodHRwXCI7XG5pbXBvcnQgbWljcm8gZnJvbSAnbWljcm8nO1xuaW1wb3J0IHsgZ2VuZXJhdGUgYXMgcXJjb2RlIH0gZnJvbSAncXJjb2RlLXRlcm1pbmFsJztcbmltcG9ydCBzZWFyY2hJUEFkZHJlc3MgZnJvbSAnYWRkcmVzczInO1xuaW1wb3J0IGdldFBvcnQsIHsgZ2V0UG9ydEVudiB9IGZyb20gJy4vbGliL2dldFBvcnQnO1xuaW1wb3J0IHNob3dJUCBmcm9tICcuL2xpYi9pcCc7XG5pbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IGNvbnNvbGUgZnJvbSAnZGVidWctY29sb3IyL2xvZ2dlcic7XG5pbXBvcnQgZGVib3VuY2UgZnJvbSAnbG9kYXNoL2RlYm91bmNlJztcbmltcG9ydCBmaW5kUG9ydCwgeyBtYWtlUmFuZ2UgfSBmcm9tICdnZXQtcG9ydCc7XG5pbXBvcnQgdXNlSVBGUyBmcm9tICd1c2UtaXBmcyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzdGFydFNlcnZlcihvcHRpb25zOiB7XG5cdHBvcnQ/OiBudW1iZXIgfCBzdHJpbmcsXG5cdHByb3h5Pzogc3RyaW5nXG59ID0ge30pXG57XG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXHRsZXQgeyBwb3J0IH0gPSBvcHRpb25zO1xuXG5cdGlmIChvcHRpb25zLnByb3h5KVxuXHR7XG5cdFx0cHJvY2Vzcy5lbnYuSFRUUF9QUk9YWSA9IHByb2Nlc3MuZW52LkhUVFBTX1BST1hZID0gb3B0aW9ucy5wcm94eTtcblx0fVxuXG5cdGNvbnN0IHdlYiA9IGF3YWl0IF9jcmVhdGVTZXJ2ZXIobWljcm8oYXdhaXQgaW1wb3J0KCcuL3NlcnZlci9pbmRleCcpLnRoZW4obSA9PiBtLmRlZmF1bHQpKSk7XG5cblx0cG9ydCA9IChwb3J0IGFzIG51bWJlciB8IDApIHx8IGdldFBvcnQoZ2V0UG9ydEVudigpKTtcblxuXHRwb3J0ID0gYXdhaXQgZmluZFBvcnQoe1xuXHRcdHBvcnQ6IG1ha2VSYW5nZShwb3J0LCAocG9ydCB8IDApICsgMTApLFxuXHR9KTtcblxuXHR3ZWIubGlzdGVuKHBvcnQsIGFzeW5jICgpID0+XG5cdHtcblx0XHRzaG93SVAocG9ydCk7XG5cblx0XHRsZXQgX3Nob3dJUCA9IGRlYm91bmNlKCgpID0+XG5cdFx0e1xuXHRcdFx0c2hvd0lQKHBvcnQpO1xuXHRcdH0sIDExICogMTAwMCk7XG5cblx0XHRfc2hvd0lQKCk7XG5cblx0XHRpZiAoMClcblx0XHR7XG5cdFx0XHQvKlxuXHRcdFx0Qmx1ZWJpcmRcblx0XHRcdFx0LnJlc29sdmUoaW1wb3J0KCcuL3NlcnZlci9ndW4vc2V0dXAnKSlcblx0XHRcdFx0LnRhcChhc3luYyAobSkgPT5cblx0XHRcdFx0e1xuXHRcdFx0XHRcdG0uc2V0dXBHdW4od2ViKTtcblxuXHRcdFx0XHRcdHJldHVybiBCbHVlYmlyZC5yZXNvbHZlKFtcblx0XHRcdFx0XHRcdFx0J2RtemonLFxuXHRcdFx0XHRcdFx0XHQnd2Vua3U4Jyxcblx0XHRcdFx0XHRcdFx0J2VzanpvbmUnLFxuXHRcdFx0XHRcdFx0XSBhcyBjb25zdClcblx0XHRcdFx0XHRcdC5tYXAoSURLRVkgPT5cblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIEJsdWViaXJkXG5cdFx0XHRcdFx0XHRcdFx0LnJlc29sdmUoKVxuXHRcdFx0XHRcdFx0XHRcdC50aGVuKHYgPT4gbS51c2VHdW4oKS5nZXQoSURLRVkpLnRoZW4oKSlcblx0XHRcdFx0XHRcdFx0XHQudGltZW91dCg1ICogMTAwMClcblx0XHRcdFx0XHRcdFx0XHQuY2F0Y2goZSA9PiBudWxsKVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdDtcblx0XHRcdFx0fSlcblx0XHRcdFx0LmNhdGNoKGUgPT4gbnVsbClcblx0XHRcdFx0LmRlbGF5KDUgKiAxMDAwKVxuXHRcdFx0XHQudGFwKF9zaG93SVApXG5cdFx0XHQ7XG5cdFx0XHQgKi9cblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdEJsdWViaXJkXG5cdFx0XHRcdC5yZXNvbHZlKHVzZUlQRlMoKSlcblx0XHRcdFx0LnRhcChhc3luYyAoe1xuXHRcdFx0XHRcdGFkZHJlc3Ncblx0XHRcdFx0fSkgPT4ge1xuXHRcdFx0XHRcdGNvbnNvbGUuaW5mbyhhd2FpdCBhZGRyZXNzKCkpXG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5jYXRjaChlID0+IG51bGwpXG5cdFx0XHRcdC50YXAoKCkgPT4gX3Nob3dJUCgpKVxuXHRcdFx0O1xuXHRcdH1cblx0fSk7XG5cblx0cmV0dXJuIHdlYlxufVxuXG5leHBvcnQgZGVmYXVsdCBzdGFydFNlcnZlclxuIl19