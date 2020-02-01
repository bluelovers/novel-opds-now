/**
 * Created by user on 2020/2/1.
 */

import yargs from 'yargs';
import { OUTPUT_DIR } from '../lib/const';
import { spawnSync } from 'child_process';
import http from 'http';
import micro from 'micro';
import app from '../index';

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
});
