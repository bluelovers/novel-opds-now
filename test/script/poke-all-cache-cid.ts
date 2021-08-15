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
import { unionBy, uniqBy } from 'lodash';

let oldSet = new Set();
let oldSet2 = new Set();

export default Bluebird.resolve()
	.then(async () =>
	{
		let ls: [string, string][] = [];
		let ls2: [string, string][] = [];

		await loadDeepEntryListMapFromFile().then(m => ls.push(...m));

		console.debug(`loadDeepEntryListMapFromFile`, ls.length);

		await _always();

		await loadDeepEntryListMapFromServer().then(m => ls.push(...m));

		console.debug(`loadDeepEntryListMapFromServer`, ls.length);

		await _always();

		async function _always()
		{
			[
				'/.cache/',
				'/.cache/novel-opds-now.cids.json',
				'/.cache/novel-opds-now.cids.json.bak',
				'/novel-opds-now/',
				'/novel-opds-now/calibre/',
				'/novel-opds-now/demonovel/',
				'/novel-opds-now/dmzj/',
				'/novel-opds-now/esjzone/',
				'/novel-opds-now/masiro/',
				'/novel-opds-now/wenku8/',
			].forEach(json_path => {
				let cid = deepEntryListMap.get(json_path);

				if (cid?.length && !oldSet2.has(cid))
				{
					ls2.push([json_path, String(cid)]);
					oldSet2.add(cid);
				}
			});

			return Promise.all([
				_json(),
				_json(pathDeepEntryListMapJson() + '.bak'),
			]);
		}

		async function _json(json_path: string = pathDeepEntryListMapJson())
		{
			let cid = deepEntryListMap.get(json_path);

			if (cid?.length && !oldSet.has(cid))
			{
				ls2.push([json_path, String(cid)]);

				await raceFetchAll(raceFetchServerList(null, cid), 60 * 1000)
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

						console.debug(json_path, cid, ls.length);

					})
					.catchReturn(null as null)
					.finally(() => deepEntryListMap.delete(json_path))
				;
			}

			oldSet.add(cid);
		}

		ls = array_unique_overwrite(ls);

		console.debug(`array_unique_overwrite`, ls.length);

		ls = uniqBy(ls, '1');

		console.debug(`lodash.uniqBy`, ls.length);

		let day = new Date().getDay();

		let chunk_len = Math.ceil(ls.length / 7);

		let ls3 = ls.slice(day * chunk_len, ((day+1) * chunk_len) + 1);

		ls3.unshift(...ls2);

		return ls3
	})
	.map(([path, cid], index, length) =>
	{
		let label = `${index.toString().padStart(5, '0')}／${length.toString().padStart(5, '0')}`

		return pokeAll(cid, null, {
			timeout: 10 * 1000,
		}, label, path)
			.tap(ls => reportPokeAllSettledResult(ls, label, path))
			.catchReturn(null as null)
	}, {
		concurrency: 3,
	})
;
