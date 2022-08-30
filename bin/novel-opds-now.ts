#!/usr/bin/env node

import 'v8-compile-cache';
import yargs from 'yargs';
import { updateNotifier } from '@yarn-tool/update-notifier';
import getPort, { getPortEnv } from '../lib/util/getPort';
import { startServer } from '../index';

updateNotifier([__dirname, '..']);

let argv = yargs
	.option('port', {
		number: true,
		alias: ['p'],
		//default: getPort(getPortEnv())
	})
	.option('proxy', {
		string: true,
	})
	.option('disposable', {
		boolean: true,
		desc: `啟用 disposable 模式來執行拋棄式 IPFS 伺服器`,
		default: process.env.IPFS_DISPOSABLE,
	})
	.option('calibrePaths', {
		desc: `CALIBRE_PATH=${process.env.CALIBRE_PATH}`,
		array: true,
		string: true,
	})
	.showHelp()
	.parseSync()
;

export default startServer(argv);
