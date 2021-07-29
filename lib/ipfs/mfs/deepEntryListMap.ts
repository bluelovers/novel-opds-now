import { outputJSON, outputJSONSync, readJSON } from 'fs-extra';
import { join } from 'path';
import { __root } from '../../const';
import Bluebird from 'bluebird';
import CID from 'cids';
import { StatResult } from 'ipfs-core-types/src/files';
import { debounce, throttle } from 'lodash';
import processExit from '../../util/processExit';
import { isMatch } from 'micromatch';
import { putRawRecord, getRawRecord, getFileRecord, putFileRecord } from '@demonovel/db-api';
import fetch from '../../fetch';
import { publishToIPFSRace } from 'fetch-ipfs/put';
import { filterList } from 'ipfs-server-list';
import { getIPFSFromCache } from '../use';
import { IIPFSFileApiAddReturnEntry } from 'ipfs-types/lib/ipfs/file';
import toURL, { toLink } from 'to-ipfs-url';
import { filterPokeAllSettledResult, pokeAll } from '../pokeAll';
import console from 'debug-color2/logger';
import { ipfsMainPeerID } from '../../dev/admin';
import raceFetchIPFS from 'fetch-ipfs/race';
import { raceFetchAll, raceFetchServerList } from '../../util/raceFetchServerList';
import { cidToString } from '@lazy-ipfs/cid-to-string';
import { isSameCID } from '@lazy-ipfs/is-same-cid';

export const deepEntryListMap = new Map<string, string>();
export const newEntryListMap = new Map<string, string>();

let _notOK = true;
let _overwriteServer = false;

const filename = 'novel-opds-now.cids.json' as const;
const file = join(__root, 'test', 'data', filename);

const rootKey = 'ipfs' as const;
const dataKey = 'deepEntryListMap' as const;

export function pathDeepEntryListMapJson()
{
	return `/novel-opds-now/${filename}` as const
}

export function appendDeepEntryListMapByStatResult(path: string, entry: StatResult)
{
	return appendDeepEntryListMap(path, entry.cid as any, entry.type === 'directory')
}

export function appendDeepEntryListMap(path: string,
	cid: string | CID | StatResult["cid"],
	isDirectory?: boolean,
	forceAdd?: boolean,
)
{
	if (isDirectory && path[path.length - 1] !== '/')
	{
		path += '/';
	}

	if (path[0] !== '/')
	{
		path = '/' + path;
	}

	if (forceAdd)
	{

	}
	else if (!/^\/novel-opds-now\//.test(path) || !cid || !isDirectory && isMatch(path, [
		'*.{jpg,txt}',
		'**/*.{jpg,txt}',
	]))
	{
		return false;
	}

	cid = cid.toString();
	//console.log(path, cid)

	if (deepEntryListMap.get(path) !== cid && newEntryListMap.get(path) !== cid)
	{
		newEntryListMap.set(path, cid);

		saveDeepEntryListMapToFile();
	}

	return true;
}

export function loadDeepEntryListMapFromFile()
{
	return Bluebird.resolve(readJSON(file))
		.then((map: [string, string][]) =>
		{
			mergeDeepEntryListMap(map, deepEntryListMap);
		})
		.catchReturn(null as null)
		.thenReturn(deepEntryListMap)
		;
}

export function loadDeepEntryListMapFromServer()
{
	return getFileRecord({
			siteID: rootKey,
			novelID: dataKey,
			fetchOptions: {
				timeout: 20 * 1000,
			},
		},
	)
		.then(async (raw) =>
		{
			return raceFetchAll(raceFetchServerList(null, raw.data.href), 60 * 1000)
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
		})
		.tap((map) =>
		{
			let tmp = new Map<string, string>();

			mergeDeepEntryListMap(map, tmp);
			mergeDeepEntryListMap(fixDeepEntryListMap(tmp), deepEntryListMap, _overwriteServer);

			fixDeepEntryListMap(deepEntryListMap)

		})
		.tapCatch(e =>
		{
			console.error(`loadDeepEntryListMapFromServer`, e)
		})
		.catchReturn(null as null)
		.thenReturn(deepEntryListMap)
}

export function loadDeepEntryListMapFromMixin()
{
	return loadDeepEntryListMapFromFile()
		.then(loadDeepEntryListMapFromServer)
		.thenReturn(deepEntryListMap)
}

