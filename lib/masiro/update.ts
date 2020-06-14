/**
 * Created by user on 2020/6/14.
 */
import Bluebird from 'bluebird';
import console from 'debug-color2/logger';
import fetch from '../fetch';
import { stat, readJSON, outputJSON } from 'fs-extra';
import { getCacheFilename } from '../util';
import { IRecordCachedJSONRow } from '@demonovel/cached-data/types';
import { getLocalOrRebuild } from '@demonovel/local-or-rebuild-file';


const url = `https://raw.githubusercontent.com/bluelovers/ws-rest/master/packages/%40demonovel/cached-data/cache/build/masiro.json`;

const url2 = `https://raw.githubusercontent.com/demonovel/masiro-mega-to-ipfs/master/test/cache/cache.json`;

export function updateCache(force?: boolean): Bluebird<IRecordCachedJSONRow>
{
	return getLocalOrRebuild(getCacheFilename('masiro/masiro.json'), {

		console,

		makeFns: [
			() => fetch(url).then(res => res.json()),
		],

		fallback: {
			module: '@demonovel/cached-data/cache/build/masiro',
		},
	})
}

export function updateCache2(force?: boolean): Bluebird<Record<string, number>>
{
	return getLocalOrRebuild(getCacheFilename('masiro/update.json'), {

		console,

		makeFns: [
			() => fetch(url2).then(res => res.json()),
		],
	})
}

export default updateCache
