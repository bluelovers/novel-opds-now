import { pokeAllURL, pokeIPLD, pokeURL } from 'poke-ipfs';
import ipfsProtocol from '@lazy-ipfs/ipfs-protocol';
import { filterList } from 'ipfs-server-list';
import { array_unique_overwrite } from 'array-hyper-unique';
import { ipfsGatewayAddressesLink } from 'ipfs-util-lib/lib/api/multiaddr';
import { toLink as toIpfsLink } from 'to-ipfs-url';
import Bluebird from 'bluebird';
import { allSettled } from 'bluebird-allsettled';
import ipfsSubdomain from '@lazy-ipfs/ipfs-subdomain';
import console from 'debug-color2/logger';
import { ITSUnpackedPromiseLike } from 'ts-type/lib/helper/unpacked';
import { parsePath } from '@lazy-ipfs/parse-ipfs-path';
import { ICIDObject, ICIDValue } from '@lazy-ipfs/detect-cid-lib';
import lazyMakeIpfsAllServerURL, { _notAllowedAddress as notAllowedAddress } from '@lazy-ipfs/make-url-list';
import { filterPokeAllSettledResultWithValue, getPokeAllSettledResultWithHref } from 'poke-ipfs/lib/util/filterPokeAllSettledResult';

/**
 * make sure only poke once
 */
let cachePoke = new Set<string>();

export function pokeAll(cid: ICIDValue, ipfs, options?: {
	filename?: string,
	hidden?: boolean,
	timeout?: number,
}, ...msg: any[])
{
	const cid_str = cid.toString();

	return Bluebird.resolve(ipfs)
		.then((ipfs) =>
		{

			if (cachePoke.has(cid_str))
			{
				!options?.hidden && console.gray.debug(`poke`, `skip`, cid_str)
				return null
			}

			return Bluebird
				.resolve(options)
				.then(async (options) =>
				{

					cachePoke.add(cid_str);

					const { filename } = options ?? {};



					let list = lazyMakeIpfsAllServerURL(cid, {
						serverList: [
							await ipfsGatewayAddressesLink(ipfs).catch(e => null),
						],
						handleOptions: {
							filename,
						}
					}).filter(href => !notAllowedAddress(href));

					!options?.hidden && console.debug(`[IPFS]`, `pokeAll:start`, list.length, cid, filename, ...msg);
					//console.debug(`[IPFS]`, `pokeAll:start`, list);



					return pokeAllURL(list, {
						timeout: (options?.timeout | 0) || 10 * 60 * 1000,
					})
				}).finally(() => cachePoke.delete(cid_str))

		})
		;
}

export function reportPokeAllSettledResult(settledResult: ITSUnpackedPromiseLike<ReturnType<typeof pokeAll>>,
	...msg: any
)
{
	return Bluebird.resolve(settledResult).tap(settledResult =>
	{
		let list = getPokeAllSettledResultWithHref(settledResult ?? []);

		if (list?.length)
		{
			console.debug(`[IPFS]`, `pokeAll:done`, list)
			console.info(`[IPFS]`, `pokeAll:end`, `結束於 ${list.length} ／ ${settledResult.length} 節點中請求分流`, ...msg)
			return list
		}
	})
}

export default pokeAll
