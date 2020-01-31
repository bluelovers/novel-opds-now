#!/usr/bin/env node

import yargs from 'yargs';
import { spawnSync } from 'child_process';
import { OUTPUT_DIR } from '../lib/const';
import { resolve } from 'path';

let argv = yargs
	.option('mod', {
		string: true,
		demandOption: true,
		alias: ['m'],
	})
	.option('siteID', {
		string: true,
		demandOption: true,
		alias: ['s'],
	})
	.option('outputDir', {
		string: true,
		default: OUTPUT_DIR,
	})
	.option('novel_id', {
		string: true,
		demandOption: true,
		alias: ['i'],
	})
	.argv
;

switch (argv.mod as 'handle' | 'download')
{
	case 'handle':

		if (argv.mod.includes('..'))
		{
			console.dir(argv)
			throw new Error()
		}

		spawnSync('node', [
			resolve(__dirname, `./mod/${argv.mod}`),
			'--IDKEY',
			argv.siteID,
			'--novel_id',
			argv.novel_id,
			'--outputDir',
			argv.outputDir,
		], {
			stdio: 'inherit',
		});
		break;
	default:

		if (argv.mod.includes('..'))
		{
			console.dir(argv)
			throw new Error()
		}

		spawnSync('node', [
			resolve(__dirname, `./mod/${argv.mod}`),
			'--siteID',
			argv.siteID,
			'--novel_id',
			argv.novel_id,
			'--outputDir',
			argv.outputDir,
		], {
			stdio: 'inherit',
		});
		break;

}
