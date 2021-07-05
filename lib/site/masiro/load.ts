import { getLocalOrRebuild } from '@demonovel/local-or-rebuild-file';
import { getCacheFilename } from '../../util/index';
import console from 'debug-color2/logger';

export function loadCache(force?: boolean)
{
	return getLocalOrRebuild(getCacheFilename('masiro/builded.json'), {

		console,

		force,

		makeFns: [
			() =>
			{
				console.debug(`嘗試更新 masiro`);
				return import('./build').then(m => m.buildCache(force).tap(v => console.success(`[masiro] 更新完成`))
					)
			},
		],
	})
}

export default loadCache
