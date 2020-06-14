import { getLocalOrRebuild } from '@demonovel/local-or-rebuild-file';
import { getCacheFilename } from '../util';
import console from 'debug-color2/logger';
import fetch from '../fetch';
import { buildCache } from './build';

export function loadCache(force?: boolean)
{
	return getLocalOrRebuild(getCacheFilename('masiro/builded.json'), {

		console,

		makeFns: [
			() =>
			{
				console.debug(`嘗試更新 masiro`);
				return buildCache()
					.tap(v => console.success(`[masiro] 更新完成`))
			},
		],
	})
}

export default loadCache
