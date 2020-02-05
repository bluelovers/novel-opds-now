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
const array_hyper_unique_1 = require("array-hyper-unique");
const logger_1 = __importDefault(require("debug-color2/logger"));
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
            logger_1.default.debug(`本次將處理 ${list.length} 個檔案`);
        });
    }
    async function _rename(list) {
        return bluebird_2.default.resolve(list)
            .map(file => {
            file = path_1.normalize(file);
            let p = path_1.parse(file);
            let file_new = path_1.join(p.dir, cn2tw_min_1.cn2tw_min(p.name) + p.ext);
            return fs_extra_1.move(file, file_new, {
                overwrite: true,
            })
                .then(value => file_new)
                .catch(e => file);
        })
            .then(v => array_hyper_unique_1.array_unique(v));
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
            const worker = new worker_threads_1.Worker(__worker, {
                workerData,
            });
            const values = [];
            let timer = setTimeout(() => {
                logger_1.default.warn(`處理超時...再執行一次，本次已處理 ${values.length}/${workerData.value.length} 檔案`);
                resolve(values);
            }, 60 * 1000);
            worker.on('message', (v) => {
                values.push(v);
            });
            worker.on('error', (e) => {
                clearTimeout(timer);
                if (e) {
                    logger_1.default.error(`Worker error`, e);
                }
                resolve(values);
            });
            worker.on('exit', (code) => {
                clearTimeout(timer);
                if (code !== 0) {
                    logger_1.default.error(`Worker stopped with exit code ${code}`);
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
                .each(async (file, index, length) => {
                logger_1.default.debug(`${String(index).padStart(4, '0')}/${String(length).padStart(4, '0')}`, path_1.relative(outputDir, file));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhyZWFkcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRocmVhZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBSUEsbURBRXdCO0FBQ3hCLDhFQUFzRDtBQUN0RCwrQkFBNkQ7QUFDN0QsMkNBQTZDO0FBRTdDLHVDQUE2RDtBQUM3RCx3REFBZ0M7QUFFaEMsbURBQWdEO0FBRWhELDJEQUFrRDtBQUNsRCxpRUFBMEM7QUFFMUMsTUFBTSxXQUFXLEdBQUcsU0FBUyxXQUFXLENBQUMsRUFBbUIsRUFBRSxLQUFhLEVBQUUsU0FBUyxHQUFHLGtCQUFVO0lBRWxHLE9BQU8sSUFBSSxDQUFDO0FBQ2IsQ0FBQyxDQUFDO0FBRUYsa0JBQWUsV0FBVyxDQUFBO0FBVzFCLElBQUksNkJBQVksRUFDaEI7SUFDQyxNQUFNLFFBQVEsR0FBRyxDQUFDLEdBQUcsRUFBRTtRQUV0QixJQUFJLENBQUMsR0FBRyxZQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDMUIsT0FBTyxXQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFBO0lBQ25DLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFFTCxTQUFTLFdBQVcsQ0FBQyxFQUFtQixFQUFFLEtBQWEsRUFBRSxTQUFpQjtRQUV6RSxPQUFPLEtBQUssQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQzthQUNoQyxJQUFJLENBQUMsT0FBTyxDQUFDO2FBQ2IsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQzthQUMvQixVQUFVLENBQUMsSUFBSSxDQUFDLENBQ2pCO0lBQ0YsQ0FBQztJQUVELFNBQVMsS0FBSyxDQUFDLEVBQW1CLEVBQUUsS0FBYSxFQUFFLFNBQVM7UUFFM0QsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxD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QUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsRUFBRTtnQkFHbkMsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLGVBQVEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFFakgsSUFBSSxJQUFJLEdBQUcsTUFBTSxtQkFBUSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFFeEMsSUFBSSxDQUFDLENBQUMsV0FBVyxJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsRUFDaEQ7b0JBQ0MsSUFBSSxHQUFHLE1BQU0sU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUM3QjtnQkFFRCxJQUFJLENBQUMsQ0FBQyxXQUFXLElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUNoRDtvQkFDQyxJQUFJLEdBQUcsTUFBTSxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ2pDO2dCQUVELElBQUksR0FBRyxNQUFNLHFCQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRTdCLE1BQU0sb0JBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBRTVCLDJCQUFVLENBQUMsV0FBVyxDQUFDO29CQUN0QixLQUFLO2lCQUNMLENBQUMsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUNEO1FBRUgsQ0FBQyxDQUFDLENBQ0Q7SUFFSCxDQUFDO0lBRUQsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO0NBQ2QiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzEvMzEuXG4gKi9cblxuaW1wb3J0IHtcblx0V29ya2VyLCBpc01haW5UaHJlYWQsIHBhcmVudFBvcnQsIHdvcmtlckRhdGEsXG59IGZyb20gJ3dvcmtlcl90aHJlYWRzJztcbmltcG9ydCBGYXN0R2xvYiBmcm9tICdAYmx1ZWxvdmVycy9mYXN0LWdsb2IvYmx1ZWJpcmQnO1xuaW1wb3J0IHsgam9pbiwgcGFyc2UsIG5vcm1hbGl6ZSwgc2VwLCByZWxhdGl2ZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBPVVRQVVRfRElSIH0gZnJvbSAnLi4vLi4vbGliL2NvbnN0JztcbmltcG9ydCB7IEVudW1Ob3ZlbFNpdGVMaXN0IH0gZnJvbSAnbm92ZWwtZG93bmxvYWRlci9zcmMvYWxsL2NvbnN0JztcbmltcG9ydCB7IHJlYWRGaWxlLCB3cml0ZUZpbGUsIHJlbmFtZSwgbW92ZSB9IGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgZG9TZWdtZW50IGZyb20gJy4uLy4uL2xpYi9kb1NlZ21lbnQnO1xuaW1wb3J0IHsgY24ydHdfbWluIH0gZnJvbSAnLi4vLi4vbGliL2NuMnR3X21pbic7XG5pbXBvcnQgaGFuZGxlQ29udGV4dCBmcm9tICcuLi8uLi9saWIvZG9MYXlvdXQnO1xuaW1wb3J0IHsgYXJyYXlfdW5pcXVlIH0gZnJvbSAnYXJyYXktaHlwZXItdW5pcXVlJztcbmltcG9ydCBjb25zb2xlIGZyb20gJ2RlYnVnLWNvbG9yMi9sb2dnZXInO1xuXG5jb25zdCBoYW5kbGVBc3luYyA9IGZ1bmN0aW9uIGhhbmRsZUFzeW5jKGlkOiBzdHJpbmcgfCBudW1iZXIsIElES0VZOiBzdHJpbmcsIG91dHB1dERpciA9IE9VVFBVVF9ESVIpOiBCbHVlYmlyZDxib29sZWFuPlxue1xuXHRyZXR1cm4gbnVsbDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGhhbmRsZUFzeW5jXG5cbnR5cGUgSVdvcmtlckRhdGEgPSB7XG5cdGlkPzogc3RyaW5nO1xuXHRmbj86IG5ldmVyO1xuXHR2YWx1ZTogc3RyaW5nW11cblx0c2tpcFNlZ21lbnQ6IHN0cmluZ1tdLFxuXHRza2lwQ29udGV4dDogc3RyaW5nW10sXG5cdG91dHB1dERpcjogc3RyaW5nLFxufVxuXG5pZiAoaXNNYWluVGhyZWFkKVxue1xuXHRjb25zdCBfX3dvcmtlciA9ICgoKSA9PlxuXHR7XG5cdFx0bGV0IHAgPSBwYXJzZShfX2ZpbGVuYW1lKTtcblx0XHRyZXR1cm4gam9pbihwLmRpciwgcC5uYW1lICsgJy5qcycpXG5cdH0pKCk7XG5cblx0ZnVuY3Rpb24gaGFuZGxlQXN5bmMoaWQ6IHN0cmluZyB8IG51bWJlciwgSURLRVk6IHN0cmluZywgb3V0cHV0RGlyOiBzdHJpbmcpOiBCbHVlYmlyZDxib29sZWFuPlxuXHR7XG5cdFx0cmV0dXJuIF9saXN0KGlkLCBJREtFWSwgb3V0cHV0RGlyKVxuXHRcdFx0LnRoZW4oX3JlbmFtZSlcblx0XHRcdC50aGVuKHYgPT4gX3NwbGl0KHYsIG91dHB1dERpcikpXG5cdFx0XHQudGhlblJldHVybih0cnVlKVxuXHRcdDtcblx0fVxuXG5cdGZ1bmN0aW9uIF9saXN0KGlkOiBzdHJpbmcgfCBudW1iZXIsIElES0VZOiBzdHJpbmcsIG91dHB1dERpcilcblx0e1xuXHRcdElES0VZID0gSURLRVkuc3BsaXQoJy8nKVswXTtcblxuXHRcdGxldCBjd2QgPSBqb2luKG91dHB1dERpciwgSURLRVksIFN0cmluZyhpZCkpO1xuXG5cdFx0cmV0dXJuIEZhc3RHbG9iKFtcblx0XHRcdCcqKi8qLnR4dCcsXG5cdFx0XSwge1xuXHRcdFx0Y3dkLFxuXHRcdFx0YWJzb2x1dGU6IHRydWUsXG5cdFx0fSlcblx0XHRcdC50YXAobGlzdCA9PlxuXHRcdFx0e1xuXHRcdFx0XHRpZiAobGlzdC5sZW5ndGggPT09IDApXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoYGNhbid0IGZvdW5kIGFueSBmaWxlLCAke3tcblx0XHRcdFx0XHRcdHNpdGVJRDogSURLRVksXG5cdFx0XHRcdFx0XHRpZCxcblx0XHRcdFx0XHRcdGN3ZCxcblx0XHRcdFx0XHR9fWApXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zb2xlLmRlYnVnKGDmnKzmrKHlsIfomZXnkIYgJHtsaXN0Lmxlbmd0aH0g5YCL5qqU5qGIYClcblx0XHRcdH0pXG5cdFx0XHQ7XG5cdH1cblxuXHRhc3luYyBmdW5jdGlvbiBfcmVuYW1lKGxpc3Q6IHN0cmluZ1tdKVxuXHR7XG5cdFx0cmV0dXJuIEJsdWViaXJkLnJlc29sdmUobGlzdClcblx0XHRcdC5tYXAoZmlsZSA9PiB7XG5cdFx0XHRcdGZpbGUgPSBub3JtYWxpemUoZmlsZSk7XG5cdFx0XHRcdGxldCBwID0gcGFyc2UoZmlsZSk7XG5cdFx0XHRcdGxldCBmaWxlX25ldyA9IGpvaW4ocC5kaXIsIGNuMnR3X21pbihwLm5hbWUpICsgcC5leHQpO1xuXHRcdFx0XHRyZXR1cm4gbW92ZShmaWxlLCBmaWxlX25ldywge1xuXHRcdFx0XHRcdG92ZXJ3cml0ZTogdHJ1ZSxcblx0XHRcdFx0fSlcblx0XHRcdFx0XHQudGhlbih2YWx1ZSA9PiBmaWxlX25ldylcblx0XHRcdFx0XHQuY2F0Y2goZSA9PiBmaWxlKVxuXHRcdFx0XHQ7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4odiA9PiBhcnJheV91bmlxdWUodikpXG5cdFx0O1xuXHR9XG5cblx0YXN5bmMgZnVuY3Rpb24gX3NwbGl0KGxpc3Q6IHN0cmluZ1tdLCBvdXRwdXREaXI6IHN0cmluZywgc2tpcFNlZ21lbnQ6IHN0cmluZ1tdID0gW10sIHNraXBDb250ZXh0OiBzdHJpbmdbXSA9IFtdKTogUHJvbWlzZTxzdHJpbmdbXT5cblx0e1xuXHRcdGlmICghbGlzdC5sZW5ndGgpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIGxpc3Q7XG5cdFx0fVxuXG5cdFx0bGV0IGlkczogbnVtYmVyW10gPSBhd2FpdCBfcHJvY2Vzczx7IGluZGV4OiBudW1iZXIgfVtdPih7XG5cdFx0XHRcdHZhbHVlOiBsaXN0LFxuXHRcdFx0XHRza2lwU2VnbWVudCxcblx0XHRcdHNraXBDb250ZXh0LFxuXHRcdFx0b3V0cHV0RGlyLFxuXHRcdFx0fSlcblx0XHRcdC5tYXAodiA9PiB2LmluZGV4KVxuXHRcdDtcblxuXHRcdGlmIChpZHMubGVuZ3RoIHx8IHNraXBDb250ZXh0ICYmIHNraXBDb250ZXh0Lmxlbmd0aClcblx0XHR7XG5cdFx0XHRsaXN0ID0gbGlzdC5maWx0ZXIoKHZhbHVlLCBpbmRleCkgPT4ge1xuXG5cdFx0XHRcdGlmIChza2lwQ29udGV4dCAmJiBza2lwQ29udGV4dC5pbmNsdWRlcyh2YWx1ZSkpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gIWlkcy5pbmNsdWRlcyhpbmRleClcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGlmIChza2lwU2VnbWVudCAmJiBza2lwU2VnbWVudC5sZW5ndGggJiYgbGlzdC5sZW5ndGgpXG5cdFx0e1xuXHRcdFx0bGlzdC5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcblxuXHRcdFx0XHRpZiAoc2tpcFNlZ21lbnQuaW5jbHVkZXModmFsdWUpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c2tpcENvbnRleHQgPSBza2lwQ29udGV4dCB8fCBbXTtcblx0XHRcdFx0XHRza2lwQ29udGV4dC5wdXNoKHZhbHVlKVxuXHRcdFx0XHR9XG5cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGlmICghaWRzLmxlbmd0aCAmJiBsaXN0Lmxlbmd0aClcblx0XHR7XG5cdFx0XHRza2lwU2VnbWVudCA9IHNraXBTZWdtZW50IHx8IFtdO1xuXHRcdFx0c2tpcFNlZ21lbnQucHVzaChsaXN0WzBdKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gX3NwbGl0KGxpc3QsIG91dHB1dERpciwgc2tpcFNlZ21lbnQsIHNraXBDb250ZXh0KVxuXHR9XG5cblx0ZnVuY3Rpb24gX3Byb2Nlc3M8VCBleHRlbmRzIGFueVtdPih3b3JrZXJEYXRhOiBJV29ya2VyRGF0YSk6IEJsdWViaXJkPFQ+XG5cdHtcblx0XHRyZXR1cm4gbmV3IEJsdWViaXJkPFQ+KChyZXNvbHZlLCByZWplY3QpID0+XG5cdFx0e1xuXHRcdFx0Y29uc3Qgd29ya2VyID0gbmV3IFdvcmtlcihfX3dvcmtlciwge1xuXHRcdFx0XHR3b3JrZXJEYXRhLFxuXHRcdFx0fSk7XG5cblx0XHRcdGNvbnN0IHZhbHVlcyA9IFtdIGFzIFQ7XG5cblx0XHRcdGxldCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXG5cdFx0XHRcdGNvbnNvbGUud2Fybihg6JmV55CG6LaF5pmCLi4u5YaN5Z+36KGM5LiA5qyh77yM5pys5qyh5bey6JmV55CGICR7dmFsdWVzLmxlbmd0aH0vJHt3b3JrZXJEYXRhLnZhbHVlLmxlbmd0aH0g5qqU5qGIYCk7XG5cblx0XHRcdFx0cmVzb2x2ZSh2YWx1ZXMpXG5cdFx0XHR9LCA2MCAqIDEwMDApO1xuXG5cdFx0XHR3b3JrZXIub24oJ21lc3NhZ2UnLCAodikgPT5cblx0XHRcdHtcblx0XHRcdFx0dmFsdWVzLnB1c2godik7XG5cdFx0XHR9KTtcblx0XHRcdHdvcmtlci5vbignZXJyb3InLCAoZSkgPT5cblx0XHRcdHtcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVyKTtcblx0XHRcdFx0aWYgKGUpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGBXb3JrZXIgZXJyb3JgLCBlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdHJlc29sdmUodmFsdWVzKTtcblx0XHRcdH0pO1xuXHRcdFx0d29ya2VyLm9uKCdleGl0JywgKGNvZGUpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGNsZWFyVGltZW91dCh0aW1lcik7XG5cdFx0XHRcdGlmIChjb2RlICE9PSAwKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihgV29ya2VyIHN0b3BwZWQgd2l0aCBleGl0IGNvZGUgJHtjb2RlfWApXG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRyZXNvbHZlKHZhbHVlcyk7XG5cdFx0XHR9KTtcblxuXHRcdH0pO1xuXHR9XG5cblx0ZXhwb3J0cy5kZWZhdWx0ID0gaGFuZGxlQXN5bmNcbn1cbmVsc2Vcbntcblx0bGV0IHtcblx0XHRmbixcblx0XHR2YWx1ZSxcblx0XHRza2lwU2VnbWVudCxcblx0XHRza2lwQ29udGV4dCxcblx0XHRvdXRwdXREaXIsXG5cdH0gPSB3b3JrZXJEYXRhIGFzIElXb3JrZXJEYXRhO1xuXG5cdGZ1bmN0aW9uIF9oYW5kbGUobGlzdDogc3RyaW5nW10pXG5cdHtcblx0XHRyZXR1cm4gQmx1ZWJpcmQucmVzb2x2ZShsaXN0KVxuXHRcdFx0LnRoZW4oYXN5bmMgKGxpc3QpID0+XG5cdFx0XHR7XG5cblx0XHRcdFx0Ly9jb25zdCBjbjJ0d19taW4gPSBhd2FpdCBpbXBvcnQoJy4uLy4uL2xpYi9jbjJ0d19taW4nKS50aGVuKHYgPT4gdi5kZWZhdWx0KTtcblx0XHRcdFx0Y29uc3QgZG9TZWdtZW50ID0gYXdhaXQgaW1wb3J0KCcuLi8uLi9saWIvZG9TZWdtZW50JykudGhlbih2ID0+IHYuZGVmYXVsdCk7XG5cdFx0XHRcdGNvbnN0IGhhbmRsZUNvbnRleHQgPSBhd2FpdCBpbXBvcnQoJy4uLy4uL2xpYi9kb0xheW91dCcpLnRoZW4odiA9PiB2LmRlZmF1bHQpO1xuXG5cdFx0XHRcdHJldHVybiBCbHVlYmlyZC5yZXNvbHZlKGxpc3QpXG5cdFx0XHRcdFx0LmVhY2goYXN5bmMgKGZpbGUsIGluZGV4LCBsZW5ndGgpID0+XG5cdFx0XHRcdFx0e1xuXG5cdFx0XHRcdFx0XHRjb25zb2xlLmRlYnVnKGAke1N0cmluZyhpbmRleCkucGFkU3RhcnQoNCwgJzAnKX0vJHtTdHJpbmcobGVuZ3RoKS5wYWRTdGFydCg0LCAnMCcpfWAsIHJlbGF0aXZlKG91dHB1dERpciwgZmlsZSkpO1xuXG5cdFx0XHRcdFx0XHRsZXQgdGV4dCA9IGF3YWl0IHJlYWRGaWxlKGZpbGUsICd1dGY4Jyk7XG5cblx0XHRcdFx0XHRcdGlmICghKHNraXBTZWdtZW50ICYmIHNraXBTZWdtZW50LmluY2x1ZGVzKGZpbGUpKSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0dGV4dCA9IGF3YWl0IGRvU2VnbWVudCh0ZXh0KTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKCEoc2tpcENvbnRleHQgJiYgc2tpcENvbnRleHQuaW5jbHVkZXMoZmlsZSkpKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHR0ZXh0ID0gYXdhaXQgaGFuZGxlQ29udGV4dCh0ZXh0KTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0dGV4dCA9IGF3YWl0IGNuMnR3X21pbih0ZXh0KTtcblxuXHRcdFx0XHRcdFx0YXdhaXQgd3JpdGVGaWxlKGZpbGUsIHRleHQpO1xuXG5cdFx0XHRcdFx0XHRwYXJlbnRQb3J0LnBvc3RNZXNzYWdlKHtcblx0XHRcdFx0XHRcdFx0aW5kZXgsXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdDtcblxuXHRcdFx0fSlcblx0XHRcdDtcblxuXHR9XG5cblx0X2hhbmRsZSh2YWx1ZSlcbn1cbiJdfQ==