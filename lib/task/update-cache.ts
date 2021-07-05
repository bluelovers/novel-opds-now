
import updateCacheAll from '../novel-cache/update';
import updateCache from '../demonovel/update';
import loadCacheMasiro from '../masiro/load';
import updateSegmentCache from '../segment/update';
import { loadCache, loadCacheAll } from '../site/cached-data/load';
import { ISiteIDs } from '../novel-cache/types';

export function updateAllCacheTask(force?: boolean)
{
	return Promise.all([
		//updateCacheAll(force),

		loadCacheAll(force),

		updateCache(force),
		loadCacheMasiro(force),
		updateSegmentCache(force),
	]).catch(e => null)
}
