import { outputJSON, outputJSONSync, readJSON } from 'fs-extra';
import { join } from 'path';
import { __root } from '../../const';
import Bluebird from 'bluebird';
import CID from 'cids';
import { StatResult } from 'ipfs-core-types/src/files';
import { debounce, throttle } from 'lodash';
import processExit from '../../util/processExit';
import { isMatch } from 'micromatch';

export const deepEntryListMap = new Map<string, string>();

const file = join(__root, 'test', 'novel-opds-now.cids.json');

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

	cid =  cid.toString();

	if (deepEntryListMap.get(path) !== cid)
	{
		deepEntryListMap.set(path, cid);

		saveDeepEntryListMapToFile();
	}

	return true;
}

export function loadDeepEntryListMapFromFile()
{
	return Bluebird.resolve(readJSON(file))
		.then((map: [string, string][]) =>
		{
			map.forEach(([path, cid]) =>
			{
				deepEntryListMap.set(path, cid);
			});
		})
		.catchReturn(null as null)
		.thenReturn(deepEntryListMap)
		;
}

export function _saveDeepEntryListMapToFile()
{
	return outputJSON(file, [...deepEntryListMap], {
		spaces: 2,
	}).catch(e => null)
}

export const saveDeepEntryListMapToFile = debounce(_saveDeepEntryListMapToFile, 30 * 60 * 1000);

processExit(_saveDeepEntryListMapToFile);
