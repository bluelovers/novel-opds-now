import { createServer as _createServer } from "http";
import micro from 'micro';
import getPort, { getPortEnv } from './lib/util/getPort';
import showIP from './lib/ip';
import Bluebird from 'bluebird';
import console from 'debug-color2/logger';
import findPort, { makeRange } from 'get-port';
import { _info, useIPFS } from './lib/ipfs/use';

export async function startServer(options: {
	port?: number | string,
	proxy?: string,
	disposable?: boolean,
} = {})
{
	options = options || {};
	let { port } = options;

	if (options.proxy)
	{
		process.env.HTTP_PROXY = process.env.HTTPS_PROXY = options.proxy;
	}

	process.env.IPFS_DISPOSABLE = options.disposable ?? process.env.IPFS_DISPOSABLE;

	const web = await _createServer(micro(await import('./server/index').then(m => m.default)));

	port = (port as number | 0) || getPort(getPortEnv());

	// @ts-ignore
	process.env.PORT = port = await findPort({
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
