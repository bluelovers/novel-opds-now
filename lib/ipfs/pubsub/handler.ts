import { Message } from 'ipfs-core-types/src/pubsub';
import { getIPFS } from '../use';
import { EnumPubSubHello, IOr, IPubSubBase, IPubSubEpub, IPubSubHello } from '../types';
import console from 'debug-color2/logger';
import { EPUB_TOPIC, getPubsubPeers } from './index';
import { pokeAll, reportPokeAllSettledResult } from '../pokeAll';
import { addMutableFileSystem } from '../mfs';
import { connectPeersAll } from '../peer';
import { pubsubPublishHello } from './hello';
import { ITSResolvable } from 'ts-type';
import { getMixinPeers } from '../util/getMixinPeers';
import { updateCachePubSubPeers } from './cache';

export async function pubsubHandler(msg: Message)
{
	const ipfs = await getIPFS().catch(e => null);

	//console.debug(`[IPFS]`, `pubsubHandler:raw`, msg)

	if (!ipfs) return;

	// @ts-ignore
	const me = await ipfs.id().catch(e => null);

	try
	{
		const json = JSON.parse(Buffer.from(msg.data).toString()) as IOr<[
			IPubSubHello, IPubSubEpub, {
				cid: string
			} & IPubSubBase
		]>;

		//console.debug(`[IPFS]`, `pubsubHandler:json`, json)

		if (json)
		{
			//console.debug(`[IPFS]`, `pubsubHandler:json`, json, msg.from)

			let peerIDs: string[] = [];

			if (msg.topicIDs.includes(EPUB_TOPIC))
			{
				if (typeof json.peerID !== 'undefined' && json.type && msg.from.toString() === json.peerID.toString())
				{
					console.yellow.info(`[IPFS]`, `peer:online`, me.id === msg.from ? 'You!' : json.peerID, msg.topicIDs, `${EnumPubSubHello[json.type]}:${json.type}`, json.peers?.length);

					if (me.id !== msg.from)
					{
						peerIDs.push(json.peerID);

						if (json.type !== EnumPubSubHello.HELLO_REPLY && EnumPubSubHello[json.type])
						{
							let peers: ITSResolvable<string[]>;

							if (json.type === EnumPubSubHello.HELLO_AGAIN)
							{
								peers = getMixinPeers(ipfs)
							}
							else
							{
								peers = getPubsubPeers(ipfs)
							}

							pubsubPublishHello(ipfs, EnumPubSubHello.HELLO_REPLY, peers)
						}

						updateCachePubSubPeers(ipfs, msg.from);
					}
				}
			}

			if (me?.id !== msg.from)
			{
				// @ts-ignore
				if (json.cid || json.data?.cid)
				{
					// @ts-ignore
					const cid = json.cid || json.data?.cid as any;

					pokeAll(cid, ipfs, {
						// @ts-ignore
						filename: json.data?.path
					}, `by`, msg.from)
						.tap(settledResult =>
						{
							return reportPokeAllSettledResult(settledResult, cid, (json.data as any)?.path, `by`, msg.from)
						})
					;

				}

				if (typeof json.data !== 'undefined' && json.data.cid)
				{
					if (typeof json.siteID === 'string' && typeof json.novelID === 'string' && json.siteID.length && json.novelID.length && json.data.path && json.data.size)
					{
						addMutableFileSystem({
							siteID: json.siteID,
							novelID: json.novelID,
							data: {
								cid: json.data.cid,
								path: json.data.path,
								size: json.data.size,
							},
						}, `by`, msg.from)
					}

					peerIDs.push(msg.from);

					//console.debug(`[IPFS]`, `pubsubHandler`, msg, json)
				}
			}

			if (me.id !== msg.from && Array.isArray(json.peers) && json.peers.length)
			{
				peerIDs.push(...json.peers);
			}

			if (me.id !== msg.from && peerIDs.length)
			{
				await connectPeersAll(ipfs, peerIDs, {
					hidden: true,
				});
			}

		}
	}
	catch (e)
	{
		console.debug(`[IPFS]`, `pubsubHandler:error`, Buffer.from(msg.data).toString(), e)
	}
}
