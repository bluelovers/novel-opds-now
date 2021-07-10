/**
 * Created by user on 2020/1/30.
 */

import { EnumNovelSiteList } from 'novel-downloader/src/all/const';
import FastGlob from '@bluelovers/fast-glob/bluebird';
import { stat, remove, readFile, writeFile, pathExists } from 'fs-extra';
import { spawnSync } from "child_process";
import console from 'debug-color2/logger';
import { async as crossSpawn } from 'cross-spawn-extra';
import { join } from 'path';
import __root from './__root';
import { newFileURL } from '@demonovel/db-api/lib/util';
import Bluebird from 'bluebird';

const _catch = new Map<string, ReturnType<typeof _doPackEpubFromSource>>();

export function doPackEpubFromSource(siteID: string | EnumNovelSiteList, novelID: string | number)
{
	let key = newFileURL(siteID, novelID).pathname;

	return Bluebird.resolve()
		.then(async () =>
		{

			if (_catch.has(key))
			{
				let p = _catch.get(key);

				if (p.isPending())
				{
					console.warn(`此小說的打包任務仍在執行中，請稍後再請求檔案...`, siteID, novelID);
					return p
				}
				else if (p.isFulfilled())
				{
					return p
				}

				await p.catch(e => console.warn(`上次的打包任務失敗...`, siteID, novelID, e));
			}

			let p = _doPackEpubFromSource(siteID as EnumNovelSiteList, novelID);

			_catch.set(key, p);

			return p
		})
		.tapCatch(e =>
		{
			console.error(`打包時發生錯誤...`, siteID, novelID, e);
		})
		.finally(() => _catch.delete(key))
		;
}

export function _doPackEpubFromSource(siteID: EnumNovelSiteList, novelID: string | number)
{
	console.yellow.info(`從原始來源網站抓取打包小說中...`, siteID, novelID);
	return Bluebird.resolve(crossSpawn('node', [
			'--experimental-worker',
			join(__root, `./cli/cli.js`),
			'--mod',
			'all',
			'--siteID',
			siteID,
			'--novel_id',
			novelID,
		], {
			stdio: 'inherit',
		}))
		.tap(cp =>
		{
			if (cp.error)
			{
				return Promise.reject(cp.error)
			}
		})
		;
}
