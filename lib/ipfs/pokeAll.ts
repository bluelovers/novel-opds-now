import { pokeIPLD, pokeURL } from 'poke-ipfs';
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
import { EnumParsePathResultNs } from '@lazy-ipfs/parse-ipfs-path/lib/parsePath';

export function notAllowedAddress(url: URL | string)
{
	if (typeof url === 'string')
	{
		url = new URL(url.toString());
	}

	return url.protocol === 'ipfs:' || [
		'localhost',
		'127.0.0.1',
		'::',
		'::1',
	].includes(url.hostname)
}

export async function getIpfsGatewayList(ipfs)
{
	let ipfsGatewayMain: string;
	const ipfsGatewayList: string[] = [];

	await ipfsGatewayAddressesLink(ipfs)
		.then(gateway =>
		{
			ipfsGatewayList.push(ipfsGatewayMain = gateway);
		})
		.catch(e => null)
	;

	filterList('Gateway')
		.forEach(gateway =>
		{
			ipfsGatewayList.push(gateway);
		})
	;

	array_unique_overwrite(ipfsGatewayList);

	return {
		ipfsGatewayMain,
		ipfsGatewayList,
	}
}

/**
 * make sure only poke once
 */
let cachePoke = new Set<string>();

export function pokeAll(cid: string, ipfs, options?: {
	filename?: string
})
{
	const cid_str = cid.toString();

	return Bluebird.resolve(ipfs)
		.then((ipfs) =>
		{

			if (cachePoke.has(cid_str))
			{
				console.gray.debug(`poke`, `skip`, cid_str)
				return null
			}

			return Bluebird
				.resolve(options)
				.then(async (options) =>
				{

					cachePoke.add(cid_str);

					const { filename } = options ?? {};

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
						.then(list =>
						{
							let data: {
								ns: string,
								hash: string,
								path: string
							}

							try
							{
								data = parsePath(cid)
							}
							catch (e)
							{
								data = {
									ns: EnumParsePathResultNs.ipfs,
									hash: cid,
									path: '',
								}
							}

							//const ipfs_url = ipfsProtocol(cid);
							const ipfs_share_url = `https://share.ipfs.io/#/${data.hash}${data.path}`;

							list.unshift(ipfs_share_url);
							//list.unshift(ipfs_url);

							filterList('GatewayDomain')
								.forEach((gateway) =>
								{
									try
									{
										list.push(ipfsSubdomain(data.hash, gateway) + data.path);
									}
									catch (e)
									{

									}
								})
							;

							return list;
						})
					;

					list = array_unique_overwrite(list).filter(href => !notAllowedAddress(href));

					console.debug(`[IPFS]`, `pokeAll:start`, list.length, cid, filename);
					//console.debug(`[IPFS]`, `pokeAll:start`, list);

					return allSettled(list
						.map((href) =>
						{

							if (filename?.length)
							{
								let url = new URL(href);
								url.searchParams.set('filename', filename);
								href = url.toString();
							}

							return pokeURL(href, {
								//cors: true,
								timeout: 10 * 60 * 1000,
							}).then(data =>
							{
								return {
									...data,
									href,
								}
							})
						}))
				}).finally(() => cachePoke.delete(cid_str))

		})
		;
}

export function filterPokeAllSettledResult(settledResult: ITSUnpackedPromiseLike<ReturnType<typeof pokeAll>>)
{
	return settledResult.filter(v => !v.value.error && v.value.value !== false && v.value.value?.length)
}

export function reportPokeAllSettledResult(settledResult: ITSUnpackedPromiseLike<ReturnType<typeof pokeAll>>,
	...msg: any
)
{
	return Bluebird.resolve(settledResult).tap(settledResult =>
	{
		if (settledResult?.length)
		{
			let list = filterPokeAllSettledResult(settledResult)
				.map(m =>
				{

					// @ts-ignore
					if (m.value?.value?.length)
					{
						return m.value.href
					}

					return m
				})
			;

			console.debug(`[IPFS]`, `pokeAll:done`, list)
			console.info(`[IPFS]`, `pokeAll:end`, `結束於 ${list.length} ／ ${settledResult.length} 節點中請求分流`, ...msg)

			return list
		}
	})
}

export default pokeAll
