import {
	deepEntryListMap, fixDeepEntryListMap,
	loadDeepEntryListMapFromFile,
	loadDeepEntryListMapFromMixin, loadDeepEntryListMapFromServer, mergeDeepEntryListMap, pathDeepEntryListMapJson,
} from "../../lib/ipfs/mfs/deepEntryListMap";
import pokeAll, { reportPokeAllSettledResult } from '../../lib/ipfs/pokeAll';
import { raceFetchAll, raceFetchServerList } from '../../lib/util/raceFetchServerList';
import { array_unique_overwrite } from 'array-hyper-unique';
import Bluebird from 'bluebird';
import { EventEmitter } from 'events';

let oldSet = new Set();

export default Bluebird.resolve()
	.then(async () =>
	{
		let ls: [string, string][] = [];

		EventEmitter.defaultMaxListeners = 50;
		process.setMaxListeners(50);

		await loadDeepEntryListMapFromFile().then(m => ls.push(...m));

		console.debug(`loadDeepEntryListMapFromFile`, ls.length);

		await _json();

		await loadDeepEntryListMapFromServer().then(m => ls.push(...m));

		console.debug(`loadDeepEntryListMapFromServer`, ls.length);

		await _json();

		async function _json()
		{
			let json_path = deepEntryListMap.get(pathDeepEntryListMapJson());

			if (json_path?.length && !oldSet.has(json_path))
			{
				await raceFetchAll(raceFetchServerList(null, json_path), 60 * 1000)
					.then(buf => JSON.parse(String(buf) as string) as [string, string][])
					.tap(row =>
					{
						if (!row.length)
						{
							const e = new TypeError(`deepEntryListMap data is broken`);
							// @ts-ignore
							e.data = row;
							return Promise.reject(e)
						}
					})
					.tap((map) =>
					{
						let tmp = new Map<string, string>();
						mergeDeepEntryListMap(map, tmp);
						fixDeepEntryListMap(tmp);

						ls.push(...tmp);

						console.debug(pathDeepEntryListMapJson(), json_path, ls.length);

					})
					.catchReturn(null as null)
					.finally(() => deepEntryListMap.delete(pathDeepEntryListMapJson()))
				;
			}

			oldSet.add(json_path);
		}

		ls = array_unique_overwrite(ls);

		console.debug(`array_unique_overwrite`, ls.length);

		return ls
	})
	.each(([path, cid], index, length) =>
	{
		let label = `${index.toString().padStart(5, '0')}／${length.toString().padStart(5, '0')}`

		return pokeAll(cid, null, {
			timeout: 10 * 1000,
		}, label, path)
			.tap(ls => reportPokeAllSettledResult(ls, label, path))
			.catchReturn(null as null)
	})
;
