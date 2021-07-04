#!/usr/bin/env node


import yargs from 'yargs';
import { OUTPUT_DIR } from '../lib/const';
import { removeSync } from 'fs-extra';
import { join } from "path";
import __root from '../lib/__root';
import updateCacheAll from '../lib/novel-cache/update';
import console from 'debug-color2/logger';
import updateCache2 from '../lib/demonovel/update';
import { updateAllCacheTask } from '../lib/task/update-cache';

let argv = yargs
	.option('force', {
		boolean: true,
		alias: ['f'],
	})
	.parseSync()
;

updateAllCacheTask(argv.force);
