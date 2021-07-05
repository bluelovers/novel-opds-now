import { Router } from 'express';
import makeOPDSPortal, { prefix, makeOPDSType } from '../../lib/site/demonovel/opds';

function opdsDemoNovelHandler()
{
	const router = Router();

	router.use(`${prefix}/:type.xml`, async (req, res) =>
	{
		let feed = await makeOPDSType(req.params.type);
		res.setHeader('Content-Type', 'application/xml');

		let xml = feed.toXML();
		res.send(xml)
	});

	router.use(`${prefix}.xml`, async (req, res) =>
	{
		let feed = await makeOPDSPortal();
		res.setHeader('Content-Type', 'application/xml');

		let xml = feed.toXML();
		res.send(xml)
	});

	return router
}

export default opdsDemoNovelHandler
