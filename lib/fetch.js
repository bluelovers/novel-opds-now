"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetch = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmZXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw4REFBaUM7QUFDakMsMERBQWtDO0FBQ2xDLHdFQUE4QztBQUM5Qyx3RUFBK0M7QUFFL0Msd0RBQWdDO0FBQ2hDLGtFQUF3QztBQU94QyxTQUFnQixLQUFLLENBQUMsR0FBRyxJQUFJO0lBRTVCLElBQUksS0FBSyxHQUFHLGtCQUFRLEVBQUUsQ0FBQztJQUV2QixJQUFJLE9BQU8sR0FBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUV6QyxJQUFJLEtBQUssRUFDVDtRQUNDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsMEJBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN0QztJQUVELElBQUksT0FBTyxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUMxQztRQUNDLElBQUksT0FBTyxDQUFDLE9BQU8sSUFBSSxDQUFDLEVBQ3hCO1lBQ0MsTUFBTSxVQUFVLEdBQUcsSUFBSSwwQkFBZSxFQUFFLENBQUM7WUFDekMsTUFBTSxLQUFLLEdBQUcsVUFBVSxDQUN2QixHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLEVBQ3hCLE9BQU8sQ0FBQyxPQUFPLENBQ2YsQ0FBQztZQUVGLE9BQU8sQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztTQUNuQzthQUVEO1lBQ0MsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFBO1NBQ3RCO0tBQ0Q7SUFFRCxPQUFPLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUc1QixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDO0lBR2xCLE9BQU8sa0JBQVEsQ0FBQyxPQUFPLENBQUMscUJBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1NBQ3RDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNSLElBQUksdUJBQVcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQ3pCO1lBQ0MsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO1NBQ3hCO0lBQ0YsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDO0FBMUNELHNCQTBDQztBQUVELGtCQUFlLEtBQUssQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfZmV0Y2ggZnJvbSAnY3Jvc3MtZmV0Y2gnO1xuaW1wb3J0IGdldFByb3h5IGZyb20gJy4vZ2V0UHJveHknO1xuaW1wb3J0IEh0dHBQcm94eUFnZW50IGZyb20gJ2h0dHAtcHJveHktYWdlbnQnO1xuaW1wb3J0IEFib3J0Q29udHJvbGxlciBmcm9tICdhYm9ydC1jb250cm9sbGVyJztcbmltcG9ydCB7IFJlcXVlc3RJbml0LCBSZXF1ZXN0SW5mbywgUmVzcG9uc2UgfSBmcm9tICdub2RlLWZldGNoJztcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgaXNFcnJvckNvZGUgZnJvbSAnaXMtZXJyb3ItY29kZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaCh1cmw6IFJlcXVlc3RJbmZvLFxuXHRpbml0PzogUmVxdWVzdEluaXQgJiB7XG5cdFx0dGltZW91dD86IG51bWJlcixcblx0fSwgLi4uYXJndlxuKTogQmx1ZWJpcmQ8UmVzcG9uc2U+XG5leHBvcnQgZnVuY3Rpb24gZmV0Y2goLi4uYXJndik6IEJsdWViaXJkPFJlc3BvbnNlPlxue1xuXHRsZXQgcHJveHkgPSBnZXRQcm94eSgpO1xuXHQvLyBAdHMtaWdub3JlXG5cdGxldCBvcHRpb25zOiBSZXF1ZXN0SW5pdCA9IGFyZ3ZbMV0gfHwge307XG5cblx0aWYgKHByb3h5KVxuXHR7XG5cdFx0b3B0aW9ucy5hZ2VudCA9IEh0dHBQcm94eUFnZW50KHByb3h5KTtcblx0fVxuXG5cdGlmIChvcHRpb25zLnRpbWVvdXQgPiAwICYmICFvcHRpb25zLnNpZ25hbClcblx0e1xuXHRcdGlmIChvcHRpb25zLnRpbWVvdXQgfD0gMClcblx0XHR7XG5cdFx0XHRjb25zdCBjb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuXHRcdFx0Y29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KFxuXHRcdFx0XHQoKSA9PiBjb250cm9sbGVyLmFib3J0KCksXG5cdFx0XHRcdG9wdGlvbnMudGltZW91dCxcblx0XHRcdCk7XG5cblx0XHRcdG9wdGlvbnMuc2lnbmFsID0gY29udHJvbGxlci5zaWduYWw7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRkZWxldGUgb3B0aW9ucy50aW1lb3V0XG5cdFx0fVxuXHR9XG5cblx0b3B0aW9ucy5yZWRpcmVjdCA9ICdmb2xsb3cnO1xuXG5cdC8vIEB0cy1pZ25vcmVcblx0YXJndlsxXSA9IG9wdGlvbnM7XG5cblx0Ly8gQHRzLWlnbm9yZVxuXHRyZXR1cm4gQmx1ZWJpcmQucmVzb2x2ZShfZmV0Y2goLi4uYXJndikpXG5cdFx0LnRhcCh2ID0+IHtcblx0XHRcdGlmIChpc0Vycm9yQ29kZSh2LnN0YXR1cykpXG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdCh2KVxuXHRcdFx0fVxuXHRcdH0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZldGNoXG4iXX0=