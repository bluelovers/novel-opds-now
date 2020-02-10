"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV0cnlHdW5Ob2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmV0cnlHdW5Ob2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0RBQWdDO0FBRWhDLFNBQWdCLFlBQVksQ0FBSSxPQUFPLEVBQUUsZ0JBQWdCLEdBQUcsQ0FBQztJQUU1RCxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGdCQUFnQixHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNyRCxJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUM7SUFDdEIsT0FBTyxJQUFJLGtCQUFRLENBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDMUMsU0FBUyxDQUFDO1lBRVIsT0FBZTtpQkFDZCxJQUFJLENBQUMsVUFBVSxDQUFDO2dCQUVoQixLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsRUFDZjtvQkFDQyxJQUNDLENBQUMsS0FBSyxHQUFHO3dCQUVSLFNBQVM7b0JBQ1gsT0FBTyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ2xCO2dCQUVELElBQUksYUFBYSxJQUFJLGdCQUFnQixFQUNyQztvQkFFQyxPQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQTtpQkFDakI7Z0JBR0QsVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNyQixDQUFDLENBQUMsQ0FDRjtRQUNGLENBQUM7UUFFRCxDQUFDLEVBQUUsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFBO0FBQ0gsQ0FBQztBQWpDRCxvQ0FpQ0M7QUFFRCxrQkFBZSxZQUFZLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnO1xuXG5leHBvcnQgZnVuY3Rpb24gcmV0cnlHdW5Ob2RlPFQ+KGd1bk5vZGUsIG1heFJldHJ5QXR0ZW1wdHMgPSA1KVxue1xuXHRtYXhSZXRyeUF0dGVtcHRzID0gTWF0aC5tYXgobWF4UmV0cnlBdHRlbXB0cyB8IDAsIDApO1xuXHRsZXQgcmV0cnlBdHRlbXB0cyA9IDA7XG5cdHJldHVybiBuZXcgQmx1ZWJpcmQ8VD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdGZ1bmN0aW9uIGYoKVxuXHRcdHtcblx0XHRcdChndW5Ob2RlIGFzIGFueSlcblx0XHRcdFx0Lm9uY2UoZnVuY3Rpb24gKGEpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRmb3IgKGxldCBrIGluIGEpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0XHRrID09PSAnXydcblx0XHRcdFx0XHRcdFx0Ly98fCBrID09PSAnIydcblx0XHRcdFx0XHRcdCkgY29udGludWU7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzb2x2ZShhKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAocmV0cnlBdHRlbXB0cyA+PSBtYXhSZXRyeUF0dGVtcHRzKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coYGdpdmUgdXAgcmV0cnksICR7cmV0cnlBdHRlbXB0c31gKTtcblx0XHRcdFx0XHRcdHJldHVybiByZXNvbHZlKGEpXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhgcmV0cnkgYWdhaW4sICR7KytyZXRyeUF0dGVtcHRzfWApO1xuXHRcdFx0XHRcdHNldFRpbWVvdXQoZiwgMTAwMCk7XG5cdFx0XHRcdH0pXG5cdFx0XHQ7XG5cdFx0fVxuXG5cdFx0ZigpO1xuXHR9KVxufVxuXG5leHBvcnQgZGVmYXVsdCByZXRyeUd1bk5vZGVcbiJdfQ==