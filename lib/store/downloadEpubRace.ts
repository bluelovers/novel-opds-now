import { ITSValueOrArray } from 'ts-type';
import { IIPFSPromiseApi } from 'ipfs-types';
import { IIPFSClientAddresses } from '@bluelovers/ipfs-http-client';
import { IIPFSFileApi, IIPFSFileApiAddOptions } from 'ipfs-types/lib/ipfs/file';
import { IUseIPFSApi } from '../types';
import { INetworkOptionsBase } from 'ipfs-types/lib/options';
import { handleCID, IFetchOptions, lazyRaceServerList } from 'fetch-ipfs/util';
import raceFetchIPFS from 'fetch-ipfs/race';
import Bluebird from 'bluebird';
import fetch from '../fetch';
import { getIPFS } from '../ipfs/use';
import pAny from 'p-any';
import { mimeFromBuffer } from '../util/mimeFromBuffer';
import { toLink as toIpfsLink } from 'to-ipfs-url';
import { getIpfsGatewayList } from '../ipfs/pokeAll';
import console from 'debug-color2/logger';

export function fetchEpub(ipfs_href: string, timeout: number, options?: {
	filter?(buf: Buffer): boolean;
} & IFetchOptions)
{
	return fetch(ipfs_href, { timeout }).then(res => res.buffer()).tap(assertEpubByMime)
}

export async function fetchEpubAll(ipfs_href: string, timeout: number, options?: {
	filter?(buf: Buffer): boolean;
} & IFetchOptions)
{
	const cid = handleCID(ipfs_href, true, options);

	let ipfs = getIPFS().timeout(3 * 1000)
		.catch(e => null as null)
	;

	//console.log(cid)

	let list = await getIpfsGatewayList(ipfs)
		.then(v => v.ipfsGatewayList)
		.then(list =>
		{
			return list.map(gateway =>
			{
				return toIpfsLink(cid, {
					prefix: {
						ipfs: gateway,
					},
				});
			})
		})
	;

	//console.dir(list)

	return pAny(list.map(ipfs_href => fetchEpub(ipfs_href, timeout, options)))
}

export function downloadEpubRace(ipfs_href: string,
	useIPFS?: ITSValueOrArray<string | IUseIPFSApi>,
	timeout?: number,
	options?: {
		filter?(buf: Buffer): boolean;
	} & IFetchOptions,
)
{
	timeout ??= 20 * 60 * 1000;

	return Bluebird.resolve(useIPFS)
		.then(useIPFS =>
		{
			return useIPFS ?? Bluebird.resolve(getIPFS().timeout(3 * 1000)
					.catch(e => null as null))
				.then(ipfs =>
				{
					return [
						ipfs,
						...lazyRaceServerList(),
					] as typeof useIPFS
				})
		})
		.then(useIPFS =>
		{
			return pAny<Buffer>([
				raceFetchIPFS(ipfs_href, useIPFS as any, timeout, options),
				fetchEpubAll(ipfs_href, timeout, options),
			])
		})
		.tap(assertEpubByMime)
}

export async function assertEpubByMime(buffer: Buffer)
{
	let { mime, ext } = await mimeFromBuffer(buffer);

	if (ext !== 'epub' && ext !== 'zip')
	{
		return Promise.reject(new Error(JSON.stringify({ mime, ext })))
	}
}
