
import updateCache from '../site/demonovel/update';
import loadCacheMasiro from '../site/masiro/load';
import updateSegmentCache from '../segment/update';
import { loadCache, loadCacheAll } from '../site/cached-data/load';
import { ISiteIDs } from '../site/types';

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
