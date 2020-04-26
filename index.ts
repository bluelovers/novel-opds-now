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
import computerInfo from 'computer-info'

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

		Bluebird
			.resolve(useIPFS())
			.tapCatch(e =>
			{
				console.error(`[IPFS]`, `無法啟動 IPFS，將無法連接至 IPFS 網路`, e)
			})
			.tap(async ({
				ipfs,
				address,
				stop,
			}) =>
			{
				//console.info(await address())

				await Bluebird.props({
						id: ipfs.id(),
						version: ipfs.version(),
					})
					.then(data =>
					{
						const { id, agentVersion, protocolVersion } = data.id;

						_info({
							ipfs: {
								id,
								agentVersion,
								protocolVersion,
								version: data.version.version,
							},
						});
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
			.catch(e =>
			{
				console.error(`[IPFS]`, e)
			})
			.tap(() =>
			{
				_info();
			})
		;

	});

	return web
}

export default startServer

function _info(data?)
{
	// @ts-ignore
	if (_info.disable)
	{
		return;
	}

	let {
		osystem,
		ram,
		cpu,
		arch,
		node,
	} = computerInfo() as {
		name: 'USER-2019',
		osystem: 'Windows_NT',
		ram: '26',
		freeram: '10',
		cpu: 'Intel(R) Core(TM) i7-6700 CPU @ 3.40GHz',
		arch: 'x64',
		node: 'v14.0.0'
	};

	console.info({
		...data,
		osystem,
		ram,
		cpu,
		arch,
		node,
	})

	// @ts-ignore
	_info.disable = true;
}
