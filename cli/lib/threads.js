"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const bluebird_1 = __importDefault(require("@bluelovers/fast-glob/bluebird"));
const path_1 = require("path");
const const_1 = require("../../lib/const");
const fs_extra_1 = require("fs-extra");
const bluebird_2 = __importDefault(require("bluebird"));
const cn2tw_min_1 = require("../../lib/cn2tw_min");
const handleAsync = function handleAsync(id, IDKEY, outputDir = const_1.OUTPUT_DIR) {
    return null;
};
exports.default = handleAsync;
if (worker_threads_1.isMainThread) {
    const __worker = (() => {
        let p = path_1.parse(__filename);
        return path_1.join(p.dir, p.name + '.js');
    })();
    function handleAsync(id, IDKEY, outputDir) {
        return _list(id, IDKEY, outputDir)
            .then(_rename)
            .then(v => _split(v, outputDir))
            .thenReturn(true);
    }
    function _list(id, IDKEY, outputDir) {
        IDKEY = IDKEY.split('/')[0];
        let cwd = path_1.join(outputDir, IDKEY, String(id));
        return bluebird_1.default([
            '**/*.txt',
        ], {
            cwd,
            absolute: true,
        })
            .tap(list => {
            if (list.length === 0) {
                return Promise.reject(`can't found any file, ${{
                    siteID: IDKEY,
                    id,
                    cwd,
                }}`);
            }
        });
    }
    async function _rename(list) {
        return bluebird_2.default.resolve(list)
            .map(file => {
            file = path_1.normalize(file);
            let p = path_1.parse(file);
            let file_new = path_1.join(p.dir, cn2tw_min_1.cn2tw_min(p.name) + p.ext);
            return fs_extra_1.rename(file, file_new)
                .then(value => file_new)
                .catch(e => file);
        });
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
        if (skipSegment && skipSegment.length) {
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
            const worker = new worker_threads_1.Worker(__worker, {
                workerData,
            });
            let timer = setTimeout(resolve, 60 * 1000);
            const values = [];
            worker.on('message', (v) => {
                values.push(v);
            });
            worker.on('error', (e) => {
                clearTimeout(timer);
                if (e) {
                    console.error(`Worker error`, e);
                }
                resolve(values);
            });
            worker.on('exit', (code) => {
                clearTimeout(timer);
                if (code !== 0) {
                    console.error(`Worker stopped with exit code ${code}`);
                }
                resolve(values);
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
            const doSegment = await Promise.resolve().then(() => __importStar(require('../../lib/doSegment'))).then(v => v.default);
            const handleContext = await Promise.resolve().then(() => __importStar(require('../../lib/doLayout'))).then(v => v.default);
            return bluebird_2.default.resolve(list)
                .each(async (file, index) => {
                console.dir(path_1.relative(outputDir, file));
                let text = await fs_extra_1.readFile(file, 'utf8');
                if (!(skipSegment && skipSegment.includes(file))) {
                    text = await doSegment(text);
                }
                if (!(skipContext && skipContext.includes(file))) {
                    text = await handleContext(text);
                }
                text = await cn2tw_min_1.cn2tw_min(text);
                await fs_extra_1.writeFile(file, text);
                worker_threads_1.parentPort.postMessage({
                    index,
                });
            });
        });
    }
    _handle(value);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhyZWFkcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRocmVhZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBSUEsbURBRXdCO0FBQ3hCLDhFQUFzRDtBQUN0RCwrQkFBNkQ7QUFDN0QsMkNBQTZDO0FBRTdDLHVDQUF1RDtBQUN2RCx3REFBZ0M7QUFFaEMsbURBQWdEO0FBR2hELE1BQU0sV0FBVyxHQUFHLFNBQVMsV0FBVyxDQUFDLEVBQW1CLEVBQUUsS0FBYSxFQUFFLFNBQVMsR0FBRyxrQkFBVTtJQUVsRyxPQUFPLElBQUksQ0FBQztBQUNiLENBQUMsQ0FBQztBQUVGLGtCQUFlLFdBQVcsQ0FBQTtBQVcxQixJQUFJLDZCQUFZLEVBQ2hCO0lBQ0MsTUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFHLEVBQUU7UUFFdEIsSUFBSSxDQUFDLEdBQUcsWUFBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzFCLE9BQU8sV0FBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQTtJQUNuQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBRUwsU0FBUyxXQUFXLENBQUMsRUFBbUIsRUFBRSxLQUFhLEVBQUUsU0FBaUI7UUFFekUsT0FBTyxLQUFLLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUM7YUFDaEMsSUFBSSxDQUFDLE9BQU8sQ0FBQzthQUNiLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7YUFDL0IsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUNqQjtJQUNGLENBQUM7SUFFRCxTQUFTLEtBQUssQ0FBQyxFQUFtQixFQUFFLEtBQWEsRUFBRSxTQUFTO1FBRTNELEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTVCLElBQUksR0FBRyxH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aEQ7b0JBQ0MsSUFBSSxHQUFHLE1BQU0sYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNqQztnQkFFRCxJQUFJLEdBQUcsTUFBTSxxQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUU3QixNQUFNLG9CQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUU1QiwyQkFBVSxDQUFDLFdBQVcsQ0FBQztvQkFDdEIsS0FBSztpQkFDTCxDQUFDLENBQUM7WUFDSixDQUFDLENBQUMsQ0FDRDtRQUVILENBQUMsQ0FBQyxDQUNEO0lBRUgsQ0FBQztJQUVELE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtDQUNkIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8xLzMxLlxuICovXG5cbmltcG9ydCB7XG5cdFdvcmtlciwgaXNNYWluVGhyZWFkLCBwYXJlbnRQb3J0LCB3b3JrZXJEYXRhLFxufSBmcm9tICd3b3JrZXJfdGhyZWFkcyc7XG5pbXBvcnQgRmFzdEdsb2IgZnJvbSAnQGJsdWVsb3ZlcnMvZmFzdC1nbG9iL2JsdWViaXJkJztcbmltcG9ydCB7IGpvaW4sIHBhcnNlLCBub3JtYWxpemUsIHNlcCwgcmVsYXRpdmUgfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgT1VUUFVUX0RJUiB9IGZyb20gJy4uLy4uL2xpYi9jb25zdCc7XG5pbXBvcnQgeyBFbnVtTm92ZWxTaXRlTGlzdCB9IGZyb20gJ25vdmVsLWRvd25sb2FkZXIvc3JjL2FsbCc7XG5pbXBvcnQgeyByZWFkRmlsZSwgd3JpdGVGaWxlLCByZW5hbWUgfSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IGRvU2VnbWVudCBmcm9tICcuLi8uLi9saWIvZG9TZWdtZW50JztcbmltcG9ydCB7IGNuMnR3X21pbiB9IGZyb20gJy4uLy4uL2xpYi9jbjJ0d19taW4nO1xuaW1wb3J0IGhhbmRsZUNvbnRleHQgZnJvbSAnLi4vLi4vbGliL2RvTGF5b3V0JztcblxuY29uc3QgaGFuZGxlQXN5bmMgPSBmdW5jdGlvbiBoYW5kbGVBc3luYyhpZDogc3RyaW5nIHwgbnVtYmVyLCBJREtFWTogc3RyaW5nLCBvdXRwdXREaXIgPSBPVVRQVVRfRElSKTogQmx1ZWJpcmQ8Ym9vbGVhbj5cbntcblx0cmV0dXJuIG51bGw7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBoYW5kbGVBc3luY1xuXG50eXBlIElXb3JrZXJEYXRhID0ge1xuXHRpZD86IHN0cmluZztcblx0Zm4/OiBuZXZlcjtcblx0dmFsdWU6IHN0cmluZ1tdXG5cdHNraXBTZWdtZW50OiBzdHJpbmdbXSxcblx0c2tpcENvbnRleHQ6IHN0cmluZ1tdLFxuXHRvdXRwdXREaXI6IHN0cmluZyxcbn1cblxuaWYgKGlzTWFpblRocmVhZClcbntcblx0Y29uc3QgX193b3JrZXIgPSAoKCkgPT5cblx0e1xuXHRcdGxldCBwID0gcGFyc2UoX19maWxlbmFtZSk7XG5cdFx0cmV0dXJuIGpvaW4ocC5kaXIsIHAubmFtZSArICcuanMnKVxuXHR9KSgpO1xuXG5cdGZ1bmN0aW9uIGhhbmRsZUFzeW5jKGlkOiBzdHJpbmcgfCBudW1iZXIsIElES0VZOiBzdHJpbmcsIG91dHB1dERpcjogc3RyaW5nKTogQmx1ZWJpcmQ8Ym9vbGVhbj5cblx0e1xuXHRcdHJldHVybiBfbGlzdChpZCwgSURLRVksIG91dHB1dERpcilcblx0XHRcdC50aGVuKF9yZW5hbWUpXG5cdFx0XHQudGhlbih2ID0+IF9zcGxpdCh2LCBvdXRwdXREaXIpKVxuXHRcdFx0LnRoZW5SZXR1cm4odHJ1ZSlcblx0XHQ7XG5cdH1cblxuXHRmdW5jdGlvbiBfbGlzdChpZDogc3RyaW5nIHwgbnVtYmVyLCBJREtFWTogc3RyaW5nLCBvdXRwdXREaXIpXG5cdHtcblx0XHRJREtFWSA9IElES0VZLnNwbGl0KCcvJylbMF07XG5cblx0XHRsZXQgY3dkID0gam9pbihvdXRwdXREaXIsIElES0VZLCBTdHJpbmcoaWQpKTtcblxuXHRcdHJldHVybiBGYXN0R2xvYihbXG5cdFx0XHQnKiovKi50eHQnLFxuXHRcdF0sIHtcblx0XHRcdGN3ZCxcblx0XHRcdGFic29sdXRlOiB0cnVlLFxuXHRcdH0pXG5cdFx0XHQudGFwKGxpc3QgPT5cblx0XHRcdHtcblx0XHRcdFx0aWYgKGxpc3QubGVuZ3RoID09PSAwKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGBjYW4ndCBmb3VuZCBhbnkgZmlsZSwgJHt7XG5cdFx0XHRcdFx0XHRzaXRlSUQ6IElES0VZLFxuXHRcdFx0XHRcdFx0aWQsXG5cdFx0XHRcdFx0XHRjd2QsXG5cdFx0XHRcdFx0fX1gKVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0O1xuXHR9XG5cblx0YXN5bmMgZnVuY3Rpb24gX3JlbmFtZShsaXN0OiBzdHJpbmdbXSlcblx0e1xuXHRcdHJldHVybiBCbHVlYmlyZC5yZXNvbHZlKGxpc3QpXG5cdFx0XHQubWFwKGZpbGUgPT4ge1xuXHRcdFx0XHRmaWxlID0gbm9ybWFsaXplKGZpbGUpO1xuXHRcdFx0XHRsZXQgcCA9IHBhcnNlKGZpbGUpO1xuXHRcdFx0XHRsZXQgZmlsZV9uZXcgPSBqb2luKHAuZGlyLCBjbjJ0d19taW4ocC5uYW1lKSArIHAuZXh0KTtcblx0XHRcdFx0cmV0dXJuIHJlbmFtZShmaWxlLCBmaWxlX25ldylcblx0XHRcdFx0XHQudGhlbih2YWx1ZSA9PiBmaWxlX25ldylcblx0XHRcdFx0XHQuY2F0Y2goZSA9PiBmaWxlKVxuXHRcdFx0XHQ7XG5cdFx0XHR9KVxuXHRcdDtcblx0fVxuXG5cdGFzeW5jIGZ1bmN0aW9uIF9zcGxpdChsaXN0OiBzdHJpbmdbXSwgb3V0cHV0RGlyOiBzdHJpbmcsIHNraXBTZWdtZW50OiBzdHJpbmdbXSA9IFtdLCBza2lwQ29udGV4dDogc3RyaW5nW10gPSBbXSk6IFByb21pc2U8c3RyaW5nW10+XG5cdHtcblx0XHRpZiAoIWxpc3QubGVuZ3RoKVxuXHRcdHtcblx0XHRcdHJldHVybiBsaXN0O1xuXHRcdH1cblxuXHRcdGxldCBpZHM6IG51bWJlcltdID0gYXdhaXQgX3Byb2Nlc3M8eyBpbmRleDogbnVtYmVyIH1bXT4oe1xuXHRcdFx0XHR2YWx1ZTogbGlzdCxcblx0XHRcdFx0c2tpcFNlZ21lbnQsXG5cdFx0XHRza2lwQ29udGV4dCxcblx0XHRcdG91dHB1dERpcixcblx0XHRcdH0pXG5cdFx0XHQubWFwKHYgPT4gdi5pbmRleClcblx0XHQ7XG5cblx0XHRpZiAoaWRzLmxlbmd0aCB8fCBza2lwQ29udGV4dCAmJiBza2lwQ29udGV4dC5sZW5ndGgpXG5cdFx0e1xuXHRcdFx0bGlzdCA9IGxpc3QuZmlsdGVyKCh2YWx1ZSwgaW5kZXgpID0+IHtcblxuXHRcdFx0XHRpZiAoc2tpcENvbnRleHQgJiYgc2tpcENvbnRleHQuaW5jbHVkZXModmFsdWUpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICFpZHMuaW5jbHVkZXMoaW5kZXgpXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRpZiAoc2tpcFNlZ21lbnQgJiYgc2tpcFNlZ21lbnQubGVuZ3RoKVxuXHRcdHtcblx0XHRcdGxpc3QuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XG5cblx0XHRcdFx0aWYgKHNraXBTZWdtZW50LmluY2x1ZGVzKHZhbHVlKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHNraXBDb250ZXh0ID0gc2tpcENvbnRleHQgfHwgW107XG5cdFx0XHRcdFx0c2tpcENvbnRleHQucHVzaCh2YWx1ZSlcblx0XHRcdFx0fVxuXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRpZiAoIWlkcy5sZW5ndGggJiYgbGlzdC5sZW5ndGgpXG5cdFx0e1xuXHRcdFx0c2tpcFNlZ21lbnQgPSBza2lwU2VnbWVudCB8fCBbXTtcblx0XHRcdHNraXBTZWdtZW50LnB1c2gobGlzdFswXSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIF9zcGxpdChsaXN0LCBvdXRwdXREaXIsIHNraXBTZWdtZW50LCBza2lwQ29udGV4dClcblx0fVxuXG5cdGZ1bmN0aW9uIF9wcm9jZXNzPFQgZXh0ZW5kcyBhbnlbXT4od29ya2VyRGF0YTogSVdvcmtlckRhdGEpOiBCbHVlYmlyZDxUPlxuXHR7XG5cdFx0cmV0dXJuIG5ldyBCbHVlYmlyZDxUPigocmVzb2x2ZSwgcmVqZWN0KSA9PlxuXHRcdHtcblx0XHRcdGNvbnN0IHdvcmtlciA9IG5ldyBXb3JrZXIoX193b3JrZXIsIHtcblx0XHRcdFx0d29ya2VyRGF0YSxcblx0XHRcdH0pO1xuXG5cdFx0XHRsZXQgdGltZXIgPSBzZXRUaW1lb3V0KHJlc29sdmUsIDYwICogMTAwMCk7XG5cdFx0XHRjb25zdCB2YWx1ZXMgPSBbXSBhcyBUO1xuXG5cdFx0XHR3b3JrZXIub24oJ21lc3NhZ2UnLCAodikgPT5cblx0XHRcdHtcblx0XHRcdFx0dmFsdWVzLnB1c2godik7XG5cdFx0XHR9KTtcblx0XHRcdHdvcmtlci5vbignZXJyb3InLCAoZSkgPT5cblx0XHRcdHtcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVyKTtcblx0XHRcdFx0aWYgKGUpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGBXb3JrZXIgZXJyb3JgLCBlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdHJlc29sdmUodmFsdWVzKTtcblx0XHRcdH0pO1xuXHRcdFx0d29ya2VyLm9uKCdleGl0JywgKGNvZGUpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGNsZWFyVGltZW91dCh0aW1lcik7XG5cdFx0XHRcdGlmIChjb2RlICE9PSAwKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihgV29ya2VyIHN0b3BwZWQgd2l0aCBleGl0IGNvZGUgJHtjb2RlfWApXG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRyZXNvbHZlKHZhbHVlcyk7XG5cdFx0XHR9KTtcblxuXHRcdH0pO1xuXHR9XG5cblx0ZXhwb3J0cy5kZWZhdWx0ID0gaGFuZGxlQXN5bmNcbn1cbmVsc2Vcbntcblx0bGV0IHtcblx0XHRmbixcblx0XHR2YWx1ZSxcblx0XHRza2lwU2VnbWVudCxcblx0XHRza2lwQ29udGV4dCxcblx0XHRvdXRwdXREaXIsXG5cdH0gPSB3b3JrZXJEYXRhIGFzIElXb3JrZXJEYXRhO1xuXG5cdGZ1bmN0aW9uIF9oYW5kbGUobGlzdDogc3RyaW5nW10pXG5cdHtcblx0XHRyZXR1cm4gQmx1ZWJpcmQucmVzb2x2ZShsaXN0KVxuXHRcdFx0LnRoZW4oYXN5bmMgKGxpc3QpID0+XG5cdFx0XHR7XG5cblx0XHRcdFx0Ly9jb25zdCBjbjJ0d19taW4gPSBhd2FpdCBpbXBvcnQoJy4uLy4uL2xpYi9jbjJ0d19taW4nKS50aGVuKHYgPT4gdi5kZWZhdWx0KTtcblx0XHRcdFx0Y29uc3QgZG9TZWdtZW50ID0gYXdhaXQgaW1wb3J0KCcuLi8uLi9saWIvZG9TZWdtZW50JykudGhlbih2ID0+IHYuZGVmYXVsdCk7XG5cdFx0XHRcdGNvbnN0IGhhbmRsZUNvbnRleHQgPSBhd2FpdCBpbXBvcnQoJy4uLy4uL2xpYi9kb0xheW91dCcpLnRoZW4odiA9PiB2LmRlZmF1bHQpO1xuXG5cdFx0XHRcdHJldHVybiBCbHVlYmlyZC5yZXNvbHZlKGxpc3QpXG5cdFx0XHRcdFx0LmVhY2goYXN5bmMgKGZpbGUsIGluZGV4KSA9PlxuXHRcdFx0XHRcdHtcblxuXHRcdFx0XHRcdFx0Y29uc29sZS5kaXIocmVsYXRpdmUob3V0cHV0RGlyLCBmaWxlKSk7XG5cblx0XHRcdFx0XHRcdGxldCB0ZXh0ID0gYXdhaXQgcmVhZEZpbGUoZmlsZSwgJ3V0ZjgnKTtcblxuXHRcdFx0XHRcdFx0aWYgKCEoc2tpcFNlZ21lbnQgJiYgc2tpcFNlZ21lbnQuaW5jbHVkZXMoZmlsZSkpKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHR0ZXh0ID0gYXdhaXQgZG9TZWdtZW50KHRleHQpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAoIShza2lwQ29udGV4dCAmJiBza2lwQ29udGV4dC5pbmNsdWRlcyhmaWxlKSkpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHRleHQgPSBhd2FpdCBoYW5kbGVDb250ZXh0KHRleHQpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR0ZXh0ID0gYXdhaXQgY24ydHdfbWluKHRleHQpO1xuXG5cdFx0XHRcdFx0XHRhd2FpdCB3cml0ZUZpbGUoZmlsZSwgdGV4dCk7XG5cblx0XHRcdFx0XHRcdHBhcmVudFBvcnQucG9zdE1lc3NhZ2Uoe1xuXHRcdFx0XHRcdFx0XHRpbmRleCxcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0O1xuXG5cdFx0XHR9KVxuXHRcdFx0O1xuXG5cdH1cblxuXHRfaGFuZGxlKHZhbHVlKVxufVxuIl19