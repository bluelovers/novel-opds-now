import { IUseIPFSApi } from '../../types';
import console from 'debug-color2/logger';
import { IPubSubBase, IPubSubEpub } from '../types';
import { pubsubHandler } from './handler';
import { ITSResolvable } from 'ts-type';
import Bluebird from 'bluebird';
import { cidToString } from '@lazy-ipfs/cid-to-string';

export const EPUB_TOPIC = 'novel-opds-now';

export async function pubsubUnSubscribe(ipfs: IUseIPFSApi)
{
	return ipfs.pubsub.unsubscribe(EPUB_TOPIC, pubsubHandler)
		.then(r => console.debug(`[IPFS]`, `[pubsub.unsubscribe]`, `unsubscribed from ${EPUB_TOPIC}`))
		.catch(e => console.warn(`[IPFS]`, `[pubsub.unsubscribe]`, String(e)))
		;
}

export async function pubsubPublishEpub<T extends IPubSubEpub>(ipfs: IUseIPFSApi, {
	siteID,
	novelID,
	...data
}: T, peers?: ITSResolvable<string[]>)
{
	let msgData: IPubSubEpub = {
		...data,
		siteID,
		novelID,
	}

	msgData.data = {
		...msgData.data,
		cid: msgData.data.cid.toString(),
	}

	return pubsubPublish<IPubSubEpub>(ipfs, msgData, peers)
}

export async function pubsubPublish<T extends IPubSubBase>(ipfs: IUseIPFSApi, data: T, peers?: ITSResolvable<string[]>)
{
	return Promise.resolve(peers).then((peers) =>
		{
			// @ts-ignore
			if (data && !(data.peerID && data.type))
			{
				console.debug(`[IPFS]`, `[pubsubPublish]`, data, peers?.length)
			}

			return ipfs
				.pubsub
				.publish(EPUB_TOPIC, Buffer.from(JSON.stringify({
					...data,
					peers: peers ?? data.peers,
				})))
		})
		.catch(e => console.warn(`[IPFS]`, `[pubsubPublish]`, String(e)))
}

export function pubsubSubscribe(ipfs: IUseIPFSApi)
{
	return Bluebird.resolve(ipfs.pubsub.subscribe(EPUB_TOPIC, pubsubHandler))
		.then(r => console.debug(`[IPFS]`, `[pubsub.subscribe]`, `subscribed to ${EPUB_TOPIC}`))
		.catch(e => console.warn(`[IPFS]`, `[pubsub.subscribe]`, String(e)))
		;
}

export async function getPubsubPeers(ipfs: IUseIPFSApi): Promise<string[]>
{
	return ipfs.pubsub.peers(EPUB_TOPIC)
		.catch(e =>
		{
			//console.warn(`[IPFS]`, `[pubsub.peers]`, String(e))
			return null as string[]
		})
}
