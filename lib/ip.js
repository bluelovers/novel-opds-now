"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHdEQUF1QztBQUN2QyxxREFBcUQ7QUFDckQsa0VBQXlDO0FBQ3pDLGlFQUEyQztBQUMzQyxnRUFBbUM7QUFDbkMsMkJBQXNGO0FBQ3RGLDZCQUEwQztBQUUxQyxTQUFnQixNQUFNLENBQUMsSUFBcUI7SUFFM0MsZ0JBQVEsQ0FBQyxJQUFJLENBQUMsb0RBQW9ELHVCQUFZLENBQUMsaUJBQWlCLEVBQUUsK0NBQStDLENBQUMsMkJBQTJCLENBQUMsQ0FBQztJQUUvSyxzQkFBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztJQUU3QyxJQUFJLEVBQUUsR0FBVyxXQUFXLENBQUM7SUFDN0IsSUFBSSxJQUFJLEdBQUcsWUFBUyxDQUFDO1FBQ3BCLFFBQVEsRUFBRSxNQUFNO1FBQ2hCLFFBQVEsRUFBRSxFQUFFO1FBQ1osSUFBSTtRQUNKLFFBQVEsRUFBRSxPQUFPO0tBQ2pCLENBQUMsQ0FBQztJQUNILHNCQUFPLENBQUMsSUFBSSxDQUFDLHVCQUFZLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFckMsRUFBRSxHQUFHLGFBQVcsRUFBRSxDQUFDO0lBQ25CLElBQUksR0FBRyxZQUFTLENBQUM7UUFDaEIsUUFBUSxFQUFFLE1BQU07UUFDaEIsUUFBUSxFQUFFLEVBQUU7UUFDWixJQUFJO1FBQ0osUUFBUSxFQUFFLE9BQU87S0FDakIsQ0FBQyxDQUFDO0lBQ0gsc0JBQU8sQ0FBQyxJQUFJLENBQUMsdUJBQVksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUVyQyxFQUFFLEdBQUcsa0JBQWUsRUFBRSxDQUFDO0lBQ3ZCLElBQUksYUFBYSxHQUFHLEVBQUUsQ0FBQztJQUV2QixJQUFJLFVBQVUsR0FBRyxzQkFBaUIsRUFBRSxDQUFDO0lBQ3JDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO1NBQ3hCLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUU7UUFHekIsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRWxCLElBQUksR0FBRyxJQUFJO2FBQ1QsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBR1gsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLE9BQU8sS0FBSyxFQUFFLEVBQzFCO2dCQUNDLGFBQWEsR0FBRyxJQUFJLENBQUM7Z0JBQ3JCLEtBQUssR0FBRyxJQUFJLENBQUM7YUFDYjtpQkFDSSxJQUFJLENBQUMsQ0FBQyxPQUFPLEtBQUssV0FBVyxJQUFJLENBQUMsQ0FBQyxPQUFPLEtBQUssS0FBSyxFQUN6RDtnQkFDQyxLQUFLLEdBQUcsSUFBSSxDQUFDO2FBQ2I7WUFFRCxPQUFPLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUE7UUFDM0IsQ0FBQyxDQUFDLENBQ0Y7UUFFRCxJQUFJLEtBQUssRUFDVDtZQUNDLE9BQU87U0FDUDtRQUVELElBQUksRUFBRSxHQUFHLElBQUk7YUFDWCxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFFWCxPQUFPLENBQUMsQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFBO1FBQzNCLENBQUMsQ0FBQyxDQUNGO1FBRUQsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQzthQUNyQixPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFFWixJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ25CLElBQUksSUFBSSxHQUFHLFlBQVMsQ0FBQztnQkFDcEIsUUFBUSxFQUFFLE1BQU07Z0JBQ2hCLFFBQVEsRUFBRSxFQUFFO2dCQUNaLElBQUk7Z0JBQ0osUUFBUSxFQUFFLE9BQU87YUFDakIsQ0FBQyxDQUFDO1lBRUgsc0JBQU8sQ0FBQyxJQUFJLENBQUMsdUJBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FDRjtJQUlGLENBQUMsQ0FBQyxDQUNGO0lBRUQsSUFBSSxFQUFFLElBQUksV0FBVyxFQUNyQjtRQUNDLElBQUksR0FBRyxZQUFTLENBQUM7WUFDaEIsUUFBUSxFQUFFLE1BQU07WUFDaEIsUUFBUSxFQUFFLEVBQUU7WUFDWixJQUFJO1lBQ0osUUFBUSxFQUFFLE9BQU87U0FDakIsQ0FBQyxDQUFDO1FBQ0gsc0JBQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEIsc0JBQU8sQ0FBQyxPQUFPLENBQUMsdUJBQVksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUNuRDtTQUVEO1FBQ0MsRUFBRSxHQUFHLFdBQVcsQ0FBQztRQUNqQixJQUFJLEdBQUcsWUFBUyxDQUFDO1lBQ2hCLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLFFBQVEsRUFBRSxFQUFFO1lBQ1osSUFBSTtZQUNKLFFBQVEsRUFBRSxPQUFPO1NBQ2pCLENBQUMsQ0FBQztLQUNIO0lBRUQsMEJBQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUMvQixDQUFDO0FBM0dELHdCQTJHQztBQUVELGtCQUFlLE1BQU0sQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzZWFyY2hJUEFkZHJlc3MgZnJvbSAnYWRkcmVzczInO1xuaW1wb3J0IHsgZ2VuZXJhdGUgYXMgcXJjb2RlIH0gZnJvbSAncXJjb2RlLXRlcm1pbmFsJztcbmltcG9ydCB0ZXJtaW5hbExpbmsgZnJvbSAndGVybWluYWwtbGluayc7XG5pbXBvcnQgX2NvbnNvbGUgZnJvbSAnZGVidWctY29sb3IyL2xvZ2dlcic7XG5pbXBvcnQgY29uc29sZSBmcm9tICdkZWJ1Zy1jb2xvcjInO1xuaW1wb3J0IHsgTmV0d29ya0ludGVyZmFjZUluZm8sIG5ldHdvcmtJbnRlcmZhY2VzLCBob3N0bmFtZSBhcyBvc19ob3N0bmFtZSB9IGZyb20gXCJvc1wiO1xuaW1wb3J0IHsgZm9ybWF0IGFzIHVybEZvcm1hdCB9IGZyb20gJ3VybCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBzaG93SVAocG9ydDogc3RyaW5nIHwgbnVtYmVyKVxue1xuXHRfY29uc29sZS5pbmZvKGDlpoLmnpzkuI3og73pgKPkuIrkvLrmnI3lmajnmoToqbFcXG7oq4vmn6XoqaLoh6rlt7HnmoTpm7vohaZJUFxcbuaIlueiuuiqjeiHquW3seeahOmYsueBq+eJhuiIhyB3aWZpIOioreWumlxcbuaIluWIqeeUqCAke3Rlcm1pbmFsTGluayhgc2hhcmUtbG9jYWxob3N0YCwgYGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL3NoYXJlLWxvY2FsaG9zdGApfVxcbumAmemhnuW3peWFt+S+huiuk+WklumDqOe2sui3r+WPr+S7peiugOWPluiHquW3seWFp+mDqOe2sui3r+eahElQYCk7XG5cblx0Y29uc29sZS55ZWxsb3cubG9nKGBcXG7oq4vkvb/nlKjku6XkuIvlhbbkuK3kuIDlgIvkvY3lnYDkvobpgKPmjqXoh7PkvLrmnI3lmahcXG5gKTtcblxuXHRsZXQgaXA6IHN0cmluZyA9IGBsb2NhbGhvc3RgO1xuXHRsZXQgaHJlZiA9IHVybEZvcm1hdCh7XG5cdFx0cHJvdG9jb2w6ICdodHRwJyxcblx0XHRob3N0bmFtZTogaXAsXG5cdFx0cG9ydCxcblx0XHRwYXRobmFtZTogJy9vcGRzJyxcblx0fSk7XG5cdGNvbnNvbGUuaW5mbyh0ZXJtaW5hbExpbmsoaXAsIGhyZWYpKTtcblxuXHRpcCA9IG9zX2hvc3RuYW1lKCk7XG5cdGhyZWYgPSB1cmxGb3JtYXQoe1xuXHRcdHByb3RvY29sOiAnaHR0cCcsXG5cdFx0aG9zdG5hbWU6IGlwLFxuXHRcdHBvcnQsXG5cdFx0cGF0aG5hbWU6ICcvb3BkcycsXG5cdH0pO1xuXHRjb25zb2xlLmluZm8odGVybWluYWxMaW5rKGlwLCBocmVmKSk7XG5cblx0aXAgPSBzZWFyY2hJUEFkZHJlc3MoKTtcblx0bGV0IGludGVyZmFjZU5hbWUgPSBpcDtcblxuXHRsZXQgaW50ZXJmYWNlcyA9IG5ldHdvcmtJbnRlcmZhY2VzKCk7XG5cdE9iamVjdC5lbnRyaWVzKGludGVyZmFjZXMpXG5cdFx0LmZvckVhY2goKFtuYW1lLCBkYXRhXSkgPT5cblx0XHR7XG5cblx0XHRcdGxldCBfc2tpcCA9IGZhbHNlO1xuXG5cdFx0XHRkYXRhID0gZGF0YVxuXHRcdFx0XHQuZmlsdGVyKHYgPT5cblx0XHRcdFx0e1xuXG5cdFx0XHRcdFx0aWYgKGlwICYmIHYuYWRkcmVzcyA9PT0gaXApXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aW50ZXJmYWNlTmFtZSA9IG5hbWU7XG5cdFx0XHRcdFx0XHRfc2tpcCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgaWYgKHYuYWRkcmVzcyA9PT0gJzEyNy4wLjAuMScgfHwgdi5hZGRyZXNzID09PSAnOjoxJylcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRfc2tpcCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIHYuYWRkcmVzcyAmJiAhX3NraXBcblx0XHRcdFx0fSlcblx0XHRcdDtcblxuXHRcdFx0aWYgKF9za2lwKVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGxldCBscyA9IGRhdGFcblx0XHRcdFx0LmZpbHRlcih2ID0+XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gdi5mYW1pbHkgPT09ICdJUHY0J1xuXHRcdFx0XHR9KVxuXHRcdFx0O1xuXG5cdFx0XHQobHMubGVuZ3RoID8gbHMgOiBkYXRhKVxuXHRcdFx0XHQuZm9yRWFjaCh2ID0+XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRsZXQgaXAgPSB2LmFkZHJlc3M7XG5cdFx0XHRcdFx0bGV0IGhyZWYgPSB1cmxGb3JtYXQoe1xuXHRcdFx0XHRcdFx0cHJvdG9jb2w6ICdodHRwJyxcblx0XHRcdFx0XHRcdGhvc3RuYW1lOiBpcCxcblx0XHRcdFx0XHRcdHBvcnQsXG5cdFx0XHRcdFx0XHRwYXRobmFtZTogJy9vcGRzJyxcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGNvbnNvbGUuaW5mbyh0ZXJtaW5hbExpbmsobmFtZSwgaHJlZikpO1xuXHRcdFx0XHR9KVxuXHRcdFx0O1xuXG5cdFx0XHQvL2NvbnNvbGUubG9nKGludGVyZmFjZU5hbWUsIGRhdGEpXG5cblx0XHR9KVxuXHQ7XG5cblx0aWYgKGlwICE9ICcxMjcuMC4wLjEnKVxuXHR7XG5cdFx0aHJlZiA9IHVybEZvcm1hdCh7XG5cdFx0XHRwcm90b2NvbDogJ2h0dHAnLFxuXHRcdFx0aG9zdG5hbWU6IGlwLFxuXHRcdFx0cG9ydCxcblx0XHRcdHBhdGhuYW1lOiAnL29wZHMnLFxuXHRcdH0pO1xuXHRcdGNvbnNvbGUubG9nKCcnKTtcblx0XHRjb25zb2xlLnN1Y2Nlc3ModGVybWluYWxMaW5rKGludGVyZmFjZU5hbWUsIGhyZWYpKTtcblx0fVxuXHRlbHNlXG5cdHtcblx0XHRpcCA9IGBsb2NhbGhvc3RgO1xuXHRcdGhyZWYgPSB1cmxGb3JtYXQoe1xuXHRcdFx0cHJvdG9jb2w6ICdodHRwJyxcblx0XHRcdGhvc3RuYW1lOiBpcCxcblx0XHRcdHBvcnQsXG5cdFx0XHRwYXRobmFtZTogJy9vcGRzJyxcblx0XHR9KTtcblx0fVxuXG5cdHFyY29kZShocmVmLCB7IHNtYWxsOiB0cnVlIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzaG93SVBcbiJdfQ==