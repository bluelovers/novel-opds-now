import { IFetchOptions } from 'fetch-ipfs/util';
import fetch from '../../fetch';
import { assertEpubByMime } from './util';
import { RequestInit } from 'node-fetch';

export function fetchEpub(ipfs_href: string | URL, timeout: number, options?: {
	filter?(buf: Buffer): boolean;
	fetchOptions?: RequestInit,
} & IFetchOptions)
{
	return fetch(ipfs_href, {
		...options?.fetchOptions,
		timeout,
	}).then(res => res.buffer()).tap(assertEpubByMime)
}
