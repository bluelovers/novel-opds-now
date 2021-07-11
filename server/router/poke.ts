import { Router } from 'express';
import console from 'debug-color2/logger';
import { showClient } from '../util/showClient';
import { updateAllCacheTask } from '../../lib/task/update-cache';
import pokeAll from '../../lib/ipfs/pokeAll';
import { getIPFS } from '../../lib/ipfs/use';
import LazyURL from 'lazy-url';
import { parsePath } from '@lazy-ipfs/parse-ipfs-path';
import { result } from 'lodash';
import { resultToPath } from '@lazy-ipfs/parse-ipfs-path/lib/parsePath';
import Bluebird from 'bluebird';

function routerPokeHandler()
{
	const router = Router();

	router.use('/*', async (req, res, next) =>
	{
		console.log(req.method, req.baseUrl, req.url, req.params, req.query);
		showClient(req, res, next);

		let cid: string = req.params?.[0] ?? '';

		if (cid.length)
		{
			cid = await Bluebird.resolve(cid)
				.then(() => {
					return Promise.resolve(cid)
						.then((cid) => parsePath(cid))
						.catch(() => {
							let u = new LazyURL(cid)

							try
							{
								let cid = u.hostname.split('.')[0]
								return parsePath(cid + u.pathname)
							}
							catch (e)
							{
								return parsePath(u.pathname)
							}

						})
				})
				.tap(e => {
					console.dir(e)
				})
				.tapCatch(e => {
					console.error(e)
				})
				.then(result => resultToPath(result))
				.catch(() => cid)
		}

		if (cid.length)
		{
			let list = await pokeAll(cid, getIPFS().catch(e => null as null))
				.tap(e => {
					console.success(`poke`, e)
				})
				.tapCatch(e => console.error(`poke`, e))
				.catch(e => null as null)
			;

			return res.json({
				cid,
				list,
				params: req.params,
				timestamp: Date.now(),
			})
		}

		return res.json({
			cid,
			params: req.params,
			timestamp: Date.now(),
		})
	});

	return router
}

export default routerPokeHandler
