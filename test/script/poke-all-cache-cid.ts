import {
	deepEntryListMap,
	loadDeepEntryListMapFromFile,
	loadDeepEntryListMapFromMixin,
} from "../../lib/ipfs/mfs/deepEntryListMap";
import pokeAll, { reportPokeAllSettledResult } from '../../lib/ipfs/pokeAll';

export default loadDeepEntryListMapFromMixin()
	.then(deepEntryListMap => [...deepEntryListMap])
	.map(([path, cid], index, length) =>
	{
		let label = `${index.toString().padStart(5, '0')}／${length.toString().padStart(5, '0')}`

		return pokeAll(cid, null, {
			timeout: 10 * 1000,
		}, label, path)
			.tap(ls => reportPokeAllSettledResult(ls, label, path))
			.catchReturn(null as null)
	}, {
		concurrency: 5,
	})
;
