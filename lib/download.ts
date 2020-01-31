/**
 * Created by user on 2020/1/30.
 */

import { download } from "novel-downloader-cli"
import { requireNovelSiteClass } from 'novel-downloader';
import { EnumNovelSiteList } from 'novel-downloader/src/all';
import { join } from 'path';
import FastGlob from '@bluelovers/fast-glob/bluebird';
import {
	stat,
	remove,
	emptyDir,
	readJSON,
	readJSONSync,
	removeSync,
	pathExistsSync,
	ensureFile,
	ensureDir, ensureDirSync,
} from 'fs-extra';
import { OUTPUT_DIR, __cacheMapFile } from './const';
import Bluebird from 'bluebird';
import tmpDir from './tmpDir';
import { ICacheMap, ICacheMapRow, IDownloadInfo } from './types';

export function downloadInfo(options: {
	novel_id: string | number,
	siteID: string | EnumNovelSiteList,
	outputRoot: string,
	useCached?: boolean,
}): IDownloadInfo
{
	let oc = requireNovelSiteClass(options.siteID);
	let { IDKEY } = oc;

	if (options.useCached)
	{
		try
		{
			let map: ICacheMap = readJSONSync(__cacheMapFile);

			let o2 = map[IDKEY] || map[options.siteID];
			let data: ICacheMapRow = o2[options.novel_id];

			if (!data)
			{
				let o3 = new oc({
					// @ts-ignore
					pathNovelStyle: true,
					keepImage: true,
					keepRuby: true,
					keepFormat: true,
					debugLog: true,
				});

				let url_data2 = o3.parseUrl(options.novel_id);

				data = o2[url_data2.novel_id];
			}

			if (data && pathExistsSync(join(data.cwd, '.gitkeep')))
			{
				return {
					...data,
					removeCallback()
					{
						return removeSync(data.outputDir)
					}
				}
			}
		}
		catch (e)
		{

		}
	}

	if (!options.outputRoot)
	{
		options.outputRoot = OUTPUT_DIR;
	}

	ensureDirSync(options.outputRoot);
	let { name: outputDir, removeCallback } = tmpDir(options.outputRoot);

	let o = new oc({
		outputDir,
		// @ts-ignore
		pathNovelStyle: true,
		keepImage: true,
		keepRuby: true,
		keepFormat: true,
		debugLog: true,
	});

	let url_data = o.parseUrl(options.novel_id);

	let cwd = join(outputDir, IDKEY, url_data.novel_id);

	return {
		outputDir,
		cwd,
		siteID: options.siteID,
		IDKEY,
		novel_id: url_data.novel_id as string,
		novel_id2: options.novel_id,
		removeCallback()
		{
			return removeSync(outputDir)
		},
		outputRoot: options.outputRoot,
	}
}

export function downloadNovel2(options: {
	novel_id: string | number,
	siteID: string | EnumNovelSiteList,
	outputRoot: string,
})
{
	return Bluebird.resolve()
		.then(() => downloadInfo(options))
		.then(options => {
			return {
				options,
				download()
				{
					return Bluebird.resolve(downloadNovel(options.novel_id, options.siteID, options.outputDir))
						.then(value => {
							return {
								...options,
								...value,
							}
						})
						.tapCatch(e => {
							console.dir(777777777)
							return options.removeCallback()
						})
				}
			}
		})
	;
}

export async function downloadNovel(novel_id: string | number, siteID: string | EnumNovelSiteList, outputDir = OUTPUT_DIR)
{
	let oc = requireNovelSiteClass(siteID);
	let { IDKEY } = oc;

	await ensureDir(join(outputDir, IDKEY, String(novel_id)));
	await emptyDir(join(outputDir, IDKEY, String(novel_id)));

	await ensureFile(join(outputDir, IDKEY, String(novel_id), '.gitkeep'));

	let novel = await download(String(novel_id), {
		disableTxtdownload: true,
		//disableCheckExists: true,
		keepImage: true,
		keepRuby: true,
		keepFormat: true,
		debugLog: true,
	}, siteID as EnumNovelSiteList, {
		outputDir,
		pathNovelStyle: true,
		keepImage: true,
		keepRuby: true,
		keepFormat: true,
		debugLog: true,
	});

	let cwd = join(outputDir, IDKEY, novel.url_data.novel_id);

	await FastGlob([
		'**/*.txt',
	], {
		cwd,
		absolute: true,
	}).each(async (file) =>
	{

		let st = await stat(file);

		if (st.size < 5)
		{
			return remove(file)
		}

	})

	return {
		cwd,
		IDKEY,
		novel_id: novel.url_data.novel_id as string,
		novel,
	}
}

export default downloadNovel

