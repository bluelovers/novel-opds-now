/**
 * Created by user on 2020/6/14.
 */
import Bluebird from 'bluebird';
import console from 'debug-color2/logger';
import fetch from '../../fetch';
import { getCacheFilename } from '../../util/index';
import { getLocalOrRebuild } from '@demonovel/local-or-rebuild-file';

const url2 = `https://raw.githubusercontent.com/demonovel/masiro-mega-to-ipfs/master/test/cache/cache.json`;

export function updateCache2(force?: boolean): Bluebird<Record<string, number>>
{
	return getLocalOrRebuild(getCacheFilename('masiro/update.json'), {

		console,

		force,

		makeFns: [
			() => fetch(url2).then(res => res.json()),
		],
	})
}
