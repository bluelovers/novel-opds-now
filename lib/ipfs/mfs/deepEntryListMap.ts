import { outputFile, outputFileSync, outputJSON, outputJSONSync, readJSON } from 'fs-extra';
import { join } from 'path';
import { __root } from '../../const';
import Bluebird from 'bluebird';
import { StatResult } from 'ipfs-core-types/src/files';
import { debounce, sortBy, throttle } from 'lodash';
import processExit from '../../util/processExit';
import { isMatch } from 'micromatch';
import { putRawRecord, getRawRecord, getFileRecord, putFileRecord } from '@demonovel/db-api';
import fetch from '../../fetch';
import { publishToIPFSRace } from 'fetch-ipfs/put';
import { filterList } from 'ipfs-server-list';
import { getIPFSFromCache, useIPFSFromCache } from '../use';
import { IIPFSFileApiAddReturnEntry } from 'ipfs-types/lib/ipfs/file';
import toURL, { toLink } from 'to-ipfs-url';
import { pokeAll } from '../pokeAll';
import console from 'debug-color2/logger';
import { ipfsMainPeerID } from '../../dev/admin';
import { raceFetchAll, raceFetchServerList } from '../../util/raceFetchServerList';
import { cidToString } from '@lazy-ipfs/cid-to-string';
import { isSameCID } from '@lazy-ipfs/is-same-cid';
import { ICIDValue } from '@lazy-ipfs/detect-cid-lib';
import { _ipfsFilesCopyCID } from './_ipfsFilesCopy';
import { toCID } from '@lazy-ipfs/to-cid';
import { getPokeAllSettledResultWithHref } from 'poke-ipfs/lib/util/filterPokeAllSettledResult';
import { array_unique_overwrite } from 'array-hyper-unique';
import { allSettled } from 'bluebird-allsettled';
import { CID } from "multiformats/cid";

export const deepEntryListMap = new Map<string, string>();
export const newEntryListMap = new Map<string, string>();

let _notOK = true;
let _overwriteServer = false;

const filename = 'novel-opds-now.cids.json' as const;
const file = join(__root, 'test', 'data', filename);

const msf_file = `/.cache/${filename}` as const;

const rootKey = 'ipfs' as const;
const dataKey = 'deepEntryListMap' as const;

export function pathDeepEntryListMapJson()
{
	return msf_file
}

export function appendDeepEntryListMapByStatResult(path: string, entry: StatResult)
{
	return appendDeepEntryListMap(path, entry.cid as any, entry.type === 'directory')
}

export function _handlePath(path: string, isDirectory?: boolean)
{
	if (isDirectory && path[path.length - 1] !== '/')
	{
		path += '/';
	}

	if (path[0] !== '/')
	{
		path = '/' + path;
	}

	return path;
}

export function appendDeepEntryListMap(path: string,
	cid: ICIDValue | StatResult["cid"],
	isDirectory?: boolean,
	forceAdd?: boolean,
)
{
	path = _handlePath(path, isDirectory);

	if (forceAdd || /^\/\.cache\//.test(path))
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
		_setDeepEntryListMapBoth(path, cid);

		saveDeepEntryListMapToFile();
	}

	return true;
}

export function _setDeepEntryListMapBoth(path: string, cid: ICIDValue | StatResult["cid"], isDirectory?: boolean)
{
	path = _handlePath(path, isDirectory);

	cid = cid.toString();

	newEntryListMap.set(path, cid);
	deepEntryListMap.set(path, cid);
}

