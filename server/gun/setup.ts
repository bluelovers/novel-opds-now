/**
 * Created by user on 2020/2/1.
 */

import Gun from 'gun';
//import 'gun/lib/server';
import { Express } from 'express';
import __root from '../../lib/__root';
import { join } from 'path';
import { OUTPUT_DIR } from '../../lib/const';
import { ensureDirSync } from 'fs-extra';

let gun: ReturnType<typeof Gun>;

export function setupGun(app?: Express): ReturnType<typeof Gun>
{
	let file = join(OUTPUT_DIR, 'novel-opds-now.cache', 'radata');
	ensureDirSync(file);

	// @ts-ignore
	gun = new Gun({
		web: app,
		peers: [
			//"http://localhost:3000/gun",
			"https://gunjs.herokuapp.com/gun",
			"http://nmr.io:8765/gun",
			"https://my-test-gun-server.herokuapp.com/gun",
		],
		file
	});

	console.debug(`P2P緩存位於 ${file}`);

	return gun
}

export function useGun(): ReturnType<typeof Gun>
{
	return gun || (gun = setupGun());
}

export { gun }

export default useGun


