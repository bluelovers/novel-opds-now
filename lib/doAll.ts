/**
 * Created by user on 2020/1/30.
 */

import { EnumNovelSiteList } from 'novel-downloader/src/all/const';
import FastGlob from '@bluelovers/fast-glob/bluebird';
import { stat, remove, readFile, writeFile, pathExists } from 'fs-extra';
import { spawnSync } from "child_process";

export async function doAll(id: string | number, siteID: EnumNovelSiteList)
{
	spawnSync('node', [
		`../cli/cli`,
		'--IDKEY',
		siteID,
		'--novel_id',
		String(id),
	], {
		stdio: 'inherit',
	});
}

export default doAll

//doAll(2786, EnumNovelSiteList['dmzj/api'])