export function _getDeepEntryListMapBoth(path: string, isDirectory?: boolean)
{
	path = _handlePath(path, isDirectory);

	return newEntryListMap.get(path) || deepEntryListMap.get(path);
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

				//newEntryListMap.clear();

				const ipfs = await getIPFSFromCache();

				const peerID = await ipfs?.id().then(m => m.id).catch(e => null as null);

				if (ipfs && ipfsMainPeerID(peerID))
				{
					let stat = await ipfs.files.stat(`/novel-opds-now/`, {
						hash: true,
					}).catch(e => null as null);

					if (stat?.cid)
					{
						await _setDeepEntryListMapBoth(`/novel-opds-now/`, stat.cid as any, true);
						await mergeDeepEntryListMap(newEntryListMap, deepEntryListMap);

						pokeAll(cidToString(stat.cid), ipfs, {
							filename,
							hidden: true,
							timeout: 20 * 1000,
						});
					}
				}

				let { cid, content } = await _publishDeepEntryListMapToIPFS(ipfs, deepEntryListMap);

				pokeDeepEntryListMap(cid, peerID);

				if (ipfs)
				{
					if (ipfsMainPeerID(peerID))
					{
						let stat = await ipfs.files.stat(`/novel-opds-now/`, {
							hash: true,
						}).catch(e => null as null);

						if (stat?.cid)
						{
							await _setDeepEntryListMapBoth(`/novel-opds-now/`, stat.cid as any, true);

							pokeAll(cidToString(stat.cid), ipfs, {
								filename,
								hidden: true,
								timeout: 20 * 1000,
							});
						}
					}

					await _writeDeepEntryListMapToMfs(content);
				}

				await _backupDeepEntryListMap(cid, peerID);

				_setDeepEntryListMapBoth(pathDeepEntryListMapJson(), cid);

				return _putDeepEntryListMapToServer(ipfs, cid)
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

export function _writeDeepEntryListMapToMfs(content: string | [string, string][] | Map<string, string>)
{
	return getIPFSFromCache().then(ipfs =>
		{
			if (!ipfs)
			{
				return null;
			}

			if (typeof content !== 'string')
			{
				content = stringifyDeepEntryListMap(content)
			}

			return ipfs.files.write(pathDeepEntryListMapJson(), content, {
					timeout: 10 * 1000,
					parents: true,
					create: true,
				})
				.then(async () =>
				{
					let cid = await ipfs.files.stat(pathDeepEntryListMapJson(), {
						hash: true,
						timeout: 3000,
					}).then(m => m.cid);

					// @ts-ignore
					return _backupDeepEntryListMap(cid, await useIPFSFromCache().then(m => m?.ipfs?.peerId?.id));
				})
		})
		.catch(e => console.error(`_writeDeepEntryListMapToMfs`, e))
}

export async function _backupDeepEntryListMap(cid: ICIDValue, peerID?: string)
{
	if (1)
	{
		return;
	}

	const ipfs = await getIPFSFromCache();
	const timeout = 10 * 1000;

	if (typeof peerID === 'undefined')
	{
		peerID = await ipfs?.id({ timeout }).then(m => m.id).catch(e => null as null);
	}

	if (ipfsMainPeerID(peerID))
	{
		let old_cid = _getDeepEntryListMapBoth(pathDeepEntryListMapJson());

		if ((old_cid || cid) && !isSameCID(old_cid, cid))
		{
			let bak = pathDeepEntryListMapJson() + '.bak';
			let bak_cid = old_cid ?? cid;

			//await ipfs.files.rm(bak, { timeout }).catch(e => null);
			await _ipfsFilesCopyCID(ipfs, bak_cid, bak, {
				timeout,
				extraOptions: {
					overwrite: true,
				},
			}).catch(e => null);

			//await appendDeepEntryListMap(bak, bak_cid, false, true);
			_setDeepEntryListMapBoth(bak, bak_cid);
		}

		await ipfs.files.stat('/.cache', {
			hash: true,
			timeout,
		}).then(m =>
			{
				_setDeepEntryListMapBoth('/.cache', m.cid, true);
			})
			.catch(e => null as null)
		;

		//await appendDeepEntryListMap(pathDeepEntryListMapJson(), cid, false, true);
		_setDeepEntryListMapBoth(pathDeepEntryListMapJson(), cid);
	}
}

export function _pokeDeepEntryListMap(cid?: ICIDValue, peerID?: string)
{
	return Bluebird.resolve()
		.then(async () =>
		{
			const ipfs = await getIPFSFromCache();
			const timeout = 10 * 1000;

			if (typeof peerID === 'undefined')
			{
				peerID = await ipfs?.id({ timeout }).then(m => m.id).catch(e => null as null);
			}

			cid = cid || await ipfs.files.stat(pathDeepEntryListMapJson(), {
				hash: true,
				timeout,
			}).then(m => m.cid);

			if (!cid)
			{
				return;
			}

			await _backupDeepEntryListMap(cid, peerID);

			let ls = await Bluebird
				.map([
					pathDeepEntryListMapJson(),
					pathDeepEntryListMapJson() + '.bak',
					'/.cache/',
				], file =>
				{
					return ipfs.files.stat(pathDeepEntryListMapJson(), {
						hash: true,
						timeout,
					}).then(m => m.cid).catch(e => null);
				})
				.tap(ls =>
				{
					ls.unshift(toCID(cid))
				})
			;

			array_unique_overwrite(ls);

			return allSettled(ls.map((cid, index) =>
			{
				let p = pokeAll(cid, ipfs, {
					timeout: 20 * 1000,
					hidden: true,
				});

				if (index === 0)
				{
					p = p.tap(settledResults =>
					{
						let list = getPokeAllSettledResultWithHref(settledResults ?? [])

						if (list?.length)
						{
							console.info(`[IPFS]`, `pokeAll:end`, `結束於 ${list.length} ／ ${settledResults.length} 節點中請求分流`, dataKey, '\n' + list[list.length - 1])
						}
					})
				}

				return p
			}))
		})
		.catch(e =>
		{
			console.warn(`_pokeDeepEntryListMap`, cid, String(e))
		})
		;
}

export const pokeDeepEntryListMap = debounce(_pokeDeepEntryListMap, 30 * 1000);

export function stringifyDeepEntryListMap(deepEntryListMap: Map<string, string> | [string, string][])
{
	let ls = [...new Map<string, string>([...deepEntryListMap])];

	return JSON.stringify(sortBy(ls, '0'), null, 2)
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

			const content = stringifyDeepEntryListMap(ls);

			/**
			 * 改用 sync 版本來試圖解決不明原因造成檔案有可能變成空的
			 */
			outputFileSync(file, content);

			console.debug(`_saveDeepEntryListMapToFile`, ls.size)

			return _writeDeepEntryListMapToMfs(content);
		})
		.catchReturn(null as null)
		.thenReturn(deepEntryListMap)
		.finally(() =>
		{
			pokeDeepEntryListMap();
		})
}

export const saveDeepEntryListMapToFile = debounce(_saveDeepEntryListMapToFile, 10 * 60 * 1000);

export const saveDeepEntryListMapToServer = debounce(_saveDeepEntryListMapToServer, 5 * 60 * 1000);

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

export async function _publishDeepEntryListMapToIPFS(ipfs, deepEntryListMap: Map<string, string>)
{
	let cid: string;

	const content = stringifyDeepEntryListMap(deepEntryListMap);

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

	return {
		cid,
		content,
	}
}

export function _putDeepEntryListMapToServer(ipfs, cid: ICIDValue)
{
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
}
