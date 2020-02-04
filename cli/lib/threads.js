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
            console.debug(`本次將處理 ${list.length} 個檔案`);
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
                console.warn(`處理超時...再執行一次，本次已處理 ${values.length} 檔案`);
                resolve(values);
            }, 60 * 1000);
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
                .each(async (file, index, length) => {
                console.log(`${String(index).padStart(4, '0')}/${String(length).padStart(4, '0')}`, path_1.relative(outputDir, file));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhyZWFkcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRocmVhZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBSUEsbURBRXdCO0FBQ3hCLDhFQUFzRDtBQUN0RCwrQkFBNkQ7QUFDN0QsMkNBQTZDO0FBRTdDLHVDQUE2RDtBQUM3RCx3REFBZ0M7QUFFaEMsbURBQWdEO0FBRWhELDJEQUFrRDtBQUVsRCxNQUFNLFdBQVcsR0FBRyxTQUFTLFdBQVcsQ0FBQyxFQUFtQixFQUFFLEtBQWEsRUFBRSxTQUFTLEdBQUcsa0JBQVU7SUFFbEcsT0FBTyxJQUFJLENBQUM7QUFDYixDQUFDLENBQUM7QUFFRixrQkFBZSxXQUFXLENBQUE7QUFXMUIsSUFBSSw2QkFBWSxFQUNoQjtJQUNDLE1BQU0sUUFBUSxHQUFHLENBQUMsR0FBRyxFQUFFO1FBRXRCLElBQUksQ0FBQyxHQUFHLFlBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMxQixPQUFPLFdBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUE7SUFDbkMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUVMLFNBQVMsV0FBVyxDQUFDLEVBQW1CLEVBQUUsS0FBYSxFQUFFLFNBQWlCO1FBRXpFLE9BQU8sS0FBSyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDO2FBQ2hDLElBQUksQ0FBQyxPQUFPLENBQUM7YUFDYixJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQy9CLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FDakI7SUFDRixDQUFDO0lBRUQsU0FBUyxLQUFLLENBQUMsRUFBbUIsRUFBRSxLQUFhLEVBQUUsU0FBUztRQUUzRCxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU1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QUFHLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLGVBQVEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFFL0csSUFBSSxJQUFJLEdBQUcsTUFBTSxtQkFBUSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFFeEMsSUFBSSxDQUFDLENBQUMsV0FBVyxJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsRUFDaEQ7b0JBQ0MsSUFBSSxHQUFHLE1BQU0sU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUM3QjtnQkFFRCxJQUFJLENBQUMsQ0FBQyxXQUFXLElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUNoRDtvQkFDQyxJQUFJLEdBQUcsTUFBTSxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ2pDO2dCQUVELElBQUksR0FBRyxNQUFNLHFCQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRTdCLE1BQU0sb0JBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBRTVCLDJCQUFVLENBQUMsV0FBVyxDQUFDO29CQUN0QixLQUFLO2lCQUNMLENBQUMsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUNEO1FBRUgsQ0FBQyxDQUFDLENBQ0Q7SUFFSCxDQUFDO0lBRUQsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO0NBQ2QiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzEvMzEuXG4gKi9cblxuaW1wb3J0IHtcblx0V29ya2VyLCBpc01haW5UaHJlYWQsIHBhcmVudFBvcnQsIHdvcmtlckRhdGEsXG59IGZyb20gJ3dvcmtlcl90aHJlYWRzJztcbmltcG9ydCBGYXN0R2xvYiBmcm9tICdAYmx1ZWxvdmVycy9mYXN0LWdsb2IvYmx1ZWJpcmQnO1xuaW1wb3J0IHsgam9pbiwgcGFyc2UsIG5vcm1hbGl6ZSwgc2VwLCByZWxhdGl2ZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBPVVRQVVRfRElSIH0gZnJvbSAnLi4vLi4vbGliL2NvbnN0JztcbmltcG9ydCB7IEVudW1Ob3ZlbFNpdGVMaXN0IH0gZnJvbSAnbm92ZWwtZG93bmxvYWRlci9zcmMvYWxsL2NvbnN0JztcbmltcG9ydCB7IHJlYWRGaWxlLCB3cml0ZUZpbGUsIHJlbmFtZSwgbW92ZSB9IGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgZG9TZWdtZW50IGZyb20gJy4uLy4uL2xpYi9kb1NlZ21lbnQnO1xuaW1wb3J0IHsgY24ydHdfbWluIH0gZnJvbSAnLi4vLi4vbGliL2NuMnR3X21pbic7XG5pbXBvcnQgaGFuZGxlQ29udGV4dCBmcm9tICcuLi8uLi9saWIvZG9MYXlvdXQnO1xuaW1wb3J0IHsgYXJyYXlfdW5pcXVlIH0gZnJvbSAnYXJyYXktaHlwZXItdW5pcXVlJztcblxuY29uc3QgaGFuZGxlQXN5bmMgPSBmdW5jdGlvbiBoYW5kbGVBc3luYyhpZDogc3RyaW5nIHwgbnVtYmVyLCBJREtFWTogc3RyaW5nLCBvdXRwdXREaXIgPSBPVVRQVVRfRElSKTogQmx1ZWJpcmQ8Ym9vbGVhbj5cbntcblx0cmV0dXJuIG51bGw7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBoYW5kbGVBc3luY1xuXG50eXBlIElXb3JrZXJEYXRhID0ge1xuXHRpZD86IHN0cmluZztcblx0Zm4/OiBuZXZlcjtcblx0dmFsdWU6IHN0cmluZ1tdXG5cdHNraXBTZWdtZW50OiBzdHJpbmdbXSxcblx0c2tpcENvbnRleHQ6IHN0cmluZ1tdLFxuXHRvdXRwdXREaXI6IHN0cmluZyxcbn1cblxuaWYgKGlzTWFpblRocmVhZClcbntcblx0Y29uc3QgX193b3JrZXIgPSAoKCkgPT5cblx0e1xuXHRcdGxldCBwID0gcGFyc2UoX19maWxlbmFtZSk7XG5cdFx0cmV0dXJuIGpvaW4ocC5kaXIsIHAubmFtZSArICcuanMnKVxuXHR9KSgpO1xuXG5cdGZ1bmN0aW9uIGhhbmRsZUFzeW5jKGlkOiBzdHJpbmcgfCBudW1iZXIsIElES0VZOiBzdHJpbmcsIG91dHB1dERpcjogc3RyaW5nKTogQmx1ZWJpcmQ8Ym9vbGVhbj5cblx0e1xuXHRcdHJldHVybiBfbGlzdChpZCwgSURLRVksIG91dHB1dERpcilcblx0XHRcdC50aGVuKF9yZW5hbWUpXG5cdFx0XHQudGhlbih2ID0+IF9zcGxpdCh2LCBvdXRwdXREaXIpKVxuXHRcdFx0LnRoZW5SZXR1cm4odHJ1ZSlcblx0XHQ7XG5cdH1cblxuXHRmdW5jdGlvbiBfbGlzdChpZDogc3RyaW5nIHwgbnVtYmVyLCBJREtFWTogc3RyaW5nLCBvdXRwdXREaXIpXG5cdHtcblx0XHRJREtFWSA9IElES0VZLnNwbGl0KCcvJylbMF07XG5cblx0XHRsZXQgY3dkID0gam9pbihvdXRwdXREaXIsIElES0VZLCBTdHJpbmcoaWQpKTtcblxuXHRcdHJldHVybiBGYXN0R2xvYihbXG5cdFx0XHQnKiovKi50eHQnLFxuXHRcdF0sIHtcblx0XHRcdGN3ZCxcblx0XHRcdGFic29sdXRlOiB0cnVlLFxuXHRcdH0pXG5cdFx0XHQudGFwKGxpc3QgPT5cblx0XHRcdHtcblx0XHRcdFx0aWYgKGxpc3QubGVuZ3RoID09PSAwKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGBjYW4ndCBmb3VuZCBhbnkgZmlsZSwgJHt7XG5cdFx0XHRcdFx0XHRzaXRlSUQ6IElES0VZLFxuXHRcdFx0XHRcdFx0aWQsXG5cdFx0XHRcdFx0XHRjd2QsXG5cdFx0XHRcdFx0fX1gKVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc29sZS5kZWJ1Zyhg5pys5qyh5bCH6JmV55CGICR7bGlzdC5sZW5ndGh9IOWAi+aqlOahiGApXG5cdFx0XHR9KVxuXHRcdFx0O1xuXHR9XG5cblx0YXN5bmMgZnVuY3Rpb24gX3JlbmFtZShsaXN0OiBzdHJpbmdbXSlcblx0e1xuXHRcdHJldHVybiBCbHVlYmlyZC5yZXNvbHZlKGxpc3QpXG5cdFx0XHQubWFwKGZpbGUgPT4ge1xuXHRcdFx0XHRmaWxlID0gbm9ybWFsaXplKGZpbGUpO1xuXHRcdFx0XHRsZXQgcCA9IHBhcnNlKGZpbGUpO1xuXHRcdFx0XHRsZXQgZmlsZV9uZXcgPSBqb2luKHAuZGlyLCBjbjJ0d19taW4ocC5uYW1lKSArIHAuZXh0KTtcblx0XHRcdFx0cmV0dXJuIG1vdmUoZmlsZSwgZmlsZV9uZXcsIHtcblx0XHRcdFx0XHRvdmVyd3JpdGU6IHRydWUsXG5cdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnRoZW4odmFsdWUgPT4gZmlsZV9uZXcpXG5cdFx0XHRcdFx0LmNhdGNoKGUgPT4gZmlsZSlcblx0XHRcdFx0O1xuXHRcdFx0fSlcblx0XHRcdC50aGVuKHYgPT4gYXJyYXlfdW5pcXVlKHYpKVxuXHRcdDtcblx0fVxuXG5cdGFzeW5jIGZ1bmN0aW9uIF9zcGxpdChsaXN0OiBzdHJpbmdbXSwgb3V0cHV0RGlyOiBzdHJpbmcsIHNraXBTZWdtZW50OiBzdHJpbmdbXSA9IFtdLCBza2lwQ29udGV4dDogc3RyaW5nW10gPSBbXSk6IFByb21pc2U8c3RyaW5nW10+XG5cdHtcblx0XHRpZiAoIWxpc3QubGVuZ3RoKVxuXHRcdHtcblx0XHRcdHJldHVybiBsaXN0O1xuXHRcdH1cblxuXHRcdGxldCBpZHM6IG51bWJlcltdID0gYXdhaXQgX3Byb2Nlc3M8eyBpbmRleDogbnVtYmVyIH1bXT4oe1xuXHRcdFx0XHR2YWx1ZTogbGlzdCxcblx0XHRcdFx0c2tpcFNlZ21lbnQsXG5cdFx0XHRza2lwQ29udGV4dCxcblx0XHRcdG91dHB1dERpcixcblx0XHRcdH0pXG5cdFx0XHQubWFwKHYgPT4gdi5pbmRleClcblx0XHQ7XG5cblx0XHRpZiAoaWRzLmxlbmd0aCB8fCBza2lwQ29udGV4dCAmJiBza2lwQ29udGV4dC5sZW5ndGgpXG5cdFx0e1xuXHRcdFx0bGlzdCA9IGxpc3QuZmlsdGVyKCh2YWx1ZSwgaW5kZXgpID0+IHtcblxuXHRcdFx0XHRpZiAoc2tpcENvbnRleHQgJiYgc2tpcENvbnRleHQuaW5jbHVkZXModmFsdWUpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICFpZHMuaW5jbHVkZXMoaW5kZXgpXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRpZiAoc2tpcFNlZ21lbnQgJiYgc2tpcFNlZ21lbnQubGVuZ3RoICYmIGxpc3QubGVuZ3RoKVxuXHRcdHtcblx0XHRcdGxpc3QuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XG5cblx0XHRcdFx0aWYgKHNraXBTZWdtZW50LmluY2x1ZGVzKHZhbHVlKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHNraXBDb250ZXh0ID0gc2tpcENvbnRleHQgfHwgW107XG5cdFx0XHRcdFx0c2tpcENvbnRleHQucHVzaCh2YWx1ZSlcblx0XHRcdFx0fVxuXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRpZiAoIWlkcy5sZW5ndGggJiYgbGlzdC5sZW5ndGgpXG5cdFx0e1xuXHRcdFx0c2tpcFNlZ21lbnQgPSBza2lwU2VnbWVudCB8fCBbXTtcblx0XHRcdHNraXBTZWdtZW50LnB1c2gobGlzdFswXSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIF9zcGxpdChsaXN0LCBvdXRwdXREaXIsIHNraXBTZWdtZW50LCBza2lwQ29udGV4dClcblx0fVxuXG5cdGZ1bmN0aW9uIF9wcm9jZXNzPFQgZXh0ZW5kcyBhbnlbXT4od29ya2VyRGF0YTogSVdvcmtlckRhdGEpOiBCbHVlYmlyZDxUPlxuXHR7XG5cdFx0cmV0dXJuIG5ldyBCbHVlYmlyZDxUPigocmVzb2x2ZSwgcmVqZWN0KSA9PlxuXHRcdHtcblx0XHRcdGNvbnN0IHdvcmtlciA9IG5ldyBXb3JrZXIoX193b3JrZXIsIHtcblx0XHRcdFx0d29ya2VyRGF0YSxcblx0XHRcdH0pO1xuXG5cdFx0XHRjb25zdCB2YWx1ZXMgPSBbXSBhcyBUO1xuXG5cdFx0XHRsZXQgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcblxuXHRcdFx0XHRjb25zb2xlLndhcm4oYOiZleeQhui2heaZgi4uLuWGjeWft+ihjOS4gOasoe+8jOacrOasoeW3suiZleeQhiAke3ZhbHVlcy5sZW5ndGh9IOaqlOahiGApO1xuXG5cdFx0XHRcdHJlc29sdmUodmFsdWVzKVxuXHRcdFx0fSwgNjAgKiAxMDAwKTtcblxuXHRcdFx0d29ya2VyLm9uKCdtZXNzYWdlJywgKHYpID0+XG5cdFx0XHR7XG5cdFx0XHRcdHZhbHVlcy5wdXNoKHYpO1xuXHRcdFx0fSk7XG5cdFx0XHR3b3JrZXIub24oJ2Vycm9yJywgKGUpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGNsZWFyVGltZW91dCh0aW1lcik7XG5cdFx0XHRcdGlmIChlKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihgV29ya2VyIGVycm9yYCwgZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRyZXNvbHZlKHZhbHVlcyk7XG5cdFx0XHR9KTtcblx0XHRcdHdvcmtlci5vbignZXhpdCcsIChjb2RlKSA9PlxuXHRcdFx0e1xuXHRcdFx0XHRjbGVhclRpbWVvdXQodGltZXIpO1xuXHRcdFx0XHRpZiAoY29kZSAhPT0gMClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoYFdvcmtlciBzdG9wcGVkIHdpdGggZXhpdCBjb2RlICR7Y29kZX1gKVxuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0cmVzb2x2ZSh2YWx1ZXMpO1xuXHRcdFx0fSk7XG5cblx0XHR9KTtcblx0fVxuXG5cdGV4cG9ydHMuZGVmYXVsdCA9IGhhbmRsZUFzeW5jXG59XG5lbHNlXG57XG5cdGxldCB7XG5cdFx0Zm4sXG5cdFx0dmFsdWUsXG5cdFx0c2tpcFNlZ21lbnQsXG5cdFx0c2tpcENvbnRleHQsXG5cdFx0b3V0cHV0RGlyLFxuXHR9ID0gd29ya2VyRGF0YSBhcyBJV29ya2VyRGF0YTtcblxuXHRmdW5jdGlvbiBfaGFuZGxlKGxpc3Q6IHN0cmluZ1tdKVxuXHR7XG5cdFx0cmV0dXJuIEJsdWViaXJkLnJlc29sdmUobGlzdClcblx0XHRcdC50aGVuKGFzeW5jIChsaXN0KSA9PlxuXHRcdFx0e1xuXG5cdFx0XHRcdC8vY29uc3QgY24ydHdfbWluID0gYXdhaXQgaW1wb3J0KCcuLi8uLi9saWIvY24ydHdfbWluJykudGhlbih2ID0+IHYuZGVmYXVsdCk7XG5cdFx0XHRcdGNvbnN0IGRvU2VnbWVudCA9IGF3YWl0IGltcG9ydCgnLi4vLi4vbGliL2RvU2VnbWVudCcpLnRoZW4odiA9PiB2LmRlZmF1bHQpO1xuXHRcdFx0XHRjb25zdCBoYW5kbGVDb250ZXh0ID0gYXdhaXQgaW1wb3J0KCcuLi8uLi9saWIvZG9MYXlvdXQnKS50aGVuKHYgPT4gdi5kZWZhdWx0KTtcblxuXHRcdFx0XHRyZXR1cm4gQmx1ZWJpcmQucmVzb2x2ZShsaXN0KVxuXHRcdFx0XHRcdC5lYWNoKGFzeW5jIChmaWxlLCBpbmRleCwgbGVuZ3RoKSA9PlxuXHRcdFx0XHRcdHtcblxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYCR7U3RyaW5nKGluZGV4KS5wYWRTdGFydCg0LCAnMCcpfS8ke1N0cmluZyhsZW5ndGgpLnBhZFN0YXJ0KDQsICcwJyl9YCwgcmVsYXRpdmUob3V0cHV0RGlyLCBmaWxlKSk7XG5cblx0XHRcdFx0XHRcdGxldCB0ZXh0ID0gYXdhaXQgcmVhZEZpbGUoZmlsZSwgJ3V0ZjgnKTtcblxuXHRcdFx0XHRcdFx0aWYgKCEoc2tpcFNlZ21lbnQgJiYgc2tpcFNlZ21lbnQuaW5jbHVkZXMoZmlsZSkpKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHR0ZXh0ID0gYXdhaXQgZG9TZWdtZW50KHRleHQpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAoIShza2lwQ29udGV4dCAmJiBza2lwQ29udGV4dC5pbmNsdWRlcyhmaWxlKSkpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHRleHQgPSBhd2FpdCBoYW5kbGVDb250ZXh0KHRleHQpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR0ZXh0ID0gYXdhaXQgY24ydHdfbWluKHRleHQpO1xuXG5cdFx0XHRcdFx0XHRhd2FpdCB3cml0ZUZpbGUoZmlsZSwgdGV4dCk7XG5cblx0XHRcdFx0XHRcdHBhcmVudFBvcnQucG9zdE1lc3NhZ2Uoe1xuXHRcdFx0XHRcdFx0XHRpbmRleCxcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0O1xuXG5cdFx0XHR9KVxuXHRcdFx0O1xuXG5cdH1cblxuXHRfaGFuZGxlKHZhbHVlKVxufVxuIl19