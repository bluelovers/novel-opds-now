"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const getProxy_1 = __importDefault(require("./getProxy"));
const http_proxy_agent_1 = __importDefault(require("http-proxy-agent"));
function fetch(...argv) {
    let proxy = getProxy_1.default();
    let options = argv[1] || {};
    if (proxy) {
        options.agent = http_proxy_agent_1.default(proxy);
    }
    options.redirect = 'follow';
    argv[1] = options;
    return cross_fetch_1.default(...argv);
}
exports.fetch = fetch;
exports.default = fetch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmZXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDhEQUFpQztBQUNqQywwREFBa0M7QUFDbEMsd0VBQThDO0FBSTlDLFNBQWdCLEtBQUssQ0FBQyxHQUFHLElBQStCO0lBRXZELElBQUksS0FBSyxHQUFHLGtCQUFRLEVBQUUsQ0FBQztJQUV2QixJQUFJLE9BQU8sR0FBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUV6QyxJQUFJLEtBQUssRUFDVDtRQUNDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsMEJBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN0QztJQUVELE9BQU8sQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBRzVCLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUM7SUFFbEIsT0FBTyxxQkFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUE7QUFDdkIsQ0FBQztBQWpCRCxzQkFpQkM7QUFFRCxrQkFBZSxLQUFLLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgX2ZldGNoIGZyb20gJ2Nyb3NzLWZldGNoJztcbmltcG9ydCBnZXRQcm94eSBmcm9tICcuL2dldFByb3h5JztcbmltcG9ydCBIdHRwUHJveHlBZ2VudCBmcm9tICdodHRwLXByb3h5LWFnZW50JztcblxuaW1wb3J0IHsgUmVxdWVzdEluaXQgfSBmcm9tICdub2RlLWZldGNoJztcblxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoKC4uLmFyZ3Y6IFBhcmFtZXRlcnM8dHlwZW9mIF9mZXRjaD4pXG57XG5cdGxldCBwcm94eSA9IGdldFByb3h5KCk7XG5cdC8vIEB0cy1pZ25vcmVcblx0bGV0IG9wdGlvbnM6IFJlcXVlc3RJbml0ID0gYXJndlsxXSB8fCB7fTtcblxuXHRpZiAocHJveHkpXG5cdHtcblx0XHRvcHRpb25zLmFnZW50ID0gSHR0cFByb3h5QWdlbnQocHJveHkpO1xuXHR9XG5cblx0b3B0aW9ucy5yZWRpcmVjdCA9ICdmb2xsb3cnO1xuXG5cdC8vIEB0cy1pZ25vcmVcblx0YXJndlsxXSA9IG9wdGlvbnM7XG5cblx0cmV0dXJuIF9mZXRjaCguLi5hcmd2KVxufVxuXG5leHBvcnQgZGVmYXVsdCBmZXRjaFxuIl19