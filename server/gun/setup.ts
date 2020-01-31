/**
 * Created by user on 2020/2/1.
 */

import Gun from 'gun';

let gun: ReturnType<typeof Gun>;

export function setupGun(app): ReturnType<typeof Gun>
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
	return gun;
}

export { gun }

export default useGun


