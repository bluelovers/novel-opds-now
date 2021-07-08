import { IIPFSPubsubApi, IIPFSPubsubMsg } from "ipfs-types/lib/ipfs/pubsub";
import { IIPFSSwarmApi } from "ipfs-types/lib/ipfs/swarm";
import { IIPFSConfigApi } from "ipfs-types/lib/ipfs/config";
import Bluebird from 'bluebird';
import console from 'debug-color2/logger';
import multiaddr from 'multiaddr';
import { unsubscribeAll } from 'ipfs-util-lib/lib/ipfs/pubsub/unsubscribe';
import { IIPFSPromiseApi } from "ipfs-types/lib/ipfs/index";
import { cid as isCID } from 'is-ipfs';
import { EndpointConfig } from 'ipfs-http-client';
import { IUseIPFSApi } from '../types';
import { Message } from 'ipfs-core-types/src/pubsub';
import { filterPokeAllSettledResult, pokeAll, reportPokeAllSettledResult } from './pokeAll';
import CID from 'cids';
import { addMutableFileSystem } from './mfs';
import { getIPFS } from './use';
import { IDResult } from 'ipfs-core-types/src/root';

const EPUB_TOPIC = 'novel-opds-now';
const wssAddr = '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star';

export async function pubsubHandler(msg: Message)
{
	const ipfs = await getIPFS().catch(e => null);

	//console.debug(`[IPFS]`, `pubsubHandler:raw`, msg)

	if (!ipfs) return;

	// @ts-ignore
	const me = await ipfs.id().catch(e => null);

	try
	{
		const json = JSON.parse(Buffer.from(msg.data).toString());

		//console.debug(`[IPFS]`, `pubsubHandler:json`, json)

		if (json)
		{
			if (msg.topicIDs.includes(EPUB_TOPIC))
			{
				if (json.peerID && json.type)
				{
					console.debug(`[IPFS]`, `peer:online`, me.id === msg.from ? 'You!' : json.peerID);

					await connectPeers(ipfs as any, json.peerID)
						.catch(e => null)
				}
			}

			if (json.cid && me?.id !== msg.from)
			{
				console.debug(`[IPFS]`, `pubsubHandler`, json);

				pokeAll(json.cid, ipfs)
					.tap(settledResult =>
					{
						return reportPokeAllSettledResult(settledResult, json.cid, json.path)
					})
				;

				if (json.siteID && json.novelID && json.path && json.size)
				{
					addMutableFileSystem({
						siteID: json.siteID,
						novelID: json.novelID,
						data: {
							cid: json.cid,
							path: json.path,
							size: json.size,
						}
					})
				}

				//console.debug(`[IPFS]`, `pubsubHandler`, msg, json)
			}
		}
	}
	catch (e)
	{
		console.debug(`[IPFS]`, `pubsubHandler:error`, Buffer.from(msg.data).toString(), e)
	}

	return connectPeers(ipfs as any, msg.from)
		.catch(e => null)
		;
}

export async function pubsubSubscribe(ipfs: IUseIPFSApi)
{
	return ipfs
		.pubsub
		.subscribe(EPUB_TOPIC, pubsubHandler)
		.then(r => console.debug(`[IPFS]`, `subscribed to ${EPUB_TOPIC}`))
		.catch(e => console.warn(`[IPFS]`, `[pubsub.subscribe]`, String(e)))
		;
}

export async function pubsubUnSubscribe(ipfs: IUseIPFSApi)
{
	return ipfs.pubsub.unsubscribe(EPUB_TOPIC, pubsubHandler)
		.then(r => console.debug(`[IPFS]`, `unsubscribed from ${EPUB_TOPIC}`))
		.catch(e => console.warn(`[IPFS]`, `[pubsub.unsubscribe]`, String(e)))
		;
}

export async function pubsubPublishHello(ipfs: IUseIPFSApi)
{
	return ipfs.id()
		.then(data =>
		{
			return 	Promise.all([
				connectPeers(ipfs, `12D3KooWEJeVsMMPWdnxHFMaU5uqggtULrF3gHxu15uW5scP8DTJ`)
				,
				pubsubPublish(ipfs, {
					peerID: data.id,
					type: 1,
				})
			])
		})
		;
}

export async function pubsubPublishEpub<T extends {
	siteID: string,
	novelID: string | number,
	data: {
		path: string,
		cid: string | CID,
		size: number,
	},
}>(ipfs: IUseIPFSApi, {
	siteID,
	novelID,
	...data
}: T)
{
	return pubsubPublish(ipfs, {
		...data,
		siteID,
		novelID,
	})
}

export async function pubsubPublish<T>(ipfs: IUseIPFSApi, data: T)
{
	// @ts-ignore
	if (data && !(data.peerID && data.type === 1))
	{
		console.debug(`[IPFS]`, `[pubsubPublish]`, data)
	}

	return Promise.resolve().then(() => {
		return ipfs
			.pubsub
			.publish(EPUB_TOPIC, Buffer.from(JSON.stringify(data)))
	})
		.catch(e => console.warn(`[IPFS]`, `[pubsubPublish]`, String(e)))
}

export async function getPeers(ipfs: IUseIPFSApi): Promise<string[]>
{
	return ipfs.pubsub.peers(EPUB_TOPIC)
		.catch(e =>
		{
			console.warn(`[IPFS]`, `[pubsub.peers]`, String(e))
			return [] as string[]
		})
}

export async function connectPeers(ipfs: IUseIPFSApi, peerID: string, me?: IDResult)
{
	return Promise.resolve(me ?? ipfs.id({
		timeout: 3000
		}))
		.then(me =>
		{

			let options = {
				timeout: 20 * 1000,
			};

			return (me.id && me.id !== peerID) && Bluebird
				.any([
					/*
					ipfs.swarm.connect(`/dns4/ws-star-signal-1.servep2p.com/tcp/443/wss/p2p-websocket-star/ipfs/${peerID}`)
						.catch(e => {

							if (String(e).includes('unknown protocol wss'))
							{
								return;
							}

							console.warn(`[connectPeers]`, e)
						}),
					 */
					//ipfs.swarm.connect(`/p2p-circuit/ipfs/${peerID}`).catch(e => console.warn(`[IPFS]`, `[connectPeers]`, e)),
					ipfs.swarm.connect(`/ip4/104.131.131.82/tcp/4001/p2p/${peerID}`, options),
					ipfs.swarm.connect(`/ip4/123.456.78.90/tcp/4001/p2p/${peerID}`, options),
					ipfs.swarm.connect(`/p2p/${peerID}`, options),

					//ipfs.swarm.connect(`/ipfs/${me.id}/p2p/${peerID}`, options),
					//ipfs.swarm.connect(`/ipfs/${me.id}/ipfs/${peerID}`, options),

					//ipfs.swarm.connect(`/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ/p2p-circuit/ipfs/${peerID}`, options),

				])
		})
		.catch(e =>
		{
			console.warn(`[IPFS]`, `[connectPeers]`, String(e))
		})
		;
}

export function connectPeersAll(ipfs: IUseIPFSApi)
{
	return Bluebird
		.props({
			me: ipfs.id({
				timeout: 3000,
			}),
			peers: getPeers(ipfs),
		})
		.then(data => {
			return Bluebird.each(data.peers, async (peerID) =>
			{
				return connectPeers(ipfs, peerID, data.me)
			})
		})

}
