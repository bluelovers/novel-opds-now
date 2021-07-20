import pokeAll from '../pokeAll';
import { IPFS } from 'ipfs-core-types';
import { throttle } from 'lodash';
import Bluebird from 'bluebird';
import { getIPFS } from '../use';
import { ITSResolvable } from 'ts-type/lib/generic';

export const pokeRoot = throttle(async function (ipfs?: ITSResolvable<IPFS>)
{
	return Bluebird.resolve(ipfs ?? getIPFS())
		.then(async (ipfs) =>
		{
			for await (const ret of ipfs.files.ls('/'))
			{
				pokeAll(ret.cid as any, ipfs, {
					filename: ret.name,
					hidden: true,
				}).catchReturn(null as null)
			}
		}).catchReturn(null as null)
}, 60 * 60 * 1000);
