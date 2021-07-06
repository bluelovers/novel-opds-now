import { IIPFSPubsubApi, IIPFSPubsubMsg } from "ipfs-types/lib/ipfs/pubsub";
import { IIPFSSwarmApi } from "ipfs-types/lib/ipfs/swarm";
import { IIPFSConfigApi } from "ipfs-types/lib/ipfs/config";
import Bluebird from 'bluebird';
import console from 'debug-color2/logger';
import multiaddr from 'multiaddr';
import { unsubscribeAll } from 'ipfs-util-lib/lib/ipfs/pubsub/unsubscribe';
import { IIPFSPromiseApi } from "ipfs-types/lib/ipfs/index";
import { useIPFS, getIPFS } from './use';
import { cid as isCID } from 'is-ipfs';
import { EndpointConfig } from 'ipfs-http-client';
import { IUseIPFSApi } from '../types';
import { Message } from 'ipfs-core-types/src/pubsub';
import { filterPokeAllSettledResult, pokeAll } from './pokeAll';
import CID from 'cids';
import { addMutableFileSystem } from './mfs';

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
						if (settledResult?.length)
						{
							let list = filterPokeAllSettledResult(settledResult);
							console.info(`[IPFS]`, `pubsubHandler`, `pokeAll:end`, `結束於 ${list.length} ／ ${settledResult.length} 節點中請求分流`, json.cid, json.path);
						}
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
		.catch(e => console.warn(`[IPFS]`, `[pubsub.subscribe]`, e))
		;
}

export async function pubsubUnSubscribe(ipfs: IUseIPFSApi)
{
	return ipfs.pubsub.unsubscribe(EPUB_TOPIC, pubsubHandler)
		.then(r => console.debug(`[IPFS]`, `unsubscribed from ${EPUB_TOPIC}`))
		.catch(e => console.warn(`[IPFS]`, `[pubsub.unsubscribe]`, e))
		;
}

export async function pubsubPublishHello(ipfs: IUseIPFSApi)
{
	return ipfs.id()
		.then(data =>
		{
			return pubsubPublish(ipfs, {
				peerID: data.id,
				type: 1,
			})
				;
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
		.catch(e => console.error(`[IPFS]`, `[pubsubPublish]`, e))
}

export async function getPeers(ipfs: IUseIPFSApi): Promise<string[]>
{
	return ipfs.pubsub.peers(EPUB_TOPIC)
		.catch(e =>
		{
			console.warn(`[IPFS]`, `[pubsub.peers]`, e)
			return [] as string[]
		})
}

export async function connectPeers(ipfs: IUseIPFSApi, peerID: string)
{
	return ipfs.id()
		.then(me =>
		{
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
					ipfs.swarm.connect(`/p2p-circuit/ipfs/${peerID}`)
						.catch(e => console.warn(`[IPFS]`, `[connectPeers]`, e)),
				])
				.catch(e =>
				{
					console.error(`[IPFS]`, `[connectPeers]`, e)
				})
		})
		;
}

export function connectPeersAll(ipfs: IUseIPFSApi)
{
	return Bluebird
		.each(getPeers(ipfs), async (peerID) =>
		{
			return connectPeers(ipfs, peerID)
		})
}
