import {
	enableForceSave,
	loadDeepEntryListMapFromMixin,
	_saveDeepEntryListMapToServer,
	_saveDeepEntryListMapToFile,
	loadDeepEntryListMapFromFile,
	deepEntryListMap, enableOverwriteServer,
} from '../../lib/ipfs/mfs/deepEntryListMap';

export default loadDeepEntryListMapFromFile()
	.tap(b => console.log(deepEntryListMap.size))
	.tap(enableForceSave)
	.tap(enableOverwriteServer)
	.tap(_saveDeepEntryListMapToServer)
	.tap(b => console.log(deepEntryListMap.size))
	.tap(enableForceSave)
	.tap(_saveDeepEntryListMapToFile)
	.tap(b => console.log(deepEntryListMap.size))
	.delay(30 * 1000)
	.tap(b => process.exit())
;
