import { ITSResolvable } from 'ts-type/lib/generic';
import { IUseIPFSApi } from '../../types';
import Bluebird from 'bluebird';
import { getIPFS } from '../use';
import { readFile } from 'fs-extra';
import { join } from 'path';
import { __root } from '../../const';
import { allSettled } from 'bluebird-allsettled';
import { connectPeers } from '../peer';
import { pubsubPublishHello } from '../pubsub/hello';
import { EnumPubSubHello } from '../types';
import { connectBuildInPeers, connectCachePeers } from '../util/connect-build-in-peers';
import { pubsubSubscribe } from '../pubsub/index';

export function initHello(ipfs?: ITSResolvable<IUseIPFSApi>)
{
	return Bluebird.resolve(ipfs)
		.then(async (ipfs) =>
		{
			return Bluebird.any([
					connectBuildInPeers(ipfs),
					connectCachePeers(ipfs),
				])
				//.tap(r => console.debug(`initHello`, r.flat()))
				.catch(e => null)
				.then(() => getIPFS())
				.tap((ipfs) => pubsubPublishHello(ipfs))
				.delay(30 * 60 * 1000)
				.then(() => getIPFS())
				.then((ipfs) => ipfs && pubsubPublishHello(ipfs, EnumPubSubHello.HELLO_AGAIN))
		})
		;
}
