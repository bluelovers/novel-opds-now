import { ITSResolvable } from 'ts-type/lib/generic';
import { IUseIPFSApi } from '../../types';
import Bluebird from 'bluebird';
import { getPubsubPeers } from './index';
import { join } from 'path';
import { tmpPath } from '../../util/tmpPath';
import { appendFile } from 'fs-extra';
import { __root } from '../../const';
import { array_unique_overwrite } from 'array-hyper-unique';

export const cachePubSubPeers = new Set<string>();

export function updateCachePubSubPeers(ipfs?: ITSResolvable<IUseIPFSApi>, plusPeers?: ITSResolvable<string | string[]>)
{
	return Bluebird.props({
			ipfs,
			plusPeers,
		})
		.then(async ({
			ipfs,
			plusPeers,
		}) => {
			let peers = await getPubsubPeers(ipfs);

			if (plusPeers?.length)
			{
				peers = [plusPeers, peers].flat();
			}

			peers = array_unique_overwrite(peers.filter(peer => {
				let bool = !cachePubSubPeers.has(peer);

				if (bool) cachePubSubPeers.add(peer);

				return bool && Boolean(peer)
			}));

			if (!peers.length)
			{
				return peers
			}

			let content = `\n${peers.join('\n')}\n`;

			return Promise.all([
				appendFile(join(tmpPath(), '.novel-opds-now.peers.txt'), content),
				appendFile(join(__root, '.cache', '.novel-opds-now.peers.txt'), content),
			]).then(() => peers)
		})
		.catch(e => {
			console.error(`updateCachePubSubPeers`, e);
			return null as null
		})
	;
}
