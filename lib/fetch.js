"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const getProxy_1 = __importDefault(require("./getProxy"));
const http_proxy_agent_1 = __importDefault(require("http-proxy-agent"));
const abort_controller_1 = __importDefault(require("abort-controller"));
const bluebird_1 = __importDefault(require("bluebird"));
const is_error_code_1 = __importDefault(require("is-error-code"));
function fetch(...argv) {
    let proxy = getProxy_1.default();
    let options = argv[1] || {};
    if (proxy) {
        options.agent = http_proxy_agent_1.default(proxy);
    }
    if (options.timeout > 0 && !options.signal) {
        if (options.timeout |= 0) {
            const controller = new abort_controller_1.default();
            const timer = setTimeout(() => controller.abort(), options.timeout);
            options.signal = controller.signal;
        }
        else {
            delete options.timeout;
        }
    }
    options.redirect = 'follow';
    argv[1] = options;
    return bluebird_1.default.resolve(cross_fetch_1.default(...argv))
        .tap(v => {
        if (is_error_code_1.default(v.status)) {
            return Promise.reject(v);
        }
    });
}
exports.fetch = fetch;
exports.default = fetch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmZXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDhEQUFpQztBQUNqQywwREFBa0M7QUFDbEMsd0VBQThDO0FBQzlDLHdFQUErQztBQUUvQyx3REFBZ0M7QUFDaEMsa0VBQXdDO0FBT3hDLFNBQWdCLEtBQUssQ0FBQyxHQUFHLElBQUk7SUFFNUIsSUFBSSxLQUFLLEdBQUcsa0JBQVEsRUFBRSxDQUFDO0lBRXZCLElBQUksT0FBTyxHQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBRXpDLElBQUksS0FBSyxFQUNUO1FBQ0MsT0FBTyxDQUFDLEtBQUssR0FBRywwQkFBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3RDO0lBRUQsSUFBSSxPQUFPLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQzFDO1FBQ0MsSUFBSSxPQUFPLENBQUMsT0FBTyxJQUFJLENBQUMsRUFDeEI7WUFDQyxNQUFNLFVBQVUsR0FBRyxJQUFJLDBCQUFlLEVBQUUsQ0FBQztZQUN6QyxNQUFNLEtBQUssR0FBRyxVQUFVLENBQ3ZCLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsRUFDeEIsT0FBTyxDQUFDLE9BQU8sQ0FDZixDQUFDO1lBRUYsT0FBTyxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO1NBQ25DO2FBRUQ7WUFDQyxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUE7U0FDdEI7S0FDRDtJQUVELE9BQU8sQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBRzVCLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUM7SUFHbEIsT0FBTyxrQkFBUSxDQUFDLE9BQU8sQ0FBQyxxQkFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7U0FDdEMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ1IsSUFBSSx1QkFBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFDekI7WUFDQyxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FDeEI7SUFDRixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUM7QUExQ0Qsc0JBMENDO0FBRUQsa0JBQWUsS0FBSyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF9mZXRjaCBmcm9tICdjcm9zcy1mZXRjaCc7XG5pbXBvcnQgZ2V0UHJveHkgZnJvbSAnLi9nZXRQcm94eSc7XG5pbXBvcnQgSHR0cFByb3h5QWdlbnQgZnJvbSAnaHR0cC1wcm94eS1hZ2VudCc7XG5pbXBvcnQgQWJvcnRDb250cm9sbGVyIGZyb20gJ2Fib3J0LWNvbnRyb2xsZXInO1xuaW1wb3J0IHsgUmVxdWVzdEluaXQsIFJlcXVlc3RJbmZvLCBSZXNwb25zZSB9IGZyb20gJ25vZGUtZmV0Y2gnO1xuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBpc0Vycm9yQ29kZSBmcm9tICdpcy1lcnJvci1jb2RlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoKHVybDogUmVxdWVzdEluZm8sXG5cdGluaXQ/OiBSZXF1ZXN0SW5pdCAmIHtcblx0XHR0aW1lb3V0PzogbnVtYmVyLFxuXHR9LCAuLi5hcmd2XG4pOiBCbHVlYmlyZDxSZXNwb25zZT5cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaCguLi5hcmd2KTogQmx1ZWJpcmQ8UmVzcG9uc2U+XG57XG5cdGxldCBwcm94eSA9IGdldFByb3h5KCk7XG5cdC8vIEB0cy1pZ25vcmVcblx0bGV0IG9wdGlvbnM6IFJlcXVlc3RJbml0ID0gYXJndlsxXSB8fCB7fTtcblxuXHRpZiAocHJveHkpXG5cdHtcblx0XHRvcHRpb25zLmFnZW50ID0gSHR0cFByb3h5QWdlbnQocHJveHkpO1xuXHR9XG5cblx0aWYgKG9wdGlvbnMudGltZW91dCA+IDAgJiYgIW9wdGlvbnMuc2lnbmFsKVxuXHR7XG5cdFx0aWYgKG9wdGlvbnMudGltZW91dCB8PSAwKVxuXHRcdHtcblx0XHRcdGNvbnN0IGNvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG5cdFx0XHRjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoXG5cdFx0XHRcdCgpID0+IGNvbnRyb2xsZXIuYWJvcnQoKSxcblx0XHRcdFx0b3B0aW9ucy50aW1lb3V0LFxuXHRcdFx0KTtcblxuXHRcdFx0b3B0aW9ucy5zaWduYWwgPSBjb250cm9sbGVyLnNpZ25hbDtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdGRlbGV0ZSBvcHRpb25zLnRpbWVvdXRcblx0XHR9XG5cdH1cblxuXHRvcHRpb25zLnJlZGlyZWN0ID0gJ2ZvbGxvdyc7XG5cblx0Ly8gQHRzLWlnbm9yZVxuXHRhcmd2WzFdID0gb3B0aW9ucztcblxuXHQvLyBAdHMtaWdub3JlXG5cdHJldHVybiBCbHVlYmlyZC5yZXNvbHZlKF9mZXRjaCguLi5hcmd2KSlcblx0XHQudGFwKHYgPT4ge1xuXHRcdFx0aWYgKGlzRXJyb3JDb2RlKHYuc3RhdHVzKSlcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KHYpXG5cdFx0XHR9XG5cdFx0fSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgZmV0Y2hcbiJdfQ==