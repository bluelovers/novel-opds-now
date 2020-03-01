"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQU1BLGlDQUEwRDtBQUd0QywrRkFIWCxzQkFBZSxPQUdVO0FBaUJkLCtGQXBCTSxzQkFBZSxPQW9CUDtBQWRsQyxTQUFnQixlQUFlLENBQUMsR0FBRyxJQUF3QztJQUUxRSxPQUFPLHNCQUFlLENBQUMsR0FBRyxJQUFJLENBQUM7U0FDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ1osSUFBSSxJQUFJLEVBQ1I7WUFDQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztTQUNsQjtRQUNELE9BQU8sSUFBSSxDQUFBO0lBQ1osQ0FBQyxDQUFDLENBQ0Y7QUFDRixDQUFDO0FBWEQsMENBV0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzIvMjEuXG4gKi9cblxuLy9pbXBvcnQgeyBnZXRHdW5FcHViRmlsZSwgZ2V0R3VuRXB1YkZpbGUyLCBwdXRHdW5FcHViRmlsZSB9IGZyb20gJy4vZ3VuJztcblxuaW1wb3J0IHsgZ2V0SVBGU0VwdWJGaWxlLCBwdXRJUEZTRXB1YkZpbGUgfSBmcm9tICcuL2lwZnMnO1xuXG5leHBvcnQge1xuXHRnZXRJUEZTRXB1YkZpbGUgYXMgZ2V0R3VuRXB1YkZpbGUsXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRHdW5FcHViRmlsZTIoLi4uYXJndjogUGFyYW1ldGVyczx0eXBlb2YgZ2V0SVBGU0VwdWJGaWxlPilcbntcblx0cmV0dXJuIGdldElQRlNFcHViRmlsZSguLi5hcmd2KVxuXHRcdC50aGVuKGRhdGEgPT4ge1xuXHRcdFx0aWYgKGRhdGEpXG5cdFx0XHR7XG5cdFx0XHRcdGRhdGEuaXNHdW4gPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGRhdGFcblx0XHR9KVxuXHQ7XG59XG5cbmV4cG9ydCB7XG5cdHB1dElQRlNFcHViRmlsZSBhcyBwdXRHdW5FcHViRmlsZVxufVxuIl19