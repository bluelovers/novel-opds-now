/**
 * Created by user on 2020/1/30.
 */

import { download } from "novel-downloader-cli"
import { requireNovelSiteClass } from 'novel-downloader/src/all';
import { EnumNovelSiteList } from 'novel-downloader/src/all/const';
import { join } from 'path';
import FastGlob from '@bluelovers/fast-glob/bluebird';
import {
	stat,
	remove,
	readJSONSync,
	removeSync,
	pathExistsSync,
	ensureFile,
	ensureDir,
	ensureDirSync,
	readJSON,
	writeJSON,
} from 'fs-extra';
import { OUTPUT_DIR, __cacheMapFile } from './const';
import Bluebird from 'bluebird';
import tmpDir from './tmpDir';
import { ICacheMap, ICacheMapRow, IDownloadInfo, EnumCacheMapRowStatus } from './types';
import { siteID2IDKEY } from 'novel-downloader/src/all/util';

export function downloadInfo(options: {
	novel_id: string | number,
	siteID: string | EnumNovelSiteList,
	outputRoot: string,
	useCached?: boolean,
}): IDownloadInfo
{
	let IDKEY = siteID2IDKEY(options.siteID);

	if (options.useCached)
	{
		try
		{
			let map: ICacheMap = readJSONSync(__cacheMapFile);

			let o2 = map[IDKEY];
			let data: ICacheMapRow = o2[options.novel_id];

			if (!data)
			{
				let oc = requireNovelSiteClass(options.siteID);

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
				let _ok = false;

				if (data.status === EnumCacheMapRowStatus.DONE && pathExistsSync(data.epub))
				{
					_ok = true
				}
				else if (data.status === EnumCacheMapRowStatus.WAITING_RETRY)
				{
					_ok = true
				}

				if (_ok)
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

	let oc = requireNovelSiteClass(options.siteID);

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
		timestamp: Date.now(),
	}
}

export function is504<E extends Error>(e: E)
{
	// @ts-ignore
	if (e.message.includes('504') || e.StatusCode == 504)
	{
		return true;
	}

	return false
}

export function downloadNovel2(options: {
	novel_id: string | number,
	siteID: string | EnumNovelSiteList,
	outputRoot: string,
	useCached?: boolean,
})
{
	return Bluebird.resolve()
		.then(() => downloadInfo(options))
		.then(options => {

			const { IDKEY } = options;

			return {
				options,
				download()
				{
					return Bluebird.resolve(downloadNovel(options.novel_id, options.siteID, options.outputDir))
						.catch(async (e) => {
							if (is504(e))
							{
								console.dir(e);

								await Bluebird.delay(5000);

								return downloadNovel(options.novel_id, options.siteID, options.outputDir)
							}

							return Promise.reject(e)
						})
						.tapCatch(e => {
							if (is504(e))
							{
								e.StatusCode = 504;
								e.options = options;
							}
						})
						.then(value => {
							return {
								...options,
								...value,
							}
						})
						.tapCatch(async (e) => {

							if (is504(e))
							{
								let map_file = __cacheMapFile;

								let map: ICacheMap = await readJSON(map_file)
									.catch(e => ({}))
								;

								let _data = map[IDKEY] = map[IDKEY] || {};

								if (!_data[options.novel_id] || _data[options.novel_id].status !== EnumCacheMapRowStatus.DONE)
								{
									_data[options.novel_id] = {
										outputRoot: options.outputDir,

										// @ts-ignore
										..._data[options.novel_id],
										...options,
										...e.options,

										status: EnumCacheMapRowStatus.WAITING_RETRY,
										timestamp: Date.now(),
									} as any;

									delete _data[options.novel_id].removeCallback;

									await writeJSON(map_file, map, {
										spaces: 2,
									});
								}

								return;
							}

							return options.removeCallback()
						})
				}
			}
		})
	;
}

export async function downloadNovel(novel_id: string | number, siteID: string | EnumNovelSiteList, outputDir = OUTPUT_DIR)
{
	let IDKEY = siteID2IDKEY(siteID);

	await ensureDir(join(outputDir, IDKEY, String(novel_id)));
	//await emptyDir(join(outputDir, IDKEY, String(novel_id)));

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

