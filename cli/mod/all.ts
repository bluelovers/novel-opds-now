#!/usr/bin/env node

import yargs from 'yargs';
import { downloadNovel2, is504 } from '../../lib/epub/download';
import handleAsync from '../lib/threads';
import novelEpub from 'novel-epub';
import { outputJSON, readJSON } from 'fs-extra';
import { join } from 'path';
import Bluebird from 'bluebird';
import { ICacheMapRow, ICacheMap, EnumCacheMapRowStatus } from '../../lib/types';
import { __cacheMapFile } from '../../lib/const';
import console from 'debug-color2/logger';

let argv = yargs
	.option('siteID', {
		string: true,
		demandOption: true,
	})
	.option('novel_id', {
		string: true,
		demandOption: true,
	})
	.option('outputDir', {
		string: true,
	})
	.parseSync()
;

Bluebird
	.resolve(downloadNovel2({
		novel_id: argv.novel_id,
		siteID: argv.siteID,
		outputRoot: argv.outputDir,
		useCached: true,
	}))
	.then(async ({
		options,
		download,
	}) =>
	{
		let {
				cwd,
				novel_id,
				IDKEY,
				outputDir,
				novel,
				...arr
			} = await download()
				.tapCatch(e =>
				{
					console.error(`[epub]`, IDKEY, novel_id, `下載來源時發生錯誤`, e)
				})
		;

		console.log(`[epub]`, IDKEY, novel_id, `來源下載完成，開始處理排版`, outputDir);

		await handleAsync(argv.novel_id, IDKEY, outputDir)
			.tapCatch(e =>
			{
				console.error(`[epub]`, IDKEY, novel_id, `處理排版時發生錯誤`, e)
			})
		;

		console.log(`[epub]`, IDKEY, novel_id, `排版結束，開始打包 epub`);

		let epub = await novelEpub({
				inputPath: cwd,
				outputPath: cwd,
				padEndDate: false,
				filename: novel_id,
				//noLog: true,
				downloadRemoteFile: true,
				epubContextDate: true,
			})
				.tapCatch(e =>
				{
					console.error(`[epub]`, IDKEY, novel_id, `打包 epub 時發生錯誤`, e)
				})
		;

		console.success(`[epub]`, IDKEY, novel_id, `打包 epub 結束`)

		//console.dir(epub.file);

		let map_file = __cacheMapFile;

		let map: ICacheMap = await readJSON(map_file)
			.catch(e =>
			{
				//console.error(`讀取 cacheMapFile 時發生錯誤`, e);
				return {}
			})
		;

		map[IDKEY] = map[IDKEY] || {};

		let _data: ICacheMapRow = {
			...arr,
			cwd,
			IDKEY,
			novel_id,
			outputDir,
			epub: epub.file,
			status: EnumCacheMapRowStatus.DONE,
			timestamp: Date.now(),
		};

		map[IDKEY][novel_id] = map[IDKEY][argv.novel_id] = _data;

		console.dir({
			IDKEY,
			novel_id,
		})

		await outputJSON(map_file, map, {
			spaces: 2,
		})

	})
	.tapCatch(e => console.error(`[epub]`, e))
;
