import { createServer as _createServer } from "http";
import micro from 'micro';
import { generate as qrcode } from 'qrcode-terminal';
import searchIPAddress from 'address2';
import getPort, { getPortEnv } from './lib/getPort';

export async function startServer(port: number | string = getPort(getPortEnv()))
{
	const web = _createServer(micro(await import('./server/index').then(m => m.default)));

	web.listen(port, async () =>
	{
		// @ts-ignore
		await import('./server/gun/setup').then(m => m.setupGun(web));

		console.log(`http://localhost:${port}`);

		let ip: string = searchIPAddress();

		let href = `http://${ip}:${port}/opds`;
		console.log(href);

		qrcode(href, { small: true });
	});

	return web
}

export default startServer
