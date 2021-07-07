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
	.option('disposable', {
		boolean: true,
		desc: `啟用 disposable 模式來執行拋棄式 IPFS 伺服器`,
		default: process.env.IPFS_DISPOSABLE,
	})
	.parseSync()
;

export default startServer(argv);
