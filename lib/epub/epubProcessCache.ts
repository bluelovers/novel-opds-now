import { join } from 'path';
import { OUTPUT_DIR } from '../const';
import { appendFile, createReadStream, createWriteStream, truncate } from 'fs-extra';
import { ICacheMapRow } from '../types';
import { parse, stringify } from 'ndjson';
import Bluebird from 'bluebird';
import { streamToPromise } from '../util/streamToPromise';
import { debounce, throttle } from 'lodash';
import console from 'debug-color2/logger';

export const __epubProcessCacheFile = join(OUTPUT_DIR, '.novel-cache-map.ndjson');
export const epubProcessCache = new Map<`${string}##${string}`, ICacheMapRow>();

export function epubProcessCacheKey(IDKEY: string, novel_id: string): `${string}##${string}`
export function epubProcessCacheKey(data: ICacheMapRow): `${string}##${string}`
export function epubProcessCacheKey(IDKEY: string | ICacheMapRow, novel_id?: string): `${string}##${string}`
{
	if (IDKEY !== null && typeof IDKEY === 'object')
	{
		return `${IDKEY.siteID}##${IDKEY.novel_id}` as const;
	}

	return `${IDKEY}##${novel_id}` as const;
}

export function getEpubProcessCacheRow(IDKEY: string, novel_id: string): ICacheMapRow
export function getEpubProcessCacheRow(data: ICacheMapRow): ICacheMapRow
export function getEpubProcessCacheRow(...argv): ICacheMapRow
{
	// @ts-ignore
	return epubProcessCache.get(epubProcessCacheKey(...argv))
}

export function removeEpubProcessCacheRow(IDKEY: string, novel_id: string): boolean
export function removeEpubProcessCacheRow(data: ICacheMapRow): boolean
export function removeEpubProcessCacheRow(...argv): boolean
{
	// @ts-ignore
	return epubProcessCache.delete(epubProcessCacheKey(...argv))
}

export function replaceEpubProcessCacheRow(IDKEY: string, novel_id: string, data: Partial<ICacheMapRow>): boolean
{
	// @ts-ignore
	return epubProcessCache.set(epubProcessCacheKey(...argv), _merge(IDKEY, novel_id, data))
}

export function _merge(IDKEY: string, novel_id: string, data: Partial<ICacheMapRow>)
{
	data = {
		siteID: IDKEY,
			novel_id,
	...data,
	};

	data.siteID = IDKEY;
	data.novel_id = novel_id;

	return data as ICacheMapRow
}

export const appendEpubProcessCache = Bluebird.method((IDKEY: string, novel_id: string, data: Partial<ICacheMapRow>) =>
{
	data = _merge(IDKEY, novel_id, data);
	data.timestamp = Date.now();

	let line = JSON.stringify(data);

	return appendFile(__epubProcessCacheFile, line + '\n')
});

/**
 * @private
 */
export function _saveEpubProcessCache()
{
	return Bluebird.resolve(truncate(__epubProcessCacheFile))
		.catchReturn(null)
		.then(() =>
		{
			const stream = stringify()
			stream.pipe(createWriteStream(__epubProcessCacheFile, {
				flags: 'a',
			}));

			for (const data of epubProcessCache.values())
			{
				stream.write(data)
			}

			stream.end()

			return streamToPromise(stream).tap(() => epubProcessCache.clear())
		})
		.catch(e =>
		{
			console.error(`發生錯誤，無法寫入緩存檔案 ${__epubProcessCacheFile}`, String(e));
		})
		;
}

export const saveEpubProcessCache = debounce(_saveEpubProcessCache, 10 * 60 * 1000)

export function readEpubProcessCache()
{
	return streamToPromise(createReadStream(__epubProcessCacheFile)
		.pipe(parse())
		.on('data', (data: ICacheMapRow) =>
		{
			const key = epubProcessCacheKey(data);

			epubProcessCache.set(key, _merge(data.siteID, data.novel_id, {
				...epubProcessCache.get(key),
				...data,
			}));

		}),
	)
		.thenReturn(epubProcessCache)
		//.tap(ret => console.log(`end`, ret))
}
