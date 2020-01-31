#!/usr/bin/env node

import yargs from 'yargs';
import { downloadNovel2 } from '../../lib/download';
import handleAsync from '../lib/threads';
import novelEpub from 'novel-epub';
import { outputJSON, readJSON } from 'fs-extra';
import { join } from 'path';
import Bluebird from 'bluebird';
import { ICacheMapRow, ICacheMap, EnumCacheMapRowStatus } from '../../lib/types';
import { __cacheMapFile } from '../../lib/const';

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
	.argv
;

Bluebird
	.resolve(downloadNovel2({
		novel_id: argv.novel_id,
		siteID: argv.siteID,
		outputRoot: argv.outputDir,
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
		} = await download();

		await handleAsync(argv.novel_id, IDKEY, outputDir);

		let epub = await novelEpub({
			inputPath: cwd,
			outputPath: cwd,
			padEndDate: false,
			filename: novel_id,
			noLog: true,
			downloadRemoteFile: true,
		});

		//console.dir(epub.file);

		let map_file = __cacheMapFile;

		let map: ICacheMap = await readJSON(map_file)
			.catch(e => ({})) || {}
		;

		map[argv.siteID] = map[argv.siteID] || {};
		map[IDKEY] = map[IDKEY] || {};

		let _data: ICacheMapRow = {
			...arr,
			cwd,
			IDKEY,
			novel_id,
			outputDir,
			epub: epub.file,
			status: EnumCacheMapRowStatus.DONE,
		};

		map[argv.siteID][novel_id] = map[argv.siteID][argv.novel_id] = map[IDKEY][novel_id] = map[IDKEY][argv.novel_id] = _data;

		await outputJSON(map_file, map, {
			spaces: 2,
		})

	})
;
