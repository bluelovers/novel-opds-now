import { createServer as _createServer } from "http";
import micro from 'micro';
import { generate as qrcode } from 'qrcode-terminal';
import searchIPAddress from 'address2';
import getPort, { getPortEnv } from './lib/getPort';
import showIP from './lib/ip';
import Bluebird from 'bluebird';


export async function startServer(port: number | string = getPort(getPortEnv()))
{
	const web = _createServer(micro(await import('./server/index').then(m => m.default)));

	web.listen(port, async () =>
	{
		showIP(port);

		Bluebird.delay(5 * 1000)
			.tap(v => {
				showIP(port);
			})
		;

		Bluebird.resolve(import('./server/gun/setup'))
			.then(m => m.setupGun(web))
			.delay(5 * 1000)
			.tap(v => {
				showIP(port);
			})
		;
	});

	return web
}

export default startServer
