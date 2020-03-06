"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putGunEpubFile = exports.getGunEpubFile2 = exports.getGunEpubFile = void 0;
const ipfs_1 = require("./ipfs");
Object.defineProperty(exports, "getGunEpubFile", { enumerable: true, get: function () { return ipfs_1.getIPFSEpubFile; } });
Object.defineProperty(exports, "putGunEpubFile", { enumerable: true, get: function () { return ipfs_1.putIPFSEpubFile; } });
function getGunEpubFile2(...argv) {
    return ipfs_1.getIPFSEpubFile(...argv)
        .then(data => {
        if (data) {
            data.isGun = true;
        }
        return data;
    });
}
exports.getGunEpubFile2 = getGunEpubFile2;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFNQSxpQ0FBMEQ7QUFHdEMsK0ZBSFgsc0JBQWUsT0FHVTtBQWlCZCwrRkFwQk0sc0JBQWUsT0FvQlA7QUFkbEMsU0FBZ0IsZUFBZSxDQUFDLEdBQUcsSUFBd0M7SUFFMUUsT0FBTyxzQkFBZSxDQUFDLEdBQUcsSUFBSSxDQUFDO1NBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNaLElBQUksSUFBSSxFQUNSO1lBQ0MsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7U0FDbEI7UUFDRCxPQUFPLElBQUksQ0FBQTtJQUNaLENBQUMsQ0FBQyxDQUNGO0FBQ0YsQ0FBQztBQVhELDBDQVdDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8yLzIxLlxuICovXG5cbi8vaW1wb3J0IHsgZ2V0R3VuRXB1YkZpbGUsIGdldEd1bkVwdWJGaWxlMiwgcHV0R3VuRXB1YkZpbGUgfSBmcm9tICcuL2d1bic7XG5cbmltcG9ydCB7IGdldElQRlNFcHViRmlsZSwgcHV0SVBGU0VwdWJGaWxlIH0gZnJvbSAnLi9pcGZzJztcblxuZXhwb3J0IHtcblx0Z2V0SVBGU0VwdWJGaWxlIGFzIGdldEd1bkVwdWJGaWxlLFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0R3VuRXB1YkZpbGUyKC4uLmFyZ3Y6IFBhcmFtZXRlcnM8dHlwZW9mIGdldElQRlNFcHViRmlsZT4pXG57XG5cdHJldHVybiBnZXRJUEZTRXB1YkZpbGUoLi4uYXJndilcblx0XHQudGhlbihkYXRhID0+IHtcblx0XHRcdGlmIChkYXRhKVxuXHRcdFx0e1xuXHRcdFx0XHRkYXRhLmlzR3VuID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBkYXRhXG5cdFx0fSlcblx0O1xufVxuXG5leHBvcnQge1xuXHRwdXRJUEZTRXB1YkZpbGUgYXMgcHV0R3VuRXB1YkZpbGVcbn1cbiJdfQ==