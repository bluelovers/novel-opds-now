"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("v8-compile-cache");
const worker_threads_1 = require("worker_threads");
const bluebird_1 = tslib_1.__importDefault(require("@bluelovers/fast-glob/bluebird"));
const path_1 = require("path");
const const_1 = require("../../lib/const");
const fs_extra_1 = require("fs-extra");
const bluebird_2 = tslib_1.__importDefault(require("bluebird"));
const cn2tw_min_1 = require("../../lib/cn2tw_min");
const array_hyper_unique_1 = require("array-hyper-unique");
const logger_1 = tslib_1.__importDefault(require("debug-color2/logger"));
const fix_zh_harmony_1 = tslib_1.__importDefault(require("fix-zh-harmony"));
const util_1 = require("util");
const handleAsync = function handleAsync(id, IDKEY, outputDir = const_1.OUTPUT_DIR) {
    return null;
};
exports.default = handleAsync;
if (worker_threads_1.isMainThread) {
    const __worker = (() => {
        let p = (0, path_1.parse)(__filename);
        return (0, path_1.join)(p.dir, p.name + '.js');
    })();
    function handleAsync(id, IDKEY, outputDir) {
        return _list(id, IDKEY, outputDir)
            .then(_rename)
            .then(v => _split(v, outputDir))
            .thenReturn(true)
            .tapCatch(e => logger_1.default.error(`handleAsync`, e));
    }
    function _list(id, IDKEY, outputDir) {
        IDKEY = IDKEY.split('/')[0];
        let cwd = (0, path_1.join)(outputDir, IDKEY, String(id));
        return (0, bluebird_1.default)([
            '**/*',
        ], {
            cwd,
            absolute: false,
            markDirectories: true,
            onlyDirectories: true,
        })
            .each(file => {
            let _a = (0, path_1.join)(cwd, file);
            let _b = (0, path_1.join)(cwd, (0, cn2tw_min_1.cn2tw_min)(file, {
                safe: false,
            }));
            return (0, fs_extra_1.rename)(_a, _b);
        })
            .then(e => (0, bluebird_1.default)([
            '**/*.txt',
        ], {
            cwd,
            absolute: true,
        }))
            .tap(list => {
            if (list.length === 0) {
                return Promise.reject(`can't found any file, ${(0, util_1.inspect)({
                    siteID: IDKEY,
                    id,
                    cwd,
                })}`);
            }
            logger_1.default.debug(`本次將處理 ${list.length} 個檔案`);
        });
    }
    async function _rename(list) {
        return bluebird_2.default.resolve(list)
            .map(file => {
            file = (0, path_1.normalize)(file);
            let p = (0, path_1.parse)(file);
            let file_new = (0, path_1.join)(p.dir, (0, cn2tw_min_1.cn2tw_min)(p.name, {
                safe: false,
            }) + p.ext);
            return (0, fs_extra_1.move)(file, file_new, {
                overwrite: true,
            })
                .then(value => file_new)
                .catch(e => file);
        })
            .then(v => (0, array_hyper_unique_1.array_unique)(v));
    }
    async function _split(list, outputDir, skipSegment = [], skipContext = []) {
        if (!list.length) {
            return list;
        }
        let ids = await _process({
            value: list,
            skipSegment,
            skipContext,
            outputDir,
        })
            .map(v => v.index);
        if (ids.length || skipContext && skipContext.length) {
            list = list.filter((value, index) => {
                if (skipContext && skipContext.includes(value)) {
                    return false;
                }
                return !ids.includes(index);
            });
        }
        if (skipSegment && skipSegment.length && list.length) {
            list.forEach((value, index) => {
                if (skipSegment.includes(value)) {
                    skipContext = skipContext || [];
                    skipContext.push(value);
                }
            });
        }
        if (!ids.length && list.length) {
            skipSegment = skipSegment || [];
            skipSegment.push(list[0]);
        }
        return _split(list, outputDir, skipSegment, skipContext);
    }
    function _process(workerData) {
        return new bluebird_2.default((resolve, reject) => {
            let _stop_by_self = false;
            const _resolve = (...argv) => {
                resolve(...argv);
                _stop_by_self = true;
                worker.terminate();
            };
            const worker = new worker_threads_1.Worker(__worker, {
                workerData,
            });
            const values = [];
            let timer = setTimeout(() => {
                logger_1.default.warn(`處理超時...再執行一次，本次已處理 ${values.length}/${workerData.value.length} 檔案`);
                _resolve(values);
            }, 60 * 1000);
            worker.on('message', (v) => {
                values.push(v);
            });
            worker.on('error', (e) => {
                clearTimeout(timer);
                if (e) {
                    logger_1.default.error(`Worker error`, e);
                }
                _resolve(values);
            });
            worker.on('exit', (code) => {
                clearTimeout(timer);
                if (code !== 0 && !_stop_by_self) {
                    logger_1.default.error(`Worker stopped with exit code ${code}`);
                }
                _resolve(values);
            });
        });
    }
    exports.default = handleAsync;
}
else {
    let { fn, value, skipSegment, skipContext, outputDir, } = worker_threads_1.workerData;
    function _handle(list) {
        return bluebird_2.default.resolve(list)
            .then(async (list) => {
            const doSegment = await Promise.resolve().then(() => tslib_1.__importStar(require('../../lib/doSegment'))).then(v => v.default);
            const handleContext = await Promise.resolve().then(() => tslib_1.__importStar(require('../../lib/epub/doLayout'))).then(v => v.default);
            return bluebird_2.default.resolve(list)
                .each(async (file, index, length) => {
                logger_1.default.debug(`${String(index).padStart(4, '0')}/${String(length).padStart(4, '0')}`, (0, path_1.relative)(outputDir, file));
                let text = await (0, fs_extra_1.readFile)(file, 'utf8')
                    .then(fix_zh_harmony_1.default);
                if (!(skipSegment && skipSegment.includes(file))) {
                    text = await doSegment(text);
                }
                if (!(skipContext && skipContext.includes(file))) {
                    text = await handleContext(text);
                }
                text = await (0, cn2tw_min_1.cn2tw_min)(text);
                await (0, fs_extra_1.writeFile)(file, text);
                worker_threads_1.parentPort.postMessage({
                    index,
                });
            });
        });
    }
    _handle(value);
}
//# sourceMappingURL=threads.js.map