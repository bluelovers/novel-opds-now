import { outputJSON, outputJSONSync, readJSON } from 'fs-extra';
import { join } from 'path';
import { __root } from '../../const';
import Bluebird from 'bluebird';
import CID from 'cids';
import { StatResult } from 'ipfs-core-types/src/files';
import { debounce, throttle } from 'lodash';
import processExit from '../../util/processExit';
import { isMatch } from 'micromatch';
import { putRawRecord, getRawRecord } from '@demonovel/db-api';

export const deepEntryListMap = new Map<string, string>();
export const newEntryListMap = new Map<string, string>();

let _notOK = true;

const file = join(__root, 'test', 'data', 'novel-opds-now.cids.json');

export function appendDeepEntryListMapByStatResult(path: string, entry: StatResult)
{
	return appendDeepEntryListMap(path, entry.cid, entry.type === 'directory')
}

export function appendDeepEntryListMap(path: string, cid: string | CID, isDirectory?: boolean)
{
	if (isDirectory && path[path.length - 1] !== '/')
	{
		path += '/';
	}

	if (path[0] !== '/')
	{
		path = '/' + path;
	}

	if (!/^\/novel-opds-now\//.test(path) || !cid || !isDirectory && isMatch(path, ['*.{jpg,txt}', '**/*.{jpg,txt}']))
	{
		return false;
	}

	cid = cid.toString();

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
	return getRawRecord<[string, string][]>({
			rootKey: 'ipfs',
			dataKey: 'deepEntryListMap',
			fetchOptions: {
				timeout: 60 * 1000,
			},
		},
	)
		.tap((raw) =>
		{
			mergeDeepEntryListMap(raw.data, deepEntryListMap);
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
		.then(() =>
		{
			if (_notOK === false || newEntryListMap.size)
			{
				_notOK = false;

				mergeDeepEntryListMap(newEntryListMap, deepEntryListMap);

				if (!deepEntryListMap.size)
				{
					return;
				}

				newEntryListMap.clear();

				return putRawRecord<[string, string][]>({
						rootKey: 'ipfs',
						dataKey: 'deepEntryListMap',
						data: [...deepEntryListMap, ...newEntryListMap],
					},
				)
			}
		})
		.catchReturn(null)
		.thenReturn(deepEntryListMap)
}

export function enableForceSave()
{
	_notOK = false;
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
			return outputJSONSync(file, [...ls], {
				spaces: 2,
			})
		})
		.catchReturn(null as null)
}

export const saveDeepEntryListMapToFile = debounce(_saveDeepEntryListMapToFile, 30 * 60 * 1000);

export const saveDeepEntryListMapToServer = debounce(_saveDeepEntryListMapToServer, 20 * 60 * 1000);

export function saveDeepEntryListMapToMixin()
{
	return Bluebird.all([
		saveDeepEntryListMapToFile,
		saveDeepEntryListMapToServer,
	])
}

export function mergeDeepEntryListMap(input: Map<string, string> | [string, string][], target: Map<string, string>)
{
	if (input)
	{
		for (const [path, cid] of (Array.isArray(input) ? input.values() : input.entries()))
		{
			target.set(path, cid);
		}
	}

	return target;
}
