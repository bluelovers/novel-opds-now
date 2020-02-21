import { createServer as _createServer } from "http";
import micro from 'micro';
import { generate as qrcode } from 'qrcode-terminal';
import searchIPAddress from 'address2';
import getPort, { getPortEnv } from './lib/getPort';
import showIP from './lib/ip';
import Bluebird from 'bluebird';
import console from 'debug-color2/logger';
import debounce from 'lodash/debounce';
import findPort, { makeRange } from 'get-port';
import useIPFS from 'use-ipfs';

export async function startServer(options: {
	port?: number | string,
	proxy?: string
} = {})
{
	options = options || {};
	let { port } = options;

	if (options.proxy)
	{
		process.env.HTTP_PROXY = process.env.HTTPS_PROXY = options.proxy;
	}

	const web = await _createServer(micro(await import('./server/index').then(m => m.default)));

	port = (port as number | 0) || getPort(getPortEnv());

	port = await findPort({
		port: makeRange(port, (port | 0) + 10),
	});

	web.listen(port, async () =>
	{
		showIP(port);

		let _showIP = debounce(() =>
		{
			showIP(port);
		}, 11 * 1000);

		_showIP();

		if (0)
		{
			Bluebird
				.resolve(import('./server/gun/setup'))
				.tap(async (m) =>
				{
					m.setupGun(web);

					return Bluebird.resolve([
							'dmzj',
							'wenku8',
							'esjzone',
						] as const)
						.map(IDKEY =>
						{
							return Bluebird
								.resolve()
								.then(v => m.useGun().get(IDKEY).then())
								.timeout(5 * 1000)
								.catch(e => null)
						})
						;
				})
				.catch(e => null)
				.delay(5 * 1000)
				.tap(_showIP)
			;
		}
		else
		{
			Bluebird
				.resolve(useIPFS() as any)
				.catch(e => null)
				.tap(e => _showIP())
			;
		}
	});

	return web
}

export default startServer
