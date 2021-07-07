/**
 * Created by user on 2020/2/1.
 */

import { spawnSync, spawn } from "child_process";
import { join } from "path";
import __root from '../lib/__root';
import console from 'debug-color2/logger';

spawn('node', [
	join(__root, `./cli/cache.js`),
], {
	stdio: 'inherit',
});
