/**
 * Created by user on 2021/7/13.
 */
import { getIPFS } from '../use';
import Bluebird from 'bluebird';
import { readFile } from 'fs-extra';
import { join } from 'path';
import { __root } from '../../const';
import { IUseIPFSApi } from '../../types';
import { ITSResolvable } from 'ts-type/lib/generic';
import { connectPeers } from '../peer';
import { allSettled } from 'bluebird-allsettled';
import { pubsubPublishHello } from '../pubsub/hello';
import { EnumPubSubHello } from '../types';

export function connectBuildInPeers(ipfs?: ITSResolvable<IUseIPFSApi>)
{
	return Bluebird.props({
		ipfs: ipfs ?? getIPFS(),
		peers: readFile(join(__root, 'lib/ipfs/build-in-peers.txt')),
	})
		.then(async ({
			ipfs,
			peers,
		}) => {
			const me = await ipfs.id({ timeout: 3000 }).catch(e => null);

			return allSettled(peers.toString().split(/\s+/g).map(peer => peer && connectPeers(ipfs, peer, me, 30 * 60 * 1000)))
				.tap(() => pubsubPublishHello(ipfs))
				.delay(30 * 60 * 1000)
				.then(() => getIPFS())
				.then((ipfs) => ipfs && pubsubPublishHello(ipfs, EnumPubSubHello.HELLO_AGAIN))
		})
	;
}
