import { getIpfsGatewayList } from '../ipfs/pokeAll';
import { toLink as toIpfsLink } from 'to-ipfs-url';
import { IPFS } from 'ipfs-core-types';
import { handleCID, IFetchOptions } from 'fetch-ipfs/util';
import { getIPFS, getIPFSFromCache } from '../ipfs/use';
import { ITSResolvable } from 'ts-type/lib/generic';
import Bluebird from 'bluebird';
import { fetch } from '../fetch';
import AbortControllerTimer from 'abort-controller-timer';

export async function raceFetchServerList(ipfs: IPFS, ipfs_href: string, timeout?: number, options?: {
	filter?(buf: Buffer): boolean;
} & IFetchOptions)
{
	const cid = handleCID(ipfs_href, true, options);

	ipfs = ipfs ?? await getIPFSFromCache();

	return getIpfsGatewayList(ipfs)
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
}

export function raceFetchAll(list: ITSResolvable<string[]>, timeout?: number, options?: {
	filter?(buf: Buffer): boolean;
} & IFetchOptions)
{
	return Bluebird.resolve(list)
		.then(list =>
		{
			const controller = new AbortControllerTimer(timeout);

			return Bluebird.resolve(list.map(ipfs_href =>
				{

					return fetch(ipfs_href, {
						timeout,
						signal: controller.signal,
					})
						.then(res => res.buffer())
						.tap(async (buf) =>
						{
							let result = (await options?.filter?.(buf)) ?? true

							if (!result)
							{
								return Promise.reject(new Error(`reject by filter: ${result}\n${ipfs_href}`))
							}
						})

				}))
				.any()
				.finally(() => controller.abort())
		})
		;
}
