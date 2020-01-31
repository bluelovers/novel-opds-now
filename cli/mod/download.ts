#!/usr/bin/env node

import yargs from 'yargs';
import downloadNovel from '../../lib/download';

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
		demandOption: true,
	})
	.argv
;

downloadNovel(argv.novel_id, argv.siteID as any, argv.outputDir)
	.then(v => console.log(true))
;
