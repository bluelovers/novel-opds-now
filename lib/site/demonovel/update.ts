/**
 * Created by user on 2020/2/3.
 */

import Bluebird from 'bluebird';
import { stat, readJSON, outputJSON } from 'fs-extra';
import fetch from '../../fetch';
import { INovelStatCache } from '@node-novel/cache-loader';
import { getLocalFilename } from './load';
import buildCache from './build';
import console from 'debug-color2/logger';
import getProxy from '../../util/getProxy';
import { getLocalOrRebuild } from '@demonovel/local-or-rebuild-file';

let url = `https://gitlab.com/novel-group/txt-source/raw/master/novel-stat.json`;

export async function updateCache(force: boolean)
{
	let localFile = getLocalFilename();

	return getLocalOrRebuild(localFile, {
		console,

		force,

		ttl: 30 * 24 * 60 * 60 * 1000,

		makeFns: [
			() => Bluebird.resolve()
				.then(e => {

					let proxy = getProxy();

					if (proxy)
					{
						console.debug(`use proxy`, proxy);
					}

					console.debug(`嘗試更新 demonovel`);
					return fetchCache()
				})
				.catch<INovelStatCache>(e => {
					console.warn(e.message || e);
					return readJSON(localFile)
				})
				.tap(data => outputJSON(localFile, data, { spaces: 2 }))
				.tap(v => buildCache())
				.tap(v => console.success(`[demonovel]`, `更新完成`)),
		],
	})
}

function fetchCache()
{
	return Bluebird
		.resolve(fetch(url))
		.then<INovelStatCache>(v => {
			return Bluebird.resolve(v.json())
				.tapCatch(async (e) => {
					try
					{
						console.red.dir(await v.text());
					}
					catch (e)
					{

					}
				})
		})
		;
}

export default updateCache

