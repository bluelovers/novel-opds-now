#!/usr/bin/env node

import yargs from 'yargs';
import console from 'debug-color2/logger';
import { updateAllCacheTask } from '../lib/task/update-cache';

let argv = yargs
	.option('force', {
		boolean: true,
		alias: ['f'],
	})
	.parseSync()
;

updateAllCacheTask(argv.force);
