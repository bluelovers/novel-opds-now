import { ICacheMap, ICacheMapRow } from '../types';
import { readJSON, writeJSON } from 'fs-extra';
import { __cacheMapFile } from '../const';
import console from 'debug-color2/logger';
import ManyKeysMap from 'many-keys-map';
import { debounce } from 'lodash';

const mapEpubProcessCacheJson = new ManyKeysMap<[string, string], Partial<ICacheMapRow> & {
	expire?: number
}>();

export const _doTask = debounce(async function ()
{
	if (mapEpubProcessCacheJson.size)
	{
		let _changed = false;

		let map: ICacheMap = await readJSON(__cacheMapFile)
			.catch(e => console.error(`readJSON`, __cacheMapFile, e))
		;

		let now = Date.now()

		mapEpubProcessCacheJson.forEach((value, [IDKEY, novel_id]) => {
			if (!value?.expire || now > value.expire)
			{
				if (typeof map?.[IDKEY]?.[novel_id] !== 'undefined')
				{
					delete map[IDKEY][novel_id];
					_changed = true;
				}

				mapEpubProcessCacheJson.delete([IDKEY, novel_id]);
			}
		})

		if (_changed)
		{
			await writeJSON(__cacheMapFile, map, { spaces: 2 }).catch(e =>
			{
				console.error(`發生錯誤，無法寫入緩存檔案 ${__cacheMapFile}`, String(e));
			});
		}
	}
}, 60 * 1000);

export function deleteEpubProcessCacheJson(IDKEY: string, novel_id: string | string[], _data?: Partial<ICacheMapRow> & {
	expire?: number
})
{
	_data ??= {};
	_data.expire = 0;

	([novel_id, _data?.novel_id2, _data?.novel_id].flat() as string[]).forEach(novel_id => {
		novel_id && mapEpubProcessCacheJson.set([IDKEY, novel_id], _data)
	});

	_doTask();
}

export async function getEpubProcessCacheJson(IDKEY: string, novel_id: string)
{
	let map: ICacheMap = await readJSON(__cacheMapFile)
		.catch(e => console.error(`readJSON`, __cacheMapFile, e))
	;

	let value = map?.[IDKEY]?.[novel_id] ?? mapEpubProcessCacheJson.get([IDKEY, novel_id]);

	mapEpubProcessCacheJson.set([IDKEY, novel_id], value);

	_doTask();

	return value
}
