"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tmp_1 = require("tmp");
const path_1 = require("path");
function tmpDir(outputDir) {
    if (outputDir == null) {
        if (process.env.YARN_CACHE_FOLDER) {
            outputDir = path_1.join(process.env.YARN_CACHE_FOLDER, 'tmp');
        }
        else if (process.env.TEMP) {
            outputDir = path_1.join(process.env.TEMP, 'tmp');
        }
    }
    return tmp_1.dirSync({
        unsafeCleanup: false,
        dir: outputDir,
    });
}
exports.tmpDir = tmpDir;
exports.default = tmpDir;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG1wRGlyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidG1wRGlyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0EsNkJBQThCO0FBRTlCLCtCQUE0QjtBQUk1QixTQUFnQixNQUFNLENBQUMsU0FBa0I7SUFFeEMsSUFBSSxTQUFTLElBQUksSUFBSSxFQUNyQjtRQUNDLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFDakM7WUFDQyxTQUFTLEdBQUcsV0FBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLENBQUE7U0FDdEQ7YUFDSSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUN6QjtZQUNDLFNBQVMsR0FBRyxXQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUE7U0FDekM7S0FDRDtJQUVELE9BQU8sYUFBTyxDQUFDO1FBQ2QsYUFBYSxFQUFFLEtBQUs7UUFDcEIsR0FBRyxFQUFFLFNBQVM7S0FDZCxDQUFDLENBQUM7QUFDSixDQUFDO0FBbEJELHdCQWtCQztBQUVELGtCQUFlLE1BQU0sQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMjAvMi8xLlxuICovXG5cbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgeyBkaXJTeW5jIH0gZnJvbSAndG1wJztcbmltcG9ydCB7IE9VVFBVVF9ESVIgfSBmcm9tICcuL2NvbnN0JztcbmltcG9ydCB7IGpvaW4gfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgcGF0aEV4aXN0c1N5bmMgfSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgeyBzcGF3blN5bmMgfSBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gdG1wRGlyKG91dHB1dERpcj86IHN0cmluZylcbntcblx0aWYgKG91dHB1dERpciA9PSBudWxsKVxuXHR7XG5cdFx0aWYgKHByb2Nlc3MuZW52LllBUk5fQ0FDSEVfRk9MREVSKVxuXHRcdHtcblx0XHRcdG91dHB1dERpciA9IGpvaW4ocHJvY2Vzcy5lbnYuWUFSTl9DQUNIRV9GT0xERVIsICd0bXAnKVxuXHRcdH1cblx0XHRlbHNlIGlmIChwcm9jZXNzLmVudi5URU1QKVxuXHRcdHtcblx0XHRcdG91dHB1dERpciA9IGpvaW4ocHJvY2Vzcy5lbnYuVEVNUCwgJ3RtcCcpXG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGRpclN5bmMoe1xuXHRcdHVuc2FmZUNsZWFudXA6IGZhbHNlLFxuXHRcdGRpcjogb3V0cHV0RGlyLFxuXHR9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdG1wRGlyXG4iXX0=