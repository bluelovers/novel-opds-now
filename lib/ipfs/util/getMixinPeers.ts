import Bluebird from 'bluebird';
import { EPUB_TOPIC, getPubsubPeers } from '../pubsub/index';
import { array_unique, array_unique_overwrite } from 'array-hyper-unique';
import { ITSResolvable } from 'ts-type';
import { IUseIPFSApi } from '../../types';
import { getIPFS } from '../use';
import throttle from 'lodash/throttle';
import { outputFile, appendFile, readFile } from 'fs-extra';
import { join } from 'path';
import { __root } from '../../const';
import debounce from 'lodash/debounce';
import { ipfsMixinPeers } from '@lazy-ipfs/get-mixin-peers';

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

			array_unique_overwrite(peers, {
				removeFromFirst: true,
			});

			if (peers.length != old)
			{
				if (peers.length > 6000)
				{
					/**
					 * 防止無限增加
					 */
					peers = peers.slice(peers.length - 3000);
				}

				return outputFile(cachePeersMixinFile, `\n${peers.join('\n')}\n`)
			}
		})
		.catch(e => null as null)
}, 5 * 60 * 1000);

export function getMixinPeers(ipfs?: ITSResolvable<IUseIPFSApi>)
{
	return Bluebird.resolve(ipfs ?? getIPFS())
		.then((ipfs) => {
			return ipfsMixinPeers(ipfs, EPUB_TOPIC)
		})
		.tap(saveMixinPeers)
}
