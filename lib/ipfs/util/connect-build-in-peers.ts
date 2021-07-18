/**
 * Created by user on 2021/7/13.
 */
import Bluebird from 'bluebird';
import { outputFile, readFile } from 'fs-extra';
import { join } from 'path';
import { __root } from '../../const';
import { IUseIPFSApi } from '../../types';
import { ITSResolvable } from 'ts-type/lib/generic';
import { connectPeers } from '../peer';
import { tmpPath } from '../../util/tmpPath';
import { handleCachePeersFile } from '../../util/handleCachePeersFile';
import { cachePubSubPeers } from '../pubsub/cache';

export function getBuildInPeers()
{
	return Bluebird.resolve(readFile(join(__root, 'lib/static/build-in-peers.txt'))
		.then(buf => handleCachePeersFile(buf)))
}

export function getCachePeers(force?: boolean)
{
	return Bluebird.props({
			c1: readFile(join(tmpPath(), '.novel-opds-now.peers.txt')).catch(e => null) as Promise<string>,
			c2: readFile(join(__root, '.cache', '.novel-opds-now.peers.txt')).catch(e => null) as Promise<string>,
		})
		.then(({
			c1,
			c2,
		}) =>
		{
			c1 = (c1 ?? '').toString();
			c2 = (c2 ?? '').toString();

			return handleCachePeersFile(c1 + '\n' + c2);
		})
		.tap(peers => {

			if (!force && !peers.filter(peer => !cachePubSubPeers.has(peer)).length)
			{
				return
			}

			let content = `\n${peers.join('\n')}\n`;

			return Promise.all([
				outputFile(join(tmpPath(), '.novel-opds-now.peers.txt'), content),
				outputFile(join(__root, '.cache', '.novel-opds-now.peers.txt'), content),
			])
		})
}

export function _connectPeers(ipfs: ITSResolvable<IUseIPFSApi>, ls: ITSResolvable<string[]>, extra?: {
	hidden?: boolean,
})
{
	return Bluebird.resolve(ipfs)
		.then(async (ipfs) =>
		{
			const me = await ipfs.id({ timeout: 3000 }).catch(e => null);

			return Bluebird.resolve(ls).map(peer => {
				cachePubSubPeers.add(peer);
				return connectPeers(ipfs, peer, me, 30 * 60 * 1000, extra)
			}, {
				concurrency: 3,
			}).tap(ls => !ls?.length && Promise.reject(new Error(`peers is empty`)))
		})
		;
}

export function connectCachePeers(ipfs: ITSResolvable<IUseIPFSApi>)
{
	return _connectPeers(ipfs, getCachePeers(), {
		hidden: true,
	})
}

export function connectBuildInPeers(ipfs: ITSResolvable<IUseIPFSApi>)
{
	return _connectPeers(ipfs, getBuildInPeers(), {
		hidden: true,
	})
}
