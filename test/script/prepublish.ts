import {
	enableForceSave,
	loadDeepEntryListMapFromMixin,
	_saveDeepEntryListMapToServer,
	_saveDeepEntryListMapToFile,
	loadDeepEntryListMapFromFile,
	deepEntryListMap,
} from '../../lib/ipfs/mfs/deepEntryListMap';

export default loadDeepEntryListMapFromFile()
	.tap(b => console.log(deepEntryListMap.size))
	.tap(_saveDeepEntryListMapToServer)
	.tap(b => console.log(deepEntryListMap.size))
	.tap(enableForceSave)
	.tap(_saveDeepEntryListMapToFile)
	.tap(b => console.log(deepEntryListMap.size))
;
