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
import { ipfsWebuiAddresses } from 'ipfs-util-lib/lib/api/multiaddr';
import terminalLink from 'terminal-link';
import { processExit } from './lib/processExit';
import { pubsubSubscribe, connectPeersAll, pubsubPublishHello } from './lib/ipfs/pubsub';

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
			//showIP(port);
		}, 11 * 1000);

		_showIP();

		if (0)
		{
			/*
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
			 */
		}
		else
		{
			Bluebird
				.resolve(useIPFS())
				.tap(async ({
					ipfs,
					address,
					stop,
				}) => {
					//console.info(await address())

					await Bluebird.props({
						id: ipfs.id(),
							version: ipfs.version(),
					})
						.then(data => {

							const { id, agentVersion, protocolVersion } = data.id;

							console.debug({
								id,
								agentVersion,
								protocolVersion,
								version: data.version.version,
							})
						})
						.catch(e => console.error(`[IPFS]`, e))
					;

					//console.success(`IPFS Web UI available at`, terminalLink(`webui`, await ipfsWebuiAddresses(ipfs)))
					console.success(`IPFS Web UI available at`, terminalLink(`webui`, `https://dev.webui.ipfs.io/`))

					processExit(stop)

					await pubsubSubscribe(ipfs)
						.then(e => connectPeersAll(ipfs))
						.then(() => pubsubPublishHello(ipfs))
						.catch(e => console.error(`[IPFS]`, e))
					;

				})
				.catch(e => {
					console.error(`[IPFS]`, e)
				})
				.tap(() => _showIP())
			;
		}
	});

	return web
}

export default startServer
