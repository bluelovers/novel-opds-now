import { IIPFSPubsubApi, IIPFSPubsubMsg } from "ipfs-types/lib/ipfs/pubsub";
import { IIPFSSwarmApi } from "ipfs-types/lib/ipfs/swarm";
import { IIPFSConfigApi } from "ipfs-types/lib/ipfs/config";
import Bluebird from 'bluebird';
import console from 'debug-color2/logger';
import multiaddr from 'multiaddr';
import { unsubscribeAll } from 'ipfs-util-lib/lib/ipfs/pubsub/unsubscribe';
import { IIPFSPromiseApi } from "ipfs-types/lib/ipfs/index";
import useIPFS from 'use-ipfs';
import { cid as isCID } from 'is-ipfs';

const EPUB_TOPIC = 'novel-opds-now';
const wssAddr = '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star';

export async function pubsubHandler(msg: IIPFSPubsubMsg)
{
	const { ipfs } = await useIPFS()
		.catch(e => null as {
			ipfs: IIPFSPromiseApi
		})
	;

	if (!ipfs) return;

	const me = await ipfs.id().catch(e => null);

	try
	{
		const json = JSON.parse(msg.data.toString());

		//console.debug(`pubsubHandler:json`, json)

		if (json)
		{
			if (msg.topicIDs.includes(EPUB_TOPIC))
			{
				if (json.peerID && json.type)
				{
					await connectPeers(ipfs, json.peerID)
						.catch(e => null)
				}
			}

			if (json.cid && me?.id !== msg.from)
			{
				const res = await ipfs
					.resolve((isCID(json.cid) ? '/ipfs/' : '') + json.cid)
					.catch(e => null)
				;

				//console.debug(`pubsubHandler`, res)
			}
		}
	}
	catch (e)
	{
		//console.debug(`pubsubHandler:error`, e)
	}

	//console.debug(`pubsubHandler:raw`, msg)

	return connectPeers(ipfs, msg.from)
		.catch(e => null)
	;
}

export async function pubsubSubscribe(ipfs: IIPFSPubsubApi & IIPFSSwarmApi & IIPFSConfigApi)
{
	return ipfs
		.pubsub
		.subscribe(EPUB_TOPIC, pubsubHandler)
		.then(r => console.debug(`subscribed to ${EPUB_TOPIC}`))
		.catch(e => console.warn(`[pubsub.subscribe]`, e))
		;
}

export async function pubsubUnSubscribe(ipfs: IIPFSPubsubApi)
{
	return ipfs.pubsub.unsubscribe(EPUB_TOPIC, pubsubHandler)
		.then(r => console.debug(`unsubscribed from ${EPUB_TOPIC}`))
		.catch(e => console.warn(`[pubsub.unsubscribe]`, e))
		;
}

export async function pubsubPublishHello(ipfs: IIPFSPromiseApi)
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

export async function pubsubPublish<T>(ipfs: IIPFSPromiseApi, data: T)
{
	return ipfs
		.pubsub
		.publish(EPUB_TOPIC, Buffer.from(JSON.stringify(data)))
		.catch(e => console.error(`[pubsubPublish]`, e))
	;
}

export async function getPeers(ipfs: IIPFSPubsubApi): Promise<string[]>
{
	return ipfs.pubsub.peers(EPUB_TOPIC)
		.catch(e =>
		{
			console.warn(`[pubsub.peers]`, e)
			return [] as string[]
		})
}

export async function connectPeers(ipfs: IIPFSPromiseApi, peerID: string)
{
	return ipfs.id()
		.then(me =>
		{
			return (me.id !== peerID) && Bluebird
				.any([
					ipfs.swarm.connect(`/dns4/ws-star-signal-1.servep2p.com/tcp/443/wss/p2p-websocket-star/ipfs/${peerID}`)
						.catch(e => {

							if (String(e).includes('unknown protocol wss'))
							{
								return;
							}

							console.warn(`[connectPeers]`, e)
						}),
					ipfs.swarm.connect(`/p2p-circuit/ipfs/${peerID}`)
						.catch(e => console.warn(`[connectPeers]`, e)),
				])
				.catch(e =>
				{
					console.error(`[connectPeers]`, e)
				})
		})
	;
}

export function connectPeersAll(ipfs: IIPFSPromiseApi)
{
	return Bluebird
		.each(getPeers(ipfs), async (peerID) =>
		{
			return connectPeers(ipfs, peerID)
		})
}
