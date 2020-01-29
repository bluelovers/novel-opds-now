"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const micro_1 = __importDefault(require("micro"));
const micro_ex_router_1 = __importDefault(require("micro-ex-router"));
const express_1 = __importDefault(require("express"));
let router = micro_ex_router_1.default();
router
    .use((req, res) => console.log(req.url))
    .get('/*', () => 'Welcome to micro');
const app = express_1.default();
app.use(micro_1.default(router));
exports.default = app;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUdBLGtEQUFrRTtBQUNsRSxzRUFBcUM7QUFDckMsc0RBQThCO0FBRTlCLElBQUksTUFBTSxHQUFHLHlCQUFNLEVBQUUsQ0FBQztBQUV0QixNQUFNO0tBRUosR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDdkMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUNwQztBQUVELE1BQU0sR0FBRyxHQUFHLGlCQUFPLEVBQUUsQ0FBQztBQUV0QixHQUFHLENBQUMsR0FBRyxDQUFDLGVBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBRXZCLGtCQUFlLEdBQUcsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMjAvMS8yOC5cbiAqL1xuaW1wb3J0IG1pY3JvLCB7IFJlcXVlc3RIYW5kbGVyLCBidWZmZXIsIHRleHQsIGpzb24gfSBmcm9tICdtaWNybyc7XG5pbXBvcnQgUm91dGVyIGZyb20gJ21pY3JvLWV4LXJvdXRlcic7XG5pbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcblxubGV0IHJvdXRlciA9IFJvdXRlcigpO1xuXG5yb3V0ZXJcblx0Ly8gVXNlIG1pZGRsZXdhcmVzIGF2YWlsYWJsZSBmb3IgYWxsIHJlcXVlc3RzXG5cdC51c2UoKHJlcSwgcmVzKSA9PiBjb25zb2xlLmxvZyhyZXEudXJsKSlcblx0LmdldCgnLyonLCAoKSA9PiAnV2VsY29tZSB0byBtaWNybycpXG47XG5cbmNvbnN0IGFwcCA9IGV4cHJlc3MoKTtcblxuYXBwLnVzZShtaWNybyhyb3V0ZXIpKTtcblxuZXhwb3J0IGRlZmF1bHQgYXBwXG5cbi8vZXhwb3J0IGRlZmF1bHQgPFJlcXVlc3RIYW5kbGVyPigocmVxLCByZXMpID0+IHtcbi8vXHRyZXMuZW5kKCc3Nzc4OCcpXG4vL30pXG4iXX0=