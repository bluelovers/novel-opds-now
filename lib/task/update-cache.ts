import updateCache from '../site/demonovel/update';
import loadCacheMasiro from '../site/masiro/load';
import updateSegmentCache from '../segment/update';
import { loadCacheAll } from '../site/cached-data/load';
import console from 'debug-color2/logger';
import { allSettled } from 'bluebird-allsettled';

export function updateAllCacheTask(force?: boolean)
{
	return allSettled([

		loadCacheAll(force) as any,

		updateCache(force) as any,
		loadCacheMasiro(force) as any,
		updateSegmentCache(force) as any,
	]).catch(e => console.error(`updateAllCacheTask`, force, e))
}
