import { Router } from 'express';
import { builded_map, ISiteIDs } from '../lib/site/types';
import makeOPDSPortal, { makeOPDSSite } from '../lib/opds/index';
import opdsDemoNovelHandler from './opds/demonovel';
import { makeOPDSOther } from '../lib/opds/other';
import { updateAllCacheTask } from '../lib/task/update-cache';
import { showClient } from './util/showClient';
import console from 'debug-color2/logger';
import etag from 'etag';
import moment from 'moment';

function opdsHandler()
{
	const router = Router();

	router.use('/*', async (req, res, next) =>
	{
		console.log(req.method, req.baseUrl, req.url, req.params, req.query);
		showClient(req, res, next);

		updateAllCacheTask();

		next();
	});

	router.use(opdsDemoNovelHandler());

	router.use('/other.xml', async (req, res) =>
	{
		let feed = await makeOPDSOther();
		res.setHeader('Content-Type', 'application/xml');

		feed.updated ||= moment().startOf('day')

		let xml = feed.toXML();

		res.send(xml)
	});

	router.use('/:siteID.xml', async (req, res, next) =>
	{
		let siteID = req.params.siteID as ISiteIDs;

		if (!Object.keys(builded_map).includes(siteID))
		{
			console.warn(`[OPDS]`, siteID, `不存在`)

//			let feed = await makeOPDSPortal();
//			res.setHeader('Content-Type', 'application/xml');
//			res.status(404).send(feed.toXML())

			res.status(404)

			return next()
		}

		let feed = await makeOPDSSite(siteID);
		res.setHeader('Content-Type', 'application/xml');

		feed.updated ||= moment().startOf('day');

		let xml = feed.toXML();

		res.send(xml)
	});

	router.use('/*', async (req, res) =>
	{
		let feed = await makeOPDSPortal();
		res.setHeader('Content-Type', 'application/xml');

		feed.updated = moment().startOf('day')

		let xml = feed.toXML();

		res.send(xml)
	});

	return router
}

export default opdsHandler
