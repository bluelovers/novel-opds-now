"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryGunNode = void 0;
const bluebird_1 = __importDefault(require("bluebird"));
function retryGunNode(gunNode, maxRetryAttempts = 5) {
    maxRetryAttempts = Math.max(maxRetryAttempts | 0, 0);
    let retryAttempts = 0;
    return new bluebird_1.default((resolve, reject) => {
        function f() {
            gunNode
                .once(function (a) {
                for (let k in a) {
                    if (k === '_')
                        continue;
                    return resolve(a);
                }
                if (retryAttempts >= maxRetryAttempts) {
                    return resolve(a);
                }
                setTimeout(f, 1000);
            });
        }
        f();
    });
}
exports.retryGunNode = retryGunNode;
exports.default = retryGunNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV0cnlHdW5Ob2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmV0cnlHdW5Ob2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdEQUFnQztBQUVoQyxTQUFnQixZQUFZLENBQUksT0FBTyxFQUFFLGdCQUFnQixHQUFHLENBQUM7SUFFNUQsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDckQsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDO0lBQ3RCLE9BQU8sSUFBSSxrQkFBUSxDQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQzFDLFNBQVMsQ0FBQztZQUVSLE9BQWU7aUJBQ2QsSUFBSSxDQUFDLFVBQVUsQ0FBQztnQkFFaEIsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQ2Y7b0JBQ0MsSUFDQyxDQUFDLEtBQUssR0FBRzt3QkFFUixTQUFTO29CQUNYLE9BQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNsQjtnQkFFRCxJQUFJLGFBQWEsSUFBSSxnQkFBZ0IsRUFDckM7b0JBRUMsT0FBTyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUE7aUJBQ2pCO2dCQUdELFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDckIsQ0FBQyxDQUFDLENBQ0Y7UUFDRixDQUFDO1FBRUQsQ0FBQyxFQUFFLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQTtBQUNILENBQUM7QUFqQ0Qsb0NBaUNDO0FBRUQsa0JBQWUsWUFBWSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJldHJ5R3VuTm9kZTxUPihndW5Ob2RlLCBtYXhSZXRyeUF0dGVtcHRzID0gNSlcbntcblx0bWF4UmV0cnlBdHRlbXB0cyA9IE1hdGgubWF4KG1heFJldHJ5QXR0ZW1wdHMgfCAwLCAwKTtcblx0bGV0IHJldHJ5QXR0ZW1wdHMgPSAwO1xuXHRyZXR1cm4gbmV3IEJsdWViaXJkPFQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRmdW5jdGlvbiBmKClcblx0XHR7XG5cdFx0XHQoZ3VuTm9kZSBhcyBhbnkpXG5cdFx0XHRcdC5vbmNlKGZ1bmN0aW9uIChhKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Zm9yIChsZXQgayBpbiBhKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdFx0ayA9PT0gJ18nXG5cdFx0XHRcdFx0XHRcdC8vfHwgayA9PT0gJyMnXG5cdFx0XHRcdFx0XHQpIGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHJlc29sdmUoYSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHJldHJ5QXR0ZW1wdHMgPj0gbWF4UmV0cnlBdHRlbXB0cylcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKGBnaXZlIHVwIHJldHJ5LCAke3JldHJ5QXR0ZW1wdHN9YCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzb2x2ZShhKVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coYHJldHJ5IGFnYWluLCAkeysrcmV0cnlBdHRlbXB0c31gKTtcblx0XHRcdFx0XHRzZXRUaW1lb3V0KGYsIDEwMDApO1xuXHRcdFx0XHR9KVxuXHRcdFx0O1xuXHRcdH1cblxuXHRcdGYoKTtcblx0fSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgcmV0cnlHdW5Ob2RlXG4iXX0=