#!/usr/bin/env node

import yargs from 'yargs';
import console from 'debug-color2/logger';
import { updateAllCacheTask } from '../lib/task/update-cache';
import { getCachePeers } from '../lib/ipfs/util/connect-build-in-peers';

let argv = yargs
	.option('force', {
		boolean: true,
		alias: ['f'],
	})
	.parseSync()
;

Promise.all([
	getCachePeers(),
	updateAllCacheTask(argv.force),
])
