import { searchIpfs } from '../../lib/ipfs/use';
import itMap from 'it-map';
import itAll from 'it-all';
import Bluebird from 'bluebird';

searchIpfs()
	.tap(async ({ ipfs, stop }) =>
	{
		let i = 0;

		for await (const result of ipfs.pin.ls())
		{
			console.info(`pin`, result.type, result.cid, result.metadata)
		}

		for await (const result of ipfs.repo.gc())
		{
			console.log(`gc`, result.err, result.cid)

			if (++i > 10)
			{
				await Bluebird.delay(200);
			}
		}

		await ipfs.repo.stat().then(console.log)

		return stop();
	})
;
