import Bluebird from 'bluebird';
import { getPubsubPeers } from '../pubsub/index';
import { array_unique_overwrite } from 'array-hyper-unique';
import { ITSResolvable } from 'ts-type';
import { IUseIPFSApi } from '../../types';
import { getIPFS } from '../use';

export function getMixinPeers(ipfs?: ITSResolvable<IUseIPFSApi>)
{
	return Bluebird.resolve(ipfs ?? getIPFS())
		.then((ipfs) => {
			return Bluebird.props({
				pubsub: getPubsubPeers(ipfs).then(ret => ret || [] as null),
				swarm: ipfs.swarm.peers().catch(e => [] as null),
				addrs: ipfs.swarm.addrs().catch(e => [] as null),
			}).then(data => {

				let arr: any[] = []

				data.addrs = data.addrs.map(value => {
					return value.id
				}) as any;
				data.swarm = data.swarm.map(value => {
					//console.log(0, value.addr.toString())
					//arr.push(value.peer);
					//return value.addr.encapsulate('/p2p/' + value.peer)
					return value.peer
				}) as any;

				return array_unique_overwrite([...data.pubsub, ...data.swarm, ...arr].filter(Boolean).map(String))
			})
		})
}
