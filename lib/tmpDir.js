"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tmpDir = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG1wRGlyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidG1wRGlyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUtBLDZCQUE4QjtBQUU5QiwrQkFBNEI7QUFJNUIsU0FBZ0IsTUFBTSxDQUFDLFNBQWtCO0lBRXhDLElBQUksU0FBUyxJQUFJLElBQUksRUFDckI7UUFDQyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQ2pDO1lBQ0MsU0FBUyxHQUFHLFdBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxDQUFBO1NBQ3REO2FBQ0ksSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFDekI7WUFDQyxTQUFTLEdBQUcsV0FBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFBO1NBQ3pDO0tBQ0Q7SUFFRCxPQUFPLGFBQU8sQ0FBQztRQUNkLGFBQWEsRUFBRSxLQUFLO1FBQ3BCLEdBQUcsRUFBRSxTQUFTO0tBQ2QsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQWxCRCx3QkFrQkM7QUFFRCxrQkFBZSxNQUFNLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzIvMS5cbiAqL1xuXG5pbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHsgZGlyU3luYyB9IGZyb20gJ3RtcCc7XG5pbXBvcnQgeyBPVVRQVVRfRElSIH0gZnJvbSAnLi9jb25zdCc7XG5pbXBvcnQgeyBqb2luIH0gZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IHBhdGhFeGlzdHNTeW5jIH0gZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHsgc3Bhd25TeW5jIH0gZnJvbSBcImNoaWxkX3Byb2Nlc3NcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRtcERpcihvdXRwdXREaXI/OiBzdHJpbmcpXG57XG5cdGlmIChvdXRwdXREaXIgPT0gbnVsbClcblx0e1xuXHRcdGlmIChwcm9jZXNzLmVudi5ZQVJOX0NBQ0hFX0ZPTERFUilcblx0XHR7XG5cdFx0XHRvdXRwdXREaXIgPSBqb2luKHByb2Nlc3MuZW52LllBUk5fQ0FDSEVfRk9MREVSLCAndG1wJylcblx0XHR9XG5cdFx0ZWxzZSBpZiAocHJvY2Vzcy5lbnYuVEVNUClcblx0XHR7XG5cdFx0XHRvdXRwdXREaXIgPSBqb2luKHByb2Nlc3MuZW52LlRFTVAsICd0bXAnKVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiBkaXJTeW5jKHtcblx0XHR1bnNhZmVDbGVhbnVwOiBmYWxzZSxcblx0XHRkaXI6IG91dHB1dERpcixcblx0fSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHRtcERpclxuIl19