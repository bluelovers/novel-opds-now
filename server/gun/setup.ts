/**
 * Created by user on 2020/2/1.
 */

import Gun from 'gun';
//import 'gun/lib/server';
import 'gun-tag';
import type { Express } from 'express';
import __root from '../../lib/__root';
import { join } from 'path';
import { OUTPUT_DIR } from '../../lib/const';
import { ensureDirSync } from 'fs-extra';
import _console from 'debug-color2/logger';
import type { Server } from 'http';
import { IGunStatic } from 'gun/types/static';
import type { IGunEpubNode } from '../../lib/types';
import type { EnumIDKEYList, EnumIDKEYListString } from 'novel-downloader/src/all/const';
import Radisk from 'gun/lib/radisk';

let gun: ReturnType<typeof setupGun>;

// @ts-ignore
Gun.log = Object.assign(() => {}, Gun.log, {
	verbose: false,
});
// @ts-ignore
Gun.log.off = true;
// @ts-ignore
console.LOG = false;

export function setupGun(app?: Express | Server)
{
	let file = join(OUTPUT_DIR, 'novel-opds-now.cache', 'radata');
	ensureDirSync(file);

	let _gun = new Gun<{
		'epub-file': {
			[K in EnumIDKEYListString | EnumIDKEYList]: Record<string, IGunEpubNode>
		}
	}>({
		web: app,
		peers: [
			//"http://localhost:3000/gun",
			"https://gunjs.herokuapp.com/gun",
			"http://nmr.io:8765/gun",
			"https://my-test-gun-server.herokuapp.com/gun",
		],
		file,
		log()
		{

		},
	});

	_console.debug(`P2P 緩存位於 ${file}`);

	gun = _gun;

	return _gun
}

export function useGun()
{
	return useGunRoot()
		.get('epub-file')
		;
}

export function useGunRoot()
{
	return gun || (gun = setupGun());
}

export { gun }

export default useGun
