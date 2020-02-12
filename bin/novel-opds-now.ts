#!/usr/bin/env node

import yargs from 'yargs';
import updateNotifier from '@yarn-tool/update-notifier';
import getPort, { getPortEnv } from '../lib/getPort';
import startServer from '../index';

updateNotifier([__dirname, '..']);

let argv = yargs
	.option('port', {
		number: true,
		alias: ['p'],
		default: getPort(getPortEnv())
	})
	.option('proxy', {
		string: true,
	})
	.argv
;

export default startServer(argv);
