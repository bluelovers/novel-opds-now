/**
 * Created by user on 2020/2/1.
 */

import Gun from 'gun';
import { Express } from 'express';

let gun: ReturnType<typeof Gun>;

export function setupGun(app?: Express): ReturnType<typeof Gun>
{
	// @ts-ignore
	gun = new Gun({
		web: app,
		peers: [
			"https://gunjs.herokuapp.com/gun",
			"http://nmr.io:8765/gun",
		],
	});

	return gun
}

export function useGun(): ReturnType<typeof Gun>
{
	return gun || (gun = setupGun());
}

export { gun }

export default useGun


