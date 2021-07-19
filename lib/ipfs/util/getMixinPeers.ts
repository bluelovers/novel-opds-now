import Bluebird from 'bluebird';
import { getPubsubPeers } from '../pubsub/index';
import { array_unique, array_unique_overwrite } from 'array-hyper-unique';
import { ITSResolvable } from 'ts-type';
import { IUseIPFSApi } from '../../types';
import { getIPFS } from '../use';
import throttle from 'lodash/throttle';
import { outputFile, appendFile, readFile } from 'fs-extra';
import { join } from 'path';
import { __root } from '../../const';
import debounce from 'lodash/debounce';

export const cachePeersMixinFile = join(__root, 'test', '.peers.mixin.txt');

export const saveMixinPeers = debounce(throttle(() => {
	return getIPFS()
		.then(ipfs => ipfs && ipfs.swarm.peers()
			.then(peers => appendFile(cachePeersMixinFile, `\n${peers.map(v => v.peer).join('\n')}\n`)))
		.catch(e => null as null)
		.finally(saveMixinPeersReduce)
}, 60 * 60 * 1000), 60 * 1000);

export const saveMixinPeersReduce = debounce(() => {
	return readFile(join(__root, 'test', '.peers.mixin.txt'))
		.then(buf => {
			let peers = buf.toString().split(/\s+/).filter(Boolean)

			let old = peers.length;

			array_unique_overwrite(peers);

			if (peers.length != old)
			{
				return outputFile(cachePeersMixinFile, `\n${peers.join('\n')}\n`)
			}
		})
		.catch(e => null as null)
}, 5 * 60 * 1000);

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

				return array_unique_overwrite([...data.pubsub, ...data.swarm, data.addrs, ...arr].filter(Boolean).map(String))
			})
		})
		.tap(saveMixinPeers)
}
