import 'v8-compile-cache';
import { createServer as _createServer } from "http";
import { serve as micro } from 'micro';
import getPort, { getPortEnv } from './lib/util/getPort';
import showIP from './lib/ip';
import Bluebird from 'bluebird';
import console from 'debug-color2/logger';
import findPort, { portNumbers as makeRange } from 'get-port';
import { _info, useIPFS } from './lib/ipfs/use';
import { envCalibrePath, ICalibreEnv } from 'calibre-env';
import { sep } from 'path';

export async function startServer(options: {
	port?: number | string,
	proxy?: string,
	disposable?: boolean,
	calibrePaths?: string[],
} = {})
{
	options ||= {};

	// @ts-ignore
	if (options.help)
	{
		return;
	}

	let { port } = options;

	if (options.proxy)
	{
		process.env['HTTP_PROXY'] = process.env['HTTPS_PROXY'] = options.proxy;
	}

	process.env.IPFS_DISPOSABLE = options.disposable ?? process.env.IPFS_DISPOSABLE;

	if (typeof options.calibrePaths !== 'undefined')
	{
		// @ts-ignore
		process.env.CALIBRE_PATH = options.calibrePaths;
	}

	const web = await _createServer(micro(await import('./server/index').then(m => m.default)));

	if (!options.port)
	{
		port = (port as number | 0) || getPort(getPortEnv());

		console.debug(`[express]`, `port:init`, port);

		// @ts-ignore
		process.env.PORT = port = await findPort({
			port: makeRange(port, (port | 0) + 10),
		});

		console.debug(`[express]`, `port:done`, port);
	}

	web.listen(port, async () =>
	{
		await showIP(port);

		useIPFS().catch(e => console.error(`[IPFS]`, e)).tap(() => _info());

	});

	return web
}

export default startServer
