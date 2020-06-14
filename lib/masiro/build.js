"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCache = void 0;
const update_1 = require("./update");
const bluebird_1 = __importDefault(require("bluebird"));
const uuid_1 = __importDefault(require("@demonovel/uuid"));
function buildCache() {
    return bluebird_1.default.props({
        table: update_1.updateCache(),
        table_update: update_1.updateCache2(),
    })
        .then(({ table, table_update, }) => {
        const siteID = 'masiro';
        return Object.entries(table_update)
            .sort((a, b) => b[1] - a[1])
            .reduce((a, [id, value]) => {
            let uuid = uuid_1.default(siteID, id);
            let row = table[uuid];
            if (row.title) {
                a.push({
                    id,
                    title: row.title,
                });
            }
            return a;
        }, []);
    });
}
exports.buildCache = buildCache;
//# sourceMappingURL=build.js.map