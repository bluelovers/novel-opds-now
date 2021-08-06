import { getLocalOrRebuild } from '@demonovel/local-or-rebuild-file';
import { getCacheFilename } from '../../util/index';
import console from 'debug-color2/logger';
import { ISiteIDs } from '../types';
import { buildCache } from './build';
import Bluebird from 'bluebird';

export function loadCacheAll(force: boolean)
{
	return Bluebird.all((<ISiteIDs[]>['wenku8', 'dmzj', 'esjzone']).map((siteID) => loadCache(siteID, force)))
}

/**
 * @example
 * loadCache('wenku8', true)
 */
export function loadCache(siteID: ISiteIDs, force: boolean): ReturnType<typeof buildCache>
{
	return getLocalOrRebuild(getCacheFilename(`${siteID}/builded.json`), {

		console,

		force,

		ttl: 2 * 24 * 60 * 60 * 1000,

		makeFns: [
			() =>
			{
				console.debug(`嘗試更新 ${siteID}`);
				return import('./build').then(m => m.buildCache(siteID, force).tap(v => console.success(`[${siteID}] 更新完成`)))
			},
		],
	})
}
