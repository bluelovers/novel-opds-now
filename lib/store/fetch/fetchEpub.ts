import { IFetchOptions } from 'fetch-ipfs/util';
import { fetch } from '../../fetch';
import { RequestInit } from 'node-fetch';
import Bluebird from 'bluebird';

const SymbolSource = Symbol.for('href');

export function fetchEpub(ipfs_href: string | URL, timeout: number, options?: {
	filter?(buf: Buffer): boolean;
	fetchOptions?: RequestInit,
} & IFetchOptions)
{
	return fetch(ipfs_href, {
		...options?.fetchOptions,
		timeout,
	})
		.then(res => res.buffer())
		.tap(buf =>
		{
			buf[SymbolSource] = ipfs_href;
			if (!buf.length)
			{
				return Bluebird.reject(buf)
			}
		})
}
