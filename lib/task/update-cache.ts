import updateCache from '../site/demonovel/update';
import loadCacheMasiro from '../site/masiro/load';
import updateSegmentCache from '../segment/update';
import { loadCacheAll } from '../site/cached-data/load';
import console from 'debug-color2/logger';

export function updateAllCacheTask(force?: boolean)
{
	return Promise.all([

		loadCacheAll(force),

		updateCache(force),
		loadCacheMasiro(force),
		updateSegmentCache(force),
	]).catch(e => console.error(`updateAllCacheTask`, force, e))
}
