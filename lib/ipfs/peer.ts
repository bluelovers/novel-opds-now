import { IUseIPFSApi } from '../types';
import { IDResult } from 'ipfs-core-types/src/root';
import console from 'debug-color2/logger';
import Bluebird from 'bluebird';
import { getPubsubPeers } from './pubsub';
import { multiaddr, Multiaddr } from 'multiaddr';
import AbortControllerTimer from 'abort-controller-timer';
import { AbortOptions } from 'ipfs-core-types/src/utils';
import { ITSResolvable } from 'ts-type';
import { getMixinPeers } from './util/getMixinPeers';
import { array_unique_overwrite } from 'array-hyper-unique';

const connectPeersCache = new Set<string>()

export const peerAbortController = new AbortControllerTimer();

export function getPeerCacheKey(peerID: string)
{
	let peer_id: string = peerID;
	let _not_multiaddr = true;
	let peer_addr: Multiaddr;

	try
	{
		peer_addr = multiaddr(peerID);
		peer_id = peer_addr.toString();
		_not_multiaddr = false;
	}
	catch (e)
	{
		peer_id = peerID;
	}

	return {
		peer_id,
		_not_multiaddr,
		peer_addr,
	}
}

export async function connectPeers(ipfs: IUseIPFSApi, peerID: string, me?: IDResult, timeout?: number, extra?: {
	hidden?: boolean,
})
{
	const { peer_id, _not_multiaddr } = getPeerCacheKey(peerID)

	if (connectPeersCache.has(peer_id))
	{
		//console.debug(`[IPFS]`, `[connectPeers]:skip`, peerID)
		return
	}

	return _connectPeers(ipfs, peerID, me ?? ipfs.id({
		timeout: 3000,
	}), timeout, extra);
}

export async function _connectPeers(ipfs: IUseIPFSApi,
	peerID: string,
	me?: ITSResolvable<IDResult>,
	timeout?: number,
	extra?: {
		hidden?: boolean,
	},
)
{
	const { peer_id, _not_multiaddr, peer_addr } = getPeerCacheKey(peerID)

	return Promise.resolve(me)
		.then(async (me) =>
		{
			let id = me.id;
			let id2 = peer_addr?.getPeerId?.();

			if (id === peerID || id2 === id || peer_id.includes(id) || peerID.includes(id))
			{
				return
			}

			const subAbortController = new AbortControllerTimer(timeout || 3 * 60 * 1000);

			let options: AbortOptions = {
				timeout: timeout || 3 * 60 * 1000,
				signal: subAbortController.signal,
			};

			!extra?.hidden && console.debug(`[IPFS]`, `[connectPeers]:start`, peerID)

			connectPeersCache.add(peer_id)

			const fn = () =>
			{
				try
				{
					subAbortController.abort()
				}
				catch (e)
				{}
				subAbortController.clear();
			}

			peerAbortController.on('abort', fn);

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
				.finally(() =>
				{
					fn();
					peerAbortController.off('abort', fn);

					connectPeersCache.delete(peer_id)
				})
		})
		.catch(e =>
		{
			//!extra?.hidden && console.warn(`[IPFS]`, `[connectPeers]`, peerID, String(e))
		})
		;
}

export function connectPeersAll(ipfs: IUseIPFSApi, peers: ITSResolvable<string[]>, extra?: {
	hidden?: boolean,
	timeout?: number,
})
{
	return Bluebird
		.props({
			me: ipfs.id(),
			peers,
			myPeers: getMixinPeers(ipfs),
		})
		.then(({
			me,
			peers,
			myPeers,
		}) =>
		{
			let id = me.id;

			if (!peers?.length)
			{
				return;
			}

			peers = array_unique_overwrite(peers.map(String).filter(peerID =>
			{
				const { peer_id, peer_addr } = getPeerCacheKey(peerID);

				if (myPeers.includes(peer_id) || myPeers.includes(peerID))
				{
					return false;
				}
				else if (peer_addr?.getPeerId?.() === id || peer_id.includes(id) || peerID.includes(id))
				{
					return false;
				}

				connectPeersCache.add(peer_id);

				return true;
			}));

			if (!peers?.length)
			{
				return;
			}

			return Bluebird.map(peers, async (peerID) =>
			{
				return _connectPeers(ipfs, peerID, me, extra?.timeout, extra)
			}, {
				concurrency: 3,
			})
		})

}
