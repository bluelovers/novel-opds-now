import { IUseIPFSApi } from '../../types';
import { EPUB_TOPIC, getPubsubPeers, pubsubPublish } from './index';
import { EnumPubSubHello, IPubSubHello } from '../types';
import console from 'debug-color2/logger';
import Bluebird from 'bluebird';
import { ITSResolvable } from 'ts-type';

export function pubsubPublishHello(ipfs: IUseIPFSApi, helloType?: EnumPubSubHello, peers?: ITSResolvable<string[]>)
{
	return Bluebird.props({
			me: ipfs.id(),
			pubsubPeers: peers ?? getPubsubPeers(ipfs),
		})
		.then(({
			me,
			pubsubPeers,
		}) =>
		{
			helloType ??= EnumPubSubHello.HELLO;

			console.yellow.info(`[IPFS]`, `peer:hello`, `${EnumPubSubHello[helloType]}:${helloType}`, pubsubPeers?.length);

			return pubsubPublish<IPubSubHello>(ipfs, {
				peerID: me.id,
				type: helloType,
				peers: pubsubPeers,
			})
		})
		;
}
