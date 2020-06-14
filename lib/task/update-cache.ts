import updateCacheAll from '../novel-cache/update';
import updateCache from '../demonovel/update';
import loadCacheMasiro from '../masiro/load';

export function updateAllCacheTask()
{
	return Promise.all([
		updateCacheAll(),
		updateCache(),
		loadCacheMasiro(),
	]).catch(e => null)
}
