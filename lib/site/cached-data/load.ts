import { getLocalOrRebuild } from '@demonovel/local-or-rebuild-file';
import { getCacheFilename } from '../../util/index';
import console from 'debug-color2/logger';
import { ISiteIDs } from '../../novel-cache/types';
import { buildCache } from './build';
import Bluebird from 'bluebird';

export function loadCacheAll(force?: boolean)
{
	return Bluebird.all((<ISiteIDs[]>['wenku8', 'dmzj','esjzone'] ).map((siteID) => loadCache(siteID, force)))
}

/**
 * @example
 * loadCache('wenku8', true)
 */
export function loadCache(siteID: ISiteIDs, force?: boolean): ReturnType<typeof buildCache>
{
	return getLocalOrRebuild(getCacheFilename(`${siteID}/builded.json`), {

		console,

		force,

		makeFns: [
			() =>
			{
				console.debug(`嘗試更新 ${siteID}`);
				return import('./build').then(m => m.buildCache(siteID))
					.tap(v => console.success(`[${siteID}] 更新完成`))
			},
		],
	})
}
