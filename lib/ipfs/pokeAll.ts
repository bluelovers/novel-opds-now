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
		.then(gateway => {
			ipfsGatewayList.push(ipfsGatewayMain = gateway);
		})
		.catch(e => null)
	;

	filterList('Gateway')
		.forEach(gateway => {
			ipfsGatewayList.push(gateway);
		})
	;

	array_unique_overwrite(ipfsGatewayList);

	return {
		ipfsGatewayMain,
		ipfsGatewayList,
	}
}

export function pokeAll(cid: string, ipfs, options?: {
	filename?: string
})
{
	return Bluebird.resolve(options).then(async (options) => {

		const { filename } = options ?? {};

		let list = await getIpfsGatewayList(ipfs)
			.then(v => v.ipfsGatewayList)
			.then(list => {
				return list.map(gateway => {
					return toIpfsLink(cid, {
						prefix: {
							ipfs: gateway,
						},
					});
				})
			})
			.then(list => {
				//const ipfs_url = ipfsProtocol(cid);
				const ipfs_share_url = `https://share.ipfs.io/#/${cid}`;

				list.unshift(ipfs_share_url);
				//list.unshift(ipfs_url);

				filterList('GatewayDomain')
					.forEach((gateway) => {
						list.push(ipfsSubdomain(cid, gateway));
					})
				;

				return list;
			})
		;

		list = array_unique_overwrite(list).filter(href => !notAllowedAddress(href));

		console.debug(`[IPFS]`, `pokeAll:start`, list.length);

		return allSettled(list
			.map((href) => {

				if (filename?.length)
				{
					let url = new URL(href);
					url.searchParams.set('filename', filename);
					href = url.toString();
				}

				return pokeURL(href, {
					//cors: true,
					timeout: 10 * 60 * 1000,
				}).then(data => {
					return {
						...data,
						href,
					}
				})
			}))
	})
}

export default pokeAll
