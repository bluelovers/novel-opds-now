
import updateCacheAll from '../novel-cache/update';
import updateCache from '../demonovel/update';
import loadCacheMasiro from '../masiro/load';
import updateSegmentCache from '../segment/update';

export function updateAllCacheTask(force?: boolean)
{
	return Promise.all([
		updateCacheAll(force),
		updateCache(force),
		loadCacheMasiro(force),
		updateSegmentCache(force),
	]).catch(e => null)
}
