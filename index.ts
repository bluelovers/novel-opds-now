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
import { ipfsWebuiAddresses } from 'ipfs-util-lib/lib/api/multiaddr';
import terminalLink from 'terminal-link';
import { processExit } from './lib/processExit';
import { pubsubSubscribe, connectPeersAll, pubsubPublishHello } from './lib/ipfs/pubsub';
import computerInfo from 'computer-info';
import packageJson from './package.json';
import { updateAllCacheTask } from './lib/task/update-cache';
import { _info, useIPFS } from './lib/ipfs/use';

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

		useIPFS().catch(e => console.error(`[IPFS]`, e)).tap(() => _info());

	});

	return web
}

export default startServer
