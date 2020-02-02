import loadCache from '../../lib/demonovel/load';
import { createFromJSON } from '@node-novel/cache-loader';
import { Router } from 'express';
import makeOPDSPortal, { prefix, makeOPDSType } from '../../lib/demonovel/opds';
import buildCache from '../../lib/demonovel/build';
import updateCache from '../../lib/demonovel/update';

updateCache();

function opdsDemoNovelHandler()
{
	const router = Router();

	router.use(`${prefix}/:type.xml`, async (req, res) =>
	{
		let feed = await makeOPDSType(req.params.type);
		res.setHeader('Content-Type', 'application/xml');
		res.send(feed.toXML())
	});

	router.use(`${prefix}.xml`, async (req, res) =>
	{
		let feed = await makeOPDSPortal();
		res.setHeader('Content-Type', 'application/xml');
		res.send(feed.toXML())
	});

	return router
}

export default opdsDemoNovelHandler
