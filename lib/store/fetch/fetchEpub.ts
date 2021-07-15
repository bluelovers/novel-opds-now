import { IFetchOptions } from 'fetch-ipfs/util';
import fetch from '../../fetch';
import { assertEpubByMime } from './util';

export function fetchEpub(ipfs_href: string, timeout: number, options?: {
	filter?(buf: Buffer): boolean;
} & IFetchOptions)
{
	return fetch(ipfs_href, { timeout }).then(res => res.buffer()).tap(assertEpubByMime)
}
