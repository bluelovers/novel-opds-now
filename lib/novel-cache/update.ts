/**
 * Created by user on 2020/2/1.
 */
import { ISiteIDs, pathPrefix, id_titles_map, id_update_map, getLocalFilename, id_chapters_map } from './types';
import Bluebird from 'bluebird';
import { pathExists, stat, readJSON, writeJSON, outputJSON } from 'fs-extra';
import { basename } from 'path';
import fetch from 'cross-fetch';
import buildSortAll from './build';
import console from 'debug-color2/logger';

export function updateCacheAll(force?: boolean)
{
	return Bluebird.all(Object.keys(id_titles_map)
		.reduce((a, b ) => {

			a.push(updateCache(b as any, id_titles_map, force));
			a.push(updateCache(b as any, id_update_map, force));
			a.push(updateCache(b as any, id_chapters_map, force));

			return a
		}, [] as Promise<unknown>[]))
		.then(v => buildSortAll())
}

export async function updateCache(siteID: ISiteIDs, map: Record<ISiteIDs, string>, force?: boolean)
{
	let localFile = getLocalFilename(siteID, map);

	return Bluebird.resolve(stat(localFile))
		.then(async (st) => {
			if (!force && st && (Date.now() - st.mtimeMs) < 12 * 3600 * 1000)
			{
				return readJSON(localFile)
			}
			return Promise.reject()
		})
		.catch(e => {
			console.debug(`[${siteID}] 更新 ${map[siteID]}`);
			return fetchCache(siteID, map)
		})
		.catch(e => {
			console.warn(e.message)
			return readJSON(localFile)
		})
		.catch(e => {
			console.warn(e.message)
			let moduleFile = `${pathPrefix.module}${map[siteID]}`;
			return import(moduleFile).then(v => v.default || v)
		})
		.then(data => outputJSON(localFile, data, { spaces: 2 }))
	;
}

export function fetchCache<T>(siteID: ISiteIDs, map: Record<ISiteIDs, string>)
{
	return Bluebird
		.resolve(fetch(`${pathPrefix.github}${map[siteID]}`))
		.then<T>(v => {
			return v.json()
		})
		;
}

export default updateCacheAll
