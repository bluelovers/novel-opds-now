import { IUseIPFSApi } from '../types';
import { IDResult } from 'ipfs-core-types/src/root';
import console from 'debug-color2/logger';
import Bluebird from 'bluebird';
import { getPubsubPeers } from './pubsub';
import { multiaddr } from 'multiaddr';
import AbortControllerTimer from 'abort-controller-timer';
import { AbortOptions } from 'ipfs-core-types/src/utils';

const connectPeersCache = new Set<string>()

export const peerAbortController = new AbortControllerTimer();

export async function connectPeers(ipfs: IUseIPFSApi, peerID: string, me?: IDResult, timeout?: number, extra?: {
	hidden?: boolean,
})
{
	let peer_id: string = peerID;
	let _not_multiaddr = true;

	try
	{
		let m = multiaddr(peerID);
		peer_id = m.toString();
		_not_multiaddr = false;
	}
	catch (e)
	{
		peer_id = peerID;
	}

	if (connectPeersCache.has(peer_id))
	{
		//console.debug(`[IPFS]`, `[connectPeers]:skip`, peerID)
		return
	}

	return Promise.resolve(me ?? ipfs.id({
			timeout: 3000,
		}))
		.then(async (me) =>
		{
			if (me?.id === peerID)
			{
				return
			}

			let options: AbortOptions = {
				timeout: timeout || 3 * 60 * 1000,
				signal: peerAbortController.signal,
			};

			!extra?.hidden && console.debug(`[IPFS]`, `[connectPeers]:start`, peerID)

			connectPeersCache.add(peer_id)

			return Bluebird
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
					_not_multiaddr && ipfs.swarm.connect(`/ip4/104.131.131.82/tcp/4001/p2p/${peerID}`, options),
					_not_multiaddr && ipfs.swarm.connect(`/p2p/${peerID}`, options),

					!_not_multiaddr && ipfs.swarm.connect(`/ip4/0.0.0.0/tcp/${peerID}`, options),

					ipfs.swarm.connect(`/ip4/0.0.0.0/tcp/4001/p2p/${peerID}`, options),
					ipfs.swarm.connect(`/ip4/0.0.0.0/tcp/4002/p2p/${peerID}`, options),

					!_not_multiaddr && ipfs.swarm.connect(`/ip4/0.0.0.0/tcp/4001/${peerID}`, options),
					!_not_multiaddr && ipfs.swarm.connect(`/ip4/0.0.0.0/tcp/4002/${peerID}`, options),

					ipfs.swarm.connect(peerID, options),

					//ipfs.swarm.connect(`/ipfs/${me.id}/p2p/${peerID}`, options),
					//ipfs.swarm.connect(`/ipfs/${me.id}/ipfs/${peerID}`, options),

					//ipfs.swarm.connect(`/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ/p2p-circuit/ipfs/${peerID}`, options),

				].filter(Boolean))
				.tap(e =>
				{
					!extra?.hidden && console.debug(`[IPFS]`, `[connectPeers]:end`, peerID, String(e))
				})
				.finally(() => {
					connectPeersCache.delete(peer_id)
				})
		})
		.catch(e =>
		{
			//!extra?.hidden && console.warn(`[IPFS]`, `[connectPeers]`, peerID, String(e))
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
			peers: getPubsubPeers(ipfs),
		})
		.then(data =>
		{
			return Bluebird.each(data.peers, async (peerID) =>
			{
				return connectPeers(ipfs, peerID, data.me)
			})
		})

}
