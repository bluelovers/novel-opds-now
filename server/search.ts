import { Router } from 'express';
import { builded_map, ISiteIDs } from '../lib/site/types';
import makeOPDSPortal, { makeOPDSSite } from '../lib/opds/index';
import { makeOPDSOther } from '../lib/opds/other';
import { OPDSV1 } from 'opds-extra';
import { makeOPDSType } from '../lib/site/demonovel/opds';
import { filterOPDSBook, addOpenSearch } from '../lib/opds/search';
import Bluebird from 'bluebird';
import { showClient } from './util/showClient';
import console from 'debug-color2/logger';
import app from './index';

function searchHandler()
{
	const router = Router();

	router.use('/*', (req, res, next) => {
		console.log(req.method, req.baseUrl, req.url, req.params, req.query);
		showClient(req, res, next);
		next();
	});

	router.use('/:siteID/:searchTerms', async (req, res) =>
	{
		let { siteID, searchTerms } = req.params;
		// @ts-ignore
		let feed: OPDSV1.Feed;
		let onlyBook: boolean;

		if (!siteID || siteID === 'all')
		{
			feed = await makeOPDSType('all')

			feed.books = await Bluebird
				.resolve(Object.keys(builded_map) as ISiteIDs[])
				.reduce(async (books, siteID) => {

					let feed2 = await makeOPDSSite(siteID as any);

					books.push(...feed2.books);

					return books;
				}, feed.books)
			;

			let feed2 = await makeOPDSOther();
			feed.books.push(...feed2.books);

			onlyBook = true;

			feed.links = feed.links || [];
			feed.links = feed.links.filter(entry => entry.rel != 'search');

			feed = await addOpenSearch(feed, 'all');
		}
		else if (siteID === 'demonovel')
		{
			feed = await makeOPDSType('all')
		}
		else if (siteID === 'other')
		{
			feed = await makeOPDSOther()
		}
		else
		{
			feed = await makeOPDSSite(siteID as any);
		}

		if (searchTerms)
		{
			feed = await filterOPDSBook(feed, {
				searchTerms,
				onlyBook,
			});
		}

		res.setHeader('Content-Type', 'application/xml');
		res.send(feed.toXML())
	});

	router.use('/:siteID.xml', async (req, res) =>
	{

		res.setHeader('Content-Type', 'application/xml');
		res.send(`<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <!--<ShortName>Web Search</ShortName>
  <Description>Use Example.com to search the Web.</Description>
  <Tags>example web</Tags>
  <Contact>admin@example.com</Contact>   
  TODO: 這裡應該可以做點別的, 摘抄自OpenSearch的定義
  http://www.opensearch.org/Specifications/OpenSearch/1.1 
  --> 
    <Url type="application/atom+xml;profile=opds-catalog;kind=acquisition"
     template="/search/${req.params.siteID}/{searchTerms}" />
<!--
  <LongName>Example.com Web Search</LongName>
  <Image height="64" width="64" type="image/png">http://example.com/websearch.png</Image>
  <Image height="16" width="16" type="image/vnd.microsoft.icon">http://example.com/websearch.ico</Image>
  <Query role="example" searchTerms="cat" />
  <Developer>Example.com Development Team</Developer>
  <Attribution>
    Search data Copyright 2005, Example.com, Inc., All Rights Reserved
  </Attribution>
  <SyndicationRight>open</SyndicationRight>
  <AdultContent>false</AdultContent>
  <Language>en-us</Language>
    example說能放更多奇怪的東西進去, 這邊不需要
  --> 
  <OutputEncoding>UTF-8</OutputEncoding>
  <InputEncoding>UTF-8</InputEncoding>
</OpenSearchDescription>`)
	});

	return router
}

export default searchHandler
