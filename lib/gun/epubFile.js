"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.raceGunEpubFile = exports.nodeGunEpubFile = exports.promiseGunEpubFile = exports.allGunEpubFile = exports.makeArrayEntrys = void 0;
const setup_1 = __importDefault(require("../../server/gun/setup"));
const bluebird_1 = __importDefault(require("bluebird"));
const array_hyper_unique_1 = require("array-hyper-unique");
const retryGunNode_1 = __importDefault(require("./retryGunNode"));
function makeArrayEntrys(siteID, novel_id) {
    if (!Array.isArray(siteID)) {
        siteID = [siteID];
    }
    if (!Array.isArray(novel_id)) {
        novel_id = [novel_id];
    }
    siteID = array_hyper_unique_1.array_unique_overwrite(siteID.map(v => String(v)));
    novel_id = array_hyper_unique_1.array_unique_overwrite(novel_id.map(v => String(v)));
    return siteID
        .reduce((a, siteID) => {
        siteID && novel_id.forEach(novel_id => {
            novel_id && a.push([siteID, novel_id]);
        });
        return a;
    }, []);
}
exports.makeArrayEntrys = makeArrayEntrys;
function allGunEpubFile(siteID, novel_id) {
    if (!Array.isArray(siteID)) {
        siteID = [siteID];
    }
    if (!Array.isArray(novel_id)) {
        novel_id = [novel_id];
    }
    siteID = array_hyper_unique_1.array_unique_overwrite(siteID.map(v => String(v)));
    novel_id = array_hyper_unique_1.array_unique_overwrite(novel_id.map(v => String(v)));
    return siteID
        .reduce((a, siteID) => {
        siteID && novel_id.forEach(novel_id => {
            novel_id && a.push(nodeGunEpubFile(siteID, novel_id));
        });
        return a;
    }, []);
}
exports.allGunEpubFile = allGunEpubFile;
function promiseGunEpubFile(siteID, novel_id) {
    return allGunEpubFile(siteID, novel_id)
        .map(node => retryGunNode_1.default(node).timeout(15 * 1000).catch(e => null));
}
exports.promiseGunEpubFile = promiseGunEpubFile;
function nodeGunEpubFile(siteID, novel_id) {
    return setup_1.default().get(siteID).get(novel_id);
}
exports.nodeGunEpubFile = nodeGunEpubFile;
function raceGunEpubFile(siteID, novel_id) {
    return bluebird_1.default.race(promiseGunEpubFile(siteID, novel_id));
}
exports.raceGunEpubFile = raceGunEpubFile;
//# sourceMappingURL=epubFile.js.map