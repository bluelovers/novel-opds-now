#!/usr/bin/env node

import yargs from 'yargs';
import handleAsync from '../lib/threads';
import { EnumNovelSiteList } from 'novel-downloader/src/all/const';

let argv = yargs
	.option('IDKEY', {
		string: true,
		demandOption: true,
	})
	.option('novel_id', {
		string: true,
		demandOption: true,
	})
	.option('outputDir', {
		string: true,
		demandOption: true,
	})
	.parseSync()
;

handleAsync(argv.novel_id, argv.IDKEY, argv.outputDir)
	.then(v => console.log(`ok`, v))
	.tapCatch(e => console.error(`fail`, e))
;
