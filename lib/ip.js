"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showIP = void 0;
const address2_1 = __importDefault(require("address2"));
const qrcode_terminal_1 = require("qrcode-terminal");
const terminal_link_1 = __importDefault(require("terminal-link"));
const logger_1 = __importDefault(require("debug-color2/logger"));
const debug_color2_1 = __importDefault(require("debug-color2"));
const os_1 = require("os");
const url_1 = require("url");
function showIP(port) {
    logger_1.default.info(`如果不能連上伺服器的話\n請查詢自己的電腦IP\n或確認自己的防火牆與 wifi 設定\n或利用 ${terminal_link_1.default(`share-localhost`, `https://www.npmjs.com/package/share-localhost`)}\n這類工具來讓外部網路可以讀取自己內部網路的IP`);
    debug_color2_1.default.yellow.log(`\n請使用以下其中一個位址來連接至伺服器\n`);
    let ip = `localhost`;
    let href = url_1.format({
        protocol: 'http',
        hostname: ip,
        port,
        pathname: '/opds',
    });
    debug_color2_1.default.info(terminal_link_1.default(ip, href));
    ip = os_1.hostname();
    href = url_1.format({
        protocol: 'http',
        hostname: ip,
        port,
        pathname: '/opds',
    });
    debug_color2_1.default.info(terminal_link_1.default(ip, href));
    ip = address2_1.default();
    let interfaceName = ip;
    let interfaces = os_1.networkInterfaces();
    Object.entries(interfaces)
        .forEach(([name, data]) => {
        let _skip = false;
        data = data
            .filter(v => {
            if (ip && v.address === ip) {
                interfaceName = name;
                _skip = true;
            }
            else if (v.address === '127.0.0.1' || v.address === '::1') {
                _skip = true;
            }
            return v.address && !_skip;
        });
        if (_skip) {
            return;
        }
        let ls = data
            .filter(v => {
            return v.family === 'IPv4';
        });
        (ls.length ? ls : data)
            .forEach(v => {
            let ip = v.address;
            let href = url_1.format({
                protocol: 'http',
                hostname: ip,
                port,
                pathname: '/opds',
            });
            debug_color2_1.default.info(terminal_link_1.default(name, href));
        });
    });
    if (ip != '127.0.0.1') {
        href = url_1.format({
            protocol: 'http',
            hostname: ip,
            port,
            pathname: '/opds',
        });
        debug_color2_1.default.log('');
        debug_color2_1.default.success(terminal_link_1.default(interfaceName, href));
    }
    else {
        ip = `localhost`;
        href = url_1.format({
            protocol: 'http',
            hostname: ip,
            port,
            pathname: '/opds',
        });
    }
    qrcode_terminal_1.generate(href, { small: true });
}
exports.showIP = showIP;
exports.default = showIP;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3REFBdUM7QUFDdkMscURBQXFEO0FBQ3JELGtFQUF5QztBQUN6QyxpRUFBMkM7QUFDM0MsZ0VBQW1DO0FBQ25DLDJCQUFzRjtBQUN0Riw2QkFBMEM7QUFFMUMsU0FBZ0IsTUFBTSxDQUFDLElBQXFCO0lBRTNDLGdCQUFRLENBQUMsSUFBSSxDQUFDLG9EQUFvRCx1QkFBWSxDQUFDLGlCQUFpQixFQUFFLCtDQUErQyxDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFFL0ssc0JBQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7SUFFN0MsSUFBSSxFQUFFLEdBQVcsV0FBVyxDQUFDO0lBQzdCLElBQUksSUFBSSxHQUFHLFlBQVMsQ0FBQztRQUNwQixRQUFRLEVBQUUsTUFBTTtRQUNoQixRQUFRLEVBQUUsRUFBRTtRQUNaLElBQUk7UUFDSixRQUFRLEVBQUUsT0FBTztLQUNqQixDQUFDLENBQUM7SUFDSCxzQkFBTyxDQUFDLElBQUksQ0FBQyx1QkFBWSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRXJDLEVBQUUsR0FBRyxhQUFXLEVBQUUsQ0FBQztJQUNuQixJQUFJLEdBQUcsWUFBUyxDQUFDO1FBQ2hCLFFBQVEsRUFBRSxNQUFNO1FBQ2hCLFFBQVEsRUFBRSxFQUFFO1FBQ1osSUFBSTtRQUNKLFFBQVEsRUFBRSxPQUFPO0tBQ2pCLENBQUMsQ0FBQztJQUNILHNCQUFPLENBQUMsSUFBSSxDQUFDLHVCQUFZLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFckMsRUFBRSxHQUFHLGtCQUFlLEVBQUUsQ0FBQztJQUN2QixJQUFJLGFBQWEsR0FBRyxFQUFFLENBQUM7SUFFdkIsSUFBSSxVQUFVLEdBQUcsc0JBQWlCLEVBQUUsQ0FBQztJQUNyQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztTQUN4QixPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFO1FBR3pCLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQztRQUVsQixJQUFJLEdBQUcsSUFBSTthQUNULE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUdYLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxPQUFPLEtBQUssRUFBRSxFQUMxQjtnQkFDQyxhQUFhLEdBQUcsSUFBSSxDQUFDO2dCQUNyQixLQUFLLEdBQUcsSUFBSSxDQUFDO2FBQ2I7aUJBQ0ksSUFBSSxDQUFDLENBQUMsT0FBTyxLQUFLLFdBQVcsSUFBSSxDQUFDLENBQUMsT0FBTyxLQUFLLEtBQUssRUFDekQ7Z0JBQ0MsS0FBSyxHQUFHLElBQUksQ0FBQzthQUNiO1lBRUQsT0FBTyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFBO1FBQzNCLENBQUMsQ0FBQyxDQUNGO1FBRUQsSUFBSSxLQUFLLEVBQ1Q7WUFDQyxPQUFPO1NBQ1A7UUFFRCxJQUFJLEVBQUUsR0FBRyxJQUFJO2FBQ1gsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBRVgsT0FBTyxDQUFDLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQTtRQUMzQixDQUFDLENBQUMsQ0FDRjtRQUVELENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7YUFDckIsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBRVosSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUNuQixJQUFJLElBQUksR0FBRyxZQUFTLENBQUM7Z0JBQ3BCLFFBQVEsRUFBRSxNQUFNO2dCQUNoQixRQUFRLEVBQUUsRUFBRTtnQkFDWixJQUFJO2dCQUNKLFFBQVEsRUFBRSxPQUFPO2FBQ2pCLENBQUMsQ0FBQztZQUVILHNCQUFPLENBQUMsSUFBSSxDQUFDLHVCQUFZLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQ0Y7SUFJRixDQUFDLENBQUMsQ0FDRjtJQUVELElBQUksRUFBRSxJQUFJLFdBQVcsRUFDckI7UUFDQyxJQUFJLEdBQUcsWUFBUyxDQUFDO1lBQ2hCLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLFFBQVEsRUFBRSxFQUFFO1lBQ1osSUFBSTtZQUNKLFFBQVEsRUFBRSxPQUFPO1NBQ2pCLENBQUMsQ0FBQztRQUNILHNCQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2hCLHNCQUFPLENBQUMsT0FBTyxDQUFDLHVCQUFZLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDbkQ7U0FFRDtRQUNDLEVBQUUsR0FBRyxXQUFXLENBQUM7UUFDakIsSUFBSSxHQUFHLFlBQVMsQ0FBQztZQUNoQixRQUFRLEVBQUUsTUFBTTtZQUNoQixRQUFRLEVBQUUsRUFBRTtZQUNaLElBQUk7WUFDSixRQUFRLEVBQUUsT0FBTztTQUNqQixDQUFDLENBQUM7S0FDSDtJQUVELDBCQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDL0IsQ0FBQztBQTNHRCx3QkEyR0M7QUFFRCxrQkFBZSxNQUFNLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc2VhcmNoSVBBZGRyZXNzIGZyb20gJ2FkZHJlc3MyJztcbmltcG9ydCB7IGdlbmVyYXRlIGFzIHFyY29kZSB9IGZyb20gJ3FyY29kZS10ZXJtaW5hbCc7XG5pbXBvcnQgdGVybWluYWxMaW5rIGZyb20gJ3Rlcm1pbmFsLWxpbmsnO1xuaW1wb3J0IF9jb25zb2xlIGZyb20gJ2RlYnVnLWNvbG9yMi9sb2dnZXInO1xuaW1wb3J0IGNvbnNvbGUgZnJvbSAnZGVidWctY29sb3IyJztcbmltcG9ydCB7IE5ldHdvcmtJbnRlcmZhY2VJbmZvLCBuZXR3b3JrSW50ZXJmYWNlcywgaG9zdG5hbWUgYXMgb3NfaG9zdG5hbWUgfSBmcm9tIFwib3NcIjtcbmltcG9ydCB7IGZvcm1hdCBhcyB1cmxGb3JtYXQgfSBmcm9tICd1cmwnO1xuXG5leHBvcnQgZnVuY3Rpb24gc2hvd0lQKHBvcnQ6IHN0cmluZyB8IG51bWJlcilcbntcblx0X2NvbnNvbGUuaW5mbyhg5aaC5p6c5LiN6IO96YCj5LiK5Ly65pyN5Zmo55qE6KmxXFxu6KuL5p+l6Kmi6Ieq5bex55qE6Zu76IWmSVBcXG7miJbnorroqo3oh6rlt7HnmoTpmLLngavniYboiIcgd2lmaSDoqK3lrppcXG7miJbliKnnlKggJHt0ZXJtaW5hbExpbmsoYHNoYXJlLWxvY2FsaG9zdGAsIGBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9zaGFyZS1sb2NhbGhvc3RgKX1cXG7pgJnpoZ7lt6XlhbfkvoborpPlpJbpg6jntrLot6/lj6/ku6XoroDlj5boh6rlt7Hlhafpg6jntrLot6/nmoRJUGApO1xuXG5cdGNvbnNvbGUueWVsbG93LmxvZyhgXFxu6KuL5L2/55So5Lul5LiL5YW25Lit5LiA5YCL5L2N5Z2A5L6G6YCj5o6l6Iez5Ly65pyN5ZmoXFxuYCk7XG5cblx0bGV0IGlwOiBzdHJpbmcgPSBgbG9jYWxob3N0YDtcblx0bGV0IGhyZWYgPSB1cmxGb3JtYXQoe1xuXHRcdHByb3RvY29sOiAnaHR0cCcsXG5cdFx0aG9zdG5hbWU6IGlwLFxuXHRcdHBvcnQsXG5cdFx0cGF0aG5hbWU6ICcvb3BkcycsXG5cdH0pO1xuXHRjb25zb2xlLmluZm8odGVybWluYWxMaW5rKGlwLCBocmVmKSk7XG5cblx0aXAgPSBvc19ob3N0bmFtZSgpO1xuXHRocmVmID0gdXJsRm9ybWF0KHtcblx0XHRwcm90b2NvbDogJ2h0dHAnLFxuXHRcdGhvc3RuYW1lOiBpcCxcblx0XHRwb3J0LFxuXHRcdHBhdGhuYW1lOiAnL29wZHMnLFxuXHR9KTtcblx0Y29uc29sZS5pbmZvKHRlcm1pbmFsTGluayhpcCwgaHJlZikpO1xuXG5cdGlwID0gc2VhcmNoSVBBZGRyZXNzKCk7XG5cdGxldCBpbnRlcmZhY2VOYW1lID0gaXA7XG5cblx0bGV0IGludGVyZmFjZXMgPSBuZXR3b3JrSW50ZXJmYWNlcygpO1xuXHRPYmplY3QuZW50cmllcyhpbnRlcmZhY2VzKVxuXHRcdC5mb3JFYWNoKChbbmFtZSwgZGF0YV0pID0+XG5cdFx0e1xuXG5cdFx0XHRsZXQgX3NraXAgPSBmYWxzZTtcblxuXHRcdFx0ZGF0YSA9IGRhdGFcblx0XHRcdFx0LmZpbHRlcih2ID0+XG5cdFx0XHRcdHtcblxuXHRcdFx0XHRcdGlmIChpcCAmJiB2LmFkZHJlc3MgPT09IGlwKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGludGVyZmFjZU5hbWUgPSBuYW1lO1xuXHRcdFx0XHRcdFx0X3NraXAgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGlmICh2LmFkZHJlc3MgPT09ICcxMjcuMC4wLjEnIHx8IHYuYWRkcmVzcyA9PT0gJzo6MScpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0X3NraXAgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiB2LmFkZHJlc3MgJiYgIV9za2lwXG5cdFx0XHRcdH0pXG5cdFx0XHQ7XG5cblx0XHRcdGlmIChfc2tpcClcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgbHMgPSBkYXRhXG5cdFx0XHRcdC5maWx0ZXIodiA9PlxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIHYuZmFtaWx5ID09PSAnSVB2NCdcblx0XHRcdFx0fSlcblx0XHRcdDtcblxuXHRcdFx0KGxzLmxlbmd0aCA/IGxzIDogZGF0YSlcblx0XHRcdFx0LmZvckVhY2godiA9PlxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bGV0IGlwID0gdi5hZGRyZXNzO1xuXHRcdFx0XHRcdGxldCBocmVmID0gdXJsRm9ybWF0KHtcblx0XHRcdFx0XHRcdHByb3RvY29sOiAnaHR0cCcsXG5cdFx0XHRcdFx0XHRob3N0bmFtZTogaXAsXG5cdFx0XHRcdFx0XHRwb3J0LFxuXHRcdFx0XHRcdFx0cGF0aG5hbWU6ICcvb3BkcycsXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRjb25zb2xlLmluZm8odGVybWluYWxMaW5rKG5hbWUsIGhyZWYpKTtcblx0XHRcdFx0fSlcblx0XHRcdDtcblxuXHRcdFx0Ly9jb25zb2xlLmxvZyhpbnRlcmZhY2VOYW1lLCBkYXRhKVxuXG5cdFx0fSlcblx0O1xuXG5cdGlmIChpcCAhPSAnMTI3LjAuMC4xJylcblx0e1xuXHRcdGhyZWYgPSB1cmxGb3JtYXQoe1xuXHRcdFx0cHJvdG9jb2w6ICdodHRwJyxcblx0XHRcdGhvc3RuYW1lOiBpcCxcblx0XHRcdHBvcnQsXG5cdFx0XHRwYXRobmFtZTogJy9vcGRzJyxcblx0XHR9KTtcblx0XHRjb25zb2xlLmxvZygnJyk7XG5cdFx0Y29uc29sZS5zdWNjZXNzKHRlcm1pbmFsTGluayhpbnRlcmZhY2VOYW1lLCBocmVmKSk7XG5cdH1cblx0ZWxzZVxuXHR7XG5cdFx0aXAgPSBgbG9jYWxob3N0YDtcblx0XHRocmVmID0gdXJsRm9ybWF0KHtcblx0XHRcdHByb3RvY29sOiAnaHR0cCcsXG5cdFx0XHRob3N0bmFtZTogaXAsXG5cdFx0XHRwb3J0LFxuXHRcdFx0cGF0aG5hbWU6ICcvb3BkcycsXG5cdFx0fSk7XG5cdH1cblxuXHRxcmNvZGUoaHJlZiwgeyBzbWFsbDogdHJ1ZSB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc2hvd0lQXG4iXX0=