export function _saveDeepEntryListMapToServer()
{
	return loadDeepEntryListMapFromServer()
		.then(async () =>
		{
			if (_notOK === false || newEntryListMap.size || _overwriteServer)
			{
				_notOK = false;

				await mergeDeepEntryListMap(newEntryListMap, deepEntryListMap);

				if (!deepEntryListMap.size)
				{
					return;
				}

				newEntryListMap.clear();

				deepEntryListMap.delete(pathDeepEntryListMapJson() + '/');

				const ipfs = await getIPFSFromCache();

				const peerID = await ipfs?.id().then(m => m.id).catch(e => null as null);

				if (ipfs && ipfsMainPeerID(peerID))
				{
					let stat = await ipfs.files.stat(`/novel-opds-now/`, {
						hash: true,
					}).catch(e => null as null);

					if (stat?.cid)
					{
						await appendDeepEntryListMap(`/novel-opds-now/`, stat.cid as any, true);
						await mergeDeepEntryListMap(newEntryListMap, deepEntryListMap);

						pokeAll(cidToString(stat.cid), ipfs, {
							filename,
							hidden: true,
							timeout: 20 * 1000,
						});
					}
				}

				deepEntryListMap.delete(pathDeepEntryListMapJson() + '/');

				const content = JSON.stringify([...deepEntryListMap], null, 2);

				let cid: string;

				await publishToIPFSRace({
					path: filename,
					content,
				}, [
					ipfs as any,
					...filterList('API'),
				], {
					addOptions: {
						pin: true,
					},
					timeout: 60 * 1000,
				})
					.each((settledResult, index) =>
					{
						// @ts-ignore
						let value: IIPFSFileApiAddReturnEntry[] = settledResult.value ?? settledResult.reason?.value;

						if (value?.length)
						{
							const { status } = settledResult;

							value.forEach((result, i) =>
							{
								cid = result.cid.toString();
							});
						}
					})
				;

				pokeAll(cid, ipfs, {
					//filename,
					//hidden: true,
					timeout: 20 * 1000,
				}).then(settledResults =>
				{
					if (settledResults?.length)
					{
						let list = filterPokeAllSettledResult(settledResults)

						console.info(`[IPFS]`, `pokeAll:end`, `結束於 ${list.length} ／ ${settledResults.length} 節點中請求分流`, dataKey, '\n' + list[list.length - 1]?.value?.href)
					}
				});

				if (ipfs)
				{
					await ipfs.files.write(pathDeepEntryListMapJson(), content, {
						timeout: 10 * 1000,
						create: true,
						parents: true,
					}).catch((e) => console.warn(`_saveDeepEntryListMapToServer`, `ipfs.files.write`, e))

					if (ipfsMainPeerID(peerID))
					{
						let stat = await ipfs.files.stat(`/novel-opds-now/`, {
							hash: true,
						}).catch(e => null as null);

						if (stat?.cid)
						{
							await appendDeepEntryListMap(`/novel-opds-now/`, stat.cid as any, true);

							pokeAll(cidToString(stat.cid), ipfs, {
								filename,
								hidden: true,
								timeout: 20 * 1000,
							});
						}
					}
				}

				if (ipfsMainPeerID(peerID))
				{

					let old_cid = deepEntryListMap.get(pathDeepEntryListMapJson());
					if ((old_cid || cid) && !isSameCID(old_cid, cid))
					{
						await appendDeepEntryListMap(pathDeepEntryListMapJson() + '.bak', old_cid ?? cid, false, true);
					}

				}

				await appendDeepEntryListMap(pathDeepEntryListMapJson(), cid as any, false, true);

				return putFileRecord({
						siteID: rootKey,
						novelID: dataKey,
						data: {
							timestamp: Date.now(),
							exists: true,
							filename,
							href: toLink(cid),
						},
					},
				)
					.tap(v =>
					{
						if (!v.error && v?.data?.href)
						{
							_overwriteServer = false;
						}
						console.debug(`_saveDeepEntryListMapToServer`, v.timestamp, v.error, '\n' + v?.data?.href)
					})
			}
		})
		.tapCatch(e => console.error(`_saveDeepEntryListMapToServer`, e))
		.catchReturn(null)
		.thenReturn(deepEntryListMap)
}

export function enableForceSave()
{
	_notOK = false;
}

export function enableOverwriteServer()
{
	_overwriteServer = true;
}

export function _saveDeepEntryListMapToFile()
{
	return Bluebird.resolve()
		.then<void>(() =>
		{
			if (_notOK === true && !newEntryListMap.size)
			{
				return;
			}

			_notOK = true;

			let ls = new Map([...deepEntryListMap, ...newEntryListMap]);

			if (!ls.size)
			{
				return;
			}

			/**
			 * 改用 sync 版本來試圖解決不明原因造成檔案有可能變成空的
			 */
			outputJSONSync(file, [...ls], {
				spaces: 2,
			});

			console.debug(`_saveDeepEntryListMapToFile`, ls.size)
		})
		.catchReturn(null as null)
		.thenReturn(deepEntryListMap)
}

export const saveDeepEntryListMapToFile = debounce(_saveDeepEntryListMapToFile, 30 * 60 * 1000);

export const saveDeepEntryListMapToServer = debounce(_saveDeepEntryListMapToServer, 20 * 60 * 1000);

export function saveDeepEntryListMapToMixin()
{
	return Bluebird.mapSeries([
		saveDeepEntryListMapToServer,
		saveDeepEntryListMapToFile,
	], (r) => r).thenReturn(deepEntryListMap)
}

export function mergeDeepEntryListMap(input: Map<string, string> | [string, string][],
	target: Map<string, string>,
	keepExists?: boolean,
)
{
	if (input)
	{
		if (keepExists)
		{
			for (const [path, cid] of (Array.isArray(input) ? input.values() : input.entries()))
			{
				if (target.get(path)?.length)
				{
					continue;
				}
				target.set(path, cid);
			}
		}
		else
		{
			for (const [path, cid] of (Array.isArray(input) ? input.values() : input.entries()))
			{
				target.set(path, cid);
			}
		}
	}

	return target;
}

export function fixDeepEntryListMap(deepEntryListMap: Map<string, string>)
{
	deepEntryListMap.forEach((value, key, map) =>
	{

		if (value.includes('novel-opds-now'))
		{
			deepEntryListMap.set(value, key);
			deepEntryListMap.delete(key);

			console.warn(`fixDeepEntryListMap`, value);
		}

	});

	return deepEntryListMap
}
