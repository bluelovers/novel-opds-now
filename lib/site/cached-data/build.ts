import { ISiteIDs } from '../types';
import Bluebird from 'bluebird';
import { IRecordCachedJSONRow } from '@demonovel/cached-data/types';
import { getLocalOrRebuild } from '@demonovel/local-or-rebuild-file';
import { getCacheFilename } from '../../util/index';
import console from 'debug-color2/logger';
import fetch from '../../fetch';

export function updateCache(siteID: ISiteIDs, force?: boolean): Bluebird<IRecordCachedJSONRow>
{
	const url = `https://raw.githubusercontent.com/bluelovers/ws-rest/master/packages/%40demonovel/cached-data/cache/build/${siteID}.json` as const;

	return getLocalOrRebuild(getCacheFilename(`${siteID}/${siteID}.json`), {

		console,

		force,

		makeFns: [
			() => fetch(url).then(res => res.json()),
		],

		fallback: {
			module: `@demonovel/cached-data/cache/build/${siteID}` as const,
		},
	})
}

export function buildCache(siteID: ISiteIDs, force?: boolean)
{
	return updateCache(siteID, force)
		.then(table =>
		{
			return Object.values(table)
				.sort((a, b) => b.updated - a.updated)
				.map(novel =>
				{

					let { title, id, cover, content, updated } = novel;

					content = content?.replace?.(/\u001f/g, '');

					return {
						id,
						title,
						cover,
						updated,
						content,
					}

				})
				;
		})
}
