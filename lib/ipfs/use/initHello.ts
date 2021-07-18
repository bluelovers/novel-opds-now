import { ITSResolvable } from 'ts-type/lib/generic';
import { IUseIPFSApi } from '../../types';
import Bluebird from 'bluebird';
import { getIPFS } from '../use';
import { readFile } from 'fs-extra';
import { join } from 'path';
import { __root } from '../../const';
import { allSettled } from 'bluebird-allsettled';
import { connectPeers, connectPeersAll } from '../peer';
import { pubsubPublishHello } from '../pubsub/hello';
import { EnumPubSubHello } from '../types';
import { _connectPeers, connectBuildInPeers, connectCachePeers, getBuildInPeers } from '../util/connect-build-in-peers';
import { getPubsubPeers, pubsubSubscribe } from '../pubsub/index';
import console from 'debug-color2/logger';
import { cachePeersMixinFile, getMixinPeers } from '../util/getMixinPeers';
import { array_unique } from 'array-hyper-unique';

export function initHello(ipfs: ITSResolvable<IUseIPFSApi>)
{
	return Bluebird.resolve(ipfs)
		.then(async (ipfs) =>
		{
			return Bluebird.any([
					connectBuildInPeers(ipfs),
					connectCachePeers(ipfs),
					_connectPeers(ipfs, readFile(cachePeersMixinFile).then(buf => array_unique(buf.toString().split(/\s+/)).filter(Boolean)).catch(e => [] as null), {
						hidden: true,
					}),
				])
				.catch(e => null)
				.delay(60 * 1000)
				.tap(async () => console.debug(`initHello:peer`, await getPubsubPeers(ipfs)))
				.then(() => ipfs ?? getIPFS())
				.tap((ipfs) => {
					return Bluebird.any([
						pubsubPublishHello(ipfs),
						connectPeersAll(ipfs, getMixinPeers(ipfs), {
							hidden: true,
						}),
					] as any[])
				})
				.delay(30 * 60 * 1000)
				.then(() => getIPFS())
				.tap(async (ipfs) => {
					if (ipfs)
					{
						return Bluebird.allSettled([
							pubsubPublishHello(ipfs, EnumPubSubHello.HELLO_AGAIN, getMixinPeers(ipfs)),
							console.debug(`initHello:again`, await getPubsubPeers(ipfs)),
						])
					}
				})
		})
		;
}
