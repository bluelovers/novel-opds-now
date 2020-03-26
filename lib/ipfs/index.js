"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.putEpubFileInfo = exports.getEpubFileInfo = exports.newURL = void 0;
const index_1 = require("../util/index");
const bluebird_1 = __importDefault(require("bluebird"));
const fetch_1 = __importDefault(require("../fetch"));
const hash_sum_1 = __importDefault(require("hash-sum"));
const server01 = `https://api-file-server.epub.now.sh/`;
const server02 = `https://calm-inlet-73656.herokuapp.com`;
function newURL(siteID, novelID, server = server01) {
    return new URL(`db/file/${siteID}/${hash_sum_1.default(novelID)}`, server);
}
exports.newURL = newURL;
function getEpubFileInfo(_siteID, _novelID) {
    let { siteID, novelID } = index_1.handleArgvList(_siteID, _novelID);
    let timeout = 5 * 1000;
    return new bluebird_1.default((resolve, reject) => {
        let max = siteID.length * novelID.length;
        let i = 0;
        function _resolve(e) {
            i++;
            if (e && e.error === false) {
                return resolve(e.data);
            }
            if (i >= max) {
                return reject(e);
            }
        }
        function _reject(e) {
            i++;
            if (i >= max) {
                return reject(e);
            }
        }
        siteID.forEach(siteID => {
            novelID.forEach(novelID => {
                let url = newURL(siteID, novelID);
                fetch_1.default(url.href, {
                    timeout,
                })
                    .then(v => v.json())
                    .then(_resolve)
                    .catch(_reject);
            });
        });
    })
        .timeout(timeout + 5 * 1000);
}
exports.getEpubFileInfo = getEpubFileInfo;
function putEpubFileInfo(siteID, novelID, data) {
    let url = newURL(siteID, novelID);
    let timeout = 60 * 1000;
    let opts = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        timeout,
    };
    return fetch_1.default(url.href, opts)
        .catch((e) => {
        if (e.status == 503) {
            return bluebird_1.default.delay(5000)
                .then(e => fetch_1.default(url.href, opts));
        }
        return Promise.reject(e);
    })
        .catch(e => {
        console.error(`putEpubFileInfo`, `上傳資料時發生錯誤`);
        return Promise.reject(e);
    });
}
exports.putEpubFileInfo = putEpubFileInfo;
//# sourceMappingURL=index.js.map