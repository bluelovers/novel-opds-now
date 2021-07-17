import { ISiteIDs } from '../types';
import Bluebird from 'bluebird';
import { IRecordCachedJSONRow } from '@demonovel/cached-data/types';
import { getLocalOrRebuild } from '@demonovel/local-or-rebuild-file';
import { getCacheFilename } from '../../util/index';
import console from 'debug-color2/logger';
import fetch from '../../fetch';
import { outputJSON } from 'fs-extra';
import { _buildMap } from './build-map';
import { INovelDataSimple } from './types';

export function updateCache(siteID: ISiteIDs, force: boolean): Bluebird<IRecordCachedJSONRow>
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

export function buildCache(siteID: ISiteIDs, force: boolean)
{
	return updateCache(siteID, force)
		.then(table =>
		{
			return Object.values(table)
				.sort((a, b) => b.updated - a.updated)
				.map<INovelDataSimple>(novel =>
				{

					let {
						title,
						id,
						authors,
						cover,
						content,
						updated,
						uuid ,
					} = novel;

					content = content?.replace?.(/\u001f/g, '');

					return {
						uuid,
						id,
						title,
						authors,
						cover,
						updated,
						content,
					}

				})
				;
		})
		.tap(list => {
			return _buildMap(siteID, list)
		})
}
