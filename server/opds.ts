import { Router } from 'express';
import { id_titles_map } from '../lib/novel-cache/types';
import makeOPDSPortal, { makeOPDSSite } from '../lib/opds/index';
import opdsDemoNovelHandler from './opds/demonovel';
import updateCacheAll from '../lib/novel-cache/update';
import updateCache from '../lib/demonovel/update';

function opdsHandler()
{
	const router = Router();

	router.use('/*', async (req, res, next) =>
	{
		updateCacheAll();
		updateCache();

		next();
	});

	router.use(opdsDemoNovelHandler());

	router.use('/:siteID.xml', async (req, res) =>
	{
		let feed = await makeOPDSSite(req.params.siteID as any);
		res.setHeader('Content-Type', 'application/xml');
		res.send(feed.toXML())
	});

	router.use('/*', async (req, res) =>
	{
		let feed = await makeOPDSPortal();
		res.setHeader('Content-Type', 'application/xml');
		res.send(feed.toXML())
	});

	return router
}

export default opdsHandler
