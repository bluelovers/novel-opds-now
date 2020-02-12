import _fetch from 'cross-fetch';
import getProxy from './getProxy';
import HttpProxyAgent from 'http-proxy-agent';

import { RequestInit } from 'node-fetch';

export function fetch(...argv: Parameters<typeof _fetch>)
{
	let proxy = getProxy();
	// @ts-ignore
	let options: RequestInit = argv[1] || {};

	if (proxy)
	{
		options.agent = HttpProxyAgent(proxy);
	}

	options.redirect = 'follow';

	// @ts-ignore
	argv[1] = options;

	return _fetch(...argv)
}

export default fetch
