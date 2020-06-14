import updateCacheAll from '../novel-cache/update';
import updateCache from '../demonovel/update';
import loadCacheMasiro from '../masiro/load';

export function updateAllCacheTask(force?: boolean)
{
	return Promise.all([
		updateCacheAll(force),
		updateCache(force),
		loadCacheMasiro(force),
	]).catch(e => null)
}
