import { getLocalOrRebuild } from '@demonovel/local-or-rebuild-file';
import { getCacheFilename } from '../util';
import console from 'debug-color2/logger';
import fetch from '../fetch';
import { buildCache } from './build';

export function loadCache()
{
	return getLocalOrRebuild(getCacheFilename('masiro/builded.json'), {

		console,

		makeFns: [
			() => buildCache(),
		],
	})
}

export default loadCache

loadCache();
