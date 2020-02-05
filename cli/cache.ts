#!/usr/bin/env node


import yargs from 'yargs';
import { OUTPUT_DIR } from '../lib/const';
import { removeSync } from 'fs-extra';
import { join } from "path";
import __root from '../lib/__root';
import updateCacheAll from '../lib/novel-cache/update';
import console from 'debug-color2/logger';
import updateCache from '../lib/demonovel/update';

let argv = yargs
	.option('force', {
		boolean: true,
		alias: ['f'],
	})
	.argv
;

if (argv.force)
{
	removeSync(join(__root, `.cache/cache.json`));
}

import('../lib/buildCache');
updateCacheAll(argv.force)
	//.tap(v => console.debug(`[UPDATE] 小說列表`))
;
updateCache(argv.force);
