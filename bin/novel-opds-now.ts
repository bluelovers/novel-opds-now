#!/usr/bin/env node

/**
 * Created by user on 2020/2/1.
 */

import yargs from 'yargs';
import { OUTPUT_DIR } from '../lib/const';
import { spawnSync } from 'child_process';
import http from 'http';
import micro from 'micro';
import app from '../index';
import updateNotifier from '@yarn-tool/update-notifier';
import { generate as qrcode } from 'qrcode-terminal';
import searchIPAddress from 'address2';

updateNotifier([__dirname, '..']);

let argv = yargs
	.option('port', {
		number: true,
		alias: ['p'],
		default: process.env.PORT || 3000
	})
	.argv
;

const server = new http.Server(micro(app));
server.listen(argv.port, () => {
	console.log(`http://localhost:${argv.port}`)

	let ip: string = searchIPAddress();

	let href = `http://${ip}:${argv.port}/opds`;
	console.log(href);

	qrcode(href, { small: true });
});
