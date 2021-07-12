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

				data.swarm = data.swarm.map(value => {
					arr.push(value.peer);
					return value.addr
				}) as any;
				data.addrs = data.addrs.map(value => {
					arr.push(value.addrs?.[0]);
					return value.id
				}) as any;

				return array_unique_overwrite([...data.pubsub, ...data.swarm, ...arr].filter(Boolean).map(String))
			})
		})
}
